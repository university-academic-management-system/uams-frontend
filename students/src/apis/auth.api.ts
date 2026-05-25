import axiosClient from "@configs/axios.config"
import type { MeResponse } from "@type/auth.type"


export const meApi = async () => {
    const { data } = await axiosClient.get<MeResponse>("/auth/me");
    return data.data;
}

export const logoutApi = async () => {
    await axiosClient.post("/auth/logout");
    return true;
}
