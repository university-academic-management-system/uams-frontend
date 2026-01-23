
import React, { useState } from 'react';
import { Search, Bell, History, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ViewType, AuthData } from './types';

interface HeaderProps {
  onViewChange: (view: ViewType) => void;
  currentUser?: string;
  authData?: AuthData;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onViewChange, currentUser = 'Dept. Admin', authData, onLogout }) => {
  const navigate = useNavigate();
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-lg">
        {/* <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-slate-500 border-r pr-6 border-gray-200">
          <button 
            onClick={() => navigate('/notifications')}
            className="relative hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-50"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
            <History size={20} />
          </button>
        </div>

        <button 
          onClick={() => onViewChange('Profile')}
          className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-3 rounded-xl transition-colors group relative"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{currentUser}</p>
            <p className="text-[11px] text-slate-500 mt-1">{authData?.email || 'deptadmin@uniport.edu.ng'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src="https://picsum.photos/seed/admin/40/40" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>


        </button>
      </div>
    </header>
  );
};
