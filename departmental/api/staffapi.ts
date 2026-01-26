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
};
