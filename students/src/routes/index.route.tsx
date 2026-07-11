import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { AuthMiddleware } from "@middlewares/auth.middleware";
import ErrorPage from "@components/shared/ErrorPage";

const DashboardPage = lazy(() => import("@app/page"));
const Registrations = lazy(() => import("@app/registrations/page"));
const Courses = lazy(() => import("@app/courses/page"));
const Projects = lazy(() => import("@app/projects/page"));
const Payments = lazy(() => import("@app/payments/page"));
const Profile = lazy(() => import("@app/profile/page"));
const AnnouncementsPage = lazy(() => import("@app/announcements/page"));




const router = createBrowserRouter([
    {
        element: <AuthMiddleware />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/", element: (
                    <Suspense>
                        <DashboardPage />
                    </Suspense>
                )
            },
            {
                path: "/registrations", element: (
                    <Suspense>
                        <Registrations />
                    </Suspense>
                )
            },
            {
                path: "/courses", element:
                    <Suspense>
                        <Courses />
                    </Suspense>
            },
            {
                path: "/projects", element: (
                    <Suspense>
                        <Projects />
                    </Suspense>
                )
            },
            {
                path: "/payments", element: (
                    <Suspense>
                        <Payments />
                    </Suspense>
                )
            },
            {
                path: "/announcements", element: (
                    <Suspense>
                        <AnnouncementsPage />
                    </Suspense>
                )
            },
            {
                path: "/profile", element: (
                    <Suspense>
                        <Profile />
                    </Suspense>
                )
            },
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
], {
    basename: "/students"
});

const Router = () => {
    return <RouterProvider router={router} />;
}

export default Router;