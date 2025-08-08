import { useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useDeleteOrderMutation,
} from "@/redux/api/adminOrdersApi";
import { PaginationParams } from "@/types";

export const useAdminOrders = (
  params: PaginationParams = { page: 1, limit: 25 }
) => {
  const { data, isLoading, error, refetch } = useGetAllOrdersQuery(params);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [updateOrderTracking] = useUpdateOrderTrackingMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const updateOrder = async (
    orderId: string,
    data: { status?: string; trackingNumber?: string }
  ) => {
    try {
      if (data.status) {
        await updateOrderStatus({ orderId, status: data.status }).unwrap();
      }
      if (data.trackingNumber) {
        await updateOrderTracking({
          orderId,
          trackingNumber: data.trackingNumber,
        }).unwrap();
      }
      return true;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update order"
      );
    }
  };

  const bulkUpdateOrders = async (data: {
    orderIds: string[];
    status: string;
  }) => {
    try {
      // Since we don't have a bulk update endpoint in RTK Query, we'll update them one by one
      const promises = data.orderIds.map((orderId) =>
        updateOrderStatus({ orderId, status: data.status })
      );
      await Promise.all(promises);
      return {
        success: true,
        message: `Updated ${data.orderIds.length} orders`,
      };
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to bulk update orders"
      );
    }
  };

  const getOrderById = async (orderId: string) => {
    // This would need a separate query, but for now we'll return from the list
    return data?.orders.find((order) => order._id === orderId);
  };

  const refreshOrders = () => {
    refetch();
  };

  return {
    orders: data?.orders || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 25,
      total: 0,
      pages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    loading: isLoading,
    error: error
      ? (error as any).data?.message || "Failed to fetch orders"
      : null,
    updateOrder,
    bulkUpdateOrders,
    getOrderById,
    refreshOrders,
  };
};
