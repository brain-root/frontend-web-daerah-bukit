import React, { ReactNode, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAuth } from "../../../contexts/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <AdminHeader openSidebar={() => setSidebarOpen(true)} />

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
