import { ResultsApiResponse } from "@/types/results.types";
import apiClient from "./api"

const ResultsServices = {
    getResults: async () => {
        const { data } = await apiClient.get<ResultsApiResponse>(`/results`);
        return data.data
    }
}

export default ResultsServices;

