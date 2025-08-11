import { config } from "./config";
import { OrdersResponse, Order, PaginationParams } from "@/types";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
} from "@/redux/api/adminOrdersApi";

// Types for admin orders
export interface SearchOrderParams extends PaginationParams {
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UpdateOrderData {
  status?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface BulkUpdateOrderData {
  orderIds: string[];
  status: string;
}

class AdminOrdersService {
  private baseUrl = config.apiUrl;

  // Use RTK Query hooks instead of fetch
  async searchOrders(params: SearchOrderParams = {}): Promise<OrdersResponse> {
    // This method is now deprecated - use useGetAllOrdersQuery hook directly
    throw new Error("Use useGetAllOrdersQuery hook instead of this method");
  }

  async getOrderById(orderId: string): Promise<Order> {
    // This method is now deprecated - use useGetOrderByIdQuery hook directly
    throw new Error("Use useGetOrderByIdQuery hook instead of this method");
  }

  async updateOrder(orderId: string, data: UpdateOrderData): Promise<Order> {
    // This method is now deprecated - use useUpdateOrderStatusMutation or useUpdateOrderTrackingMutation hooks directly
    throw new Error(
      "Use useUpdateOrderStatusMutation or useUpdateOrderTrackingMutation hooks instead of this method"
    );
  }

  async bulkUpdateOrders(
    data: BulkUpdateOrderData
  ): Promise<{ success: boolean; message: string }> {
    // This method is now deprecated - use the mutation hooks directly
    throw new Error("Use useUpdateOrderStatusMutation hook for bulk updates");
  }
}

// Export the service instance
export const adminOrdersService = new AdminOrdersService();

// Export hooks for direct use
export {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation,
  useDeleteOrderMutation,
};
