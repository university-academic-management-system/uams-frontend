import axiosClient from "@configs/axios.config";
import type { Attendance, CreateAttendancePayload, AttendanceResponse, CourseAttendanceRecord, RecordAttendanceResult, UpdateAttendancePayload } from "@type/attendance.type";


export const AttendanceService = {
    createAttendance: async (payload: CreateAttendancePayload): Promise<RecordAttendanceResult[]> => {
        const { data } = await axiosClient.post<{ data: RecordAttendanceResult[] }>("/attendance", payload);
        return data.data;
    },

    updateAttendance: async (attendanceId: string, payload: UpdateAttendancePayload): Promise<RecordAttendanceResult> => {
        const { data } = await axiosClient.patch<{ data: RecordAttendanceResult }>(`/attendance/${attendanceId}`, payload);
        return data.data;
    },

    getLecturerAttendance: async (params?: { courseId?: string; date?: string }): Promise<Attendance[]> => {
        const { data } = await axiosClient.get<AttendanceResponse>("/attendance/lecturer", { params });
        return data.data;
    },

    getCourseAttendance: async (
        courseId: string,
        params?: { date?: string; status?: string; session?: string }
    ): Promise<CourseAttendanceRecord[]> => {
        const { data } = await axiosClient.get<{ data: CourseAttendanceRecord[] }>(
            `/attendance/courses/${courseId}`,
            { params }
        );
        return data.data;
    },
};

