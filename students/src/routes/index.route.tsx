import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { AuthMiddleware } from "@middlewares/auth.middleware";

const DashboardPage = lazy(() => import("@app/page"));
const Registrations = lazy(() => import("@app/registrations/page"));
const Courses = lazy(() => import("@app/courses/page"));
const Projects = lazy(() => import("@app/projects/page"));



const router = createBrowserRouter([
    {
        element: <AuthMiddleware />,
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
            { path: "/payments", element: <p>Payments</p> },
            { path: "/timetable", element: <p>Time Table</p> },
            { path: "/announcements", element: <p>Announcements</p> },
            { path: "/profile", element: <p>Profile</p> },
        ]
    }
], {
    basename: "/students"
});

const Router = () => {
    return <RouterProvider router={router} />;
}

export default Router;