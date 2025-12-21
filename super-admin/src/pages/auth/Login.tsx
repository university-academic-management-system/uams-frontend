import React, { useState } from "react";
import { authService } from "../../services/authService";

interface LoginProps {
  onLoginSuccess?: () => void;
  onForgotPasswordClick?: () => void;
}

const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onForgotPasswordClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      await authService.login({ email, password });
      console.log("Login successful", { email, rememberMe });
      onLoginSuccess?.();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Left Side - Building Image Background */}
      <div
        style={{
          flex: 1,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/assets/login-building.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: window.innerWidth > 1024 ? "block" : "none",
          position: "relative",
        }}
      >
        {/* Fallback background if image fails to load */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            opacity: 0,
          }}
        />
      </div>

      {/* Right Side - Login Form Card */}
      <div
        style={{
          flex: window.innerWidth > 1024 ? 1 : "none",
          width: window.innerWidth > 1024 ? "auto" : "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "48px 40px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
            width: "100%",
            maxWidth: "480px",
          }}
        >
          {/* Logo Icon */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <img
              src="/assets/logo.png"
              alt="SPEEDLINK Logo"
              style={{
                height: "60px",
                width: "auto",
                marginBottom: "16px",
              }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                (e.currentTarget.style.display as any) = "none";
                const fallback = document.createElement("div");
                fallback.style.display = "inline-flex";
                fallback.style.alignItems = "center";
                fallback.style.justifyContent = "center";
                fallback.style.width = "60px";
                fallback.style.height = "60px";
                fallback.style.borderRadius = "12px";
                fallback.style.background =
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                fallback.style.color = "white";
                fallback.style.fontSize = "28px";
                fallback.style.fontWeight = "bold";
                fallback.textContent = "S";
                e.currentTarget.parentElement?.appendChild(fallback);
              }}
            />
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              textAlign: "center",
              color: "#111827",
              margin: "0 0 12px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Login
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: "14px",
              margin: "0 0 32px 0",
              lineHeight: "1.5",
            }}
          >
            Welcome back please login to your account
          </p>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "24px",
                fontSize: "14px",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: "20px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease",
                  backgroundColor: "#ffffff",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "20px", position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  paddingRight: "44px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease",
                  backgroundColor: "#ffffff",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#6b7280";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "28px",
                gap: "8px",
              }}
            >
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  accentColor: "#3b82f6",
                  borderRadius: "4px",
                }}
              />
              <label
                htmlFor="rememberMe"
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: loading ? "#93c5fd" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                marginBottom: "20px",
                letterSpacing: "0.5px",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={onForgotPasswordClick}
              style={{
                background: "none",
                border: "none",
                color: "#3b82f6",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: "500",
                padding: "0",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#3b82f6";
              }}
            >
              Forgot Password?{" "}
              <span style={{ fontWeight: "600" }}>Click Here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
