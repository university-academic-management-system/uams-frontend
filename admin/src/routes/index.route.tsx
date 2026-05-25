import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import SessionGuard from "@components/shared/AuthGuard";
import RootLayout from "@app/layout";

const DashboardPage = lazy(() => import("@app/dashboard/page"));
const ProgramCoursesPage = lazy(() => import("@app/programs/page"));
const StudentsPage = lazy(() => import("@app/students/page"));
const StaffPage = lazy(() => import("@app/lecturers/page"));
const PaymentsPage = lazy(() => import("@app/payments/page"));
const IDCardPage = lazy(() => import("@app/idcard/page"));
const TimetablePage = lazy(() => import("@app/timetable/page"));
const AnnouncementsPage = lazy(() => import("@app/announcements/page"));
const SettingsPage = lazy(() => import("@app/settings/page"));
const ProfilePage = lazy(() => import("@app/profile/page"));

const router = createBrowserRouter([
    // Protected Routes
    {
        path: "/",
        element: <SessionGuard />,
        children: [
            {
                element: <RootLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: "dashboard",
                        element: <DashboardPage />,
                    },
                    {
                        path: "programmes/*",
                        element: <ProgramCoursesPage />,
                    },
                    {
                        path: "students",
                        element: <StudentsPage />,
                    },
                    {
                        path: "staff",
                        element: <StaffPage />,
                    },
                    {
                        path: "payments",
                        element: <PaymentsPage />,
                    },
                    {
                        path: "id-card",
                        element: <IDCardPage />,
                    },
                    {
                        path: "timetable",
                        element: <TimetablePage />,
                    },
                    {
                        path: "announcements",
                        element: <AnnouncementsPage />,
                    },
                    {
                        path: "settings",
                        element: <SettingsPage />,
                    },
                    {
                        path: "profile",
                        element: <ProfilePage />,
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
], {
    basename: "/admin"
});

export default router;