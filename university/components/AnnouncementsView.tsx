
import React, { useState } from 'react';
import { Plus, Megaphone, Bell, Calendar, MoreVertical } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Matriculation Date Released',
    content: 'The Math test scheduled for 21st January has been cancelled. A new date will be announced soon.',
    date: '2025-01-03',
  },
  {
    id: '2',
    title: 'Field Trip Rescheduled',
    content: 'The field trip to London has been rescheduled. Please check back for the new date and further instructions.',
    date: '2025-01-05',
  },
  {
    id: '3',
    title: 'Field Trip Rescheduled',
    content: 'The field trip to London has been rescheduled. Please check back for the new date and further instructions.',
    date: '2025-01-05',
  },
  {
    id: '4',
    title: 'About Mth 110 Test',
    content: 'The Math test scheduled for 21st January has been cancelled. A new date will be announced soon.',
    date: '2025-01-02',
  },
  {
    id: '5',
    title: 'Matriculation Date Released',
    content: 'The Math test scheduled for 21st January has been cancelled. A new date will be announced soon.',
    date: '2025-01-03',
  },
  {
    id: '6',
    title: 'Field Trip Rescheduled',
    content: 'The field trip to London has been rescheduled. Please check back for the new date and further instructions.',
    date: '2025-01-05',
  },
  {
    id: '7',
    title: 'Field Trip Rescheduled',
    content: 'The field trip to London has been rescheduled. Please check back for the new date and further instructions.',
    date: '2025-01-05',
  },
  {
    id: '8',
    title: 'About Mth 110 Test',
    content: 'The Math test scheduled for 21st January has been cancelled. A new date will be announced soon.',
    date: '2025-01-02',
  },
];

const AnnouncementsView: React.FC = () => {
  const [announcements] = useState<Announcement[]>(initialAnnouncements);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Announcement</h2>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1b75d0] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 group">
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          Create New Announcement
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {announcements.map((ann, idx) => (
            <div 
              key={ann.id} 
              className={`p-8 md:p-10 transition-colors group relative ${
                idx % 4 === 0 || idx % 4 === 3 ? 'bg-[#f8fdff]' : 'bg-white'
              } hover:bg-slate-50/80`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 max-w-4xl">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm md:text-base font-bold text-slate-700">
                      {ann.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                    {ann.content}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                   <span className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                     <Calendar className="w-3.5 h-3.5" />
                     {ann.date}
                   </span>
                   <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg transition-colors">
                     <MoreVertical className="w-5 h-5" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Empty State if needed */}
      {announcements.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
            <Megaphone className="w-10 h-10" />
          </div>
          <p className="font-medium">No announcements yet.</p>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsView;
