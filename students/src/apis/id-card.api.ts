import axiosClient from "@configs/axios.config"
import type { GetIdCardsResponse, IdCardQueryParams } from "@type/id-card.type"

export const getIdCardsApi = async (params?: IdCardQueryParams): Promise<GetIdCardsResponse["data"]> => {
    const { data } = await axiosClient.get<GetIdCardsResponse>("/id-cards", { params });
    return data.data;
}
