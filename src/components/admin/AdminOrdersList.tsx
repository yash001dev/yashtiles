"use client";

import React from "react";
import { Check, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Pagination";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Order, PaginationMeta } from "@/types";

interface AdminOrdersListProps {
  orders: Order[];
  pagination: PaginationMeta | null;
  loading: boolean;
  selectedOrders: string[];
  onSelectOrder: (orderId: string, selected: boolean) => void;
  onSelectAllOrders: (selected: boolean) => void;
  onOrderClick: (order: Order) => void;
  onPageChange: (page: number) => void;
  onStatusUpdate: (orderId: string, status: string, notes?: string) => void;
}

export const AdminOrdersList: React.FC<AdminOrdersListProps> = ({
  orders,
  pagination,
  loading,
  selectedOrders,
  onSelectOrder,
  onSelectAllOrders,
  onOrderClick,
  onPageChange,
  onStatusUpdate,
}) => {
  const allSelected = orders.length > 0 && selectedOrders.length === orders.length;
  const someSelected = selectedOrders.length > 0 && selectedOrders.length < orders.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <div className="w-2 h-2 bg-yellow-400 rounded-full" />;
      case "confirmed":
        return <Check className="w-4 h-4 text-blue-500" />;
      case "processing":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-green-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      case "refunded":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const quickStatusActions = [
    { status: "confirmed", label: "Confirm", icon: Check },
    { status: "processing", label: "Process", icon: Package },
    { status: "shipped", label: "Ship", icon: Truck },
    { status: "delivered", label: "Deliver", icon: CheckCircle },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAllOrders(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-900">
                Order
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-900">
                Customer
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-900">
                Status
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-900">
                Payment
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-900">
                Amount
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-900">
                Date
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order._id}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedOrders.includes(order._id) ? "bg-blue-50" : ""
                }`}
              >
                {/* Selection Checkbox */}
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={(e) => onSelectOrder(order._id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>

                {/* Order Info */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </div>
                      {order.trackingNumber && (
                        <div className="text-xs text-blue-600 font-mono">
                          {order.trackingNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Customer Info */}
                <td className="p-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.shippingAddress.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.shippingAddress.phone}
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <OrderStatusBadge status={order.status} />
                </td>

                {/* Payment Status */}
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                {/* Amount */}
                <td className="p-4">
                  <div className="font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                  {order.shippingCost > 0 && (
                    <div className="text-sm text-gray-500">
                      +${order.shippingCost.toFixed(2)} shipping
                    </div>
                  )}
                </td>

                {/* Date */}
                <td className="p-4">
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    {/* View Details */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOrderClick(order)}
                      className="h-8 w-8 p-0"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {/* Quick Status Actions */}
                    {quickStatusActions.map((action) => {
                      const Icon = action.icon;
                      const isCurrentStatus = order.status === action.status;
                      const canAdvance = 
                        (action.status === "confirmed" && order.status === "pending") ||
                        (action.status === "processing" && ["pending", "confirmed"].includes(order.status)) ||
                        (action.status === "shipped" && ["pending", "confirmed", "processing"].includes(order.status)) ||
                        (action.status === "delivered" && order.status === "shipped");

                      if (!canAdvance || isCurrentStatus) return null;

                      return (
                        <Button
                          key={action.status}
                          variant="ghost"
                          size="sm"
                          onClick={() => onStatusUpdate(order._id, action.status)}
                          className="h-8 w-8 p-0"
                          title={action.label}
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={onPageChange}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
            />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};
