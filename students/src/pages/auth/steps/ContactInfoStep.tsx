import React from 'react';
import { Mail, Phone, ShoppingCart } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';

interface ContactInfoStepProps {
  onNext: () => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ onNext }) => (
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
      <div className="space-y-5">
        <div className="relative group">
          <input
            type="email"
            placeholder="Enter Email Address"
            className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
          />
          <Mail
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="relative group">
          <input
            type="tel"
            placeholder="Enter Phone Number"
            className="w-full bg-white border border-gray-300 rounded-xl py-4 px-6 text-[14px] font-medium text-[#1e293b] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-[#1d76d2] transition-all"
          />
          <Phone
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <button
          onClick={onNext}
          className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white py-4 rounded-xl text-[15px] font-black shadow-lg shadow-green-100 transition-all flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={20} />
          <span>Proceed To Checkout</span>
        </button>
      </div>
    </AuthCard>
  </div>
);

export default ContactInfoStep;
