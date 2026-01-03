
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  UserSquare2, 
  CreditCard, 
  ShieldCheck, 
  Megaphone, 
  Settings,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard' as ViewType },
  { icon: BookOpen, label: 'Program & Courses' as ViewType },
  { icon: Users, label: 'Staff' as ViewType },
  { icon: UserSquare2, label: 'Students' as ViewType },
  { icon: CreditCard, label: 'Payments' as ViewType },
  { icon: ShieldCheck, label: 'Roles & Permissions' as ViewType },
  { icon: Megaphone, label: 'Announcements' as ViewType },
  { icon: Settings, label: 'Settings' as ViewType },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onLogout }) => {
  return (
    <aside className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <GraduationCap size={24} />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-800">
          uniedu<span className="text-blue-600">.</span>
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onViewChange(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
              activeView === item.label 
                ? 'bg-slate-100 text-slate-900 font-semibold' 
                : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} className={activeView === item.label ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-red-600 hover:bg-red-50 group"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
};
