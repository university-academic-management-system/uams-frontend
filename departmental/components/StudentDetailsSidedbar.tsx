// components/StudentDetailsSidebar.tsx
import React from "react";
import { X, User, Mail, Phone, Calendar, ShieldCheck } from "lucide-react";
import { Student } from "../types";

interface StudentDetailsSidebarProps {
  student: Student;
  onClose: () => void;
}

const BioItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-slate-400">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase truncate">
        {label}
      </p>
      <p className="text-xs font-semibold text-slate-700 truncate">{value}</p>
    </div>
  </div>
);

const PermissionToggle: React.FC<{ label: string; active?: boolean }> = ({
  label,
  active,
}) => (
  <span
    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
      active
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-slate-400 border-slate-200 hover:border-blue-200 hover:text-blue-500"
    }`}
  >
    {label}
  </span>
);

export const StudentDetailsSidebar: React.FC<StudentDetailsSidebarProps> = ({
  student,
  onClose,
}) => {
  return (
    <div className="fixed top-16 right-0 w-[380px] h-[calc(100vh-64px)] bg-white border-l border-gray-100 shadow-2xl z-40 animate-in slide-in-from-right duration-300 flex flex-col">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Student Bio</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
            <User size={40} />
          </div>
          <h4 className="text-lg font-bold text-slate-900">{student.name}</h4>
          <p className="text-xs text-slate-400">{student.studentId}</p>
          <div className="mt-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                student.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {student.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <BioItem
            icon={<Mail size={14} />}
            label="Email Address"
            value={student.email}
          />
          <BioItem
            icon={<Phone size={14} />}
            label="Phone Number"
            value={student.phoneNo}
          />
          <BioItem
            icon={<Calendar size={14} />}
            label="Year Enrolled"
            value={student.createdAt}
          />
          <BioItem
            icon={<ShieldCheck size={14} />}
            label="Department"
            value={student.department}
          />
          <BioItem
            icon={<ShieldCheck size={14} />}
            label="Current Level"
            value={student.level}
          />
        </div>

        <div className="pt-6 border-t border-gray-50">
          <h5 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600" /> Academic Roles
          </h5>
          <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                Assign as Class Rep
              </span>
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Class Rep Permissions
              </label>
              <div className="flex flex-wrap gap-2">
                <PermissionToggle label="Post Updates" active />
                <PermissionToggle label="View Results" />
                <PermissionToggle label="Manage Attendance" active />
              </div>
            </div>
            <div className="pt-2">
              <button className="w-full bg-[#1D7AD9] text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10">
                Save Role Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
