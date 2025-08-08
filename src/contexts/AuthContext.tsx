'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { User } from '../types';
import { useNotifications } from './NotificationContext';
import { 
  useLoginMutation, 
  useRegisterMutation, 
  useGoogleLoginMutation, 
  useForgotPasswordMutation, 
  useResetPasswordMutation, 
  useVerifyEmailMutation, 
  useLogoutMutation
} from '@/redux/api/authApi';

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
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ message: string; user: User }>;
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
  
  // RTK Query hooks
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [googleLoginMutation] = useGoogleLoginMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [verifyEmailMutation] = useVerifyEmailMutation();
  const [logoutMutation] = useLogoutMutation();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        
        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
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
      const response = await loginMutation({ email, password }).unwrap();
      
      // Store access token (refresh token is in HTTP-only cookie)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
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
      const response = await registerMutation({ firstName, lastName, email, password }).unwrap();
      // Registration successful but user needs to verify email
      // Don't set authentication state yet - user is not fully authenticated
      dispatch({ type: 'AUTH_LOGOUT' }); // Clear any existing auth state
      return response; // Return the response so UI can show verification message
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    }
  };

  // Google login function
  const googleLogin = async (googleToken: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await googleLoginMutation({ googleToken }).unwrap();
      
      // Store access token (refresh token is in HTTP-only cookie)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', response.tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Google login failed' });
      throw error;
    }
  };

  // Logout function with notifications
  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout fails on server, clear local state
    } finally {
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    try {
      await forgotPasswordMutation({ email }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string, token: string, newPassword: string) => {
    try {
      await resetPasswordMutation({ email, token, newPassword }).unwrap();
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
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
