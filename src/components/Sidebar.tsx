import {
  Home,
  User,
  Users,
  CreditCard,
  HelpCircle,
  Package,
  CalendarCheck,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import logo from "@assets/images/dashify_logo.png";
import useThemeStore from "@store/themeStore";

// 👇 Accept the prop for sidebar closing
type SidebarProps = {
  closeSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeStore();

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home size={20} />,
      isAdmin: false,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <User size={20} />,
      isAdmin: false,
    },
    {
      name: "Bookings",
      path: "/dashboard/bookings",
      icon: <CalendarCheck size={20} />,
      isAdmin: false,
    },
    {
      name: "Payments",
      path: "/dashboard/payments",
      icon: <CreditCard size={20} />,
      isAdmin: false,
    },
    {
      name: "Services",
      path: "/dashboard/admin/services",
      icon: <Package size={20} />,
      isAdmin: true,
    },
    {
      name: "Manage User",
      path: "/dashboard/admin/users",
      icon: <Users size={20} />,
      isAdmin: true,
    },
    {
      name: "Support",
      path: "/dashboard/help",
      icon: <HelpCircle size={20} />,
      isAdmin: false,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-surface text-theme p-5 shadow-md">
      <h2
        className="text-xl font-bold mb-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ filter: `invert(${theme.includes("light") ? 0 : 1})` }}
          className="w-32 h-auto"
        />
      </h2>
      <nav className="space-y-4">
        {navLinks
          .filter((link) => (isAdmin ? true : !link.isAdmin))
          .map((link, index) => (
            <button
              key={index}
              onClick={() => {
                if (window.innerWidth < 998) closeSidebar(); // close on mobile
                navigate(link.path); // redirect
              }}
              className={`w-full text-left flex items-center gap-3 p-2 rounded transition-all duration-300 ${
                location.pathname === link.path
                  ? "bg-primary text-theme"
                  : "bg-primary-hover"
              }`}
            >
              {link.icon} {link.name}
            </button>
          ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
