
import React, { useState, useEffect } from 'react';
import { Search, Plus, FileUp, Filter, MoreHorizontal, UserCog, Pencil, Trash, Download, FileDown } from 'lucide-react';
import { AssignCourseModal } from "./AssignCourseModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { staffApi } from "../api/staffapi";
import { toast } from "react-hot-toast";
import { StaffTable, StaffListItem } from "./StaffTable";
import { AddStaffForm } from "./AddStaffForm";

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
  const [isAssignCourseModalOpen, setIsAssignCourseModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  
  // Bulk Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  /* Updated to match backend payload requirement */
  const handleAssignCourse = async (data: { courseId: string; role: string }) => {
    if (!selectedStaffId) return;

    try {
      console.log("Assigning course:", data, "to staff:", selectedStaffId);
      
      const payload = {
        courseAssignments: [
          {
            courseId: data.courseId,
            role: data.role as "MAIN" | "ASSISTANT" | "LAB_ASSISTANT",
          },
        ],
      };

      await staffApi.assignCourses(selectedStaffId, payload);
      toast.success("Course assigned successfully");
      setIsAssignCourseModalOpen(false);
    } catch (error: any) {
      console.error("Failed to assign course:", error);
      toast.error(error.response?.data?.message || "Failed to assign course");
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/documents/Staff_Sample_File.csv';
    link.setAttribute('download', 'Staff_Sample_File.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const handleBulkDownload = async (ids: string[]) => {
    try {
      const toastId = toast.loading("Downloading staff data...");
      const blob = await staffApi.bulkDownloadStaff(ids);
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Staff_Data.csv'); // Or get filename from headers if needed
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast.success("Download started", { id: toastId });
    } catch (error: any) {
      console.error("Bulk download failed:", error);
      toast.error(error.response?.data?.message || "Failed to download staff data");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setIdsToDelete(ids);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (reason: string) => {
    if (idsToDelete.length === 0) return;

    try {
      setIsDeleting(true);
      await staffApi.bulkDeleteStaff(idsToDelete);
      toast.success("Selected staff members deleted successfully");
      setIsDeleteModalOpen(false);
      setIdsToDelete([]);
      // Here you would typically trigger a refresh of the staff list
    } catch (error: any) {
      console.error("Failed to delete staff:", error);
      toast.error(error.response?.data?.message || "Failed to delete staff");
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Staff</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
          >
            <FileDown size={18} />
            Download Sample File
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
            <FileUp size={18} />
            Upload CSV
          </button>
          <button 
            onClick={() => setIsAddStaffModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1D7AD9] text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
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

      <StaffTable 
         staff={STAFF_MOCK_DATA}
         allMatchingStaff={STAFF_MOCK_DATA}
         onAssignCourse={(item) => {
             setSelectedStaffId(item.id);
             setIsAssignCourseModalOpen(true);
         }}
         onEdit={(item) => console.log("Edit", item)}
         onBulkDownload={handleBulkDownload}
         onBulkDelete={handleBulkDelete}
      />

      <AssignCourseModal
        isOpen={isAssignCourseModalOpen}
        onClose={() => setIsAssignCourseModalOpen(false)}
        onAssign={handleAssignCourse}
        staffName={STAFF_MOCK_DATA.find((s) => s.id === selectedStaffId)?.name}
      />

      {isAddStaffModalOpen && (
        <AddStaffForm
          onClose={() => setIsAddStaffModalOpen(false)}
          onSubmit={async (data) => {
            console.log("Adding staff:", data);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Staff added successfully");
            setIsAddStaffModalOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Staff Members"
        description={`Are you sure you want to delete ${idsToDelete.length} selected staff member(s)? This action cannot be undone.`}
        itemCount={idsToDelete.length}
      />
    </div>
  );
};
