import { Input } from "@/components/ui/Input";

interface Props {
  values: {
    departmentDues: string;
    accessFee: string;
    idCardFee: string;
    transcriptFee: string;
  };
  onChange: (field: string, value: string) => void;
}

export const PaymentSplitKeysSection = ({ values, onChange }: Props) => {
  return (
    <div className="pt-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        Payment Settings
      </h2>
      <p className="text-sm text-gray-600 mb-8">
        Input split keys for the different payments below
      </p>

      <div className="max-w-2xl space-y-6">
        <Input
          label="Annual Access Fee"
          value={values.accessFee}
          onChange={(e) => onChange("accessFee", e.target.value)}
        />

        <Input
          label="Annual Department Dues"
          value={values.departmentDues}
          onChange={(e) => onChange("departmentDues", e.target.value)}
        />

        <Input
          label="ID Card Fee"
          value={values.idCardFee}
          onChange={(e) => onChange("idCardFee", e.target.value)}
        />

        <Input
          label="Transcript Fee"
          value={values.transcriptFee}
          onChange={(e) => onChange("transcriptFee", e.target.value)}
        />
      </div>
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
