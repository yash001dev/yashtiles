import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { authService } from "../../lib/auth";

// Global flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const enhancedFetchBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Create the base query with credentials included
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    credentials: "include",
    prepareHeaders: (headers) => {
      // Add authorization header if we have an access token
      const token = authService.getAccessToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  // Make the initial request
  let result = await baseQuery(args, api, extraOptions);

  // If the request was successful or not a 401, return the result
  if (result.meta?.response?.status !== 401) {
    return result;
  }

  // Handle 401 Unauthorized response
  console.log("Received 401, attempting token refresh...");

  // If we're already refreshing, wait for that to complete
  if (isRefreshing && refreshPromise) {
    console.log("Token refresh already in progress, waiting...");
    const refreshed = await refreshPromise;

    if (refreshed) {
      // Retry the original request with new token
      console.log("Token refreshed successfully, retrying original request...");
      result = await baseQuery(args, api, extraOptions);

      if (result.meta?.response?.status !== 401) {
        return result;
      }
    }

    // If still getting 401 after refresh, logout
    console.log("Token refresh failed or still getting 401, logging out...");
    await authService.logout();
    return {
      error: {
        status: 401,
        data: "Session expired. Please log in again.",
      },
    };
  }

  // Start refresh process
  isRefreshing = true;
  refreshPromise = authService.refreshTokens();

  try {
    const refreshed = await refreshPromise;

    if (refreshed) {
      // Retry the original request with new token
      console.log("Token refreshed successfully, retrying original request...");
      result = await baseQuery(args, api, extraOptions);

      if (result.meta?.response?.status !== 401) {
        return result;
      }
    }

    // If refresh failed or still getting 401, logout
    console.log("Token refresh failed or still getting 401, logging out...");
    await authService.logout();
    return {
      error: {
        status: 401,
        data: "Session expired. Please log in again.",
      },
    };
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }

  return result;
};
