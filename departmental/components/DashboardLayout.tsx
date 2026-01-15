import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ViewType } from "./types";
import { useAuth } from "../context/AuthProvider";

const DashboardLayout: React.FC = () => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!authData) return null;

  // Get user display name
  const currentUser = authData.email 
    ? authData.email.split("@")[0] 
    : authData.role === "UNIVERSITYADMIN" ? "Admin" : "User";

  const getActiveViewFromPath = (pathname: string): ViewType => {
    const routeMap: Record<string, ViewType> = {
      "/dashboard": "Dashboard",
      "/program-courses": "Program & Courses",
      "/students": "Students",
      "/staff": "Staff",
      "/payments": "Payments",
      "/roles-permissions": "ID Card Management",
      "/announcements": "Announcements",
      "/settings": "Settings",
      "/notifications": "Notifications",
    };
    
    // Check if path starts with one of the keys (for nested sub-routes if any)
    const exactMatch = routeMap[pathname];
    if (exactMatch) return exactMatch;

    return "Dashboard";
  };

  const activeView = getActiveViewFromPath(location.pathname);

  const handleViewChange = (view: ViewType) => {
    const routeMap: Record<ViewType, string> = {
      Dashboard: "/dashboard",
      "Program & Courses": "/program-courses",
      Students: "/students",
      Staff: "/staff",
      Payments: "/payments",
      "ID Card Management": "/roles-permissions",
      Announcements: "/announcements",
      Settings: "/settings",
      Notifications: "/notifications",
    };
    navigate(routeMap[view] || "/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onLogout={logout}
        authData={authData}
      />
      <main className="flex-1 ml-64 bg-[#F8FAFC]">
        <Header
          onViewChange={handleViewChange}
          currentUser={currentUser}
          onLogout={logout}
          authData={authData}
        />
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
