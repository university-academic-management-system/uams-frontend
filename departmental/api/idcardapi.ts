
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
   * Update ID Card settings (Placeholder for Save functionality)
   * PUT /university-admin/id-card/{id} - assuming this will be needed later
   */
  updateIDCard: async (id: string, data: any) => {
    // This is distinct from the save logic requested later or if implied by "Save Changes"
    // For now the user only asked for GET
  }
};
