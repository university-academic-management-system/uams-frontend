import React from 'react';
import { CreditCard, Repeat, Landmark, Hash, ChevronRight } from 'lucide-react';

interface PaymentStepProps {
  onNext: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onNext }) => (
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
            onClick={onNext}
            className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white py-5 rounded-[22px] text-[16px] font-black shadow-xl shadow-green-100 transition-all mt-12"
          >
            Pay NGN 5000
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentStep;
