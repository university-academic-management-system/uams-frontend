import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { programsCoursesApi } from "../api/programscourseapi";
import { Course } from "../api/types";

interface AssignCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: { courseId: string; role: string }) => Promise<void>;
  staffName?: string;
}

export const AssignCourseModal: React.FC<AssignCourseModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  staffName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [role, setRole] = useState("MAIN");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const response = await programsCoursesApi.getCoursesByDepartment();
      if (response && response.courses) {
        setCourses(response.courses);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !role) return;

    setIsSubmitting(true);
    try {
      await onAssign({ courseId, role });
      onClose();
    } catch (error) {
      console.error("Failed to assign course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1D7AD9]">
            Assign Course To Lecturer
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Name of course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D7AD9] outline-none transition-all appearance-none bg-white"
                required
              >
                <option value="" disabled>
                  {isLoadingCourses ? "Loading courses..." : "Select a Course"}
                </option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-[#1D7AD9] outline-none transition-all appearance-none bg-white"
              >
                <option value="MAIN">Main Lecturer</option>
                <option value="ASSISTANT">Assistant Lecturer</option>
                <option value="LAB_ASSISTANT">Lab Instructor</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !courseId}
                className="px-6 py-2.5 rounded-lg bg-[#1D7AD9] text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                Assign Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
