import React from 'react';
import { Announcement } from '../types';
import { Plus } from 'lucide-react';

interface Props {
  announcements: Announcement[];
}

export const AnnouncementList: React.FC<Props> = ({ announcements }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800">Announcements</h3>
        <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
          <Plus size={14} />
          Create New
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
        {announcements.map((item) => (
          <div key={item.id} className="group border-b border-gray-50 last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</h4>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">{item.date}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
