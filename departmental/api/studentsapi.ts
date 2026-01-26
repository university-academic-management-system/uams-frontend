
import api from "./axios";

export const studentsApi = {
  /**
   * Bulk upload students via CSV
   * POST /university-admin/students/bulk-upload
   */
  bulkUploadStudents: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      "/university-admin/students/bulk-upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
