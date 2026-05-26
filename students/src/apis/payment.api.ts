import axiosClient from "@configs/axios.config"
import type { PaymentResponse } from "@type/payment.type"

export const getPaymentByReferenceApi = async (reference: string): Promise<PaymentResponse["data"]> => {
    const { data } = await axiosClient.get<PaymentResponse>(`/payments/${reference}`);
    return data.data;
}
