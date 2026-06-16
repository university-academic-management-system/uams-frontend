import axiosClient from "@configs/axios.config";
import type { ChangePasswordPayload, ChangePasswordResponse, UpdateContactPayload, UpdateContactResponse } from "@type/auth.type";

export const UserServices = {
    changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
        const { data } = await axiosClient.post("/auth/change-password", payload);
        return data;
    },
    updateProfile: async (payload: UpdateContactPayload): Promise<UpdateContactResponse> => {
        const { data } = await axiosClient.patch("/auth/update-contact", payload);
        return data;
    },
};