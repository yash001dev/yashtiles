import { apiSlice } from "./apiSlice";
import {
  User,
  AuthTokens,
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
  GoogleLoginData,
  LoginResponse,
} from "@/types";

// Auth API endpoints
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<LoginResponse, LoginData>({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Register
    register: builder.mutation<{ message: string; user: User }, RegisterData>({
      query: (userData) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // Google Login
    googleLogin: builder.mutation<
      { user: User; tokens: AuthTokens },
      GoogleLoginData
    >({
      query: (googleToken) => ({
        url: "/api/v1/auth/google/login",
        method: "POST",
        body: { googleToken },
      }),
      invalidatesTags: ["User"],
    }),

    // Forgot Password
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordData>({
      query: (data) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<{ message: string }, ResetPasswordData>({
      query: (data) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Verify Email
    verifyEmail: builder.mutation<
      { message: string; user: User; accessToken: string },
      VerifyEmailData
    >({
      query: (data) => ({
        url: "/api/v1/auth/verify-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Refresh Token
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/api/v1/auth/refresh",
        method: "POST",
        credentials: "include",
      }),
    }),

    // Logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["User", "Orders", "AdminOrders"],
    }),
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
