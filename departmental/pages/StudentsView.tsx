// StudentsView.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Loader2, X, FileDown, FileUp } from "lucide-react";
import { Student, StudentRole } from "../types";
import api from "../api/axios";
import { SearchFilterBar } from "../components/SearchFilterBAr";
import { StudentsTable } from "../components/StudentsTable";
import { Pagination } from "../components/Pagination";
import { StudentDetailsSidebar } from "../components/StudentDetailsSidedbar";
import { AddStudentForm } from "../components/AddStudentForm";
import { studentsApi } from "../api/studentsapi";
import { toast } from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

interface ApiUser {
  id: string; // This is the ID used for sidebar profile fetch
  userId: string;
  studentId: string;
  level: string;
  levelId: string;
  isActive: boolean;
  user: {
    fullName: string;
    email: string;
    phone: string | null;
  };
  programId: string;
  createdAt: string;
  classRepRole?: 'CLASS_REP' | 'ASSISTANT_CLASS_REP'; // Assuming this might come from backend later, or we map it differently
}

interface UsersResponse {
  message: string;
  count: number;
  users: ApiUser[];
}

export const StudentsView: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiUsers = await studentsApi.getDepartmentStudents();

      // Filter only STUDENT roles and map to Student interface
      const studentData: Student[] = (apiUsers as any[])
        .map((student, index) => ({
          id: student.id, // ID for sidebar fetch as requested
          regNo: `2024${Math.floor(Math.random() * 1000000)}BA`, // Placeholder
          matNo: student.studentId || `U2024/${index + 1000}`,
          surname: student.user.fullName.split(" ")[0] || "",
          otherNames: student.user.fullName.split(" ").slice(1).join(" ") || "",
          name: student.user.fullName,
          email: student.user.email || "N/A",
          phoneNo: student.user.phone || "N/A",
          department: getDepartmentFromProgramId(student.programId),
          level: getLevelFromLevelId(student.levelId),
          programId: student.programId || "",
          role: getProgramType(student.programId),
          sex: "nil", // Placeholder
          admissionMode: "nil", // Placeholder
          entryQualification: "nil", // Placeholder
          faculty: "nil", // Placeholder
          degreeCourse: "nil", // Placeholder
          programDuration: "nil", // Placeholder
          degreeAwardCode: "nil", // Placeholder
          createdAt: new Date(student.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          isActive: student.isActive,
          // Note: Backend response doesn't explicitly show classRepRole in the example yet, 
          // keeping optional access safely if it exists or default to undefined
          classRepRole: (student as any).classRepRole, 
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
          student.surname.toLowerCase().includes(term) ||
          student.otherNames.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.regNo.toLowerCase().includes(term) ||
          student.matNo.toLowerCase().includes(term) ||
          student.phoneNo.toLowerCase().includes(term)
      );
    }

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter(
        (student) => student.level === selectedLevel
      );
    }

    return filtered;
  }, [students, searchTerm, selectedLevel]);

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

  // Get unique levels for filter
  const levels = useMemo(() => {
    const uniqueLevels = Array.from(
      new Set(students.map((s) => s.level))
    ).filter(Boolean); // Filter out any undefined/null values
    return ["all", ...uniqueLevels].sort();
  }, [students]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset page on filter change
  }, [students, searchTerm, selectedLevel]);

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
    setSelectedLevel("all");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be selected again if needed
    event.target.value = "";

    try {
      setIsUploading(true);
      const loadingToast = toast.loading("Uploading students...");
      
      await studentsApi.bulkUploadStudents(file);
      
      toast.dismiss(loadingToast);
      toast.success("Students uploaded successfully");
      
      // Refresh list
      fetchStudents();
    } catch (error: any) {
      console.error("Upload failed:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to upload students");
    } finally {
      setIsUploading(false);
    }
  };

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
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
              <FileDown size={18} />
              Download Sample File
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".csv"
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1D7AD9] text-[#1D7AD9] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileUp size={18} />
              )}
              {isUploading ? "Uploading..." : "Upload CSV"}
            </button>
            <button 
              onClick={() => setIsAddStudentModalOpen(true)}
              className="bg-[#1D7AD9] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              <Plus size={18} /> Add Students
            </button>
          </div>
        </div>

        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedLevel}
          setSelectedFilter={setSelectedLevel}
          filterOptions={levels}
          defaultFilterLabel="All Levels"
          onClearFilters={clearFilters}
        />

        <StudentsTable
          students={students}
          filteredStudents={paginatedStudents}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          searchTerm={searchTerm}
          onEdit={(student) => {
            setStudentToEdit(student);
            setIsAddStudentModalOpen(true);
          }}
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

      {(isAddStudentModalOpen || studentToEdit) && (
        <AddStudentForm
          initialData={studentToEdit}
          onClose={() => {
            setIsAddStudentModalOpen(false);
            setStudentToEdit(null);
          }}
          onSubmit={async (data) => {
            try {
              if (studentToEdit) {
                // Edit mode
                await api.patch(`/students/${studentToEdit.id}`, data);
                // Refresh list
                fetchStudents();
              } else {
                // Add mode (keeping mock for now unless specified)
                console.log("Adding student:", data);
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }
              
              setIsAddStudentModalOpen(false);
              setStudentToEdit(null);
            } catch (err) {
              console.error("Failed to save student:", err);
              // You might want to show a toast here, e.g. toast.error("Failed to save")
            }
          }}
        />
      )}
    </div>
  );
};
