import React, { useState, useEffect } from "react";
import { Plus, Filter, Loader2, X, MoreHorizontal, Pencil, Trash, Download } from "lucide-react";
import ProgramForm from "./ProgramForm";
import { programsCoursesApi } from "../api/programscourseapi";

const ProgramsTab: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Toggle selection for a single program
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPrograms.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPrograms.map((p) => p.id));
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

  // Fetch programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  // Filter programs when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPrograms(programs);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = programs.filter(
        (program) =>
          program.name?.toLowerCase().includes(term) ||
          program.type?.toLowerCase().includes(term)
      );
      setFilteredPrograms(filtered);
    }
  }, [searchTerm, programs]);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await programsCoursesApi.getProgramsByDepartment();
      
      const programsList = Array.isArray(data) ? data : (data['programs'] || data['data'] || []);

      setPrograms(programsList);
      setFilteredPrograms(programsList);
    } catch (err: any) {
      console.error("Error fetching programs:", err);
      setError(
        err.response?.data?.error || `Failed to load programs: ${err.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed: Properly handle errors from createProgram and re-throw for ProgramForm to display
  const handleCreateProgram = async (programData: any) => {
    try {
      await programsCoursesApi.createProgram(programData);
      setIsCreating(false);
      await fetchPrograms(); // Refresh the list after successful creation
    } catch (err: any) {
      console.error("Error creating program:", err);
      // Re-throw the error so ProgramForm can catch and display it
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create program";
      throw new Error(errorMessage);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? "bg-emerald-100 text-emerald-600"
      : "bg-rose-100 text-rose-400";
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      UG: "Undergraduate",
      PGD: "Post Graduate Diploma",
      Masters: "Masters",
      PhD: "PhD",
    };
    return typeMap[type] || type;
  };

  if (isCreating) {
    return (
      <ProgramForm
        onSubmit={handleCreateProgram}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-10 shadow-sm">
        <div className="text-red-500 mb-4">
          <X className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-red-700 mb-2">
          Failed to Load Programs
        </h3>
        <p className="text-red-600 mb-4 text-sm">{error}</p>
        <button
          onClick={fetchPrograms}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={18} /> Create Program
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">
            Created Programs ({filteredPrograms.length})
          </h3>
          <div className="flex gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs py-2.5 pl-4 pr-10 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
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
              <tr className="bg-slate-50/60 border-y border-gray-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                    checked={
                      filteredPrograms.length > 0 &&
                      selectedIds.length === filteredPrograms.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4">Program Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 text-sm italic"
                  >
                    {searchTerm
                      ? "No programs match your search"
                      : "No programs available for your department"}
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => (
                  <tr
                    key={program.id}
                    className={`hover:bg-slate-50/50 transition-colors text-sm text-slate-600 group ${
                      selectedIds.includes(program.id) ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                        checked={selectedIds.includes(program.id)}
                        onChange={() => toggleSelection(program.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {program.name}
                    </td>
                    <td className="px-6 py-4">{getTypeLabel(program.type)}</td>
                    <td className="px-6 py-4">
                      {program.duration} Year{program.duration !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm inline-block ${getStatusBadge(
                          program.isActive !== false
                        )}`}
                      >
                        {program.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDropdown(program.id, e)}
                          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {activeDropdownId === program.id && (
                          <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Edit clicked", program.id);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              >
                                <Pencil size={14} />
                                Edit details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Delete clicked", program.id);
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
    </div>
  );
};

export default ProgramsTab;

