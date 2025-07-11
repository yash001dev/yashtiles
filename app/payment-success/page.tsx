'use client';
import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

 function PayUSuccess() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle both URL params and POST data from PayU
    const handlePaymentResponse = () => {
      try {
        // Get URL parameters
        const params: any = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        // PayU sends data via POST, so we might also need to handle form data
        // Check if there's any data in the URL or localStorage
        const storedData = localStorage.getItem('payuSuccessData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setPaymentData({ ...params, ...parsedData });
          localStorage.removeItem('payuSuccessData'); // Clean up
        } else {
          setPaymentData(params);
        }
      } catch (error) {
        console.error('Error processing payment response:', error);
        // Set empty data to prevent further errors
        setPaymentData({});
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure all data is loaded
    const timer = setTimeout(() => {
      handlePaymentResponse();
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-green-600">Processing payment response...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your payment was processed successfully.
          </p>
        </div>

        {paymentData && (
          <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-800 mb-2">Payment Details:</h3>
            <div className="text-sm text-green-700 space-y-1">
              {paymentData.txnid && <p><span className="font-medium">Transaction ID:</span> {paymentData.txnid}</p>}
              {paymentData.amount && <p><span className="font-medium">Amount:</span> ₹{paymentData.amount}</p>}
              {paymentData.status && <p><span className="font-medium">Status:</span> {paymentData.status}</p>}
              {paymentData.mihpayid && <p><span className="font-medium">PayU ID:</span> {paymentData.mihpayid}</p>}
              {paymentData.mode && <p><span className="font-medium">Payment Mode:</span> {paymentData.mode}</p>}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            href="/app" 
            className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Continue Shopping
          </Link>
          <Link 
            href="/orders" 
            className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PayUSuccessPage() {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PayUSuccess />
    </Suspense>
  );
} 