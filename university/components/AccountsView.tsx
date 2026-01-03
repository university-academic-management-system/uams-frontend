import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  X,
  ChevronLeft,
  Eye,
  Edit2,
  Trash2,
  ArrowLeft,
  Loader2,
  ChevronDown,
} from "lucide-react";
import api from "../api/axios"; // Ensure this points to your axios config

// --- Interfaces ---
interface Faculty {
  id: string; // UUID from backend
  name: string;
}

interface AccountRecord {
  code: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Not Active" | "Pending" | "Not Certified" | "Certified";
}

// --- Mock Data for UI ---
const initialAccountsData: AccountRecord[] = [
  {
    code: "UNI-001",
    role: "Department Admin",
    name: "Computer Science",
    email: "admin@tin.edu.ng",
    phone: "2348012345678",
    status: "Active",
  },
  {
    code: "UNI-002",
    role: "Faculty Admin",
    name: "Dr. Sarah Johnson",
    email: "sarah@test.com",
    phone: "08098765432",
    status: "Active",
  },
];

// --- Sub-Components ---
const StatusBadge = ({ status }: { status: AccountRecord["status"] }) => {
  const styles = {
    Active: "bg-[#4ade80] text-white",
    Certified: "bg-[#4ade80] text-white",
    "Not Active": "bg-[#94a3b8] text-white",
    "Not Certified": "bg-[#94a3b8] text-white",
    Pending: "bg-[#fbbf24] text-white",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold inline-block min-w-[90px] md:min-w-[100px] text-center ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const ToggleSwitch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked ? "bg-slate-900" : "bg-slate-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

// --- View: Individual Admin Profile ---
const AdminProfileView = ({
  admin,
  onBack,
}: {
  admin: AccountRecord;
  onBack: () => void;
}) => {
  const [permissions, setPermissions] = useState(Array(8).fill(true));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold text-sm mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Admins
      </button>

      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {admin.name}
          </h2>
          <p className="text-lg text-slate-400 font-medium underline underline-offset-4 decoration-slate-200">
            {admin.role}
          </p>
        </div>
        <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-full border-4 border-white shadow-inner flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-slate-200/50" />
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm space-y-12">
        <section className="space-y-8">
          <h3 className="text-xl font-bold text-slate-900">
            Admin Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 block">
                Name
              </label>
              <input
                type="text"
                defaultValue={admin.name}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-800 block">
                Official Email
              </label>
              <input
                type="email"
                defaultValue={admin.email}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h3 className="text-xl font-bold text-slate-900">
            Roles & Permission
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {permissions.map((isChecked, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-5 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm font-medium text-slate-700">
                  Create Programs
                </span>
                <ToggleSwitch checked={isChecked} onChange={() => {}} />
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end items-center gap-4 pt-6">
          <button
            onClick={onBack}
            className="px-10 py-3 border border-slate-400 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50"
          >
            Cancel
          </button>
          <button className="px-10 py-3 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold rounded-lg text-sm shadow-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Modal: Create Admin (Includes UUID Dropdown Fix) ---
const CreateAdminModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (record: AccountRecord) => void;
}) => {
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [adminType, setAdminType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [fetchingFacs, setFetchingFacs] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    facultyId: "",
  });

  useEffect(() => {
    const getFaculties = async () => {
      setFetchingFacs(true);
      try {
        const res = await api.get("/faculties"); // Replace with your actual endpoint
        setFaculties(res.data.data || []);
      } catch (err) {
        console.error("Could not load faculties", err);
      } finally {
        setFetchingFacs(false);
      }
    };
    getFaculties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (adminType === "Faculty Admin") {
        const response = await api.post(
          "/university-admin/faculty-admins",
          formData
        );
        const created = response.data.data.facultyAdmin;

        onSave({
          code: created.faculty.code || "N/A",
          role: "Faculty Admin",
          name: created.fullName,
          email: created.email,
          phone: formData.phone,
          status: "Active",
        });
        alert(`Admin created! Temp Password: ${created.tempPassword}`);
      } else {
        alert("Department Admin logic not implemented yet");
      }
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || "Failed to create"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="px-6 md:px-10 pt-6 md:pt-10 pb-4 flex items-center justify-between">
          <h3 className="text-[#1b75d0] font-bold text-lg md:text-xl">
            {step === "choose" ? "Choose Admin Type" : `Add ${adminType}`}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 md:px-10 pb-6 md:pb-10 overflow-y-auto">
          {step === "choose" ? (
            <div className="space-y-4 animate-in slide-in-from-bottom-4">
              <p className="text-slate-400 text-xs md:text-sm">
                Select the administrator account type
              </p>
              <button
                onClick={() => {
                  setAdminType("Department Admin");
                  setStep("form");
                }}
                className="w-full p-6 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-center gap-4 hover:border-blue-200 hover:bg-blue-50/50 group transition-all"
              >
                <Plus className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                <span className="text-slate-500 font-bold group-hover:text-slate-800">
                  Department Admin
                </span>
              </button>
              <button
                onClick={() => {
                  setAdminType("Faculty Admin");
                  setStep("form");
                }}
                className="w-full p-6 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center justify-center gap-4 hover:border-blue-200 hover:bg-blue-50/50 group transition-all"
              >
                <Plus className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                <span className="text-slate-500 font-bold group-hover:text-slate-800">
                  Faculty Admin
                </span>
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 animate-in slide-in-from-right-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 block">
                  Full Name *
                </label>
                <input
                  required
                  placeholder="Dr. Sarah Johnson"
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Official Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="sarah@test.com"
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Phone Number *
                  </label>
                  <input
                    required
                    placeholder="08098765432"
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm outline-none"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 block">
                  Assign Faculty *
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none appearance-none"
                    value={formData.facultyId}
                    onChange={(e) =>
                      setFormData({ ...formData, facultyId: e.target.value })
                    }
                  >
                    <option value="">
                      {fetchingFacs ? "Loading faculties..." : "Select Faculty"}
                    </option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("choose")}
                  className="px-8 py-2.5 border border-slate-400 rounded-md text-sm font-bold text-slate-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-[#1b75d0] text-white rounded-md text-sm font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Create Admin"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// --- View: Main Accounts Table ---
const AccountsView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] =
    useState<AccountRecord[]>(initialAccountsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<AccountRecord | null>(null);

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (viewingAdmin)
    return (
      <AdminProfileView
        admin={viewingAdmin}
        onBack={() => setViewingAdmin(null)}
      />
    );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Admin</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search accounts..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1b75d0] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md hover:bg-blue-700 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50/50">
              <tr className="border-b border-slate-100">
                <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                  Code
                </th>
                <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                  Role
                </th>
                <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                  Name
                </th>
                <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                  Email
                </th>
                <th className="p-6 text-slate-400 font-bold text-xs uppercase text-center">
                  Status
                </th>
                <th className="p-6 text-slate-400 font-bold text-xs uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAccounts.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-all">
                  <td className="p-6 text-xs font-black text-slate-800">
                    {row.code}
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-600">
                    {row.role}
                  </td>
                  <td className="p-6 text-xs font-bold text-slate-900">
                    {row.name}
                  </td>
                  <td className="p-6 text-xs text-slate-400">{row.email}</td>
                  <td className="p-6 text-center">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="p-6 relative">
                    <button
                      onClick={() =>
                        setActiveMenuIdx(activeMenuIdx === idx ? null : idx)
                      }
                      className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                    </button>
                    {activeMenuIdx === idx && (
                      <div className="absolute right-6 top-12 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <button
                          onClick={() => {
                            setViewingAdmin(row);
                            setActiveMenuIdx(null);
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50"
                        >
                          <Eye className="w-4 h-4 text-slate-400" /> View
                        </button>
                        <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 text-xs font-medium border-b border-slate-50">
                          <Edit2 className="w-4 h-4 text-slate-400" /> Edit
                        </button>
                        <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 text-red-500 text-xs font-medium">
                          <Trash2 className="w-4 h-4 text-red-400" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateAdminModal
          onClose={() => setIsModalOpen(false)}
          onSave={(nr) => {
            setAccounts([nr, ...accounts]);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AccountsView;

// import React, { useState } from "react";
// import {
//   Search,
//   Plus,
//   MoreHorizontal,
//   X,
//   ChevronLeft,
//   Eye,
//   Edit2,
//   Trash2,
//   ArrowLeft,
// } from "lucide-react";

// interface AccountRecord {
//   code: string;
//   role: string;
//   name: string;
//   email: string;
//   phone: string;
//   status: "Active" | "Not Active" | "Pending" | "Not Certified" | "Certified";
// }

// const initialAccountsData: AccountRecord[] = [
//   {
//     code: "UNI-001",
//     role: "Department Admin",
//     name: "Computer Science",
//     email: "admin@tin.edu.ng",
//     phone: "2348012345678",
//     status: "Active",
//   },
//   {
//     code: "UNI-002",
//     role: "Faculty Admin",
//     name: "Sciences",
//     email: "admin@tin.edu.ng",
//     phone: "2348012345678",
//     status: "Not Active",
//   },
//   {
//     code: "UNI-003",
//     role: "Department Admin",
//     name: "Animal and Env...",
//     email: "grace@gyu.edu.ng",
//     phone: "2348012345678",
//     status: "Active",
//   },
//   {
//     code: "UNI-004",
//     role: "Department Admin",
//     name: "Crop and Soil Sc...",
//     email: "htyyy@tin.edu.ng",
//     phone: "2348012345678",
//     status: "Not Active",
//   },
//   {
//     code: "UNI-005",
//     role: "Faculty Admin",
//     name: "Engineering",
//     email: "noes@edu.ng",
//     phone: "2348012345678",
//     status: "Active",
//   },
//   {
//     code: "UNI-006",
//     role: "Department Admin",
//     name: "Computer Science",
//     email: "shavel@tin.edu.ng",
//     phone: "2348012345678",
//     status: "Pending",
//   },
//   {
//     code: "UNI-007",
//     role: "Department Admin",
//     name: "Computer Science",
//     email: "leviloe@edu.ng",
//     phone: "2348012345678",
//     status: "Not Certified",
//   },
//   {
//     code: "UNI-008",
//     role: "Faculty Admin",
//     name: "Computer Science",
//     email: "jaysha@tin.edu.ng",
//     phone: "2348012345678",
//     status: "Certified",
//   },
//   {
//     code: "UNI-009",
//     role: "Faculty Admin",
//     name: "Computer Science",
//     email: "fredalo@.edu.ng",
//     phone: "2348012345678",
//     status: "Not Certified",
//   },
//   {
//     code: "UNI-010",
//     role: "Faculty Admin",
//     name: "Computer Science",
//     email: "shavel@tin.edu.ng",
//     phone: "shavel@tin.edu.ng",
//     status: "Certified",
//   },
//   {
//     code: "UNI-011",
//     role: "Faculty Admin",
//     name: "Computer Science",
//     email: "hope@tin.edu.ng",
//     phone: "hope@tin.edu.ng",
//     status: "Certified",
//   },
//   {
//     code: "UNI-012",
//     role: "Faculty Admin",
//     name: "Computer Science",
//     email: "saint@tin.edu.ng",
//     phone: "saint@tin.edu.ng",
//     status: "Certified",
//   },
// ];

// const StatusBadge = ({ status }: { status: AccountRecord["status"] }) => {
//   const styles = {
//     Active: "bg-[#4ade80] text-white",
//     Certified: "bg-[#4ade80] text-white",
//     "Not Active": "bg-[#94a3b8] text-white",
//     "Not Certified": "bg-[#94a3b8] text-white",
//     Pending: "bg-[#fbbf24] text-white",
//   };

//   return (
//     <span
//       className={`px-4 py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold inline-block min-w-[90px] md:min-w-[100px] text-center ${styles[status]}`}
//     >
//       {status}
//     </span>
//   );
// };

// const ToggleSwitch = ({
//   checked,
//   onChange,
// }: {
//   checked: boolean;
//   onChange: () => void;
// }) => (
//   <button
//     onClick={onChange}
//     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
//       checked ? "bg-slate-900" : "bg-slate-200"
//     }`}
//   >
//     <span
//       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//         checked ? "translate-x-6" : "translate-x-1"
//       }`}
//     />
//   </button>
// );

// const AdminProfileView = ({
//   admin,
//   onBack,
// }: {
//   admin: AccountRecord;
//   onBack: () => void;
// }) => {
//   const [permissions, setPermissions] = useState(Array(8).fill(true));

//   const togglePermission = (index: number) => {
//     const newPerms = [...permissions];
//     newPerms[index] = !newPerms[index];
//     setPermissions(newPerms);
//   };

//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
//       <button
//         onClick={onBack}
//         className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold text-sm mb-4"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         Back to Admins
//       </button>

//       {/* Profile Header Card */}
//       <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
//         <div className="text-center md:text-left">
//           <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
//             {admin.name}
//           </h2>
//           <p className="text-lg text-slate-400 font-medium underline underline-offset-4 decoration-slate-200">
//             {admin.role}
//           </p>
//         </div>
//         <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
//           <div className="w-full h-full rounded-full bg-slate-200/50" />
//         </div>
//       </div>

//       {/* Info and Permissions */}
//       <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm space-y-12">
//         <section className="space-y-8">
//           <h3 className="text-xl font-bold text-slate-900">
//             Admin Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
//             <div className="space-y-3">
//               <label className="text-sm font-bold text-slate-800 block">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 defaultValue={admin.name}
//                 className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
//                 placeholder="University of Port..."
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="text-sm font-bold text-slate-800 block">
//                 Admin Role
//               </label>
//               <input
//                 type="text"
//                 defaultValue={admin.role}
//                 className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
//                 placeholder="Select mode of delivery"
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="text-sm font-bold text-slate-800 block">
//                 Official Email
//               </label>
//               <input
//                 type="email"
//                 defaultValue={admin.email}
//                 className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
//                 placeholder="Enter address"
//               />
//             </div>
//             <div className="space-y-3">
//               <label className="text-sm font-bold text-slate-800 block">
//                 Phone Number
//               </label>
//               <input
//                 type="text"
//                 defaultValue={admin.phone}
//                 className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
//                 placeholder="Enter address"
//               />
//             </div>
//           </div>
//         </section>

//         <section className="space-y-8">
//           <h3 className="text-xl font-bold text-slate-900">
//             Roles & Permission
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
//             {permissions.map((isChecked, i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between py-5 border-b border-slate-100 last:border-0 md:[&:nth-child(7)]:border-0 md:[&:nth-child(8)]:border-0"
//               >
//                 <span className="text-sm font-medium text-slate-700">
//                   Create Programs
//                 </span>
//                 <ToggleSwitch
//                   checked={isChecked}
//                   onChange={() => togglePermission(i)}
//                 />
//               </div>
//             ))}
//           </div>
//         </section>

//         <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6">
//           <button
//             onClick={onBack}
//             className="w-full sm:w-auto px-10 py-3 border border-slate-400 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm"
//           >
//             Cancel
//           </button>
//           <button className="w-full sm:w-auto px-10 py-3 bg-[#22c55e] hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm transition-all text-sm">
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ActionMenu = ({ onView }: { onView: () => void }) => {
//   return (
//     <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
//       <button
//         onClick={onView}
//         className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 transition-colors border-b border-slate-50 text-left"
//       >
//         <Eye className="w-4 h-4 text-slate-400" />
//         <span className="text-xs font-medium">View</span>
//       </button>
//       <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 text-slate-600 transition-colors border-b border-slate-50 text-left">
//         <Edit2 className="w-4 h-4 text-slate-400" />
//         <span className="text-xs font-medium">Edit</span>
//       </button>
//       <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 text-red-500 transition-colors text-left">
//         <Trash2 className="w-4 h-4 text-slate-400" />
//         <span className="text-xs font-medium">Delete</span>
//       </button>
//     </div>
//   );
// };

// const CreateAdminModal = ({
//   onClose,
//   onSave,
// }: {
//   onClose: () => void;
//   onSave: (record: AccountRecord) => void;
// }) => {
//   const [step, setStep] = useState<"choose" | "form">("choose");
//   const [adminType, setAdminType] = useState<string>("");
//   const [formData, setFormData] = useState({
//     entityName: "",
//     email: "",
//     parentFaculty: "",
//   });

//   const handleSelectType = (type: string) => {
//     setAdminType(type);
//     setStep("form");
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newRecord: AccountRecord = {
//       code: `UNI-0${Math.floor(Math.random() * 900) + 100}`,
//       role: adminType,
//       name: formData.entityName,
//       email: formData.email,
//       phone: "+2348012345678",
//       status: "Pending",
//     };
//     onSave(newRecord);
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl md:rounded-[1rem] w-full max-w-xl relative shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
//         <div className="px-6 md:px-10 pt-6 md:pt-10 pb-4 flex items-center justify-between shrink-0">
//           <h3 className="text-[#1b75d0] font-bold text-lg md:text-xl">
//             {step === "choose" ? "Choose Admin Type" : `Add ${adminType}`}
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-1.5 text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="px-6 md:px-10 pb-6 md:pb-10 overflow-y-auto">
//           {step === "choose" ? (
//             <div className="animate-in slide-in-from-bottom-4 duration-300">
//               <p className="text-slate-400 text-xs md:text-sm mb-6 md:mb-10">
//                 Select the type of administrator account you wish to create
//               </p>

//               <div className="space-y-3 md:space-y-4">
//                 <button
//                   onClick={() => handleSelectType("Department Admin")}
//                   className="w-full p-6 md:p-8 border border-slate-100 bg-slate-50/50 rounded-xl md:rounded-2xl flex items-center justify-center gap-4 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
//                 >
//                   <Plus className="w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
//                   <span className="text-slate-500 font-bold text-base md:text-lg group-hover:text-slate-800 transition-colors">
//                     Department Admin
//                   </span>
//                 </button>

//                 <button
//                   onClick={() => handleSelectType("Faculty Admin")}
//                   className="w-full p-6 md:p-8 border border-slate-100 bg-slate-50/50 rounded-xl md:rounded-2xl flex items-center justify-center gap-4 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
//                 >
//                   <Plus className="w-5 h-5 md:w-6 md:h-6 text-slate-300 group-hover:text-blue-500 transition-colors" />
//                   <span className="text-slate-500 font-bold text-base md:text-lg group-hover:text-slate-800 transition-colors">
//                     Faculty Admin
//                   </span>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="animate-in slide-in-from-right-4 duration-300">
//               <form
//                 onSubmit={handleSubmit}
//                 className="space-y-5 md:space-y-6 mt-2 md:mt-4"
//               >
//                 <div className="space-y-1 md:space-y-2">
//                   <label className="text-xs md:text-sm font-bold text-slate-800">
//                     {adminType === "Department Admin"
//                       ? "Name of Department"
//                       : "Name of Faculty"}{" "}
//                     <span className="text-orange-600">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="Computer Science"
//                     className="w-full px-4 py-2 md:py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
//                     value={formData.entityName}
//                     onChange={(e) =>
//                       setFormData({ ...formData, entityName: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div className="space-y-1 md:space-y-2">
//                   <label className="text-xs md:text-sm font-bold text-slate-800">
//                     Official Email <span className="text-orange-600">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     placeholder="admin@university.ng"
//                     className="w-full px-4 py-2 md:py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                   />
//                 </div>

//                 <div className="space-y-1 md:space-y-2">
//                   <label className="text-xs md:text-sm font-bold text-slate-800">
//                     Admin Role <span className="text-orange-600">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={adminType}
//                     className="w-full px-4 py-2 md:py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-400 focus:outline-none"
//                   />
//                 </div>

//                 <div className="space-y-1 md:space-y-2">
//                   <label className="text-xs md:text-sm font-bold text-slate-800">
//                     Parent Faculty
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Sciences"
//                     className="w-full px-4 py-2 md:py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300"
//                     value={formData.parentFaculty}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         parentFaculty: e.target.value,
//                       })
//                     }
//                   />
//                 </div>

//                 <p className="text-[10px] md:text-[11px] text-slate-900 font-bold">
//                   * Required fields. Credentials will be sent automatically.
//                 </p>

//                 <div className="flex flex-col-reverse xs:flex-row justify-end items-stretch xs:items-center gap-3 md:gap-4 pt-2 md:pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setStep("choose")}
//                     className="px-6 md:px-8 py-2 md:py-2.5 border border-slate-400 rounded-md text-slate-700 font-bold hover:bg-slate-50 transition-all text-xs md:text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-6 md:px-8 py-2 md:py-2.5 bg-[#1b75d0] hover:bg-blue-700 text-white font-bold rounded-md shadow-sm transition-all text-xs md:text-sm"
//                   >
//                     Create Admin
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const AccountsView: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [accounts, setAccounts] =
//     useState<AccountRecord[]>(initialAccountsData);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null);
//   const [viewingAdmin, setViewingAdmin] = useState<AccountRecord | null>(null);

//   const filteredAccounts = accounts.filter(
//     (acc) =>
//       acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       acc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       acc.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSaveAdmin = (newRecord: AccountRecord) => {
//     setAccounts([newRecord, ...accounts]);
//     setIsModalOpen(false);
//   };

//   if (viewingAdmin) {
//     return (
//       <AdminProfileView
//         admin={viewingAdmin}
//         onBack={() => setViewingAdmin(null)}
//       />
//     );
//   }

//   return (
//     <div className="space-y-4 md:space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h2 className="text-xl md:text-2xl font-bold text-slate-800">Admin</h2>
//         <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 md:gap-4 w-full sm:w-auto">
//           <div className="relative w-full xs:w-64 sm:w-80">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search admin accounts..."
//               className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-300"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-[#1b75d0] hover:bg-blue-700 text-white px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
//           >
//             <Plus className="w-4 h-4 shrink-0" />
//             <span className="whitespace-nowrap">Create Admin</span>
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
//         <div className="overflow-x-auto overflow-visible pb-10 -mb-10">
//           <table className="w-full text-left border-collapse min-w-[900px]">
//             <thead>
//               <tr className="border-b border-slate-100 bg-slate-50/50">
//                 <th className="p-4 md:p-6 w-12 text-center">
//                   <input
//                     type="checkbox"
//                     className="rounded border-slate-100 bg-white accent-blue-600 w-4 h-4 cursor-pointer transition-colors outline-none ring-0"
//                   />
//                 </th>
//                 <th className="p-4 md:p-6 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
//                   Code
//                 </th>
//                 <th className="p-4 md:p-6 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
//                   Admin Role
//                 </th>
//                 <th className="p-4 md:p-6 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
//                   Name
//                 </th>
//                 <th className="p-4 md:p-6 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
//                   Email Address
//                 </th>
//                 <th className="p-4 md:p-6 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
//                   Phone No
//                 </th>
//                 <th className="p-4 md:p-6 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest text-center whitespace-nowrap">
//                   Status
//                 </th>
//                 <th className="p-4 md:p-6 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {filteredAccounts.map((row, idx) => (
//                 <tr
//                   key={idx}
//                   className="hover:bg-slate-50/80 transition-all duration-200 group relative"
//                 >
//                   <td className="p-4 md:p-6 text-center">
//                     <input
//                       type="checkbox"
//                       className="rounded border-slate-100 bg-white accent-blue-600 w-4 h-4 cursor-pointer transition-colors outline-none ring-0"
//                     />
//                   </td>
//                   <td className="p-4 md:p-6 text-[10px] md:text-xs font-black text-slate-800 tracking-tight whitespace-nowrap">
//                     {row.code}
//                   </td>
//                   <td className="p-4 md:p-6 text-[10px] md:text-xs font-bold text-slate-600 whitespace-nowrap">
//                     {row.role}
//                   </td>
//                   <td className="p-4 md:p-6 text-[10px] md:text-xs font-bold text-slate-900 whitespace-nowrap">
//                     {row.name}
//                   </td>
//                   <td className="p-4 md:p-6 text-[10px] md:text-xs font-medium text-slate-400 whitespace-nowrap">
//                     {row.email}
//                   </td>
//                   <td className="p-4 md:p-6 text-[10px] md:text-xs font-medium text-slate-400 whitespace-nowrap">
//                     {row.phone}
//                   </td>
//                   <td className="p-4 md:p-6 text-center whitespace-nowrap">
//                     <StatusBadge status={row.status} />
//                   </td>
//                   <td className="p-4 md:p-6 relative">
//                     <button
//                       onClick={() =>
//                         setActiveMenuIdx(activeMenuIdx === idx ? null : idx)
//                       }
//                       className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-800"
//                     >
//                       <MoreHorizontal className="w-5 h-5" />
//                     </button>
//                     {activeMenuIdx === idx && (
//                       <ActionMenu
//                         onView={() => {
//                           setViewingAdmin(row);
//                           setActiveMenuIdx(null);
//                         }}
//                       />
//                     )}
//                   </td>
//                 </tr>
//               ))}
//               {filteredAccounts.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="p-20 text-center text-slate-400 font-medium italic"
//                   >
//                     No matching records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {isModalOpen && (
//         <CreateAdminModal
//           onClose={() => setIsModalOpen(false)}
//           onSave={handleSaveAdmin}
//         />
//       )}
//     </div>
//   );
// };

// export default AccountsView;
