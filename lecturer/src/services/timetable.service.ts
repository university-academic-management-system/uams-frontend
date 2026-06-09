import axiosClient from "@configs/axios.config";
import type { TimetableData, TimetableResponse } from "@type/timetable.type";

export const getTimetable = async (params: { session: string; semester: string }): Promise<TimetableData> => {
  const { data } = await axiosClient.get<TimetableResponse>("/timetables", { params });
  return data.data;
};