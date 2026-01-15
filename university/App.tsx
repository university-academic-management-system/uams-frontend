import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import StaffView from "./components/StaffView";
import PaymentsView from "./components/PaymentsView";
import RolesPermissionsView from "./components/RolesPermissionsView";
import AnnouncementsView from "./components/AnnouncementsView";
import AccountsPage from "./pages/AccountPage";
import SettingsView from "./components/SettingsView";
import { UserSession, AuthData } from "./components/types";
import DashboardHome from "./components/DashboardHome";

const SESSION_KEY = "u_university_session";
 
const App: React.FC = () => {
  const [session, setSession] = useState<UserSession>({
    authData: null,
    isLoggedIn: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 App.tsx - useEffect loading session");

    const loadSession = () => {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as UserSession;

          if (parsed?.isLoggedIn && parsed.authData?.role) {
            console.log("✅ Loaded valid session from localStorage");
            console.log("✅ Role:", parsed.authData.role);
            setSession(parsed);
          } else {
            console.warn("⚠️ Invalid session in localStorage, clearing...");
            clearSession();
          }
        } else {
          console.log("ℹ️ No session in localStorage");
        }
      } catch (e) {
        console.error("❌ Error loading session:", e);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    const clearSession = () => {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("tenantId");
      localStorage.removeItem("universityId");
      localStorage.removeItem("facultyId");
      localStorage.removeItem("departmentId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("loginEmail");
    };

    loadSession();
  }, []);

  // FIXED: Accept AuthData instead of ApiLoginResponse
  const handleLogin = (authData: AuthData) => {
    console.log("✅ App.tsx - handleLogin called with AuthData:", authData);

    // Store in localStorage
    localStorage.setItem("token", authData.token);
    localStorage.setItem("userRole", authData.role);
    localStorage.setItem("tenantId", authData.tenantId || "");
    localStorage.setItem("universityId", authData.universityId);
    localStorage.setItem("userEmail", authData.email || "");

    if (authData.facultyId) {
      localStorage.setItem("facultyId", authData.facultyId);
    }
    if (authData.departmentId) {
      localStorage.setItem("departmentId", authData.departmentId);
    }

    // Create session
    const sessionData: UserSession = {
      authData,
      isLoggedIn: true,
    };

    console.log("✅ Storing session data:", sessionData);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setSession(sessionData);
  };

  const handleLogout = () => {
    console.log("🚪 Logging out...");

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

    setSession({ authData: null, isLoggedIn: false });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-slate-500">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Routes>
        <Route
          path="/login"
          element={
            session.isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/dashboard/*"
          element={
            session.isLoggedIn && session.authData ? (
              <>
                {console.log(
                  "🚀 Rendering Dashboard with authData:",
                  session.authData
                )}
                {console.log("🚀 authData.role:", session.authData?.role)}
                <Dashboard
                  authData={session.authData}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="staff" element={<StaffView />} />
          <Route path="payments" element={<PaymentsView />} />
          <Route path="roles" element={<RolesPermissionsView />} />
          <Route path="announcements" element={<AnnouncementsView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to={session.isLoggedIn ? "/dashboard" : "/login"}
              replace
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
