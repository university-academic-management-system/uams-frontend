// api/academicsApi.ts

import api from "./axios";

export interface Level {
  id: string;
  name: string;
  code: string;
}

export interface Semester {
  id: string;
  name: string;
  isActive: boolean;
}

/** API */
export const academicsApi = {
  async getLevels(): Promise<Level[]> {
    const res = await api.get("/accademics/levels");
    return res.data;
  },

  async getSemesters(): Promise<Semester[]> {
    const res = await api.get("/accademics/semesters");
    return res.data;
  },
};
