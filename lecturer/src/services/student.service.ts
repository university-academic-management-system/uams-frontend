import axiosClient from "@configs/axios.config"

export const StudentServices = {
    getStudents: async (page?: number, limit?: number) => {
        const { data } = await axiosClient.get("/users?role=STUDENT", {
            params: { page, limit },
        });
        return data;
    },

     getDepartmentStudents: async () => {
        const { data } = await axiosClient.get("/users?role=STUDENT");
        return data;
    },
}