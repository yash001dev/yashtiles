'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Order } from '@/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Truck,
  Phone,
  Mail,
  Copy,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useLazyGetOrderByIdQuery } from '@/redux/api';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [
    fetchOrderById,
    { data: orderData, isLoading, isError, error:fetchError },
  ] = useLazyGetOrderByIdQuery();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetchOrderById(orderId);
        setOrder(response?.data as Order);
      } 
      catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !order || isError || fetchError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md text-center">
            <div className="bg-red-50 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {isError || error || fetchError || 'The order you are looking for could not be found.'}
            </p>
            <Button onClick={() => router.push('/orders')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => router.push('/orders')}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Orders</span>
                </Button>
                
                <div className="border-l border-gray-300 h-6"></div>
                
                <h1 className="text-xl font-semibold text-gray-900">
                  Order #{order.orderNumber}
                </h1>
              </div>
              
              <OrderStatusBadge status={order.status as any} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items ({order.items.length})
                </h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt="Order item"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.frameType.charAt(0).toUpperCase() + item.frameType.slice(1)} Frame
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Size: {item.size}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </h2>
                
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order ID</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-gray-900">#{order.orderNumber}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(order.orderNumber)}
                        className="h-auto p-1"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order Date</span>
                    <span className="text-gray-900">{formatDate(order.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`font-medium ${
                      order.paymentStatus === 'paid' ? 'text-green-600' :
                      order.paymentStatus === 'pending' ? 'text-yellow-600' :
                      order.paymentStatus === 'failed' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="text-gray-900 font-mono">{order.txnid}</span>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tracking Number</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-gray-900">{order.trackingNumber}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(order.trackingNumber!)}
                          className="h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
                    </div>
                    
                    {order.shippingCost > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">{formatCurrency(order.shippingCost)}</span>
                      </div>
                    )}
                    
                    {order.taxAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">{formatCurrency(order.taxAmount)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(order.totalAmount + order.shippingCost + order.taxAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start"
                  onClick={() => {
                    //redirec to contact page
                    if (typeof window !== 'undefined') {
                      window.location.href = '/contact';
                    }
                  }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  {order.trackingNumber && (
                    <Button variant="outline" className="w-full justify-start">
                      <Truck className="h-4 w-4 mr-2" />
                      Track Package
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
