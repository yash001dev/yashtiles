"use client";

import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
              <p className="text-2xl font-bold text-yellow-600">0</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
              <p className="text-2xl font-bold text-green-600">$0</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-500">Customers</h3>
              <p className="text-2xl font-bold text-pink-600">0</p>
              <p className="text-xs text-gray-500 mt-1">Active users</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/orders"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-500 mt-1">
                  View, search, and update order statuses
                </p>
              </Link>

              <Link
                href="/admin/users"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900">User Management</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage customer accounts and permissions
                </p>
              </Link>
              
              <Link
                href="/admin/analytics"
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h3 className="font-medium text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Sales reports and business insights
                </p>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
