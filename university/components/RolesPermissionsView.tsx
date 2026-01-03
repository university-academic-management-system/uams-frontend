
import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';

interface PermissionState {
  createProgram: boolean;
  editResults: boolean;
  createBilling: boolean;
  deleteUsers: boolean;
  createTest: boolean;
}

interface RoleRecord {
  id: string;
  code: string;
  role: string;
  name: string;
  permissions: PermissionState;
}

const initialRoles: RoleRecord[] = Array(12).fill(null).map((_, i) => ({
  id: `role-${i}`,
  code: 'UNI-001',
  role: 'Department Admin',
  name: 'Computer Science',
  permissions: {
    createProgram: true,
    editResults: false,
    createBilling: i % 2 === 0,
    deleteUsers: false,
    createTest: true,
  }
}));

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none border-2 ${
      checked ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300'
    }`}
  >
    <span
      className={`inline-block h-3 w-3 transform rounded-full transition-transform ${
        checked ? 'translate-x-5 bg-white' : 'translate-x-1 bg-slate-400'
      }`}
    />
  </button>
);

const RolesPermissionsView: React.FC = () => {
  const [roles, setRoles] = useState<RoleRecord[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = (roleId: string, permission: keyof PermissionState) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, permissions: { ...role.permissions, [permission]: !role.permissions[permission] } }
        : role
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Roles & Permission</h2>
        
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1b75d0] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
          <Plus className="w-4 h-4" />
          Create New Admin
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, email or code"
            className="w-full pl-6 pr-12 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="p-6 w-16 text-center">
                  <input type="checkbox" className="rounded border-slate-300 bg-white accent-blue-600 w-4 h-4 cursor-pointer" />
                </th>
                <th className="p-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Code</th>
                <th className="p-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Admin Role</th>
                <th className="p-6 text-slate-500 font-bold text-xs uppercase tracking-wider">Name</th>
                <th className="p-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">Create Program</th>
                <th className="p-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">Edit Results</th>
                <th className="p-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">Create Billing</th>
                <th className="p-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">Delete Users</th>
                <th className="p-6 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">Create Test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 text-center">
                    <input type="checkbox" className="rounded border-slate-300 bg-white accent-blue-600 w-4 h-4 cursor-pointer" />
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-500">{role.code}</td>
                  <td className="p-6 text-xs font-bold text-slate-400">{role.role}</td>
                  <td className="p-6 text-xs font-bold text-slate-800">{role.name}</td>
                  <td className="p-6 text-center">
                    <ToggleSwitch 
                      checked={role.permissions.createProgram} 
                      onChange={() => handleToggle(role.id, 'createProgram')} 
                    />
                  </td>
                  <td className="p-6 text-center">
                    <ToggleSwitch 
                      checked={role.permissions.editResults} 
                      onChange={() => handleToggle(role.id, 'editResults')} 
                    />
                  </td>
                  <td className="p-6 text-center">
                    <ToggleSwitch 
                      checked={role.permissions.createBilling} 
                      onChange={() => handleToggle(role.id, 'createBilling')} 
                    />
                  </td>
                  <td className="p-6 text-center">
                    <ToggleSwitch 
                      checked={role.permissions.deleteUsers} 
                      onChange={() => handleToggle(role.id, 'deleteUsers')} 
                    />
                  </td>
                  <td className="p-6 text-center">
                    <ToggleSwitch 
                      checked={role.permissions.createTest} 
                      onChange={() => handleToggle(role.id, 'createTest')} 
                    />
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

export default RolesPermissionsView;
