
import React from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Filter, 
  List, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2,
  MoreHorizontal
} from 'lucide-react';

interface Transaction {
  id: string;
  txId: string;
  from: string;
  for: string;
  amount: string;
  method: 'Mastercard' | 'Visa' | 'Bank transfer';
  methodDetail: string;
  date: string;
  status: 'Succeeded' | 'Pending' | 'Decline';
}

const TRANSACTIONS: Transaction[] = [
  { id: '1', txId: '06c1774d-46ad...90ae', from: 'Aisha Bello', for: 'School fees', amount: 'N230,000', method: 'Mastercard', methodDetail: '******7845', date: '23-08-2025', status: 'Succeeded' },
  { id: '2', txId: '06c1774d-46ad...90ae', from: 'Mica hope', for: 'School fees', amount: 'N230,000', method: 'Mastercard', methodDetail: '******7845', date: '23-08-2025', status: 'Succeeded' },
  { id: '3', txId: '06c1774d-46ad...90ae', from: 'Micheal Ali', for: 'Deptmental dues', amount: 'N45,000', method: 'Visa', methodDetail: '******7845', date: '23-08-2025', status: 'Pending' },
  { id: '4', txId: '08c1774d-46ad...90ae', from: 'Frank levi', for: 'School fees', amount: 'N340,000', method: 'Bank transfer', methodDetail: 'Bank transfer', date: '23-08-2025', status: 'Decline' },
  { id: '5', txId: '06c1774d-46ad...90ae', from: 'Freda Mark', for: 'School fees', amount: 'N340,000', method: 'Bank transfer', methodDetail: 'Bank transfer', date: '23-08-2025', status: 'Succeeded' },
  { id: '6', txId: '06c1774d-46ad...90ae', from: 'Noel Grace', for: 'Course registration', amount: 'N45,000', method: 'Bank transfer', methodDetail: 'Bank transfer', date: '23-08-2025', status: 'Decline' },
  { id: '7', txId: '06c1774d-46ad...90ae', from: 'Shavel Pie', for: 'Departmental dues', amount: 'N45,000', method: 'Visa', methodDetail: '******7845', date: '23-08-2025', status: 'Decline' },
  { id: '8', txId: '06c1774d-46ad...90ae', from: 'Levi Loe', for: 'School fees', amount: 'N340,000', method: 'Mastercard', methodDetail: '******7845', date: '23-08-2025', status: 'Succeeded' },
  { id: '9', txId: '06c1774d-46ad...90ae', from: 'Shalon Jay', for: 'School fees', amount: 'N340,000', method: 'Mastercard', methodDetail: '******7845', date: '23-08-2025', status: 'Succeeded' },
  { id: '10', txId: '06c1774d-46ad...90ae', from: 'Freda Lonard', for: 'School fees', amount: 'N340,000', method: 'Mastercard', methodDetail: '******7845', date: '23-08-2025', status: 'Succeeded' },
];

export const PaymentsView: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Payments</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
            <List size={18} />
            View Bill Log
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1D7AD9] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10">
            <Plus size={18} />
            Create New Bill
          </button>
        </div>
      </div>

      <div className="bg-[#F0F5FF] rounded-2xl p-6 mb-12 flex items-center gap-6 max-w-md border border-blue-100">
        <div className="w-14 h-14 bg-[#B4BDFF] rounded-xl flex items-center justify-center text-white shadow-sm">
          <CreditCard size={28} />
        </div>
        <div>
          <p className="text-sm font-medium text-[#7080B0] mb-1">Total Revenue Generated</p>
          <p className="text-3xl font-bold text-[#1E293B]">N28,000,000</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by name, email or code" 
                className="bg-white border border-slate-200 text-xs py-2.5 px-4 rounded-lg outline-none w-72 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400" 
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Download size={16} className="text-slate-400" />
              Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Filter size={16} className="text-slate-400" />
              Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 w-12">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                  </th>
                  <th className="px-6 py-4">Transaction Id</th>
                  <th className="px-6 py-4">Payment from</th>
                  <th className="px-6 py-4">Payment for</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-400 font-medium">{tx.txId}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{tx.from}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{tx.for}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{tx.amount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <PaymentIcon method={tx.method} />
                        <span className="text-[10px] text-slate-400 font-medium">{tx.methodDetail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-400 font-medium">{tx.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={tx.status} />
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

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
  const styles = {
    Succeeded: 'bg-[#D1FADF] text-[#027A48]',
    Pending: 'bg-[#FEF0C7] text-[#B54708]',
    Decline: 'bg-[#FEE4E2] text-[#B42318]',
  };

  const icons = {
    Succeeded: <CheckCircle2 size={12} />,
    Pending: <Clock size={12} />,
    Decline: <XCircle size={12} />,
  };

  return (
    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold w-fit ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const PaymentIcon: React.FC<{ method: Transaction['method'] }> = ({ method }) => {
  if (method === 'Bank transfer') {
    return <Building2 size={14} className="text-slate-400" />;
  }
  
  const brandColor = method === 'Visa' ? 'text-blue-800' : 'text-orange-600';
  
  return (
    <div className={`text-[8px] font-black uppercase italic ${brandColor} flex flex-col leading-none border border-slate-100 rounded px-1 py-0.5`}>
      {method === 'Mastercard' ? 'MC' : 'VISA'}
    </div>
  );
};
