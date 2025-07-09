"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Download, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminOrdersList } from "./AdminOrdersList";
import { AdminOrderFilters } from "./AdminOrderFilters";
import { AdminBulkActions } from "./AdminBulkActions";
import { AdminOrderModal } from "./AdminOrderModal";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { Order } from "@/types";
import { SearchOrderParams, UpdateOrderData } from "@/lib/admin-orders";

export const AdminOrdersDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchOrderParams>({
    page: 1,
    limit: 25,
  });

  const {
    orders,
    pagination,
    loading,
    error,
    searchOrders,
    updateOrder,
    bulkUpdateOrders,
    refreshOrders,
  } = useAdminOrders();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        const searchFilters: SearchOrderParams = {
          ...filters,
          page: 1,
          orderNumber: searchQuery,
          customerEmail: searchQuery,
          customerName: searchQuery,
        };
        searchOrders(searchFilters);
      } else {
        searchOrders(filters);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersApply = (newFilters: SearchOrderParams) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleSelectOrder = (orderId: string, selected: boolean) => {
    if (selected) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleSelectAllOrders = (selected: boolean) => {
    if (selected) {
      setSelectedOrders(orders.map((order: Order) => order._id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleOrderUpdate = async (orderId: string, data: any) => {
    try {
      await updateOrder(orderId, data);
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(null);
        setIsOrderModalOpen(false);
      }
      refreshOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const handleBulkUpdate = async (data: any) => {
    try {
      await bulkUpdateOrders({
        orderIds: selectedOrders,
        ...data,
      });
      setSelectedOrders([]);
      refreshOrders();
    } catch (error) {
      console.error("Failed to bulk update orders:", error);
    }
  };

  const handleExportOrders = () => {
    // Export functionality - convert orders to CSV
    const csvContent = [
      // Header
      [
        "Order Number",
        "Customer",
        "Email",
        "Status",
        "Payment Status",
        "Total Amount",
        "Created Date",
        "Tracking Number",
      ].join(","),
      // Data
      ...orders.map((order: Order) =>
        [
          order.orderNumber,
          `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
          order.shippingAddress.email,
          order.status,
          order.paymentStatus,
          order.totalAmount,
          new Date(order.createdAt).toLocaleDateString(),
          order.trackingNumber || "",
        ].join(",")
      ),
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    return {
      total: pagination?.total || 0,
      pending: orders.filter((o: Order) => o.status === "pending").length,
      processing: orders.filter((o: Order) => o.status === "processing").length,
      shipped: orders.filter((o: Order) => o.status === "shipped").length,
      delivered: orders.filter((o: Order) => o.status === "delivered").length,
    };
  }, [orders, pagination]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">
          Manage and track all customer orders from one central dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">{stats.shipped}</div>
          <div className="text-sm text-gray-600">Shipped</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-800">{stats.delivered}</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders, customers, or order numbers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={refreshOrders}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExportOrders}
              disabled={orders.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <AdminOrderFilters
              filters={filters}
              onFiltersChange={handleFiltersApply}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="mb-4">
          <AdminBulkActions
            selectedCount={selectedOrders.length}
            onBulkUpdate={handleBulkUpdate}
            onClearSelection={() => setSelectedOrders([])}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Orders List */}
      <AdminOrdersList
        orders={orders}
        pagination={pagination}
        loading={loading}
        selectedOrders={selectedOrders}
        onSelectOrder={handleSelectOrder}
        onSelectAllOrders={handleSelectAllOrders}
        onOrderClick={handleOrderClick}
        onPageChange={handlePageChange}
        onStatusUpdate={(orderId: string, status: string, notes?: string) =>
          handleOrderUpdate(orderId, { status, statusNotes: notes })
        }
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <AdminOrderModal
          order={selectedOrder}
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedOrder(null);
          }}
          onUpdate={(data: UpdateOrderData) => handleOrderUpdate(selectedOrder._id, data)}
        />
      )}
    </div>
  );
};
