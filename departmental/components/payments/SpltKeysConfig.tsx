"use client";

import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import api from "@/api/axios";

/**
 * Frontend field → backend payment_type mapping
 */
const PAYMENT_TYPE_MAP: Record<string, string> = {
  annual_access_fee: "annual_access_fee",
  id_card_payment: "id_card_fee",
  transcript_fee: "transcript_fee",
};

type SplitsState = {
  annual_access_fee: string;
  id_card_payment: string;
  transcript_fee: string;
};

const INITIAL_SPLITS: SplitsState = {
  annual_access_fee: "",
  id_card_payment: "",
  transcript_fee: "",
};

const SplitKeysConfig = () => {
  const [splits, setSplits] = useState<SplitsState>(INITIAL_SPLITS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * 🔹 Fetch existing payment splits and populate inputs
   */
  useEffect(() => {
    const fetchPaymentSplits = async () => {
      try {
        const { data } = await api.get("/university-admin/payment-splits");

        const populatedSplits: SplitsState = { ...INITIAL_SPLITS };

        data.forEach((item: any) => {
          const frontendKey = Object.keys(PAYMENT_TYPE_MAP).find(
            (key) => PAYMENT_TYPE_MAP[key] === item.payment_type,
          );

          if (frontendKey && item.split_code) {
            populatedSplits[frontendKey as keyof SplitsState] = item.split_code;
          }
        });

        setSplits(populatedSplits);
      } catch (err) {
        console.error("Failed to fetch payment splits:", err);
      }
    };

    fetchPaymentSplits();
  }, []);

  const handleInputChange = (key: keyof SplitsState, value: string) => {
    setSplits((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSplits(INITIAL_SPLITS);
  };

  /**
   * 🔹 Save split codes
   */
  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const filledEntries = Object.entries(splits).filter(
      ([_, value]) => value.trim() !== "",
    );

    if (filledEntries.length === 0) {
      setError("Please enter at least one split key.");
      return;
    }

    try {
      setLoading(true);

      await Promise.all(
        filledEntries.map(([key, splitCode]) =>
          api.post("/university-admin/payment-splits", {
            payment_type: PAYMENT_TYPE_MAP[key],
            split_code: splitCode,
          }),
        ),
      );

      setSuccess("Payment split keys saved successfully.");
    } catch (err: any) {
      console.error("Save failed:", err);
      setError(
        err?.response?.data?.message || "Failed to save payment split keys.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex">
      <div className="w-full max-w-2xl bg-white">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Split Key Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure Paystack split keys for university payments
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded">
            {success}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-8">
          <SplitInput
            label="Annual Access Fee"
            placeholder="SPL_xxxxxxxxx"
            value={splits.annual_access_fee}
            onChange={(val) => handleInputChange("annual_access_fee", val)}
          />

          <SplitInput
            label="ID Card Fee"
            placeholder="SPL_xxxxxxxxx"
            value={splits.id_card_payment}
            onChange={(val) => handleInputChange("id_card_payment", val)}
          />

          <SplitInput
            label="Transcript Fee"
            placeholder="SPL_xxxxxxxxx"
            value={splits.transcript_fee}
            onChange={(val) => handleInputChange("transcript_fee", val)}
          />
        </div>

        {/* Action Button */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`py-3 px-6 rounded-md text-white font-medium flex items-center gap-2 transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1D75D3] hover:bg-blue-700"
              }`}
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface SplitInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}

const SplitInput = ({
  label,
  placeholder,
  value,
  onChange,
}: SplitInputProps) => (
  <div className="flex flex-col gap-2 text-left">
    <label className="text-[15px] font-medium text-gray-700">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-[#1D75D3] outline-none transition-all placeholder:text-gray-300"
    />
  </div>
);

export default SplitKeysConfig;

// "use client";

// import React, { useState } from "react";
// import { Save } from "lucide-react";
// import api from "@/api/axios"; // ✅ USE YOUR AXIOS INSTANCE

// /**
//  * Frontend field → backend payment_type mapping
//  */
// const PAYMENT_TYPE_MAP: Record<string, string> = {
//   annual_access_fee: "annual_access_fee",
//   id_card_payment: "id_card_fee",
//   transcript_fee: "transcript_fee",
// };

// const SplitKeysConfig = () => {
//   const [splits, setSplits] = useState({
//     annual_access_fee: "",
//     id_card_payment: "",
//     transcript_fee: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   const handleInputChange = (key: keyof typeof splits, value: string) => {
//     setSplits((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleReset = () => {
//     setSplits({
//       annual_access_fee: "",
//       id_card_payment: "",
//       transcript_fee: "",
//     });
//   };

//   const handleSave = async () => {
//     setError(null);
//     setSuccess(null);

//     const filledEntries = Object.entries(splits).filter(
//       ([_, value]) => value.trim() !== ""
//     );

//     if (filledEntries.length === 0) {
//       setError("Please enter at least one split key.");
//       return;
//     }

//     try {
//       setLoading(true);

//       await Promise.all(
//         filledEntries.map(([key, splitCode]) =>
//           api.post("/university-admin/payment-splits", {
//             payment_type: PAYMENT_TYPE_MAP[key],
//             split_code: splitCode,
//           })
//         )
//       );

//       setSuccess("Payment split keys saved successfully.");
//       handleReset();
//     } catch (err: any) {
//       console.error("Save failed:", err);
//       setError(
//         err?.response?.data?.message || "Failed to save payment split keys."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 flex">
//       <div className="w-full max-w-2xl bg-white">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Split Key Settings
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Configure Paystack split keys for university payments
//           </p>
//         </div>

//         {/* Alerts */}
//         {error && (
//           <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded">
//             {success}
//           </div>
//         )}

//         {/* Inputs */}
//         <div className="space-y-8">
//           <SplitInput
//             label="Annual Access Fee"
//             placeholder="SPL_xxxxxxxxx"
//             value={splits.annual_access_fee}
//             onChange={(val) => handleInputChange("annual_access_fee", val)}
//           />

//           <SplitInput
//             label="ID Card Fee"
//             placeholder="SPL_xxxxxxxxx"
//             value={splits.id_card_payment}
//             onChange={(val) => handleInputChange("id_card_payment", val)}
//           />

//           <SplitInput
//             label="Transcript Fee"
//             placeholder="SPL_xxxxxxxxx"
//             value={splits.transcript_fee}
//             onChange={(val) => handleInputChange("transcript_fee", val)}
//           />
//         </div>

//         {/* Action Button */}
//         <div className="mt-12 pt-8 border-t border-gray-100">
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className={`py-3 px-6 rounded-md text-white font-medium flex items-center gap-2 transition
//               ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-[#1D75D3] hover:bg-blue-700"
//               }`}
//           >
//             <Save size={18} />
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface SplitInputProps {
//   label: string;
//   placeholder: string;
//   value: string;
//   onChange: (val: string) => void;
// }

// const SplitInput = ({
//   label,
//   placeholder,
//   value,
//   onChange,
// }: SplitInputProps) => (
//   <div className="flex flex-col gap-2 text-left">
//     <label className="text-[15px] font-medium text-gray-700">{label}</label>
//     <input
//       type="text"
//       placeholder={placeholder}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-[#1D75D3] outline-none transition-all placeholder:text-gray-300"
//     />
//   </div>
// );

// export default SplitKeysConfig;
