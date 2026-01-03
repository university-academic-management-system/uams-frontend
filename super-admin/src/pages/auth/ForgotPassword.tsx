import React, { useState } from "react";
import { authService } from "../../services/authService";
import Toast from "../../components/Toast";

interface ForgotPasswordProps {
  onBackToLogin?: () => void;
  onSendCode?: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onBackToLogin,
  onSendCode,
}) => {
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
      // Delay navigation to let user see the toast
      setTimeout(() => {
        onSendCode?.(email);
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
            src="/assets/forgot-password-illustration.png"
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
          {/* Icon */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#F3F4F6",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#3B82F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
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
                backgroundColor: loading ? "#93C5FD" : "#3B82F6",
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
                  e.currentTarget.style.backgroundColor = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#3B82F6";
                }
              }}
            >
              {loading ? "Sending..." : "Send Code"}
            </button>

            {/* Back to Login Link */}
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                onClick={onBackToLogin}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3B82F6",
                  fontSize: "14px",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                ← Back to login
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
