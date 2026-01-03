
import React from 'react';
import { User, Mail, Phone, Lock, Bell, Globe, Camera, Save, ShieldCheck } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Profile & Settings</h2>
        <p className="text-slate-500 mt-1 text-sm">Manage your personal information, security, and departmental preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
          <div className="flex flex-col lg:row gap-10">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-36 h-36 rounded-[2rem] bg-slate-50 border-4 border-white overflow-hidden flex items-center justify-center shadow-xl shadow-slate-200/50">
                  <img src="https://picsum.photos/seed/admin/200/200" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:bg-blue-700 transition-all border-4 border-white">
                  <Camera size={20} />
                </button>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Administrator</p>
                <p className="text-xs text-slate-400 font-medium">Joined Jan 2024</p>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ProfileField icon={<User size={16} />} label="Full Name" value="Dept. Admin" />
                <ProfileField icon={<Mail size={16} />} label="Email Address" value="deptadmin@aaue.edu.ng" />
                <ProfileField icon={<Phone size={16} />} label="Phone Number" value="+234 812 345 6789" />
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer text-slate-700 font-medium">
                      <option>English (UK)</option>
                      <option>English (US)</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button className="flex items-center gap-2 bg-[#1D7AD9] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                  <Save size={18} /> Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security and Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Lock size={20} className="text-blue-600" /> Password & Security
            </h3>
            <div className="space-y-5">
              <SecurityInput label="Current Password" placeholder="••••••••" />
              <SecurityInput label="New Password" placeholder="••••••••" />
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold mt-2 shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">Change Password</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Bell size={20} className="text-blue-600" /> Notifications
            </h3>
            <div className="space-y-6">
              <ToggleRow label="Fee payment alerts" description="Receive emails when students pay school fees." active />
              <ToggleRow label="System maintenance" description="Updates about platform downtimes." active />
              <ToggleRow label="New staff registration" description="Alerts when new staff accounts are created." />
              <ToggleRow label="Course registration" description="Daily summary of student enrollments." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input 
        type="text" 
        defaultValue={value} 
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-700 font-medium" 
      />
    </div>
  </div>
);

const SecurityInput: React.FC<{ label: string; placeholder: string }> = ({ label, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    <input type="password" placeholder={placeholder} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" />
  </div>
);

const ToggleRow: React.FC<{ label: string; description: string; active?: boolean }> = ({ label, description, active }) => (
  <div className="flex items-center justify-between gap-4">
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{description}</p>
    </div>
    <div className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-all ${active ? 'bg-blue-600 shadow-inner' : 'bg-slate-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);
