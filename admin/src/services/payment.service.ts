import axiosClient from "@configs/axios.config"
import type { PaymentsResponse } from "@type/payment.type"

export const PaymentServices = {

    getPaymentConfig: async (programTypeId: string) => {
        const { data } = await axiosClient.get(`/university-admin/payment-config?program_type_id=${programTypeId}`);
        return data;
    },

    patchPaymentConfig: async (payload: any) => {
        const { data } = await axiosClient.patch("/university-admin/payment-config", payload);
        return data;
    },

    getPaymentReceipt: async (paymentId: string) => {
        const { data } = await axiosClient.get(`/university-admin/payments/${paymentId}/receipt`, { responseType: "blob" });
        return data;
    },

    getTranscriptApplications: async (programTypeId?: string) => {
        const params = programTypeId ? { program_type_id: programTypeId } : {};
        const { data } = await axiosClient.get("/university-admin/transcripts/applications", { params });
        return data; 
    },
    
    getPaymentsSummary: async () => {
        const { data } = await axiosClient.get("/payments");
        return data;
    },

    getPaymentsByType: async (
        programTypeCode: string,
        paymentType: string,
        page = 1,
        limit = 10,
        search = "",
        status = "",
        session = "",
        level = "",
        semester = "",
        startDate = "",
        endDate = ""
    ) => {
        const { data } = await axiosClient.get(`/payments/${programTypeCode}/${paymentType}`, {
            params: { page, limit, search, status, session, level, semester, startDate, endDate }
        });
        return data;
    },

    getPayments: async (
        page = 1, 
        limit = 10, 
        search = "", 
        status = "", 
        type = "",
        session = "",
        level = "",
        semester = ""
    ): Promise<PaymentsResponse> => {
        const { data } = await axiosClient.get("/payments", {
            params: { page, limit, search, status, type, session, level, semester }
        });
        return data;
    },
}