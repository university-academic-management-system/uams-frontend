import { createBrowserRouter, Navigate } from "react-router";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Registration from "./pages/Registration";
import Payments from "./pages/Payments";
import PaymentsNew from "./pages/PaymentsNew";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import SessionGuard from "./components/SessionGuard";
import IdCardPaymentCallback from "./pages/IdCardPaymentCallback";

import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import PaymentVerificationPage from "./pages/PaymentVerification";
import Announcements from "./pages/Announcements";
import TimeTable from "./pages/timetable/page";
import CoursesNResults from "./pages/Courses";
import Projects from "./pages/projects/page";
import ProjectWriter from "./pages/projects/_components/ProjectWriter";

const router = createBrowserRouter([
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/login",
    element: <Login initialStep="login" />,
  },
  {
    path: "/register",
    element: <Login initialStep="reg-number" />,
  },
  {
    path: "/activate-account",
    element: <Login initialStep="activate" />,
  },
  {
    path: "/payment",
    element: <Login initialStep="payment" />,
  },
  {
    path: "/payment-verification",
    element: <PaymentVerificationPage />,
  },
  {
    path: "/forgot-password",
    element: <Login initialStep="forgot-password" />,
  },
  {
    path: "/idcard-payment-callback",
    element: <IdCardPaymentCallback />,
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
            element: <CoursesNResults />,
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
            path: "projects",
            element: <Projects />,
          },
          // {
          //   path: "projects/:id",
          //   element: <ProjectWriter />,
          // },
          {
            path: "timetable",
            element: <TimeTable />,
          },
          {
            path: "payments",
            element: <Payments />,
          },
          {
            path: "payments/new",
            element: <PaymentsNew />,
          },
          {
            path: "announcements",
            element: <Announcements />,
          },
          {
            path: "profile",
            element: <Profile />,
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
  basename: "/students/"
});

export default router;
