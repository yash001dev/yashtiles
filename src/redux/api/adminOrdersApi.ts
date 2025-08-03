import { apiSlice } from "./apiSlice";

// Define types locally since they're not available in the lib module
interface SearchOrderParams {
  page?: number;
  limit?: number;
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

interface BulkUpdateOrderData {
  orderIds: string[];
  status?: string;
  paymentStatus?: string;
  trackingNumber?: string;
}

interface UpdateOrderData {
  status?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  shippingAddress?: any;
}

// Define types locally since they're not available in the types module
interface Order {
  _id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: any[];
  shippingAddress: any;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const adminOrdersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Search orders (admin)
    searchOrders: builder.query<OrdersResponse, SearchOrderParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Add pagination params
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());

        // Add search filters
        if (params.orderNumber)
          searchParams.append("orderNumber", params.orderNumber);
        if (params.customerEmail)
          searchParams.append("customerEmail", params.customerEmail);
        if (params.customerName)
          searchParams.append("customerName", params.customerName);
        if (params.customerPhone)
          searchParams.append("customerPhone", params.customerPhone);
        if (params.status) searchParams.append("status", params.status);
        if (params.paymentStatus)
          searchParams.append("paymentStatus", params.paymentStatus);
        if (params.fromDate) searchParams.append("fromDate", params.fromDate);
        if (params.toDate) searchParams.append("toDate", params.toDate);
        if (params.trackingNumber)
          searchParams.append("trackingNumber", params.trackingNumber);
        if (params.minAmount !== undefined)
          searchParams.append("minAmount", params.minAmount.toString());
        if (params.maxAmount !== undefined)
          searchParams.append("maxAmount", params.maxAmount.toString());

        const queryString = searchParams.toString();
        return `/api/v1/orders/admin/search${
          queryString ? `?${queryString}` : ""
        }`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "Order" as const,
                id: _id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    // Get all orders (admin)
    getAllOrders: builder.query<OrdersResponse, PaginationParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());

        const queryString = searchParams.toString();
        return `/api/v1/orders/admin${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "Order" as const,
                id: _id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    // Get order by ID (admin)
    getOrderById: builder.query<Order, string>({
      query: (orderId) => `/api/v1/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // Update order
    updateOrder: builder.mutation<
      Order,
      { orderId: string; data: UpdateOrderData }
    >({
      query: ({ orderId, data }) => ({
        url: `/api/v1/orders/${orderId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // Bulk update orders
    bulkUpdateOrders: builder.mutation<any, BulkUpdateOrderData>({
      query: (data) => ({
        url: "/api/v1/orders/bulk-update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useSearchOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useBulkUpdateOrdersMutation,
} = adminOrdersApi;
