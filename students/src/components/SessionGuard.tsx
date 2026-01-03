import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import authService from "../services/authService";

/**
 * Session guard component that protects routes requiring authentication.
 * Uses <Outlet /> to render child routes when authenticated.
 */
const SessionGuard: React.FC = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default SessionGuard;
