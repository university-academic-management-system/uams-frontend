
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Settings as SettingsIcon, 
  UserSquare, // ID Card
  CreditCard, 
  Globe, 
  GraduationCap, 
  FileText,
  Edit
} from 'lucide-react';

type SettingsTab = 'SMS' | 'Email' | 'General' | 'ID Card' | 'Payment' | 'Website' | 'Academic' | 'Documents';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('SMS');

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      {/* Tabs Navigation */}
      <div className="bg-slate-50 p-1.5 rounded-lg flex items-center justify-between gap-1 overflow-x-auto mb-8 border border-slate-200">
         <TabButton active={activeTab === 'SMS'} onClick={() => setActiveTab('SMS')} icon={<MessageSquare size={16}/>} label="SMS" />
         <TabButton active={activeTab === 'Email'} onClick={() => setActiveTab('Email')} icon={<Mail size={16}/>} label="Email" />
         <TabButton active={activeTab === 'General'} onClick={() => setActiveTab('General')} icon={<SettingsIcon size={16}/>} label="General" />
         <TabButton active={activeTab === 'ID Card'} onClick={() => setActiveTab('ID Card')} icon={<UserSquare size={16}/>} label="ID Card" />
         <TabButton active={activeTab === 'Payment'} onClick={() => setActiveTab('Payment')} icon={<CreditCard size={16}/>} label="Payment" />
         <TabButton active={activeTab === 'Website'} onClick={() => setActiveTab('Website')} icon={<Globe size={16}/>} label="Website" />
         <TabButton active={activeTab === 'Academic'} onClick={() => setActiveTab('Academic')} icon={<GraduationCap size={16}/>} label="Academic" />
         <TabButton active={activeTab === 'Documents'} onClick={() => setActiveTab('Documents')} icon={<FileText size={16}/>} label="Documents" />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 min-h-[600px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900">Notification</h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
            <Edit size={16} />
            Edit
          </button>
        </div>

        {/* This content seems to be shared or specific to the Notification/Communication tabs */}
        <div className="max-w-3xl">
          <h3 className="font-bold text-slate-800 text-sm mb-6">
            Actionable Email Notifications <span className="text-slate-500 font-normal italic">Email me immediately when someone:</span>
          </h3>

          <div className="space-y-4">
             <CheckboxRow label="Changes their password" />
             <CheckboxRow label="Makes a payment" />
             <CheckboxRow label="Sends me a direct message" />
             <CheckboxRow label="Edits their profile" />
             <CheckboxRow label="Uploads a data" />
             <CheckboxRow label="Creates a new profile" />
             <CheckboxRow label="Onboards a new member" />
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active?: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all whitespace-nowrap
      ${active 
        ? 'bg-white text-[#1D7AD9] shadow-sm border border-slate-200' 
        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
      }`}
  >
    {icon}
    {label}
  </button>
);

const CheckboxRow: React.FC<{ label: string }> = ({ label }) => (
  <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors">
    <input 
      type="checkbox" 
      className="w-4 h-4 rounded border-slate-300 text-[#1D7AD9] focus:ring-[#1D7AD9]/20 cursor-pointer"
    />
    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
  </label>
);
