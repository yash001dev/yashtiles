import { config } from "./config";
import { OrdersResponse, PaginationParams } from "@/types";
import { useGetOrdersQuery, useGetOrderByIdQuery } from "@/redux/api/ordersApi";

class OrdersService {
  private baseUrl = config.apiUrl;

  // Use RTK Query hooks instead of fetch
  async getOrders(params: PaginationParams = {}): Promise<OrdersResponse> {
    // This method is now deprecated - use useGetOrdersQuery hook directly
    throw new Error("Use useGetOrdersQuery hook instead of this method");
  }

  async getOrderById(orderId: string) {
    // This method is now deprecated - use useGetOrderByIdQuery hook directly
    throw new Error("Use useGetOrderByIdQuery hook instead of this method");
  }
}

// Export the service instance
export const ordersService = new OrdersService();

// Export hooks for direct use
export { useGetOrdersQuery, useGetOrderByIdQuery };
