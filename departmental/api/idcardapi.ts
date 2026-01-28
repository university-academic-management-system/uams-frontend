
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
    // Sending data as JSON
    const response = await api.put(`/university-admin/id-card/${id}`, data);
    return response.data;
  },

  bulkDownloadIDCards: async (studentIds: string[], templateId: string) => {
    const response = await api.post(
      "/university-admin/id-card/bulk-download",
      { 
        studentIds,
        templateId,
        format: "pdf" 
      },
      { responseType: "blob" }
    );
    return response.data;
  },

  bulkDownloadBanner: async (studentIds: string[]) => {
    const response = await api.post(
      "/university-admin/id-card/bulk/student-banner",
      { 
        studentIds,
        format: "pdf" 
      },
      { responseType: "blob" }
    );
    return response.data;
  }
};
