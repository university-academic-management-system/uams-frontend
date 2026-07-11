import { createBrowserRouter, RouterProvider } from "react-router";
import authRoutes from "./auth.route";
import RootLayout from "@app/layout";
import LandingPage from "@app/page";
import ErrorPage from "@components/shared/ErrorPage";


const router = createBrowserRouter([
    {
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <LandingPage /> },
        ]
    },
    {
        errorElement: <ErrorPage />,
        children: [
            ...authRoutes
        ]
    }
]);

const Router = () => {
    return <RouterProvider router={router} />;
}

export default Router;