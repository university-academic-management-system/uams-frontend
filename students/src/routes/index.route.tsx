import { createBrowserRouter, RouterProvider } from "react-router";
// import { lazy } from "react";
import { AuthMiddleware } from "@middlewares/auth.middleware";


const router = createBrowserRouter([
    {
        element: <AuthMiddleware />,
        children: [
            { path: "/", element: <p>dashbaord</p> },
            { path: "/courses", element: <p>Courses</p> },
            { path: "/registrations", element: <p>Registrations</p> },
            { path: "/payments", element: <p>Payments</p> },
            { path: "/projects", element: <p>Projects</p> },
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