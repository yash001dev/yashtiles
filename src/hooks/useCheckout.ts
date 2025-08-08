import { useState } from "react";
import { useProcessCheckoutMutation } from "@/redux/api/checkoutApi";
import { CheckoutData, CheckoutResponse } from "@/types";

export const useCheckout = () => {
  const [processCheckout, { isLoading, error }] = useProcessCheckoutMutation();

  const processCheckoutAsync = async (
    checkoutData: CheckoutData
  ): Promise<CheckoutResponse> => {
    try {
      const result = await processCheckout(checkoutData).unwrap();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Checkout failed";
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    // RTK Query handles error clearing automatically
  };

  return {
    processCheckout: processCheckoutAsync,
    isLoading,
    error: error ? (error as any).data?.message || "Checkout failed" : null,
    clearError,
  };
};
