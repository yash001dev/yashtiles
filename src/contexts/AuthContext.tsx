import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { authService, User, AuthTokens } from '../lib/auth';
import { useNotifications } from './NotificationContext';

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

// Auth context interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  googleLogin: (googleToken: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  updateUser: (user: User) => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            dispatch({ type: 'AUTH_SUCCESS', payload: storedUser });
          } else {
            // Access token exists but no user data, try to refresh
            const refreshed = await authService.refreshTokens();
            if (!refreshed) {
              dispatch({ type: 'AUTH_LOGOUT' });
            }
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR', payload: 'Failed to initialize authentication' });
      }
    };

    initializeAuth();
  }, []);

  // Login function with notifications
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login({ email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  // Register function with notifications
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.register({ firstName, lastName, email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  };

  // Google login function
  const googleLogin = async (googleToken: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.googleLogin(googleToken);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Google login failed' });
      throw error;
    }
  };

  // Logout function with notifications
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword({ email });
    } catch (error) {
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string, token: string, newPassword: string) => {
    try {
      await authService.resetPassword({ email, token, newPassword });
    } catch (error) {
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Update user function
  const updateUser = (user: User) => {
    authService.updateStoredUser(user);
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    googleLogin,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
