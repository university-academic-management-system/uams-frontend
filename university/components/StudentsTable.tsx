import { useEffect, useState, useMemo, useRef } from "react";
import adminApi from "../api/AdminApi";
import {
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string | null;
  department: string;
  level: string;
  program: string;
}

const StudentsTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const pageSizeOptions = [10, 20, 50, 100];

  // Selection (max 100 students)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const MAX_SELECTABLE = 100;

  // Filter dropdown
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await adminApi.get("/university-admin/users");

        const studentData = res.data.users
          .filter((u: any) => u.role === "STUDENT")
          .map((u: any) => ({
            id: u.id,
            studentId: u.Student?.studentId || "U202502201",
            fullName: u.fullName || "Justice Amadi",
            email: u.email || "justiceamadi@gmail.com",
            phone: u.phone || "+2348012345678",
            department: "Computer Science",
            level: u.Student?.levelId ? String(u.Student.levelId) : "100",
            program:
              ["Bachelors", "PGD", "Masters"][Math.floor(Math.random() * 3)] ||
              "Bachelors",
          }));

        setStudents(studentData);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.studentId.toLowerCase().includes(term)
      );
    }

    if (selectedDepartment)
      result = result.filter((s) => s.department === selectedDepartment);
    if (selectedProgram)
      result = result.filter((s) => s.program === selectedProgram);
    if (selectedLevel) result = result.filter((s) => s.level === selectedLevel);

    return result;
  }, [
    students,
    searchTerm,
    selectedDepartment,
    selectedProgram,
    selectedLevel,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedDepartment,
    selectedProgram,
    selectedLevel,
    itemsPerPage,
  ]);

  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentPageStudents = filteredStudents.slice(startIndex, endIndex);

  const handleSelectAllCurrentPage = (checked: boolean) => {
    if (checked) {
      const canSelectMore = MAX_SELECTABLE - selectedIds.size;
      const available = currentPageStudents
        .filter((s) => !selectedIds.has(s.id))
        .slice(0, canSelectMore)
        .map((s) => s.id);

      setSelectedIds((prev) => new Set([...prev, ...available]));
    } else {
      const visibleIds = new Set(currentPageStudents.map((s) => s.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      });
    }
  };

  const handleSelectStudent = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        if (next.size >= MAX_SELECTABLE) return prev;
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading students...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col h-full min-h-[450px]">
      <div className="px-6 pt-6 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"></div>

      {/* Container now uses justify-end to push contents to the right */}
      <div className="px-6 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        {/* Removed flex-1 so search doesn't take all space */}
        <div className="relative min-w-[280px] max-w-md w-full sm:w-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email or code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap"
          >
            <Filter size={16} />
            Filter
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 text-sm">
              <div className="px-4 py-2 border-b border-gray-100">
                <label className="block text-gray-700 font-medium mb-1">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div className="px-4 py-2 border-b border-gray-100">
                <label className="block text-gray-700 font-medium mb-1">
                  Program
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Programs</option>
                  <option value="Bachelors">Bachelors</option>
                  <option value="PGD">PGD</option>
                  <option value="Masters">Masters</option>
                </select>
              </div>

              <div className="px-4 py-2">
                <label className="block text-gray-700 font-medium mb-1">
                  Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    currentPageStudents.length > 0 &&
                    currentPageStudents.every((s) => selectedIds.has(s.id))
                  }
                  onChange={(e) => handleSelectAllCurrentPage(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium">Student ID</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Phone No</th>
              <th className="px-4 py-3 text-left font-medium">Department</th>
              <th className="px-4 py-3 text-left font-medium">Level</th>
              <th className="px-4 py-3 text-left font-medium">Program</th>
              <th className="w-20 px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentPageStudents.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-32 text-center text-gray-500">
                  No students match your filters
                </td>
              </tr>
            ) : (
              currentPageStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(student.id)}
                      onChange={(e) =>
                        handleSelectStudent(student.id, e.target.checked)
                      }
                      disabled={
                        !selectedIds.has(student.id) &&
                        selectedIds.size >= MAX_SELECTABLE
                      }
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-mono">
                    {student.studentId}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {student.fullName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.email}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.department}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.level}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        student.program === "Bachelors"
                          ? "bg-green-100 text-green-700"
                          : student.program === "PGD"
                          ? "bg-gray-500 text-white"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {student.program}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-1 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal size={18} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span>
              Showing {startIndex + 1}–{endIndex} of {totalItems}
            </span>

            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="whitespace-nowrap">
                Rows per page:
              </label>
              <div className="relative inline-block">
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {pageSizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="min-w-[100px] text-center font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;