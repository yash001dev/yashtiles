"use client";

import React, { useState } from "react";
import { Calendar, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchOrderParams } from "@/lib/admin-orders";

interface AdminOrderFiltersProps {
  filters: SearchOrderParams;
  onFiltersChange: (filters: SearchOrderParams) => void;
  onClose: () => void;
}

export const AdminOrderFilters: React.FC<AdminOrderFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<SearchOrderParams>(filters);

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "", label: "All Payment Statuses" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const handleFilterChange = (key: keyof SearchOrderParams, value: any) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: SearchOrderParams = {
      page: 1,
      limit: filters.limit || 25,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    key => key !== "page" && key !== "limit" && localFilters[key as keyof SearchOrderParams]
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Customer Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Email
          </label>
          <Input
            placeholder="Search by email..."
            value={localFilters.customerEmail || ""}
            onChange={(e) => handleFilterChange("customerEmail", e.target.value)}
          />
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <Input
            placeholder="Search by name..."
            value={localFilters.customerName || ""}
            onChange={(e) => handleFilterChange("customerName", e.target.value)}
          />
        </div>

        {/* Customer Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <Input
            placeholder="Search by phone..."
            value={localFilters.customerPhone || ""}
            onChange={(e) => handleFilterChange("customerPhone", e.target.value)}
          />
        </div>

        {/* Order Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Number
          </label>
          <Input
            placeholder="Search by order #..."
            value={localFilters.orderNumber || ""}
            onChange={(e) => handleFilterChange("orderNumber", e.target.value)}
          />
        </div>

        {/* Order Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={localFilters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={localFilters.paymentStatus || ""}
            onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
          >
            {paymentStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="date"
              className="pl-10"
              value={localFilters.fromDate || ""}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            />
          </div>
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="date"
              className="pl-10"
              value={localFilters.toDate || ""}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
            />
          </div>
        </div>

        {/* Tracking Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number
          </label>
          <Input
            placeholder="Search by tracking..."
            value={localFilters.trackingNumber || ""}
            onChange={(e) => handleFilterChange("trackingNumber", e.target.value)}
          />
        </div>

        {/* Min Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Amount ($)
          </label>
          <Input
            type="number"
            placeholder="0.00"
            step="0.01"
            value={localFilters.minAmount || ""}
            onChange={(e) => handleFilterChange("minAmount", e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Amount ($)
          </label>
          <Input
            type="number"
            placeholder="0.00"
            step="0.01"
            value={localFilters.maxAmount || ""}
            onChange={(e) => handleFilterChange("maxAmount", e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>

        {/* Results per page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Results per page
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={localFilters.limit || 25}
            onChange={(e) => handleFilterChange("limit", parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={handleApplyFilters} className="px-6">
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="px-6"
            >
              Clear All
            </Button>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {hasActiveFilters ? "Filters active" : "No filters applied"}
        </div>
      </div>
    </div>
  );
};
