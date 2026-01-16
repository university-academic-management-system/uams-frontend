"use client";

import React, { useState } from "react";
import { Save } from "lucide-react";
import api from "@/api/axios"; // ✅ USE YOUR AXIOS INSTANCE

/**
 * Frontend field → backend payment_type mapping
 */
const PAYMENT_TYPE_MAP: Record<string, string> = {
  annual_access_fee: "annual_access_fee",
  id_card_payment: "id_card_fee",
  transcript_fee: "transcript_fee",
};

const SplitKeysConfig = () => {
  const [splits, setSplits] = useState({
    annual_access_fee: "",
    id_card_payment: "",
    transcript_fee: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (key: keyof typeof splits, value: string) => {
    setSplits((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSplits({
      annual_access_fee: "",
      id_card_payment: "",
      transcript_fee: "",
    });
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const filledEntries = Object.entries(splits).filter(
      ([_, value]) => value.trim() !== ""
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
          })
        )
      );

      setSuccess("Payment split keys saved successfully.");
      handleReset();
    } catch (err: any) {
      console.error("Save failed:", err);
      setError(
        err?.response?.data?.message || "Failed to save payment split keys."
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

// import React, { useState } from "react";
// import { Settings, Save, RotateCcw, Info } from "lucide-react";

// const PaymentSettings = () => {
//   // Initial state mapping to your model's payment_type
//   const [splits, setSplits] = useState({
//     annual_access_fee: "",
//     department_annual_fee: "",
//     id_card_payment: "",
//     transcript_fee: "",
//   });

//   const handleInputChange = (type: string, value: string) => {
//     setSplits((prev) => ({ ...prev, [type]: value }));
//   };

//   const handleSave = () => {
//     console.log("Saving to payment_split_configs table:", splits);
//     // Here you would call your createPaystackSplit controller
//   };

//   const handleReset = () => {
//     setSplits({
//       annual_access_fee: "",
//       department_annual_fee: "",
//       id_card_payment: "",
//       transcript_fee: "",
//     });
//   };

//   return (
//     <div className=" p-8 flex ">
//       <div className="w-full max-w-2xl bg-white">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             Split key Settings
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Input split keys for the different payments below
//           </p>
//         </div>

//         {/* Input Fields Container */}
//         <div className="space-y-8">
//           <SplitInput
//             label="Annual_Access_Fee"
//             placeholder="SPL_pCAEA2IbXH"
//             value={splits.annual_access_fee}
//             onChange={(val) => handleInputChange("annual_access_fee", val)}
//           />

//           <SplitInput
//             label="ID_Card_Fee"
//             placeholder="SPL_pCAEA2IbXH"
//             value={splits.id_card_payment}
//             onChange={(val) => handleInputChange("id_card_payment", val)}
//           />

//           <SplitInput
//             label="Transcript_fee"
//             placeholder="SPL_pCAEA2IbXH"
//             value={splits.transcript_fee}
//             onChange={(val) => handleInputChange("transcript_fee", val)}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
//           {/* <button
//             onClick={handleReset}
//             className="flex-1 py-3 px-6 border border-gray-900 text-gray-900 font-medium rounded-md hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
//           >
//             <RotateCcw size={18} />
//             Reset
//           </button> */}
//           <button
//             onClick={handleSave}
//             className=" py-3 px-6 bg-[#1D75D3] text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
//           >
//             <Save size={18} />
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Input Component to match your screenshot style
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
//     <div className="relative">
//       <input
//         type="text"
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-[#1D75D3] outline-none transition-all placeholder:text-gray-300"
//       />
//     </div>
//   </div>
// );

// export default PaymentSettings;
