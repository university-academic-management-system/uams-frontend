import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { academicsApi, Level, Semester } from "../api/accademicapi";

interface CourseFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, onCancel }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  // ✅ State keys now match the logic in handleSubmit
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    levelId: "",
    semesterId: "",
    creditUnits: 3,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** FETCH LEVELS */
  useEffect(() => {
    academicsApi.getLevels().then(setLevels).catch(console.error);
  }, []);

  /** FETCH SEMESTERS */
  useEffect(() => {
    academicsApi.getSemesters().then(setSemesters).catch(console.error);
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const level = levels.find((l) => l.id === formData.levelId);
      const semester = semesters.find((s) => s.id === formData.semesterId);

      if (!level || !semester) {
        throw new Error("Please select level and semester");
      }

      const payload = {
        levelId: formData.levelId,
        semesterId: formData.semesterId,
        code: formData.code.trim(),
        title: formData.title.trim(),
        creditUnits: Number(formData.creditUnits),

        // ✅ REQUIRED BY BACKEND
        Level: level.name.replace(" Level", ""),
        Semester: semester.order ?? 1,
      };

      console.log("Sending course payload:", payload);
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-xl font-semibold mb-6">Create Course</h2>

      {/* ERROR MESSAGE DISPLAY */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. COS101"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Introduction to Computing"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.levelId}
              onChange={(e) => handleChange("levelId", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Level</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester - Now mapped from API instead of hardcoded */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.semesterId}
              onChange={(e) => handleChange("semesterId", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Credit Units */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credit Units <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.creditUnits}
              onChange={(e) =>
                handleChange("creditUnits", Number(e.target.value))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {[1, 2, 3, 4, 5, 6].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 transition-colors"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
