import { useCreateCheckoutMutation } from "../redux/api/ordersApi";

export interface CheckoutData {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    customization: any;
    image?: string;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: "stripe" | "paypal" | "razorpay";
  totalAmount: number;
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  paymentUrl?: string;
  message: string;
}

export const useCheckoutRTK = () => {
  const [createCheckout, { isLoading, error }] = useCreateCheckoutMutation();

  const processCheckout = async (
    checkoutData: CheckoutData
  ): Promise<CheckoutResponse> => {
    try {
      const result = await createCheckout(checkoutData).unwrap();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Checkout failed";
      throw new Error(errorMessage);
    }
  };

  return {
    processCheckout,
    isLoading,
    error: error ? (error as any)?.data?.message || "Checkout failed" : null,
  };
};
