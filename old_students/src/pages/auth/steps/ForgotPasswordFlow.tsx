import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';
import { useForgotPasswordForm, useResetPasswordForm } from '@/forms/forgot-password.form';
import type { ForgotPasswordSchema, ResetPasswordSchema } from '@/schemas/auth/forgot-password.schema';

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
}

type RecoveryStep = 'forgot-password' | 'verify-code' | 'reset-password' | 'reset-success';

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ onBackToLogin }) => {
  const [internalStep, setInternalStep] = useState<RecoveryStep>('forgot-password');
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    getValues: getForgotValues,
  } = useForgotPasswordForm();

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useResetPasswordForm();

  const handleOtpChange = (index: number, val: string) => {
    // Only allow numbers
    if (val && !/^\d+$/.test(val)) return;

    const next = [...otp];

    // Handle backspace/empty
    if (!val) {
      next[index] = "";
      setOtp(next);
      return;
    }

    // Take the last entered character
    const digit = val.slice(-1);
    next[index] = digit;
    setOtp(next);

    // Auto-advance
    if (digit && index < otp.length - 1) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace to move to previous field
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`);
      el?.focus();
    }
  };

  const onForgotSubmit = (_data: ForgotPasswordSchema) => {
    // TODO: Call API to send code
    setInternalStep("verify-code");
  };

  const onResetSubmit = (_data: ResetPasswordSchema) => {
    // TODO: Call API to reset password
    setInternalStep("reset-success");
  };

  const recoveryImages: Record<string, { src: string; alt: string }> = {
    "forgot-password": {
      src: `${import.meta.env.BASE_URL}assets/63e5419e646a8531661e423a2b33515388a2435e (1).jpg`,
      alt: "Confused Man",
    },
    "verify-code": {
      src: `${import.meta.env.BASE_URL}assets/b1fdf37562884d6fe206052c56b6acb3fb9834c1 (1).png`,
      alt: "Verification",
    },
    "reset-password": {
      src: `${import.meta.env.BASE_URL}assets/6edd4842694c563ff1e295deabb2bd81b848cfb8 (1).png`,
      alt: "Reset Password",
    },
    "reset-success": {
      src: `${import.meta.env.BASE_URL}assets/f42db176bcf041b9eaa88279c491cbf4e69af67b (1).jpg`,
      alt: "Success",
    },
  };
  const currentImage = recoveryImages[internalStep];

  return (
    <div className="py-10 min-h-screen w-full flex items-center justify-center relative font-['Inter']">
      <AuthBackground />
      <AuthCard>
        {internalStep === "forgot-password" && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-xl font-black text-[#1e293b] mb-3">
                Forgot Password
              </h1>
              <p className="text-[13px] font-medium text-gray-400">
                Let's retrieve your password together
              </p>
            </div>
            <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[13px] font-bold text-[#1e293b] px-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...registerForgot("email")}
                  placeholder="Enter email address"
                  className={`w-full bg-white border ${forgotErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all`}
                />
                {forgotErrors.email && (
                  <p className="text-[13px] text-red-500 px-2">{forgotErrors.email.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--color-accent)] hover:bg-blue-700 text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all cursor-pointer"
              >
                Send Code
              </button>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full flex items-center justify-center space-x-2 text-[13px] font-bold text-gray-400 hover:text-[var(--color-accent)] transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back to login</span>
              </button>
            </form>
          </>
        )}
        {internalStep === "verify-code" && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-xl font-black text-[#1e293b] mb-3">
                Enter Verification Code
              </h1>
              <p className="text-[12px] font-medium text-gray-400">
                We sent a code to{" "}
                <span className="font-bold">{getForgotValues("email") || "youremail@provider.com"}</span>
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-full h-12 text-center border border-gray-300 rounded-lg text-lg font-bold text-[#1e293b] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none"
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-[12px] font-bold text-gray-400">
                  Didn't get the code?{" "}
                  <button className="text-[var(--color-accent)] hover:underline cursor-pointer">
                    Resend code
                  </button>
                </p>
              </div>
              <button
                onClick={() => setInternalStep("reset-password")}
                className="w-full bg-[var(--color-accent)] hover:bg-blue-700 text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all cursor-pointer"
              >
                Continue
              </button>
            </div>
          </>
        )}
        {internalStep === "reset-password" && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-xl font-black text-[#1e293b] mb-3">
                Reset Password
              </h1>
              <p className="text-[12px] font-medium text-gray-400">
                Update Password to enhance account security
              </p>
            </div>
            <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-6">
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="password"
                    {...registerReset("newPassword")}
                    placeholder="New Password"
                    className={`w-full bg-white border ${resetErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all`}
                  />
                </div>
                {resetErrors.newPassword && (
                  <p className="text-[13px] text-red-500 px-2">{resetErrors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <div className="relative">
                  <input
                    type="password"
                    {...registerReset("confirmPassword")}
                    placeholder="Confirm new Password"
                    className={`w-full bg-white border ${resetErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all`}
                  />
                </div>
                {resetErrors.confirmPassword && (
                  <p className="text-[13px] text-red-500 px-2">{resetErrors.confirmPassword.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--color-accent)] hover:bg-blue-700 text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all cursor-pointer"
              >
                Confirm
              </button>
            </form>
          </>
        )}
        {internalStep === "reset-success" && (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle className="w-10 h-10 text-[#2ecc71]" />
                </div>
              </div>
              <h1 className="text-xl font-black text-[#1e293b] mb-3">
                Password Reset successfully
              </h1>
              <p className="text-[12px] font-medium text-gray-400">
                Your password has been updated successfully
              </p>
            </div>
            <button
              onClick={onBackToLogin}
              className="w-full bg-[var(--color-accent)] hover:bg-blue-700 text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all cursor-pointer"
            >
              Continue
            </button>
          </>
        )}
      </AuthCard>
    </div>
  );
};

export default ForgotPasswordFlow;
