import { Input } from "@/components/ui/Input";
import TabButton from "@/components/TabButton";
import { Layers, Edit2, X, Save, RotateCcw } from "lucide-react";
import { ProgramTypeResponse } from "@/api/types";
import { Button } from "@/components/ui/Button";

interface Props {
  values: {
    departmentDues: string;
    accessFee: string;
    idCardFee: string;
    transcriptFee: string;
  };
  onChange: (field: string, value: string) => void;
  programTypes: ProgramTypeResponse[];
  selectedProgramTypeId: string;
  onSelectProgramType: (id: string) => void;
  loading?: boolean;
  onSave: () => void;
  isSaving: boolean;
  onReset: () => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const PaymentSplitKeysSection = ({ 
  values, 
  onChange,
  programTypes,
  selectedProgramTypeId,
  onSelectProgramType,
  loading = false,
  onSave,
  isSaving,
  onReset,
  isEditing,
  onToggleEdit
}: Props) => {
  return (
    <div className="pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold text-gray-900">
            Payment Settings
        </h2>
        
        {programTypes.length > 0 && (
            <button 
                onClick={onToggleEdit}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors border
                ${isEditing 
                    ? 'border-red-200 text-red-600 hover:bg-red-50 bg-white' 
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50 bg-white'}`}
            >
                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                {isEditing ? "Cancel" : "Edit"}
            </button>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Input the amount for the different payments below
      </p>

      {/* PROGRAM TYPE TABS */}
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            Program Levels
        </h3>
        <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-xl w-fit">
            {programTypes.map((type) => (
                <TabButton 
                    key={type.id} 
                    active={selectedProgramTypeId === type.id} 
                    onClick={() => onSelectProgramType(type.id)} 
                    icon={null} 
                    label={type.name} 
                />
            ))}
        </div>
        {programTypes.length === 0 && !loading && (
            <p className="text-sm text-slate-400 mt-2">No program types found. Fees will be applied generally if not selected.</p>
        )}
      </section>

      <div className="max-w-2xl space-y-6">
        {/* Helper for rendering fields */}
        {[
            { label: "Annual Access Fee", key: "accessFee" },
            { label: "Annual Department Dues", key: "departmentDues" },
            { label: "ID Card Fee", key: "idCardFee" },
            { label: "Transcript Fee", key: "transcriptFee" }
        ].map((field) => (
             <div key={field.key}>
                {isEditing ? (
                    <Input
                        label={field.label}
                        value={values[field.key as keyof typeof values]}
                        onChange={(e) => onChange(field.key, e.target.value)}
                    />
                ) : (
                    <div className="space-y-1">
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-[11px]">{field.label}</span>
                        <p className="text-slate-800 font-medium text-lg">
                            {values[field.key as keyof typeof values] 
                                ? `₦${Number(values[field.key as keyof typeof values]).toLocaleString()}` 
                                : '-'}
                        </p>
                    </div>
                )}
             </div>
        ))}
      </div>

      {isEditing && (
        <div className="flex items-center justify-end gap-3 mt-10 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
            <button 
                onClick={onReset}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
                <RotateCcw size={16} /> Reset
            </button>
            <Button onClick={onSave} variant="primary" disabled={isSaving} className="px-8">
                {isSaving ? "Saving..." : <><Save size={16} className="mr-2"/> Save Changes</>}
            </Button>
        </div>
      )}
    </div>
  );
};

// // components/payments/PaymentSplitKeysSection.tsx
// import { Input } from "@/components/ui/Input";

// interface Props {
//   values: {
//     departmentDues: string;
//     accessFee: string;
//     idCardFee: string;
//     transcriptFee: string;
//   };
//   onChange: (field: string, value: string) => void;
// }

// export const PaymentSplitKeysSection = ({ values, onChange }: Props) => {
//   return (
//     <div className="pt-8 border-t border-gray-200">
//       <h2 className="text-xl font-semibold text-gray-900 mb-3">
//         Payment Settings
//       </h2>
//       <p className="text-sm text-gray-600 mb-8">
//         Input split keys for the different payments below
//       </p>

//       <div className="max-w-2xl space-y-6">
//         <Input
//           label="Annual Access Fee"
//           value={values.accessFee}
//           onChange={(e) => onChange("accessFee", e.target.value)}
//         />

//         <Input
//           label="Annual Department Dues"
//           value={values.departmentDues}
//           onChange={(e) => onChange("departmentDues", e.target.value)}
//         />

//         <Input
//           label="ID Card Fee"
//           value={values.idCardFee}
//           onChange={(e) => onChange("idCardFee", e.target.value)}
//         />

//         <Input
//           label="Transcript Fee"
//           value={values.transcriptFee}
//           onChange={(e) => onChange("transcriptFee", e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };
