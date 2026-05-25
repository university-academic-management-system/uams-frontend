import DashboardLayout from "@pages/layouts/DashboardLayout";
import useAuthStore from "@stores/auth.store";
import { Navigate } from "react-router";

export const AuthMiddleware = () => {
    const { token } = useAuthStore();
    if (!token) {
        return <Navigate to="/auth/login" />
    }
    return <DashboardLayout />;
}