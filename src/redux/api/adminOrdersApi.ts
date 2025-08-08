import { apiSlice } from "./apiSlice";
import { OrdersResponse, Order, PaginationParams } from "@/types";

// Admin Orders API endpoints
export const adminOrdersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders (admin)
    getAllOrders: builder.query<OrdersResponse, PaginationParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) {
          searchParams.append("page", params.page.toString());
        }

        if (params.limit) {
          searchParams.append("limit", params.limit.toString());
        }

        const queryString = searchParams.toString();
        return `/api/v1/admin/orders${queryString ? `?${queryString}` : ""}`;
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

    // Get order by ID (admin)
    getOrderById: builder.query<Order, string>({
      query: (orderId) => `/api/v1/admin/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: "AdminOrders", id }],
    }),

    // Update order status (admin)
    updateOrderStatus: builder.mutation<
      Order,
      { orderId: string; status: string }
    >({
      query: ({ orderId, status }) => ({
        url: `/api/v1/admin/orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "AdminOrders", id: orderId },
        { type: "AdminOrders", id: "LIST" },
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // Update order tracking (admin)
    updateOrderTracking: builder.mutation<
      Order,
      { orderId: string; trackingNumber: string }
    >({
      query: ({ orderId, trackingNumber }) => ({
        url: `/api/v1/admin/orders/${orderId}/tracking`,
        method: "PATCH",
        body: { trackingNumber },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "AdminOrders", id: orderId },
        { type: "AdminOrders", id: "LIST" },
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),

    // Delete order (admin)
    deleteOrder: builder.mutation<{ message: string }, string>({
      query: (orderId) => ({
        url: `/api/v1/admin/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "AdminOrders", id: orderId },
        { type: "AdminOrders", id: "LIST" },
        { type: "Orders", id: orderId },
        { type: "Orders", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useDeleteOrderMutation,
} = adminOrdersApi;
