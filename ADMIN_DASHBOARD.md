# Admin Dashboard Documentation

This document provides an overview of the admin dashboard functionality for YashTiles order management.

## Overview

The admin dashboard provides comprehensive order management capabilities including:

- **Order Listing & Search**: Advanced search with multiple filters
- **Bulk Operations**: Update multiple orders simultaneously  
- **Single Order Management**: Detailed order editing
- **Status Tracking**: Real-time order status updates
- **Export Functionality**: CSV export of order data

## Features

### 1. Dashboard Overview
- Real-time statistics (total orders, pending, revenue, customers)
- Quick action cards for common tasks
- Responsive design with sidebar navigation

### 2. Order Management

#### Advanced Search & Filtering
- Search by order number, customer email, name, or phone
- Filter by order status, payment status, date range
- Filter by tracking number or amount range
- Pagination with configurable results per page

#### Bulk Operations
- Select multiple orders using checkboxes
- Quick status updates (Confirm, Process, Ship, Deliver)
- Advanced bulk editing with custom values
- Bulk tracking number assignment

#### Single Order Editing
- Complete order details in modal dialog
- Edit all order fields including:
  - Order status and payment status
  - Customer shipping address
  - Order items (quantity, price, size, etc.)
  - Payment information
  - Tracking and delivery details

### 3. User Interface

#### Order List View
- Responsive table with key order information
- Status badges and payment status indicators
- Quick action buttons for status updates
- Selection checkboxes for bulk operations

#### Order Detail Modal
- Tabbed interface (Overview, Items, Shipping, Payment)
- Form validation and error handling
- Status history tracking
- Save/cancel functionality

#### Filters Panel
- Collapsible filter interface
- Real-time filter application
- Clear all filters option
- Active filter indicators

## API Integration

The dashboard integrates with the following admin APIs:

### Search Orders API
```
GET /api/v1/orders/admin/search
```
- Multi-criteria search with pagination
- Supports partial text matching
- Date range and amount filtering

### Update Single Order API
```
PUT /api/v1/orders/:id
```
- Update any order field
- Nested object updates (address, items)
- Automatic status history tracking

### Bulk Update Orders API
```
PUT /api/v1/orders/bulk-update
```
- Update multiple orders simultaneously
- Supports status, payment status, tracking updates
- Returns success/failure counts

## Components Structure

```
src/components/admin/
├── AdminOrdersDashboard.tsx    # Main dashboard component
├── AdminOrdersList.tsx         # Order list table
├── AdminOrderFilters.tsx       # Search & filter panel
├── AdminBulkActions.tsx        # Bulk operation controls
├── AdminOrderModal.tsx         # Order detail editor
└── AdminLayout.tsx             # Admin panel layout

src/hooks/
└── useAdminOrders.ts           # Custom hook for order operations

src/lib/
└── admin-orders.ts             # API service layer
```

## Usage

### Accessing the Admin Dashboard
1. Navigate to `/admin` (requires admin authentication)
2. Use sidebar navigation to access different sections
3. Click "Orders" to access the order management dashboard

### Managing Orders

#### Searching Orders
1. Use the search bar for quick text searches
2. Click "Filters" to access advanced filtering
3. Apply multiple filters and click "Apply Filters"
4. Use "Clear All" to reset filters

#### Bulk Operations
1. Select orders using checkboxes in the table
2. Use quick action buttons for common status updates
3. Click "Show Advanced Options" for custom bulk updates
4. Apply changes to all selected orders

#### Editing Individual Orders
1. Click the eye icon or order row to open details
2. Use tabs to navigate different sections
3. Edit any field as needed
4. Click "Save Changes" to update

### Export Data
- Click "Export" button to download CSV file
- Includes all currently filtered orders
- Contains key order information for analysis

## Security

- Admin authentication required
- Role-based access control
- JWT token validation
- Protected API endpoints

## Error Handling

- Network error recovery
- Validation error display
- Loading states for all operations
- Graceful fallbacks for failed operations

## Performance

- Debounced search input (500ms delay)
- Paginated results (default 25 per page)
- Efficient API calls with proper caching
- Responsive design for all screen sizes

## Future Enhancements

- Real-time order updates via WebSocket
- Advanced analytics dashboard
- Automated order processing rules
- Enhanced reporting capabilities
- Mobile app for order management
