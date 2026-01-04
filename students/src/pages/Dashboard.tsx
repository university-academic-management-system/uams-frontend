
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Clock } from 'lucide-react';
import authService from '../services/authService';
import { getAssetPath } from '../utils/assetPath';

const performanceData = [
  { name: 'Yr 1', value: 50 },
  { name: 'Yr 2', value: 25 },
  { name: 'Yr 3', value: 72 },
  { name: 'Yr 4', value: 80 },
  { name: 'Yr 5', value: 30 },
  { name: 'Yr 6', value: 70 },
];

const StatusBadge = ({ label, value }: { label: string, value: string }) => {
  const getBadgeStyle = (val: string) => {
    if (val === 'Not Done' || val === 'Not Paid' || val === 'Not Applicable') return 'bg-[#fff1f2] text-[#f43f5e]';
    if (val === 'Completed' || val === 'None') return 'bg-[#f0fdf4] text-[#22c55e]';
    return 'bg-[#f8fafc] text-[#94a3b8]';
  };

  return (
    <div className="flex flex-col">
      <p className="text-[12px] lg:text-[13px] font-bold text-[#1e293b] mb-2">{label}</p>
      <div className="flex">
        <span className={`px-3 lg:px-4 py-1.5 rounded-lg text-[10px] font-bold ${getBadgeStyle(value)}`}>
          {value}
        </span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // Get user data from localStorage
  const user = authService.getStoredUser();
  const profile = user?.profile;
  
  // Extract first name for greeting
  const firstName = user?.fullName?.split(' ')[0] || 'Student';
  const fullName = user?.fullName || 'Student';
  const nameParts = fullName.split(' ');
  const displayFirstName = nameParts[0] || '';
  const displayLastName = nameParts.slice(1).join(' ') || '';
  
  // Build bio data from actual user/profile
  const bioData = [
    { label: 'First name', value: displayFirstName || 'Nil' },
    { label: 'Last name', value: displayLastName || 'Nil' },
    { label: 'Email', value: user?.email || 'Nil' },
    { label: 'Phone', value: user?.phone || profile?.phone || 'Nil' },
    { label: 'Department', value: user?.department || profile?.department || 'Nil' },
    { label: 'Faculty', value: user?.faculty || profile?.faculty || 'Nil' },
    { label: 'Level', value: profile?.level ? `${profile.level} Level` : 'Nil' },
    { label: 'Semester', value: profile?.semester || 'Nil' },
    { label: 'Matric No.', value: profile?.studentId || 'Nil' },
    { label: 'Program', value: profile?.program || 'Nil' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto space-y-6 lg:space-y-8">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* Welcome Banner */}
          <div className="bg-[#3b82f6] rounded-[24px] lg:rounded-[32px] p-6 lg:p-14 text-white relative overflow-hidden min-h-[220px] lg:min-h-0">
            <div className="relative z-10 max-w-sm">
              <h1 className="text-2xl lg:text-4xl font-bold mb-1 lg:mb-2">Hello {firstName},</h1>
              <p className="text-blue-100 text-base lg:text-lg mb-4 lg:mb-8 opacity-90 font-medium">Welcome back</p>
              
              <div className="mb-6 lg:mb-8">
                <p className="text-white/90 text-xs lg:text-sm leading-relaxed">
                  You have pending <br /> payments to make.
                </p>
                <p className="text-white/90 text-xs lg:text-sm leading-relaxed">
                  Let's get it done!
                </p>
              </div>
              
              <button className="bg-white text-[#3b82f6] px-6 lg:px-8 py-2 lg:py-2.5 rounded-xl text-[10px] lg:text-xs font-bold hover:bg-blue-50 transition-all shadow-sm">
                Review now!
              </button>
            </div>
            
            {/* Decorative Background Shapes */}
            <div className="absolute top-0 right-0 h-full w-1/2 flex items-center justify-end">
              <img 
                src={getAssetPath('assets/60664c15bdd0a28d19bcb5d0502ee7e0aec005d3 (1).png')} 
                alt="Welcome 3D Illustration" 
                className="h-full w-full object-contain object-right"
              />
            </div>
          </div>

          {/* Academic Performance Chart */}
          <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-10 gap-4">
              <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Academic Performance</h2>
              <div className="relative w-full sm:w-auto">
                <select className="w-full bg-[#f8fafc] border border-gray-100 text-[10px] font-bold rounded-lg px-4 py-2 text-gray-500 uppercase appearance-none pr-8">
                  <option>All Time</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
              </div>
            </div>
            <div className="h-60 lg:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                  <Tooltip cursor={{ stroke: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 0 }} activeDot={{ r: 5, fill: '#22c55e', stroke: '#fff', strokeWidth: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Tab Grid */}
          <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-base lg:text-lg font-bold text-[#1e293b] mb-8 lg:mb-10">Status Tab</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 lg:gap-y-12 gap-x-8 lg:gap-x-16">
              <StatusBadge label="Courses Registration Status" value="Not Done" />
              <StatusBadge label="Transcript Application Status" value="Not Applicable" />
              <StatusBadge label="School Fee Payment Status" value="Completed" />
              <StatusBadge label="Department Fee Payment Status" value="Not Paid" />
              <StatusBadge label="Complaint Status" value="None" />
              <StatusBadge label="Complaint Status" value="None" />
            </div>
          </div>
        </div>

        {/* Right Content Column (Calendar & Bio) */}
        <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
          
          {/* Calendar Section */}
          <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Calendar</h2>
              <select className="bg-[#f8fafc] border border-gray-100 text-[10px] font-bold rounded-lg px-3 py-1.5 text-gray-500 uppercase">
                <option>Today</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="bg-[#3b82f6] p-5 lg:p-6 rounded-2xl text-white shadow-xl shadow-blue-100/30">
                <h3 className="font-bold text-[13px] lg:text-[14px] mb-1">Electronic Engineering</h3>
                <div className="flex items-center text-[10px] lg:text-[11px] font-medium opacity-90">
                  <span>CSC 201.1</span>
                  <span className="mx-2 font-light">|</span>
                  <Clock size={11} className="mr-1" />
                  <span>10:00 - 12:00pm</span>
                </div>
              </div>
              
              {[
                { name: 'Computer Science', code: 'CSC 200.1' },
                { name: 'General Studies', code: 'GES 200.1' },
                { name: 'Computer Science', code: 'CSC 200.1' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#f8fafc] p-5 lg:p-6 rounded-2xl border border-gray-50 hover:bg-[#f1f5f9] transition-all cursor-pointer">
                  <h3 className="font-bold text-[13px] lg:text-[14px] text-[#1e293b] mb-1">{item.name}</h3>
                  <div className="flex items-center text-[10px] lg:text-[11px] font-bold text-gray-400">
                    <span>{item.code}</span>
                    <span className="mx-2 font-light">|</span>
                    <Clock size={11} className="mr-1" />
                    <span>12:00 - 1:00pm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Bio Section */}
          <div className="bg-white rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 border border-gray-100 shadow-sm relative">
            <div className="hidden sm:block absolute right-8 top-8 w-12 h-1.5 bg-[#3b82f6] rounded-full"></div>
            <h2 className="text-base lg:text-lg font-bold text-[#1e293b] mb-8 lg:mb-10">Student Bio</h2>
            <div className="grid grid-cols-2 gap-y-6 lg:gap-y-8 gap-x-4">
              {bioData.map((item, idx) => (
                <div key={idx} className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1 truncate">{item.label}</p>
                  <p className="text-[11px] lg:text-[12px] font-bold text-[#1e293b] truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
