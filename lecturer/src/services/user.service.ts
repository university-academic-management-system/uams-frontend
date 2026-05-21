import axiosClient from "@configs/axios.config";

export const UserServices = {
    changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
        const { data } = await axiosClient.patch("/user/update-password", payload);
        return data;
    },
    updateProfile: async (id: string, payload: any) => {
        const { data } = await axiosClient.patch(`/users/${id}`, payload);
        return data;
    },
};