import axiosClient from "@configs/axios.config"
import type { CreateLecturerPayload, StaffFilters } from "@type/staff.type"

export const StaffServices = {
    addLecturer: async (payload: CreateLecturerPayload) => {
        const { data } = await axiosClient.post("/users", payload);
        return data;
    },

    updateLecturer: async (id: string, payload: Partial<CreateLecturerPayload>) => {
        const { data } = await axiosClient.patch(`/users/${id}`, payload);
        return data;
    },

    assignCourse: async (payload: { courseIds: string[]; lecturerId: string; session: string }) => {
        const { data } = await axiosClient.post("/courses/assignments", payload);
        return data;
    },

    unassignCourse: async (assignmentId: string) => {
        await axiosClient.delete(`/courses/assignments/${assignmentId}`);
    },

    
    assignStudent: async (lecturerId: string, payload: { studentId: string; level?: string }) => {
        const { data } = await axiosClient.post(
            `/university-admin/lecturers/${lecturerId}/students`,
            payload
        );
        return data;
    },

    getDepartmentLecturers: async (filters?: StaffFilters) => {
        const { data } = await axiosClient.get("/users", {
            params: { role: "STAFF", ...filters },
        });
        return data;
    },

    deleteLecturer: async (id: string) => {
        const { data } = await axiosClient.delete(`/users/${id}`);
        return data;
    },

    bulkDownloadStaff: async (lecturerIds: string[]) => {
        const { data } = await axiosClient.post(
            "/university-admin/lecturers/bulk/download",
            { lecturerIds, format: "csv" },
            { responseType: "blob" }
        );
        return data;
    },

    bulkDeleteStaff: async (lecturerIds: string[]) => {
        const { data } = await axiosClient.delete(`/users/${lecturerIds}`);
        return data;
    },

    bulkUploadLecturers: async (formData: FormData) => {
        formData.append("type", "STAFF");
        const { data } = await axiosClient.post(
            "/users/bulk-upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
    },
}