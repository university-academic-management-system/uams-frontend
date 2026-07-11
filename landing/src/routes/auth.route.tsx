import ForgotPasswordPage from "@app/auth/forgot-password/page";
import LoginPage from "@app/auth/login/page";
import OtpPage from "@app/auth/otp/page";
import PortalAccessPage from "@app/auth/portal-access/page";
import ResetPasswordPage from "@app/auth/reset-password/page";
import VerifyPage from "@app/auth/verify/page";
import RootLayout from "@app/layout";
import type { RouteObject } from "react-router"


const authRoutes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            { path: "/auth/login", element: <LoginPage /> },
            { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
            { path: "/auth/otp", element: <OtpPage /> },
            { path: "/auth/reset-password", element: <ResetPasswordPage /> },
            { path: "/auth/verify", element: <VerifyPage /> },
            { path: "/auth/portal-access", element: <PortalAccessPage /> },

        ]
    }
]

export default authRoutes