import { apiSlice } from "./apiSlice";
import {
  User,
  AuthResponse,
  RegisterData,
  LoginData,
  ForgotPasswordData,
  ResetPasswordData,
} from "../../lib/auth";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<AuthResponse, LoginData>({
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
    googleLogin: builder.mutation<AuthResponse, { accessToken: string }>({
      query: (googleData) => ({
        url: "/api/v1/auth/google/login",
        method: "POST",
        body: googleData,
        credentials: "include",
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
      AuthResponse,
      { email: string; token: string }
    >({
      query: (data) => ({
        url: "/api/v1/auth/verify-email",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User", "Orders", "Order"],
    }),

    // Refresh Token
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/api/v1/auth/refresh",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    // Get Current User
    getCurrentUser: builder.query<User, void>({
      query: () => "/api/v1/auth/me",
      providesTags: ["User"],
    }),

    // Update Profile
    updateProfile: builder.mutation<
      { message: string; user: User },
      Partial<User>
    >({
      query: (userData) => ({
        url: "/api/v1/auth/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Change Password
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (passwordData) => ({
        url: "/api/v1/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),

    // Delete Account
    deleteAccount: builder.mutation<{ message: string }, { password: string }>({
      query: (data) => ({
        url: "/api/v1/auth/delete-account",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User", "Orders", "Order"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = authApi;
