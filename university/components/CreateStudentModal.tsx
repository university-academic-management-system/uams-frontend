import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import adminApi from "../api/AdminApi";
import studentApi from "../api/StudentApi";
import DropdownField from "./DropdownFields";
import NotificationBanner from "./NotificationBanner";

interface StudentForm {
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  programId: string;
  levelId: string;
}

const CreateStudentModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: any) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notification, setNotification] = useState<any>(null);

  const [metadata, setMetadata] = useState({
    depts: [],
    programs: [],
    levels: [],
  });

  const [formData, setFormData] = useState<StudentForm>({
    studentId: "",
    fullName: "",
    email: "",
    phone: "",
    departmentId: "",
    programId: "",
    levelId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setFetching(true);
        const [orgs, progs, levels] = await Promise.all([
          adminApi.get("/university-admin/sub-organizations"),
          adminApi.get("/program"),
          adminApi.get("/accademics/levels"),
        ]);

        setMetadata({
          depts: orgs.data.filter((o: any) => o.type === "DEPARTMENT"),
          programs: progs.data,
          levels: levels.data,
        });
      } catch {
        setNotification({ type: "error", message: "Failed to load data" });
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const empty = Object.values(formData).some(
      (v) => typeof v === "string" && !v.trim()
    );

    if (empty) {
      setNotification({ type: "error", message: "All fields are required" });
      return;
    }

    try {
      setLoading(true);
      const res = await studentApi.post("/university-admin/students", formData);
      setNotification({ type: "success", message: "Student created" });
      setTimeout(() => {
        onSave(res.data);
        onClose();
      }, 1000);
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.response?.data?.message || "Failed to create student",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-blue-600 font-semibold text-lg">Add Student</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 py-6 overflow-y-auto">
          {notification && (
            <div className="mb-4">
              <NotificationBanner
                {...notification}
                onClear={() => setNotification(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Student ID */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  placeholder="MAT/2025/001"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Chinedu Okeke"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email (full width) */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="student@university.edu.ng"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="08012345678"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Department */}
              <DropdownField
                label="Department"
                loading={fetching}
                value={formData.departmentId}
                options={metadata.depts.map((d: any) => ({
                  label: d.name,
                  value: d.id,
                }))}
                onChange={(v) => setFormData({ ...formData, departmentId: v })}
              />

              {/* Program */}
              <DropdownField
                label="Program"
                loading={fetching}
                value={formData.programId}
                options={metadata.programs.map((p: any) => ({
                  label: p.name,
                  value: p.id,
                }))}
                onChange={(v) => setFormData({ ...formData, programId: v })}
              />

              {/* Level */}
              <DropdownField
                label="Level"
                loading={fetching}
                value={formData.levelId}
                options={metadata.levels.map((l: any) => ({
                  label: l.name,
                  value: l.id,
                }))}
                onChange={(v) => setFormData({ ...formData, levelId: v })}
              />
            </div>

            {/* Footer note */}
            <p className="text-xs text-gray-500">
              * Required fields. Student account will be created immediately.
            </p>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CreateStudentModal;
