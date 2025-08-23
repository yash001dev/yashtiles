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
      query: (formData) => {
        console.log('=== RTK Query Debug ===');
        console.log('Input is FormData:', formData instanceof FormData);
        
        // Log FormData contents before sending
        if (formData instanceof FormData) {
          console.log('FormData entries:');
          for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
              console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
            } else {
              console.log(`${key}: ${typeof value === 'string' ? value.substring(0, 50) + '...' : value}`);
            }
          }
        }

        return {
          url: "/api/v1/payments/payu/initiate",
          method: "POST",
          body: formData,
          // Content-Type will be automatically handled by apiSlice
          // For FormData: no Content-Type (browser sets with boundary)
          // For JSON: application/json
        };
      },
    }),
  }),
});

// Export hooks
export const {
  useProcessCheckoutMutation,
  useGeneratePaymentHashMutation,
  useInitiatePaymentMutation,
} = checkoutApi;
