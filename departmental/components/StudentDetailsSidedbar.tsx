// components/StudentDetailsSidebar.tsx
import React, { useState } from "react";
import { X, User, Mail, Phone, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { Student, StudentProfile } from "../types";
import api from "../api/axios";
import { studentsApi } from "../api/studentsapi";

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
  const [selectedRole, setSelectedRole] = useState<'CLASS_REP' | 'ASSISTANT_CLASS_REP' | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch full profile on mount or when student changes
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await studentsApi.getStudentProfile(student.id);
        setProfile(data);
        
        // Set initial role from profile
        const roles = data.user.Roles.map((r: any) => r.name);
        if (roles.includes('CLASS_REP')) setSelectedRole('CLASS_REP');
        else if (roles.includes('ASSISTANT_CLASS_REP')) setSelectedRole('ASSISTANT_CLASS_REP');
        else setSelectedRole(null);
        
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (student.id) {
      fetchProfile();
    }
  }, [student.id]);

  const handleRoleChange = (role: 'CLASS_REP' | 'ASSISTANT_CLASS_REP') => {
    // Toggle: if already selected, deselect; otherwise select this one
    setSelectedRole((prev) => (prev === role ? null : role));
    setSaveError(null);
  };

  const handleSaveRole = async () => {
    if (!selectedRole) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      await api.post('/class-rep/assign', {
        userId: student.id,
        role: selectedRole,
      });
      // Success - close the sidebar or show success message
      onClose();
    } catch (err: any) {
      console.error('Failed to assign role:', err);
      setSaveError(err.response?.data?.message || 'Failed to assign role. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-sm text-slate-400">Loading profile...</p>
        </div>
      ) : profile ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 border-4 border-white shadow-lg overflow-hidden relative">
              {profile.user.avatar ? (
                <img 
                  src={profile.user.avatar.startsWith('data:') ? profile.user.avatar : `data:image/jpeg;base64,${profile.user.avatar}`} 
                  alt={profile.user.fullName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} />
              )}
            </div>
            <h4 className="text-lg font-bold text-slate-900">{profile.user.fullName}</h4>
            <p className="text-xs text-slate-400">{profile.studentId}</p>
            <div className="mt-2 flex items-center gap-2 justify-center">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  profile.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profile.isActive ? "Active" : "Inactive"}
              </span>

              {/* Role Badge */}
              {selectedRole && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  selectedRole === 'CLASS_REP' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedRole === 'CLASS_REP' ? 'Class Rep' : 'Asst. Rep'}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <BioItem
              icon={<Mail size={14} />}
              label="Email Address"
              value={profile.user.email}
            />
            <BioItem
              icon={<Phone size={14} />}
              label="Phone Number"
              value={profile.user.phone}
            />
            <BioItem
              icon={<Calendar size={14} />}
              label="Session"
              value={profile.session?.name || "N/A"}
            />
            <BioItem
              icon={<ShieldCheck size={14} />}
              label="Department"
              value={profile.Department?.name || "N/A"}
            />
            <BioItem
              icon={<ShieldCheck size={14} />}
              label="Program"
              value={profile.Program?.name || "N/A"}
            />
            <BioItem
              icon={<ShieldCheck size={14} />}
              label="Level"
              value={profile.Level?.name || "N/A"}
            />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">CGPA</p>
                  <p className="text-lg font-bold text-slate-800">{profile.currentGPA || "0.00"}</p>
               </div>
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Credits</p>
                  <p className="text-lg font-bold text-slate-800">{profile.totalCreditsEarned}</p>
               </div>
            </div>
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
                checked={selectedRole === 'CLASS_REP'}
                onChange={() => handleRoleChange('CLASS_REP')}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                Assign as Asst. Class Rep
              </span>
              <input
                type="checkbox"
                checked={selectedRole === 'ASSISTANT_CLASS_REP'}
                onChange={() => handleRoleChange('ASSISTANT_CLASS_REP')}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
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
            {saveError && (
              <p className="text-xs text-red-500 font-medium">{saveError}</p>
            )}
            <div className="pt-2">
              <button
                onClick={handleSaveRole}
                disabled={!selectedRole || isSaving}
                className={`w-full py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 ${
                  selectedRole && !isSaving
                    ? 'bg-[#1D7AD9] text-white hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Role Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
      ) : null}
    </div>
  );

};
