import { meApi } from "@apis/auth.api"
import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { MeResponse } from "@type/auth.type"


// auth hook
export const useMe = (options?: UseQueryOptions<MeResponse["data"], Error>) => useQuery<MeResponse["data"], Error>({
    queryKey: ["me"],
    queryFn: () => meApi(),
    ...options
})