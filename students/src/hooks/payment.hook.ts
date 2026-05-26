import { getPaymentByReferenceApi } from "@apis/payment.api"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { Payment } from "@type/payment.type"

export const usePaymentByReference = (
    reference: string,
    options?: Partial<UseQueryOptions<Payment, Error>>
) => useQuery<Payment, Error>({
    queryKey: ["payment", reference],
    queryFn: () => getPaymentByReferenceApi(reference),
    enabled: false,
    ...options
})
