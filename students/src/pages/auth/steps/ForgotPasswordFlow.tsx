import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
}

type RecoveryStep = 'forgot-password' | 'verify-code' | 'reset-password' | 'reset-success';

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ onBackToLogin }) => {
  const [internalStep, setInternalStep] = useState<RecoveryStep>('forgot-password');
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

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
    <div className="min-h-screen w-full flex items-center justify-center relative font-['Inter']">
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
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1e293b] px-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                />
              </div>
              <button
                onClick={() => setInternalStep("verify-code")}
                className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all"
              >
                Send Code
              </button>
              <button
                onClick={onBackToLogin}
                className="w-full flex items-center justify-center space-x-2 text-[13px] font-bold text-gray-400 hover:text-blue-500 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to login</span>
              </button>
            </div>
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
                <span className="font-bold">youremail@provider.com</span>
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
                    className="w-full h-12 text-center border border-gray-300 rounded-lg text-lg font-bold text-[#1e293b] focus:border-[#1d76d2] focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-[12px] font-bold text-gray-400">
                  Didn't get the code?{" "}
                  <button className="text-[#3b82f6] hover:underline">
                    Resend code
                  </button>
                </p>
              </div>
              <button
                onClick={() => setInternalStep("reset-password")}
                className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all"
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
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm new Password"
                  className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                />
              </div>
              <button
                onClick={() => setInternalStep("reset-success")}
                className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all"
              >
                Confirm
              </button>
            </div>
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
              className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all"
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
