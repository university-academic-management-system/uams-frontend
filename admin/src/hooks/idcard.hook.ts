import { IDCardServices } from "@services/idcard.service"
import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query"
import { toaster } from "@components/ui/toaster"
import type { IDCardRequest, IDCardRequestsQuery } from "@type/idCard.type"

interface TemplateUrls {
    frontUrl: string;
    backUrl: string;
    signatureUrl: string;
}

interface UploadTemplateResponse {
    status: string;
    message: string;
    data: {
        type: string;
        key: string;
        templates: {
            frontKey: string;
            backKey: string;
            signatureKey: string;
        };
    };
}

export const IDCardHooks = {
    useIDCard: (options?: Partial<UseQueryOptions<unknown>>) => useQuery<unknown>({
        queryKey: ["idcard-default"],
        queryFn: IDCardServices.getDefaultIDCard,
        ...options,
    }),

    useUpdateIDCard: (options?: UseMutationOptions<unknown, Error, { id: string; data: Record<string, unknown> }>) =>
        useMutation({ mutationFn: ({ id, data }) => IDCardServices.updateIDCard(id, data), ...options }),

    useBulkDownloadIDCards: (options?: UseMutationOptions<unknown, Error, { studentIds: string[]; templateId: string }>) =>
        useMutation({ mutationFn: ({ studentIds, templateId }) => IDCardServices.bulkDownloadIDCards(studentIds, templateId), ...options }),

    useBulkDownloadBanner: (options?: UseMutationOptions<unknown, Error, string[]>) =>
        useMutation({ mutationFn: IDCardServices.bulkDownloadBanner, ...options }),

    // Get presigned URLs for ID card template files
    useIDCardTemplates: (options?: Partial<UseQueryOptions<{ status: string; message: string; data: TemplateUrls }>>) =>
        useQuery<{ status: string; message: string; data: TemplateUrls }>({
            queryKey: ["idcard-templates"],
            queryFn: IDCardServices.getTemplates,
            ...options,
        }),

    // Upload or update an ID card template file
    useUploadIDCardTemplate: (options?: UseMutationOptions<UploadTemplateResponse, Error, { file: File; type: string }>) => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ file, type }) => IDCardServices.uploadTemplate(file, type),
            onSuccess: () => {
                toaster.success({ title: "Template updated successfully" });
                queryClient.invalidateQueries({ queryKey: ["idcard-templates"] });
            },
            onError: () => {
                toaster.error({ title: "Failed to update template" });
            },
            ...options,
        });
    },

    // Get ID card requests with optional filters
    useIDCardRequests: (params?: IDCardRequestsQuery, options?: Partial<UseQueryOptions<{ status: string; message: string; data: IDCardRequest[] }>>) =>
        useQuery<{ status: string; message: string; data: IDCardRequest[] }>({
            queryKey: ["idcard-requests", params],
            queryFn: () => IDCardServices.getIDCardRequests(params),
            ...options,
        }),

    // Upload file to storage
    useUploadToStorage: (options?: UseMutationOptions<{ status: string; message: string; data: { key: string } }, Error, { file: File; folderName?: string }>) => {
        return useMutation({
            mutationFn: ({ file, folderName }) => IDCardServices.uploadToStorage(file, folderName),
            ...options,
        });
    },

    // Update ID card request status and file key
    useUpdateIDCardRequest: (options?: UseMutationOptions<{ status: string; message: string; data: { request: IDCardRequest } }, Error, { id: string; data: { status: string; fileKey: string; paymentRef?: string } }>) => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, data }) => IDCardServices.updateIDCardRequest(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["idcard-requests"] });
            },
            ...options,
        });
    },
}
