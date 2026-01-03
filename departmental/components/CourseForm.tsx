import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import FormFieldHorizontal from "./FormFieldHorizontal";
import LecturerTag from "./LecturerTag";
import {
  LEVEL_OPTIONS,
  SEMESTER_OPTIONS,
  CREDIT_UNITS_OPTIONS,
} from "../utils/constants";
import { getCurrentDepartmentId, getCurrentUniversityId } from "../utils/auth";

interface CourseFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    levelId: "", // For form display
    semesterId: "", // For form display
    creditUnits: 3,
    creditHours: 3,
    contactHoursPerWeek: 3,
  });
  const [lecturers, setLecturers] = useState<string[]>(["Dr. Edward Nduka"]);
  const [newLecturer, setNewLecturer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addLecturer = () => {
    if (newLecturer.trim() && !lecturers.includes(newLecturer.trim())) {
      setLecturers([...lecturers, newLecturer.trim()]);
      setNewLecturer("");
    }
  };

  const removeLecturer = (index: number) => {
    setLecturers(lecturers.filter((_, i) => i !== index));
  };

  const getLevelIdByName = (name: string): string => {
    const level = LEVEL_OPTIONS.find((l) => l.name === name);
    return level?.id || "";
  };

  const getSemesterIdByName = (name: string): string => {
    const semester = SEMESTER_OPTIONS.find((s) => s.name === name);
    return semester?.id || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      // Get IDs from auth token
      const departmentId = getCurrentDepartmentId();
      const universityId = getCurrentUniversityId();

      if (!departmentId || !universityId) {
        throw new Error(
          "Authentication error: Missing department or university ID"
        );
      }

      // Get IDs from names
      const levelId = getLevelIdByName(formData.levelId);
      const semesterId = getSemesterIdByName(formData.semesterId);

      if (!levelId || !semesterId) {
        throw new Error("Please select valid level and semester");
      }

      const dataToSend = {
        universityId: universityId, // From auth token
        departmentId: departmentId, // From auth token
        semesterId: semesterId,
        code: formData.code.trim(),
        title: formData.title.trim(),
        creditUnits: Number(formData.creditUnits),
        creditHours: Number(formData.creditHours),
        contactHoursPerWeek: Number(formData.contactHoursPerWeek),
        // If your API needs levelId, add it:
        // levelId: levelId,
      };

      console.log("Sending course data:", dataToSend);

      await onSubmit(dataToSend);
    } catch (err: any) {
      console.error("Course creation error:", err);
      setError(
        err.message || err.response?.data?.message || "Failed to create course"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm animate-in zoom-in-95 duration-200">
      <h3 className="text-xl font-bold text-slate-800 mb-10">Create Course</h3>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
          <div className="space-y-6">
            <FormFieldHorizontal
              label="Course Title"
              placeholder="Data Structures and Algorithms"
              value={formData.title}
              onChange={(value) => handleChange("title", value)}
              required
            />
            <FormFieldHorizontal
              label="Level"
              type="select"
              value={formData.levelId}
              onChange={(value) => handleChange("levelId", value)}
              options={LEVEL_OPTIONS.map((l) => l.name)}
              required
            />
            <FormFieldHorizontal
              label="Semester"
              type="select"
              value={formData.semesterId}
              onChange={(value) => handleChange("semesterId", value)}
              options={SEMESTER_OPTIONS.map((s) => s.name)}
              required
            />
            <FormFieldHorizontal
              label="Credit Units"
              type="select"
              value={formData.creditUnits.toString()}
              onChange={(value) => handleChange("creditUnits", parseInt(value))}
              options={CREDIT_UNITS_OPTIONS}
              required
            />
          </div>
          <div className="space-y-6">
            <FormFieldHorizontal
              label="Course Code"
              placeholder="CSC 201"
              value={formData.code}
              onChange={(value) => handleChange("code", value)}
              required
            />
            <FormFieldHorizontal
              label="Credit Hours"
              type="select"
              value={formData.creditHours.toString()}
              onChange={(value) => handleChange("creditHours", parseInt(value))}
              options={CREDIT_UNITS_OPTIONS}
              required
            />
            <FormFieldHorizontal
              label="Contact Hours/Week"
              type="select"
              value={formData.contactHoursPerWeek.toString()}
              onChange={(value) =>
                handleChange("contactHoursPerWeek", parseInt(value))
              }
              options={CREDIT_UNITS_OPTIONS}
              required
            />
            <div className="flex items-start gap-12 group">
              <label className="text-sm font-bold text-slate-600 w-28 pt-2 shrink-0">
                Lecturers
              </label>
              <div className="flex-1 max-w-sm">
                <div className="w-full bg-white border border-slate-200 rounded-lg p-3 min-h-[110px] flex flex-wrap gap-2 content-start">
                  {lecturers.map((lecturer, index) => (
                    <LecturerTag
                      key={index}
                      name={lecturer}
                      onRemove={() => removeLecturer(index)}
                    />
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newLecturer}
                    onChange={(e) => setNewLecturer(e.target.value)}
                    placeholder="Add lecturer name"
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-1 text-sm"
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addLecturer())
                    }
                  />
                  <button
                    type="button"
                    onClick={addLecturer}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-12">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-10 py-2.5 rounded-md text-sm font-medium border border-slate-400 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-2.5 rounded-md text-sm font-bold bg-[#00B01D] text-white hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Creating...
              </>
            ) : (
              "Create Course"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Make sure this line exists for default export:
export default CourseForm; // <-- THIS LINE IS CRITICAL
