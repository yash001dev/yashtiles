import { apiSlice } from "./apiSlice";
import { OrdersResponse, Order, PaginationParams } from "@/types";

// Orders API endpoints
export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get orders with pagination
    getOrders: builder.query<OrdersResponse, PaginationParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) {
          searchParams.append("page", params.page.toString());
        }

        if (params.limit) {
          searchParams.append("limit", params.limit.toString());
        }

        const queryString = searchParams.toString();
        return `/api/v1/orders${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({
                type: "Orders" as const,
                id: _id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    // Get order by ID
    getOrderById: builder.query<Order, string>({
      query: (orderId) => `/api/v1/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
  }),
});

// Export hooks
export const { useGetOrdersQuery, useGetOrderByIdQuery } = ordersApi;
