import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Loader2,
  CreditCard,
  Printer,
  Download,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Search,
} from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import {
  getStoredUser,
  getIdCardFee,
  initializeIdCardPayment,
} from "../services/authService";
import {
  getLevels,
  getSemesters,
  getSessions,
  getStudentProfile,
  getRegistrations,
  getDepartmentCourses,
  addCourseToCart,
  bulkRegisterCourses,
  getStudentPayments,
  getTranscripts,
  getDefaultIDCard,
} from "../services/registrationService";
import type {
  Level,
  Semester,
  Session,
  StudentProfile,
  RegistrationData,
  RegisteredCourse,
  DepartmentCourse,
  TranscriptApplication,
} from "../services/types";
import type { CoursesRegViewProps } from "../types";
import { toaster } from "../components/ui/toaster";
import apiClient from "../services/api";
import { useAsync } from "react-use";
import { useTranscriptForm } from "@/forms/transcript.form";
import type { TranscriptSchema } from "@/schemas/registration/transcript.schema";

const checkboxClasses =
  "appearance-none w-4 h-4 bg-white border border-gray-300 rounded checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all bg-center bg-no-repeat checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22white%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M16.707%205.293a1%201%200%20010%201.414l-8%208a1%201%200%2001-1.414%200l-4-4a1%201%200%20011.414-1.414L8%2012.586l7.293-7.293a1%201%200%20011.414%200z%22%20clip-rule%3D%22evenodd%22%20%2F%3E%3C%2Fsvg%3E')]";

const InputField = ({
  label,
  placeholder,
  type = "text",
  isSelect = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  isSelect?: boolean;
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-[13px] font-medium text-gray-500">{label}</label>
    <div className="relative">
      {isSelect ? (
        <>
          <select className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-100">
            <option value="">{placeholder}</option>
            <option value="digital">Digital Delivery (Email)</option>
            <option value="courier">Courier Service</option>
            <option value="pickup">Physical Pickup</option>
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
            size={14}
          />
        </>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-blue-100 placeholder:text-gray-300"
        />
      )}
    </div>
  </div>
);

interface TranscriptDeliveryOption {
  base_amount: number;
  description: string;
  merchant_fee: number;
}

interface TranscriptFeeData {
  requires_delivery_method: boolean;
  available_delivery_methods: string[];
  transcript_delivery_options: Record<string, TranscriptDeliveryOption>;
  config_info: {
    split_code: string;
    split_type: string;
    platform_fee_value: string;
    currency: string;
    is_active: boolean;
  };
}

const formatDeliveryLabel = (key: string) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const TranscriptFormView = ({ onBack }: { onBack: () => void }) => {
  const [feeData, setFeeData] = useState<TranscriptFeeData | null>(null);
  const [feeLoading, setFeeLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useTranscriptForm();

  const delivery_method = watch("delivery_method");
  const institution_name = watch("institution_name");
  const recipient_name = watch("recipient_name");
  const recipient_address = watch("recipient_address");
  const recipient_email = watch("recipient_email");
  const purpose = watch("purpose");

  useEffect(() => {
    apiClient.get('/annual-access-fee/transcript-fee')
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setFeeData(data);
      })
      .catch((err) => {
        console.error('Failed to fetch transcript fee:', err);
        toaster.create({ title: 'Failed to load transcript fee options', type: 'error' });
      })
      .finally(() => setFeeLoading(false));
  }, []);

  const selectedOption = feeData?.transcript_delivery_options?.[delivery_method];
  const totalFee = selectedOption ? selectedOption.base_amount + selectedOption.merchant_fee : 0;

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString('en-NG')}`;

  const onSubmit = (data: TranscriptSchema) => {
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    try {
      const payload = {
        callbackUrl: import.meta.env.VITE_TRANSCRIPT_CALLBACK_URL,
        recipient_name: recipient_name,
        recipient_email: recipient_email,
        recipient_address: recipient_address,
        purpose: purpose,
        delivery_method: delivery_method,
        institution_name: institution_name,
      };
      const res = await apiClient.post('/annual-access-fee/transcript-payment', payload);
      const data = res.data?.data ?? res.data;
      if (data?.authorizationUrl) {
        toaster.create({ title: 'Redirecting to payment...', type: 'info' });
        window.location.href = data.authorizationUrl;
      } else {
        toaster.create({ title: 'Payment initialized but no redirect URL received', type: 'warning' });
        setShowConfirmModal(false);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to initialize payment';
      toaster.create({ title: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-12 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8 lg:mb-10">
        <h2 className="text-xl font-bold text-[#1e293b]">
          Transcript Registration
        </h2>
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 text-[13px] font-bold transition-colors"
        >
          ← Back to list
        </button>
      </div>

      {feeLoading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 text-[13px] gap-2">
          <Loader2 size={18} className="animate-spin" />
          Loading delivery options...
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
            {/* Institution */}
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#1e293b]">
                Name of receiving institution or organization
              </label>
              <input
                {...register("institution_name")}
                placeholder="University of Port..."
                className={`w-full bg-gray-50 border ${errors.institution_name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-[13px] text-slate-700 font-medium placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-accent)] transition-colors`}
              />
              {errors.institution_name && <p className="text-red-500 text-[11px] mt-1">{errors.institution_name.message}</p>}
            </div>

            {/* Recipient Name */}
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#1e293b]">
                Recipient Name
              </label>
              <input
                {...register("recipient_name")}
                placeholder="Input recipient name"
                className={`w-full bg-gray-50 border ${errors.recipient_name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-[13px] text-slate-700 font-medium placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-accent)] transition-colors`}
              />
              {errors.recipient_name && <p className="text-red-500 text-[11px] mt-1">{errors.recipient_name.message}</p>}
            </div>

            {/* Delivery Mode - dynamic from API */}
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#1e293b]">
                Mode of Transcript Delivery
              </label>
              <div className="relative">
                <select
                  {...register("delivery_method")}
                  className={`w-full bg-gray-50 border ${errors.delivery_method ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-[13px] text-slate-700 font-medium appearance-none cursor-pointer focus:outline-none focus:border-[var(--color-accent)] transition-colors`}
                >
                  <option value="" disabled>Select delivery method</option>
                  {feeData?.available_delivery_methods.map((method) => {
                    const opt = feeData.transcript_delivery_options[method];
                    return (
                      <option key={method} value={method}>
                        {formatDeliveryLabel(method)} — {opt?.description}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Recipient Address */}
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#1e293b]">
                Recipient/Institution address
              </label>
              <input
                {...register("recipient_address")}
                placeholder="Enter address"
                className={`w-full bg-gray-50 border ${errors.recipient_address ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-[13px] text-slate-700 font-medium placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-accent)] transition-colors`}
              />
              {errors.recipient_address && <p className="text-red-500 text-[11px] mt-1">{errors.recipient_address.message}</p>}
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#1e293b]">
                Contact email/phone of recipient
              </label>
              <input
                {...register("recipient_email")}
                placeholder="Input contact information"
                className={`w-full bg-gray-50 border ${errors.recipient_email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-[13px] text-slate-700 font-medium placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-accent)] transition-colors`}
              />
              {errors.recipient_email && <p className="text-red-500 text-[11px] mt-1">{errors.recipient_email.message}</p>}
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <label className="block text-[13px] font-bold text-[#1e293b]">
                Purpose of Application
              </label>
              <input
                {...register("purpose")}
                placeholder="Admission purpose"
                className={`w-full bg-gray-50 border ${errors.purpose ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-[13px] text-slate-700 font-medium placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-accent)] transition-colors`}
              />
              {errors.purpose && <p className="text-red-500 text-[11px] mt-1">{errors.purpose.message}</p>}
            </div>
          </div>

          {/* Fee breakdown */}
          {selectedOption && (
            <div className="mt-8 bg-blue-50/60 border border-blue-100 rounded-xl p-5">
              <h3 className="text-[13px] font-bold text-[#1e293b] mb-3">Fee Breakdown</h3>
              <div className="space-y-2 text-[12px] text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>Delivery Method</span>
                  <span className="font-bold text-slate-700">{formatDeliveryLabel(delivery_method)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Fee</span>
                  <span className="font-bold text-slate-700">{formatCurrency(selectedOption.base_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span className="font-bold text-slate-700">{formatCurrency(selectedOption.merchant_fee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span className="font-bold text-[#1e293b]">Total</span>
                  <span className="font-bold text-[#1e293b] text-[14px]">{formatCurrency(totalFee)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 text-[12px] text-gray-400 leading-relaxed font-medium">
            <p>
              Applicants are required to pay the prescribed transcript processing fee
              through the university's online portal. The fee varies depending on the
              mode of delivery.
              <span className="font-bold text-gray-600">
                {" "}Additional courier or postage charges may apply for hard-copy deliveries.
              </span>
            </p>
            <p className="mt-2">
              All payments must be made online, and a payment receipt will be
              generated automatically upon successful transaction.
            </p>
          </div>

          <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              disabled={!delivery_method}
              className="bg-[#22c55e] hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-[13px] font-bold transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed to make payment — {selectedOption ? formatCurrency(totalFee) : ''}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="bg-white border border-gray-200 text-gray-500 px-8 py-3 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedOption && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={() => !submitting && setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-[16px] font-bold text-[#1e293b]">Confirm Payment</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Summary */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-[12px] text-gray-400 font-medium">Review your transcript request details before proceeding.</p>

              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Institution</span>
                  <span className="font-bold text-slate-700 text-right max-w-50 truncate">{institution_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Method</span>
                  <span className="font-bold text-slate-700">{formatDeliveryLabel(delivery_method)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Description</span>
                  <span className="font-medium text-slate-600">{selectedOption.description}</span>
                </div>
                {recipient_address && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-slate-600 text-right max-w-50 truncate">{recipient_address}</span>
                  </div>
                )}
                {recipient_email && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium text-slate-600 text-right max-w-50 truncate">{recipient_email}</span>
                  </div>
                )}
              </div>

              {/* Fee */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-[12px]">
                <div className="flex justify-between text-gray-500">
                  <span>Base Fee</span>
                  <span className="font-bold text-slate-700">{formatCurrency(selectedOption.base_amount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Processing Fee</span>
                  <span className="font-bold text-slate-700">{formatCurrency(selectedOption.merchant_fee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-[#1e293b]">Total Amount</span>
                  <span className="font-bold text-[#1e293b] text-[15px]">{formatCurrency(totalFee)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="flex-1 bg-white border border-gray-200 text-gray-500 py-3 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={submitting}
                className="flex-1 bg-[#22c55e] hover:bg-green-600 disabled:opacity-50 text-white py-3 rounded-lg text-[13px] font-bold transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Confirm & Pay {formatCurrency(totalFee)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TranscriptRegView = () => {
  const [showForm, setShowForm] = React.useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Application");

  useEffect(() => {
    getTranscripts()
      .then(setTranscripts)
      .finally(() => setLoading(false));
  }, []);

  const filteredTranscripts = useMemo(() => {
    return transcripts.filter((app) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        app.recipient_name.toLowerCase().includes(q) ||
        app.status.toLowerCase().includes(q) ||
        app.purpose.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All Application" ||
        app.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [transcripts, searchQuery, statusFilter]);

  if (showForm) {
    return <TranscriptFormView onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* New Application Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-[13px] font-bold transition-all shadow-md"
        >
          <Plus size={16} />
          New Transcript Application
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">
            Transcript Applications
          </h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                placeholder="Search by institution, status"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-4 py-2 text-[12px] font-medium text-slate-700 placeholder:text-gray-300 focus:outline-none focus:border-blue-300 w-full md:w-55 h-9"
              />
            </div>
            {/* Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#f8fafc] border border-gray-100 rounded-lg px-3 pr-7 py-2 text-[11px] font-bold text-gray-500 appearance-none cursor-pointer h-9"
              >
                <option value="All Application">All Application</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-bold text-gray-400 py-3 px-3">S/N</th>
                <th className="text-left text-[11px] font-bold text-gray-400 py-3 px-3">Recipient Name</th>
                <th className="text-left text-[11px] font-bold text-gray-400 py-3 px-3 hidden md:table-cell">Purpose</th>
                <th className="text-left text-[11px] font-bold text-gray-400 py-3 px-3 hidden lg:table-cell">Fee</th>
                <th className="text-left text-[11px] font-bold text-gray-400 py-3 px-3 hidden md:table-cell">Delivery Mode</th>
                <th className="text-left text-[11px] font-bold text-gray-400 py-3 px-3">Date</th>
                <th className="text-center text-[11px] font-bold text-gray-400 py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-[13px]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Loading applications...
                    </div>
                  </td>
                </tr>
              ) : filteredTranscripts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-[13px]">
                    No transcript applications found.
                  </td>
                </tr>
              ) : (
                filteredTranscripts.map((app, idx) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-3 text-[12px] font-bold text-slate-700">{idx + 1}</td>
                    <td className="py-4 px-3 text-[12px] font-medium text-slate-700">{app.recipient_name}</td>
                    <td className="py-4 px-3 text-[12px] text-gray-400 font-medium hidden md:table-cell">{app.purpose}</td>
                    <td className="py-4 px-3 text-[12px] text-gray-400 font-medium hidden lg:table-cell">₦{parseFloat(app.fee_amount).toLocaleString()}</td>
                    <td className="py-4 px-3 text-[12px] text-gray-400 font-medium hidden md:table-cell">{app.delivery_method.replace(/_/g, ' ')}</td>
                    <td className="py-4 px-3 text-[11px] text-gray-400 font-medium">
                      {new Date(app.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                        app.status === 'PAID'
                          ? 'bg-green-50 text-green-600'
                          : app.status === 'PENDING'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-blue-50 text-blue-500'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FormRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="grid grid-cols-12 items-center gap-4">
    <label className="col-span-12 sm:col-span-3 text-[13px] font-bold text-[#1e293b]">
      {label}
    </label>
    <div className="col-span-12 sm:col-span-9 relative">{children}</div>
  </div>
);

// --- ID Card Components ---

interface IDCardSettings {
  backTemplate?: string;
  frontTemplate?: string;
  backDescription?: string;
  backDisclaimer?: string;
  hodSignature?: string;
}

interface IDCardProps {
  isWatermarked?: boolean;
  studentProfile?: StudentProfile | null;
  studentPhoto?: string | null;
  isPhotoUploaded?: boolean;
  idCardSettings?: IDCardSettings | null;
  studentName?: string;
}

const IDCardGraphic = ({
  isWatermarked = false,
  studentProfile,
  studentPhoto,
  isPhotoUploaded = false,
  idCardSettings,
  studentName = "N/A",
}: IDCardProps) => {
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* FRONT OF CARD */}
      <div className="relative aspect-[1.6/1] rounded-xl border-4 border-[var(--color-accent)] shadow-xl overflow-hidden bg-gray-100">
        <img
          src={idCardSettings?.frontTemplate}
          alt="ID Card Front"
          className="w-full h-full object-fill"
        />

        {/* Student Photo */}
        <div className="absolute top-[38%] left-[6.5%] w-[23%] h-[43%] bg-white p-[3px] border-[2px] border-gray-400 shadow-sm flex items-center justify-center">
          {studentPhoto && isPhotoUploaded ? (
            <img
              src={studentPhoto}
              alt="Student Photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>

        {/* Student Details */}
        <div className="absolute left-[33%] top-[41%] w-[65%] text-[9px] sm:text-[13px] font-bold text-black flex flex-col gap-[8px] sm:gap-[12px] leading-none">
          <div className="uppercase font-black">NAME: {studentName}</div>
          <div className="uppercase">MATRIC NO.: {studentProfile?.studentId || 'N/A'}</div>
          <div className="uppercase">FACULTY: COMPUTING</div>
          <div className="uppercase">DEPT: {studentProfile?.Department?.name || 'N/A'}</div>
          <div className="uppercase text-[#ef4444]">
            EXPIRY DATE: {studentProfile?.courseDuration ? new Date(new Date(studentProfile?.createdAt).setFullYear(new Date(studentProfile?.createdAt).getFullYear() + studentProfile.courseDuration)).getFullYear() : 'N/A'}
          </div>
        </div>

        {/* Student Name in Bottom Banner */}
        <div className="absolute bottom-[3%] sm:bottom-[3.5%] left-0 w-full flex justify-center">
          <span className="text-white font-bold text-[9px] sm:text-[13px] uppercase tracking-wide">
            {studentName}
          </span>
        </div>

        {/* Watermark Overlay */}
        {isWatermarked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden bg-white/20">
            <div className="text-[60px] font-black text-gray-900/20 -rotate-25 uppercase whitespace-nowrap select-none">
              PREVIEW ONLY
            </div>
          </div>
        )}
      </div>

      {/* BACK OF CARD */}
      <div className="relative aspect-[1.6/1] rounded-xl border-4 border-[var(--color-accent)] shadow-xl overflow-hidden bg-gray-100">
        <img
          src={idCardSettings?.backTemplate}
          alt="ID Card Back"
          className="w-full h-full object-fill"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-between text-center px-[10%] py-[8%]">
          <div className="flex-1 flex flex-col justify-center items-center w-full mt-[3%]">
            <p className="text-[12px] sm:text-[15px] font-bold text-[#0f172a] mb-[6%] leading-snug">
              {idCardSettings?.backDescription || "The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt"}
            </p>
            <p className="text-[11px] sm:text-[13px] font-bold text-[#0f172a] leading-snug px-[2%]">
              {idCardSettings?.backDisclaimer || "If found please return to the office of the Chief Security Officer University of Port Harcourt"}
            </p>
          </div>

          <div className="flex flex-col items-center w-full pb-[2%]">
            {idCardSettings?.hodSignature ? (
              <img src={idCardSettings.hodSignature} alt="Signature" className="h-[24px] sm:h-[32px] object-contain mb-[2px]" />
            ) : (
              <div className="h-[24px] sm:h-[32px] mb-[2px]" />
            )}
            <div className="w-[70%] sm:w-[60%] h-[1.5px] bg-[#0f172a] mb-[4px] sm:mb-[6px]" />
            <p className="text-[11px] sm:text-[13px] font-bold text-[#0f172a] m-0">Department Admin's Signature</p>
          </div>
        </div>

        {/* Watermark Overlay */}
        {isWatermarked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden bg-white/20">
            <div className="text-[60px] font-black text-gray-900/20 -rotate-25 uppercase whitespace-nowrap select-none">
              PREVIEW ONLY
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface IDCardViewProps {
  isPaid: boolean;
  isPhotoUploaded?: boolean;
  onBack: () => void;
  studentProfile?: StudentProfile | null;
  studentPhoto?: string | null;
  idCardSettings?: IDCardSettings | null;
  studentName?: string;
}

const IDCardView = ({
  isPaid,
  isPhotoUploaded = false,
  onBack,
  studentProfile,
  studentPhoto,
  idCardSettings,
  studentName,
}: IDCardViewProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadID = async () => {
    if (!studentProfile || !studentPhoto || !studentName) return;
    setIsGeneratingPDF(true);
    let toastId;
    try {
      toastId = toaster.create({ title: "Generating PDF...", type: "loading" });
      const { jsPDF } = await import("jspdf");
      const cardWidth = 85.6, cardHeight = 54;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [cardWidth, cardHeight] });

      const loadImage = (src: string): Promise<HTMLImageElement | null> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
          setTimeout(() => resolve(null), 10000); // 10s timeout
        });
      };

      const frontTemplate = idCardSettings?.frontTemplate ? await loadImage(idCardSettings.frontTemplate) : null;
      const backTemplate = idCardSettings?.backTemplate ? await loadImage(idCardSettings.backTemplate) : null;

      if (!frontTemplate) {
        if (toastId) toaster.dismiss(toastId);
        toaster.error({ title: "Failed to load ID card template" });
        setIsGeneratingPDF(false);
        return;
      }

      // Front Page
      doc.addImage(frontTemplate, "PNG", 0, 0, cardWidth, cardHeight);
      
      // Photo Border and Photo (Matches w-[23%] h-[43%] left-[6.5%] top-[38%] p-[3px] border-[2px])
      const photoX = 5.56; const photoY = 20.52;
      const photoW = 19.68; const photoH = 23.22;
      const pad = 0.8;
      
      doc.setDrawColor(156, 163, 175); // gray-400
      doc.setLineWidth(0.4);
      doc.setFillColor(255, 255, 255);
      doc.rect(photoX, photoY, photoW, photoH, 'FD'); // background white with gray border
      
      // Preserve image aspect ratio inside the box
      const imgProps = doc.getImageProperties(studentPhoto);
      const imgRatio = imgProps.width / imgProps.height;
      const boxW = photoW - (pad * 2);
      const boxH = photoH - (pad * 2);
      const boxRatio = boxW / boxH;
      let drawW = boxW;
      let drawH = boxH;
      let drawX = photoX + pad;
      let drawY = photoY + pad;
      
      if (imgRatio > boxRatio) {
        // Image is wider than box -> fit width, center vertically
        drawW = boxW;
        drawH = boxW / imgRatio;
        drawY = photoY + pad + (boxH - drawH) / 2;
      } else {
        // Image is taller than box -> fit height, center horizontally
        drawH = boxH;
        drawW = boxH * imgRatio;
        drawX = photoX + pad + (boxW - drawW) / 2;
      }
      
      doc.addImage(studentPhoto, "JPEG", drawX, drawY, drawW, drawH); 

      doc.setFontSize(3.2); // Scaling down the font size correctly
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const textX = 28.5; let textY = 23; const lineHeight = 4.0;
      
      const expiryYear = studentProfile?.courseDuration 
        ? new Date(new Date(studentProfile.createdAt).setFullYear(new Date(studentProfile.createdAt).getFullYear() + studentProfile.courseDuration)).getFullYear().toString()
        : 'N/A';

      const infoLines = [
        `NAME: ${studentName.toUpperCase()}`,
        `MATRIC NO.: ${studentProfile?.studentId?.toUpperCase() || 'N/A'}`,
        `FACULTY: COMPUTING`,
        `DEPT: ${studentProfile?.Department?.name?.toUpperCase() || 'N/A'}`,
      ];

      infoLines.forEach((line, i) => {
        doc.text(line, textX, textY + i * lineHeight);
      });

      // Expiry Date (Red)
      doc.setTextColor(239, 68, 68); // #ef4444
      doc.text(`EXPIRY DATE: ${expiryYear}`, textX, textY + infoLines.length * lineHeight);

      // Student Name in Bottom Banner
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(3.8);
      doc.text(studentName.toUpperCase(), cardWidth / 2, cardHeight - 2.8, { align: "center", charSpace: 0.1 });

      // Back Page
      if (backTemplate) {
        doc.addPage([cardWidth, cardHeight], "landscape");
        doc.addImage(backTemplate, "PNG", 0, 0, cardWidth, cardHeight);

        // Add Back Text
        const backDescription = idCardSettings?.backDescription || "The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt";
        const backDisclaimer = idCardSettings?.backDisclaimer || "If found please return to the office of the Chief Security Officer University of Port Harcourt";

        doc.setTextColor(15, 23, 42); // slate-900 equivalent
        
        // Description
        doc.setFontSize(3.8);
        doc.setFont("helvetica", "bold");
        const descLines = doc.splitTextToSize(backDescription, cardWidth - 20);
        doc.text(descLines, cardWidth / 2, 21, { align: "center" });

        // Disclaimer
        doc.setFontSize(3.0);
        const discLines = doc.splitTextToSize(backDisclaimer, cardWidth - 16);
        doc.text(discLines, cardWidth / 2, 31.5, { align: "center" });

        // Signature Line and Label (positioned lower down)
        const lineY = cardHeight - 9.5;
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(0.3);
        doc.line((cardWidth / 2) - 16, lineY, (cardWidth / 2) + 16, lineY);
        
        doc.setFontSize(3.0);
        doc.text("Department Admin's Signature", cardWidth / 2, cardHeight - 6.5, { align: "center" });

        // Signature Img (rests on the line, instead of fixed vertical pos)
        const sigSrc = idCardSettings?.hodSignature;
        if (sigSrc) {
          const signatureImg = await loadImage(sigSrc);
          if (signatureImg) {
            const sigWidth = 24;
            const sigHeight = (signatureImg.height * sigWidth) / signatureImg.width;
            doc.addImage(signatureImg, "PNG", (cardWidth / 2) - (sigWidth / 2), lineY - sigHeight - 0.5, sigWidth, Math.min(sigHeight, 8), undefined, 'FAST');
          }
        }
      }

      doc.save(`${studentName.replace(/\s+/g, "_")}_ID_Card.pdf`);
      
      if (toastId) toaster.dismiss(toastId);
      toaster.success({ title: "ID Card PDF generated!" });
    } catch (err) {
      console.error("PDF generation error:", err);
      if (toastId) toaster.dismiss(toastId);
      toaster.error({ title: "Failed to generate PDF" });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-white rounded-4xl p-8 lg:p-14 border border-gray-100 shadow-sm animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-10">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-50 rounded-full text-gray-400 transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="font-['Inter'] text-2xl font-bold text-[#1e293b] tracking-tight">
          {isPaid
            ? isPhotoUploaded
              ? "ID Card Ready"
              : "ID Card - Waiting for Photo"
            : "ID Card Preview"}
        </h2>
      </div>

      {/* Photo Status Notification */}
      {isPaid && !isPhotoUploaded && (
        <div className="bg-linear-to-r from-[#fbbf24] to-[#f59e0b] p-4 rounded-xl mb-8 flex items-center space-x-3 shadow-md animate-pulse">
          <div className="text-white text-xl">⏳</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">
              Waiting for Photo Upload
            </p>
            <p className="text-xs text-white/90">
              Admin will upload your photo soon
            </p>
          </div>
        </div>
      )}

      {isPaid && isPhotoUploaded && (
        <div className="bg-linear-to-r from-[#4ade80] to-[#22c55e] p-4 rounded-xl mb-8 flex items-center space-x-3 shadow-md">
          <div className="text-white text-xl">✓</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Photo Ready</p>
            <p className="text-xs text-white/90">
              Your ID card is ready to download
            </p>
          </div>
        </div>
      )}

      {/* ID Card Display */}
      <div className="bg-[#525252] rounded-3xl p-10 mb-12 shadow-inner">
        <IDCardGraphic
          isWatermarked={!isPaid}
          studentProfile={studentProfile}
          studentPhoto={studentPhoto}
          isPhotoUploaded={isPhotoUploaded && isPaid}
          idCardSettings={idCardSettings}
          studentName={studentName}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
        {isPaid ? (
          <>
            <button
              onClick={() => window.print()}
              disabled={!isPhotoUploaded || isGeneratingPDF}
              className="w-full sm:w-60 flex items-center justify-center space-x-3 bg-[#2ecc71] hover:bg-[#27ae60] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4.5 rounded-2xl text-[15px] font-black shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
            >
              <Printer size={20} strokeWidth={2.5} />
              <span>{isPhotoUploaded ? "Print ID" : "Waiting for Photo"}</span>
            </button>
            <button
              onClick={handleDownloadID}
              disabled={!isPhotoUploaded || isGeneratingPDF}
              className="w-full sm:w-60 flex items-center justify-center space-x-3 bg-[var(--color-accent)] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4.5 rounded-2xl text-[15px] font-black shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
            >
              {isGeneratingPDF ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <>
                  <Download size={20} strokeWidth={2.5} />
                  <span>{isPhotoUploaded ? "Download ID" : "Waiting for Photo"}</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="bg-[#eff6ff] border border-blue-100 p-5 rounded-2xl flex items-center space-x-4 max-w-md">
            <div className="bg-blue-500 p-2 rounded-full text-white">
              <CreditCard size={18} />
            </div>
            <p className="text-[12px] text-[var(--color-accent)] font-medium leading-tight">
              This is a watermarked preview. Please{" "}
              <span className="font-black uppercase">apply and pay</span> the
              application fee to download your official ID card.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const OtherServicesView = ({
  hasPaid,
  onAction,
  navigate,
}: {
  hasPaid: boolean;
  onAction: (action: "view") => void;
  navigate: any;
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [idCardFee, setIdCardFee] = useState<number | null>(null);
  const [merchantFee, setMerchantFee] = useState<number | null>(null);
  const [transactionCharges, setTransactionCharges] = useState<number | null>(null);
  const [subtotal, setSubtotal] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [sq, _] = useSearchParams();
  const trxRef = useMemo(() => sq.get("trxRef") || sq.get("reference"), [sq]);

  // handle successful id card payment
  useEffect(() => {
    if (trxRef) {
      toaster.success({ description: "Payment has been processed successfully!" });
      // Remove trxRef from URL to prevent re-triggering toast on refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [trxRef]);

  const handleProceedToApply = async () => {
    setIsLoadingFee(true);
    setError("");

    try {
      const response = await getIdCardFee();
      setIdCardFee(response.data.idCardFee);
      setMerchantFee(response.data.merchant_fee);
      setTransactionCharges(response.data.transaction_charges);
      setSubtotal(response.data.subtotal);
      setShowPaymentModal(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch ID card fee. Please try again.");
    } finally {
      setIsLoadingFee(false);
    }
  };

  const handlePayNow = async () => {
    setIsProcessingPayment(true);
    setError("");

    try {
      const callbackUrl = import.meta.env.VITE_ID_CARD_CALLBACK_URL;
      localStorage.setItem("paymentCallbackUrl", callbackUrl);
      const response = await initializeIdCardPayment();
      window.location.href = response.data.authorizationUrl;
    } catch (err: any) {
      setError(
        err.message || "Payment initialization failed. Please try again.",
      );
      setIsProcessingPayment(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="bg-white rounded-3xl lg:rounded-4xl p-8 lg:p-14 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
        <h2 className="text-xl font-bold text-[#1e293b] mb-8">ID Card</h2>
        <div className="space-y-6">
          <p className="text-[12px] lg:text-[13px] text-gray-400 leading-relaxed font-medium">
            Applicants are required to pay the prescribed ID card application
            fee through the university's online portal.
          </p>
          <p className="text-[12px] lg:text-[13px] text-gray-400 leading-relaxed font-medium">
            All payments must be made online, and a payment receipt will be
            generated automatically upon successful transaction. After payment,
            kindly visit the department for capturing. Your ID card will be
            processed and ready for pickup within 5-7 working days.
          </p>

          {/* Payment Status Message */}
          {!hasPaid && (
            <div className="bg-[#fef3c7] border border-[#fcd34d] p-4 rounded-lg">
              <p className="text-[12px] font-bold text-[#92400e]">
                💳 Payment Required: To view your ID card, you must complete
                payment first.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-[13px] font-bold">{error}</p>
            </div>
          )}

          <div className="flex justify-end items-center space-x-4 pt-4">
            <button
              onClick={() => onAction("view")}
              disabled={!hasPaid}
              className="px-10 py-3 rounded-lg border border-gray-200 text-[#1e293b] text-[13px] font-bold hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {hasPaid ? "👁️ View ID Card" : "🔒 Locked - Pay First"}
            </button>
            {!hasPaid && (
              <button
                onClick={handleProceedToApply}
                disabled={isLoadingFee}
                className="px-10 py-3 rounded-lg bg-[#22c55e] text-white text-[13px] font-bold hover:bg-green-600 disabled:bg-green-300 transition-all shadow-md shadow-green-50 flex items-center gap-2"
              >
                {isLoadingFee ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Proceed to apply"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ID Card Payment Modal */}
      {showPaymentModal && idCardFee !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[#1e293b]">
                ID Card Payment
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <p className="text-[13px] font-medium text-gray-400 mb-8">
              Complete your payment to apply for your student ID card
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-[13px] font-bold">{error}</p>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-gray-400">
                  ID Card Fee
                </span>
                <span className="text-[15px] font-bold text-[#1e293b]">
                  {formatCurrency(idCardFee)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-gray-400">
                  Merchant Fee
                </span>
                <span className="text-[15px] font-bold text-[#1e293b]">
                  {formatCurrency(merchantFee + transactionCharges)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">
                  Total
                </span>
                <span className="text-2xl font-black text-[var(--color-accent)]">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-4 rounded-xl text-[14px] font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePayNow}
                disabled={isProcessingPayment}
                className="flex-1 bg-[#2ecc71] hover:bg-[#27ae60] disabled:bg-green-300 disabled:cursor-not-allowed text-white py-4 rounded-xl text-[14px] font-black shadow-lg shadow-green-200/50 transition-all flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CoursesRegView: React.FC<CoursesRegViewProps> = ({
  levels,
  semesters,
  sessions,
  registrationData,
  studentProfile,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");

  // New multi-select states
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCoursesInDropdown, setSelectedCoursesInDropdown] = useState<
    string[]
  >([]);
  const [previewedCourses, setPreviewedCourses] = useState<DepartmentCourse[]>(
    [],
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [departmentCourses, setDepartmentCourses] = useState<
    DepartmentCourse[]
  >([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isCartConfirmed, setIsCartConfirmed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);


  // Fetch department courses on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingCourses(true);
      const courses = await getDepartmentCourses();
      setDepartmentCourses(courses);
      setIsLoadingCourses(false);
    };
    fetchData();
  }, []);

  // Fetch cart on mount to populate previewer
  // useEffect(() => {
  //   const fetchCart = async () => {
  //     const cartItems = await getCourseCart();
  //     if (cartItems.length > 0) {
  //       // Convert cart items to DepartmentCourse format for previewer
  //       const cartCourses = cartItems.map((item) => ({
  //         id: item.course.id,
  //         code: item.course.code,
  //         title: item.course.title,
  //         creditUnits: item.course.creditUnits,
  //       })) as any;
  //       setPreviewedCourses(cartCourses);
  //       setIsCartConfirmed(true); // Enable buttons if cart already has items
  //     }
  //   };
  //   fetchCart();
  // }, []);

  // Set defaults from student profile when available
  useEffect(() => {
    if (studentProfile) {
      // Prioritize the nested Level object if it exists and has an ID
      if (studentProfile.Level?.id) {
        setSelectedLevel(studentProfile.Level.id);
      }
      // Fallback to flat levelId if available
      else if (studentProfile.levelId) {
        setSelectedLevel(studentProfile.levelId);
      }
      // Fallback to searching by name
      else if (studentProfile.level || (studentProfile.Level as any)?.name) {
        const levelName =
          studentProfile.level || (studentProfile.Level as any)?.name;
        const matchedLevel = levels.find(
          (l) => l.name.includes(levelName) || l.name === levelName,
        );
        if (matchedLevel) setSelectedLevel(matchedLevel.id);
      }
    }
  }, [studentProfile, levels]);

  // Set current session as default
  useEffect(() => {
    if (sessions?.length > 0 && !selectedSession) {
      const activeSession = sessions.find((s) => s.isActive);
      if (activeSession) {
        setSelectedSession(activeSession.id);
      }
    }
  }, [sessions, selectedSession]);

  // remove aleady registered courses from the department courses
  const filteredCourses = useMemo(() => {
    const registeredCourseIds =
      registrationData?.courses?.map((reg) => reg.courseId) || [];

    return departmentCourses.filter((course) => {
      const isNotRegistered = !registeredCourseIds.includes(course.id);
      const matchesSearch =
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase());
      return isNotRegistered && matchesSearch;
    });
  }, [departmentCourses, registrationData, searchQuery]);

  const handleSelectCourse = (courseCode: string) => {
    setSelectedCoursesInDropdown((prev) =>
      prev.includes(courseCode)
        ? prev.filter((code) => code !== courseCode)
        : [...prev, courseCode],
    );
  };

  const handleAddCourses = () => {
    const coursesToAdd = departmentCourses.filter(
      (course) =>
        selectedCoursesInDropdown.includes(course.id) &&
        !previewedCourses.some((p) => p.id === course.id),
    );

    setPreviewedCourses((prev) => [...prev, ...coursesToAdd]);
    setSelectedCoursesInDropdown([]);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleRemoveCourse = (courseId: string) => {
    // Remove from previewer (frontend only, no API call)
    setPreviewedCourses((prev) =>
      prev.filter((course) => course.id !== courseId),
    );

    // If no courses left, disable the buttons
    const remainingCourses = previewedCourses.filter(
      (course) => course.id !== courseId,
    );
    if (remainingCourses.length === 0) {
      setIsCartConfirmed(false);
    }
  };

  // Handle adding previewed courses to cart via API
  const handleConfirmCourses = async () => {
    if (previewedCourses.length === 0) return;

    setIsAddingToCart(true);
    setCartMessage(null);

    const courseIds = previewedCourses.map((course) => course.id);
    const result = await addCourseToCart(courseIds);

    setIsAddingToCart(false);

    if (result.success) {
      setCartMessage({ type: "success", text: result.message });
      setIsCartConfirmed(true);
      // Auto-dismiss success message after 7 seconds
      setTimeout(() => setCartMessage(null), 7000);
    } else {
      // Replace course IDs in error message with course names for better UX
      let errorMessage = result.message;

      // Find and replace any course ID with its name/code
      [...previewedCourses, ...departmentCourses].forEach((course) => {
        if (errorMessage.includes(course.id)) {
          errorMessage = errorMessage.replace(
            course.id,
            `"${course.code} - ${course.title}"`,
          );
        }
      });

      setCartMessage({ type: "error", text: errorMessage });
      // Clear previewer since API failed - courses weren't added to cart
      setPreviewedCourses([]);
      // Auto-dismiss error message after 7 seconds
      setTimeout(() => setCartMessage(null), 7000);
    }
  };

  const totalUnits = previewedCourses.reduce(
    (sum, course) => sum + course.creditUnits,
    0,
  );

  // Filter registered courses by selected session, or show all if no session selected
  const allCourses = registrationData?.courses || [];
  
  // The API returns the registered session name in `registrationData.session`
  // so we need to match it with the name of the `selectedSession` (which is an ID).
  const selectedSessionName = selectedSession 
    ? sessions.find(s => s.id === selectedSession)?.name 
    : null;

  const registeredCourses = selectedSessionName
    ? (registrationData?.session === selectedSessionName ? allCourses : [])
    : allCourses;



  // Handle course registration
  const handleRegisterCourses = async () => {
    // Get levelId and sessionId from stored user profile
    const storedUser = getStoredUser();
    // Prioritize nested Level object, fallback to flat levelId
    const levelId =
      storedUser?.profile?.Level?.id || storedUser?.profile?.levelId;
    const sessionId =
      storedUser?.profile?.session?.id || storedUser?.profile?.sessionId;

    if (!levelId || !sessionId) {
      toaster.create({
        title: "Session Error",
        description:
          "Unable to retrieve your level or session information. Please log in again.",
        type: "error",
      });
      return;
    }

    setIsRegistering(true);

    const registrationData = {
      // paymentReference: paymentRef,
      levelId,
      sessionId,
      totalCredits: totalUnits,
      // totalAmount: 5000,
    };

    const result = await bulkRegisterCourses(registrationData);
    setIsRegistering(false);

    if (result.success) {
      toaster.create({
        title: "Registration Successful",
        description: result.message,
        type: "success",
      });
      setShowConfirmation(false);
      // Clear the payment reference after successful registration
      // localStorage.removeItem('pendingPaymentReference');
      // Clear cart after successful registration
      setPreviewedCourses([]);
      setIsCartConfirmed(false);
    } else {
      toaster.create({
        title: "Registration Failed",
        description: result.message,
        type: "error",
      });
    }
  };

  // Confirmation Modal
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-3xl lg:rounded-4xl w-full max-w-2xl p-6 lg:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
          <h2 className="text-2xl font-black text-[#1e293b] mb-8">
            Confirm Course Registration
          </h2>

          {/* Courses List */}
          <div className="bg-[#f8fafc] rounded-[20px] p-6 mb-8 max-h-64 overflow-y-auto">
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-4">
              Selected Courses ({previewedCourses.length})
            </h3>
            <div className="space-y-3">
              {previewedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
                >
                  <div>
                    <p className="text-[12px] font-bold text-gray-400">
                      {course.code}
                    </p>
                    <p className="text-[13px] font-bold text-[#1e293b]">
                      {course.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-bold text-gray-400">
                      {course.creditUnits} units
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-gray-400">
                Total Units:
              </p>
              <p className="text-[14px] font-bold text-[#1e293b]">
                {totalUnits} units
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-white border border-gray-200 text-[#1e293b] px-6 py-3 rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleRegisterCourses}
              disabled={isRegistering}
              className="flex-1 bg-[#22c55e] text-white px-6 py-3 rounded-lg text-[13px] font-bold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isRegistering && <Loader2 className="w-4 h-4 animate-spin" />}
              {isRegistering
                ? "Registering..."
                : "Confirm & Proceed to Register"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-10 border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Registration Form Column */}
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-[#1e293b]">
              Course Registration
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Loading...</span>
              </div>
            ) : (
              <div className="space-y-5">
                <FormRow label="Current Level">
                  {(() => {
                    // Get Level from studentProfile or fallback to stored user
                    const storedUser = getStoredUser();
                    const levelData =
                      studentProfile?.Level || storedUser?.profile?.Level;
                    return (
                      <select
                        value={levelData?.id || ""}
                        disabled
                        className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-gray-600 appearance-none focus:outline-none cursor-not-allowed"
                      >
                        <option value={levelData?.id || ""}>
                          {levelData?.name || "Loading..."}
                        </option>
                      </select>
                    );
                  })()}
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={14}
                  />
                </FormRow>

                <FormRow label="Semester">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-gray-600 appearance-none focus:outline-none"
                  >
                    <option value="">Select Semester</option>
                    {semesters?.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {(() => {
                          const sem = semester.name.toLowerCase();
                          if (sem === "semester 1") return "First Semester";
                          if (sem === "semester 2") return "Second Semester";
                          if (sem === "semester 3") return "Third Semester";
                          return semester.name;
                        })()}
                      </option>
                    ))}
                    {/* {semesters
                      ?.filter((semester) => semester.isActive)
                      .map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {(() => {
                            const sem = semester.name.toLowerCase();
                            if (sem === "semester 1") return "First Semester";
                            if (sem === "semester 2") return "Second Semester";
                            return semester.name;
                          })()}
                        </option>
                      ))} */}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={14}
                  />
                </FormRow>

                <FormRow label="Add Course">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        isLoadingCourses
                          ? "Loading courses..."
                          : "Search Course Name or Code"
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={() => setShowDropdown(true)}
                      disabled={isLoadingCourses}
                      className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-[#1e293b] focus:outline-none placeholder:text-gray-300 cursor-pointer disabled:opacity-50"
                    />
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                      size={14}
                    />

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg z-40 overflow-hidden">
                        {/* Scrollable course list */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCourses.length > 0 ? (
                            <div className="p-2">
                              {filteredCourses.map((course) => (
                                <label
                                  key={course.id}
                                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    className={checkboxClasses}
                                    checked={selectedCoursesInDropdown.includes(
                                      course.id,
                                    )}
                                    onChange={() =>
                                      handleSelectCourse(course.id)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="ml-3 flex-1">
                                    <p className="text-[12px] font-bold text-[#1e293b]">
                                      {course.code}
                                    </p>
                                    <p className="text-[11px] text-gray-400 truncate">
                                      {course.title}
                                    </p>
                                  </div>
                                  <span className="text-[11px] font-bold text-gray-400 ml-2">
                                    {course.creditUnits} units
                                  </span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 text-center text-gray-400 text-[12px]">
                              No courses found
                            </div>
                          )}
                        </div>

                        {/* Sticky footer buttons - always visible */}
                        <div className="border-t border-gray-100 p-3 flex justify-between items-center bg-gray-50 rounded-b-xl">
                          <span className="text-[11px] font-bold text-gray-400">
                            {selectedCoursesInDropdown.length} selected
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowDropdown(false);
                                setSelectedCoursesInDropdown([]);
                                setSearchQuery("");
                              }}
                              className="px-4 py-1.5 bg-red-500 text-[11px] font-bold text-white hover:bg-red-600 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAddCourses}
                              disabled={selectedCoursesInDropdown.length === 0}
                              className="px-4 py-1.5 text-[11px] font-bold text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 rounded-lg transition-colors"
                            >
                              Add Selected
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overlay to close dropdown */}
                    {showDropdown && (
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setShowDropdown(false)}
                      />
                    )}
                  </div>
                </FormRow>

                <FormRow label="Carry Over">
                  <select className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl py-2.5 px-4 text-[13px] font-bold text-gray-400 appearance-none focus:outline-none">
                    <option>Yes/No</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={14}
                  />
                </FormRow>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleConfirmCourses}
                disabled={previewedCourses.length === 0 || isAddingToCart}
                className="bg-[var(--color-accent)] text-white px-6 py-2.5 rounded-lg text-[11px] font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isAddingToCart && <Loader2 className="w-4 h-4 animate-spin" />}
                {isAddingToCart ? "Adding..." : "Confirm Course(s)"}
              </button>
              <button className="bg-red-50 border border-red-200 text-red-500 px-6 py-2.5 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors">
                Cancel
              </button>
            </div>

            {/* Cart Message */}
            {cartMessage && (
              <div
                className={`mt-2 p-3 rounded-lg text-[12px] font-medium ${cartMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
                  }`}
              >
                {cartMessage.text}
              </div>
            )}

            <div className="flex space-x-4 pt-6">
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={!isCartConfirmed}
                className="bg-[#22c55e] text-white px-10 py-3 rounded-lg text-[12px] font-bold hover:bg-green-600 disabled:bg-gray-300 transition-colors shadow-sm"
              >
                Register Courses
              </button>
              <button className="bg-red-50 border border-red-200 text-red-500 px-10 py-3 rounded-lg text-xs font-bold hover:bg-red-100 transition-all min-w-30">
                Cancel
              </button>
            </div>
          </div>

          {/* Previewer Column */}
          <div className="bg-[#fcfdfe] rounded-3xl p-6 lg:p-8 border border-gray-100 flex flex-col min-h-100">
            <h2 className="text-sm lg:text-base font-bold text-[#1e293b] mb-2">
              Courses Previewer
            </h2>
            <p className="text-[12px] text-gray-400 mb-6">
              {previewedCourses.length} course(s) selected
            </p>
            <div className="overflow-x-auto flex-1">
              {previewedCourses.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-50">
                      <th className="px-3 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                        Code
                      </th>
                      <th className="px-3 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                        Course Title
                      </th>
                      <th className="px-3 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider text-right">
                        Unit
                      </th>
                      <th className="px-3 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-wider text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {previewedCourses.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-white transition-colors"
                      >
                        <td className="px-3 py-3.5 font-bold text-gray-400 text-[11px]">
                          {course.code}
                        </td>
                        <td className="px-3 py-3.5 font-bold text-[#1e293b] text-xs truncate max-w-45">
                          {course.title}
                        </td>
                        <td className="px-3 py-3.5 font-bold text-gray-400 text-[11px] text-right">
                          {course.creditUnits}
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <button
                            onClick={() => handleRemoveCourse(course.id)}
                            className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-[12px] font-bold">
                  Select courses to preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table: Registered Courses */}
      <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-10 border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-base lg:text-lg font-bold text-[#1e293b]">
              Registered Courses
            </h2>
            {registrationData && (
              <p className="text-xs text-gray-400 mt-1">
                Total Units: {registrationData.totalUnits} /{" "}
                {registrationData.maxAllowedUnits}
              </p>
            )}
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full sm:w-auto bg-blue-50 border border-blue-200 text-[10px] font-bold rounded-lg pl-3 pr-10 py-2.5 text-gray-600 uppercase appearance-none cursor-pointer hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="">Select Session</option>
              {sessions?.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.name} {session.isActive ? "(Current)" : ""}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={12}
            />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
          <table className="w-full text-left min-w-225">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-4 py-4 w-12 text-center">
                  <input type="checkbox" className={checkboxClasses} />
                </th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                  Code
                </th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                  Course Title
                </th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                  Semester
                </th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                  Unit
                </th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                  Course Lecturer(s)
                </th>
                <th className="px-4 py-4 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : registeredCourses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-400 text-sm"
                  >
                    No registered courses found
                  </td>
                </tr>
              ) : (
                registeredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-center">
                      <input type="checkbox" className={checkboxClasses} />
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-400 text-[11px]">
                      {course.code}
                    </td>
                    <td className="px-4 py-4 font-bold text-[#1e293b] text-[11px]">
                      {course.title}
                    </td>
                    <td className="px-4 py-4 text-gray-400 font-medium text-[11px]">
                      {course.semester}
                    </td>
                    <td className="px-4 py-4 text-gray-400 font-bold text-[11px]">
                      {course.creditUnits}
                    </td>
                    <td className="px-4 py-4 text-gray-400 font-medium text-[11px]">
                      {course.lecturer}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${course.status === "registered"
                          ? "bg-[#f0fdf4] text-[#22c55e]"
                          : course.status === "pending"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-red-50 text-red-500"
                          }`}
                      >
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for API data
  const [levels, setLevels] = useState<Level[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [registrationData, setRegistrationData] =
    useState<RegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idCardSettings, setIdCardSettings] = useState<IDCardSettings | null>(
    null,
  );

  // State for ID Card application in Other tab
  const [isViewingID, setIsViewingID] = useState(false);
  const [hasPaidID, setHasPaidID] = useState(() => {
    return localStorage.getItem("idcard_paid") === "true";
  });
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(() => !!getStoredUser()?.avatar);
  const [studentPhoto, setStudentPhoto] = useState<string | null>(() => getStoredUser()?.avatar || null);
  const [paymentCheckTrigger, setPaymentCheckTrigger] = useState(0); // Used to trigger payment re-check

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const storedUser = getStoredUser();
        // Check both direct property and nested profile property as structure can vary
        const programId =
          storedUser?.profile?.programId || storedUser?.programId;

        const [
          levelsData,
          semestersData,
          sessionsData,
          profileData,
          registrationsData,
          idCardData,
        ] = await Promise.all([
          getLevels(programId),
          getSemesters(),
          getSessions(),
          getStudentProfile(),
          getRegistrations(),
          getDefaultIDCard(),
        ]);

        setLevels(levelsData);
        setSemesters(semestersData);
        setSessions(sessionsData);
        setStudentProfile(profileData);
        setRegistrationData(registrationsData);
        setIdCardSettings(idCardData?.template || idCardData?.data || idCardData);
      } catch (err) {
        console.error("Error fetching registration data:", err);
        setError("Failed to load registration data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check for ID Card payment success from API
  useEffect(() => {
    // Debug log to see what studentProfile contains
    console.log("Payment check - studentProfile:", studentProfile);
    console.log("Payment check - studentProfile.id:", studentProfile?.id);
    
    // Only fetch if studentProfile.id is available
    if (!studentProfile?.id) {
      console.log("Payment check - SKIPPING: studentProfile.id is not available");
      return;
    }

    console.log("Payment check - CALLING /student/payments");
    apiClient.get('/student/payments')
      .then((res) => {
        const payments = res.data?.data?.payments ?? res.data?.payments ?? res.data?.data ?? [];
        console.log("Payment check - Payments received:", payments);
        
        // Check for id_card_fee payment using paymentType or meta.payment_type
        const idCardPayment = payments?.find(
          (p: any) => 
            (p.paymentType?.toUpperCase() === "ID CARD FEE" && p.status?.toLowerCase() === "success") || 
            (p.meta?.payment_type === "id_card_fee" && p.status?.toLowerCase() === "success")
        );
        
        console.log("Payment check - ID Card Payment found:", idCardPayment);
        if (idCardPayment) {
          console.log("Payment check - Setting hasPaidID to true");
          setHasPaidID(true);
          localStorage.setItem("idcard_paid", "true");
        } else {
          setHasPaidID(false);
          localStorage.removeItem("idcard_paid");
        }
      })
      .catch((err) => {
        console.error("Payment check - Error:", err);
      });
  }, [studentProfile?.id, paymentCheckTrigger]); // Added paymentCheckTrigger to re-check on demand

  // Re-check payment status when page becomes visible (e.g., user returns from payment gateway)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Trigger payment re-check when page becomes visible
        setPaymentCheckTrigger((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const activeSubTab = (() => {
    if (location.pathname.includes("/registration/transcript"))
      return "transcript";
    if (location.pathname.includes("/registration/other")) return "other";
    return "courses";
  })();

  const handleOtherAction = (action: "view") => {
    if (action === "view") {
      setIsViewingID(true);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-400 mx-auto space-y-4 lg:space-y-6">
      <div className="flex justify-center overflow-x-auto -mx-4 px-4 py-1">
        <div className="bg-white p-1 rounded-[20px] border border-gray-100 flex shadow-sm shrink-0">
          {(["courses", "transcript", "other"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => navigate(`/registration/${tab}`)}
              className={`px-8 lg:px-12 py-3 rounded-2xl text-[12px] lg:text-sm font-bold transition-all duration-300 ${activeSubTab === tab
                ? "bg-[var(--color-accent)] text-white shadow-md"
                : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab === "other"
                ? "ID-Card"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="min-h-150">
        {activeSubTab === "courses" && (
          <CoursesRegView
            levels={levels}
            semesters={semesters}
            sessions={sessions}
            registrationData={registrationData}
            studentProfile={studentProfile}
            isLoading={isLoading}
          />
        )}
        {activeSubTab === "transcript" && <TranscriptRegView />}
        {activeSubTab === "other" &&
          (isViewingID ? (
            <IDCardView
              isPaid={hasPaidID}
              isPhotoUploaded={isPhotoUploaded}
              onBack={() => setIsViewingID(false)}
              studentProfile={studentProfile}
              studentPhoto={studentPhoto}
              idCardSettings={idCardSettings}
              studentName={getStoredUser()?.fullName}
            />
          ) : (
            <OtherServicesView
              hasPaid={hasPaidID}
              onAction={handleOtherAction}
              navigate={navigate}
            />
          ))}
      </div>
    </div>
  );
};

export default Registration;