import { useState, useCallback } from "react";
import {
  useSearchOrdersQuery,
  useLazySearchOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useUpdateOrderMutation,
  useBulkUpdateOrdersMutation,
  SearchOrderParams,
  BulkUpdateOrderData,
  UpdateOrderData,
} from "@/lib/admin-orders";
import { Order, PaginationMeta } from "@/types";

export const useAdminOrders = () => {
  const [searchParams, setSearchParams] = useState<SearchOrderParams>({
    page: 1,
    limit: 25,
  });

  // RTK Query hooks
  const {
    data: ordersResponse,
    isLoading: loading,
    error: queryError,
    refetch: refreshOrders,
  } = useSearchOrdersQuery(searchParams);

  const [triggerSearch, { data: searchResponse }] = useLazySearchOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [bulkUpdateOrders] = useBulkUpdateOrdersMutation();
  const [getOrderById] = useLazyGetOrderByIdQuery();

  // Extract data from response
  const orders = ordersResponse?.orders || [];
  const pagination = ordersResponse?.pagination || null;
  const error = queryError
    ? (queryError as any)?.data?.message ||
      (queryError as any)?.message ||
      "An error occurred"
    : null;

  const searchOrders = useCallback(
    async (params: SearchOrderParams = {}) => {
      const newParams = { ...searchParams, ...params };
      setSearchParams(newParams);

      try {
        const result = await triggerSearch(newParams).unwrap();
        return result;
      } catch (err: any) {
        throw new Error(
          err?.data?.message || err?.message || "Failed to fetch orders"
        );
      }
    },
    [searchParams, triggerSearch]
  );

  const updateOrderHandler = useCallback(
    async (orderId: string, data: UpdateOrderData) => {
      try {
        const result = await updateOrder({ orderId, data }).unwrap();
        return result;
      } catch (err: any) {
        throw new Error(
          err?.data?.message || err?.message || "Failed to update order"
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
      } catch (err: any) {
        throw new Error(
          err?.data?.message || err?.message || "Failed to bulk update orders"
        );
      }
    },
    [bulkUpdateOrders]
  );

  const getOrderByIdHandler = useCallback(
    async (orderId: string) => {
      try {
        const result = await getOrderById(orderId).unwrap();
        return result;
      } catch (err: any) {
        throw new Error(
          err?.data?.message || err?.message || "Failed to fetch order"
        );
      }
    },
    [getOrderById]
  );

  const refreshOrdersHandler = useCallback(() => {
    refreshOrders();
  }, [refreshOrders]);

  return {
    orders,
    pagination,
    loading,
    error,
    searchOrders,
    updateOrder: updateOrderHandler,
    bulkUpdateOrders: bulkUpdateOrdersHandler,
    getOrderById: getOrderByIdHandler,
    refreshOrders: refreshOrdersHandler,
  };
};
