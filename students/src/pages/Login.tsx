import React, { useState } from "react";
import {
  User,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ShoppingCart,
  CreditCard,
  Landmark,
  Repeat,
  Hash,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../services/authService";

interface LoginProps {
  onLogin?: () => void;
}

type AuthStep =
  | "reg-number"
  | "contact-info"
  | "payment"
  | "activate"
  | "login"
  | "forgot-password"
  | "verify-code"
  | "reset-password"
  | "reset-success";

const ForgotPasswordLogo = () => (
  <div className="flex justify-center mb-6">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-[#3b82f6] rounded-full"></div>
      <div className="absolute inset-0 border-4 border-[#ef4444] rounded-full rotate-15 clip-path-half"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-0.5 bg-[#3b82f6] -rotate-45"></div>
      </div>
    </div>
    <style>{`
      .clip-path-half {
        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
      }
    `}</style>
  </div>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const params = useParams();
  const navigate = useNavigate();
  const pathSeg = params["*"] || "";
  const step = (pathSeg === "" ? "reg-number" : pathSeg) as AuthStep;
  const go = (s: AuthStep) => {
    navigate(s === "reg-number" ? "/login" : `/login/${s}`);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        onLogin?.();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const AuthBackground = () => (
    <div className="hidden lg:block lg:w-[65%] relative">
      <img
        src={`${import.meta.env.BASE_URL}assets/login-image.png`}
        alt="EduFlow Login Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10"></div>
    </div>
  );

  const AuthCard = ({
    children,
    className = "",
    isPlainLogo = true,
  }: {
    children: React.ReactNode;
    className?: string;
    isPlainLogo?: boolean;
  }) => (
    <div
      className={`w-full max-w-md bg-[#f9fbff] p-8 lg:p-12 rounded-[48px] border border-[#e2e8f0]/60 shadow-xl lg:shadow-2xl animate-in fade-in zoom-in-95 duration-500 ${className}`}
    >
      <div className="flex justify-center mb-10">
        <img
          src={`${import.meta.env.BASE_URL}assets/spedox.jpg`}
          alt="Spedox Logo"
          className="h-10 lg:h-12"
          onError={(e: any) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      {children}
    </div>
  );

  // --- RECOVERY FLOW STEPS ---

  if (
    [
      "forgot-password",
      "verify-code",
      "reset-password",
      "reset-success",
    ].includes(step)
  ) {
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
    const currentImage = recoveryImages[step];

    return (
      <div className="min-h-screen w-full flex bg-white font-['Inter']">
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-white">
          {currentImage && (
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-sm w-full h-auto"
            />
          )}
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
          <AuthCard>
            {step === "forgot-password" && (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-xl font-black text-[#1e293b] mb-2">
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
                      className="w-full bg-white border border-gray-200 rounded-[14px] py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                    />
                  </div>
                  <button
                    onClick={() => go("verify-code")}
                    className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4.5 rounded-[14px] text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all"
                  >
                    Send Code
                  </button>
                  <button
                    onClick={() => go("login")}
                    className="w-full flex items-center justify-center space-x-2 text-[13px] font-bold text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to login</span>
                  </button>
                </div>
              </>
            )}
            {step === "verify-code" && (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-xl font-black text-[#1e293b] mb-2">
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
                        className="w-full h-12 text-center border border-gray-200 rounded-lg text-lg font-bold text-[#1e293b] focus:border-[#1d76d2] focus:ring-2 focus:ring-blue-100 outline-none"
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
                    onClick={() => go("reset-password")}
                    className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4.5 rounded-[14px] text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
            {step === "reset-password" && (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-xl font-black text-[#1e293b] mb-2">
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
                      className="w-full bg-white border border-gray-200 rounded-[14px] py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Confirm new Password"
                      className="w-full bg-white border border-gray-200 rounded-[14px] py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                    />
                  </div>
                  <button
                    onClick={() => go("reset-success")}
                    className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4.5 rounded-[14px] text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
            {step === "reset-success" && (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                      <CheckCircle className="w-10 h-10 text-[#2ecc71]" />
                    </div>
                  </div>
                  <h1 className="text-xl font-black text-[#1e293b] mb-2">
                    Password Reset successfully
                  </h1>
                  <p className="text-[12px] font-medium text-gray-400">
                    Your password has been updated successfully
                  </p>
                </div>
                <button
                  onClick={() => go("login")}
                  className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4.5 rounded-[14px] text-[15px] font-black shadow-lg shadow-blue-200/50 transition-all"
                >
                  Continue
                </button>
              </>
            )}
          </AuthCard>
        </div>
      </div>
    );
  }

  // --- ORIGINAL AUTH FLOW STEPS ---

  if (step === "reg-number") {
    return (
      <div className="min-h-screen w-full flex bg-white font-['Inter']">
        <AuthBackground />
        <div className="w-full lg:w-[35%] flex items-center justify-center p-6 bg-white lg:bg-[#fcfdfe]">
          <AuthCard>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-[#1e293b] mb-2">
                Sign in
              </h1>
              <p className="text-[13px] font-medium text-gray-400 leading-relaxed px-4">
                Welcome! Please input your registration number to sign in your
                account
              </p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter Reg. Number"
                  className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all placeholder:text-gray-300"
                />
                <User
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1d76d2]"
                  size={20}
                />
              </div>
              <button
                onClick={() => go("contact-info")}
                className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-5 rounded-[22px] text-[16px] font-black shadow-lg shadow-blue-200/50 transition-all transform active:scale-[0.98]"
              >
                Submit
              </button>
            </div>
          </AuthCard>
        </div>
      </div>
    );
  }

  if (step === "contact-info") {
    return (
      <div className="min-h-screen w-full flex bg-white font-['Inter']">
        <AuthBackground />
        <div className="w-full lg:w-[35%] flex items-center justify-center p-6 bg-white lg:bg-[#fcfdfe]">
          <AuthCard>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-[#1e293b] mb-2">
                Sign in
              </h1>
              <p className="text-[13px] font-medium text-gray-400 leading-relaxed px-4">
                Welcome! Please input your registration number to sign in your
                account
              </p>
            </div>
            <div className="space-y-5">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="w-full bg-white border border-gray-200 rounded-[22px] py-4 px-7 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                />
                <Mail
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300"
                  size={20}
                />
              </div>
              <div className="relative group">
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="w-full bg-white border border-gray-200 rounded-[22px] py-4 px-7 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                />
                <Phone
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300"
                  size={20}
                />
              </div>
              <button
                onClick={() => go("payment")}
                className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white py-4.5 rounded-[22px] text-[15px] font-black shadow-lg shadow-green-100 transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Proceed To Checkout</span>
              </button>
            </div>
          </AuthCard>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4 lg:p-12 font-['Inter'] animate-in fade-in duration-700">
        <div className="bg-white rounded-[40px] w-full max-w-5xl p-8 lg:p-14 shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="mb-12">
            <h2 className="text-2xl font-black text-[#1e293b]">Make Payment</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                Purpose
              </p>
              <p className="text-[16px] font-black text-[#1e293b]">
                Course Registration
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                Transaction ID:
              </p>
              <p className="text-[16px] font-black text-[#1e293b]">
                06c1774d-46ad....90ae
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                Amount:
              </p>
              <p className="text-4xl font-black text-[#1d76d2]">NGN 5000</p>
            </div>
          </div>

          <div className="grid grid-cols-12 rounded-4xl overflow-hidden border border-slate-50 shadow-sm min-h-125">
            <div className="col-span-12 md:col-span-4 bg-[#f8fafc] p-8 border-r border-slate-50">
              <h3 className="text-[12px] font-black text-slate-300 mb-10 tracking-widest">
                PAY WITH
              </h3>
              <nav className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 text-[#2ecc71] shadow-sm">
                  <div className="flex items-center space-x-3 font-black text-[14px]">
                    <CreditCard size={18} />
                    <span>Card</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button className="w-full flex items-center space-x-3 p-4 text-slate-400 font-bold text-[14px] hover:text-slate-600 transition-colors">
                  <Repeat size={18} />
                  <span>Transfer</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 text-slate-400 font-bold text-[14px] hover:text-slate-600 transition-colors">
                  <Landmark size={18} />
                  <span>Bank</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 text-slate-400 font-bold text-[14px] hover:text-slate-600 transition-colors">
                  <Hash size={18} />
                  <span>USSD</span>
                </button>
              </nav>
            </div>

            <div className="col-span-12 md:col-span-8 p-10 lg:p-14 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-12">
                <div className="space-y-1">
                  <div className="h-1.5 w-8 bg-blue-500 rounded-full"></div>
                  <div className="h-1.5 w-6 bg-blue-300 rounded-full"></div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Pay <span className="text-[#2ecc71]">NGN 5000</span>
                </p>
              </div>

              <h4 className="text-center font-black text-slate-500 mb-10 text-[15px]">
                Enter your card details to pay
              </h4>

              <div className="space-y-8 flex-1">
                <div className="border-b-2 border-slate-50 pb-2">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-transparent text-lg font-black text-[#1e293b] focus:outline-none placeholder:text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-12">
                  <div className="border-b-2 border-slate-50 pb-2">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">
                      Card Expiry
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-transparent text-lg font-black text-[#1e293b] focus:outline-none placeholder:text-slate-100"
                    />
                  </div>
                  <div className="border-b-2 border-slate-50 pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        CVV
                      </label>
                      <span className="text-[9px] font-black text-slate-200">
                        HELP
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-transparent text-lg font-black text-[#1e293b] focus:outline-none placeholder:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => go("activate")}
                className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white py-5 rounded-[22px] text-[16px] font-black shadow-xl shadow-green-100 transition-all mt-12"
              >
                Pay NGN 5000
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "activate") {
    return (
      <div className="min-h-screen w-full flex bg-white font-['Inter']">
        <AuthBackground />
        <div className="w-full lg:w-[35%] flex items-center justify-center p-6 bg-white lg:bg-[#fcfdfe]">
          <AuthCard>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-[#1e293b] mb-2">
                Activate Account
              </h1>
              <p className="text-[12px] font-medium text-gray-400 leading-relaxed px-4">
                Welcome back please activate your account using your email and
                phone number as username and password respectively
              </p>
            </div>
            <div className="space-y-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Enter Username"
                  className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                />
                <User
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300"
                  size={20}
                />
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-500"
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
                onClick={() => go("login")}
                className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-5 rounded-[22px] text-[16px] font-black shadow-lg shadow-blue-200/50 transition-all"
              >
                Activate Account
              </button>
              <div className="text-center mt-4">
                <p className="text-[12px] font-bold text-gray-400">
                  Forgot Password?{" "}
                  <button
                    onClick={() => go("forgot-password")}
                    className="text-[#3b82f6] cursor-pointer hover:underline"
                  >
                    Click Here
                  </button>
                </p>
              </div>
            </div>
          </AuthCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-white font-['Inter']">
      <AuthBackground />
      <div className="w-full lg:w-[35%] flex items-center justify-center p-6 bg-white lg:bg-[#fcfdfe]">
        <AuthCard>
          <div className="text-center mb-10">
            <h1 className="text-2xl font-black text-[#1e293b] mb-2">Login</h1>
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
                placeholder="Enter Username"
                className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
              />
              <User
                className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1d76d2]"
                size={20}
              />
            </div>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full bg-white border border-gray-200 rounded-[22px] py-4.5 px-7 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1d76d2]"
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
              className="w-full bg-[#1d76d2] hover:bg-[#1565c0] disabled:bg-gray-400 text-white py-5 rounded-[22px] text-[16px] font-black shadow-xl shadow-blue-200/50 transition-all mt-4"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <div className="mt-10 text-center">
              <p className="text-[13px] font-bold text-gray-400">
                Forgot Password?{" "}
                <button
                  type="button"
                  onClick={() => go("forgot-password")}
                  className="text-[#3b82f6] cursor-pointer hover:underline"
                >
                  Click Here
                </button>
              </p>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
