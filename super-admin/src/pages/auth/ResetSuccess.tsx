import React from "react";
import { useNavigate } from "react-router";

const ResetSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F9FAFB",
        padding: "20px",
      }}
    >
      {/* Success Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "60px 40px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#D1FAE5",
              marginBottom: "20px",
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1F2937",
            margin: "0 0 12px 0",
          }}
        >
          Password Reset successfully
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "14px",
            color: "#6B7280",
            margin: "0 0 32px 0",
            lineHeight: "1.6",
          }}
        >
          Your password has been successfully reset. You can now login with your new password.
        </p>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2563EB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3B82F6";
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ResetSuccess;
