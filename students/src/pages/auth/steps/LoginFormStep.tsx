import React, { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';
import authService from '../../../services/authService';

interface LoginFormStepProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

const LoginFormStep: React.FC<LoginFormStepProps> = ({ onLoginSuccess, onForgotPassword }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const response = await authService.login({
        email: username,
        password: password,
      });

      if (response.status === "success") {
        // Login successful, navigate to dashboard
        navigate("/");
        onLoginSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-['Inter']">
      <AuthBackground />
      <AuthCard>
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-[#1e293b] mb-3">Login</h1>
          <p className="text-[14px] font-medium text-gray-400">
            Welcome back please login to your account
          </p>
        </div>
        <form
          onSubmit={handleLoginSubmit}
          className="space-y-6"
        >
          <div className="relative group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Email-Address"
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
            />
            <User
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d76d2]"
              size={20}
            />
          </div>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1d76d2]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-[13px] font-medium text-red-600">{error}</p>
            </div>
          )}
          <div className="flex items-center space-x-3 px-2">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`relative w-11 h-5 rounded-full transition-colors ${rememberMe ? "bg-blue-100" : "bg-gray-100"}`}
            >
              <div
                className={`absolute top-1 left-1 w-3 h-3 rounded-full transition-transform transform ${rememberMe ? "translate-x-6 bg-[#1d76d2]" : "translate-x-0 bg-white"}`}
              ></div>
            </button>
            <span className="text-[13px] font-bold text-gray-400">
              Remember me
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1d76d2] hover:bg-[#1565c0] disabled:bg-gray-400 text-white py-4 rounded-xl text-[16px] font-black shadow-xl shadow-blue-200/50 transition-all mt-4"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-10 text-center">
            <p className="text-[13px] font-bold text-gray-400">
              Forgot Password?{" "}
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[#3b82f6] cursor-pointer hover:underline"
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
                className="text-[#3b82f6] cursor-pointer hover:underline"
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
