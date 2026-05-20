import React, { useState } from 'react';
import { User, Loader2, AlertCircle } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';
import authService from '@/services/authService';
import { useVerifyStudentForm } from '@/forms/verify-student.form';
import type { VerifyStudentSchema } from '@/schemas/auth/verify-student.schema';

interface RegNumberStepProps {
  onNext: () => void;
}

const RegNumberStep: React.FC<RegNumberStepProps> = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useVerifyStudentForm();

  const onSubmit = async (data: VerifyStudentSchema) => {
    setIsLoading(true);
    setGlobalError('');

    try {
      await authService.verifyStudent(data.matricNumber);
      onNext();
    } catch (err: any) {
      setGlobalError(err.message || 'Verification failed. Please check your matriculation or reg. number.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 min-h-screen w-full flex items-center justify-center relative font-['Inter']">
      <AuthBackground />
      <AuthCard>
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-[#1e293b] mb-3">
            Verify Student
          </h1>
          <p className="text-[14px] font-medium text-gray-400">
            Welcome! Please input your matriculation or reg. number to verify your account
          </p>
        </div>
        
        {globalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[13px] font-bold">{globalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <div className="relative group">
              <input
                type="text"
                {...register("matricNumber")}
                placeholder="Enter Matriculation or Reg. Number"
                className={`w-full bg-white border ${errors.matricNumber ? 'border-red-500' : 'border-gray-300'} rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all placeholder:text-gray-400`}
                disabled={isLoading}
              />
              <User
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors"
                size={20}
              />
            </div>
            {errors.matricNumber && (
              <p className="text-[13px] text-red-500 px-2">{errors.matricNumber.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-accent)] hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-4 rounded-xl text-[16px] font-black shadow-lg shadow-blue-200/50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
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
        </form>
      </AuthCard>
    </div>
  );
};

export default RegNumberStep;
