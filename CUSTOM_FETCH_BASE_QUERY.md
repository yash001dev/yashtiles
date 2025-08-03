# Custom Fetch Base Query Implementation

This document explains the custom fetch base query implementation with enhanced refresh token logic and proper error handling.

## 🚀 Overview

The custom fetch base query provides:
- **Automatic token refresh** on 401 Unauthorized responses
- **Automatic logout** if refresh fails or retry fails
- **Comprehensive error handling** for different HTTP status codes
- **Proper logging** for debugging and monitoring
- **Type-safe implementation** with TypeScript

## 📁 File Structure

```
src/redux/api/
├── apiSlice.ts                    # Main API slice using enhanced fetch base query
├── customFetchBaseQuery.ts        # Basic custom fetch base query
├── advancedFetchBaseQuery.ts      # Advanced fetch base query with comprehensive error handling
├── authApi.ts                     # Authentication endpoints
├── ordersApi.ts                   # Orders endpoints
├── adminOrdersApi.ts              # Admin orders endpoints
└── aiApi.ts                       # AI endpoints
```

## 🔧 Implementation Details

### 1. **Basic Custom Fetch Base Query** (`customFetchBaseQuery.ts`)

```typescript
export const customFetchBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await authService.refreshTokens();
    
    if (refreshResult) {
      // Retry original request
      result = await baseQuery(args, api, extraOptions);
      
      // If retry fails, logout
      if (result.error && result.error.status === 401) {
        await authService.logout();
        return { error: { status: 401, data: { message: "Session expired" } } };
      }
    } else {
      // Refresh failed, logout
      await authService.logout();
      return { error: { status: 401, data: { message: "Session expired" } } };
    }
  }

  return result;
};
```

### 2. **Enhanced Fetch Base Query** (`advancedFetchBaseQuery.ts`)

The enhanced version includes:
- **Better error handling** for different HTTP status codes
- **Comprehensive logging** for debugging
- **Proper error messages** for different scenarios
- **Type-safe error responses**

```typescript
export const enhancedFetchBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized with enhanced logic
  if (result.error && result.error.status === 401) {
    console.log("401 Unauthorized - attempting token refresh...");
    
    try {
      const refreshResult = await authService.refreshTokens();
      
      if (refreshResult) {
        console.log("Token refresh successful - retrying original request");
        result = await baseQuery(args, api, extraOptions);
        
        if (result.error && result.error.status === 401) {
          console.log("Retry failed with 401 - logging out user");
          await authService.logout();
          return {
            error: {
              status: 401,
              data: { message: "Session expired. Please log in again." }
            }
          };
        }
      } else {
        console.log("Token refresh failed - logging out user");
        await authService.logout();
        return {
          error: {
            status: 401,
            data: { message: "Session expired. Please log in again." }
          }
        };
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      await authService.logout();
      return {
        error: {
          status: 401,
          data: { message: "Session expired. Please log in again." }
        }
      };
    }
  }

  // Handle other error statuses
  if (result.error) {
    console.error("API Error:", result.error);
    
    switch (result.error.status) {
      case 403:
        console.log("403 Forbidden - user doesn't have permission");
        break;
      case 404:
        console.log("404 Not Found - resource not found");
        break;
      case 500:
        console.log("500 Internal Server Error - server error");
        break;
      default:
        console.log(`HTTP ${result.error.status} - ${result.error.data?.message || 'Unknown error'}`);
    }
  }

  return result;
};
```

## 🔄 Flow Diagram

```
API Request
    ↓
Add Auth Token
    ↓
Make Request
    ↓
Check Response
    ↓
Is 401? → Yes → Try Refresh Token
    ↓                    ↓
    No              Success? → Yes → Retry Request
    ↓                    ↓
Return Result         No → Logout
    ↓
Handle Other Errors
    ↓
Return Result/Error
```

## 🎯 Key Features

### **1. Automatic Token Refresh**
- Detects 401 Unauthorized responses
- Automatically attempts to refresh the access token
- Retries the original request with the new token

### **2. Automatic Logout**
- Logs out user if refresh token fails
- Logs out user if retry with new token fails
- Clears all authentication data

### **3. Comprehensive Error Handling**
- Handles different HTTP status codes (403, 404, 500, etc.)
- Provides meaningful error messages
- Logs errors for debugging

### **4. Type Safety**
- Full TypeScript support
- Proper error typing
- IntelliSense support

### **5. Debugging Support**
- Console logging for all major events
- Error tracking and monitoring
- Clear error messages

## 🚀 Usage

### **In API Slices**

```typescript
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginData>({
      query: (credentials) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});
```

### **In Components**

```typescript
import { useLoginMutation } from '@/redux/api/authApi';

const LoginForm = () => {
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      // Handle success
    } catch (error) {
      // Handle error - the custom fetch base query handles 401s automatically
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
    </form>
  );
};
```

## 🔧 Configuration

### **Environment Variables**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### **Base Query Configuration**
```typescript
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  prepareHeaders: (headers) => {
    const token = authService.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});
```

### **Token Validation Configuration**
The validate token endpoint expects the token as a query parameter:
```typescript
// In authApi.ts
validateToken: builder.query<{ valid: boolean }, void>({
  query: () => {
    const token = authService.getAccessToken();
    return `/api/v1/auth/validate?token=${encodeURIComponent(token || '')}`;
  },
  providesTags: ["User"],
}),
```

// In auth.ts (AuthService)
async validateToken(): Promise<boolean> {
  if (!this.accessToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/validate?token=${encodeURIComponent(this.accessToken)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.isValid === true;
  } catch (error) {
    return false;
  }
}
```

## 📊 Benefits

### **1. Automatic Authentication Management**
- No need to manually handle token refresh
- Automatic logout on authentication failure
- Seamless user experience

### **2. Better Error Handling**
- Consistent error handling across the app
- Meaningful error messages
- Proper error logging

### **3. Developer Experience**
- Type-safe implementation
- Clear error messages
- Easy debugging with console logs

### **4. User Experience**
- Automatic session management
- No manual logout required
- Seamless authentication flow

## 🐛 Troubleshooting

### **Common Issues**

1. **Token not being sent**
   - Check if `authService.getAccessToken()` returns a valid token
   - Verify token is stored in localStorage

2. **Refresh token not working**
   - Check if refresh token exists
   - Verify refresh token endpoint is working
   - Check network requests in browser dev tools

3. **Logout not happening**
   - Verify `authService.logout()` implementation
   - Check if logout clears all tokens
   - Verify Redux store is updated

### **Debugging**

1. **Check Console Logs**
   - All major events are logged
   - Error details are logged
   - Token refresh attempts are logged

2. **Check Network Tab**
   - Verify requests include Authorization header
   - Check response status codes
   - Verify refresh token requests

3. **Check Redux DevTools**
   - Monitor API calls
   - Check error states
   - Verify cache invalidation

## 📚 Additional Resources

- [RTK Query Base Query](https://redux-toolkit.js.org/rtk-query/api/createApi#basequery)
- [Fetch Base Query](https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery)
- [Error Handling](https://redux-toolkit.js.org/rtk-query/usage/error-handling) 