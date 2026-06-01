import axiosClient from "@configs/axios.config"
import type { GetPaymentsResponse, PaymentResponse } from "@type/payment.type"

export const getPaymentByReferenceApi = async (reference: string): Promise<PaymentResponse["data"]> => {
    const { data } = await axiosClient.get<PaymentResponse>(`/payments/${reference}`);
    return data.data;
}

export const getPaymentsApi = async (params?: {
    session?: string;
    level?: string;
    type?: string;
    semester?: string;
    page?: number;
    limit?: number;
}) => {
    const { data } = await axiosClient.get<GetPaymentsResponse>("/payments", { params });
    return data;
}
