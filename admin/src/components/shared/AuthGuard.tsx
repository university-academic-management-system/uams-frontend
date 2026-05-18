import { Navigate, Outlet, useLocation } from "react-router";
import useAuthStore from "@stores/auth.store";


const SessionGuard = () => {
    const { isAuthenticated, token } = useAuthStore();
    const location = useLocation();

    // Check if we have a valid token
    const hasValidToken = isAuthenticated && !!token;

  //  if (!hasValidToken) {
   //     return <Navigate to="/login" state={{ from: location }} replace />;
   // }

    return <Outlet />;
};

export default SessionGuard;
