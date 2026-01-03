
import React from 'react';
import { Plus } from 'lucide-react';

interface AnnouncementItem {
  id: string;
  title: string;
  description: string;
  type: 'blue' | 'white';
}

const ANNOUNCEMENTS_MOCK: AnnouncementItem[] = [
  { 
    id: '1', 
    title: 'Matriculation Date Released', 
    description: 'The Math test scheduled for 2nd January has been cancelled. A new date will be announced soon', 
    type: 'blue' 
  },
  { 
    id: '2', 
    title: 'Field Trip Rescheduled', 
    description: 'The field trip to London has been rescheduled. Please check back for the new date and further instructions', 
    type: 'white' 
  },
  { 
    id: '3', 
    title: 'Field Trip Rescheduled', 
    description: 'The field trip to London has been rescheduled. Please check back for the new date and further instructions', 
    type: 'white' 
  },
  { 
    id: '4', 
    title: 'About Mth 110 Test', 
    description: 'The Math test scheduled for 2nd January has been cancelled. A new date will be announced soon', 
    type: 'blue' 
  },
  { 
    id: '5', 
    title: 'Matriculation Date Released', 
    description: 'The Math test scheduled for 2nd January has been cancelled. A new date will be announced soon', 
    type: 'blue' 
  },
  { 
    id: '6', 
    title: 'Field Trip Rescheduled', 
    description: 'The field trip to London has been rescheduled. Please check back for the new date and further instructions', 
    type: 'white' 
  },
  { 
    id: '7', 
    title: 'Field Trip Rescheduled', 
    description: 'The field trip to London has been rescheduled. Please check back for the new date and further instructions', 
    type: 'white' 
  },
  { 
    id: '8', 
    title: 'About Mth 110 Test', 
    description: 'The Math test scheduled for 2nd January has been cancelled. A new date will be announced soon', 
    type: 'blue' 
  },
];

export const AnnouncementsView: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900">Announcement</h2>
        <button className="bg-[#1D7AD9] text-white px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition-all">
          <Plus size={20} /> Create New Announcement
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden">
        {ANNOUNCEMENTS_MOCK.map((announcement) => (
          <div 
            key={announcement.id} 
            className={`px-10 py-8 transition-colors ${
              announcement.type === 'blue' ? 'bg-[#F4FAFF]' : 'bg-white'
            }`}
          >
            <h3 className="text-base font-bold text-slate-700 mb-2">
              {announcement.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
