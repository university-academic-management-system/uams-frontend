import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import Toast from "../../components/Toast";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      console.log("Verification code sent to:", email);
      setToast({ 
        message: "A verification code has been sent to your email. It may take a minute to arrive.", 
        type: "success" 
      });
      // Store email in sessionStorage for verification page
      sessionStorage.setItem("resetEmail", email);
      // Delay navigation to let user see the toast
      setTimeout(() => {
        navigate("/verification");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to send verification code. Please try again.";
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          backgroundColor: "#F9FAFB",
          overflow: "hidden",
        }}
      >
        {/* Left Side - Illustration */}
      <div
        style={{
          flex: 1,
          display: window.innerWidth > 1024 ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            aspectRatio: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/super-admin/assets/forgot-password-illustration.png"
            alt="Forgot Password Illustration"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            onError={(e) => {
              // Fallback to placeholder if image not available
              (e.currentTarget.style.display as any) = "none";
              const fallback = document.createElement("div");
              fallback.style.fontSize = "120px";
              fallback.style.textAlign = "center";
              fallback.style.width = "100%";
              fallback.textContent = "📧";
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        </div>
      </div>

      {/* Right Side - Form Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          minWidth: window.innerWidth > 1024 ? "50%" : "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            padding: "40px 32px",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <img
              src="/super-admin/assets/logo.png"
              alt="SPEEDLINK Logo"
              style={{
                height: "64px",
                width: "auto",
              }}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                (e.currentTarget.style.display as any) = "none";
                const fallback = document.createElement("div");
                fallback.style.fontSize = "32px";
                fallback.style.fontWeight = "bold";
                fallback.style.textAlign = "center";
                fallback.textContent = "S";
                // style the fallback circle if needed
                fallback.style.width = "64px";
                fallback.style.height = "64px";
                fallback.style.borderRadius = "50%";
                fallback.style.backgroundColor = "#F3F4F6";
                fallback.style.display = "flex";
                fallback.style.alignItems = "center";
                fallback.style.justifyContent = "center";
                e.currentTarget.parentElement?.appendChild(fallback);
              }}
            />
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              textAlign: "center",
              color: "#1F2937",
              margin: "0 0 8px 0",
            }}
          >
            Forgot Password
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#6B7280",
              fontSize: "14px",
              margin: "0 0 32px 0",
            }}
          >
            Let's retrieve your password together
          </p>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: "#FEE2E2",
                color: "#991B1B",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                border: "1px solid #FECACA",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendCode}>
            {/* Email Field */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1F2937",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3B82F6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Send Code Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: loading ? "#93C5FD" : "#1273D4", // Match Login Blue
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.3s",
                marginBottom: "16px",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#1d4ed8";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#1273D4"; // Match Login Blue
                }
              }}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>

            {/* Back to Login Link */}
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6B7280", // Gray to match design
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#111827"; // Darker on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6B7280";
                }}
              >
                <span>←</span> Back to login
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
