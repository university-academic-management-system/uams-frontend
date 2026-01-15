// StudentsView.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { Student, StudentRole } from "../components/types";
import api from "../api/axios";
import { SearchFilterBar } from "../components/SearchFilterBAr";
import { StudentsTable } from "../components/StudentsTable";
import { Pagination } from "../components/Pagination";
import { StudentDetailsSidebar } from "../components/StudentDetailsSidedbar";

const ITEMS_PER_PAGE = 10;

interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  Student: {
    studentId: string;
    levelId: string;
    programId: string;
  } | null;
}

interface UsersResponse {
  message: string;
  count: number;
  users: ApiUser[];
}

export const StudentsView: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<UsersResponse>(
        "/university-admin/users"
      );
      const apiUsers = response.data.users;

      // Filter only STUDENT roles and map to Student interface
      const studentData: Student[] = apiUsers
        .filter((user) => user.role === "STUDENT" && user.Student)
        .map((user, index) => ({
          id: user.id,
          studentId: user.Student?.studentId || `STU-${index + 1000}`,
          name: user.fullName,
          email: user.email,
          phoneNo: user.phone || "N/A",
          department: getDepartmentFromProgramId(user.Student?.programId),
          level: getLevelFromLevelId(user.Student?.levelId),
          programId: user.Student?.programId || "",
          role: getProgramType(user.Student?.programId),
          createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          isActive: user.isActive,
        }));

      setStudents(studentData);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students based on search term and department
  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.studentId.toLowerCase().includes(term) ||
          student.phoneNo.toLowerCase().includes(term)
      );
    }

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(
        (student) => student.department === selectedDepartment
      );
    }

    return filtered;
  }, [students, searchTerm, selectedDepartment]);

  // Paginate filtered students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  }, [filteredStudents.length]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    return ["all", ...Array.from(new Set(students.map((s) => s.department)))];
  }, [students]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDepartment]);

  // Helper functions
  const getDepartmentFromProgramId = (programId?: string): string => {
    const programMap: Record<string, string> = {
      "506fe514-728c-432f-83c1-55546fdddb8f": "Computer Science",
      // Add more program ID mappings as needed
    };
    return programId
      ? programMap[programId] || "Unknown Department"
      : "Unknown Department";
  };

  const getLevelFromLevelId = (levelId?: string): string => {
    const levelMap: Record<string, string> = {
      "6106e865-cd28-45bd-b13c-afcb8dca7b45": "100",
      "a686c3ad-a974-4929-afde-e663aa862175": "200",
      // Add more level ID mappings as needed
    };
    return levelId ? levelMap[levelId] || "Unknown Level" : "Unknown Level";
  };

  const getProgramType = (programId?: string): StudentRole => {
    const programTypeMap: Record<string, StudentRole> = {
      "506fe514-728c-432f-83c1-55546fdddb8f": "Bachelors",
      // Add more mappings
    };
    return programId ? programTypeMap[programId] || "None" : "None";
  };

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading students...</p>
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
          Failed to Load Students
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchStudents}
          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in duration-500">
      <div
        className={`space-y-6 transition-all duration-300 ${
          selectedStudent ? "pr-[400px]" : ""
        }`}
      >
        <div className="flex justify-between items-start mb-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-slate-900">Students</h2>
            <p className="text-slate-500 mt-2">
              {students.length} total students • {filteredStudents.length}{" "}
              filtered
            </p>
          </div>
          <button className="bg-[#1D7AD9] text-white px-8 py-3 rounded-md flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Plus size={20} /> Assign New Role
          </button>
        </div>

        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          departments={departments}
          onClearFilters={clearFilters}
        />

        <StudentsTable
          students={students}
          filteredStudents={paginatedStudents}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          searchTerm={searchTerm}
          selectedDepartment={selectedDepartment}
        />

        {filteredStudents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={students.length}
            filteredItemsCount={filteredStudents.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {selectedStudent && (
        <StudentDetailsSidebar
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};
