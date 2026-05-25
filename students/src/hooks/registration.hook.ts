import { fetchTranscriptsApi, createTranscriptApi, initializePaymentApi, getPaymentDetailsApi } from "@apis/registration.api"
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import type { 
    TranscriptsData, 
    TranscriptQueryParams, 
    CreateTranscriptData, 
    CreateTranscriptResponse, 
    InitializePaymentRequest,
    InitializePaymentResponse,
    DeliveryMethod,
    PaymentType,
    PaymentDetailsResponse
} from "@type/registration.type"

export const useTranscripts = (
    params?: TranscriptQueryParams,
    options?: UseQueryOptions<TranscriptsData, Error>
) => useQuery<TranscriptsData, Error>({
    queryKey: ["transcripts", params],
    queryFn: () => fetchTranscriptsApi(params),
    ...options
})

export const useCreateTranscript = (
    options?: UseMutationOptions<CreateTranscriptResponse["data"], Error, CreateTranscriptData>
) => useMutation<CreateTranscriptResponse["data"], Error, CreateTranscriptData>({
    mutationFn: (payload: CreateTranscriptData) => createTranscriptApi(payload),
    ...options
})

export const usePaymentDetails = (
    paymentType: PaymentType | string, 
    deliveryMethod?: DeliveryMethod | string, 
    options?: Partial<UseQueryOptions<PaymentDetailsResponse["data"], Error>>
) => useQuery<PaymentDetailsResponse["data"], Error>({
    queryKey: ["payment-details", paymentType, deliveryMethod],
    queryFn: () => getPaymentDetailsApi(paymentType, deliveryMethod),
    ...options
})


export const useInitializePayment = (options?: UseMutationOptions<InitializePaymentResponse["data"], Error, InitializePaymentRequest, unknown>) => useMutation<InitializePaymentResponse["data"], Error, InitializePaymentRequest, unknown>({
    mutationFn: (payload: InitializePaymentRequest) => initializePaymentApi(payload),
    ...options
})