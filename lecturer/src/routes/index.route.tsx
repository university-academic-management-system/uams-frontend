import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import TimeTable from "@pages/timetable/page";
import ErrorPage from "@components/shared/ErrorPage";

const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));
const Students = lazy(() => import("@pages/students/Students"));
const Lecturers = lazy(() => import("@pages/lecturers/Lecturers"));
const Courses = lazy(() => import("@pages/courses/Courses"));
const Projects = lazy(() => import("@pages/projects/Projects"));
const Announcement = lazy(() => import("@pages/announcement/Announcement"));
const Profile = lazy(() => import("@pages/profile/Profile"));
import { AuthMiddleware } from "middleware/auth.middleware";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthMiddleware />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "students", element: <Students /> },
            { path: "lecturers", element: <Lecturers /> },
            { path: "courses", element: <Courses /> },
            { path: "projects", element: <Projects /> },
            { path: "timetable", element: <TimeTable /> },
            { path: "announcement", element: <Announcement /> },
            { path: "profile", element: <Profile /> },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace />,
    },
], {
    basename: "/lecturer/",
});

export default router;
