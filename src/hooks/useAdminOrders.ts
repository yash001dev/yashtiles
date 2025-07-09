import { useState, useEffect, useCallback } from "react";
import { adminOrdersService, SearchOrderParams, BulkUpdateOrderData, UpdateOrderData } from "@/lib/admin-orders";
import { Order, OrdersResponse, PaginationMeta } from "@/types";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchOrders = useCallback(async (params: SearchOrderParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: OrdersResponse = await adminOrdersService.searchOrders(params);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setOrders([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (orderId: string, data: UpdateOrderData) => {
    try {
      const updatedOrder = await adminOrdersService.updateOrder(orderId, data);
      // Update the order in the current list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? updatedOrder : order
        )
      );
      return updatedOrder;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update order");
    }
  }, []);

  const bulkUpdateOrders = useCallback(async (data: BulkUpdateOrderData) => {
    try {
      const result = await adminOrdersService.bulkUpdateOrders(data);
      // Refresh orders to get updated data
      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to bulk update orders");
    }
  }, []);

  const getOrderById = useCallback(async (orderId: string) => {
    try {
      return await adminOrdersService.getOrderById(orderId);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to fetch order");
    }
  }, []);

  const refreshOrders = useCallback(() => {
    // Re-run the last search
    searchOrders();
  }, [searchOrders]);

  // Initial load
  useEffect(() => {
    searchOrders({ page: 1, limit: 25 });
  }, [searchOrders]);

  return {
    orders,
    pagination,
    loading,
    error,
    searchOrders,
    updateOrder,
    bulkUpdateOrders,
    getOrderById,
    refreshOrders,
  };
};
