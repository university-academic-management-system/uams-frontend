import { createBrowserRouter, Navigate } from "react-router";
import SessionGuard from "./components/SessionGuard";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import University from "./pages/University";
import Payments from "./pages/Payments";
import SystemSettings from "./pages/SystemSettings";
import Notifications from "./pages/Notifications";
import ActivityLog from "./pages/ActivityLog";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerificationCode from "./pages/auth/VerificationCode";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetSuccess from "./pages/auth/ResetSuccess";

const router = createBrowserRouter([
  // Public auth routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verification",
    element: <VerificationCode />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/reset-success",
    element: <ResetSuccess />,
  },

  // Protected dashboard routes
  {
    path: "/",
    element: <SessionGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "university",
            element: <University />,
          },
          {
            path: "payments",
            element: <Payments />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "activity-log",
            element: <ActivityLog />,
          },
          {
            path: "system-settings",
            element: <SystemSettings />,
          },
        ],
      },
    ],
  },

  // Catch all - redirect to dashboard or login
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
], {
  basename: "/super-admin"
});

export default router;
