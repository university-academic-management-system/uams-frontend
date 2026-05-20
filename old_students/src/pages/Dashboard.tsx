import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Clock, ChevronDown, Loader2, Calendar } from 'lucide-react';
import authService from '../services/authService';
import apiClient from '../services/api';
import { useNavigate } from 'react-router'; 

// Mock GPA performance data
const performanceData = [
  { name: 'Year 1', gpa: 3.2, cgpa: 3.2 },
  { name: 'Year 2', gpa: 2.5, cgpa: 2.85 },
  { name: 'Year 3', gpa: 4.5, cgpa: 3.4 },
  { name: 'Year 4', gpa: 3.8, cgpa: 3.5 },
  { name: 'Year 5', gpa: 3.0, cgpa: 3.4 },
];

const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type TimetableEntry = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  isPublished: boolean;
  Course: { code: string; title: string };
  Lecturer: { User: { fullName: string } };
};

const formatTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')}${ampm}`;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); 
  const user = authService.getStoredUser();
  const firstName = user?.fullName?.split(' ')[0] || 'Student';

  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
  const [timetableLoading, setTimetableLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(() => DAY_NAMES[new Date().getDay()]);
  const [courseRegStatus, setCourseRegStatus] = useState<'loading' | 'registered' | 'pending'>('loading');
  const [idCardStatus, setIdCardStatus] = useState<'loading' | 'paid' | 'not_paid'>('loading');
  const [notifAnnouncements, setNotifAnnouncements] = useState<any[]>([]);

  // State for Academic Performance chart
  const [perfData, setPerfData] = useState<{name: string, gpa: number, cgpa: number}[]>([]);
  const [perfLoading, setPerfLoading] = useState(true);

  useEffect(() => {
    // Fetch academic performance
    apiClient.get('/senate-approved-results/academic-performance')
      .then((res) => {
        const data = res.data?.data || [];
        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
             // Use only the year part of session e.g. "2025/2026"
             name: item.sessionName?.split(' ')[0] || item.sessionName || 'Unknown', 
             gpa: parseFloat(item.sessionGPA) || 0,
             cgpa: parseFloat(item.cgpaAtEndOfSession) || 0
          }));
          setPerfData(formattedData);
        }
      })
      .catch((err) => console.error('Failed to fetch academic performance:', err))
      .finally(() => setPerfLoading(false));

    // Fetch timetable
    apiClient.get('/timetables')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        console.log("DASHBOARD TIMETABLE DATA:", data);
        
        let flattened: TimetableEntry[] = [];
        const items = Array.isArray(data) ? data : (data?.schedule ? [data] : []);

        if (items.length > 0) {
            items.forEach((item: any) => {
                if (item.schedule) {
                    Object.entries(item.schedule).forEach(([day, slots]: [string, any]) => {
                        if (Array.isArray(slots)) {
                            slots.forEach((slot: any) => {
                                flattened.push({
                                    id: slot.courseId || Math.random().toString(),
                                    dayOfWeek: day.toUpperCase(),
                                    startTime: slot.startTime,
                                    endTime: slot.endTime,
                                    isPublished: true, 
                                    Course: {
                                        code: slot.courseCode,
                                        title: slot.originalText || slot.courseCode
                                    },
                                    Lecturer: {
                                        User: { fullName: '' } 
                                    },
                                    room: '' 
                                });
                            });
                        }
                    });
                }
            });
        }
        
        if (flattened.length > 0) {
           setTimetableData(flattened);
        } else if (Array.isArray(data) && !data.some(d => d.schedule)) {
           setTimetableData(data);
        } else {
           setTimetableData([]);
        }
      })
      .catch((err) => console.error('Failed to fetch timetable:', err))
      .finally(() => setTimetableLoading(false));

    // Fetch notifications for announcements
    apiClient.get('/notifications')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setNotifAnnouncements(Array.isArray(data) ? data.slice(0, 4) : []);
      })
      .catch(() => {});

    // Fetch course registration status
    apiClient.get('/students/courses')
      .then((res) => {
        const yearData = res.data?.data;
        if (!yearData) {
            setCourseRegStatus('pending');
            return;
        }
        
        let isAnyCourseRegistered = false;
        
        // Traverse through AcademicYear -> Level -> Semester -> Courses
        Object.values(yearData).forEach((levelData: any) => {
            Object.values(levelData).forEach((semesterData: any) => {
                Object.values(semesterData).forEach((courses: any) => {
                    if (Array.isArray(courses) && courses.some((c: any) => c.isRegistered)) {
                        isAnyCourseRegistered = true;
                    }
                });
            });
        });
        
        setCourseRegStatus(isAnyCourseRegistered ? 'registered' : 'pending');
      })
      .catch(() => setCourseRegStatus('pending'));

    // Fetch payments to check ID card status
    apiClient.get('/student/payments')
      .then((res) => {
        const payments = res.data?.data?.payments ?? res.data?.payments ?? [];
        const idCardPaid = Array.isArray(payments) && payments.some(
          (p: any) => p.paymentType?.toUpperCase() === 'ID CARD FEE' && p.status?.toLowerCase() === 'success'
        );
        setIdCardStatus(idCardPaid ? 'paid' : 'not_paid');
      })
      .catch(() => setIdCardStatus('not_paid'));
  }, []);

  const todayClasses = useMemo(() => {
    const classes = timetableData
      .filter((e) => e.dayOfWeek === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    console.log(`Classes for ${selectedDay}:`, classes);
    return classes;
  }, [timetableData, selectedDay]);

  
  const handleNavigateToTimetable = () => {
    navigate('/timetable');
  };

  return (
    <div className="p-4 lg:p-8 max-w-400 mx-auto space-y-6 lg:space-y-8">
      <div className="grid grid-cols-12 gap-6 lg:gap-8">

        {/* ===== Left Column (Full Width) ===== */}
        <div className="col-span-12 space-y-6 lg:space-y-8">

          {/* Greeting */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1e293b]">
              Hello <span className="font-extrabold">{firstName},</span>
            </h1>
            <p className="text-gray-400 text-sm lg:text-base mt-1">Welcome back</p>
          </div>

          {/* Status Cards Row - Now includes Timetable */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* Courses Registration Status */}
            <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
              <p className="text-sm lg:text-[15px] font-bold text-[#1e293b] mb-4">
                Courses Registration Status
              </p>
              {courseRegStatus === 'loading' ? (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-400">Loading...</span>
              ) : courseRegStatus === 'registered' ? (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#dcfce7] text-[#22c55e]">Registered</span>
              ) : (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#dbeafe] text-[var(--color-accent)]">Pending</span>
              )}
            </div>

            {/* ID Card Status */}
            <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
              <p className="text-sm lg:text-[15px] font-bold text-[#1e293b] mb-4">
                ID Card Status
              </p>
              {idCardStatus === 'loading' ? (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-400">Loading...</span>
              ) : idCardStatus === 'paid' ? (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#dcfce7] text-[#22c55e]">Paid</span>
              ) : (
                <span className="inline-block px-4 py-1.5 rounded-lg text-xs font-bold bg-[#fef9c3] text-[#ca8a04]">Not Paid</span>
              )}
            </div>

            {/* Timetable Card */}
            <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
              <p className="text-sm lg:text-[15px] font-bold text-[#1e293b] mb-4">
                Timetable
              </p>
              <button
                onClick={handleNavigateToTimetable}
                className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">View Full Timetable</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Academic Performance Chart */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 lg:mb-8">
              <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Academic Performance</h2>
              <div className="relative">
                <select className="bg-[#f8fafc] border border-gray-100 text-[11px] font-bold rounded-lg px-4 py-2 text-gray-500 appearance-none pr-8 cursor-pointer">
                  <option>All Time</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            <div className="h-60 lg:h-72 w-full">
              {perfLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Loader2 size={24} className="animate-spin text-blue-500" />
                  <span className="text-sm text-gray-400 font-medium">Loading performance...</span>
                </div>
              ) : perfData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                  <p className="text-sm font-bold text-gray-400">No performance data</p>
                  <p className="text-[11px] text-gray-300 mt-1">There are no approved results available yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={perfData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                      dy={10}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                      domain={[0, 5]}
                      ticks={[0, 1.0, 2.0, 3.0, 4.0, 5.0]}
                      tickFormatter={(value: number) => value.toFixed(1)}
                      width={35}
                    />
                    <Tooltip
                      cursor={{ stroke: '#f1f5f9' }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="gpa"
                      stroke="#22c55e"
                      strokeWidth={2.5}
                      dot={{ r: 0 }}
                      activeDot={{ r: 5, fill: '#22c55e', stroke: '#fff', strokeWidth: 2.5 }}
                      name="GPA"
                    />
                    <Line
                      type="monotone"
                      dataKey="cgpa"
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      dot={{ r: 0 }}
                      activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2.5 }}
                      name="CGPA"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">Announcements</h2>
              <button onClick={() => navigate('/announcements')} className="bg-[var(--color-accent)] text-white text-[11px] font-bold px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">
                See All
              </button>
            </div>

            <div className="space-y-3">
              {notifAnnouncements.length === 0 ? (
                <p className="text-[12px] text-gray-400 text-center py-4">No announcements</p>
              ) : notifAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#f8fafc] border border-gray-50 hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                >
                  <div className="flex gap-3 min-w-0">
                    <div className="w-1 shrink-0 rounded-full bg-[var(--color-accent)] self-stretch" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#1e293b] truncate">{item.title}</p>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 shrink-0 mt-0.5">
                    {new Date(item.createdAt).toISOString().split('T')[0]}
                  </span>
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