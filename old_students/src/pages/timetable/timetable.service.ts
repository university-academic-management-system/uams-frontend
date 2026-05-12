import apiClient from "@/services/api";
import type { TimetableItem, TimetableParams } from "./timetable.type";

export const TimetableService = {
    getTimetable: async (): Promise<TimetableItem[]> => {
        const { data } = await apiClient.get<{ data: TimetableItem[] }>(`/timetables`)
        return data.data;
    },
    getTimetableParams: async (): Promise<TimetableParams> => {
        const { data } = await apiClient.get<{ data: TimetableParams }>(`/timetables/params`)
        return data.data;
    },
    uploadTimetable: async (formData: FormData): Promise<void> => {
        await apiClient.post(`/timetables`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};
