import React, { useState } from "react";
import { Filter, MoreHorizontal, Search, ChevronDown } from "lucide-react";
import FormFieldHorizontal from "./FormFieldHorizontal";

// Dummy data for sessions
const INITIAL_SESSIONS = [
  {
    id: "1",
    name: "2024/2025 Academic Session",
    type: "Undergraduate",
    duration: "12 Months",
    startDate: "12-10-2024",
    status: "Ongoing",
  },
  {
    id: "2",
    name: "2024/2025 Academic Session",
    type: "Masters",
    duration: "12 Months",
    startDate: "12-10-2024",
    status: "Ongoing",
  },
  {
    id: "3",
    name: "2024/2025 Academic Session",
    type: "Sandwich",
    duration: "6 Months",
    startDate: "12-10-2024",
    status: "Ongoing",
  },
  {
    id: "4",
    name: "2023/2024 Academic Session",
    type: "Undergraduate",
    duration: "12 Months",
    startDate: "12-10-2024",
    status: "Completed",
  },
];

const StructureTab: React.FC = () => {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "2023/2024 Academic Session",
    duration: "12 Months",
    type: "Undergraduate",
    startDate: "12-10-2024",
    semesters: "2",
    description: "",
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    return status === "Ongoing" 
      ? "bg-green-100 text-green-600" 
      : "bg-red-100 text-red-600";
  };

  return (
    <div className="space-y-8">
      {/* Create Session Form */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-8">Create Session</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
          <div className="space-y-6">
            <FormFieldHorizontal 
              label="Session Name" 
              value={formData.name}
              onChange={(val) => handleFormChange("name", val)}
            />
            <FormFieldHorizontal 
              label="Type" 
              type="select" 
              options={["Undergraduate", "Masters", "PhD", "Sandwich"]}
              value={formData.type}
              onChange={(val) => handleFormChange("type", val)}
            />
            <FormFieldHorizontal 
              label="Semesters" 
              type="select" 
              options={["1", "2", "3"]}
              value={formData.semesters}
              onChange={(val) => handleFormChange("semesters", val)}
            />
          </div>
          
          <div className="space-y-6">
            <FormFieldHorizontal 
              label="Duration" 
              type="select" 
              options={["6 Months", "12 Months", "18 Months"]}
              value={formData.duration}
              onChange={(val) => handleFormChange("duration", val)}
            />
            <FormFieldHorizontal 
              label="Start Date" 
              placeholder="DD-MM-YYYY"
              value={formData.startDate}
              onChange={(val) => handleFormChange("startDate", val)}
            />
            <FormFieldHorizontal 
              label="Description" 
              type="textarea" 
              value={formData.description}
              onChange={(val) => handleFormChange("description", val)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button className="px-8 py-2.5 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button className="px-8 py-2.5 rounded-lg text-sm font-bold bg-[#00B01D] text-white hover:bg-green-700 transition-colors shadow-sm">
            Create Session
          </button>
        </div>
      </div>

      {/* Created Sessions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Created Sessions</h3>
          <div className="flex gap-3">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search by name, semester, or code" 
                className="bg-white border border-slate-200 text-xs py-2.5 pl-4 pr-10 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} className="text-slate-400" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="px-6 py-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer" />
                </th>
                <th className="px-6 py-4">Session Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/50 transition-colors text-slate-600">
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                      checked={selectedIds.includes(session.id)}
                      onChange={() => toggleSelection(session.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{session.name}</td>
                  <td className="px-6 py-4">{session.type}</td>
                  <td className="px-6 py-4">{session.duration}</td>
                  <td className="px-6 py-4">{session.startDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-[11px] font-bold ${getStatusBadge(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StructureTab;
