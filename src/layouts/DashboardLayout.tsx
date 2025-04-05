import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@components/Sidebar";
import Navbar from "@components/Navbar";
import ThemeSwitcher from "@components/ThemeSwitcher";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 998) {
        setIsSidebarOpen(false); // Hide sidebar on small screens
      } else {
        setIsSidebarOpen(true); // Show sidebar on large screens
      }
    };

    handleResize(); // Call on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebarHandler = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-theme text-theme">
      {/* Sidebar Area */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 transition-all duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile view */}
      {isSidebarOpen && window.innerWidth < 998 && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-30"
          onClick={closeSidebar}
        ></div>
      )}

      {isSidebarOpen && window.innerWidth < 468 && (
        <button
          onClick={closeSidebar}
          className="fixed top-4 right-8 z-50 text-theme text-xl theme-border w-12 h-12 rounded-full shadow-md bg-primary-hover hover:scale-110 transition-all duration-300 outline-none ring-2 ring-primary"
        >
          ✖
        </button>
      )}

      {/* Content Area */}
      <div
        className={`flex flex-col flex-grow transition-all duration-300 
        ${isSidebarOpen ? "md:ml-64 md:w-[calc(100% - 64px)]" : "ml-0 w-full"}`}
      >
        <div
          className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64 md:w-[calc(100% - 64px)]" : "ml-0 w-full"
          }`}
        >
          <Navbar toggleSidebar={toggleSidebarHandler} />
        </div>

        {/* Main Content */}
        <main
          className={`flex-grow bg-theme p-6 pt-20 mt-6 transition-all duration-300`}
        >
          <Outlet />
        </main>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
};

export default DashboardLayout;
