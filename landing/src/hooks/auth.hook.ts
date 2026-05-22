import { 
    loginApi, 
    forgotPasswordApi, 
    verifyStudentApi, 
    activateAccountApi, 
    initializePaymentApi, 
    getPaymentDetailsApi,
    verifyOtpApi,
    resendOtpApi,
    resetPasswordApi
} from "@services/auth.api"
import { useMutation, type UseMutationOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { type AxiosError } from "axios"
import type { 
    LoginData, 
    LoginResponse, 
    ActivateAccountRequest, 
    ActivateAccountResponse, 
    InitializePaymentRequest,
    InitializePaymentResponse, 
    ResetPasswordData,
    VerifyStudentResponse,
    PaymentDetailsResponse,
    PaymentType,
    DeliveryMethod,
} from "@type/auth.type"


// auth hooks

export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginData, unknown>) => useMutation<LoginResponse, Error, LoginData, unknown>({
    mutationFn: (payload: LoginData) => loginApi(payload),
    ...options
})

export const useForgotPassword = (options?: UseMutationOptions<{ status: string; message: string; data: null }, Error, { email: string }, unknown>) => useMutation<{ status: string; message: string; data: null }, Error, { email: string }, unknown>({
    mutationFn: (payload: { email: string }) => forgotPasswordApi(payload),
    ...options
})

export const useVerifyStudent = (options?: UseMutationOptions<VerifyStudentResponse, Error, string, unknown>) => useMutation<VerifyStudentResponse, Error, string, unknown>({
    mutationFn: (studentId: string) => verifyStudentApi(studentId),
    ...options
})

export const useActivateAccount = (options?: UseMutationOptions<ActivateAccountResponse, Error, ActivateAccountRequest, unknown>) => useMutation<ActivateAccountResponse, Error, ActivateAccountRequest, unknown>({
    mutationFn: (payload: ActivateAccountRequest) => activateAccountApi(payload),
    ...options
})

export const useInitializePayment = (options?: UseMutationOptions<InitializePaymentResponse, Error, InitializePaymentRequest, unknown>) => useMutation<InitializePaymentResponse, Error, InitializePaymentRequest, unknown>({
    mutationFn: (payload: InitializePaymentRequest) => initializePaymentApi(payload),
    ...options
})

export const usePaymentDetails = (
    paymentType: PaymentType | string, 
    deliveryMethod?: DeliveryMethod | string, 
    options?: Partial<UseQueryOptions<PaymentDetailsResponse, Error>>
) => useQuery<PaymentDetailsResponse, Error>({
    queryKey: ["payment-details", paymentType, deliveryMethod],
    queryFn: () => getPaymentDetailsApi(paymentType, deliveryMethod),
    ...options
})


export const useVerifyOtp = (options?: UseMutationOptions<LoginResponse, AxiosError<{ message?: string }>, { email: string; otp: string }, unknown>) => useMutation<LoginResponse, AxiosError<{ message?: string }>, { email: string; otp: string }, unknown>({
    mutationFn: (payload: { email: string; otp: string }) => verifyOtpApi(payload),
    ...options
})

export const useResendOtp = (options?: UseMutationOptions<{ status: string; message: string; data: null }, Error, { email: string }, unknown>) => useMutation<{ status: string; message: string; data: null }, Error, { email: string }, unknown>({
    mutationFn: (payload: { email: string }) => resendOtpApi(payload),
    ...options
})

export const useResetPassword = (options?: UseMutationOptions<{ status: string; message: string; data: null }, Error, ResetPasswordData, unknown>) => useMutation<{ status: string; message: string; data: null }, Error, ResetPasswordData, unknown>({
    mutationFn: (payload: ResetPasswordData) => resetPasswordApi(payload),
    ...options
})
