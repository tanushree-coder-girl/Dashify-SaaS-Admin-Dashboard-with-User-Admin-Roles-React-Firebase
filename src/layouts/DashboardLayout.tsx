import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@components/Sidebar";
import Navbar from "@components/Navbar";
import ThemeSwitcher from "@components/ThemeSwitcher";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 998);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 998);
      setIsSidebarOpen(window.innerWidth >= 998);
    };

    handleResize(); // initial check
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
    <div className="flex h-screen bg-theme text-theme overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <Sidebar closeSidebar={closeSidebar} />
      </div>

      {/* Overlay for mobile view */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-30"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Close Button on small screens */}
      {isSidebarOpen && isMobile && (
        <button
          onClick={closeSidebar}
          className="fixed top-4 right-8 z-50 text-theme text-xl theme-border w-12 h-12 rounded-full shadow-md bg-primary-hover hover:scale-110 transition-all duration-300 outline-none ring-2 ring-primary"
        >
          ✖
        </button>
      )}

      {/* Main layout with Navbar + Main content */}
      <div
        className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : ""
        }`}
      >
        {/* Navbar */}
        <div
          className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "md:ml-64" : ""
          }`}
        >
          <Navbar toggleSidebar={toggleSidebarHandler} />
        </div>

        {/* Main content */}
        <main
          className={`flex-grow bg-theme p-6 pt-20 mt-6 transition-all duration-300 ease-in-out overflow-auto ${
            isSidebarOpen ? "w-[100vw] md:w-auto" : " w-[100vw]"
          } `}
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
