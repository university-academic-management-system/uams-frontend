import React, { useState } from 'react';
import { User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';
import authService from '../../../services/authService';

interface ActivateAccountStepProps {
  onNext: () => void;
  onForgotPassword: () => void;
}

const ActivateAccountStep: React.FC<ActivateAccountStepProps> = ({ onNext, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.activateAccount({ email, password });
      onNext();
    } catch (err: any) {
      setError(err.message || 'Account activation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[13px] font-bold">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter Email"
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
              disabled={isLoading}
            />
            <User
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter Phone Number"
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            onClick={handleActivate}
            disabled={isLoading}
            className="w-full bg-[#1d76d2] hover:bg-[#1565c0] disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-4 rounded-xl text-[16px] font-black shadow-lg shadow-blue-200/50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Activating...</span>
              </>
            ) : (
              'Activate Account'
            )}
          </button>
        </div>
      </AuthCard>
    </div>
  );
};

export default ActivateAccountStep;
