import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import {
  LogOut,
  LayoutDashboard,
  Users,
  UserSquare2,
  CreditCard,
  ShieldCheck,
  Megaphone,
  Settings,
  Search,
  Bell,
  GraduationCap,
  MessageSquareText,
  Menu,
  X,
} from "lucide-react";
import ChatBot from "./ChatBot";

interface DashboardProps {
  authData: {
    token: string;
    role: string;
    tenantId: string;
    universityId: string;
    facultyId: string | null;
    departmentId: string | null;
    email?: string;
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ authData, onLogout }) => {
  console.log("🎯 Dashboard Component - START");
  console.log("🎯 authData from props:", authData);
  console.log("🎯 authData.role:", authData?.role);

  const [showChat, setShowChat] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If authData is undefined or role is missing, show loading
  if (!authData || !authData.role) {
    console.warn("⚠️ Dashboard: authData or role is missing");
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-slate-500 mb-2">Loading user session...</p>
          <p className="text-xs text-slate-400">Please wait...</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const getUserEmail = () => {
    return (
      localStorage.getItem("userEmail") || authData.email || "admin@uniedu.com"
    );
  };

  const getUserDisplayName = () => {
    const role = authData.role.toUpperCase();

    switch (role) {
      case "UNIVERSITYADMIN":
        return "University Admin";
      case "ADMIN":
        return "Admin";
      case "SUPER_ADMIN":
        return "Super Admin";
      case "FACULTY":
        return "Faculty Member";
      case "STUDENT":
        return "Student";
      default:
        return "User";
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Admins", path: "/dashboard/accounts", icon: UserSquare2 },
    { name: "Staff", path: "/dashboard/staff", icon: Users },
    { name: "Students", path: "/dashboard/students", icon: GraduationCap },
    { name: "Payments", path: "/dashboard/payments", icon: CreditCard },
    {
      name: "Roles & Permissions",
      path: "/dashboard/roles",
      icon: ShieldCheck,
    },
    {
      name: "Announcements",
      path: "/dashboard/announcements",
      icon: Megaphone,
    },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const getFilteredNavItems = () => {
    console.log("🔍 Filtering nav items for role:", authData.role);

    const privilegedRoles = ["ADMIN", "SUPER_ADMIN", "UNIVERSITYADMIN"];
    const userRole = authData.role.toUpperCase();

    console.log("🔍 User role (uppercase):", userRole);
    console.log("🔍 Is privileged?", privilegedRoles.includes(userRole));

    if (privilegedRoles.includes(userRole)) {
      console.log("✅ Showing ALL navigation items including Accounts");
      return navItems;
    }

    console.log("ℹ️ User not privileged, hiding Accounts");
    return navItems.filter((item) => item.name !== "Accounts");
  };

  const filteredNavItems = getFilteredNavItems();

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col z-[110] 
        transition-transform duration-300 transform lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}assets/uphcscLG.png`}
              alt="UNIPORT Computer Science"
              className="h-12 w-auto object-contain"
            />
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive: isActivePath }) => `
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  isActivePath
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white px-4 md:px-8 py-4 flex items-center justify-between border-b border-slate-200 shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={() => navigate("/dashboard/settings")}
              className="flex items-center gap-3 border-l border-slate-200 pl-6 group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {getUserDisplayName()}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {getUserEmail()}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                <UserSquare2 className="w-6 h-6 text-blue-600" />
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

        {/* Chat Toggle */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-40 group"
        >
          {showChat ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquareText className="w-6 h-6" />
          )}
        </button>

        {showChat && (
          <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-6 w-full md:w-[400px] h-[600px] max-h-[80vh] bg-white shadow-2xl z-[150] rounded-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-300">
            <ChatBot onClose={() => setShowChat(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
