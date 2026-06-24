// hooks/result.hook.ts
import { ResultService } from "@services/result.service";
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type {
  ResultUpload,
  TranscriptResponse,
  UploadDraftPayload,
  RejectPayload,
  CourseResultsResponse,
} from "@type/result.type";

export const ResultHook = {
  // Get academic transcript for a student
  useTranscript: (studentId: string, options?: Partial<UseQueryOptions<TranscriptResponse>>) =>
    useQuery<TranscriptResponse>({
      queryKey: ["transcript", studentId],
      queryFn: async () => ResultService.getTranscript(studentId),
      enabled: !!studentId,
      staleTime: 5 * 60 * 1000,
      ...options,
    }),

  // Get all pending results (ERO/Admin)
  usePendingResults: (options?: Partial<UseQueryOptions<ResultUpload[]>>) =>
    useQuery<ResultUpload[]>({
      queryKey: ["results", "pending"],
      queryFn: async () => ResultService.getPendingResults(),
      staleTime: 5 * 60 * 1000,
      ...options,
    }),

  // Get all approved results (ERO/Admin) 
  useApprovedResults: (
    session?: string,
    semester?: string,
    options?: Partial<UseQueryOptions<ResultUpload[]>>
  ) =>
    useQuery<ResultUpload[]>({
      queryKey: ["results", "approved", { session, semester }],
      queryFn: async () => ResultService.getApprovedResults(session, semester),
      staleTime: 5 * 60 * 1000,
      ...options,
    }),

  // Upload draft results (Lecturer)
  useUploadDraft: (options?: { onSuccess?: (data: Record<string, string>) => void }) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: UploadDraftPayload) => ResultService.uploadDraftResults(payload),
      onSuccess: (data) => {
        // Invalidate pending results list to show new upload
        queryClient.invalidateQueries({ queryKey: ["results", "pending"] });
        options?.onSuccess?.(data);
      },
    });
  },

  // Download draft results file (returns a download URL)
  useDownloadDraft: () => {
    return useMutation({
      mutationFn: (resultUploadId: string) => ResultService.downloadDraftResults(resultUploadId),
    });
  },

  // Reject draft results (ERO/Admin)
  useRejectDraft: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: RejectPayload }) =>
        ResultService.rejectDraftResults(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["results", "pending"] });
        queryClient.invalidateQueries({ queryKey: ["results", "approved"] });
      },
    });
  },

  // Upload final approved results (ERO/Admin)
  useUploadFinal: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, file }: { id: string; file: File }) =>
        ResultService.uploadFinalResults(id, file),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["results", "pending"] });
        queryClient.invalidateQueries({ queryKey: ["results", "approved"] });
      },
    });
  },

  // Get course results for a specific course (Lecturer)
  useCourseResults: (
    courseId: string,
    level?: string,
    semester?: string,
    options?: Partial<UseQueryOptions<CourseResultsResponse>>
  ) =>
    useQuery<CourseResultsResponse>({
      queryKey: ["results", "course", courseId, { level, semester }],
      queryFn: async () => ResultService.getCourseResults(courseId, level, semester),
      enabled: !!courseId,
      staleTime: 5 * 60 * 1000,
      ...options,
    }),
};