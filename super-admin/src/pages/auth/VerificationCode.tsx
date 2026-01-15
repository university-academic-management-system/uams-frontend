import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../services/authService";
import Toast from "../../components/Toast";

const VerificationCode: React.FC = () => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("resetEmail") || "youremail@provider.com";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setError("");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.verifyCode(email, fullCode);
      console.log("Code verified:", fullCode);
      setToast({ message: "Code verified successfully!", type: "success" });
      // Store the reset token in sessionStorage for reset-password page
      const resetToken = response.resetToken || response.token || fullCode;
      sessionStorage.setItem("resetToken", resetToken);
      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Invalid or expired verification code. Please try again.";
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCode(["", "", "", "", "", ""]);
    setError("");
    setResendTimer(60);
    
    try {
      await authService.resendCode(email);
      console.log("Verification code resent to:", email);
      setToast({ message: "A new verification code has been sent to your email.", type: "success" });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to resend code. Please try again.";
      setError(errorMessage);
      setToast({ message: errorMessage, type: "error" });
      console.error("Resend code error:", err);
      setResendTimer(0); // Reset timer on error so user can try again
    }
    
    inputRefs.current[0]?.focus();
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
        {/* Illustration Side - Desktop Only */}
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
            src="/super-admin/assets/verification-illustration.png"
            alt="Verification Code Illustration"
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
              fallback.textContent = "✓";
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        </div>
      </div>

      {/* Form Card */}
      <div
        style={{
          flex: window.innerWidth > 1024 ? 1 : "none",
          width: window.innerWidth > 1024 ? "auto" : "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
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
                borderRadius: "12px",
                backgroundColor: "#F3F4F6",
                marginBottom: "20px",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              >
                <rect x="3" y="2" width="18" height="20" rx="2" ry="2"></rect>
                <line x1="7" y1="6" x2="17" y2="6"></line>
                <circle cx="12" cy="14" r="3" fill="#3B82F6"></circle>
              </svg>
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
            Enter Verification Code
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#6B7280",
              fontSize: "14px",
              margin: "0 0 32px 0",
            }}
          >
            We sent a code to <br />
            <span style={{ fontWeight: "500", color: "#1F2937" }}>{email}</span>
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
          <form onSubmit={handleVerify}>
            {/* Code Input Fields */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "32px",
                justifyContent: "center",
              }}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  placeholder="0"
                  style={{
                    width: "56px",
                    height: "56px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "24px",
                    fontWeight: "600",
                    textAlign: "center",
                    boxSizing: "border-box",
                    transition: "all 0.3s",
                    color: "#1F2937",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3B82F6";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
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
              {loading ? "Verifying..." : "Continue"}
            </button>

            {/* Resend Code */}
            <div
              style={{
                textAlign: "center",
              }}
            >
              <span
                style={{
                  color: "#6B7280",
                  fontSize: "14px",
                }}
              >
                Didn't get the code?{" "}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                style={{
                  background: "none",
                  border: "none",
                  color: resendTimer > 0 ? "#9CA3AF" : "#3B82F6",
                  fontSize: "14px",
                  cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (resendTimer === 0) {
                    e.currentTarget.style.textDecoration = "underline";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </>
  );
};

export default VerificationCode;
