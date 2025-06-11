import React from "react";
import ProtectedRoute from "./ProtectedRoute";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // Using ProtectedRoute with admin role requirement
  return <ProtectedRoute requiredRoles={["admin"]}>{children}</ProtectedRoute>;
};

export default AdminRoute;
