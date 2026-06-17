import axiosClient from "@configs/axios.config"

export const ConfigServices = {

    /**
     * GET /configs/{key}
     * Fetch an app configuration by key.
     * Pass `programmeId` when key = "payments".
     */
    getConfig: async (key: string, programmeId?: string) => {
        const { data } = await axiosClient.get(`/configs/${key}`, {
            params: programmeId ? { programmeId } : undefined,
        });
        return data;
    },

    /**
     * PUT /configs/{key}
     * Create or update an app configuration.
     */
    updateConfig: async (key: string, payload: Record<string, unknown>) => {
        const { data } = await axiosClient.put(`/configs/${key}`, payload);
        return data;
    },
}
