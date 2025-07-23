import { jwtDecode } from "jwt-decode";

// Authentication service to handle API calls
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  isEmailVerified?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}

export interface GoogleLoginData {
  accessToken: string;
}

interface GoogleJWTPayload {
  email: string;
  given_name: string;
  family_name: string;
  name: string;
  picture?: string;
  sub: string;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
}

// API base URL - this should come from environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Initialize tokens from localStorage if available
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
    }
  }

  // Store tokens in localStorage and memory
  private setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
  }

  // Clear tokens from localStorage and memory
  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  // Get access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Make authenticated API request
  private async apiRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${API_BASE_URL}/api/v1${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if we have an access token
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If we get a 401 and have a refresh token, try to refresh
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        // Retry the original request with new token
        headers.Authorization = `Bearer ${this.accessToken}`;
        return fetch(url, {
          ...options,
          headers,
        });
      }
    }

    return response;
  }

  // User registration
  async register(data: RegisterData): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    // The backend returns { message, user }
    const registerResponse = await response.json();
    // Only store user data, do not expect tokens
    if (registerResponse.user && typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(registerResponse.user));
    }
    return { user: registerResponse.user };
  }

  // User login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const responseData = await response.json();

    // Handle the actual backend response format: { user, accessToken }
    const tokens = {
      accessToken: responseData.accessToken,
      refreshToken: "", // Refresh token comes as HTTP-only cookie
    };

    this.setTokens(tokens);

    // Store user data
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(responseData.user));
    }

    return {
      user: responseData.user,
      tokens,
    };
  }

  // Refresh access token
  async refreshTokens(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.refreshToken}`,
        },
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const tokens: AuthTokens = await response.json();
      this.setTokens(tokens);
      return true;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  // User logout
  async logout(): Promise<void> {
    try {
      if (this.accessToken) {
        await this.apiRequest("/auth/logout", {
          method: "POST",
        });
      }
    } catch (error) {
      // Ignore logout errors, just clear tokens
      console.error("Logout error:", error);
    } finally {
      this.clearTokens();
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send reset email");
    }

    return response.json();
  }

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Password reset failed");
    }

    return response.json();
  }

  // Verify email
  async verifyEmail(email: string, token: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for refresh token
      body: JSON.stringify({ email, token }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Email verification failed");
    }

    const data = await response.json();

    // Store access token and user data
    this.setTokens({
      accessToken: data.accessToken,
      refreshToken: "", // Refresh token comes as HTTP-only cookie
    });
    this.updateStoredUser(data.user);

    return {
      user: data.user,
      tokens: { accessToken: data.accessToken, refreshToken: "" },
    };
  }

  // Get stored user data
  getStoredUser(): User | null {
    if (typeof window === "undefined") {
      return null;
    }

    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  // Update stored user data
  updateStoredUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  // Google login
  async googleLogin(googleCredential: string): Promise<AuthResponse> {
    try {
      // Decode the JWT token to extract user information
      const decodedToken = jwtDecode<GoogleJWTPayload>(googleCredential);

      console.log("Decoded Google token:", decodedToken);

      const payload = {
        accessToken: googleCredential,
        email: decodedToken.email,
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
      };

      console.log("Sending payload to backend:", payload);

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/google/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for refresh token
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Google login failed");
      }

      const data = await response.json();

      // The backend returns { user, accessToken } format for Google login
      this.setTokens({
        accessToken: data.accessToken,
        refreshToken: "", // Refresh token comes as HTTP-only cookie
      });

      // Store user data
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return {
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: "", // Refresh token comes as HTTP-only cookie
        },
      };
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }

  // Get Google OAuth URL for redirect flow
  getGoogleAuthUrl(): string {
    return `${API_BASE_URL}/api/v1/auth/google`;
  }
}

// Create a singleton instance
export const authService = new AuthService();
