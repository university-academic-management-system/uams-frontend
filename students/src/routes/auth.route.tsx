import RootLayout from "@app/layout";
import { lazy } from "react"
import type { RouteObject } from "react-router"

const SignupPage = lazy(() => import("@app/auth/signup/page"));

const authRoutes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            { path: "/auth/login", element: <p>Login</p> },
            { path: "/auth/signup", element: <SignupPage /> },
            { path: "/auth/forgot-password", element: <p>Forgot Password</p> },
        ]
    }
]

export default authRoutes