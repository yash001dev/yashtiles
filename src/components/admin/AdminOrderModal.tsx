"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Package, User, CreditCard, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { Order } from "@/types";
import { UpdateOrderData } from "@/lib/admin-orders";

interface AdminOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateOrderData) => void;
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [editedOrder, setEditedOrder] = useState<Partial<UpdateOrderData>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "items" | "shipping" | "payment">("overview");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setEditedOrder({
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        shippingCost: order.shippingCost,
        taxAmount: order.taxAmount,
        trackingNumber: order.trackingNumber || "",
        notes: order.notes || "",
        shippingAddress: { ...order.shippingAddress },
        items: order.items.map(item => ({ ...item })),
      });
    }
  }, [order]);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(editedOrder);
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setEditedOrder({
      ...editedOrder,
      shippingAddress: {
        ...editedOrder.shippingAddress,
        [field]: value,
      },
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...(editedOrder.items || [])];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setEditedOrder({
      ...editedOrder,
      items: updatedItems,
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Package },
    { id: "items", label: "Items", icon: Package },
    { id: "shipping", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Order {order.orderNumber}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-gray-500">
                  Created: {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editedOrder.status || ""}
                    onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value as any })}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editedOrder.paymentStatus || ""}
                    onChange={(e) => setEditedOrder({ ...editedOrder, paymentStatus: e.target.value as any })}
                  >
                    {paymentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <Input
                    value={editedOrder.trackingNumber || ""}
                    onChange={(e) => setEditedOrder({ ...editedOrder, trackingNumber: e.target.value })}
                    placeholder="Enter tracking number..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editedOrder.totalAmount || 0}
                    onChange={(e) => setEditedOrder({ ...editedOrder, totalAmount: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Cost ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editedOrder.shippingCost || 0}
                    onChange={(e) => setEditedOrder({ ...editedOrder, shippingCost: parseFloat(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Amount ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editedOrder.taxAmount || 0}
                    onChange={(e) => setEditedOrder({ ...editedOrder, taxAmount: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={editedOrder.notes || ""}
                  onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
                  placeholder="Add order notes..."
                />
              </div>

              {/* Status History */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Status History</h3>
                <div className="space-y-2">
                  {order.statusHistory.map((status, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium capitalize">{status.status}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(status.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Items Tab */}
          {activeTab === "items" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
              {(editedOrder.items || []).map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product ID
                      </label>
                      <Input
                        value={item.productId || ""}
                        onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <Input
                        type="number"
                        value={item.quantity || 1}
                        onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.price || 0}
                        onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <Input
                        value={item.size || ""}
                        onChange={(e) => handleItemChange(index, "size", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frame Type
                      </label>
                      <Input
                        value={item.frameType || ""}
                        onChange={(e) => handleItemChange(index, "frameType", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <Input
                        value={item.imageUrl || ""}
                        onChange={(e) => handleItemChange(index, "imageUrl", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === "shipping" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <Input
                    value={editedOrder.shippingAddress?.firstName || ""}
                    onChange={(e) => handleAddressChange("firstName", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <Input
                    value={editedOrder.shippingAddress?.lastName || ""}
                    onChange={(e) => handleAddressChange("lastName", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={editedOrder.shippingAddress?.email || ""}
                    onChange={(e) => handleAddressChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input
                    value={editedOrder.shippingAddress?.phone || ""}
                    onChange={(e) => handleAddressChange("phone", e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <Input
                    value={editedOrder.shippingAddress?.street || ""}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    value={editedOrder.shippingAddress?.city || ""}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <Input
                    value={editedOrder.shippingAddress?.state || ""}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <Input
                    value={editedOrder.shippingAddress?.zipCode || ""}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <Input
                    value={editedOrder.shippingAddress?.country || ""}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment ID
                  </label>
                  <Input
                    value={editedOrder.paymentId || ""}
                    onChange={(e) => setEditedOrder({ ...editedOrder, paymentId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <Input
                    value={editedOrder.paymentMethod || ""}
                    onChange={(e) => setEditedOrder({ ...editedOrder, paymentMethod: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <Input
                    value={order.txnid?.toString() || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Delivery
                  </label>
                  <Input
                    type="date"
                    value={editedOrder.estimatedDelivery ? new Date(editedOrder.estimatedDelivery).toISOString().split('T')[0] : ""}
                    onChange={(e) => setEditedOrder({ ...editedOrder, estimatedDelivery: e.target.value ? new Date(e.target.value) : undefined })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
