import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import RegNumberStep from "./auth/steps/RegNumberStep";

import PaymentStep from "./auth/steps/PaymentStep";
import ActivateAccountStep from "./auth/steps/ActivateAccountStep";
import LoginFormStep from "./auth/steps/LoginFormStep";
import ForgotPasswordFlow from "./auth/steps/ForgotPasswordFlow";

interface LoginProps {
  onLogin?: () => void;
  initialStep?: AuthStep;
}

type AuthStep =
  | "reg-number"
  | "payment"
  | "activate"
  | "login"
  | "forgot-password"
  | "verify-code"
  | "reset-password"
  | "reset-success";

const Login: React.FC<LoginProps> = ({ onLogin, initialStep }) => {
  const navigate = useNavigate();
  
  // Use the step passed from router, ignore URL params for routing logic now
  const step = initialStep || "login"; 

  // Navigation helper for flat routes
  const go = (s: AuthStep) => {
    switch(s) {
      case "reg-number": navigate("/register"); break;
      case "payment": navigate("/payment"); break;
      case "activate": navigate("/activate-account"); break;
      case "login": navigate("/login"); break;
      case "forgot-password": navigate("/forgot-password"); break;
      // Internal steps for forgot password flow stay managed by that component or could be routed if needed
      // But for now, ForgotPasswordFlow handles its internal state, we just route to it
      default: navigate("/login");
    }
  };

  // --- RECOVERY FLOW ---
  if (
    [
      "forgot-password",
      "verify-code",
      "reset-password",
      "reset-success",
    ].includes(step)
  ) {
    return <ForgotPasswordFlow onBackToLogin={() => go("login")} />;
  }

  // --- ORIGINAL AUTH FLOW STEPS ---

  if (step === "reg-number") {
    return <RegNumberStep onNext={() => go("activate")} />;
  }

  if (step === "activate") {
    return <ActivateAccountStep onNext={() => go("payment")} />;
  }

  if (step === "payment") {
    return <PaymentStep onNext={() => go("login")} />;
  }

  

  // Default: Login Form
  return (
    <LoginFormStep
      onLoginSuccess={() => {
        onLogin?.();
      }}
      onForgotPassword={() => go("forgot-password")}
    />
  );
};

export default Login;
