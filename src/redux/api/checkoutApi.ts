import { apiSlice } from "./apiSlice";
import { CheckoutData, CheckoutResponse } from "@/types";

// Payment hash data
interface PaymentHashData {
  key: string;
  txnid: string;
  amount: number;
  productinfo: string;
  firstname: string;
  email: string;
  salt: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
}

// Checkout API endpoints
export const checkoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Process checkout
    processCheckout: builder.mutation<CheckoutResponse, CheckoutData>({
      query: (checkoutData) => ({
        url: "/api/v1/checkout",
        method: "POST",
        body: checkoutData,
      }),
      invalidatesTags: ["Orders"],
    }),

    // Generate payment hash (for PayU)
    generatePaymentHash: builder.mutation<{ hash: string }, PaymentHashData>({
      query: (data) => ({
        url: "/api/v1/payments/payu/generate-hash",
        method: "POST",
        body: data,
      }),
    }),

    // Initiate payment (for PayU) - handles FormData
    initiatePayment: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/api/v1/payments/payu/initiate",
        method: "POST",
        body: formData,
        // Don't set Content-Type header for FormData, let browser set it
        prepareHeaders: (headers) => {
          // Remove Content-Type header for FormData
          headers.delete("Content-Type");
          return headers;
        },
      }),
    }),
  }),
});

// Export hooks
export const {
  useProcessCheckoutMutation,
  useGeneratePaymentHashMutation,
  useInitiatePaymentMutation,
} = checkoutApi;
