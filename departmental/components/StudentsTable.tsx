// components/StudentsTable.tsx
import React, { useState, useEffect } from "react";
import { MoreHorizontal, User, UserCog, Pencil, Trash, Download } from "lucide-react";
import { Student } from "../types";

interface StudentsTableProps {
  students: Student[];
  filteredStudents: Student[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  searchTerm: string;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  filteredStudents,
  selectedStudent,
  setSelectedStudent,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = React.useState<string | null>(
    null
  );

  // Toggle selection for a single student
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  const getProgramBadge = (role: string) => {
    switch (role) {
      case "Bachelors":
        return "bg-[#2ECC71] text-white";
      case "PGD":
        return "bg-[#95A5A6] text-white";
      case "Masters":
        return "bg-[#B19CD9] text-white";
      default:
        return "bg-slate-200 text-slate-600";
    }
  };

  if (filteredStudents.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="py-16 text-center">
          <div className="text-slate-300 mb-4">
            <User className="h-16 w-16 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-slate-400 mb-2">
            No Students Found
          </h3>
          <p className="text-slate-400 text-sm">
            Try changing your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/60 border-b border-gray-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
              <th className="px-6 py-5 w-12 text-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                  checked={
                    filteredStudents.length > 0 &&
                    selectedIds.length === filteredStudents.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-5">Student ID</th>
              <th className="px-6 py-5">Name</th>
              <th className="px-6 py-5">Email</th>
              <th className="px-6 py-5">Phone No</th>
              <th className="px-6 py-5">Department</th>
              <th className="px-6 py-5">Level</th>
              <th className="px-6 py-5">Program</th>
              <th className="px-6 py-5">Joined</th>
              <th className="px-6 py-5 text-right pr-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${
                  selectedIds.includes(student.id) ? "bg-blue-50/30" : ""
                } ${selectedStudent?.id === student.id ? "bg-blue-50/50" : ""}`}
              >
                <td
                  className="px-6 py-5 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                    checked={selectedIds.includes(student.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelection(student.id);
                    }}
                  />
                </td>
                <td className="px-6 py-5 text-slate-400 font-medium">
                  {student.studentId}
                </td>
                <td className="px-6 py-5 font-bold text-slate-700">
                  {student.name}
                </td>
                <td className="px-6 py-5 text-slate-500">{student.email}</td>
                <td className="px-6 py-5 text-slate-500">{student.phoneNo}</td>
                <td className="px-6 py-5 text-slate-500">
                  {student.department}
                </td>
                <td className="px-6 py-5 text-slate-500">{student.level}</td>
                <td className="px-6 py-5">
                  <span
                    className={`px-5 py-1.5 rounded-lg text-[10px] font-bold shadow-sm inline-block min-w-[90px] text-center ${getProgramBadge(
                      student.role
                    )}`}
                  >
                    {student.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-500">
                  {student.createdAt || "N/A"}
                </td>
                <td className="px-6 py-5 text-right pr-12">
                  <div className="relative">
                    <button
                      onClick={(e) => toggleDropdown(student.id, e)}
                      className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeDropdownId === student.id && (
                      <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student);
                              setActiveDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <UserCog size={16} />
                            Assign Role
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Edit clicked", student.id);
                              setActiveDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Pencil size={16} />
                            Edit details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Delete clicked", student.id);
                              setActiveDropdownId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash size={16} />
                            Delete student
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Action Bar */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-6 z-50 animate-in slide-in-from-bottom duration-300">
          <span className="text-sm font-bold text-slate-700">
            {selectedIds.length} items selected
          </span>
          <div className="h-6 w-px bg-slate-200"></div>
          <button className="flex items-center gap-2 bg-[#1D7AD9] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
            <Download size={16} />
            Bulk Download
          </button>
          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors">
            <Trash size={16} />
            Bulk Delete
          </button>
        </div>
      )}
    </div>
  );
};
