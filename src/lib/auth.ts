import {
  User,
  AuthTokens,
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyEmailData,
} from "@/types";
import {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useLogoutMutation,
} from "@/redux/api/authApi";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
    }
  }

  // Use RTK Query hooks instead of fetch
  async login(data: LoginData): Promise<{ user: User; tokens: AuthTokens }> {
    // This method is now deprecated - use useLoginMutation hook directly
    throw new Error("Use useLoginMutation hook instead of this method");
  }

  async register(data: RegisterData): Promise<{ message: string; user: User }> {
    // This method is now deprecated - use useRegisterMutation hook directly
    throw new Error("Use useRegisterMutation hook instead of this method");
  }

  async googleLogin(
    googleToken: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    // This method is now deprecated - use useGoogleLoginMutation hook directly
    throw new Error("Use useGoogleLoginMutation hook instead of this method");
  }

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    // This method is now deprecated - use useForgotPasswordMutation hook directly
    throw new Error(
      "Use useForgotPasswordMutation hook instead of this method"
    );
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    // This method is now deprecated - use useResetPasswordMutation hook directly
    throw new Error("Use useResetPasswordMutation hook instead of this method");
  }

  async verifyEmail(
    data: VerifyEmailData
  ): Promise<{ message: string; user: User; accessToken: string }> {
    // This method is now deprecated - use useVerifyEmailMutation hook directly
    throw new Error("Use useVerifyEmailMutation hook instead of this method");
  }

  async logout(): Promise<void> {
    // This method is now deprecated - use useLogoutMutation hook directly
    throw new Error("Use useLogoutMutation hook instead of this method");
  }

  async refreshTokens(): Promise<boolean> {
    // This method is now deprecated - use useRefreshTokenMutation hook directly
    throw new Error("Use useRefreshTokenMutation hook instead of this method");
  }

  // Utility methods that can still be used
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getStoredUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  updateStoredUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  private setTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem("refreshToken", tokens.refreshToken);
      }
    }
  }
}

// Export the service instance
export const authService = new AuthService();

// Export hooks for direct use
export {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useLogoutMutation,
};
