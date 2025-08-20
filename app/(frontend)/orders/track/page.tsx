'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTrackOrderQuery } from '@/redux/services/orderApi';
import { Order, OrderItem } from '@/src/types/order';
import { useEffect } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { format } from 'date-fns';

function ErrorState({ title, message }: { title: string; message: string }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md text-center">
        <div className="bg-red-50 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const email = searchParams.get('email');

  // Redirect if required params are missing
  useEffect(() => {
    if (!orderNumber || !email) {
      router.push('/');
    }
  }, [orderNumber, email, router]);

  const { data: order, isLoading, error } = useTrackOrderQuery(
    { orderNumber: orderNumber || '', email: email || '' },
    { skip: !orderNumber || !email }
  ) as { data: Order | undefined; isLoading: boolean; error: any };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <ErrorState 
        title="Order Not Found" 
        message="We couldn't find the order with the provided details. Please check your order number and email address."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/')}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              
              <div className="border-l border-gray-300 h-6"></div>
              
              <h1 className="text-xl font-semibold text-gray-900">Order #{order.orderNumber}</h1>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">
                    {format(new Date(order.createdAt || ''), 'PPP')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{order.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
              <div className="divide-y divide-gray-200">
                {order.items.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="py-4 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.frameType && <p className="text-sm text-gray-500">Frame: {item.frameType}</p>}
                      {item.dimensions && (
                        <p className="text-sm text-gray-500">
                          Size: {item.dimensions.width}" x {item.dimensions.height}"
                        </p>
                      )}
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Total</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
