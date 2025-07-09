import { useState, useEffect, useCallback } from "react";
import { ordersService } from "@/lib/orders";
import { OrdersResponse, PaginationParams } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export interface UseOrdersResult {
  orders: OrdersResponse["orders"];
  meta: OrdersResponse["pagination"] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function useOrders(
  initialParams: PaginationParams = {}
): UseOrdersResult {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<OrdersResponse["orders"]>([]);
  const [meta, setMeta] = useState<OrdersResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setMeta(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ordersService.getOrders(params);
      setOrders(response.orders);
      setMeta(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setOrders([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  const refetch = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    meta,
    loading,
    error,
    refetch,
    setPage,
    setLimit,
  };
}
