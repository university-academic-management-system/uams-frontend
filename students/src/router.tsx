import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Registration from "./pages/Registration";
import Schedule from "./pages/Schedule";
import Payments from "./pages/Payments";
import PaymentsNew from "./pages/PaymentsNew";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import SessionGuard from "./components/SessionGuard";

const router = createBrowserRouter([
  // Public route
  {
    path: "/login",
    element: <Login />,
  },

  // Protected dashboard routes
  {
    path: "/",
    element: <SessionGuard />,
    children: [
      {
        element: <MainLayout />,
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
            path: "courses",
            element: <Navigate to="/courses/results" replace />,
          },
          {
            path: "courses/*",
            element: <Courses />,
          },
          {
            path: "registration",
            element: <Navigate to="/registration/courses" replace />,
          },
          {
            path: "registration/*",
            element: <Registration />,
          },
          {
            path: "schedule",
            element: <Schedule />,
          },
          {
            path: "payments",
            element: <Payments />,
          },
          {
            path: "payments/new",
            element: <PaymentsNew />,
          },
        ],
      },
    ],
  },

  // Catch all - redirect to dashboard
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
], {
  basename: "/students"
});

export default router;
