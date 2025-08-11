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

    return headers;
  },
});

// Custom base query wrapper to handle FormData detection
const baseQueryWithFormDataHandling = async (args: string | FetchArgs, api: any, extraOptions: any) => {
  // Check if the request body is FormData
  let isFormData = false;
  if (typeof args === 'object' && args.body instanceof FormData) {
    isFormData = true;
    console.log('=== API Slice Debug ===');
    console.log('FormData detected in apiSlice:', true);
    console.log('Not setting Content-Type header for FormData');
  }

  // If it's FormData, don't set Content-Type (let browser handle it)
  // If it's not FormData, set Content-Type to application/json
  if (typeof args === 'object' && !isFormData) {
    console.log('=== API Slice Debug ===');
    console.log('JSON data detected in apiSlice, setting Content-Type');
    args.headers = {
      'Content-Type': 'application/json',
      ...args.headers,
    };
  }

  return baseQuery(args, api, extraOptions);
};

// Custom base query with reauth
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError | CustomError
> = async (args, api, extraOptions) => {
  let result = await baseQueryWithFormDataHandling(args, api, extraOptions);

  // If we get a 401, try to refresh the token using cookies
  if (result.error && "status" in result.error && result.error.status === 401) {
    // Try to refresh the token using cookies (refresh token is HTTP-only)
    const refreshResult = await baseQueryWithFormDataHandling(
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
      result = await baseQueryWithFormDataHandling(args, api, extraOptions);
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
