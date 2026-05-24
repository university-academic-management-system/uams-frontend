import { useEffect } from "react";
import { Outlet } from "react-router";
import useAuthStore from "@stores/auth.store";

const SessionGuard = () => {
    const { isAuthenticated, token } = useAuthStore();

    // Check if we have a valid token
    const hasValidToken = isAuthenticated && !!token;

    useEffect(() => {
        if (!hasValidToken) {
            window.location.href = "/auth/login";
        }
    }, [hasValidToken]);

    if (!hasValidToken) {
        return null;
    }

    return <Outlet />;
};

export default SessionGuard;
