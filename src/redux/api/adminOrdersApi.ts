import { apiSlice } from "@/redux/api/apiSlice";
import { Order, OrdersResponse, PaginationParams } from "@/types";

// Extended types for admin functionality
export interface SearchOrderParams extends PaginationParams {
  orderNumber?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
  trackingNumber?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface BulkUpdateOrderData {
  orderIds: string[];
  status?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface BulkUpdateResponse {
  updated: number;
  failed: string[];
}

export interface UpdateOrderData {
  status?: string;
  paymentStatus?: string;
  totalAmount?: number;
  shippingCost?: number;
  taxAmount?: number;
  paymentId?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items?: Array<{
    productId?: string;
    quantity?: number;
    price?: number;
    size?: string;
    frameType?: string;
    imageUrl?: string;
    notes?: string;
  }>;
  statusNotes?: string;
}

// Utility function to clean data by removing _id fields
export const cleanOrderDataForUpdate = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => cleanOrderDataForUpdate(item));
  }

  if (typeof data === "object" && data !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (key !== "_id") {
        cleaned[key] = cleanOrderDataForUpdate(value);
      }
    }
    return cleaned;
  }

  return data;
};

// Admin Orders API endpoints using RTK Query
export const adminOrdersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Advanced search for orders with multiple filters
    searchOrders: builder.query<OrdersResponse, SearchOrderParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        // Add pagination params
        if (params.page) {
          searchParams.append("page", params.page.toString());
        }
        if (params.limit) {
          searchParams.append("limit", params.limit.toString());
        }

        // Add search filters
        if (params.orderNumber) {
          searchParams.append("orderNumber", params.orderNumber);
        }
        if (params.customerEmail) {
          searchParams.append("customerEmail", params.customerEmail);
        }
        if (params.customerName) {
          searchParams.append("customerName", params.customerName);
        }
        if (params.customerPhone) {
          searchParams.append("customerPhone", params.customerPhone);
        }
        if (params.status) {
          searchParams.append("status", params.status);
        }
        if (params.paymentStatus) {
          searchParams.append("paymentStatus", params.paymentStatus);
        }
        if (params.fromDate) {
          searchParams.append("fromDate", params.fromDate);
        }
        if (params.toDate) {
          searchParams.append("toDate", params.toDate);
        }
        if (params.trackingNumber) {
          searchParams.append("trackingNumber", params.trackingNumber);
        }
        if (params.minAmount !== undefined) {
          searchParams.append("minAmount", params.minAmount.toString());
        }
        if (params.maxAmount !== undefined) {
          searchParams.append("maxAmount", params.maxAmount.toString());
        }

        const queryString = searchParams.toString();
        return `/api/v1/orders/admin/search${
          queryString ? `?${queryString}` : ""
        }`;
      },
      transformResponse: (response: OrdersResponse) => {
        // Add calculated pagination properties
        const pagination = response.pagination;
        pagination.hasNextPage = pagination.page < pagination.pages;
        pagination.hasPreviousPage = pagination.page > 1;
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "AdminOrders" as const,
                id: _id,
              })),
              { type: "AdminOrders", id: "SEARCH" },
            ]
          : [{ type: "AdminOrders", id: "SEARCH" }],
    }),

    // Get all orders (admin view)
    getAllOrders: builder.query<OrdersResponse, PaginationParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params.page) {
          searchParams.append("page", params.page.toString());
        }
        if (params.limit) {
          searchParams.append("limit", params.limit.toString());
        }

        const queryString = searchParams.toString();
        return `/api/v1/orders/admin${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (response: OrdersResponse) => {
        // Add calculated pagination properties
        const pagination = response.pagination;
        pagination.hasNextPage = pagination.page < pagination.pages;
        pagination.hasPreviousPage = pagination.page > 1;
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "AdminOrders" as const,
                id: _id,
              })),
              { type: "AdminOrders", id: "LIST" },
            ]
          : [{ type: "AdminOrders", id: "LIST" }],
    }),

    // Get order by ID (admin view with all details)
    getOrderById: builder.query<Order, string>({
      query: (orderId) => `/api/v1/orders/${orderId}`,
      providesTags: (result, error, id) => [
        { type: "AdminOrders", id },
        { type: "Orders", id },
      ],
    }),

    // Update a single order
    updateOrder: builder.mutation<
      Order,
      { orderId: string; data: UpdateOrderData }
    >({
      query: ({ orderId, data }) => {
        // Clean the data to remove any _id fields
        const cleanedData = cleanOrderDataForUpdate(data);

        return {
          url: `/api/v1/orders/${orderId}`,
          method: "PUT",
          body: cleanedData,
        };
      },
      invalidatesTags: (result, error, { orderId }) => [
        { type: "AdminOrders", id: orderId },
        { type: "Orders", id: orderId },
        { type: "AdminOrders", id: "LIST" },
        { type: "AdminOrders", id: "SEARCH" },
      ],
    }),

    // Bulk update multiple orders
    bulkUpdateOrders: builder.mutation<BulkUpdateResponse, BulkUpdateOrderData>(
      {
        query: (data) => {
          // Clean the data to remove any _id fields
          const cleanedData = cleanOrderDataForUpdate(data);

          return {
            url: `/api/v1/orders/bulk-update`,
            method: "PUT",
            body: cleanedData,
          };
        },
        invalidatesTags: (result, error, { orderIds }) => [
          ...orderIds.map((id) => ({ type: "AdminOrders" as const, id })),
          ...orderIds.map((id) => ({ type: "Orders" as const, id })),
          { type: "AdminOrders", id: "LIST" },
          { type: "AdminOrders", id: "SEARCH" },
        ],
      }
    ),
  }),
});

// Export hooks for the admin orders API
export const {
  useSearchOrdersQuery,
  useLazySearchOrdersQuery,
  useGetAllOrdersQuery,
  useLazyGetAllOrdersQuery,
  useGetOrderByIdQuery: useGetOrderByIdAdminQuery,
  useLazyGetOrderByIdQuery: useLazyGetOrderByIdAdminQuery,
  useUpdateOrderMutation,
  useBulkUpdateOrdersMutation,
} = adminOrdersApi;
