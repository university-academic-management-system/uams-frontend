import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./components/Dashboard";
import AccountsView from "./components/AccountsView";
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
    // Load persisted session if present
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserSession;

        // Check if we have a valid token in localStorage (additional safety check)
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");

        if (parsed?.isLoggedIn && parsed.authData && token && role) {
          setSession(parsed);
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
        // Also check for legacy localStorage items
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");
        const tenantId = localStorage.getItem("tenantId");

        if (token && role && tenantId) {
          const authData: AuthData = {
            token,
            role,
            tenantId,
            universityId: localStorage.getItem("universityId") || "",
            facultyId: localStorage.getItem("facultyId") || null,
            departmentId: localStorage.getItem("departmentId") || null,
            email: localStorage.getItem("userEmail") || undefined,
          };

          const sessionData: UserSession = {
            authData,
            isLoggedIn: true,
          };

          setSession(sessionData);
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
      setLoading(false);
    }
  }, []);

  const handleLogin = (data: AuthData) => {
    // Store all data in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("tenantId", data.tenantId);

    if (data.universityId) {
      localStorage.setItem("universityId", data.universityId);
    }
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
    const sessionData: UserSession = {
      authData: data,
      isLoggedIn: true,
    };

    // Store in session storage
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setSession(sessionData);
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
              <Dashboard authData={session.authData} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="admin" element={<AccountsPage />} />
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

// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
// import Dashboard from "./components/Dashboard";
// import AccountsView from "./components/AccountsView";
// // import StudentsView from "./components/StudentsView";
// import StudentsPage from "./pages/StudentsPage";
// import StaffView from "./components/StaffView";
// import PaymentsView from "./components/PaymentsView";
// import RolesPermissionsView from "./components/RolesPermissionsView";
// import AnnouncementsView from "./components/AnnouncementsView";
// import AccountsPage from "./pages/AccountPage";
// import SettingsView from "./components/SettingsView";
// import { UserSession } from "./types";
// import DashboardHome from "./components/DashboardHome";

// const SESSION_KEY = "u_university_session";

// const App: React.FC = () => {
//   const [session, setSession] = useState<UserSession>({
//     username: "",
//     isLoggedIn: false,
//   });

//   useEffect(() => {
//     // Load persisted session if present
//     try {
//       const raw = localStorage.getItem(SESSION_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw) as UserSession;
//         if (parsed?.isLoggedIn) setSession(parsed);
//       }
//     } catch (e) {
//       // ignore
//     }
//   }, []);

//   const handleLogin = (username: string, remember = false) => {
//     const s = { username, isLoggedIn: true } as UserSession;
//     setSession(s);
//     if (remember) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
//   };

//   const handleLogout = () => {
//     setSession({ username: "", isLoggedIn: false });
//     localStorage.removeItem(SESSION_KEY);
//   };

//   return (
//     <div className="min-h-screen">
//       <Routes>
//         <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

//         <Route
//           path="/dashboard/*"
//           element={
//             session.isLoggedIn ? (
//               <Dashboard username={session.username} onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         >
//           <Route index element={<DashboardHome />} />
//           <Route path="admin" element={<AccountsPage />} />
//           <Route path="students" element={<StudentsPage />} />
//           <Route path="staff" element={<StaffView />} />
//           <Route path="payments" element={<PaymentsView />} />
//           <Route path="roles" element={<RolesPermissionsView />} />
//           <Route path="announcements" element={<AnnouncementsView />} />
//           <Route path="settings" element={<SettingsView />} />
//         </Route>

//         <Route
//           path="/"
//           element={
//             <Navigate
//               to={session.isLoggedIn ? "/dashboard" : "/login"}
//               replace
//             />
//           }
//         />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;
