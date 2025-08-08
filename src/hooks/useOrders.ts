import { useState } from "react";
import { useGetOrdersQuery } from "@/redux/api/ordersApi";
import { PaginationParams } from "@/types";

export const useOrders = () => {
  const [params, setParams] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, error, refetch } = useGetOrdersQuery(params);

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const setLimit = (limit: number) => {
    setParams((prev) => ({ ...prev, limit, page: 1 })); // Reset to page 1 when changing limit
  };

  return {
    orders: data?.orders || [],
    pagination: data?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    isLoading,
    error: error
      ? (error as any).data?.message || "Failed to fetch orders"
      : null,
    refetch,
    setPage,
    setLimit,
  };
};
