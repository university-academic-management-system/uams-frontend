// components/payments/PaymentSplitKeysSection.tsx
import { Input } from "@/components/ui/Input";

export const PaymentSplitKeysSection = () => {
  return (
    <div className="pt-8 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        Payment Settings
      </h2>
      <p className="text-sm text-gray-600 mb-8">
        Input split keys for the different payments below
      </p>

      <div className="max-w-2xl space-y-6">
        <Input label="Annual Access Fee Split Key" />
        <Input label="Annual Department Dues Split Key" />
        <Input label="ID Card Payment Split Key" />
        <Input label="Transcript Split Key" />
      </div>
    </div>
  );
};
