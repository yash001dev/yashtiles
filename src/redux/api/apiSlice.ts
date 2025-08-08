import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { config } from "@/lib/config";
import { logout } from "../slices/authSlice";
import { openLoginDialog } from "../slices/uiSlice";

// Custom error type
interface CustomError {
  status: number;
  data: any;
  message?: string;
}

// Custom base query with reauth functionality
const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  credentials: "include", // Include cookies for refresh token
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Add authorization header if token exists
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    // Only set Content-Type for non-FormData requests
    // For FormData, let the browser set the Content-Type with boundary
    const isFormData =
      getState &&
      typeof getState === "function" &&
      (getState() as any)?.body instanceof FormData;

    if (!isFormData) {
      headers.set("Content-Type", "application/json");
    }

    return headers;
  },
});

// Custom base query with reauth
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | CustomError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token using cookies
  if (result.error && "status" in result.error && result.error.status === 401) {
    // Try to refresh the token using cookies (refresh token is HTTP-only)
    const refreshResult = await baseQuery(
      {
        url: "/api/v1/auth/refresh",
        method: "POST",
        credentials: "include", // Include cookies
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Store the new access token
      const newToken = (refreshResult.data as any).accessToken;
      if (typeof window !== "undefined" && newToken) {
        localStorage.setItem("accessToken", newToken);
      }

      // Retry the original request with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clear tokens and dispatch logout action
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }

      // Dispatch logout action and open login dialog
      api.dispatch(logout());
      api.dispatch(openLoginDialog());
    }
  }

  return result;
};

// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Orders", "User", "AdminOrders"],
  endpoints: () => ({}),
});

// Export the API slice
export default apiSlice;
