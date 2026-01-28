
import api from "./axios";

export const studentsApi = {
  /**
   * Bulk upload students via CSV
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

  /**
   * Bulk download student template/data
   */
  bulkDownloadStudents: async (studentIds: string[]) => {
    const response = await api.post(
      "/university-admin/students/bulk-download",
      { studentIds, format: "csv" },
      {
        responseType: "blob", 
      }
    );
    return response.data;
  },

  /**
   * Bulk delete students
   */
  bulkDeleteStudents: async (studentIds: string[], reason: string) => {
    const response = await api.post("/university-admin/students/bulk-delete", {
      studentIds,
      reason,
    });
    return response.data;
  },

  
   /* Get student profile */
  getStudentProfile: async (studentId: string) => {
    const response = await api.get(`/students/profile/${studentId}`);
    return response.data;
  },

  /**
   * GET /students/department-students
   */
  getDepartmentStudents: async () => {
    const response = await api.get("/students/department-students");
    return response.data;
  },
};
