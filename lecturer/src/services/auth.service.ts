import axiosClient from "@configs/axios.config"
import type { ProfileResponse, UserData } from "@type/auth.type"

export const AuthServices = {
    getProfile: async () => {
        const { data } = await axiosClient.get<ProfileResponse>("/auth/me");
        return data.data;
    },
}