// import React, { useState, useEffect } from "react";
// import { Users, CreditCard, ShieldCheck, ChevronDown } from "lucide-react";
// import api from "../api/axios"; // Make sure this points to your axios instance

// const SimpleLineChart = ({
//   data,
//   color,
//   height = 200,
//   max = 100,
// }: {
//   data: number[];
//   color: string;
//   height?: number;
//   max?: number;
// }) => {
//   const points = data
//     .map((val, i) => {
//       const x = (i / (data.length - 1)) * 100;
//       const y = 100 - (val / max) * 100;
//       return `${x},${y}`;
//     })
//     .join(" ");

//   return (
//     <div className="relative w-full" style={{ height: `${height}px` }}>
//       <svg
//         className="w-full h-full overflow-visible"
//         preserveAspectRatio="none"
//         viewBox="0 0 100 100"
//       >
//         {[0, 25, 50, 75, 100].map((v) => (
//           <line
//             key={v}
//             x1="0"
//             y1={v}
//             x2="100"
//             y2={v}
//             stroke="#e2e8f0"
//             strokeWidth="0.5"
//           />
//         ))}
//         <polyline
//           fill="none"
//           stroke={color}
//           strokeWidth="1.5"
//           points={points}
//           strokeLinejoin="round"
//           strokeLinecap="round"
//         />
//       </svg>
//       <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium">
//         <span>2024</span>
//         <span>2025</span>
//         <span>2026</span>
//         <span>2027</span>
//         <span>2028</span>
//         <span>2029</span>
//       </div>
//     </div>
//   );
// };

// const DashboardHome: React.FC = () => {
//   // 1. Create state for student count and loading status
//   const [studentCount, setStudentCount] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   // 2. Fetch data on component mount
//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         // Since your baseURL is http://localhost:3001/api, we just need /students
//         // const response = await api.get("/students/");
//         const response = await api.get("/students");
//         console.log("Full Response Object:", response);
//         console.log("Response Body:", response.data);

//         // If your API wraps the array in a 'data' property, it would be:
//         if (response.data && Array.isArray(response.data.data)) {
//           setStudentCount(response.data.data.length);
//         } else if (Array.isArray(response.data)) {
//           setStudentCount(response.data.length);
//         }
//         // The endpoint returns an array, so we get the .length
//         if (Array.isArray(response.data)) {
//           setStudentCount(response.data.length);
//         }
//       } catch (error) {
//         console.log("BACKEND ERROR MESSAGE:", error.response?.data);
//         console.error("Error fetching students for dashboard:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   return (
//     <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//         {/* Total Students Card */}
//         <div className="bg-[#fff7ed] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-orange-100 flex items-center gap-4 md:gap-6 shadow-sm transition-transform hover:scale-[1.02]">
//           <div className="p-3 md:p-4 bg-white/50 rounded-2xl">
//             <Users className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
//           </div>
//           <div>
//             <p className="text-[10px] md:text-xs font-semibold text-slate-600 mb-0.5 md:mb-1 uppercase tracking-wider">
//               Total Students
//             </p>
//             {/* 3. Replace static 5,000 with dynamic count */}
//             <p className="text-2xl md:text-3xl font-black text-slate-900">
//               {isLoading ? "..." : studentCount.toLocaleString()}
//             </p>
//           </div>
//         </div>

//         <div className="bg-[#f0fdf4] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-emerald-100 flex items-center gap-4 md:gap-6 shadow-sm transition-transform hover:scale-[1.02]">
//           <div className="p-3 md:p-4 bg-white/50 rounded-2xl">
//             <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
//           </div>
//           <div>
//             <p className="text-[10px] md:text-xs font-semibold text-slate-600 mb-0.5 md:mb-1 uppercase tracking-wider">
//               Total Revenue
//             </p>
//             <p className="text-2xl md:text-3xl font-black text-slate-900">
//               N38M
//             </p>
//           </div>
//         </div>

//         <div className="bg-[#eff6ff] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-blue-100 flex items-center gap-4 md:gap-6 shadow-sm transition-transform hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
//           <div className="p-3 md:p-4 bg-white/50 rounded-2xl">
//             <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
//           </div>
//           <div>
//             <p className="text-[10px] md:text-xs font-semibold text-slate-600 mb-0.5 md:mb-1 uppercase tracking-wider">
//               Total Users
//             </p>
//             <p className="text-2xl md:text-3xl font-black text-slate-900">
//               100
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ... rest of your charts and announcements code remains the same ... */}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//         <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
//           <div className="flex flex-wrap justify-between items-center mb-6 md:mb-10 gap-4">
//             <h3 className="text-base md:text-lg font-bold text-slate-900">
//               Revenue Growth
//             </h3>
//             <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500">
//               Today <ChevronDown className="w-3 h-3" />
//             </button>
//           </div>
//           <SimpleLineChart
//             data={[50, 25, 75, 80, 40, 70]}
//             color="#22c55e"
//             max={100}
//             height={200}
//           />
//         </div>

//         <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm">
//           <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//             <h3 className="text-base md:text-lg font-bold text-slate-900">
//               Announcements
//             </h3>
//             <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold whitespace-nowrap">
//               + New Note
//             </button>
//           </div>
//           <div className="space-y-6">
//             {[
//               {
//                 title: "Matriculation Date Released",
//                 date: "2025-01-03",
//                 text: "The Math test scheduled for 21st January has been cancelled.",
//               },
//               {
//                 title: "Field Trip Rescheduled",
//                 date: "2025-01-05",
//                 text: "The field trip to London has been rescheduled. Check back for details.",
//               },
//               {
//                 title: "About Mth 110 Test",
//                 date: "2025-01-02",
//                 text: "The Math test scheduled for 23rd January has been cancelled.",
//               },
//             ].map((ann, i) => (
//               <div
//                 key={i}
//                 className="pb-4 border-b border-slate-50 last:border-0 last:pb-0 group cursor-pointer"
//               >
//                 <div className="flex justify-between items-start mb-1">
//                   <h4 className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
//                     {ann.title}
//                   </h4>
//                   <span className="text-[8px] md:text-[10px] text-slate-400 font-semibold shrink-0 ml-2">
//                     {ann.date}
//                   </span>
//                 </div>
//                 <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed line-clamp-2">
//                   {ann.text}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm">
//         <h3 className="text-base md:text-lg font-bold text-slate-900 mb-6 md:mb-10">
//           Growth Rate
//         </h3>
//         <SimpleLineChart
//           data={[500, 250, 750, 800, 400, 750]}
//           color="#22c55e"
//           max={1000}
//           height={200}
//         />
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;

import React, { useState, useEffect } from "react";
import { Users, CreditCard, ShieldCheck, ChevronDown } from "lucide-react";
import api from "../api/axios"; // Ensure this matches your project structure

/**
 * A simple presentational Line Chart component using SVG
 */
const SimpleLineChart = ({
  data,
  color,
  height = 200,
  max = 100,
}: {
  data: number[];
  color: string;
  height?: number;
  max?: number;
}) => {
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (val / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <svg
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {[0, 25, 50, 75, 100].map((v) => (
          <line
            key={v}
            x1="0"
            y1={v}
            x2="100"
            y2={v}
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
        ))}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium">
        <span>2024</span>
        <span>2025</span>
        <span>2026</span>
        <span>2027</span>
        <span>2028</span>
        <span>2029</span>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  // State for metrics
  const [studentCount, setStudentCount] = useState<number>(0);
  const [totalUserCount, setTotalUserCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data from the /university-admin/users endpoint
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/university-admin/users");

        // Extract the users array from response
        const allUsers = response.data.users || [];

        // 1. Total Users is the entire length of the returned array
        setTotalUserCount(allUsers.length);

        // 2. Filter for users with the role "STUDENT"
        const students = allUsers.filter((u: any) => u.role === "STUDENT");
        setStudentCount(students.length);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Total Students Card */}
        <div className="bg-[#fff7ed] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-orange-100 flex items-center gap-4 md:gap-6 shadow-sm transition-transform hover:scale-[1.02]">
          <div className="p-3 md:p-4 bg-white/50 rounded-2xl">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-600 mb-0.5 md:mb-1 uppercase tracking-wider">
              Total Students
            </p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">
              {isLoading ? "..." : studentCount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Total Revenue Card (Static for now) */}
        <div className="bg-[#f0fdf4] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-emerald-100 flex items-center gap-4 md:gap-6 shadow-sm transition-transform hover:scale-[1.02]">
          <div className="p-3 md:p-4 bg-white/50 rounded-2xl">
            <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-600 mb-0.5 md:mb-1 uppercase tracking-wider">
              Total Revenue
            </p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">
              N38M
            </p>
          </div>
        </div>

        {/* Total Users Card (Includes Admins, Faculty, Students) */}
        <div className="bg-[#eff6ff] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-blue-100 flex items-center gap-4 md:gap-6 shadow-sm transition-transform hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
          <div className="p-3 md:p-4 bg-white/50 rounded-2xl">
            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-semibold text-slate-600 mb-0.5 md:mb-1 uppercase tracking-wider">
              Total Users
            </p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">
              {isLoading ? "..." : totalUserCount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Revenue Chart and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-center mb-6 md:mb-10 gap-4">
            <h3 className="text-base md:text-lg font-bold text-slate-900">
              Revenue Growth
            </h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-500">
              Today <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <SimpleLineChart
            data={[50, 25, 75, 80, 40, 70]}
            color="#22c55e"
            max={100}
            height={200}
          />
        </div>

        {/* Announcements List */}
        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h3 className="text-base md:text-lg font-bold text-slate-900">
              Announcements
            </h3>
            <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold whitespace-nowrap">
              + New Note
            </button>
          </div>
          <div className="space-y-6">
            {[
              {
                title: "Matriculation Date Released",
                date: "2025-01-03",
                text: "The Math test scheduled for 21st January has been cancelled.",
              },
              {
                title: "Field Trip Rescheduled",
                date: "2025-01-05",
                text: "The field trip to London has been rescheduled. Check back for details.",
              },
              {
                title: "About Mth 110 Test",
                date: "2025-01-02",
                text: "The Math test scheduled for 23rd January has been cancelled.",
              },
            ].map((ann, i) => (
              <div
                key={i}
                className="pb-4 border-b border-slate-50 last:border-0 last:pb-0 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {ann.title}
                  </h4>
                  <span className="text-[8px] md:text-[10px] text-slate-400 font-semibold shrink-0 ml-2">
                    {ann.date}
                  </span>
                </div>
                <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {ann.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Growth Rate */}
      <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-slate-900 mb-6 md:mb-10">
          Growth Rate
        </h3>
        <SimpleLineChart
          data={[500, 250, 750, 800, 400, 750]}
          color="#22c55e"
          max={1000}
          height={200}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
