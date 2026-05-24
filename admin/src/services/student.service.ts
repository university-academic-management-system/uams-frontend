import axiosClient from "@configs/axios.config"
import type { CreateStudentPayload, StudentFilters } from "@type/student.type"

export const StudentServices = {
    getStudents: async (page?: number, limit?: number) => {
        const { data } = await axiosClient.get("/users?role=STUDENT", {
            params: { page, limit },
        });
        return data;
    },

    getDepartmentStudents: async (filters?: StudentFilters) => {
        const { data } = await axiosClient.get("/users", {
            params: { role: "STUDENT", ...filters },
        });
        return data;
    },

    getStudentProfile: async (studentId: string) => {
        const { data } = await axiosClient.get(`/students/profile/${studentId}`);
        return data;
    },

    bulkUploadStudents: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "STUDENT");

        const { data } = await axiosClient.post(
            "/users/bulk-upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return data;
    },

    bulkDownloadStudents: async (studentIds: string[]) => {
        const { data } = await axiosClient.post(
            "/university-admin/students/bulk-download",
            { studentIds, format: "csv" },
            { responseType: "blob" }
        );
        return data;
    },

    bulkDeleteStudents: async (studentIds: string[], reason: string) => {
        const { data } = await axiosClient.post(
            "/university-admin/students/bulk-delete",
            { studentIds, reason }
        );
        return data;
    },

    assignClassRepRole: async (userId: string, role: string) => {
        const { data } = await axiosClient.post("/class-rep/assign", { userId, role });
        return data;
    },

    updateStudent: async (id: string, data: Partial<CreateStudentPayload>) => {
        const { data: response } = await axiosClient.patch(`/users/${id}`, data);
        return response;
    },

    deleteStudent: async (id: string) => {
        const { data } = await axiosClient.delete(`/users/${id}`);
        return data;
    },

    addStudent: async (payload: CreateStudentPayload) => {
        const { data } = await axiosClient.post("/users", { ...payload, type: "STUDENT" });
        return data;
    },
}
