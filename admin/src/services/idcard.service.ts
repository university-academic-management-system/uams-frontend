import axiosClient from "@configs/axios.config"
import type { IDCardRequestsQuery } from "@type/idCard.type"

export const IDCardServices = {

    // get the Active Default ID-Card Template
    getDefaultIDCard: async () => {
        const { data } = await axiosClient.get("/university-admin/id-card/default");
        return data;
    },

    // get all ID-Card Templates
    getAllIDCard: async () => {
        const { data } = await axiosClient.get("/university-admin/id-card-all");
        return data;
    },

    // create ID-Card Template
    createIDCard: async (payload: Record<string, unknown>) => {
        const { data } = await axiosClient.post("/university-admin/id-card", payload);
        return data;
    },

    // delete an ID-Card Template
    deleteIDCard: async (id: string, payload: Record<string, unknown>) => {
        const { data } = await axiosClient.delete(`/university-admin/id-card/${id}`, payload);
        return data;
    },

    // update an ID-Card Template
    updateIDCard: async (id: string, payload: Record<string, unknown>) => {
        const { data } = await axiosClient.put(`/university-admin/id-card/${id}`, payload);
        return data;
    },

    // set an ID-Card Template as default
    activateIDCard: async (id: string, payload: Record<string, unknown>) => {
        const { data } = await axiosClient.patch(`/university-admin/id-card/${id}/set-default`, payload);
        return data;
    },

    bulkDownloadIDCards: async (studentIds: string[], templateId: string) => {
        const { data } = await axiosClient.post(
            "/university-admin/id-card/bulk-download",
            { studentIds, templateId, format: "pdf" },
            { responseType: "blob" }
        );
        return data;
    },

    bulkDownloadBanner: async (studentIds: string[]) => {
        const { data } = await axiosClient.post(
            "/university-admin/id-card/student-banner",
            { studentIds, format: "pdf" },
            { responseType: "blob" }
        );
        return data;
    },

    // Upload or update an ID card template file (front, back, or signature)
    uploadTemplate: async (file: File, type: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        const { data } = await axiosClient.put("/id-cards/templates", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

    // Get presigned URLs for ID card template files
    getTemplates: async () => {
        const { data } = await axiosClient.get("/id-cards/templates");
        return data;
    },

    // Get ID card requests with optional filters
    getIDCardRequests: async (params?: IDCardRequestsQuery) => {
        const { data } = await axiosClient.get("/id-cards", {
            params: {
                status: params?.status,
                studentId: params?.studentId,
                department: params?.department,
            },
        });
        return data;
    },

    // Upload file to storage
    uploadToStorage: async (file: File, folderName?: string) => {
        const formData = new FormData();
        formData.append("file", file);
        if (folderName) {
            formData.append("folderName", folderName);
        }
        const { data } = await axiosClient.post("/storage/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

    // Update ID card request status and file key
    updateIDCardRequest: async (id: string, payload: { status: string; fileKey: string; paymentRef?: string }) => {
        const { data } = await axiosClient.patch(`/id-cards/${id}`, payload);
        return data;
    },
}
