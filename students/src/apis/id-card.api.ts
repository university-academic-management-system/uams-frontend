import axiosClient from "@configs/axios.config"
import type { GetIdCardsResponse, IdCardQueryParams } from "@type/id-card.type"

export const getIdCardsApi = async (params?: IdCardQueryParams): Promise<GetIdCardsResponse["data"]> => {
    const { data } = await axiosClient.get<GetIdCardsResponse>("/id-cards", { params });
    return data.data;
}

export const getTemplatesApi = async () => {
    const { data } = await axiosClient.get("/id-cards/templates");
    return data;
}

export const uploadToStorageApi = async (file: File, folderName?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folderName) {
        formData.append("folderName", folderName);
    }
    const { data } = await axiosClient.post("/storage/passport", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
}
