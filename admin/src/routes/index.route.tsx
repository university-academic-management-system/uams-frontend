import { createBrowserRouter, Navigate } from "react-router";
import { lazy, Suspense } from "react";
import { AuthMiddleware } from "@middlewares/auth.middleware";


const DashboardPage = lazy(() => import("@app/dashboard/page"));
const ProgramCoursesPage = lazy(() => import("@app/programs/page"));
const StudentsPage = lazy(() => import("@app/students/page"));
const StaffPage = lazy(() => import("@app/lecturers/page"));
const PaymentsPage = lazy(() => import("@app/payments/page"));
const PaymentsDetailPage = lazy(() => import("@app/payments/detail"));
const TimetablePage = lazy(() => import("@app/timetable/page"));
const AnnouncementsPage = lazy(() => import("@app/announcements/page"));
const SettingsPage = lazy(() => import("@app/settings/page"));
const ProfilePage = lazy(() => import("@app/profile/page"));
const ApplicationsPage = lazy(() => import("@app/applications/page"));

const router = createBrowserRouter([
    // Protected Routes
    {
        path: "/",
        element: <AuthMiddleware />,
        children: [
            {
                index: true,
                element: <Suspense>
                    <DashboardPage />
                </Suspense>,
            },
            {
                path: "dashboard",
                element: <Suspense>
                    <DashboardPage />
                </Suspense>,
            },
            {
                path: "programmes/*",
                element: <Suspense>
                    <ProgramCoursesPage />
                </Suspense>,
            },
            {
                path: "students",
                element: <Suspense>
                    <StudentsPage />
                </Suspense>,
            },
            {
                path: "staff",
                element: <Suspense>
                    <StaffPage />
                </Suspense>,
            },
            {
                path: "payments",
                element: <Suspense>
                    <PaymentsPage />
                </Suspense>,
            },
            {
                path: "applications",
                element: <Suspense>
                    <ApplicationsPage />
                </Suspense>,
            },
            {
                path: "payments/:programTypeCode",
                element: <Suspense>
                    <PaymentsDetailPage />
                </Suspense>,
            },
            {
                path: "timetable",
                element: <Suspense>
                    <TimetablePage />
                </Suspense>,
            },
            {
                path: "announcements",
                element: <Suspense>
                    <AnnouncementsPage />
                </Suspense>,
            },
            {
                path: "settings",
                element: <Suspense>
                    <SettingsPage />
                </Suspense>,
            },
            {
                path: "profile",
                element: <Suspense>
                    <ProfilePage />
                </Suspense>,
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