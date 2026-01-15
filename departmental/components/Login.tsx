import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import api from "../api/axios";
import { AuthData } from "../components/types";
import { useAuth } from "../context/AuthProvider";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Store email temporarily for display purposes
      localStorage.setItem("loginEmail", email);

      // API call to signin endpoint
      const response = await api.post("/api/auth/signin", {
        email: email,
        password: password,
      });

      const data = response.data;

      // Add email to the auth data object
      const authData: AuthData = {
        token: data.token,
        role: data.role,
        tenantId: data.tenantId,
        universityId: data.universityId,
        facultyId: data.facultyId || null,
        departmentId: data.departmentId || null,
        email: email, // Using the email from the form
      };

      // Call parent with auth data
      login(authData);
      navigate("/dashboard");
    } catch (err: any) {
      // Clear temporary email on error
      localStorage.removeItem("loginEmail");

      // Handle different error types
      if (err.response) {
        // Server responded with an error
        if (err.response.status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (err.response.status === 400) {
          setError(
            err.response.data?.message ||
              "Invalid request. Please check your input."
          );
        } else if (err.response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(
            err.response.data?.message || "Login failed. Please try again."
          );
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }

      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-['Inter']">
      {/* Left Side - Modern Campus Image */}
      <div className="hidden lg:block lg:w-[65%] relative">
        <img
          src="/departmental-admin/assets/54edd5a52523c71877ec8fcec5d76c0ac0adf1f5.png"
          alt="Modern University Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[35%] flex items-center justify-center p-6 bg-[#f8fafc] lg:bg-white">
        {/* Login Card */}
        <div className="w-full max-w-md bg-[#f9fbff] lg:bg-[#f9fbff] p-8 lg:p-12 rounded-[48px] border border-[#e2e8f0]/60 shadow-xl shadow-blue-50/20 lg:shadow-2xl lg:shadow-blue-50/40 animate-in fade-in zoom-in-95 duration-700">
          <div className="flex justify-center mb-12">
            <img
              src="/departmental-admin/assets/uphcscLG.png"
              alt="Logo"
              className="h-12 w-auto rounded-md"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-[#1e293b] mb-2">Login</h1>
            <p className="text-[14px] font-medium text-gray-400">
              Welcome back please login to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[22px]">
              <p className="text-red-600 text-sm text-center font-bold">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all placeholder:text-gray-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                required
              />
              <User
                className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1d76d2] transition-colors"
                size={20}
                strokeWidth={2.5}
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all placeholder:text-gray-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1d76d2] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeOff size={20} strokeWidth={2.5} />
                ) : (
                  <Eye size={20} strokeWidth={2.5} />
                )}
              </button>
            </div>

            {/* Toggle Section */}
            <div className="flex items-center space-x-3 px-2">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
                className={`relative w-[48px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none ${
                  rememberMe ? "bg-[#3b82f6]/20" : "bg-gray-100"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <div
                  className={`absolute top-[4px] left-[4px] w-[16px] h-[16px] rounded-full transition-all duration-300 transform ${
                    rememberMe
                      ? "translate-x-[24px] bg-[#1d76d2] shadow-md shadow-blue-200"
                      : "translate-x-0 bg-white shadow-sm"
                  }`}
                ></div>
              </button>
              <span
                className={`text-[13px] font-bold text-gray-400 ${
                  isLoading ? "opacity-60" : ""
                }`}
              >
                Remember me
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-5 rounded-[22px] text-[16px] font-black shadow-xl shadow-blue-200/50 transition-all transform active:scale-[0.98] mt-6 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#1d76d2] flex items-center justify-center"
            >
              {isLoading ? (
                <>
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
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-10 text-center">
            <p className="text-[13px] font-bold text-gray-400">
              Forgot Password?{" "}
              <button
                type="button"
                className="text-[#3b82f6] hover:text-[#1d76d2] hover:underline transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Click Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import { User, Eye, EyeOff } from 'lucide-react';

// interface LoginProps {
//   onLogin: () => void;
// }

// const Login: React.FC<LoginProps> = ({ onLogin }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onLogin();
//   };

//   return (
//     <div className="min-h-screen w-full flex bg-white font-['Inter']">
//       {/* Left Side - Modern Campus Image */}
//       <div className="hidden lg:block lg:w-[65%] relative">
//         <img
//           src="/assets/54edd5a52523c71877ec8fcec5d76c0ac0adf1f5.png"
//           alt="Modern University Campus"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/10"></div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-[35%] flex items-center justify-center p-6 bg-[#f8fafc] lg:bg-white">
//         {/* Login Card */}
//         <div className="w-full max-w-md bg-[#f9fbff] lg:bg-[#f9fbff] p-8 lg:p-12 rounded-[48px] border border-[#e2e8f0]/60 shadow-xl shadow-blue-50/20 lg:shadow-2xl lg:shadow-blue-50/40 animate-in fade-in zoom-in-95 duration-700">

//           <div className="flex justify-center mb-12">
//             <img src="/assets/spedox.jpg" alt="Logo" className="h-12 w-auto rounded-md" />
//           </div>

//           {/* Heading */}
//           <div className="text-center mb-10">
//             <h1 className="text-2xl font-black text-[#1e293b] mb-2">Login</h1>
//             <p className="text-[14px] font-medium text-gray-400">Welcome back please login to your account</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Username Field */}
//             <div className="relative group">
//               <input
//                 type="text"
//                 placeholder="Enter Username"
//                 className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all placeholder:text-gray-300 shadow-sm"
//               />
//               <User className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1d76d2] transition-colors" size={20} strokeWidth={2.5} />
//             </div>

//             {/* Password Field */}
//             <div className="relative group">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter Password"
//                 className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all placeholder:text-gray-300 shadow-sm"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1d76d2] transition-colors"
//               >
//                 {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
//               </button>
//             </div>

//             {/* Toggle Section */}
//             <div className="flex items-center space-x-3 px-2">
//               <button
//                 type="button"
//                 onClick={() => setRememberMe(!rememberMe)}
//                 className={`relative w-[48px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none ${rememberMe ? 'bg-[#3b82f6]/20' : 'bg-gray-100'}`}
//               >
//                 <div className={`absolute top-[4px] left-[4px] w-[16px] h-[16px] rounded-full transition-all duration-300 transform ${rememberMe ? 'translate-x-[24px] bg-[#1d76d2] shadow-md shadow-blue-200' : 'translate-x-0 bg-white shadow-sm'}`}></div>
//               </button>
//               <span className="text-[13px] font-bold text-gray-400">Remember me</span>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-5 rounded-[22px] text-[16px] font-black shadow-xl shadow-blue-200/50 transition-all transform active:scale-[0.98] mt-6"
//             >
//               Login
//             </button>
//           </form>

//           {/* Forgot Password */}
//           <div className="mt-10 text-center">
//             <p className="text-[13px] font-bold text-gray-400">
//               Forgot Password? <button type="button" className="text-[#3b82f6] hover:text-[#1d76d2] hover:underline transition-colors">Click Here</button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
