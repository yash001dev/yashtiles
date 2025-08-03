import { useState, useCallback } from "react";
import {
  useSearchOrdersQuery,
  useUpdateOrderMutation,
  useBulkUpdateOrdersMutation,
  useGetOrderByIdQuery,
} from "../redux/api/adminOrdersApi";
import {
  SearchOrderParams,
  BulkUpdateOrderData,
  UpdateOrderData,
} from "../lib/admin-orders";
import { Order } from "../types";

export const useAdminOrdersRTK = () => {
  const [searchParams, setSearchParams] = useState<SearchOrderParams>({
    page: 1,
    limit: 25,
  });

  const { data, isLoading, error, refetch } =
    useSearchOrdersQuery(searchParams);

  const [updateOrder] = useUpdateOrderMutation();
  const [bulkUpdateOrders] = useBulkUpdateOrdersMutation();

  const searchOrders = useCallback(
    async (params: SearchOrderParams = {}) => {
      setSearchParams({ ...searchParams, ...params });
    },
    [searchParams]
  );

  const updateOrderHandler = useCallback(
    async (orderId: string, data: UpdateOrderData) => {
      try {
        const updatedOrder = await updateOrder({ orderId, data }).unwrap();
        return updatedOrder;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to update order"
        );
      }
    },
    [updateOrder]
  );

  const bulkUpdateOrdersHandler = useCallback(
    async (data: BulkUpdateOrderData) => {
      try {
        const result = await bulkUpdateOrders(data).unwrap();
        return result;
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Failed to bulk update orders"
        );
      }
    },
    [bulkUpdateOrders]
  );

  const refreshOrders = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    orders: data?.orders || [],
    pagination: data?.pagination || null,
    loading: isLoading,
    error: error
      ? (error as any)?.data?.message || "Failed to fetch orders"
      : null,
    searchOrders,
    updateOrder: updateOrderHandler,
    bulkUpdateOrders: bulkUpdateOrdersHandler,
    refreshOrders,
  };
};

// Hook for getting a single order by ID
export const useOrderByIdRTK = (orderId: string) => {
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
  });

  return {
    order,
    loading: isLoading,
    error: error
      ? (error as any)?.data?.message || "Failed to fetch order"
      : null,
    refetch,
  };
};
