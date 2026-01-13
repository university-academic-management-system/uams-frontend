import React, { useState } from 'react';
import { User, Loader2, AlertCircle } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';
import authService from '../../../services/authService';

interface RegNumberStepProps {
  onNext: () => void;
}

const RegNumberStep: React.FC<RegNumberStepProps> = ({ onNext }) => {
  const [matricNumber, setMatricNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!matricNumber.trim()) {
      setError('Please enter your matriculation number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.verifyStudent(matricNumber);
      onNext();
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your matriculation number.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-['Inter']">
      <AuthBackground />
      <AuthCard>
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-[#1e293b] mb-3">
            Verify Student
          </h1>
          <p className="text-[14px] font-medium text-gray-400">
            Welcome! Please input your matriculation number to verify your account
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
              type="text"
              value={matricNumber}
              onChange={(e) => {
                setMatricNumber(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter Matriculation Number"
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all placeholder:text-gray-400"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <User
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d76d2] transition-colors"
              size={20}
            />
          </div>
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="w-full bg-[#1d76d2] hover:bg-[#1565c0] disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-4 rounded-xl text-[16px] font-black shadow-lg shadow-blue-200/50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              'Verify'
            )}
          </button>
        </div>
      </AuthCard>
    </div>
  );
};

export default RegNumberStep;
