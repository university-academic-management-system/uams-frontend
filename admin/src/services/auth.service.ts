import axiosClient from "@configs/axios.config"
import type { LoginData, LoginResponse, ProfileResponse, ChangePasswordResponse, ChangePasswordData } from "@type/auth.type"

export const AuthServices = {
    login: async (payload: LoginData) => {
        const { data } = await axiosClient.post<LoginResponse>("/auth/signin", payload);
        return data;
    },
    logout: async () => {
        await axiosClient.post("/auth/logout");
    },
    getProfile: async () => {
        const { data } = await axiosClient.get<ProfileResponse>("/auth/me");
        return data;
    },
    changePassword: async (payload: ChangePasswordData) => {
        const { data } = await axiosClient.post<ChangePasswordResponse>("/auth/change-password", payload);
        return data;
    },
}