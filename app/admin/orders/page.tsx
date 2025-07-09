"use client";

import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminOrdersDashboard } from "@/components/admin/AdminOrdersDashboard";

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout>
        <AdminOrdersDashboard />
      </AdminLayout>
    </ProtectedRoute>
  );
}
