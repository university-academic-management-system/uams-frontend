
import api from "./axios";

export const idCardApi = {
  /**
   * Get default ID Card settings
   */
  getDefaultIDCard: async () => {
    const response = await api.get("/university-admin/id-card/default");
    return response.data;
  },

  /**
   * Update ID Card settings
   */
  updateIDCard: async (id: string, data: any) => {
    // Using FormData for potential file uploads
    const response = await api.put(`/university-admin/id-card/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return response.data;
  }
};
