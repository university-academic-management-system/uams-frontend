import React, { useState, useRef } from "react";
import { Search, Plus, FileUp, Filter } from "lucide-react";
import CreateStudentModal from "../components/CreateStudentModal";
import StudentsTable from "../components/StudentsTable";

const StudentsView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Students</h2>
        <div className="flex gap-3">
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => console.log(e.target.files?.[0])}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="border border-blue-500 text-blue-500 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <FileUp className="w-4 h-4" /> Upload CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1b75d0] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Add Students
          </button>
        </div>
      </div>

      {/* Table code goes here... */}
      <StudentsTable />
      {isModalOpen && (
        <CreateStudentModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => console.log("Success", data)}
        />
      )}
    </div>
  );
};

export default StudentsView;
