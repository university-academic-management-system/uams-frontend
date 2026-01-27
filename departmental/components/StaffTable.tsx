
import React, { useState, useEffect } from "react";
import { MoreHorizontal, UserCog, Pencil, Trash, Download } from "lucide-react";

// Assuming types based on StaffView usage. 
// Ideally these should be in types.ts but for now defining locally or importing if they exist.
export interface StaffListItem {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  level: string;
  program: string;
}

interface StaffTableProps {
  staff: StaffListItem[];
  // filteredStaff: StaffListItem[]; // If pagination exists, this would be the page items
  allMatchingStaff?: StaffListItem[]; // Full list for select-all
  onEdit?: (staff: StaffListItem) => void;
  onAssignCourse?: (staff: StaffListItem) => void;
  onBulkDownload?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export const StaffTable: React.FC<StaffTableProps> = ({
  staff,
  allMatchingStaff = [],
  onEdit,
  onAssignCourse,
  onBulkDownload,
  onBulkDelete
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Toggle selection for a single staff
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    const targetStaff = allMatchingStaff.length > 0 ? allMatchingStaff : staff;
    const targetIds = targetStaff.map((s) => s.id);
    
    const allSelected = targetIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(targetIds);
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
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
              <th className="px-6 py-5 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer" 
                  checked={
                    allMatchingStaff.length > 0 
                        ? selectedIds.length > 0 && selectedIds.length === allMatchingStaff.length
                        : staff.length > 0 && selectedIds.length === staff.length
                  }
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
            {staff.map((item) => (
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
                      <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
                        <div className="p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignCourse?.(item);
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
                              onEdit?.(item);
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

      {/* Floating Action Bar */}
      {selectedIds.length > 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-6 z-50 animate-in slide-in-from-bottom duration-300">
          <span className="text-sm font-bold text-slate-700">
            {selectedIds.length} items selected
          </span>
          <div className="h-6 w-px bg-slate-200"></div>
          <button 
            onClick={() => onBulkDownload?.(selectedIds)}
            className="flex items-center gap-2 bg-[#1D7AD9] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Bulk Download
          </button>
          <button 
            onClick={() => onBulkDelete?.(selectedIds)}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
          >
            <Trash size={16} />
            Bulk Delete
          </button>
        </div>
      )}
    </div>
  );
};
