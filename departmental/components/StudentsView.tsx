// import React, { useState, useEffect } from "react";
// import {
//   Search,
//   Filter,
//   MoreHorizontal,
//   Plus,
//   User,
//   ShieldCheck,
//   Mail,
//   Phone,
//   Calendar,
//   X,
//   Loader2,
// } from "lucide-react";
// import { Student } from "../types";
// import api from "../api/axios";

// interface ApiUser {
//   id: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   role: string;
//   isActive: boolean;
//   createdAt: string;
//   Student: {
//     studentId: string;
//     levelId: string;
//     programId: string;
//   } | null;
//   Lecturer: any;
//   DepartmentAdmin: any;
//   FacultyAdmin: any;
//   UniversityAdmin: any;
// }

// interface UsersResponse {
//   message: string;
//   count: number;
//   users: ApiUser[];
// }

// export const StudentsView: React.FC = () => {
//   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
//   const [students, setStudents] = useState<Student[]>([]);
//   const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   useEffect(() => {
//     filterStudents();
//   }, [students, searchTerm, selectedDepartment]);

//   const fetchStudents = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const response = await api.get<UsersResponse>(
//         "/api/university-admin/users"
//       );
//       const apiUsers = response.data.users;

//       // Filter only STUDENT roles and map to Student interface
//       const studentData: Student[] = apiUsers
//         .filter((user) => user.role === "STUDENT" && user.Student)
//         .map((user, index) => ({
//           id: user.id,
//           studentId: user.Student?.studentId || `STU-${index + 1000}`,
//           name: user.fullName,
//           email: user.email,
//           phoneNo: user.phone || "N/A",
//           department: getDepartmentFromProgramId(user.Student?.programId),
//           level: getLevelFromLevelId(user.Student?.levelId),
//           programId: user.Student?.programId || "",
//           role: getProgramType(user.Student?.programId),
//           createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           }),
//           isActive: user.isActive,
//           // You might want to add more fields based on your API
//         }));

//       setStudents(studentData);
//       setFilteredStudents(studentData);
//     } catch (err: any) {
//       console.error("Error fetching students:", err);
//       setError(err.response?.data?.message || "Failed to load students");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper functions to map IDs to readable values
//   const getDepartmentFromProgramId = (programId?: string): string => {
//     // You would need to fetch programs or have a mapping
//     const programMap: Record<string, string> = {
//       "506fe514-728c-432f-83c1-55546fdddb8f": "Computer Science",
//       // Add more program ID mappings as needed
//     };
//     return programId
//       ? programMap[programId] || "Unknown Department"
//       : "Unknown Department";
//   };

//   const getLevelFromLevelId = (levelId?: string): string => {
//     // You would need to fetch levels or have a mapping
//     const levelMap: Record<string, string> = {
//       "6106e865-cd28-45bd-b13c-afcb8dca7b45": "100",
//       "a686c3ad-a974-4929-afde-e663aa862175": "100",
//       // Add more level ID mappings as needed
//     };
//     return levelId ? levelMap[levelId] || "Unknown Level" : "Unknown Level";
//   };

//   const getProgramType = (programId?: string): string => {
//     // Map program IDs to program types
//     const programTypeMap: Record<string, string> = {
//       "506fe514-728c-432f-83c1-55546fdddb8f": "Bachelors",
//       // Add more mappings
//     };
//     return programId ? programTypeMap[programId] || "Unknown" : "Unknown";
//   };

//   const filterStudents = () => {
//     let filtered = students;

//     // Filter by search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(
//         (student) =>
//           student.name.toLowerCase().includes(term) ||
//           student.email.toLowerCase().includes(term) ||
//           student.studentId.toLowerCase().includes(term)
//       );
//     }

//     // Filter by department
//     if (selectedDepartment !== "all") {
//       filtered = filtered.filter(
//         (student) => student.department === selectedDepartment
//       );
//     }

//     setFilteredStudents(filtered);
//   };

//   const getProgramBadge = (role: string) => {
//     switch (role) {
//       case "Bachelors":
//         return "bg-[#2ECC71] text-white";
//       case "PGD":
//         return "bg-[#95A5A6] text-white";
//       case "Masters":
//         return "bg-[#B19CD9] text-white";
//       default:
//         return "bg-slate-200 text-slate-600";
//     }
//   };

//   // Get unique departments for filter
//   const departments = [
//     "all",
//     ...Array.from(new Set(students.map((s) => s.department))),
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
//           <p className="text-slate-500">Loading students...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-10">
//         <div className="text-red-500 mb-4">
//           <X className="h-12 w-12 mx-auto" />
//         </div>
//         <h3 className="text-lg font-bold text-red-700 mb-2">
//           Failed to Load Students
//         </h3>
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={fetchStudents}
//           className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="relative animate-in fade-in duration-500">
//       <div
//         className={`space-y-6 transition-all duration-300 ${
//           selectedStudent ? "pr-[400px]" : ""
//         }`}
//       >
//         <div className="flex justify-between items-start mb-10">
//           <div className="max-w-xl">
//             <h2 className="text-3xl font-bold text-slate-900">Students</h2>
//             <p className="text-slate-500 mt-2">
//               {students.length} total students • {filteredStudents.length}{" "}
//               filtered
//             </p>
//           </div>
//           <button className="bg-[#1D7AD9] text-white px-8 py-3 rounded-md flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
//             <Plus size={20} /> Assign New Role
//           </button>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
//           <div className="flex items-center justify-between gap-4 flex-wrap">
//             <div className="relative group flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search by name, email or student ID"
//                 className="bg-white border border-slate-200 text-xs py-2 pl-10 pr-3 rounded-lg outline-none w-full focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>

//             <div className="flex items-center gap-3">
//               <select
//                 className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/10"
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//               >
//                 {departments.map((dept) => (
//                   <option key={dept} value={dept}>
//                     {dept === "all" ? "All Departments" : dept}
//                   </option>
//                 ))}
//               </select>

//               <button
//                 className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedDepartment("all");
//                 }}
//               >
//                 <X size={16} className="text-slate-800" />
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Students Table */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           {filteredStudents.length === 0 ? (
//             <div className="py-16 text-center">
//               <div className="text-slate-300 mb-4">
//                 <User className="h-16 w-16 mx-auto opacity-50" />
//               </div>
//               <h3 className="text-lg font-bold text-slate-400 mb-2">
//                 No Students Found
//               </h3>
//               <p className="text-slate-400 text-sm">
//                 {searchTerm || selectedDepartment !== "all"
//                   ? "Try changing your search or filter criteria"
//                   : "No students found in the system"}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-slate-50/60 border-b border-gray-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
//                     <th className="px-6 py-5 w-12 text-center">
//                       <input
//                         type="checkbox"
//                         className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
//                       />
//                     </th>
//                     <th className="px-6 py-5">Student ID</th>
//                     <th className="px-6 py-5">Name</th>
//                     <th className="px-6 py-5">Email</th>
//                     <th className="px-6 py-5">Phone No</th>
//                     <th className="px-6 py-5">Department</th>
//                     <th className="px-6 py-5">Level</th>
//                     <th className="px-6 py-5">Program</th>
//                     <th className="px-6 py-5">Joined</th>
//                     <th className="px-6 py-5 text-right pr-12">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-50 text-xs">
//                   {filteredStudents.map((student) => (
//                     <tr
//                       key={student.id}
//                       className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${
//                         selectedStudent?.id === student.id
//                           ? "bg-blue-50/50"
//                           : ""
//                       }`}
//                       onClick={() => setSelectedStudent(student)}
//                     >
//                       <td
//                         className="px-6 py-5 text-center"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <input
//                           type="checkbox"
//                           className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
//                         />
//                       </td>
//                       <td className="px-6 py-5 text-slate-400 font-medium">
//                         {student.studentId}
//                       </td>
//                       <td className="px-6 py-5 font-bold text-slate-700">
//                         {student.name}
//                       </td>
//                       <td className="px-6 py-5 text-slate-500">
//                         {student.email}
//                       </td>
//                       <td className="px-6 py-5 text-slate-500">
//                         {student.phoneNo}
//                       </td>
//                       <td className="px-6 py-5 text-slate-500">
//                         {student.department}
//                       </td>
//                       <td className="px-6 py-5 text-slate-500">
//                         {student.level}
//                       </td>
//                       <td className="px-6 py-5">
//                         <span
//                           className={`px-5 py-1.5 rounded-lg text-[10px] font-bold shadow-sm inline-block min-w-[90px] text-center ${getProgramBadge(
//                             student.role || ""
//                           )}`}
//                         >
//                           {student.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-5 text-slate-500">
//                         {student.createdAt || "N/A"}
//                       </td>
//                       <td className="px-6 py-5 text-right pr-12">
//                         <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
//                           <MoreHorizontal size={20} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {filteredStudents.length > 0 && (
//           <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//             <div className="text-sm text-slate-500">
//               Showing{" "}
//               <span className="font-semibold">1-{filteredStudents.length}</span>{" "}
//               of <span className="font-semibold">{students.length}</span>{" "}
//               students
//             </div>
//             <div className="flex items-center gap-2">
//               <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
//                 Previous
//               </button>
//               <button className="px-3 py-2 bg-[#1D7AD9] text-white rounded-lg text-sm font-medium hover:bg-blue-700">
//                 1
//               </button>
//               <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
//                 2
//               </button>
//               <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
//                 3
//               </button>
//               <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Student Details Sidebar */}
//       {selectedStudent && (
//         <div className="fixed top-16 right-0 w-[380px] h-[calc(100vh-64px)] bg-white border-l border-gray-100 shadow-2xl z-40 animate-in slide-in-from-right duration-300 flex flex-col">
//           <div className="p-6 border-b border-gray-50 flex items-center justify-between">
//             <h3 className="font-bold text-slate-800">Student Bio</h3>
//             <button
//               onClick={() => setSelectedStudent(null)}
//               className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 space-y-8">
//             <div className="flex flex-col items-center text-center">
//               <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
//                 <User size={40} />
//               </div>
//               <h4 className="text-lg font-bold text-slate-900">
//                 {selectedStudent.name}
//               </h4>
//               <p className="text-xs text-slate-400">
//                 {selectedStudent.studentId}
//               </p>
//               <div className="mt-2">
//                 <span
//                   className={`px-3 py-1 rounded-full text-[10px] font-bold ${
//                     selectedStudent.isActive
//                       ? "bg-green-100 text-green-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {selectedStudent.isActive ? "Active" : "Inactive"}
//                 </span>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <BioItem
//                 icon={<Mail size={14} />}
//                 label="Email Address"
//                 value={selectedStudent.email}
//               />
//               <BioItem
//                 icon={<Phone size={14} />}
//                 label="Phone Number"
//                 value={selectedStudent.phoneNo}
//               />
//               <BioItem
//                 icon={<Calendar size={14} />}
//                 label="Year Enrolled"
//                 value={selectedStudent.createdAt}
//               />
//               <BioItem
//                 icon={<ShieldCheck size={14} />}
//                 label="Department"
//                 value={selectedStudent.department}
//               />
//               <BioItem
//                 icon={<ShieldCheck size={14} />}
//                 label="Current Level"
//                 value={selectedStudent.level}
//               />
//             </div>

//             <div className="pt-6 border-t border-gray-50">
//               <h5 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
//                 <ShieldCheck size={16} className="text-blue-600" /> Academic
//                 Roles
//               </h5>
//               <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-bold text-slate-700">
//                     Assign as Class Rep
//                   </span>
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-bold text-slate-400 uppercase">
//                     Class Rep Permissions
//                   </label>
//                   <div className="flex flex-wrap gap-2">
//                     <PermissionToggle label="Post Updates" active />
//                     <PermissionToggle label="View Results" />
//                     <PermissionToggle label="Manage Attendance" active />
//                   </div>
//                 </div>
//                 <div className="pt-2">
//                   <button className="w-full bg-[#1D7AD9] text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10">
//                     Save Role Settings
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const BioItem: React.FC<{
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }> = ({ icon, label, value }) => (
//   <div className="flex items-center gap-3">
//     <div className="text-slate-400">{icon}</div>
//     <div className="flex-1 min-w-0">
//       <p className="text-[10px] font-bold text-slate-400 uppercase truncate">
//         {label}
//       </p>
//       <p className="text-xs font-semibold text-slate-700 truncate">{value}</p>
//     </div>
//   </div>
// );

// const PermissionToggle: React.FC<{ label: string; active?: boolean }> = ({
//   label,
//   active,
// }) => (
//   <span
//     className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
//       active
//         ? "bg-blue-600 text-white border-blue-600"
//         : "bg-white text-slate-400 border-slate-200 hover:border-blue-200 hover:text-blue-500"
//     }`}
//   >
//     {label}
//   </span>
// );

// // import React, { useState } from 'react';
// // import { Search, Filter, MoreHorizontal, Plus, User, ShieldCheck, Mail, Phone, Calendar, X } from 'lucide-react';
// // import { Student } from '../types';

// // const STUDENTS_DATA: Student[] = [
// //   { id: '1', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '1', role: 'Bachelors' },
// //   { id: '2', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '2', role: 'PGD' },
// //   { id: '3', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '3', role: 'Masters' },
// //   { id: '4', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '1', role: 'Bachelors' },
// //   { id: '5', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '1', role: 'Bachelors' },
// //   { id: '6', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '1', role: 'Bachelors' },
// //   { id: '7', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '1', role: 'Bachelors' },
// //   { id: '8', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '1', role: 'Bachelors' },
// //   { id: '9', studentId: 'U2020/2502201', name: 'Justice Amadi', email: 'justiceamadi@gmail.com', phoneNo: '+2348012345678', department: 'Computer Science', level: '100', programId: '1', role: 'Bachelors' },
// // ];

// // export const StudentsView: React.FC = () => {
// //   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

// //   const getProgramBadge = (role: string) => {
// //     switch (role) {
// //       case 'Bachelors':
// //         return 'bg-[#2ECC71] text-white';
// //       case 'PGD':
// //         return 'bg-[#95A5A6] text-white';
// //       case 'Masters':
// //         return 'bg-[#B19CD9] text-white';
// //       default:
// //         return 'bg-slate-200 text-slate-600';
// //     }
// //   };

// //   return (
// //     <div className="relative animate-in fade-in duration-500">
// //       <div className={`space-y-6 transition-all duration-300 ${selectedStudent ? 'pr-[400px]' : ''}`}>
// //         <div className="flex justify-between items-start mb-10">
// //           <div className="max-w-xl">
// //             <h2 className="text-3xl font-bold text-slate-900">Students</h2>
// //           </div>
// //           <button className="bg-[#1D7AD9] text-white px-8 py-3 rounded-md flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
// //             <Plus size={20} /> Assign New Role
// //           </button>
// //         </div>

// //         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
// //           <div className="p-6 flex items-center justify-end gap-3 border-b border-gray-50">
// //             <div className="relative group">
// //               <input
// //                 type="text"
// //                 placeholder="Search by name, email or code"
// //                 className="bg-white border border-slate-200 text-xs py-2 pl-4 pr-3 rounded-lg outline-none w-80 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
// //               />
// //             </div>
// //             <button className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors">
// //               <Filter size={16} className="text-slate-800" />
// //               Filter
// //             </button>
// //           </div>

// //           <div className="overflow-x-auto">
// //             <table className="w-full text-left">
// //               <thead>
// //                 <tr className="bg-slate-50/60 border-b border-gray-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
// //                   <th className="px-6 py-5 w-12 text-center">
// //                     <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
// //                   </th>
// //                   <th className="px-6 py-5">Student ID</th>
// //                   <th className="px-6 py-5">Name</th>
// //                   <th className="px-6 py-5">Email</th>
// //                   <th className="px-6 py-5">Phone No</th>
// //                   <th className="px-6 py-5">Department</th>
// //                   <th className="px-6 py-5">Level</th>
// //                   <th className="px-6 py-5">Program</th>
// //                   <th className="px-6 py-5 text-right pr-12">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-50 text-xs">
// //                 {STUDENTS_DATA.map((s, idx) => (
// //                   <tr
// //                     key={`${s.id}-${idx}`}
// //                     className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${selectedStudent?.id === s.id ? 'bg-blue-50/50' : ''}`}
// //                     onClick={() => setSelectedStudent(s)}
// //                   >
// //                     <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
// //                       <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10" />
// //                     </td>
// //                     <td className="px-6 py-5 text-slate-400 font-medium">{s.studentId}</td>
// //                     <td className="px-6 py-5 font-bold text-slate-700">{s.name}</td>
// //                     <td className="px-6 py-5 text-slate-500">{s.email}</td>
// //                     <td className="px-6 py-5 text-slate-500">{s.phoneNo}</td>
// //                     <td className="px-6 py-5 text-slate-500">{s.department}</td>
// //                     <td className="px-6 py-5 text-slate-500">{s.level}</td>
// //                     <td className="px-6 py-5">
// //                       <span className={`px-5 py-1.5 rounded-lg text-[10px] font-bold shadow-sm inline-block min-w-[90px] text-center ${getProgramBadge(s.role || '')}`}>
// //                         {s.role}
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-5 text-right pr-12">
// //                       <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
// //                         <MoreHorizontal size={20} />
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>

// //       {selectedStudent && (
// //         <div className="fixed top-16 right-0 w-[380px] h-[calc(100vh-64px)] bg-white border-l border-gray-100 shadow-2xl z-40 animate-in slide-in-from-right duration-300 flex flex-col">
// //           <div className="p-6 border-b border-gray-50 flex items-center justify-between">
// //             <h3 className="font-bold text-slate-800">Student Bio</h3>
// //             <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><X size={20}/></button>
// //           </div>

// //           <div className="flex-1 overflow-y-auto p-6 space-y-8">
// //             <div className="flex flex-col items-center text-center">
// //               <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
// //                 <User size={40} />
// //               </div>
// //               <h4 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h4>
// //               <p className="text-xs text-slate-400">{selectedStudent.studentId}</p>
// //             </div>

// //             <div className="space-y-4">
// //               <BioItem icon={<Mail size={14}/>} label="Email Address" value={selectedStudent.email} />
// //               <BioItem icon={<Phone size={14}/>} label="Phone Number" value={selectedStudent.phoneNo} />
// //               <BioItem icon={<Calendar size={14}/>} label="Year Enrolled" value="2020" />
// //             </div>

// //             <div className="pt-6 border-t border-gray-50">
// //               <h5 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
// //                 <ShieldCheck size={16} className="text-blue-600" /> Academic Roles
// //               </h5>
// //               <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm font-bold text-slate-700">Assign as Class Rep</span>
// //                   <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <label className="text-[10px] font-bold text-slate-400 uppercase">Class Rep Permissions</label>
// //                   <div className="flex flex-wrap gap-2">
// //                     <PermissionToggle label="Post Updates" active />
// //                     <PermissionToggle label="View Results" />
// //                     <PermissionToggle label="Manage Attendance" active />
// //                   </div>
// //                 </div>
// //                 <div className="pt-2">
// //                   <button className="w-full bg-[#1D7AD9] text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10">Save Role Settings</button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const BioItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
// //   <div className="flex items-center gap-3">
// //     <div className="text-slate-400">{icon}</div>
// //     <div>
// //       <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
// //       <p className="text-xs font-semibold text-slate-700">{value}</p>
// //     </div>
// //   </div>
// // );

// // const PermissionToggle: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
// //   <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-200 hover:text-blue-500'}`}>
// //     {label}
// //   </span>
// // );
