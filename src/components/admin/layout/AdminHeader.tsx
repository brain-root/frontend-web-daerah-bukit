import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, User, LogOut, Settings, Home } from "lucide-react";

interface AdminHeaderProps {
  openSidebar: () => void;
}

const AdminHeader = ({ openSidebar }: AdminHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Hamburger menu for mobile */}
        <div className="flex items-center">
          <button
            onClick={openSidebar}
            className="md:hidden text-gray-500 focus:outline-none mr-4"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>

          {/* Left side - Breadcrumb (for desktop) */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
        </div>

        {/* Middle - Back to main site link */}
        <div className="flex-1 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Home size={16} className="mr-1.5" />
            <span>Kembali ke Situs Utama</span>
          </Link>
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium">
                  {user?.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.fullName}
              </span>
            </button>

            {/* Dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="block px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  {user?.email}
                </div>
                <a
                  href="/admin/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={16} className="mr-3" />
                  Profile
                </a>
                <a
                  href="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings size={16} className="mr-3" />
                  Settings
                </a>
                <Link
                  to="/"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Home size={16} className="mr-3" />
                  Situs Utama
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
