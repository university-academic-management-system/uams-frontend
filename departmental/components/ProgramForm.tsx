import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import FormFieldHorizontal from "./FormFieldHorizontal";
import {
  PROGRAM_TYPES,
  LEVEL_OPTIONS,
  DURATION_OPTIONS,
} from "../utils/constants";
import {
  getCurrentDepartmentId,
  getCurrentUniversityId,
  getCurrentTenantId,
} from "../utils/auth";

interface ProgramFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "UG" as "UG" | "PGD" | "Masters" | "PhD",
    levelId: "",
    duration: 4,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getLevelIdByName = (name: string): string => {
    const level = LEVEL_OPTIONS.find((l) => l.name === name);
    return level?.id || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);

      // Get IDs from auth token
      const departmentId = getCurrentDepartmentId();
      const universityId = getCurrentUniversityId();
      const tenantId = getCurrentTenantId();

      if (!departmentId || !universityId || !tenantId) {
        throw new Error("Authentication error: Missing required IDs in token");
      }

      // Get level ID from selected level name
      const levelId = getLevelIdByName(formData.levelId);
      if (!levelId) {
        throw new Error("Please select a valid level");
      }

      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Program name is required");
      }
      if (!formData.code.trim()) {
        throw new Error("Program code is required");
      }
      if (!formData.type) {
        throw new Error("Program type is required");
      }

      // Prepare data for API - ALL IDs come from token
      const dataToSend = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        departmentId: departmentId, // From token
        levelId: levelId, // Converted from level name
        type: formData.type, // UG, PGD, Masters, PhD
        duration: Number(formData.duration), // Convert to number
        description: formData.description.trim() || "", // Default to empty string if not provided
        universityId: universityId, // From token
        tenantId: tenantId, // From token (important!)
      };

      console.log("Sending program data:", dataToSend);

      await onSubmit(dataToSend);
    } catch (err: any) {
      console.error("Program creation error:", err);
      setError(
        err.message || err.response?.data?.message || "Failed to create program"
      );
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
              options={PROGRAM_TYPES.map((t) => t.label)}
              required
            />
            <FormFieldHorizontal
              label="Level"
              type="select"
              value={formData.levelId}
              onChange={(value) => handleChange("levelId", value)}
              options={LEVEL_OPTIONS.map((l) => l.name)}
              placeholder="Select Level"
              required
            />
            <FormFieldHorizontal
              label="Duration (Years)"
              type="select"
              value={formData.duration.toString()}
              onChange={(value) => handleChange("duration", parseInt(value))}
              options={DURATION_OPTIONS}
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
                <Loader2 className="animate-spin h-4 w-4" />
                Creating...
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
