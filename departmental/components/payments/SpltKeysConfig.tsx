import React, { useState } from "react";
import { Settings, Save, RotateCcw, Info } from "lucide-react";

const PaymentSettings = () => {
  // Initial state mapping to your model's payment_type
  const [splits, setSplits] = useState({
    annual_access_fee: "",
    department_annual_fee: "",
    id_card_payment: "",
    transcript_fee: "",
  });

  const handleInputChange = (type: string, value: string) => {
    setSplits((prev) => ({ ...prev, [type]: value }));
  };

  const handleSave = () => {
    console.log("Saving to payment_split_configs table:", splits);
    // Here you would call your createPaystackSplit controller
  };

  const handleReset = () => {
    setSplits({
      annual_access_fee: "",
      department_annual_fee: "",
      id_card_payment: "",
      transcript_fee: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-100 p-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Payment Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Input split keys for the different payments below
          </p>
        </div>

        {/* Input Fields Container */}
        <div className="space-y-8">
          <SplitInput
            label="Annual Access Fee Split Key"
            placeholder="SPL_pCAEA2IbXH"
            value={splits.annual_access_fee}
            onChange={(val) => handleInputChange("annual_access_fee", val)}
          />

          <SplitInput
            label="Annual Department Dues Split Key"
            placeholder="Enter split code"
            value={splits.department_annual_fee}
            onChange={(val) => handleInputChange("department_annual_fee", val)}
          />

          <SplitInput
            label="ID Card Payment Split Key"
            placeholder="Recommended split key"
            value={splits.id_card_payment}
            onChange={(val) => handleInputChange("id_card_payment", val)}
          />

          <SplitInput
            label="Transcript Split Key"
            placeholder="100% split key"
            value={splits.transcript_fee}
            onChange={(val) => handleInputChange("transcript_fee", val)}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
          <button
            onClick={handleReset}
            className="flex-1 py-3 px-6 border border-gray-900 text-gray-900 font-medium rounded-md hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex-[1.5] py-3 px-6 bg-[#1D75D3] text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component to match your screenshot style
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
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-[#1D75D3] outline-none transition-all placeholder:text-gray-300"
      />
    </div>
  </div>
);

export default PaymentSettings;
