
import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface AddStaffFormProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any; // For edit mode if needed
}

export const AddStaffForm: React.FC<AddStaffFormProps> = ({
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    staffId: "",
    title: "",
    firstName: "",
    otherName: "",
    sex: "",
    highestDegree: "",
    phoneNumber: "",
    email: "",
    type: "Academic",
    role: "",
    category: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        staffId: initialData.staffId || "",
        title: initialData.title || "",
        firstName: initialData.name?.split(" ")[0] || "",
        otherName: initialData.name?.split(" ").slice(1).join(" ") || "",
        sex: initialData.sex || "",
        highestDegree: initialData.level || "", // Mapping level to highest degree as placeholder
        phoneNumber: initialData.phone || "",
        email: initialData.email || "",
        type: initialData.program || "Academic",
        role: initialData.department || "",
        category: "", // specific field
      });
    } else {
        // Generate mock Staff ID for new entry
        setFormData(prev => ({
            ...prev,
            staffId: `2024${Math.floor(Math.random() * 10000000000)}BA`
        }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#1D7AD9]">
              {initialData ? "Edit Staff" : "Add Staff"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Staff ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Staff ID
                </label>
                <input
                  type="text"
                  value={formData.staffId}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="E.g Dr, Mr etc"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

               {/* Other Name */}
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Other Name
                </label>
                <input
                  type="text"
                  value={formData.otherName}
                  onChange={(e) =>
                    setFormData({ ...formData, otherName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Sex */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Sex
                </label>
                <input
                  type="text"
                  placeholder="Male" // Should ideally be a select
                  value={formData.sex}
                  onChange={(e) =>
                    setFormData({ ...formData, sex: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Highest Degree */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Highest Degree
                </label>
                <input
                  type="text"
                  placeholder="PhD"
                  value={formData.highestDegree}
                  onChange={(e) =>
                    setFormData({ ...formData, highestDegree: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  placeholder="COMPUTING" // from screenshot, strictly likely computing@example.com
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer text-slate-700"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Non-Academic">Non-Academic</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.41 0.589996L6 5.17L10.59 0.589996L12 2L6 8L0 2L1.41 0.589996Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Role */}
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Role
                </label>
                <input
                  type="text"
                  placeholder="ERO"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Professor"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5 text-sm font-bold text-white bg-[#1D7AD9] rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {initialData ? "Save Changes" : "Add Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
