import axiosClient from "@configs/axios.config"
import type { ChangePasswordPayload, ChangePasswordResponse, MeResponse, UpdateContactPayload, UpdateContactResponse } from "@type/auth.type"


export const meApi = async () => {
    const { data } = await axiosClient.get<MeResponse>("/auth/me");
    return data.data;
}

export const logoutApi = async () => {
    await axiosClient.post("/auth/logout");
    return true;
}

export const updateContactApi = async (payload: UpdateContactPayload) => {
    const { data } = await axiosClient.patch<UpdateContactResponse>("/auth/update-contact", payload);
    return data;
}

export const changePasswordApi = async (payload: ChangePasswordPayload) => {
    const { data } = await axiosClient.post<ChangePasswordResponse>("/auth/change-password", payload);
    return data;
}
