// pages/PaymentsPage.tsx
import { GlobalSettingsSection } from "@/components/payments/GlobalSettingsSection";
import { PaymentSplitKeysSection } from "@/components/payments/PaymentSplitKeysSection";
import { PageActions } from "@/components/payments/PageActions";

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto py-10 px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          Payment Configuration
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
          <GlobalSettingsSection />
          <PaymentSplitKeysSection />
          <PageActions />
        </div>
      </div>
    </div>
  );
}
