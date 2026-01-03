import { useState, useEffect, FormEvent } from "react";

import {
  X,
  Plus,
  Loader2,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import adminApi from "../api/AdminApi";
import { AccountRecord, SubOrganization } from "./types";

export const CreateAdminModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (record: AccountRecord) => void;
}) => {
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [adminType, setAdminType] = useState<
    "Faculty Admin" | "Department Admin" | ""
  >("");
  const [loading, setLoading] = useState(false);

  const [subOrgs, setSubOrgs] = useState<SubOrganization[]>([]);
  const [fetchingData, setFetchingData] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    orgId: "",
  });

  /* ------------------ auto clear notifications ------------------ */
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  /* ------------------ load departments / faculties ------------------ */
  useEffect(() => {
    const loadSubOrgs = async () => {
      setFetchingData(true);
      try {
        const res = await adminApi.get("/university-admin/sub-organizations");
        setSubOrgs(res.data || []);
      } catch {
        setNotification({
          type: "error",
          message: "Failed to load organization list",
        });
      } finally {
        setFetchingData(false);
      }
    };

    loadSubOrgs();
  }, []);

  const filteredOrgs = subOrgs.filter((o) =>
    adminType === "Faculty Admin"
      ? o.type === "FACULTY"
      : o.type === "DEPARTMENT"
  );

  /* ------------------ submit handler ------------------ */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(null);

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.orgId
    ) {
      setNotification({
        type: "error",
        message: "All fields are required.",
      });
      return;
    }

    setLoading(true);

    const isFaculty = adminType === "Faculty Admin";

    const endpoint = isFaculty
      ? "/university-admin/faculty-admins"
      : "/university-admin/department-admins";

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      ...(isFaculty
        ? { facultyId: formData.orgId }
        : { departmentId: formData.orgId }),
    };

    try {
      const res = await adminApi.post(endpoint, payload);

      const created =
        res.data?.data?.facultyAdmin ||
        res.data?.data?.departmentAdmin ||
        res.data;

      setNotification({
        type: "success",
        message: `${adminType} created successfully`,
      });

      setTimeout(() => {
        onSave({
          code: created?.faculty?.code || created?.department?.code || "N/A",
          role: adminType,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          status: "Active",
        });
        onClose();
      }, 1200);
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.response?.data?.message || `Failed to create ${adminType}`,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ render ------------------ */
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in duration-200">
        {notification && (
          <div
            className={`absolute top-0 inset-x-0 z-50 p-4 flex items-center gap-3 ${
              notification.type === "success" ? "bg-emerald-500" : "bg-red-500"
            } text-white`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm font-bold">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="px-10 pt-10 pb-4 flex items-center justify-between">
          <h3 className="text-[#1b75d0] font-bold text-xl">
            {step === "choose" ? "Choose Admin Type" : `Add ${adminType}`}
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="px-10 pb-10 overflow-y-auto">
          {step === "choose" ? (
            <div className="space-y-4">
              {["Department Admin", "Faculty Admin"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setAdminType(type as any);
                    setStep("form");
                  }}
                  className="w-full p-6 border rounded-xl flex items-center gap-4 hover:bg-blue-50"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-bold">{type}</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                className="w-full px-4 py-2.5 border rounded-xl"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="px-4 py-2.5 border rounded-xl"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  className="px-4 py-2.5 border rounded-xl"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="relative">
                <select
                  className="w-full px-4 py-2.5 border rounded-xl appearance-none"
                  value={formData.orgId}
                  onChange={(e) =>
                    setFormData({ ...formData, orgId: e.target.value })
                  }
                >
                  <option value="">
                    {fetchingData
                      ? "Loading..."
                      : `Select ${
                          adminType === "Faculty Admin"
                            ? "Faculty"
                            : "Department"
                        }`}
                  </option>
                  {filteredOrgs.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep("choose")}
                  className="px-6 py-2 border rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#1b75d0] text-white rounded-xl flex items-center gap-2"
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

// import React, { useState, useEffect } from "react";
// import {
//   X,
//   Plus,
//   Loader2,
//   ChevronDown,
//   CheckCircle2,
//   AlertCircle,
// } from "lucide-react";
// import api from "../api/axios";
// import { AccountRecord, SubOrganization } from "./types";

// export const CreateAdminModal = ({
//   onClose,
//   onSave,
// }: {
//   onClose: () => void;
//   onSave: (record: AccountRecord) => void;
// }) => {
//   const [step, setStep] = useState<"choose" | "form">("choose");
//   const [adminType, setAdminType] = useState<
//     "Faculty Admin" | "Department Admin" | ""
//   >("");
//   const [loading, setLoading] = useState(false);

//   const [subOrgs, setSubOrgs] = useState<SubOrganization[]>([]);
//   const [fetchingData, setFetchingData] = useState(false);
//   const [notification, setNotification] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     orgId: "",
//   });

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   useEffect(() => {
//     const getSubOrgs = async () => {
//       setFetchingData(true);
//       try {
//         const res = await api.get("/university-admin/sub-organizations");
//         setSubOrgs(res.data || []);
//       } catch (err) {
//         setNotification({
//           type: "error",
//           message: "Failed to load organization list",
//         });
//       } finally {
//         setFetchingData(false);
//       }
//     };
//     getSubOrgs();
//   }, []);

//   const filteredOrgs = subOrgs.filter((item) =>
//     adminType === "Faculty Admin"
//       ? item.type === "FACULTY"
//       : item.type === "DEPARTMENT"
//   );

//   // --- VALIDATION LOGIC ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setNotification(null);

//     // 1. Check if all fields have values (trimmed of whitespace)
//     if (
//       !formData.fullName.trim() ||
//       !formData.email.trim() ||
//       !formData.phone.trim() ||
//       !formData.orgId
//     ) {
//       setNotification({
//         type: "error",
//         message: "All fields are required. Please fill in all information.",
//       });
//       return;
//     }

//     setLoading(true);
//     const isFaculty = adminType === "Faculty Admin";
//     const endpoint = isFaculty
//       ? "/university-admin/faculty-admins"
//       : "/university-admin/department-admins";

//     const payload = {
//       fullName: formData.fullName.trim(),
//       email: formData.email.trim(),
//       phone: formData.phone.trim(),
//       [isFaculty ? "facultyId" : "departmentId"]: formData.orgId,
//     };

//     try {
//       const response = await api.post(endpoint, payload);
//       const created =
//         response.data?.data?.facultyAdmin ||
//         response.data?.data?.departmentAdmin ||
//         response.data;

//       setNotification({
//         type: "success",
//         message: `${adminType} created successfully!`,
//       });

//       setTimeout(() => {
//         onSave({
//           code: created.faculty?.code || created.department?.code || "N/A",
//           role: adminType,
//           name: formData.fullName,
//           email: formData.email,
//           phone: formData.phone,
//           status: "Active",
//         });
//         onClose();
//       }, 1500);
//     } catch (error: any) {
//       setNotification({
//         type: "error",
//         message:
//           error.response?.data?.message || `Failed to create ${adminType}`,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in duration-200">
//         {/* Validation/API Notification Banner */}
//         {notification && (
//           <div
//             className={`absolute top-0 left-0 right-0 z-50 p-4 flex items-center gap-3 animate-in slide-in-from-top duration-300 ${
//               notification.type === "success"
//                 ? "bg-emerald-500 text-white"
//                 : "bg-red-500 text-white"
//             }`}
//           >
//             {notification.type === "success" ? (
//               <CheckCircle2 className="w-5 h-5" />
//             ) : (
//               <AlertCircle className="w-5 h-5" />
//             )}
//             <p className="text-sm font-bold">{notification.message}</p>
//             <button
//               onClick={() => setNotification(null)}
//               className="ml-auto opacity-70 hover:opacity-100"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         )}

//         <div className="px-10 pt-10 pb-4 flex items-center justify-between">
//           <h3 className="text-[#1b75d0] font-bold text-xl">
//             {step === "choose" ? "Choose Admin Type" : `Add ${adminType}`}
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-slate-500" />
//           </button>
//         </div>

//         <div className="px-10 pb-10 overflow-y-auto">
//           {step === "choose" ? (
//             <div className="space-y-4">
//               <p className="text-slate-400 text-sm mb-2">
//                 Select the administrator account type
//               </p>
//               {["Department Admin", "Faculty Admin"].map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => {
//                     setAdminType(type as any);
//                     setStep("form");
//                   }}
//                   className="w-full p-6 border border-slate-100 bg-slate-50/50 rounded-xl flex items-center gap-4 hover:border-blue-200 hover:bg-blue-50/50 group transition-all"
//                 >
//                   <Plus className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
//                   <span className="text-slate-500 font-bold group-hover:text-slate-800">
//                     {type}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5"
//               noValidate={false}
//             >
//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-slate-800">
//                   Full Name *
//                 </label>
//                 <input
//                   required
//                   className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10"
//                   value={formData.fullName}
//                   onChange={(e) =>
//                     setFormData({ ...formData, fullName: e.target.value })
//                   }
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-slate-800">
//                     Email *
//                   </label>
//                   <input
//                     required
//                     type="email"
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-slate-800">
//                     Phone *
//                   </label>
//                   <input
//                     required
//                     className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none"
//                     value={formData.phone}
//                     onChange={(e) =>
//                       setFormData({ ...formData, phone: e.target.value })
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-slate-800">
//                   Assign{" "}
//                   {adminType === "Faculty Admin" ? "Faculty" : "Department"} *
//                 </label>
//                 <div className="relative">
//                   <select
//                     required
//                     className={`w-full px-4 py-2.5 border rounded-xl outline-none appearance-none bg-white text-sm ${
//                       !formData.orgId
//                         ? "border-slate-200"
//                         : "border-[#1b75d0]/30"
//                     }`}
//                     value={formData.orgId}
//                     onChange={(e) =>
//                       setFormData({ ...formData, orgId: e.target.value })
//                     }
//                   >
//                     <option value="">
//                       {fetchingData
//                         ? "Loading..."
//                         : `Select ${
//                             adminType === "Faculty Admin"
//                               ? "Faculty"
//                               : "Department"
//                           }`}
//                     </option>
//                     {filteredOrgs.map((f) => (
//                       <option key={f.id} value={f.id}>
//                         {f.name} ({f.code})
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setStep("choose");
//                     setNotification(null);
//                   }}
//                   className="px-8 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-slate-600"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-8 py-2.5 bg-[#1b75d0] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all"
//                 >
//                   {loading ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     "Create Admin"
//                   )}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
