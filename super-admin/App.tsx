import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router";
import Sidebar from "./src/components/Sidebar";
import Topbar from "./src/components/Topbar";
import Dashboard from "./src/pages/Dashboard";
import University from "./src/pages/University";
import Payments from "./src/pages/Payments";
import SystemSettings from "./src/pages/SystemSettings";
import Notifications from "./src/pages/Notifications";
import ActivityLog from "./src/pages/ActivityLog";
import Login from "./src/pages/auth/Login";
import ForgotPassword from "./src/pages/auth/ForgotPassword";
import VerificationCode from "./src/pages/auth/VerificationCode";
import ResetPassword from "./src/pages/auth/ResetPassword";
import ResetSuccess from "./src/pages/auth/ResetSuccess";

// Protected Route wrapper component
const ProtectedRoute: React.FC<{
  isAuthenticated: boolean;
  children: React.ReactNode;
}> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Layout component for authenticated pages
const AuthenticatedLayout: React.FC<{
  children: React.ReactNode;
  onLogout: () => void;
}> = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Get active page from pathname
  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/university") return "university";
    if (path === "/payments") return "payments";
    if (path === "/notifications") return "notifications";
    if (path === "/activity-log") return "activity-log";
    if (path === "/system-settings") return "system-settings";
    return "dashboard";
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        position: "relative",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        activePage={getActivePage()}
        logoSrc="/assets/logo.png"
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onLogout={onLogout}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 12,
          }}
        />
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isMobile ? "0" : "256px",
          transition: "margin-left 0.3s ease-in-out",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <Topbar
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={onLogout}
        />

        <main
          style={{
            flex: 1,
            overflow: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

// Login wrapper to handle navigation
const LoginWrapper: React.FC<{
  onLoginSuccess: () => void;
}> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  return (
    <Login
      onLoginSuccess={onLoginSuccess}
      onForgotPasswordClick={() => navigate("/forgot-password")}
    />
  );
};

// ForgotPassword wrapper
const ForgotPasswordWrapper: React.FC<{
  onSendCode: (email: string) => void;
}> = ({ onSendCode }) => {
  const navigate = useNavigate();

  const handleSendCode = (email: string) => {
    onSendCode(email);
    navigate("/verification");
  };

  return (
    <ForgotPassword
      onSendCode={handleSendCode}
      onBackToLogin={() => navigate("/login")}
    />
  );
};

// VerificationCode wrapper
const VerificationCodeWrapper: React.FC<{
  email: string;
  onCodeVerified: (token: string) => void;
  onResendCode: () => void;
}> = ({ email, onCodeVerified, onResendCode }) => {
  const navigate = useNavigate();

  const handleCodeVerified = (token: string) => {
    onCodeVerified(token);
    navigate("/reset-password");
  };

  return (
    <VerificationCode
      email={email}
      onCodeVerified={handleCodeVerified}
      onResendCode={onResendCode}
    />
  );
};

// ResetSuccess wrapper
const ResetSuccessWrapper: React.FC<{
  onContinue: () => void;
}> = ({ onContinue }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    onContinue();
    navigate("/login");
  };

  return <ResetSuccess onContinue={handleContinue} />;
};

// ResetPassword wrapper
const ResetPasswordWrapper: React.FC<{
  resetToken: string;
  onPasswordReset: () => void;
}> = ({ resetToken, onPasswordReset }) => {
  const navigate = useNavigate();

  const handlePasswordReset = () => {
    onPasswordReset();
    navigate("/reset-success");
  };

  return (
    <ResetPassword
      resetToken={resetToken}
      onPasswordReset={handlePasswordReset}
    />
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already logged in
    return !!localStorage.getItem("authToken");
  });
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSendCode = (email: string) => {
    setResetEmail(email);
  };

  const handleCodeVerified = (token: string) => {
    setResetToken(token);
  };

  const handlePasswordReset = () => {
    // Password reset successful
  };

  const handleResetSuccess = () => {
    setResetEmail("");
    setResetToken("");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginWrapper onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordWrapper onSendCode={handleSendCode} />
          }
        />
        <Route
          path="/verification"
          element={
            <VerificationCodeWrapper
              email={resetEmail}
              onCodeVerified={handleCodeVerified}
              onResendCode={() => handleSendCode(resetEmail)}
            />
          }
        />
        <Route
          path="/reset-password"
          element={
            <ResetPasswordWrapper
              resetToken={resetToken}
              onPasswordReset={handlePasswordReset}
            />
          }
        />
        <Route
          path="/reset-success"
          element={<ResetSuccessWrapper onContinue={handleResetSuccess} />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout onLogout={handleLogout}>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout onLogout={handleLogout}>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/university"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout onLogout={handleLogout}>
                <University />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout onLogout={handleLogout}>
                <Payments />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout onLogout={handleLogout}>
                <Notifications />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity-log"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout onLogout={handleLogout}>
                <ActivityLog />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/system-settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthenticatedLayout onLogout={handleLogout}>
                <SystemSettings />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to dashboard or login */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
