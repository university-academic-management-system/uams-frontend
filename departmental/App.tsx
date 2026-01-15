import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import Login from "./components/Login";
import { StatCard } from "./components/StatCard";
import { AnnouncementList } from "./components/AnnouncementList";
import ProgramCoursesPage from "./pages/ProgramCoursesPage";
import { StudentsView } from "./pages/StudentsView";
import { StaffView } from "./components/StaffView";
import { AnnouncementsView } from "./components/AnnouncementsView";
import PaymentsPage from "./pages/PaymentsPage"; //here is the initial payment page mounted 👈
import { SettingsView } from "./components/SettingsView";
import { NotificationsView } from "./components/NotificationsView";
import { RolesView } from "./components/RolesView";
import {
  Users,
  CreditCard,
  UserCheck,
  TrendingUp,
  Building2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Announcement,
  ChartDataItem,
  ViewType,
  AuthData,
} from "./components/types";
import StatsContainer from "./components/StatsContainer";

const SESSION_KEY = "uniedu_session";

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Session Setup Complete",
    description:
      "Academic session 2024/2025 has been successfully initialized for the department.",
    date: "2025-01-02",
  },
  {
    id: "2",
    title: "New Course Prerequisites",
    description:
      "Updated prerequisites for CSC 301. Please review the course catalog.",
    date: "2025-01-05",
  },
];

const REVENUE_DATA: ChartDataItem[] = [
  { year: "2024", value: 50 },
  { year: "2025", value: 25 },
  { year: "2026", value: 75 },
  { year: "2027", value: 85 },
  { year: "2028", value: 30 },
  { year: "2029", value: 70 },
];

const GROWTH_DATA: ChartDataItem[] = [
  { year: "2024", value: 500 },
  { year: "2025", value: 250 },
  { year: "2026", value: 750 },
  { year: "2027", value: 850 },
  { year: "2028", value: 300 },
  { year: "2029", value: 700 },
];

// UniEduLogo Component
export const UniEduLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="60"
      y="36"
      fontSize="32"
      fontWeight="bold"
      textAnchor="middle"
      fill="#1d76d2"
      fontFamily="Inter"
    >
      uε
    </text>
    <text
      x="60"
      y="46"
      fontSize="10"
      fontWeight="600"
      textAnchor="middle"
      fill="#1e293b"
      fontFamily="Inter"
    >
      uniedu
    </text>
  </svg>
);

const App: React.FC = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load persisted session on app startup
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);

        // Check if we have a valid token in localStorage
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");

        if (session?.authData && token && role) {
          setAuthData(session.authData);
        } else {
          // Clear invalid session
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          localStorage.removeItem("tenantId");
          localStorage.removeItem("universityId");
          localStorage.removeItem("facultyId");
          localStorage.removeItem("departmentId");
          localStorage.removeItem("userEmail");
        }
      } else {
        // Also check for individual localStorage items
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        const tenantId = localStorage.getItem("tenantId");

        if (token && role && tenantId) {
          const loadedAuthData: AuthData = {
            token,
            role,
            tenantId,
            universityId: localStorage.getItem("universityId") || "",
            facultyId: localStorage.getItem("facultyId") || null,
            departmentId: localStorage.getItem("departmentId") || null,
            email: localStorage.getItem("userEmail") || undefined,
          };

          setAuthData(loadedAuthData);

          // Store in session storage for consistency
          const sessionData = {
            authData: loadedAuthData,
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        }
      }
    } catch (e) {
      console.error("Error loading session:", e);
      // Clear corrupted data
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("tenantId");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (data: AuthData) => {
    // Store all data in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("tenantId", data.tenantId);
    localStorage.setItem("universityId", data.universityId);

    if (data.facultyId) {
      localStorage.setItem("facultyId", data.facultyId);
    }
    if (data.departmentId) {
      localStorage.setItem("departmentId", data.departmentId);
    }
    if (data.email) {
      localStorage.setItem("userEmail", data.email);
    } else {
      // Store the email from login form if not in response
      const email = localStorage.getItem("loginEmail");
      if (email) {
        localStorage.setItem("userEmail", email);
        localStorage.removeItem("loginEmail");
      }
    }

    // Create session object
    const sessionData = {
      authData: data,
    };

    // Store in session storage
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setAuthData(data);
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tenantId");
    localStorage.removeItem("universityId");
    localStorage.removeItem("facultyId");
    localStorage.removeItem("departmentId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("loginEmail");

    setAuthData(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d76d2] mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter basename="/department-admin">

      {!authData ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <DashboardLayout authData={authData} onLogout={handleLogout} />
      )}
    </BrowserRouter>
  );
};

interface DashboardLayoutProps {
  authData: AuthData;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  authData,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [announcements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  // Get user display name from auth data
  const getCurrentUser = () => {
    if (authData.email) {
      return authData.email.split("@")[0]; // Get username from email
    }
    return authData.role === "UNIVERSITYADMIN" ? "Admin" : "User";
  };

  const currentUser = getCurrentUser();

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
    return routeMap[pathname] || "Dashboard";
  };

  const pathname = window.location.pathname;
  const activeView = getActiveViewFromPath(pathname);

  const renderContent = (view: ViewType) => {
    switch (view) {
      case "Dashboard":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* User info banner */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Welcome back, {currentUser}!
                  </h2>
                  <p className="text-slate-500 mt-1">
                    Logged in as{" "}
                    <span className="font-semibold text-[#1d76d2]">
                      {authData.role}
                    </span>
                    {authData.universityId && (
                      <span className="ml-3">
                        University ID:{" "}
                        <span className="font-mono text-sm">
                          {authData.universityId.substring(0, 8)}...
                        </span>
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100">
                    Tenant: {authData.tenantId.substring(0, 8)}...
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total Students"
                value="5,000"
                icon={<Users size={24} />}
                bgColor="bg-orange-50"
              />
              <StatCard
                label="Total Revenue (Dept)"
                value="₦38,000,000"
                icon={<CreditCard size={24} />}
                bgColor="bg-emerald-50"
              />
              <StatCard
                label="Academic Staff"
                value="100"
                icon={<UserCheck size={24} />}
                bgColor="bg-sky-50"
              />
            </div> */}
            <StatsContainer />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp size={20} className="text-emerald-500" />{" "}
                      Department Performance
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fee collection vs Projections
                    </p>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={REVENUE_DATA}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#22c55e"
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: "#22c55e",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="lg:col-span-1">
                <AnnouncementList announcements={announcements} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-slate-800">
                    Enrollment Growth
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Student registration trends
                  </p>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={GROWTH_DATA}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        fill: "#3b82f6",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case "Program & Courses":
        return <ProgramCoursesPage />;
      case "Students":
        return <StudentsView />;
      case "Staff":
        return <StaffView />;
      case "Payments":
        return <PaymentsPage />;
      case "ID Card Management":
        return <RolesView />;
      case "Announcements":
        return <AnnouncementsView />;
      case "Settings":
        return <SettingsView />;
      case "Notifications":
        return <NotificationsView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <Building2 size={48} className="mb-4 text-slate-200" />
            <h2 className="text-xl font-semibold">{view} Section</h2>
            <p className="mt-2">Connecting to departmental resources...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onLogout={onLogout}
      />
      <main className="flex-1 ml-64 bg-[#F8FAFC]">
        <Header
          onViewChange={handleViewChange}
          currentUser={currentUser}
          onLogout={onLogout}
        />
        <div className="p-8 max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/dashboard" element={renderContent("Dashboard")} />
            <Route
              path="/program-courses"
              element={renderContent("Program & Courses")}
            />
            <Route path="/students" element={renderContent("Students")} />
            <Route path="/staff" element={renderContent("Staff")} />
            <Route path="/payments" element={renderContent("Payments")} />
            <Route
              path="/roles-permissions"
              element={renderContent("ID Card Management")}
            />
            <Route
              path="/announcements"
              element={renderContent("Announcements")}
            />
            <Route path="/settings" element={renderContent("Settings")} />
            <Route
              path="/notifications"
              element={renderContent("Notifications")}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
