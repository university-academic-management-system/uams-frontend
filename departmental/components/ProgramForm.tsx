// ProgramForm.tsx - UPDATED VERSION
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import FormFieldHorizontal from "./FormFieldHorizontal";
import { DURATION_OPTIONS } from "../utils/constants";
import { getCurrentDepartmentId, getCurrentUniversityId } from "../utils/auth";
import { programsCoursesApi } from "../api/programscourseapi";
import { ProgramTypeResponse } from "../api/types";

interface ProgramFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "", // Will be set to ID
    duration: 4,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [programTypes, setProgramTypes] = useState<ProgramTypeResponse[]>([]);

  // Fetch Program Types on Mount
  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await programsCoursesApi.getProgramTypes();
        setProgramTypes(types);
        // Set default if available
        if (types.length > 0) {
            handleChange("type", types[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch program types", err);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      const departmentId = getCurrentDepartmentId();
      const universityId = getCurrentUniversityId();

      if (!departmentId || !universityId) {
        throw new Error("Authentication error: Missing required IDs in token");
      }

      if (!formData.name.trim()) throw new Error("Program name is required");
      if (!formData.code.trim()) throw new Error("Program code is required");

      const dataToSend = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        type: formData.type, // This should be "UG", "PG", etc.
        duration: Number(formData.duration),
        description: formData.description.trim() || "",
        departmentId,
        universityId,
      };

      console.log("📤 Submitting program data:", dataToSend); // Debug log

      await onSubmit(dataToSend);
    } catch (err: any) {
      setError(err.message || "Failed to create program");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm animate-in zoom-in-95 duration-200">
      <h3 className="text-xl font-bold text-slate-800 mb-10">Create Program</h3>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
          <div className="space-y-6">
            <FormFieldHorizontal
              label="Program Name"
              placeholder="Bachelor of Science in Computer Science"
              value={formData.name}
              onChange={(value) => handleChange("name", value)}
              required
            />
            <FormFieldHorizontal
              label="Type"
              type="select"
              value={formData.type}
              onChange={(value) => handleChange("type", value)}
              // ✅ FIXED: Send value-label pairs from API
              options={programTypes.map((t) => ({
                label: t.name,
                value: t.id,
              }))}
              required
            />
            <FormFieldHorizontal
              label="Duration (Years)"
              type="select"
              value={formData.duration.toString()}
              onChange={(value) => handleChange("duration", parseInt(value))}
              // ✅ FIXED: Send value-label pairs for duration too
              options={DURATION_OPTIONS.map((d) => ({
                label: `${d} year${d !== "1" ? "s" : ""}`,
                value: d,
              }))}
              required
            />
          </div>
          <div className="space-y-6">
            <FormFieldHorizontal
              label="Program Code"
              placeholder="BSC_CS"
              value={formData.code}
              onChange={(value) => handleChange("code", value)}
              required
            />
            <FormFieldHorizontal
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={(value) => handleChange("description", value)}
              placeholder="Four-year undergraduate program in Computer Science"
            />
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
                <Loader2 className="animate-spin h-4 w-4" /> Creating...
              </>
            ) : (
              "Create Program"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;

