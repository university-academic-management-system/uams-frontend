
import React from 'react';
import { Bell, CreditCard, UserPlus, Info, CheckCircle2, Check, MoreHorizontal } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'payment' | 'user' | 'system' | 'success';
  isRead: boolean;
  bgType: 'blue' | 'white';
}

const NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'New Fee Payment Received', description: 'Student Aisha Bello (U2020/2502201) just paid N230,000 for 1st Semester School fees via Mastercard.', time: '2 mins ago', type: 'payment', isRead: false, bgType: 'blue' },
  { id: '2', title: 'Scheduled System Maintenance', description: 'The departmental portal will undergo scheduled maintenance this weekend from 10 PM to 4 AM. Expect brief downtime.', time: '4 hours ago', type: 'system', isRead: false, bgType: 'white' },
  { id: '3', title: 'New Staff Account Activated', description: 'Dr. Sarah James from the Department of Computer Science has successfully activated her portal account and updated her profile.', time: '1 day ago', type: 'user', isRead: true, bgType: 'blue' },
  { id: '4', title: 'New Announcements Posted', description: 'Three new announcements have been added for the upcoming academic calendar and exam schedules.', time: '2 days ago', type: 'success', isRead: true, bgType: 'white' },
  { id: '5', title: 'Revenue Milestone Reached', description: 'The department has successfully reached 80% of the projected revenue for the 2024/2025 academic session.', time: '3 days ago', type: 'success', isRead: true, bgType: 'blue' },
  { id: '6', title: 'Course Registration Update', description: 'Updated prerequisites for CSC 301. All eligible students have been notified via their respective portals.', time: '4 days ago', type: 'system', isRead: true, bgType: 'white' },
];

export const NotificationsView: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Notifications</h2>
          <p className="text-slate-500 mt-1 text-sm">Stay updated with the latest activities across the department.</p>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-6 py-3 rounded-xl border border-blue-100 flex items-center gap-2 transition-all">
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        {NOTIFICATIONS.map((n) => (
          <div 
            key={n.id} 
            className={`px-10 py-8 transition-colors relative group border-b border-slate-50 last:border-0 ${
              n.bgType === 'blue' ? 'bg-[#F4FAFF]' : 'bg-white'
            }`}
          >
            <div className="flex gap-6">
              <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${getTypeStyles(n.type)} shadow-sm`}>
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-slate-700">
                    {n.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.time}</span>
                    {!n.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full shadow-sm shadow-blue-500/50"></div>}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {n.description}
                </p>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <button className="p-2 hover:bg-slate-200/50 rounded-lg text-slate-400">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button className="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors">
          View Notification History
        </button>
      </div>
    </div>
  );
};

const getIcon = (type: NotificationItem['type']) => {
  switch (type) {
    case 'payment': return <CreditCard size={20} />;
    case 'user': return <UserPlus size={20} />;
    case 'system': return <Info size={20} />;
    case 'success': return <CheckCircle2 size={20} />;
    default: return <Bell size={20} />;
  }
};

const getTypeStyles = (type: NotificationItem['type']) => {
  switch (type) {
    case 'payment': return 'bg-white text-emerald-500 border border-emerald-50';
    case 'user': return 'bg-white text-sky-500 border border-sky-50';
    case 'system': return 'bg-white text-orange-500 border border-orange-50';
    case 'success': return 'bg-white text-blue-500 border border-blue-50';
    default: return 'bg-white text-slate-400 border border-slate-50';
  }
};
