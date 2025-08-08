# RTK Query Implementation

This document outlines the complete implementation of Redux Toolkit Query (RTK Query) for the YashTiles project, replacing all fetch calls with proper RTK Query endpoints.

## Overview

The implementation includes:
- Custom baseQuery with automatic token refresh
- Comprehensive API endpoints for all services
- Proper error handling and authentication
- FormData support for file uploads
- Automatic cache invalidation

## File Structure

```
src/redux/
├── api/
│   ├── apiSlice.ts          # Main API slice with custom baseQuery
│   ├── authApi.ts           # Authentication endpoints
│   ├── ordersApi.ts         # User orders endpoints
│   ├── adminOrdersApi.ts    # Admin orders endpoints
│   ├── checkoutApi.ts       # Checkout and payment endpoints
│   ├── contactApi.ts        # Contact and newsletter endpoints
│   └── index.ts             # Export all API endpoints
├── slices/
│   ├── authSlice.ts         # Auth state management
│   ├── uiSlice.ts           # UI state management
│   └── frameCustomizerSlice.ts # Existing frame customizer
└── store.ts                 # Redux store configuration
```

## Custom BaseQuery Implementation

### Features
- **Automatic Token Refresh**: Handles 401 errors by attempting to refresh the access token
- **Cookie Support**: Includes cookies for refresh token authentication
- **FormData Support**: Properly handles file uploads without setting Content-Type header
- **Error Handling**: Comprehensive error handling with custom error types

### Implementation Details

```typescript
// Custom baseQuery with reauth functionality
const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  credentials: 'include', // Include cookies for refresh token
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Add authorization header if token exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Only set Content-Type for non-FormData requests
    const isFormData = getState && typeof getState === 'function' && 
      (getState() as any)?.body instanceof FormData;
    
    if (!isFormData) {
      headers.set('Content-Type', 'application/json');
    }
    
    return headers;
  },
});
```

### Token Refresh Logic

```typescript
// If we get a 401 and have a refresh token, try to refresh
if (result.error && 'status' in result.error && result.error.status === 401) {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  
  if (refreshToken) {
    // Try to refresh the token
    const refreshResult = await baseQuery({
      url: '/api/v1/auth/refresh',
      method: 'POST',
      credentials: 'include',
    }, api, extraOptions);

    if (refreshResult.data) {
      // Store the new access token
      const newToken = (refreshResult.data as any).accessToken;
      if (typeof window !== 'undefined' && newToken) {
        localStorage.setItem('accessToken', newToken);
      }

      // Retry the original request with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clear tokens and dispatch logout action
      api.dispatch(logout());
      api.dispatch(openLoginDialog());
    }
  }
}
```

## API Endpoints

### Authentication API (`authApi.ts`)

```typescript
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User; tokens: AuthTokens }, LoginData>({
      query: (credentials) => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<{ message: string; user: User }, RegisterData>({
      query: (userData) => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // ... other auth endpoints
  }),
});
```

### Orders API (`ordersApi.ts`)

```typescript
export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, PaginationParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        
        const queryString = searchParams.toString();
        return `/api/v1/orders${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({ type: 'Orders' as const, id: _id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),
  }),
});
```

### Admin Orders API (`adminOrdersApi.ts`)

```typescript
export const adminOrdersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrdersResponse, PaginationParams>({
      query: (params) => `/api/v1/admin/orders${queryString}`,
      providesTags: (result) => [
        ...result.orders.map(({ _id }) => ({ type: 'AdminOrders' as const, id: _id })),
        { type: 'AdminOrders', id: 'LIST' },
      ],
    }),
    
    updateOrderStatus: builder.mutation<Order, { orderId: string; status: string }>({
      query: ({ orderId, status }) => ({
        url: `/api/v1/admin/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'AdminOrders', id: orderId },
        { type: 'AdminOrders', id: 'LIST' },
        { type: 'Orders', id: orderId },
        { type: 'Orders', id: 'LIST' },
      ],
    }),
  }),
});
```

### Checkout API (`checkoutApi.ts`)

```typescript
export const checkoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    processCheckout: builder.mutation<CheckoutResponse, CheckoutData>({
      query: (checkoutData) => ({
        url: '/api/v1/checkout',
        method: 'POST',
        body: checkoutData,
      }),
      invalidatesTags: ['Orders'],
    }),
    
    // FormData support for payment endpoints
    initiatePayment: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/api/v1/payments/payu/initiate',
        method: 'POST',
        body: formData,
        prepareHeaders: (headers) => {
          headers.delete('Content-Type'); // Let browser set for FormData
          return headers;
        },
      }),
    }),
  }),
});
```

## Updated Hooks

### useCheckout Hook

```typescript
export const useCheckout = () => {
  const [processCheckout, { isLoading, error }] = useProcessCheckoutMutation();

  const processCheckoutAsync = async (checkoutData: CheckoutData): Promise<CheckoutResponse> => {
    try {
      const result = await processCheckout(checkoutData).unwrap();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      throw new Error(errorMessage);
    }
  };

  return {
    processCheckout: processCheckoutAsync,
    isLoading,
    error: error ? (error as any).data?.message || 'Checkout failed' : null,
    clearError: () => {}, // RTK Query handles error clearing automatically
  };
};
```

### useOrders Hook

```typescript
export const useOrders = (params: PaginationParams = {}) => {
  const { data, isLoading, error, refetch } = useGetOrdersQuery(params);

  return {
    orders: data?.orders || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading,
    error: error ? (error as any).data?.message || 'Failed to fetch orders' : null,
    refetch,
  };
};
```

### useAdminOrders Hook

```typescript
export const useAdminOrders = (params: PaginationParams = { page: 1, limit: 25 }) => {
  const { data, isLoading, error, refetch } = useGetAllOrdersQuery(params);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updateOrderTracking] = useUpdateOrderTrackingMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const updateOrder = async (orderId: string, data: { status?: string; trackingNumber?: string }) => {
    try {
      if (data.status) {
        await updateOrderStatus({ orderId, status: data.status }).unwrap();
      }
      if (data.trackingNumber) {
        await updateOrderTracking({ orderId, trackingNumber: data.trackingNumber }).unwrap();
      }
      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update order");
    }
  };

  return {
    orders: data?.orders || [],
    pagination: data?.pagination || { /* default pagination */ },
    loading: isLoading,
    error: error ? (error as any).data?.message || 'Failed to fetch orders' : null,
    updateOrder,
    // ... other methods
  };
};
```

## Updated Components

### ContactForm Component

```typescript
export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitContactInquiry, { isLoading }] = useSubmitContactInquiryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitContactInquiry(formData).unwrap();
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
```

### NewsletterForm Component

```typescript
export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribeNewsletter, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await subscribeNewsletter({ email }).unwrap();
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
}
```

## Redux Store Configuration

```typescript
export const store = configureStore({
  reducer: {
    frameCustomizer: frameCustomizerReducer,
    auth: authReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
```

## Benefits of This Implementation

1. **Automatic Caching**: RTK Query provides automatic caching and cache invalidation
2. **Loading States**: Built-in loading states for all API calls
3. **Error Handling**: Comprehensive error handling with automatic retries
4. **Type Safety**: Full TypeScript support with proper type inference
5. **Optimistic Updates**: Support for optimistic updates where needed
6. **Automatic Re-fetching**: Automatic re-fetching when data becomes stale
7. **Token Management**: Automatic token refresh and logout handling
8. **FormData Support**: Proper handling of file uploads and FormData
9. **Redux Integration**: Seamless integration with Redux store and actions

## Migration Guide

### Before (fetch calls)
```typescript
const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});
const data = await response.json();
```

### After (RTK Query)
```typescript
const { data, isLoading, error } = useGetOrdersQuery();
```

### Before (manual error handling)
```typescript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Request failed');
  }
  return await response.json();
} catch (error) {
  // Manual error handling
}
```

### After (RTK Query)
```typescript
const [mutate, { isLoading, error }] = useMutation();
// Error handling is automatic and consistent
```

## Usage Examples

### Using Queries
```typescript
function OrdersList() {
  const { data: orders, isLoading, error } = useGetOrdersQuery({ page: 1, limit: 10 });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {orders?.orders.map(order => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
```

### Using Mutations
```typescript
function LoginForm() {
  const [login, { isLoading }] = useLoginMutation();
  
  const handleSubmit = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      // Handle successful login
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

This implementation provides a robust, type-safe, and efficient way to handle all API calls in the YashTiles project with automatic caching, error handling, and authentication management.
