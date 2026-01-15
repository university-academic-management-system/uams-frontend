import React, { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../services/authService";

const Login: React.FC = () => {
  const navigate = useNavigate();
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
      navigate("/dashboard");
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
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/super-admin/assets/login-building.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "48px 40px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "480px",
          position: "relative",
          border: "1px solid #E5E7EB", // Subtle border
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src="/super-admin/assets/logo.png"
            alt="SPEEDLINK Logo"
            onError={(e) => {
              (e.currentTarget.style.display as any) = "none";
              const fallback = document.createElement("div");
              fallback.textContent = "S";
              // ... simplistic fallback style
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
            style={{ height: "64px", width: "auto" }}
          />
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            textAlign: "center",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          Login
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#6B7280",
            fontSize: "14px",
            marginBottom: "32px",
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
              padding: "12px",
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
          {/* Email Field with User Icon */}
          <div style={{ marginBottom: "20px", position: "relative" }}>
            <input
              type="text" // Changed from email to text for "Enter Username" placeholder flexibility
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Username"
              style={{
                width: "100%",
                padding: "12px 16px",
                paddingRight: "40px", // Space for icon
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                color: "#111827",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
            />
            <div
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>

          {/* Password Field with Eye Icon */}
          <div style={{ marginBottom: "20px", position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              style={{
                width: "100%",
                padding: "12px 16px",
                paddingRight: "40px",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                color: "#111827",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
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
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? (
                 // Eye Off
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                // Eye On
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>

          {/* Remember Me Toggle */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
            <label className="switch" style={{ position: "relative", display: "inline-block", width: "36px", height: "20px", marginRight: "12px" }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span 
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: rememberMe ? "#2563EB" : "#E5E7EB", // Blue when checked, Gray when unchecked
                  borderRadius: "34px",
                  transition: ".4s",
                }}
              >
                  <span style={{
                    position: "absolute",
                    content: '""',
                    height: "16px",
                    width: "16px",
                    left: rememberMe ? "18px" : "2px", // Move knob
                    bottom: "2px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    transition: ".4s",
                  }}></span>
              </span>
            </label>
            <span style={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>Remember me</span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1273D4", // Specific blue from design
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1273D4"}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Forgot Password */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span style={{ fontSize: "14px", color: "#6B7280" }}>Forgot Password? </span>
          <button
            onClick={() => navigate("/forgot-password")}
            style={{
              background: "none",
              border: "none",
              color: "#3B82F6", // Cyan/Blue link color
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Click Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
