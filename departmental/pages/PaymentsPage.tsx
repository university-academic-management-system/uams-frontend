import { useState, useEffect } from "react";
import axios from "axios";
import PaymentSettings from "@/components/payments/SpltKeysConfig";
import { PaymentSplitKeysSection } from "@/components/payments/PaymentSplitKeysSection";
import { PageActions } from "@/components/payments/PageActions";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

interface Session {
  id: string;
  name: string;
  isActive: boolean;
}

export default function PaymentsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [fees, setFees] = useState({
    departmentDues: "",
    accessFee: "",
    idCardFee: "",
    transcriptFee: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* ============================
     FETCH & FILTER ACTIVE SESSION
     ============================ */
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/department-admins/department-sessions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const raw = response.data.session;
        const sessionArray: Session[] = Array.isArray(raw)
          ? raw
          : raw
          ? [raw]
          : [];

        // More forgiving filter
        const activeSessions = sessionArray.filter((s) => s.isActive);

        setSessions(activeSessions);

        if (activeSessions.length > 0) {
          setActiveSessionId(activeSessions[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setStatus({
          type: "error",
          message: "Failed to fetch active session",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);
  const handleChange = (field: string, value: string) => {
    setFees((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!activeSessionId) {
      setStatus({ type: "error", message: "No active session selected." });
      return;
    }

    const hasValue = Object.values(fees).some(
      (val) => val && val.trim() !== ""
    );

    if (!hasValue) {
      setStatus({
        type: "error",
        message: "Please enter at least one fee.",
      });
      return;
    }

    setIsSaving(true);
    setStatus(null);

    try {
      await axios.post(
        `${BASE_URL}/department-annual-due`,
        {
          sessionId: activeSessionId,
          departmentDues: Number(fees.departmentDues),
          accessFee: Number(fees.accessFee),
          idCardFee: Number(fees.idCardFee),
          transcriptFee: Number(fees.transcriptFee),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStatus({
        type: "success",
        message: "Payment settings saved successfully.",
      });

      setFees({
        departmentDues: "",
        accessFee: "",
        idCardFee: "",
        transcriptFee: "",
      });
    } catch (error: any) {
      console.error("Save Error:", error.response?.data || error.message);
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message || "Failed to save payment settings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto py-10 px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Configuration
          </h1>
          <p className="text-gray-500 mt-2">
            Manage fees and split keys for your department.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
          {/* SESSION SELECTOR */}
          <section className="mb-10 pb-8 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Active Academic Session
            </label>

            <div className="relative max-w-md">
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
                value={activeSessionId}
                onChange={(e) => setActiveSessionId(e.target.value)}
                disabled={loading}
              >
                {loading && <option>Loading sessions...</option>}

                {!loading && sessions.length === 0 && (
                  <option>No active session found</option>
                )}

                {!loading &&
                  sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.name}
                    </option>
                  ))}
              </select>
            </div>
          </section>

          <PaymentSettings />

          <PaymentSplitKeysSection values={fees} onChange={handleChange} />

          {status && (
            <div
              className={`mb-4 p-3 rounded ${
                status.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status.message}
            </div>
          )}

          <PageActions onSave={handleSave} isSaving={isSaving} />
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import axios from "axios";
// import PaymentSettings from "@/components/payments/SpltKeysConfig";
// // import { GlobalSettingsSection } from "@/components/payments/GlobalSettingsSection";
// import { PaymentSplitKeysSection } from "@/components/payments/PaymentSplitKeysSection";
// import { PageActions } from "@/components/payments/PageActions";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export default function PaymentsPage() {
//   const [activeSession, setActiveSession] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const [fees, setFees] = useState({
//     departmentDues: "",
//     accessFee: "",
//     idCardFee: "",
//     transcriptFee: "",
//   });

//   const [isSaving, setIsSaving] = useState(false);
//   const [status, setStatus] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);

//   // Fetch the active session
//   useEffect(() => {
//     const fetchActiveSession = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/department-admins/department-sessions`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         setActiveSession(response.data.session);
//       } catch (error) {
//         console.error("Failed to fetch session:", error);
//         setStatus({ type: "error", message: "Failed to fetch session" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActiveSession();
//   }, []);

//   const handleChange = (field: string, value: string) => {
//     setFees((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     if (!activeSession?.id) {
//       setStatus({ type: "error", message: "No active session selected." });
//       return;
//     }

//     // Validation: at least one field must have a value
//     const hasValue = Object.values(fees).some(
//       (val) => val && val.trim() !== ""
//     );
//     if (!hasValue) {
//       setStatus({ type: "error", message: "Please enter at least one fee." });
//       return;
//     }

//     setIsSaving(true);
//     setStatus(null);

//     try {
//       await axios.post(
//         `${BASE_URL}/department-annual-due`,
//         {
//           sessionId: activeSession.id,
//           departmentDues: Number(fees.departmentDues),
//           accessFee: Number(fees.accessFee),
//           idCardFee: Number(fees.idCardFee),
//           transcriptFee: Number(fees.transcriptFee),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setStatus({
//         type: "success",
//         message: "Payment settings saved successfully.",
//       });
//       setFees({
//         departmentDues: "",
//         accessFee: "",
//         idCardFee: "",
//         transcriptFee: "",
//       });
//     } catch (error: any) {
//       console.error("Save Error:", error.response?.data || error.message);
//       setStatus({
//         type: "error",
//         message:
//           error?.response?.data?.message || "Failed to save payment settings",
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC]">
//       <div className="max-w-6xl mx-auto py-10 px-8">
//         <header className="mb-10">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Payment Configuration
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Manage fees and split keys for your department.
//           </p>
//         </header>

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
//           {/* Session Selector */}
//           <section className="mb-10 pb-8 border-b border-gray-200">
//             <label className="block text-sm font-semibold text-gray-700 mb-3">
//               Active Academic Session
//             </label>
//             <div className="relative max-w-md">
//               <select
//                 className="w-full appearance-none px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition"
//                 value={activeSession?.id || ""}
//                 onChange={(e) =>
//                   setActiveSession({ ...activeSession, id: e.target.value })
//                 }
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <option>Loading sessions...</option>
//                 ) : activeSession ? (
//                   <option value={activeSession.id}>{activeSession.name}</option>
//                 ) : (
//                   <option value="">No active session found</option>
//                 )}
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
//                   <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//                 </svg>
//               </div>
//             </div>
//           </section>

//           <PaymentSettings />

//           <PaymentSplitKeysSection values={fees} onChange={handleChange} />

//           {/* Status Notification */}
//           {status && (
//             <div
//               className={`mb-4 p-3 rounded ${
//                 status.type === "success"
//                   ? "bg-green-100 text-green-800"
//                   : "bg-red-100 text-red-800"
//               }`}
//             >
//               {status.message}
//             </div>
//           )}

//           <PageActions onSave={handleSave} isSaving={isSaving} />
//         </div>
//       </div>
//     </div>
//   );
// }
