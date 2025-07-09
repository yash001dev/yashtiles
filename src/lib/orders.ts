import { config } from "./config";
import { OrdersResponse, PaginationParams } from "@/types";

class OrdersService {
  private baseUrl = config.apiUrl;

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  async getOrders(params: PaginationParams = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) {
      searchParams.append("page", params.page.toString());
    }

    if (params.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/orders${queryString ? `?${queryString}` : ""}`;

    const response = await this.makeRequest<OrdersResponse>(endpoint);
    
    // Add calculated pagination properties
    const pagination = response.pagination;
    pagination.hasNextPage = pagination.page < pagination.pages;
    pagination.hasPreviousPage = pagination.page > 1;
    
    return response;
  }

  async getOrderById(orderId: string) {
    return this.makeRequest(`/api/v1/orders/${orderId}`);
  }
}

export const ordersService = new OrdersService();
