import type { RouteObject } from "react-router";
import { AuthMiddleware } from "@middlewares/auth.middleware";

const profileRoutes: RouteObject[] = [
    {
        element: <AuthMiddleware />,
        children:[
            { path: "/profile", element: <p>Profile</p> },
            { path: "/profile/:id/edit", element: <p>Edit Profile</p> },
        ]
    }
]

export default profileRoutes;