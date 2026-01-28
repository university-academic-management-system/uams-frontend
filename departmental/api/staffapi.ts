import api from "./axios";
import { AssignCoursePayload } from "./types";

export const staffApi = {
  assignCourses: async (lecturerId: string, payload: AssignCoursePayload) => {
    const response = await api.post(
      `/university-admin/lecturers/${lecturerId}/courses`,
      payload
    );
    return response.data;
  },

  bulkDownloadStaff: async (lecturerIds: string[]) => {
    const response = await api.post(
      "/university-admin/lecturers/bulk/download",
      {
        lecturerId: lecturerIds,
        format: "csv",
      },
      {
        responseType: "blob", // Important for file download
      }
    );
    return response.data;
  },

  bulkDeleteStaff: async (lecturerIds: string[]) => {
    const response = await api.post(
      "/university-admin/lecturers/bulk/delete",
      {
        lecturerId: lecturerIds,
      }
    );
    return response.data;
  },
};
