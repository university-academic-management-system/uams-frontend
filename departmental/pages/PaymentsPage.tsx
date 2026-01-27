import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import PaymentSettings from "@/components/payments/SpltKeysConfig";
import { PaymentSplitKeysSection } from "@/components/payments/PaymentSplitKeysSection";
import { PageActions } from "@/components/payments/PageActions";
import { programsCoursesApi } from "@/api/programscourseapi";
import { ProgramTypeResponse } from "@/api/types";
import TabButton from "@/components/TabButton";
import { Layers } from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

interface Session {
  id: string;
  name: string;
  isActive: boolean;
}

export default function PaymentsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [programTypes, setProgramTypes] = useState<ProgramTypeResponse[]>([]);
  const [selectedProgramTypeId, setSelectedProgramTypeId] = useState<string>("");

  // ✅ Filter fee fetch based on selected program type
  useEffect(() => {
    if (!selectedProgramTypeId || !activeSessionId) return;

    const fetchFees = async () => {
      try {
        setLoading(true);
        // GET /department-annual-due/program-type/{programTypeId}
        const response = await axios.get(
          `${BASE_URL}/department-annual-due/program-type/${selectedProgramTypeId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (response.data.success && response.data.data.length > 0) {
          const feeData = response.data.data[0].fees; // Assuming we take the first matching record for this session/program
          setFees({
            departmentDues: feeData.departmentDues || "",
            accessFee: feeData.accessFee || "",
            idCardFee: feeData.idCardFee || "",
            transcriptFee: feeData.transcriptFee || "",
          });
        } else {
             // Reset if no data found
             setFees({
                departmentDues: "",
                accessFee: "",
                idCardFee: "",
                transcriptFee: "",
              });
        }
      } catch (error) {
        console.error("Failed to fetch fees:", error);
         // Reset on error (or show toast)
         setFees({
            departmentDues: "",
            accessFee: "",
            idCardFee: "",
            transcriptFee: "",
          });
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [selectedProgramTypeId, activeSessionId]);

  const [fees, setFees] = useState({
    departmentDues: "",
    accessFee: "",
    idCardFee: "",
    transcriptFee: "",
  });

  const [isSaving, setIsSaving] = useState(false);

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
        toast.error("Failed to fetch active session");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Fetch Program Types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await programsCoursesApi.getProgramTypes();
        setProgramTypes(types);
        if (types.length > 0) {
            setSelectedProgramTypeId(types[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch program types:", err);
      }
    };
    fetchTypes();
  }, []);
  const handleChange = (field: string, value: string) => {
    setFees((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!activeSessionId) {
      toast.error("No active session selected.");
      return;
    }

    if (!selectedProgramTypeId) {
        toast.error("No program type selected.");
        return;
      }
  

    const hasValue = Object.values(fees).some(
      (val) => val && val.trim() !== ""
    );

    if (!hasValue) {
      toast.error("Please enter at least one fee.");
      return;
    }

    setIsSaving(true);

    try {
      // PUT /department-annual-due/{programTypeId}
      await axios.put(
        `${BASE_URL}/department-annual-due/${selectedProgramTypeId}`,
        {
          programTypeId: selectedProgramTypeId,
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

      toast.success("Payment settings saved successfully.");
      
      // Optionally refresh fees here if needed, but we essentially just set them
    } catch (error: any) {
      console.error("Save Error:", error.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Failed to save payment settings");
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

          {/* PROGRAM TYPE TABS */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Layers size={18} className="text-blue-600"/> Program Levels
            </h2>
            <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-xl w-fit">
                {programTypes.map((type) => (
                    <TabButton 
                        key={type.id} 
                        active={selectedProgramTypeId === type.id} 
                        onClick={() => setSelectedProgramTypeId(type.id)} 
                        icon={null} 
                        label={type.name} 
                    />
                ))}
            </div>
            {programTypes.length === 0 && !loading && (
                <p className="text-sm text-slate-400 mt-2">No program types found. Fees will be applied generally if not selected.</p>
            )}
          </section>

          <PaymentSettings />

          <PaymentSplitKeysSection values={fees} onChange={handleChange} />



          <PageActions onSave={handleSave} isSaving={isSaving} />
        </div>
      </div>
    </div>
  );
}

