import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/daftar");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout berhasil");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Gagal logout, coba lagi.");
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const navClass = isHomePage
    ? `fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`
    : "sticky top-0 z-50 bg-white shadow-md py-2";

  const linkClass =
    isHomePage && !isScrolled
      ? "text-white hover:text-white/80"
      : "text-gray-700 hover:text-primary-600";

  const logoClass =
    isHomePage && !isScrolled ? "text-white" : "text-primary-600";

  const navItems = [
    { title: "Beranda", path: "/" },
    { title: "Wisata", path: "/wisata" },
    { title: "UMKM", path: "/umkm" },
    { title: "Acara", path: "/acara" },
    { title: "Forum", path: "/forum" },
    { title: "Tentang", path: "/tentang" },
  ];

  return (
    <nav className={navClass}>
      <div className="container-custom">
        <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo1.png" 
              alt="Minangkabau Logo" 
              className={`h-6 w-6 object-contain ${logoClass}`} 
            />
            <span className={`text-xl font-heading font-bold ${logoClass}`}>
              Bukittinggi
            </span>
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `${linkClass} font-medium transition-colors duration-200 ${
                    isActive ? "text-primary-600 font-semibold" : ""
                  }`
                }
              >
                {item.title}
              </NavLink>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={
                      isHomePage && !isScrolled ? "text-white" : "text-gray-700"
                    }
                  >
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown
                    size={16}
                    className={
                      isHomePage && !isScrolled ? "text-white" : "text-gray-500"
                    }
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        to="/profil"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User size={16} className="mr-2" />
                        Profil Saya
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <Settings size={16} className="mr-2" />
                          Dashboard Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={handleLoginClick} className="btn btn-outline">
                  Masuk
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="btn btn-primary"
                >
                  Daftar
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${logoClass}`} />
            ) : (
              <Menu className={`h-6 w-6 ${logoClass}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
          <div className="container-custom py-6 flex flex-col h-full">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `py-2 text-lg font-medium ${
                      isActive ? "text-primary-600" : "text-gray-800"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
            <div className="mt-8 flex flex-col space-y-4">
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-4 pb-2">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profil"
                    className="flex items-center py-2 text-gray-700"
                  >
                    <User size={18} className="mr-2" />
                    Profil Saya
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center py-2 text-gray-700"
                    >
                      <Settings size={18} className="mr-2" />
                      Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center py-2 text-red-600"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="btn btn-outline w-full justify-center"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="btn btn-primary w-full justify-center"
                  >
                    Daftar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
