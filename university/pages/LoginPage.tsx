import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router";
import { AuthData } from "../components/types";

interface ApiLoginResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    universityId?: string;
    facultyId?: string | null;
    departmentId?: string | null;
    profile?: any;
  };
  message: string;
  status: string;
}

interface LoginPageProps {
  onLogin: (data: AuthData) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      localStorage.setItem("loginEmail", email);

      const response = await api.post<ApiLoginResponse>("/login", {
        email: email,
        password: password,
      });

      const data = response.data;
      console.log("✅ Login API Response:", data);

      const tenantId = localStorage.getItem("tenantId");

      const loginData: AuthData = {
        token: data.token,
        role: data.user.role,
        tenantId: tenantId,
        universityId: data.user.universityId || "",
        facultyId: data.user.facultyId || null,
        departmentId: data.user.departmentId || null,
        email: data.user.email || email,
      };

      console.log("✅ Extracted AuthData:", loginData);
      onLogin(loginData);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Login error:", err);
      localStorage.removeItem("loginEmail");
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Full Page Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/landing-logo.png"
          alt="University Background"
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      </div>

      {/* Login Card - Positioned Right */}
      <div className="relative z-10 min-h-screen flex items-center justify-end pr-8 md:pr-16 lg:pr-24">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/assets/uphcscLG.png"
              alt="UNIPORT Computer Science"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Login</h1>
            <p className="text-slate-500 text-sm">
              Welcome back please login to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Enter Username"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all pr-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading}
                  />
                  <div
                    className={`block w-10 h-6 rounded-full transition-colors duration-300 ${
                      rememberMe ? "bg-blue-600" : "bg-slate-200"
                    } ${isLoading ? "opacity-50" : ""}`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                      rememberMe ? "translate-x-4" : "translate-x-0"
                    }`}
                  ></div>
                </div>
                <span
                  className={`ml-3 text-sm text-slate-600 ${
                    isLoading ? "opacity-50" : ""
                  }`}
                >
                  Remember me
                </span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#1b75d0] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <span className="text-slate-500 text-sm">Forgot Password? </span>
            <button
              type="button"
              className="text-[#1b75d0] text-sm font-medium hover:underline"
              disabled={isLoading}
            >
              Click Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
