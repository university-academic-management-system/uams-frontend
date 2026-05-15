import axiosClient from "@configs/axios.config"


export const StaffServices = {
    getDepartmentLecturers: async () => {
        const { data } = await axiosClient.get("/users?role=STAFF");
        return data;
    },
}