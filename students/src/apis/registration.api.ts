import axiosClient from "@configs/axios.config"
import type {
    TranscriptsResponse,
    TranscriptQueryParams,
    CreateTranscriptData,
    CreateTranscriptResponse,
    InitializePaymentRequest,
    InitializePaymentResponse,
    PaymentType,
    PaymentDetailsResponse,
    DeliveryMethod
} from "@type/registration.type"

export const fetchTranscriptsApi = async (params?: TranscriptQueryParams) => {
    const { data } = await axiosClient.get<TranscriptsResponse>("/transcripts", { params });
    return data.data;
}

export const createTranscriptApi = async (payload: CreateTranscriptData) => {
    const { data } = await axiosClient.post<CreateTranscriptResponse>("/transcripts", payload);
    return data.data;
}

export const initializePaymentApi = async (payload: InitializePaymentRequest): Promise<InitializePaymentResponse["data"]> => {
    const { data } = await axiosClient.post<InitializePaymentResponse>("/payments/initialize", payload);
    return data.data;
}

export const getPaymentDetailsApi = async (paymentType: PaymentType | string, deliveryMethod?: DeliveryMethod | string): Promise<PaymentDetailsResponse["data"]> => {
    const { data } = await axiosClient.get<PaymentDetailsResponse>(`/payments/${paymentType}/details`, {
        params: { deliveryMethod }
    });
    return data.data;
}
