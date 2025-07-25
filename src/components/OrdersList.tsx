import React from 'react';
import { useOrders } from '@/hooks/useOrders';
import { OrderCard } from './OrderCard';
import { Pagination } from './Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Package, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrdersListProps {
  onViewOrderDetails?: (orderId: string) => void;
  className?: string;
}

export function OrdersList({ onViewOrderDetails, className = '' }: OrdersListProps) {
  const { orders, meta, loading, error, refetch, setPage, setLimit } = useOrders();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 p-3 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
        <p className="text-gray-600 text-center mb-4 max-w-md">
          {error}
        </p>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-50 p-3 rounded-full mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
        <p className="text-gray-600 text-center mb-4 max-w-md">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Button onClick={() => { if (typeof window !== 'undefined') window.location.href = '/'; }}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Orders Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
          {meta && (
            <p className="text-gray-600 mt-1">
              Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} orders
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={meta?.limit || 10}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onViewDetails={onViewOrderDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.pages}
            onPageChange={setPage}
            hasNextPage={meta.hasNextPage}
            hasPreviousPage={meta.hasPreviousPage}
          />
        </div>
      )}
    </div>
  );
}
