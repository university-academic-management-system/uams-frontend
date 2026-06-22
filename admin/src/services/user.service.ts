import axiosClient from "@configs/axios.config";
import type { UpdateContactResponse, UpdateContactPayload } from "@type/auth.type";

export const UserServices = {
    changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
        const { data } = await axiosClient.post("/auth/change-password", payload);
        return data;
    },
    updateContact: async (payload: UpdateContactPayload) => {
        const { id, ...rest } = payload;
        const { data } = await axiosClient.patch<UpdateContactResponse>(`/users/${id}`, rest);
        return data;
    },
};
