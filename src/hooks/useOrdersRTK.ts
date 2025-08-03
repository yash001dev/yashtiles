import { useState, useCallback } from "react";
import { useGetOrdersQuery } from "../redux/api/ordersApi";
import { PaginationParams } from "../types";
import { useAuth } from "../contexts/AuthContext";

export interface UseOrdersRTKResult {
  orders: any[];
  meta: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export function useOrdersRTK(
  initialParams: PaginationParams = {}
): UseOrdersRTKResult {
  const { isAuthenticated } = useAuth();
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const { data, isLoading, error, refetch } = useGetOrdersQuery(params, {
    skip: !isAuthenticated,
  });

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  return {
    orders: data?.orders || [],
    meta: data?.pagination || null,
    loading: isLoading,
    error: error
      ? (error as any)?.data?.message || "Failed to fetch orders"
      : null,
    refetch,
    setPage,
    setLimit,
  };
}
