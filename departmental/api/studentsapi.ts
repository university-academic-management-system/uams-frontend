
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
