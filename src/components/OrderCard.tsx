import React from 'react';
import { Order } from '@/types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { Package, Eye, Calendar, CreditCard, MapPin } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      case 'refunded':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.status as any} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-600">Payment:</span>
            <span className={`ml-1 font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-600">Ship to:</span>
            <span className="ml-1 text-gray-900">
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-600">Items:</span>
            <span className="ml-1 font-medium text-gray-900">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          {order.trackingNumber && (
            <div className="text-sm">
              <span className="text-gray-600">Tracking:</span>
              <span className="ml-1 font-mono text-gray-900">{order.trackingNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
        <div className="flex-1">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(order.totalAmount)}
          </span>
          {(order.shippingCost > 0 || order.taxAmount > 0) && (
            <div className="text-sm text-gray-500 mt-1">
              {order.shippingCost > 0 && `Shipping: ${formatCurrency(order.shippingCost)}`}
              {order.shippingCost > 0 && order.taxAmount > 0 && ' • '}
              {order.taxAmount > 0 && `Tax: ${formatCurrency(order.taxAmount)}`}
            </div>
          )}
        </div>
        
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(order._id)}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        )}
      </div>

      {/* Order Items Preview */}
      {order.items.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div
                key={item._id}
                className="relative w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-gray-100"
                style={{ zIndex: order.items.length - index }}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={`Order item ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-white bg-gray-200 text-xs font-medium text-gray-600">
                +{order.items.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
