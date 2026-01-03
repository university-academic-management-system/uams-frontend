<<<<<<< HEAD
import React, { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#3B82F6";
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 20px",
        backgroundColor: bgColor,
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        maxWidth: "400px",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <span
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.4 }}>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          padding: "4px",
          marginLeft: "8px",
          opacity: 0.7,
          fontSize: "16px",
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
=======
import React, { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#3B82F6";
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 20px",
        backgroundColor: bgColor,
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        maxWidth: "400px",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <span
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.4 }}>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        style={{
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
          padding: "4px",
          marginLeft: "8px",
          opacity: 0.7,
          fontSize: "16px",
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
>>>>>>> 657324b6ca899feed2eb7425d11a81542d49269b
