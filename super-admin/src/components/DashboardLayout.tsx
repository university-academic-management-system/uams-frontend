import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * Dashboard layout component that wraps authenticated pages.
 * Uses <Outlet /> to render child route content.
 */
const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Get active page from pathname
  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/university") return "university";
    if (path === "/payments") return "payments";
    if (path === "/notifications") return "notifications";
    if (path === "/activity-log") return "activity-log";
    if (path === "/system-settings") return "system-settings";
    return "dashboard";
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        position: "relative",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        activePage={getActivePage()}
        logoSrc="/assets/logo.png"
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onLogout={handleLogout}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 12,
          }}
        />
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isMobile ? "0" : "256px",
          transition: "margin-left 0.3s ease-in-out",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <Topbar
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        <main
          style={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
