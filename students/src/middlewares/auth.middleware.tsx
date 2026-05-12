import useAuthStore from "@stores/auth.store";
import { Navigate, Outlet } from "react-router";

export const AuthMiddleware = () => {
    const { token } = useAuthStore();
    if (!token) {
        return <Navigate to="/auth/login" />
    }
    return <Outlet />;
}