'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrderSummary from './OrderSummary';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PurchaseData {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
  };
  quantity: number;
  totalAmount: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export default function BuyPage() {
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  const [, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get purchase data from session storage
    const storedData = sessionStorage.getItem('purchaseData');
    if (storedData) {
      setPurchaseData(JSON.parse(storedData));
    } else {
      // Redirect to products if no purchase data
      router.push('/products');
    }
  }, [router]);

  const handleShippingSubmit = (data: ShippingInfo) => {
    setShippingInfo(data);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (data: PaymentInfo) => {
    setPaymentInfo(data);
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear purchase data
      sessionStorage.removeItem('purchaseData');
      
      // Redirect to success page
      router.push('/payment-success');
    } catch (error) {
      console.error('Payment failed:', error);
      // In a real app, you'd show an error message
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost = purchaseData ? (purchaseData.totalAmount >= 50 ? 0 : 9.99) : 0;
  const tax = purchaseData ? purchaseData.totalAmount * 0.08 : 0; // 8% tax
  const finalTotal = purchaseData ? purchaseData.totalAmount + shippingCost + tax : 0;

  if (!purchaseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <LoadingSpinner />
          <h2 className="text-xl font-semibold text-gray-900 mt-4">Processing Payment...</h2>
          <p className="text-gray-600 mt-2">Please don&apos;t close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingForm
                initialData={shippingInfo}
                onSubmit={handleShippingSubmit}
              />
            )}
            
            {currentStep === 2 && (
              <PaymentForm
                shippingInfo={shippingInfo}
                onSubmit={handlePaymentSubmit}
                onBack={() => setCurrentStep(1)}
              />
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              purchaseData={purchaseData}
              shippingCost={shippingCost}
              tax={tax}
              total={finalTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}