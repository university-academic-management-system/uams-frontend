import { AttendanceService } from "@services/attendance.service";
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { Attendance, CreateAttendancePayload, CourseAttendanceRecord, RecordAttendanceResult } from "@type/attendance.type";

export const AttendanceHook = {
    useLecturerAttendance: (
        params?: { courseId?: string; date?: string },
        options?: Partial<UseQueryOptions<Attendance[]>>
    ) =>
        useQuery<Attendance[]>({
            queryKey: ["lecturerAttendance", params],
            queryFn: async () => AttendanceService.getLecturerAttendance(params),
            ...options,
        }),

    useCourseAttendance: (
        courseId: string,
        params?: { date?: string; status?: string; session?: string },
        options?: Partial<UseQueryOptions<CourseAttendanceRecord[]>>
    ) =>
        useQuery<CourseAttendanceRecord[]>({
            queryKey: ["courseAttendance", courseId, params],
            queryFn: async () => AttendanceService.getCourseAttendance(courseId, params),
            enabled: !!courseId,
            ...options,
        }),

    useCreateAttendance: () => {
        const queryClient = useQueryClient();
        return useMutation<RecordAttendanceResult[], Error, CreateAttendancePayload>({
            mutationFn: (payload: CreateAttendancePayload) => AttendanceService.createAttendance(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["lecturerAttendance"] });
                queryClient.invalidateQueries({ queryKey: ["courseAttendance"] });
            },
        });
    },

    createAttendance: async (payload: CreateAttendancePayload) => {
        return AttendanceService.createAttendance(payload);
    }
};

