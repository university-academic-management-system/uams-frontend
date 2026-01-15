import React from "react";
import { Navigate, Outlet } from "react-router";

interface SessionGuardProps {
  redirectTo?: string;
}

/**
 * Session guard component that protects routes requiring authentication.
 * Uses <Outlet /> to render child routes when authenticated.
 */
const SessionGuard: React.FC<SessionGuardProps> = ({ redirectTo = "/login" }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default SessionGuard;
