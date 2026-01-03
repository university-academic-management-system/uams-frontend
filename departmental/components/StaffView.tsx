
import React from 'react';
import { Search, Plus, FileUp, Filter, MoreHorizontal } from 'lucide-react';

interface StaffListItem {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  level: string;
  program: string;
}

const STAFF_MOCK_DATA: StaffListItem[] = Array(12).fill(null).map((_, i) => ({
  id: `${i + 1}`,
  staffId: 'U2020/2502201',
  name: 'Justice Amadi',
  email: 'justiceamadi@gmail.com',
  phone: '+2348012345678',
  department: 'Computer Science',
  level: '100',
  program: 'Bachelors'
}));

export const StaffView: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Staff</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
            <FileUp size={18} />
            Upload CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1D7AD9] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10">
            <Plus size={18} />
            Add Staff
          </button>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by name, email or code" 
            className="bg-white border border-slate-200 text-xs py-2.5 px-4 rounded-lg outline-none w-72 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 shadow-sm" 
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={16} className="text-slate-800" />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="px-6 py-5 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                </th>
                <th className="px-6 py-5">Staff ID</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Phone No</th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5">Level</th>
                <th className="px-6 py-5">Program</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STAFF_MOCK_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                  </td>
                  <td className="px-6 py-5 text-[11px] text-slate-400 font-medium">
                    {item.staffId}
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-700">
                    {item.name}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">
                    {item.email}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">
                    {item.phone}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">
                    {item.department}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">
                    {item.level}
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-[#2ECC71] text-white px-5 py-1.5 rounded-lg text-[10px] font-bold shadow-sm inline-block min-w-[90px] text-center">
                      {item.program}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
