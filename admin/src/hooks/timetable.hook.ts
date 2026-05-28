import { TimetableService } from "@services/timetable.service";
import { useMutation, type UseMutationOptions, useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TimetableData, TimetableParams, CreateTimetableEntryPayload, UpdateTimetableEntryPayload } from "@type/timetable.type";

// ── Hooks ────────────────────────────────────────────────────────────

export const TimetableHook = {
    useTimetable: (
        params: { session: string; semester: string },
        options?: Partial<UseQueryOptions<TimetableData>>
    ) =>
        useQuery<TimetableData>({
            queryKey: ["timetables", params.session, params.semester],
            queryFn: async () => TimetableService.getTimetable(params),
            staleTime: 5 * 60 * 1000,
            enabled: !!params.session && !!params.semester,
            ...options,
        }),
    useUploadTimetable: (
        options?: Partial<UseMutationOptions<void, Error, FormData>>
    ) =>
        useMutation({
            mutationKey: ["upload-timetable"],
            mutationFn: (formData: FormData) => TimetableService.uploadTimetable(formData),
            ...options,
        }),
    useCreateSingleTimetableEntry: (
        options?: Partial<UseMutationOptions<void, Error, CreateTimetableEntryPayload>>
    ) =>
        useMutation({
            mutationKey: ["create-single-timetable-entry"],
            mutationFn: (payload: CreateTimetableEntryPayload) => TimetableService.createSingleTimetableEntry(payload),
            ...options,
        }),
    useUpdateTimetableEntry: (
        options?: Partial<UseMutationOptions<void, Error, {
            id: string;
            payload: UpdateTimetableEntryPayload;
        }>>
    ) =>
        useMutation({
            mutationKey: ["update-timetable-entry"],
            mutationFn: (params) => TimetableService.updateTimetableEntry(params),
            ...options,
        }),
    useDeleteTimetableEntry: (
        options?: Partial<UseMutationOptions<void, Error, string>>
    ) =>
        useMutation({
            mutationKey: ["delete-timetable-entry"],
            mutationFn: (id: string) => TimetableService.deleteTimetableEntry(id),
            ...options,
        }),

    useTimetableParams: (
        options?: Partial<UseQueryOptions<TimetableParams>>
    ) =>
        useQuery<TimetableParams>({
            queryKey: ["timetable-params"],
            queryFn: async () => TimetableService.getTimetableParams(),
            ...options,
        }),
}
