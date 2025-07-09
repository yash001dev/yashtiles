"use client";

import React, { useState } from "react";
import { Package, Truck, CheckCircle, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminBulkActionsProps {
  selectedCount: number;
  onBulkUpdate: (data: {
    status?: string;
    paymentStatus?: string;
    trackingNumber?: string;
    notes?: string;
  }) => void;
  onClearSelection: () => void;
}

export const AdminBulkActions: React.FC<AdminBulkActionsProps> = ({
  selectedCount,
  onBulkUpdate,
  onClearSelection,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bulkData, setBulkData] = useState({
    status: "",
    paymentStatus: "",
    trackingNumber: "",
    notes: "",
  });

  const statusOptions = [
    { value: "", label: "Keep current status" },
    { value: "pending", label: "Pending", icon: Package },
    { value: "confirmed", label: "Confirmed", icon: Package },
    { value: "processing", label: "Processing", icon: Package },
    { value: "shipped", label: "Shipped", icon: Truck },
    { value: "delivered", label: "Delivered", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  const paymentStatusOptions = [
    { value: "", label: "Keep current payment status" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const quickActions = [
    {
      label: "Mark as Confirmed",
      action: () => onBulkUpdate({ status: "confirmed", notes: "Bulk confirmed by admin" }),
      icon: Package,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "Mark as Processing",
      action: () => onBulkUpdate({ status: "processing", notes: "Bulk processing started by admin" }),
      icon: Package,
      color: "bg-yellow-600 hover:bg-yellow-700",
    },
    {
      label: "Mark as Shipped",
      action: () => onBulkUpdate({ status: "shipped", notes: "Bulk shipped by admin" }),
      icon: Truck,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "Mark as Delivered",
      action: () => onBulkUpdate({ status: "delivered", notes: "Bulk delivered by admin" }),
      icon: CheckCircle,
      color: "bg-green-700 hover:bg-green-800",
    },
  ];

  const handleAdvancedUpdate = () => {
    const updateData: any = {};
    
    if (bulkData.status) updateData.status = bulkData.status;
    if (bulkData.paymentStatus) updateData.paymentStatus = bulkData.paymentStatus;
    if (bulkData.trackingNumber) updateData.trackingNumber = bulkData.trackingNumber;
    if (bulkData.notes) updateData.notes = bulkData.notes;

    if (Object.keys(updateData).length > 0) {
      onBulkUpdate(updateData);
      setBulkData({ status: "", paymentStatus: "", trackingNumber: "", notes: "" });
      setShowAdvanced(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="font-medium text-blue-900">
              {selectedCount} order{selectedCount !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-blue-700 hover:text-blue-900 h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.action}
                size="sm"
                className={`${action.color} text-white flex items-center gap-2`}
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Advanced Actions Toggle */}
      <div className="border-t border-blue-200 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-700 border-blue-300 hover:bg-blue-100"
        >
          {showAdvanced ? "Hide" : "Show"} Advanced Options
        </Button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Update */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Update Status
              </label>
              <select
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={bulkData.status}
                onChange={(e) => setBulkData({ ...bulkData, status: e.target.value })}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Status Update */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Update Payment Status
              </label>
              <select
                className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={bulkData.paymentStatus}
                onChange={(e) => setBulkData({ ...bulkData, paymentStatus: e.target.value })}
              >
                {paymentStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tracking Number */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Tracking Number
              </label>
              <Input
                placeholder="Enter tracking number..."
                value={bulkData.trackingNumber}
                onChange={(e) => setBulkData({ ...bulkData, trackingNumber: e.target.value })}
                className="border-blue-300 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Notes
              </label>
              <Input
                placeholder="Add notes to status history..."
                value={bulkData.notes}
                onChange={(e) => setBulkData({ ...bulkData, notes: e.target.value })}
                className="border-blue-300 focus:ring-blue-500"
              />
            </div>

            {/* Apply Button */}
            <div className="md:col-span-2 lg:col-span-4">
              <Button
                onClick={handleAdvancedUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!bulkData.status && !bulkData.paymentStatus && !bulkData.trackingNumber && !bulkData.notes}
              >
                Apply Changes to {selectedCount} Order{selectedCount !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
