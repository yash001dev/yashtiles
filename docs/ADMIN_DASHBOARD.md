# Admin Dashboard Documentation

## Overview
The admin dashboard provides comprehensive order management capabilities for administrators. It includes advanced search, filtering, bulk operations, and detailed order editing features.

## Features

### 🔍 Advanced Search & Filtering
- **Global Search**: Search across order numbers, customer emails, and names
- **Multiple Filters**: 
  - Customer details (email, name, phone)
  - Order status and payment status
  - Date range filtering
  - Amount range filtering
  - Tracking number search
- **Real-time Search**: Debounced search with instant results

### 📊 Dashboard Statistics
- Total orders count
- Status-wise breakdown (Pending, Processing, Shipped, Delivered)
- Real-time updates

### 📋 Order Management
- **List View**: Comprehensive order list with pagination
- **Quick Actions**: One-click status updates
- **Selection**: Multi-select with bulk operations
- **Detailed View**: Full order details in modal

### ⚡ Bulk Operations
- **Quick Actions**: 
  - Mark as Confirmed
  - Mark as Processing  
  - Mark as Shipped
  - Mark as Delivered
- **Advanced Options**:
  - Update status
  - Update payment status
  - Add tracking numbers
  - Add notes to status history

### ✏️ Order Editing
- **Complete Order Details**: Edit all order fields
- **Tabbed Interface**: 
  - Overview (status, amounts, tracking)
  - Items (product details, quantities, prices)
  - Shipping (customer address)
  - Payment (payment info, delivery dates)
- **Status History**: View complete order timeline

### 📤 Export Functionality
- Export orders to CSV format
- Includes all relevant order information

## API Integration

The dashboard integrates with three main APIs:

### 1. Advanced Search API
```
GET /api/v1/orders/admin/search
```
- Multiple search parameters
- Pagination support
- Flexible filtering

### 2. Single Order Update API
```
PUT /api/v1/orders/:id
```
- Update any order field
- Automatic status history tracking
- Validation and error handling

### 3. Bulk Update API
```
PUT /api/v1/orders/bulk-update
```
- Update multiple orders simultaneously
- Status and tracking updates
- Batch processing with error reporting

## Technical Details

### Components Structure
```
src/components/admin/
├── AdminOrdersDashboard.tsx     # Main dashboard component
├── AdminOrdersList.tsx          # Orders table with actions
├── AdminOrderFilters.tsx        # Advanced filtering panel
├── AdminBulkActions.tsx         # Bulk operation controls
├── AdminOrderModal.tsx          # Detailed order editing
└── AdminLayout.tsx              # Admin panel layout
```

### Services
```
src/lib/admin-orders.ts          # API service layer
src/hooks/useAdminOrders.ts      # React hooks for state management
```

### Key Features
- **Data Cleaning**: Automatic removal of MongoDB `_id` fields before API calls
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Loading indicators for all async operations
- **Responsive Design**: Mobile-friendly interface
- **Type Safety**: Full TypeScript integration

## Usage

### Accessing the Dashboard
1. Admin authentication required
2. Navigate to `/admin/orders`
3. Protected route with role-based access

### Quick Start Guide
1. **Search Orders**: Use the search bar for quick lookups
2. **Apply Filters**: Click "Filters" to access advanced filtering
3. **Select Orders**: Check boxes to select multiple orders
4. **Bulk Actions**: Use the blue action bar for bulk operations
5. **Edit Order**: Click the eye icon to view/edit order details
6. **Export Data**: Click "Export" to download CSV

### Status Workflow
```
Pending → Confirmed → Processing → Shipped → Delivered
```

### Payment Status Options
- Pending
- Paid  
- Failed
- Refunded

## Security
- JWT authentication required
- Admin role verification
- Protected API endpoints
- Input validation and sanitization

## Performance
- Debounced search queries
- Pagination for large datasets
- Optimized API calls
- Efficient state management

## Error Handling
- API error display
- Validation error feedback
- Network error recovery
- User-friendly error messages

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- Progressive enhancement

---

*For technical support or feature requests, contact the development team.*
