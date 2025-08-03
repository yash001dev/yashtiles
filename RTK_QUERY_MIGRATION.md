# RTK Query Migration Guide

This document explains how to migrate from the current API calls to RTK Query for better caching, error handling, and maintainability.

## 🚀 What is RTK Query?

RTK Query is a powerful data fetching and caching tool included in Redux Toolkit. It provides:

- **Automatic caching** - Data is cached and shared across components
- **Background refetching** - Data stays fresh automatically
- **Optimistic updates** - UI updates immediately while API calls happen in background
- **Error handling** - Built-in error states and retry logic
- **Loading states** - Automatic loading indicators
- **TypeScript support** - Full type safety

## 📁 File Structure

```
src/
├── redux/
│   ├── api/
│   │   ├── apiSlice.ts          # Base API configuration
│   │   ├── authApi.ts           # Authentication endpoints
│   │   ├── ordersApi.ts         # Orders endpoints
│   │   ├── adminOrdersApi.ts    # Admin orders endpoints
│   │   └── aiApi.ts             # AI endpoints
│   ├── store.ts                 # Redux store with RTK Query
│   └── hooks.ts                 # Typed Redux hooks
├── hooks/
│   ├── useOrdersRTK.ts          # RTK Query orders hook
│   ├── useAdminOrdersRTK.ts     # RTK Query admin orders hook
│   └── useCheckoutRTK.ts        # RTK Query checkout hook
└── components/
    └── OrdersListRTK.tsx        # Example component using RTK Query
```

## 🔄 Migration Examples

### 1. Authentication

**Before (using authService):**
```typescript
import { authService } from '@/lib/auth';

const login = async (email: string, password: string) => {
  try {
    const response = await authService.login({ email, password });
    // Handle response
  } catch (error) {
    // Handle error
  }
};
```

**After (using RTK Query):**
```typescript
import { useLoginMutation } from '@/redux/api/authApi';

const MyComponent = () => {
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <button 
      onClick={() => handleLogin('user@example.com', 'password')}
      disabled={isLoading}
    >
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
};
```

### 2. Fetching Data

**Before (using custom hooks):**
```typescript
import { useOrders } from '@/hooks/useOrders';

const OrdersList = () => {
  const { orders, loading, error, refetch } = useOrders();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {orders.map(order => <OrderCard key={order._id} order={order} />)}
    </div>
  );
};
```

**After (using RTK Query):**
```typescript
import { useGetOrdersQuery } from '@/redux/api/ordersApi';

const OrdersList = () => {
  const { data, isLoading, error, refetch } = useGetOrdersQuery({ page: 1, limit: 10 });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any)?.data?.message}</div>;
  
  return (
    <div>
      {data?.orders.map(order => <OrderCard key={order._id} order={order} />)}
    </div>
  );
};
```

### 3. Mutations (Creating/Updating Data)

**Before:**
```typescript
import { authenticatedPost } from '@/lib/auth';

const createOrder = async (orderData) => {
  const response = await authenticatedPost('/checkout', orderData);
  const result = await response.json();
  return result;
};
```

**After:**
```typescript
import { useCreateCheckoutMutation } from '@/redux/api/ordersApi';

const CheckoutForm = () => {
  const [createCheckout, { isLoading, error }] = useCreateCheckoutMutation();

  const handleSubmit = async (formData) => {
    try {
      const result = await createCheckout(formData).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
};
```

## 🎯 Available Hooks

### Authentication
- `useLoginMutation()` - Login user
- `useRegisterMutation()` - Register user
- `useGoogleLoginMutation()` - Google OAuth login
- `useLogoutMutation()` - Logout user
- `useForgotPasswordMutation()` - Forgot password
- `useResetPasswordMutation()` - Reset password
- `useVerifyEmailMutation()` - Verify email
- `useValidateTokenQuery()` - Validate token

### Orders
- `useGetOrdersQuery(params)` - Get user orders
- `useGetOrderByIdQuery(orderId)` - Get specific order
- `useCreateCheckoutMutation()` - Create checkout

### Admin Orders
- `useSearchOrdersQuery(params)` - Search orders (admin)
- `useGetAllOrdersQuery(params)` - Get all orders (admin)
- `useGetOrderByIdQuery(orderId)` - Get order by ID (admin)
- `useUpdateOrderMutation()` - Update order
- `useBulkUpdateOrdersMutation()` - Bulk update orders

### AI
- `useGenerateImageMutation()` - Generate AI image

## 🔧 Configuration

### Base Query with Authentication
The base query automatically:
- Adds authentication headers
- Handles token refresh on 401 errors
- Logs out user if refresh fails

### Cache Invalidation
RTK Query automatically invalidates cache when:
- Orders are created/updated
- User logs in/out
- AI images are generated

## 📊 Benefits

1. **Automatic Caching**: Data is cached and shared across components
2. **Background Updates**: Data stays fresh without manual refetching
3. **Loading States**: Built-in loading indicators
4. **Error Handling**: Consistent error handling across the app
5. **TypeScript**: Full type safety
6. **DevTools**: Redux DevTools integration for debugging
7. **Optimistic Updates**: UI updates immediately while API calls happen

## 🚀 Getting Started

1. **Use the new hooks** instead of the old ones:
   ```typescript
   // Old
   import { useOrders } from '@/hooks/useOrders';
   
   // New
   import { useOrdersRTK } from '@/hooks/useOrdersRTK';
   ```

2. **Replace components** with RTK Query versions:
   ```typescript
   // Old
   import { OrdersList } from '@/components/OrdersList';
   
   // New
   import { OrdersListRTK } from '@/components/OrdersListRTK';
   ```

3. **Use mutations** for data changes:
   ```typescript
   const [updateOrder] = useUpdateOrderMutation();
   await updateOrder({ orderId, data }).unwrap();
   ```

## 🔄 Migration Checklist

- [ ] Replace `useOrders` with `useOrdersRTK`
- [ ] Replace `useAdminOrders` with `useAdminOrdersRTK`
- [ ] Replace `useCheckout` with `useCheckoutRTK`
- [ ] Update components to use RTK Query hooks
- [ ] Remove old API service files
- [ ] Update error handling to use RTK Query error format
- [ ] Test all functionality

## 🐛 Troubleshooting

### Common Issues

1. **Import errors**: Make sure paths are correct (use `@/` alias)
2. **Type errors**: Check that types match the API response
3. **Cache issues**: Use `refetch()` to force reload data
4. **Authentication**: Ensure Redux store is properly configured

### Debugging

Use Redux DevTools to:
- View API calls and responses
- Check cache state
- Debug authentication flow
- Monitor loading states

## 📚 Additional Resources

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Hooks](https://react-redux.js.org/api/hooks) 