import React, { useState, useEffect } from "react";
import { Plus, Filter, Loader2, X, MoreHorizontal } from "lucide-react";
import ProgramForm from "./ProgramForm";
import { programsCoursesApi } from "../api/programscourseapi";
import { CURRENT_DEPARTMENT_ID } from "../utils/constants";

const ProgramsTab: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [programs, setPrograms] = useState<any[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
          program.code?.toLowerCase().includes(term) ||
          program.type?.toLowerCase().includes(term)
      );
      setFilteredPrograms(filtered);
    }
  }, [searchTerm, programs]);

  const fetchPrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(
        "Fetching programs from /api/program/department/",
        CURRENT_DEPARTMENT_ID
      );

      const data = await programsCoursesApi.getProgramsByDepartment(
        CURRENT_DEPARTMENT_ID
      );

      console.log("Programs API response:", data);

      setPrograms(data);
      setFilteredPrograms(data);
    } catch (err: any) {
      console.error("Error fetching programs:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        method: err.config?.method,
      });

      setError(
        err.response?.data?.message || `Failed to load programs: ${err.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProgram = async (programData: any) => {
    try {
      await programsCoursesApi.createProgram(programData);
      setIsCreating(false);
      fetchPrograms(); // Refresh the list
    } catch (err: any) {
      console.error("Error creating program:", err);
      throw err;
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
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto mt-10">
        <div className="text-red-500 mb-4">
          <X className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-bold text-red-700 mb-2">
          Failed to Load Programs
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchPrograms}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
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
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Create Program
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            Created Programs ({filteredPrograms.length})
          </h3>
          <div className="flex gap-3">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search by name, code, or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-slate-200 text-xs py-2 pl-4 pr-3 rounded-xl outline-none w-64 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
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
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
                  />
                </th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Program Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    {searchTerm
                      ? "No programs match your search"
                      : "No programs found"}
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => (
                  <tr
                    key={program.id}
                    className="hover:bg-slate-50/50 transition-colors text-sm text-slate-600 group"
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/10"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {program.code || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{program.name}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {getTypeLabel(program.type)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {program.duration} Year{program.duration !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ${getStatusBadge(
                          program.isActive
                        )}`}
                      >
                        {program.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-300 hover:text-slate-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgramsTab;
