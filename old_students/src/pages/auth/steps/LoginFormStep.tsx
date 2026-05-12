import React, { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';
import authService from '../../../services/authService';
import { useLoginForm } from '@/forms/login.form';
import type { LoginSchema } from '@/schemas/auth/login.schema';

interface LoginFormStepProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

const LoginFormStep: React.FC<LoginFormStepProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();

  const onSubmit = async (data: LoginSchema) => {
    try {
      setIsLoading(true);
      setGlobalError("");
      
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      if (response.status === "success") {
        navigate("/");
        onLoginSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 min-h-screen w-full flex items-center justify-center relative font-['Inter']">
      <AuthBackground />
      <AuthCard>
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-[#1e293b] mb-3">Login</h1>
          <p className="text-[14px] font-medium text-gray-400">
            Welcome back please login to your
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-1">
            <div className="relative group">
              <input
                type="text"
                {...register("email")}
                placeholder="Enter Email-Address"
                className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all`}
              />
              <User
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)]"
                size={20}
              />
            </div>
            {errors.email && (
              <p className="text-[13px] text-red-500 px-2">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter Password"
                className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-accent)]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[13px] text-red-500 px-2">{errors.password.message}</p>
            )}
          </div>
          {globalError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-[13px] font-medium text-red-600">{globalError}</p>
            </div>
          )}
          <div className="flex items-center space-x-3 px-2">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`relative w-11 h-5 rounded-full transition-colors ${rememberMe ? "bg-blue-100" : "bg-gray-100"}`}
            >
              <div
                className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-transform transform ${rememberMe ? "translate-x-6 bg-[var(--color-accent)]" : "translate-x-0 bg-white"}`}
              ></div>
            </button>
            <span className="text-[13px] font-bold text-gray-400">
              Remember me
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-accent)] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl text-[16px] font-black shadow-xl shadow-blue-200/50 transition-all mt-4 cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-10 text-center">
            <p className="text-[13px] font-bold text-gray-400">
              Forgot Password?{" "}
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[var(--color-accent)] cursor-pointer hover:underline disabled:cursor-not-allowed"
              >
                Click Here
              </button>
            </p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[13px] font-bold text-gray-400">
              Activate your account to gain access?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-[var(--color-accent)] cursor-pointer hover:underline disabled:cursor-not-allowed"
              >
                Click Here
              </button>
            </p>
          </div>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginFormStep;
