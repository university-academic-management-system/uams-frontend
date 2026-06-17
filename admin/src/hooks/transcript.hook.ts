import { TranscriptServices } from "@services/transcript.service";
import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import { toaster } from "@components/ui/toaster";
import type {
    TranscriptQueryParams,
    TranscriptListResponse,
    TranscriptApplication,
    TranscriptStatus,
} from "@type/transcript.type";

export const TranscriptHooks = {
    // Fetch paginated transcript applications
    useTranscriptRequests: (
        params?: TranscriptQueryParams,
        options?: Partial<UseQueryOptions<TranscriptListResponse>>
    ) =>
        useQuery<TranscriptListResponse>({
            queryKey: ["transcript-requests", params],
            queryFn: () => TranscriptServices.getTranscripts(params) as Promise<TranscriptListResponse>,
            ...options,
        }),

    // Update transcript application status
    useUpdateTranscriptStatus: (
        options?: UseMutationOptions<
            { status: string; message: string; data: TranscriptApplication },
            Error,
            { id: string; status: TranscriptStatus }
        >
    ) => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, status }) =>
                TranscriptServices.updateTranscriptStatus(id, status) as Promise<{
                    status: string;
                    message: string;
                    data: TranscriptApplication;
                }>,
            onSuccess: (data) => {
                toaster.success({ title: data.message || "Status updated successfully" });
                queryClient.invalidateQueries({ queryKey: ["transcript-requests"] });
            },
            onError: () => {
                toaster.error({ title: "Failed to update transcript status" });
            },
            ...options,
        });
    },
};
