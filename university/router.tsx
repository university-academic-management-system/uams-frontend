import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SessionGuard from "./components/SessionGuard";
import Dashboard from "./components/Dashboard";
import DashboardHome from "./components/DashboardHome";
import AccountsPage from "./pages/AccountPage";
import StudentsPage from "./pages/StudentsPage";
import StaffView from "./components/StaffView";
import PaymentsView from "./components/PaymentsView";
import RolesPermissionsView from "./components/RolesPermissionsView";
import AnnouncementsView from "./components/AnnouncementsView";
import SettingsView from "./components/SettingsView";

const router = createBrowserRouter([
  // Public route
  {
    path: "/login",
    element: <LoginPage />,
  },
  
  // Protected routes
  {
    path: "/",
    element: <SessionGuard />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "admin",
            element: <AccountsPage />,
          },
          {
            path: "students",
            element: <StudentsPage />,
          },
          {
            path: "staff",
            element: <StaffView />,
          },
          {
            path: "payments",
            element: <PaymentsView />,
          },
          {
            path: "roles",
            element: <RolesPermissionsView />,
          },
          {
            path: "announcements",
            element: <AnnouncementsView />,
          },
          {
            path: "settings",
            element: <SettingsView />,
          },
        ],
      },
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
  
  // Catch all
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
], {
  basename: "/university-admin"
});

export default router;
