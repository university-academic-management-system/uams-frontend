import { createBrowserRouter, RouterProvider } from "react-router";
import authRoutes from "./auth.route";
import profileRoutes from "./profile.route";
import { lazy } from "react";
import RootLayout from "@app/layout";

const DashboardPage = lazy(() => import("../app/dashboard/page"));

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: "/", element: <DashboardPage /> },
            { path: "/about", element: <p>About</p> },
            { path: "/contact", element: <p>Login</p> },
        ]
    },
    {
        children: [
            ...authRoutes,
            ...profileRoutes
        ]
    }
]);

const Router = () => {
    return <RouterProvider router={router} />;
}

export default Router;