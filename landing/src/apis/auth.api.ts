import axiosClient from "@configs/axios.config"
import type {
    LoginData,
    LoginResponse,
    ActivateAccountRequest,
    ActivateAccountResponse,
    InitializePaymentRequest,
    InitializePaymentResponse,
    VerifyStudentResponse,
    PaymentDetailsResponse,
    PaymentType,
    DeliveryMethod,
} from "@type/auth.type"

/**
 * AUTH API
 * Standalone API methods for authentication and student account management.
 */

export const loginApi = async (payload: LoginData): Promise<LoginResponse> => {
    const { data } = await axiosClient.post<LoginResponse>("/auth/login", payload);
    return data;
}

export const logoutApi = async () => {
    // Optional: Implementation for logout if needed
}

export const verifyStudentApi = async (studentId: string): Promise<VerifyStudentResponse> => {
    const { data } = await axiosClient.post<VerifyStudentResponse>("/auth/activate", { matricNumber: studentId });
    return data;
}

export const activateAccountApi = async (payload: ActivateAccountRequest): Promise<ActivateAccountResponse> => {
    const { data } = await axiosClient.patch<ActivateAccountResponse>("/auth/activate", payload);
    return data;
}

export const initializePaymentApi = async (payload: InitializePaymentRequest): Promise<InitializePaymentResponse> => {
    const { data } = await axiosClient.post<InitializePaymentResponse>("/payments/initialize", payload);
    return data;
}

export const getPaymentDetailsApi = async (paymentType: PaymentType | string, deliveryMethod?: DeliveryMethod | string): Promise<PaymentDetailsResponse> => {
    const { data } = await axiosClient.get<PaymentDetailsResponse>(`/payments/${paymentType}/details`, {
        params: { deliveryMethod }
    });
    return data;
}


export const forgotPasswordApi = async (payload: { email: string }): Promise<{ status: string; message: string; data: null }> => {
    const { data } = await axiosClient.post("/auth/password", payload);
    return data;
}

export const verifyOtpApi = async (payload: { email: string; otp: string }): Promise<LoginResponse> => {
    const { data } = await axiosClient.post<LoginResponse>("/auth/verify", payload);
    return data;
}

export const resendOtpApi = async (payload: { email: string }): Promise<{ status: string; message: string; data: null }> => {
    const { data } = await axiosClient.post("/auth/password", payload);
    return data;
}

export const resetPasswordApi = async (payload: unknown): Promise<{ status: string; message: string; data: null }> => {
    const { data } = await axiosClient.patch("/auth/password", payload);
    return data;
}
