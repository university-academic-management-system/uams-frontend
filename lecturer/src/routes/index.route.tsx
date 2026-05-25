import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import TimeTable from "@pages/timetable/page";

const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));
const Students = lazy(() => import("@pages/students/Students"));
const Lecturers = lazy(() => import("@pages/lecturers/Lecturers"));
const Courses = lazy(() => import("@pages/courses/Courses"));
const CourseDetail = lazy(() => import("@pages/courses/CourseDetail"));
const CourseStudentDetail = lazy(() => import("@pages/courses/CourseStudentDetail"));
const Results = lazy(() => import("@pages/results/Results"));
const ResultDetail = lazy(() => import("@pages/results/ResultDetail"));
const Projects = lazy(() => import("@pages/projects/Projects"));
const Announcement = lazy(() => import("@pages/announcement/Announcement"));
const Profile = lazy(() => import("@pages/profile/Profile"));
import Settings from "@pages/settings/Settings";
import { AuthMiddleware } from "middleware/auth.middleware";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthMiddleware />,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "students", element: <Students /> },
            { path: "lecturers", element: <Lecturers /> },
            { path: "courses", element: <Courses /> },
            { path: "courses/:courseId", element: <CourseDetail /> },
            { path: "courses/:courseId/students/:studentId", element: <CourseStudentDetail /> },
            { path: "results", element: <Results /> },
            { path: "results/:courseId", element: <ResultDetail /> },
            { path: "projects", element: <Projects /> },
            { path: "timetable", element: <TimeTable /> },
            { path: "announcement", element: <Announcement /> },
            { path: "profile", element: <Profile /> },
            { path: "settings", element: <Settings /> },
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
