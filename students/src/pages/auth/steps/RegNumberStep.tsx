import React, { useState } from 'react';
import { User } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';

interface RegNumberStepProps {
  onNext: () => void;
}

const RegNumberStep: React.FC<RegNumberStepProps> = ({ onNext }) => (
  <div className="min-h-screen w-full flex items-center justify-center relative font-['Inter']">
    <AuthBackground />
    <AuthCard>
      <div className="text-center mb-10">
        <h1 className="text-2xl font-black text-[#1e293b] mb-3">
          Sign in
        </h1>
        <p className="text-[14px] font-medium text-gray-400">
          Welcome! Please input your registration number to sign in your account
        </p>
      </div>
      <div className="space-y-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="Enter Reg. Number"
            className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[15px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all placeholder:text-gray-400"
          />
          <User
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1d76d2] transition-colors"
            size={20}
          />
        </div>
        <button
          onClick={onNext}
          className="w-full bg-[#1d76d2] hover:bg-[#1565c0] text-white py-4 rounded-xl text-[16px] font-black shadow-lg shadow-blue-200/50 transition-all transform active:scale-[0.98]"
        >
          Submit
        </button>
      </div>
    </AuthCard>
  </div>
);

export default RegNumberStep;
