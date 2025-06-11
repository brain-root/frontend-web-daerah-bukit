import { NavLink, Link } from "react-router-dom";
import {
  Home,
  Map,
  ShoppingBag,
  Calendar,
  MessageCircle,
  Users,
  Settings,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface AdminSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const AdminSidebar = ({ isOpen, closeSidebar }: AdminSidebarProps) => {
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <Home size={20} /> },
    { name: "Wisata", path: "/admin/wisata", icon: <Map size={20} /> },
    { name: "UMKM", path: "/admin/umkm", icon: <ShoppingBag size={20} /> },
    { name: "Acara", path: "/admin/acara", icon: <Calendar size={20} /> },
    { name: "Forum", path: "/admin/forum", icon: <MessageCircle size={20} /> },
    { name: "Pengguna", path: "/admin/users", icon: <Users size={20} /> },
    {
      name: "Pengaturan",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-white shadow-lg transition-transform duration-300 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center">
            <Map className="h-6 w-6 text-primary-600" />{" "}
            <span className="ml-2 text-lg font-bold text-gray-800">
              Bukittinggi Admin
            </span>
          </div>
          <button
            className="md:hidden"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin info */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-medium">
                {user?.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  end={item.path === "/admin"}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}

            {/* Divider */}
            <li className="my-2 border-t border-gray-200"></li>

            {/* Back to main site link */}
            <li>
              <Link
                to="/"
                className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="mr-3">
                  <ExternalLink size={20} />
                </span>
                Kembali ke Situs Utama
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
