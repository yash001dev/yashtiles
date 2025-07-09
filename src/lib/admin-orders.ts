import { config } from "./config";
import { Order, OrdersResponse, PaginationParams } from "@/types";

// Extended types for admin functionality
export interface SearchOrderParams extends PaginationParams {
  orderNumber?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
  trackingNumber?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface BulkUpdateOrderData {
  orderIds: string[];
  status?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface BulkUpdateResponse {
  updated: number;
  failed: string[];
}

export interface UpdateOrderData {
  status?: string;
  paymentStatus?: string;
  totalAmount?: number;
  shippingCost?: number;
  taxAmount?: number;
  paymentId?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items?: Array<{
    productId?: string;
    quantity?: number;
    price?: number;
    size?: string;
    frameType?: string;
    imageUrl?: string;
    notes?: string;
  }>;
  statusNotes?: string;
}

class AdminOrdersService {
  private baseUrl = config.apiUrl;

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

  /**
   * Advanced search for orders with multiple filters
   */
  async searchOrders(params: SearchOrderParams = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();

    // Add pagination params
    if (params.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    // Add search filters
    if (params.orderNumber) {
      searchParams.append("orderNumber", params.orderNumber);
    }
    if (params.customerEmail) {
      searchParams.append("customerEmail", params.customerEmail);
    }
    if (params.customerName) {
      searchParams.append("customerName", params.customerName);
    }
    if (params.customerPhone) {
      searchParams.append("customerPhone", params.customerPhone);
    }
    if (params.status) {
      searchParams.append("status", params.status);
    }
    if (params.paymentStatus) {
      searchParams.append("paymentStatus", params.paymentStatus);
    }
    if (params.fromDate) {
      searchParams.append("fromDate", params.fromDate);
    }
    if (params.toDate) {
      searchParams.append("toDate", params.toDate);
    }
    if (params.trackingNumber) {
      searchParams.append("trackingNumber", params.trackingNumber);
    }
    if (params.minAmount !== undefined) {
      searchParams.append("minAmount", params.minAmount.toString());
    }
    if (params.maxAmount !== undefined) {
      searchParams.append("maxAmount", params.maxAmount.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/orders/admin/search${queryString ? `?${queryString}` : ""}`;

    const response = await this.makeRequest<OrdersResponse>(endpoint);

    // Add calculated pagination properties
    const pagination = response.pagination;
    pagination.hasNextPage = pagination.page < pagination.pages;
    pagination.hasPreviousPage = pagination.page > 1;

    return response;
  }

  /**
   * Update a single order
   */
  async updateOrder(orderId: string, data: UpdateOrderData): Promise<Order> {
    return this.makeRequest<Order>(`/api/v1/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Bulk update multiple orders
   */
  async bulkUpdateOrders(data: BulkUpdateOrderData): Promise<BulkUpdateResponse> {
    return this.makeRequest<BulkUpdateResponse>(`/api/v1/orders/bulk-update`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Get order by ID (admin view with all details)
   */
  async getOrderById(orderId: string): Promise<Order> {
    return this.makeRequest<Order>(`/api/v1/orders/${orderId}`);
  }

  /**
   * Get all orders (admin view)
   */
  async getAllOrders(params: PaginationParams = {}): Promise<OrdersResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) {
      searchParams.append("page", params.page.toString());
    }
    if (params.limit) {
      searchParams.append("limit", params.limit.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/orders/admin${queryString ? `?${queryString}` : ""}`;

    const response = await this.makeRequest<OrdersResponse>(endpoint);

    // Add calculated pagination properties
    const pagination = response.pagination;
    pagination.hasNextPage = pagination.page < pagination.pages;
    pagination.hasPreviousPage = pagination.page > 1;

    return response;
  }
}

export const adminOrdersService = new AdminOrdersService();
