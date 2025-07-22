import { useState } from 'react';
import { authService } from '../lib/auth';

export interface CheckoutData {
  items: Array<{
    customization: any;
    image: string;
  }>;
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
  paymentMethod: 'stripe' | 'paypal' | 'razorpay';
  totalAmount: number;
}

export interface CheckoutResponse {
  success: boolean;
  orderId: string;
  paymentUrl?: string;
  message: string;
}

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCheckout = async (checkoutData: CheckoutData): Promise<CheckoutResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = authService.getAccessToken();
      if (!token) {
        throw new Error('Please sign in to complete your purchase');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      const result: CheckoutResponse = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    processCheckout,
    isLoading,
    error,
    clearError,
  };
};
