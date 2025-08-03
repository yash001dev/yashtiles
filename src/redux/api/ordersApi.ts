import { apiSlice } from "./apiSlice";
import { OrdersResponse, PaginationParams } from "../../../types";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user orders
    getOrders: builder.query<OrdersResponse, PaginationParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());

        const queryString = searchParams.toString();
        return `/api/v1/orders${queryString ? `?${queryString}` : ""}`;
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

    // Get order by ID
    getOrderById: builder.query<any, string>({
      query: (orderId) => `/api/v1/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // Create checkout
    createCheckout: builder.mutation<any, any>({
      query: (checkoutData) => ({
        url: "/api/v1/checkout",
        method: "POST",
        body: checkoutData,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateCheckoutMutation,
} = ordersApi;
