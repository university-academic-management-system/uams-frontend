
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, Camera, Shield, Save, Smartphone } from 'lucide-react';

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none border-2 ${
      checked ? 'bg-[#1b75d0] border-[#1b75d0]' : 'bg-slate-200 border-slate-200'
    }`}
  >
    <span
      className={`inline-block h-3 w-3 transform rounded-full transition-transform bg-white ${
        checked ? 'translate-x-5' : 'translate-x-1'
      }`}
    />
  </button>
);

const SettingsView: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    security: true,
    updates: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1b75d0] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-blue-200" />
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-[#1b75d0] text-white rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Uni Admin</h3>
            <p className="text-sm text-slate-500 font-medium">Super Administrator</p>
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-around">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase">Active</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                <p className="text-[10px] font-black text-slate-700 uppercase">Jan 2024</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500" />
              Quick Preferences
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">Email Notifications</span>
                <ToggleSwitch checked={notifications.email} onChange={() => handleToggle('email')} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">SMS Alerts</span>
                <ToggleSwitch checked={notifications.sms} onChange={() => handleToggle('sms')} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    defaultValue="Uni Admin"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="email" 
                    defaultValue="uniadmin@uniedu.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    defaultValue="+234 801 234 5678"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    defaultValue="Administration"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password Security */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Lock className="w-5 h-5 text-rose-500" />
              </div>
              Security & Password
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2 md:opacity-0 pointer-events-none hidden md:block">
                  <label className="text-xs font-bold text-slate-500">Placeholder</label>
                  <div className="h-11"></div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Min. 8 characters"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="Min. 8 characters"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  Tip: A strong password should contain a mix of letters, numbers, and special characters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
