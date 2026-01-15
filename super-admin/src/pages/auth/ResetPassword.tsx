import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { authService } from "../../services/authService";
import Toast from "../../components/Toast";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const resetToken = sessionStorage.getItem("resetToken") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        resetToken,
        newPassword,
        confirmPassword,
      });
      console.log("Password reset successful");
      setToast({ message: "Password reset successfully!", type: "success" });
      // Clear session storage
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetToken");
      setTimeout(() => {
        navigate("/reset-success");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
      console.error("Reset password error:", err);
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
        {/* Left Side - Illustration (Desktop Only) */}
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
            src="/super-admin/assets/reset-password-illustration.png"
            alt="Reset Password Illustration"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            onError={(e) => {
              // Fallback to placeholder if image not available
              (e.currentTarget.style.display as any) = "none";
              const fallback = document.createElement("div");
              fallback.style.fontSize = "100px";
              fallback.style.textAlign = "center";
              fallback.textContent = "🔐";
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
            padding: "40px 32px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
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
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
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
            Reset Password
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#6B7280",
              fontSize: "14px",
              margin: "0 0 32px 0",
            }}
          >
            Update Password to enhance account security
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
          <form onSubmit={handleResetPassword}>
            {/* New Password Field */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1F2937",
                  marginBottom: "8px",
                }}
              >
                New Password
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    paddingRight: "40px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#3B82F6")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#E5E7EB")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6B7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                  }}
                >
                  {showNewPassword ? (
                    <ViewOffIcon w={5} h={5} />
                  ) : (
                    <ViewIcon w={5} h={5} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#1F2937",
                  marginBottom: "8px",
                }}
              >
                Confirm new Password
              </label>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    paddingRight: "40px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#3B82F6")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#E5E7EB")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6B7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                  }}
                >
                  {showConfirmPassword ? (
                    <ViewOffIcon w={5} h={5} />
                  ) : (
                    <ViewIcon w={5} h={5} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Button */}
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
              {loading ? "Resetting..." : "Confirm"}
            </button>
          </form>
        </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
