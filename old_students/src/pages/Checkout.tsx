import React, { useState } from 'react';

const Checkout: React.FC = () => {
  // Placeholder state for demonstration
  const [amount] = useState(5000);
  const [method, setMethod] = useState('card');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl flex flex-col md:flex-row gap-8">
        {/* Payment Details */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Make Payment</h2>
          <div className="mb-4">
            <span className="font-semibold">Purpose:</span> Course Registration
          </div>
          <div className="mb-4">
            <span className="font-semibold">Transaction ID:</span> 06c17744-46ad...90ae
          </div>
          <div className="mb-4 text-right">
            <span className="font-semibold">Amount:</span> <span className="text-blue-600 text-2xl">NGN {amount}</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="mb-2 font-semibold">PAY WITH</div>
            <div className="space-y-2">
              <button onClick={() => setMethod('card')} className={`flex items-center w-full px-4 py-2 rounded-lg ${method === 'card' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700'} border border-gray-200`}>
                <span className="material-icons mr-2">credit_card</span> Card
              </button>
              <button onClick={() => setMethod('transfer')} className={`flex items-center w-full px-4 py-2 rounded-lg ${method === 'transfer' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700'} border border-gray-200`}>
                <span className="material-icons mr-2">swap_horiz</span> Transfer
              </button>
              <button onClick={() => setMethod('bank')} className={`flex items-center w-full px-4 py-2 rounded-lg ${method === 'bank' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700'} border border-gray-200`}>
                <span className="material-icons mr-2">account_balance</span> Bank
              </button>
              <button onClick={() => setMethod('ussd')} className={`flex items-center w-full px-4 py-2 rounded-lg ${method === 'ussd' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700'} border border-gray-200`}>
                <span className="material-icons mr-2">dialpad</span> *# USSD
              </button>
            </div>
          </div>
        </div>
        {/* Card Payment Form */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center font-semibold mb-4">Enter your card details to pay</div>
            <form className="space-y-4">
              <input type="text" placeholder="CARD NUMBER" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              <div className="flex gap-2">
                <input type="text" placeholder="MM / YY" className="w-1/2 border border-gray-300 rounded-lg px-4 py-2" />
                <input type="text" placeholder="CVV" className="w-1/2 border border-gray-300 rounded-lg px-4 py-2" />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white font-semibold rounded-lg py-3 mt-2">Pay NGN {amount}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
