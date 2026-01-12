import React, { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';

interface ActivateAccountStepProps {
  onNext: () => void;
  onForgotPassword: () => void;
}

const ActivateAccountStep: React.FC<ActivateAccountStepProps> = ({ onNext, onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-['Inter']">
      <AuthBackground />
      <AuthCard>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#1e293b] mb-3">
            Activate Account
          </h1>
          <p className="text-[13px] font-medium text-gray-400 leading-relaxed px-4">
            Welcome back please activate your account using your email and
            phone number as username and password respectively
          </p>
        </div>
        <div className="space-y-6">
          <div className="relative group">
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
            />
            <User
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex items-center space-x-3 px-2">
            <button
              onClick={() => setRememberMe(!rememberMe)}
              className={`relative w-11 h-5 rounded-full transition-colors ${rememberMe ? "bg-blue-100" : "bg-gray-100"}`}
            >
              <div
                className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-transform transform ${rememberMe ? "translate-x-6 bg-[#1d76d2]" : "translate-x-0 bg-white"}`}
              ></div>
            </button>
            <span className="text-[12px] font-bold text-gray-400">
              Remember me
            </span>
          </div>
          <button
            onClick={onNext}
            className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4 rounded-xl text-[16px] font-black shadow-lg shadow-blue-200/50 transition-all"
          >
            Activate Account
          </button>
          <div className="text-center mt-4">
            <p className="text-[12px] font-bold text-gray-400">
              Forgot Password?{" "}
              <button
                onClick={onForgotPassword}
                className="text-[#3b82f6] cursor-pointer hover:underline"
              >
                Click Here
              </button>
            </p>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};

export default ActivateAccountStep;
