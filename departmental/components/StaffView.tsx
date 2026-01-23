
import React, { useState, useEffect } from 'react';
import { Search, Plus, FileUp, Filter, MoreHorizontal, UserCog, Pencil, Trash, Download, FileDown } from 'lucide-react';
import { AssignCourseModal } from "./AssignCourseModal";

interface StaffListItem {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  level: string;
  program: string;
}

const STAFF_MOCK_DATA: StaffListItem[] = Array(12).fill(null).map((_, i) => ({
  id: `${i + 1}`,
  staffId: 'U2020/2502201',
  name: 'Justice Amadi',
  email: 'justiceamadi@gmail.com',
  phone: '+2348012345678',
  department: 'Computer Science',
  level: '100',
  program: 'Bachelors'
}));

export const StaffView: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isAssignCourseModalOpen, setIsAssignCourseModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const handleAssignCourse = async (data: { courseId: string; role: string }) => {
    console.log("Assigning course:", data, "to staff:", selectedStaffId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAssignCourseModalOpen(false);
  };

  // Toggle selection for a single staff
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === STAFF_MOCK_DATA.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(STAFF_MOCK_DATA.map((s) => s.id));
    }
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Staff</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
            <FileDown size={18} />
            Download Sample File
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
            <FileUp size={18} />
            Upload CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1D7AD9] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            <Plus size={18} />
            Add Staff
          </button>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3 mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by name, email or code" 
            className="bg-white border border-slate-200 text-xs py-2.5 px-4 rounded-lg outline-none w-72 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 shadow-sm" 
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={16} className="text-slate-800" />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="px-6 py-5 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer" 
                    checked={selectedIds.length === STAFF_MOCK_DATA.length && STAFF_MOCK_DATA.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-5">Staff ID</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Phone No</th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5">Level</th>
                <th className="px-6 py-5">Program</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STAFF_MOCK_DATA.map((item) => (
                <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.includes(item.id) ? "bg-blue-50/30" : ""}`}>
                  <td className="px-6 py-5 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer" 
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                    />
                  </td>
                  <td className="px-6 py-5 text-[11px] text-slate-400 font-medium">
                    {item.staffId}
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-slate-700">
                    {item.name}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">
                    {item.email}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">
                    {item.phone}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">
                    {item.department}
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500">
                    {item.level}
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-[#2ECC71] text-white px-5 py-1.5 rounded-lg text-[10px] font-bold shadow-sm inline-block min-w-[90px] text-center">
                      {item.program}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="relative">
                      <button 
                        onClick={(e) => toggleDropdown(item.id, e)}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {activeDropdownId === item.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <div className="p-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStaffId(item.id);
                                setIsAssignCourseModalOpen(true);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <UserCog size={16} />
                              Assign Course
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Edit clicked", item.id);
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
                                console.log("Delete clicked", item.id);
                                setActiveDropdownId(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash size={16} />
                              Delete staff
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

      <AssignCourseModal
        isOpen={isAssignCourseModalOpen}
        onClose={() => setIsAssignCourseModalOpen(false)}
        onAssign={handleAssignCourse}
        staffName={STAFF_MOCK_DATA.find((s) => s.id === selectedStaffId)?.name}
      />
    </div>
  );
};
