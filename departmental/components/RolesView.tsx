import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';

interface RoleEntry {
  id: string;
  idNo: string;
  name: string;
  status: 'Student' | 'Staff';
  office: string;
  permissions: {
    createProgram: boolean;
    createCourses: boolean;
    createBilling: boolean;
    viewPayments: boolean;
    createTest: boolean;
  };
}

const MOCK_ROLES: RoleEntry[] = [
  { id: '1', idNo: 'U2020/2502201', name: 'Justice Amadi', status: 'Student', office: 'Course Rep', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
  { id: '2', idNo: 'U2020/2502201', name: 'Glory King', status: 'Staff', office: 'HOD', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
  { id: '3', idNo: 'U2020/2502201', name: 'Goodness Alozie', status: 'Staff', office: 'ERO', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
  { id: '4', idNo: 'U2020/2502201', name: 'Justice Amadi', status: 'Student', office: 'Course Rep', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
  { id: '5', idNo: 'U2020/2502201', name: 'Justice Amadi', status: 'Student', office: 'Course Rep', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
  { id: '6', idNo: 'U2020/2502201', name: 'Justice Amadi', status: 'Student', office: 'Course Rep', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
  { id: '7', idNo: 'U2020/2502201', name: 'Justice Amadi', status: 'Student', office: 'Course Rep', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
  { id: '8', idNo: 'U2020/2502201', name: 'Justice Amadi', status: 'Student', office: 'Course Rep', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
  { id: '9', idNo: 'U2020/2502201', name: 'Justice Amadi', status: 'Student', office: 'Course Rep', permissions: { createProgram: false, createCourses: false, createBilling: false, viewPayments: false, createTest: false } },
];

export const RolesView: React.FC = () => {
  const [roles, setRoles] = useState<RoleEntry[]>(MOCK_ROLES);

  const togglePermission = (roleId: string, permissionKey: keyof RoleEntry['permissions']) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, [permissionKey]: !role.permissions[permissionKey] } }
        : role
    ));
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Roles & Permission</h2>
          <p className="text-xs text-slate-500 mt-1">This table contains a list of all staff and students with assigned responsibilities</p>
        </div>
        <button className="bg-[#1D7AD9] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all w-full sm:w-auto justify-center">
          <Plus size={18} /> Assign New Role
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
        <div className="relative w-full sm:w-80 group">
          <input 
            type="text" 
            placeholder="Search by name, office, or code" 
            className="bg-white border border-slate-200 text-xs py-2.5 pl-4 pr-10 rounded-xl outline-none w-full focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 shadow-sm" 
          />
          <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto">
          Filter
          <Filter size={14} className="text-slate-900" />
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-5 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                </th>
                <th className="px-6 py-5">ID No</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Office</th>
                <th className="px-6 py-5 text-center">Create Program</th>
                <th className="px-6 py-5 text-center">Create Courses</th>
                <th className="px-6 py-5 text-center">Create Billing</th>
                <th className="px-6 py-5 text-center">View Payments</th>
                <th className="px-6 py-5 text-center">Create Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-5 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
                  </td>
                  <td className="px-6 py-5 text-[11px] text-slate-400 font-medium">{role.idNo}</td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-700">{role.name}</td>
                  <td className="px-6 py-5 text-xs text-slate-500">{role.status}</td>
                  <td className="px-6 py-5 text-xs text-slate-500">{role.office}</td>
                  <td className="px-6 py-5 text-center">
                    <ToggleButton active={role.permissions.createProgram} onClick={() => togglePermission(role.id, 'createProgram')} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <ToggleButton active={role.permissions.createCourses} onClick={() => togglePermission(role.id, 'createCourses')} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <ToggleButton active={role.permissions.createBilling} onClick={() => togglePermission(role.id, 'createBilling')} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <ToggleButton active={role.permissions.viewPayments} onClick={() => togglePermission(role.id, 'viewPayments')} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <ToggleButton active={role.permissions.createTest} onClick={() => togglePermission(role.id, 'createTest')} />
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

const ToggleButton: React.FC<{ active: boolean; onClick: () => void }> = ({ active, onClick }) => (
  <button 
    onClick={onClick}
    className={`inline-flex items-center w-8 h-4.5 rounded-full p-0.5 transition-all duration-200 outline-none ${
      active ? 'bg-blue-600' : 'bg-white border border-slate-300'
    }`}
  >
    <div className={`w-3 h-3 rounded-full transition-all duration-200 shadow-sm ${
      active ? 'translate-x-3.5 bg-white' : 'translate-x-0 bg-slate-400'
    }`} />
  </button>
);
