import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Map,
  ShoppingBag,
  Calendar,
  MessageSquare,
  Users,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import AuthDebugger from "./debug/AuthDebugger";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Destinasi Wisata", href: "/admin/wisata", icon: Map },
    { name: "UMKM", href: "/admin/umkm", icon: ShoppingBag },
    { name: "Acara", href: "/admin/acara", icon: Calendar },
    { name: "Forum", href: "/admin/forum", icon: MessageSquare },
    { name: "Pengguna", href: "/admin/users", icon: Users },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 flex z-40">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-xl font-bold text-primary-600">
                  Admin Dashboard
                </span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive
                          ? "bg-primary-100 text-primary-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent
                        className={`mr-4 flex-shrink-0 h-6 w-6 ${
                          isActive
                            ? "text-primary-600"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 group block w-full text-left"
              >
                <div className="flex items-center">
                  <div>
                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.fullName || "User"}
                    </p>
                    <div className="flex items-center text-sm font-medium text-red-600 hover:text-red-800">
                      <LogOut className="mr-1 h-4 w-4" /> Logout
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-xl font-bold text-primary-600">
                  Admin Dashboard
                </span>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-primary-100 text-primary-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          isActive
                            ? "text-primary-600"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div>
                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.fullName || "User"}
                    </p>
                    <div className="flex items-center text-xs font-medium text-red-600 hover:text-red-800">
                      <LogOut className="mr-1 h-3 w-3" /> Logout
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between">
          <button
            className="h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="pr-4">
            <span className="text-lg font-bold text-primary-600">Admin</span>
          </div>
        </div>
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-white">
          {children}
        </main>
        {/* Add the AuthDebugger here */}
        <AuthDebugger />
      </div>
    </div>
  );
};

export default AdminLayout;
