import axiosClient from "@configs/axios.config"
import type { LoginData, LoginResponse, SignupFormData, SignupResponse } from "@type/auth.type"
import { sleep } from "@utils/function.util";

export const loginApi = async (payload: LoginData) => {
    const { data } = await axiosClient.post<LoginResponse>("/auth/login", payload);

    await sleep(3000);
    return data;
}

export const signupApi = async (payload: SignupFormData) => {
    const { data } = await axiosClient.post<SignupResponse>("/auth/signup", payload);
    return data;
}

export const logoutApi = async () => {

}