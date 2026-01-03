// components/StudentsTable.tsx
import React from "react";
import { MoreHorizontal, User } from "lucide-react";
import { Student } from "../types";

interface StudentsTableProps {
  students: Student[];
  filteredStudents: Student[];
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  searchTerm: string;
  selectedDepartment: string;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  filteredStudents,
  selectedStudent,
  setSelectedStudent,
}) => {
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
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
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
                  selectedStudent?.id === student.id ? "bg-blue-50/50" : ""
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <td
                  className="px-6 py-5 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
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
                  <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
