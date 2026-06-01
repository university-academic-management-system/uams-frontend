import { getPaymentByReferenceApi, getPaymentsApi } from "@apis/payment.api"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { GetPaymentsResponse, Payment } from "@type/payment.type"

export const usePaymentByReference = (
    reference: string,
    options?: Partial<UseQueryOptions<Payment, Error>>
) => useQuery<Payment, Error>({
    queryKey: ["payment", reference],
    queryFn: () => getPaymentByReferenceApi(reference),
    enabled: false,
    ...options
})

export const useGetPayments = (
    params?: {
        session?: string;
        level?: string;
        type?: string;
        semester?: string;
        page?: number;
        limit?: number;
    },
    options?: UseQueryOptions<GetPaymentsResponse, Error>
) => useQuery<GetPaymentsResponse, Error>({
    queryKey: ["payments", params],
    queryFn: () => getPaymentsApi(params),
    ...options
})
