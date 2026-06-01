import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { getIdCardsApi } from "@apis/id-card.api"
import type { IdCardRequest, IdCardQueryParams } from "@type/id-card.type"

export const useIdCards = (
    params?: IdCardQueryParams,
    options?: Partial<UseQueryOptions<IdCardRequest[], Error>>
) => useQuery<IdCardRequest[], Error>({
    queryKey: ["id-cards", params],
    queryFn: () => getIdCardsApi(params),
    ...options
})
