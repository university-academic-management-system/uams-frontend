import React, { useState } from 'react';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import AuthCard from '../components/AuthCard';
import authService from '../../../services/authService';

interface PaymentStepProps {
  onNext: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onNext }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayNow = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.initializePayment();
      // Redirect to Paystack checkout page
      window.location.href = response.data.authorizationUrl;
    } catch (err: any) {
      setError(err.message || 'Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative font-['Inter']">
      <AuthBackground />
      <AuthCard>
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-[#1e293b] mb-3">
            Pay Department Annual Dues
          </h1>
          <p className="text-[14px] font-medium text-gray-400">
            Complete your payment to proceed with account activation
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-[13px] font-bold">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">Amount Due</span>
              <span className="text-2xl font-black text-[#1d76d2]">NGN 5,000</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <CreditCard size={20} />
              <span className="text-[13px] font-medium">Department Annual Dues</span>
            </div>
          </div>
          <button
            onClick={handlePayNow}
            disabled={isLoading}
            className="w-full bg-[#2ecc71] hover:bg-[#27ae60] disabled:bg-green-300 disabled:cursor-not-allowed text-white py-4 rounded-xl text-[16px] font-black shadow-lg shadow-green-200/50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Initializing Payment...</span>
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </AuthCard>
    </div>
  );
};

export default PaymentStep;
