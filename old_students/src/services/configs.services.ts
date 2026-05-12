import { ApiResponse } from "@/types/config.types";
import apiClient from "./api"

const ConfigServices = {
    getConfigs: async () => {
        const { data } = await apiClient.get<ApiResponse>(`/configs`);
        return data.data
    }
}

export default ConfigServices

