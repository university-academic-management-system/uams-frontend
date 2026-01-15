import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { confirmIdCardPayment } from '../services/authService';

type PaymentStatus = 'loading' | 'success' | 'error';

const IdCardPaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [message, setMessage] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<{
    reference: string;
    amount: string;
    studentName: string;
  } | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const reference = searchParams.get('reference');
      
      if (!reference) {
        setStatus('error');
        setMessage('No payment reference found. Please try again.');
        return;
      }

      try {
        const response = await confirmIdCardPayment(reference);
        
        if (response.success && response.transaction.status === 'success') {
          setStatus('success');
          setMessage('Your ID card payment has been confirmed successfully!');
          setTransactionDetails({
            reference: response.transaction.reference,
            amount: response.transaction.amount,
            studentName: response.transaction.student_name,
          });
          // Save payment status to localStorage
          localStorage.setItem('idcard_paid', 'true');
        } else {
          setStatus('error');
          setMessage('Payment verification failed. Please contact support.');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'Failed to verify payment. Please try again.');
      }
    };

    confirmPayment();
  }, [searchParams]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 font-['Inter']">
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 size={40} className="text-blue-500 animate-spin" />
            </div>
            <h1 className="text-xl font-black text-[#1e293b] mb-3">
              Verifying Payment...
            </h1>
            <p className="text-[13px] text-gray-400 font-medium">
              Please wait while we confirm your ID card payment.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h1 className="text-xl font-black text-[#1e293b] mb-3">
              Payment Successful!
            </h1>
            <p className="text-[13px] text-gray-400 font-medium mb-6">
              {message}
            </p>
            
            {transactionDetails && (
              <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-[12px] text-gray-400 font-medium">Name</span>
                  <span className="text-[12px] text-[#1e293b] font-bold">{transactionDetails.studentName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-[12px] text-gray-400 font-medium">Reference</span>
                  <span className="text-[12px] text-[#1e293b] font-bold">{transactionDetails.reference}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[12px] text-gray-400 font-medium">Amount Paid</span>
                  <span className="text-[14px] text-green-600 font-black">{formatCurrency(transactionDetails.amount)}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/registration/other')}
              className="w-full bg-[#1d76d2] hover:bg-blue-700 text-white py-4 rounded-xl text-[14px] font-black shadow-lg shadow-blue-200/50 transition-all"
            >
              Continue to Registration
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-xl font-black text-[#1e293b] mb-3">
              Payment Verification Failed
            </h1>
            <p className="text-[13px] text-red-500 font-medium mb-8">
              {message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/registration/other')}
                className="flex-1 py-4 rounded-xl text-[14px] font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                Back to Registration
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#1d76d2] hover:bg-blue-700 text-white py-4 rounded-xl text-[14px] font-bold transition-all"
              >
                Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IdCardPaymentCallback;
