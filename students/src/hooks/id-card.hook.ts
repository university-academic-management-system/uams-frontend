import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import { getIdCardsApi, getTemplatesApi, uploadToStorageApi } from "@apis/id-card.api"
import { toaster } from "@components/ui/toaster"
import type { IdCardRequest, IdCardQueryParams } from "@type/id-card.type"

export const useIdCards = (
    params?: IdCardQueryParams,
    options?: Partial<UseQueryOptions<IdCardRequest[], Error>>
) => useQuery<IdCardRequest[], Error>({
    queryKey: ["id-cards", params],
    queryFn: () => getIdCardsApi(params),
    ...options
})

export const useIDCardTemplates = (options?: Partial<UseQueryOptions<{ status: string; message: string; data: { frontUrl: string; backUrl: string; signatureUrl?: string } }>>) =>
    useQuery<{ status: string; message: string; data: { frontUrl: string; backUrl: string; signatureUrl?: string } }>({
        queryKey: ["idcard-templates"],
        queryFn: getTemplatesApi,
        ...options,
    })

export const useUploadToStorage = (options?: UseMutationOptions<{ status: string; message: string; data: { key: string } }, Error, { file: File; folderName?: string }>) => {
    return useMutation({
        mutationFn: ({ file, folderName }) => uploadToStorageApi(file, folderName),
        onSuccess: () => {
            toaster.success({ title: "Photo uploaded successfully" });
        },
        onError: () => {
            toaster.error({ title: "Failed to upload photo" });
        },
        ...options,
    })
}
