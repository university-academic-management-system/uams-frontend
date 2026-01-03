import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SessionGuard from "./components/SessionGuard";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProgramCoursesPage from "./pages/ProgramCoursesPage";
import { StudentsView } from "./pages/StudentsView";
import { StaffView } from "./components/StaffView";
import { AnnouncementsView } from "./components/AnnouncementsView";
import { PaymentsView } from "./components/PaymentsView";
import { SettingsView } from "./components/SettingsView";
import { NotificationsView } from "./components/NotificationsView";
import { RolesView } from "./components/RolesView";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    element: <Login />,
  },
  
  // Protected Routes
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
            path: "program-courses",
            element: <ProgramCoursesPage />,
          },
          {
            path: "students",
            element: <StudentsView />,
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
            path: "roles-permissions",
            element: <RolesView />,
          },
          {
            path: "announcements",
            element: <AnnouncementsView />,
          },
          {
            path: "settings",
            element: <SettingsView />,
          },
          {
            path: "notifications",
            element: <NotificationsView />,
          },
        ],
      },
    ],
  },
  
  // Catch all
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
