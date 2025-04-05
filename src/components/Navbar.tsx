import { Menu, Bell, Mail, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@context/AuthContext";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const userInitial = user?.name?.charAt(0).toUpperCase();

  return (
    <nav className="w-full bg-theme theme-border-b text-theme p-4 shadow-lg flex items-center justify-between">
      {/* Left - Hamburger Button */}
      <button
        className="p-2 rounded hover:opacity-80 transition-all duration-300"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      {/* Right - Search Bar, Notifications, Messages, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 pl-10 bg-surface rounded-lg  focus:outline-none focus:ring-2 theme-border transition-all"
          />
        </div>

        {/* Notification & Message Icons */}
        <button className="relative p-2 rounded bg-primary-hover transition-all">
          <Bell size={24} />
        </button>
        <button className="relative p-2 rounded  bg-primary-hover transition-all">
          <Mail size={24} />
        </button>

        {/* Avatar Icon */}
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="p-2 rounded-full transition-all">
            <div className="w-8 h-8 rounded-full bg-primary text-theme flex items-center justify-center">
              {userInitial}
            </div>
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 bg-surface rounded-lg shadow-lg p-2 w-40">
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="block p-2 w-full text-left bg-primary-hover rounded mb-2"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="block p-2 w-full text-left bg-primary-hover rounded mb-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
