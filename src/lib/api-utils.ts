// Utility functions for API error handling and HTTP requests

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export class ApiErrorHandler {
  static handle(error: any): ApiError {
    const apiError: ApiError = new Error();

    if (error instanceof Response) {
      apiError.status = error.status;
      apiError.message = `HTTP ${error.status}: ${error.statusText}`;
    } else if (error?.response) {
      // Axios-style error
      apiError.status = error.response.status;
      apiError.message = error.response.data?.message || error.message;
      apiError.code = error.response.data?.code;
    } else if (error instanceof Error) {
      apiError.message = error.message;
    } else if (typeof error === 'string') {
      apiError.message = error;
    } else {
      apiError.message = 'An unknown error occurred';
    }

    return apiError;
  }

  static isAuthError(error: ApiError): boolean {
    return error.status === 401 || error.status === 403;
  }

  static isNetworkError(error: ApiError): boolean {
    return !error.status || error.message.includes('Network Error') || error.message.includes('fetch');
  }

  static getErrorMessage(error: ApiError): string {
    if (this.isNetworkError(error)) {
      return 'Network error. Please check your connection and try again.';
    }

    if (this.isAuthError(error)) {
      return 'Authentication required. Please sign in and try again.';
    }

    switch (error.status) {
      case 400:
        return error.message || 'Invalid request. Please check your input.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
}

// HTTP Client utility
export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // If JSON parsing fails, use the response text
        }

        const error: ApiError = new Error(errorData.message || response.statusText);
        error.status = response.status;
        error.code = errorData.code;
        throw error;
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  setAuthHeader(token: string | null) {
    if (token) {
      this.defaultHeaders.Authorization = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders.Authorization;
    }
  }
}

// Form validation utilities
export class FormValidator {
  static email(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static password(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static required(value: string): boolean {
    return value.trim().length > 0;
  }

  static phone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}

// Local storage utilities with error handling
export class StorageHelper {
  static setItem(key: string, value: any): boolean {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      }
    } catch (error) {
      console.error(`Failed to save to localStorage: ${key}`, error);
    }
    return false;
  }

  static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
    } catch (error) {
      console.error(`Failed to read from localStorage: ${key}`, error);
    }
    return defaultValue;
  }

  static removeItem(key: string): boolean {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.error(`Failed to remove from localStorage: ${key}`, error);
    }
    return false;
  }

  static clear(): boolean {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        return true;
      }
    } catch (error) {
      console.error('Failed to clear localStorage', error);
    }
    return false;
  }
}
