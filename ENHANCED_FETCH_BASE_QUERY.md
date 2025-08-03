# Enhanced Fetch Base Query

## Overview

The `enhancedFetchBaseQuery` is a custom base query for RTK Query that automatically handles unauthorized (401) responses by validating tokens and refreshing them when needed.

## Features

### Automatic Token Management
- Automatically adds authorization headers to requests when access token is available
- Handles 401 Unauthorized responses intelligently
- Prevents multiple simultaneous refresh attempts

### Token Refresh Flow
1. **Initial Request**: Makes the original API request with current access token
2. **401 Detection**: If response is 401 Unauthorized, triggers token refresh
3. **Refresh Attempt**: Attempts to refresh the access token using refresh token
4. **Retry Logic**: If refresh succeeds, retries the original request with new token
5. **Logout on Failure**: If refresh fails or still gets 401, automatically logs out user

### Concurrency Handling
- Uses global flags to prevent multiple simultaneous refresh attempts
- If a refresh is already in progress, other requests wait for it to complete
- Ensures only one refresh operation happens at a time

## Implementation Details

### File Location
```
src/redux/api/advancedFetchBaseQuery.ts
```

### Key Components

1. **Global State Management**:
   ```typescript
   let isRefreshing = false;
   let refreshPromise: Promise<boolean> | null = null;
   ```

2. **Base Query Configuration**:
   ```typescript
   const baseQuery = fetchBaseQuery({
     baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
     credentials: 'include',
     prepareHeaders: (headers) => {
       const token = authService.getAccessToken();
       if (token) {
         headers.set('authorization', `Bearer ${token}`);
       }
       return headers;
     },
   });
   ```

3. **401 Handling Logic**:
   - Checks if response status is 401
   - If already refreshing, waits for completion
   - Otherwise, starts new refresh process
   - Retries original request after successful refresh
   - Logs out user if refresh fails

## Usage

The enhanced fetch base query is automatically used by all RTK Query endpoints through the `apiSlice`:

```typescript
// src/redux/api/apiSlice.ts
import { enhancedFetchBaseQuery } from "./advancedFetchBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: enhancedFetchBaseQuery,
  tagTypes: ["Orders", "Order", "User", "AI"],
  endpoints: () => ({}),
});
```

## Integration with Auth Service

The enhanced fetch base query integrates with the existing `authService` from `src/lib/auth.ts`:

- **Token Access**: Uses `authService.getAccessToken()` to get current token
- **Token Refresh**: Uses `authService.refreshTokens()` to refresh tokens
- **Logout**: Uses `authService.logout()` to clear tokens and user data

## Error Handling

When token refresh fails or continues to receive 401 responses:

1. **Automatic Logout**: Clears all tokens and user data
2. **Error Response**: Returns structured error with 401 status
3. **User Notification**: Error message "Session expired. Please log in again."

## Benefits

1. **Seamless UX**: Users don't need to manually log in when tokens expire
2. **Automatic Recovery**: Handles token refresh transparently
3. **Concurrency Safe**: Prevents multiple refresh attempts
4. **Graceful Degradation**: Logs out user when refresh fails
5. **Centralized Logic**: All API calls benefit from this enhancement

## Debugging

The implementation includes console logs for debugging:

- `"Received 401, attempting token refresh..."`
- `"Token refresh already in progress, waiting..."`
- `"Token refreshed successfully, retrying original request..."`
- `"Token refresh failed or still getting 401, logging out..."`

These logs help track the token refresh flow during development. 