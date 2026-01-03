import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { AccountRecord } from "./types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  data: AccountRecord[]; // Added data prop back
  onView: (admin: AccountRecord) => void;
  onEdit: (admin: AccountRecord) => void;
  onDelete: (code: string) => void;
}

export const AccountsTable = ({ data, onView, onEdit, onDelete }: Props) => {
  const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const pageSizeOptions = [10, 20, 50, 100];

  // Reset to page 1 if data changes (e.g., during search)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuIdx(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination Logic
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const currentAccounts = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-slate-50/50">
            <tr className="border-b border-slate-100">
              <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                Code
              </th>
              <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                Role
              </th>
              <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                Name
              </th>
              <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                Email
              </th>
              <th className="p-6 text-slate-400 font-bold text-xs uppercase text-center">
                Status
              </th>
              <th className="p-6 text-slate-400 font-bold text-xs uppercase text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {currentAccounts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-20 text-center text-slate-400 font-medium"
                >
                  No accounts found.
                </td>
              </tr>
            ) : (
              currentAccounts.map((row, idx) => (
                <tr
                  key={row.code}
                  className="hover:bg-slate-50/50 transition-all"
                >
                  <td className="p-6 text-[10px] font-black text-slate-400 truncate max-w-[100px]">
                    {row.code}
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-600 uppercase">
                    {row.role.replace("_", " ")}
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-900">
                    {row.name}
                  </td>
                  <td className="p-6 text-xs text-slate-500">{row.email}</td>
                  <td className="p-6 text-center">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="p-6 relative text-right">
                    <button
                      onClick={() =>
                        setActiveMenuIdx(activeMenuIdx === idx ? null : idx)
                      }
                      className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </button>

                    {activeMenuIdx === idx && (
                      <div
                        ref={menuRef}
                        className="absolute right-10 top-12 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            onView(row);
                            setActiveMenuIdx(null);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50"
                        >
                          <Eye className="w-4 h-4 text-slate-400" /> View
                        </button>
                        <button
                          onClick={() => {
                            onEdit(row);
                            setActiveMenuIdx(null);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50"
                        >
                          <Edit2 className="w-4 h-4 text-slate-400" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            onDelete(row.code);
                            setActiveMenuIdx(null);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 text-red-500 text-xs font-medium"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <span>
              Showing <span className="text-slate-900">{startIndex + 1}</span>–
              <span className="text-slate-900">{endIndex}</span> of{" "}
              <span className="text-slate-900">{totalItems}</span>
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage">Rows per page:</label>
              <div className="relative">
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none cursor-pointer"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              Page <span className="text-slate-900 mx-1">{currentPage}</span> of{" "}
              {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// import React, { useEffect, useState, useMemo, useRef } from "react";
// import {
//   MoreHorizontal,
//   Eye,
//   Edit2,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
// } from "lucide-react";
// import api from "../api/axios"; // Adjust path to your axios.tsx
// import { StatusBadge } from "./StatusBadge";

// export interface AccountRecord {
//   code: string; // Mapping user.id to code
//   role: string;
//   name: string;
//   email: string;
//   status: "active" | "inactive";
// }

// interface Props {
//   onView: (admin: AccountRecord) => void;
//   onEdit: (admin: AccountRecord) => void;
//   onDelete: (id: string) => void;
// }

// export const AccountsTable = ({ onView, onEdit, onDelete }: Props) => {
//   const [accounts, setAccounts] = useState<AccountRecord[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState<number>(10);
//   const pageSizeOptions = [10, 20, 50, 100];

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await api.get("/university-admin/users");

//         // Filter: Keep everyone EXCEPT students
//         const nonStudentData = res.data.users
//           .filter((u: any) => u.role !== "STUDENT")
//           .map((u: any) => ({
//             code: u.id,
//             role: u.role.replace("_", " "), // Formats FACULTY_ADMIN to FACULTY ADMIN
//             name: u.fullName || "N/A",
//             email: u.email,
//             status: u.isActive ? "active" : "inactive",
//           }));

//         setAccounts(nonStudentData);
//       } catch (err) {
//         console.error("Failed to fetch accounts:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setActiveMenuIdx(null);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Pagination Logic
//   const totalItems = accounts.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

//   const currentAccounts = useMemo(() => {
//     return accounts.slice(startIndex, endIndex);
//   }, [accounts, startIndex, endIndex]);

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-slate-500">Loading accounts...</div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
//       <div className="overflow-x-auto flex-1">
//         <table className="w-full text-left min-w-[900px]">
//           <thead className="bg-slate-50/50">
//             <tr className="border-b border-slate-100">
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase text-nowrap">
//                 Code
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase">
//                 Role
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase">
//                 Name
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase">
//                 Email
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase text-center">
//                 Status
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase text-right">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {currentAccounts.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="p-20 text-center text-slate-400">
//                   No admin accounts found.
//                 </td>
//               </tr>
//             ) : (
//               currentAccounts.map((row, idx) => (
//                 <tr
//                   key={row.code}
//                   className="hover:bg-slate-50/50 transition-all"
//                 >
//                   <td className="p-6 text-[10px] font-black text-slate-400 truncate max-w-[100px]">
//                     {row.code}
//                   </td>
//                   <td className="p-6 text-xs font-bold text-slate-600">
//                     {row.role}
//                   </td>
//                   <td className="p-6 text-xs font-bold text-slate-900">
//                     {row.name}
//                   </td>
//                   <td className="p-6 text-xs text-slate-500">{row.email}</td>
//                   <td className="p-6 text-center">
//                     <StatusBadge status={row.status} />
//                   </td>
//                   <td className="p-6 relative text-right">
//                     <button
//                       onClick={() =>
//                         setActiveMenuIdx(activeMenuIdx === idx ? null : idx)
//                       }
//                       className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
//                     >
//                       <MoreHorizontal className="w-5 h-5 text-slate-400" />
//                     </button>

//                     {activeMenuIdx === idx && (
//                       <div
//                         ref={menuRef}
//                         className="absolute right-10 top-12 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
//                       >
//                         <button
//                           onClick={() => {
//                             onView(row);
//                             setActiveMenuIdx(null);
//                           }}
//                           className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50"
//                         >
//                           <Eye className="w-4 h-4 text-slate-400" /> View
//                         </button>
//                         <button
//                           onClick={() => {
//                             onEdit(row);
//                             setActiveMenuIdx(null);
//                           }}
//                           className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50"
//                         >
//                           <Edit2 className="w-4 h-4 text-slate-400" /> Edit
//                         </button>
//                         <button
//                           onClick={() => {
//                             onDelete(row.code);
//                             setActiveMenuIdx(null);
//                           }}
//                           className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 text-red-500 text-xs font-medium"
//                         >
//                           <Trash2 className="w-4 h-4 text-red-400" /> Delete
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Footer */}
//       {totalItems > 0 && (
//         <div className="px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-slate-500">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-6">
//             <span>
//               Showing <span className="text-slate-900">{startIndex + 1}</span>–
//               <span className="text-slate-900">{endIndex}</span> of{" "}
//               <span className="text-slate-900">{totalItems}</span>
//             </span>

//             <div className="flex items-center gap-2">
//               <label htmlFor="itemsPerPage">Rows per page:</label>
//               <div className="relative">
//                 <select
//                   id="itemsPerPage"
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                   className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
//                 >
//                   {pageSizeOptions.map((size) => (
//                     <option key={size} value={size}>
//                       {size}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown
//                   size={12}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
//             >
//               <ChevronLeft size={16} />
//             </button>

//             <div className="flex items-center px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
//               Page <span className="text-slate-900 mx-1">{currentPage}</span> of{" "}
//               {totalPages}
//             </div>

//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// import React, { useState } from "react";
// import { MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
// import { AccountRecord } from "./types";
// import { StatusBadge } from "./StatusBadge";

// interface Props {
//   data: AccountRecord[];
//   onView: (admin: AccountRecord) => void;
//   onEdit: (admin: AccountRecord) => void;
//   onDelete: (id: string) => void;
// }

// export const AccountsTable = ({ data, onView, onEdit, onDelete }: Props) => {
//   const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null);

//   return (
//     <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left min-w-[900px]">
//           <thead className="bg-slate-50/50">
//             <tr className="border-b border-slate-100">
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase">
//                 Code
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase">
//                 Role
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase">
//                 Name
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase">
//                 Email
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase text-center">
//                 Status
//               </th>
//               <th className="p-6 text-slate-400 font-bold text-xs uppercase">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {data.map((row, idx) => (
//               <tr key={idx} className="hover:bg-slate-50 transition-all">
//                 <td className="p-6 text-xs font-black text-slate-800">
//                   {row.code}
//                 </td>
//                 <td className="p-6 text-xs font-bold text-slate-600">
//                   {row.role}
//                 </td>
//                 <td className="p-6 text-xs font-bold text-slate-900">
//                   {row.name}
//                 </td>
//                 <td className="p-6 text-xs text-slate-400">{row.email}</td>
//                 <td className="p-6 text-center">
//                   <StatusBadge status={row.status} />
//                 </td>
//                 <td className="p-6 relative">
//                   <button
//                     onClick={() =>
//                       setActiveMenuIdx(activeMenuIdx === idx ? null : idx)
//                     }
//                     className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
//                   >
//                     <MoreHorizontal className="w-5 h-5 text-slate-400" />
//                   </button>
//                   {activeMenuIdx === idx && (
//                     <div className="absolute right-6 top-12 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
//                       <button
//                         onClick={() => {
//                           onView(row);
//                           setActiveMenuIdx(null);
//                         }}
//                         className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50"
//                       >
//                         <Eye className="w-4 h-4 text-slate-400" /> View
//                       </button>
//                       <button
//                         onClick={() => {
//                           onEdit(row);
//                           setActiveMenuIdx(null);
//                         }}
//                         className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50"
//                       >
//                         <Edit2 className="w-4 h-4 text-slate-400" /> Edit
//                       </button>
//                       <button
//                         onClick={() => {
//                           onDelete(row.code);
//                           setActiveMenuIdx(null);
//                         }}
//                         className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 text-red-500 text-xs font-medium"
//                       >
//                         <Trash2 className="w-4 h-4 text-red-400" /> Delete
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
