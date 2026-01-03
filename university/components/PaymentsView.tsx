
import React, { useState } from 'react';
import { Search, Plus, FileUp, Filter, MoreHorizontal, Download, CreditCard, Building2, Landmark, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  from: string;
  for: string;
  amount: string;
  method: 'Mastercard' | 'Visa' | 'Bank transfer';
  methodDetail: string;
  date: string;
  status: 'Succeeded' | 'Pending' | 'Decline';
}

const initialTransactions: Transaction[] = [
  { id: '06c1774d-46ad...80ae', from: 'Aisha Bello', for: 'School fees', amount: 'N230,000', method: 'Mastercard', methodDetail: '*******7845', date: '23-08-2025', status: 'Succeeded' },
  { id: '06c1774d-46ad...80ae', from: 'Mica hope', for: 'School fees', amount: 'N230,000', method: 'Mastercard', methodDetail: '*******7845', date: '23-08-2025', status: 'Succeeded' },
  { id: '06c1774d-46ad...80ae', from: 'Micheal Ali', for: 'Deptmental dues', amount: 'N45,000', method: 'Visa', methodDetail: '*******7845', date: '23-08-2025', status: 'Pending' },
  { id: '06c1774d-46ad...80ae', from: 'Frank levi', for: 'School fees', amount: 'N340,000', method: 'Bank transfer', methodDetail: 'Bank transfer', date: '23-08-2025', status: 'Decline' },
  { id: '06c1774d-46ad...80ae', from: 'Freda Mark', for: 'School fees', amount: 'N340,000', method: 'Bank transfer', methodDetail: 'Bank transfer', date: '23-08-2025', status: 'Succeeded' },
  { id: '06c1774d-46ad...80ae', from: 'Noal Grace', for: 'Course registration', amount: 'N45,000', method: 'Bank transfer', methodDetail: 'Bank transfer', date: '23-08-2025', status: 'Decline' },
  { id: '06c1774d-46ad...80ae', from: 'Shavel Pie', for: 'Departmental dues', amount: 'N45,000', method: 'Visa', methodDetail: '*******7845', date: '23-08-2025', status: 'Decline' },
  { id: '06c1774d-46ad...80ae', from: 'Levi Loe', for: 'School fees', amount: 'N340,000', method: 'Mastercard', methodDetail: '*******7845', date: '23-08-2025', status: 'Succeeded' },
  { id: '06c1774d-46ad...80ae', from: 'Shalon Jay', for: 'School fees', amount: 'N340,000', method: 'Mastercard', methodDetail: '*******7845', date: '23-08-2025', status: 'Succeeded' },
  { id: '06c1774d-46ad...80ae', from: 'Freda Lonard', for: 'School fees', amount: 'N340,000', method: 'Mastercard', methodDetail: '*******7845', date: '23-08-2025', status: 'Succeeded' },
];

const StatusBadge = ({ status }: { status: Transaction['status'] }) => {
  const styles = {
    'Succeeded': 'bg-emerald-100 text-emerald-600',
    'Pending': 'bg-amber-100 text-amber-600',
    'Decline': 'bg-rose-100 text-rose-500',
  };

  const icons = {
    'Succeeded': <CheckCircle2 className="w-3 h-3" />,
    'Pending': <Clock className="w-3 h-3" />,
    'Decline': <AlertCircle className="w-3 h-3" />,
  };

  return (
    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 min-w-[110px] ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const PaymentMethodIcon = ({ method, detail }: { method: Transaction['method'], detail: string }) => {
  if (method === 'Mastercard') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          <div className="w-4 h-4 rounded-full bg-rose-500 opacity-80"></div>
          <div className="w-4 h-4 rounded-full bg-amber-500 opacity-80"></div>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">{detail}</span>
      </div>
    );
  }
  if (method === 'Visa') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black italic text-blue-800 tracking-tighter uppercase">Visa</span>
        <span className="text-[10px] text-slate-400 font-medium">{detail}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Landmark className="w-4 h-4 text-slate-400" />
      <span className="text-[10px] text-slate-400 font-medium">{detail}</span>
    </div>
  );
};

const PaymentsView: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <h2 className="text-2xl font-bold text-slate-800">Payments</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-blue-500 text-blue-500 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all">
            <div className="w-4 h-4 border-2 border-current rounded-[2px] flex items-center justify-center">
              <div className="w-2 h-[1px] bg-current"></div>
            </div>
            View Bill Log
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1b75d0] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md">
            <Plus className="w-4 h-4" />
            Create New Bill
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-[#f0f4ff] p-8 md:p-10 rounded-[2rem] border border-blue-100 flex items-center gap-8 max-w-xl">
        <div className="p-4 bg-white/60 rounded-2xl shadow-sm">
          <div className="p-2 bg-blue-100/50 rounded-lg">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-2">Total Revenue Generated</p>
          <p className="text-3xl md:text-4xl font-black text-slate-900">N28,000,000</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                placeholder="Search by name, email or code"
                className="w-full pl-6 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-300"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-6 w-12 text-center">
                    <input type="checkbox" className="rounded border-slate-200 bg-white accent-blue-600 w-4 h-4 cursor-pointer" />
                  </th>
                  <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">Transaction Id</th>
                  <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">Payment from</th>
                  <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">Payment for</th>
                  <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">Payment method</th>
                  <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="p-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {initialTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-all duration-200">
                    <td className="p-6 text-center">
                      <input type="checkbox" className="rounded border-slate-200 bg-white accent-blue-600 w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="p-6 text-[10px] font-medium text-slate-400 whitespace-nowrap">{tx.id}</td>
                    <td className="p-6 text-[10px] font-bold text-slate-700 whitespace-nowrap">{tx.from}</td>
                    <td className="p-6 text-[10px] font-medium text-slate-400 whitespace-nowrap">{tx.for}</td>
                    <td className="p-6 text-[10px] font-bold text-slate-900 whitespace-nowrap">{tx.amount}</td>
                    <td className="p-6 whitespace-nowrap">
                      <PaymentMethodIcon method={tx.method} detail={tx.methodDetail} />
                    </td>
                    <td className="p-6 text-[10px] font-medium text-slate-500 whitespace-nowrap">{tx.date}</td>
                    <td className="p-6 text-center whitespace-nowrap">
                      <div className="flex justify-center">
                        <StatusBadge status={tx.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsView;
