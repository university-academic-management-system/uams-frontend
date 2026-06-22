import axiosClient from "@configs/axios.config";
import type { TimetableData, TimetableResponse, CreateTimetableEntryPayload, UpdateTimetableEntryPayload } from "@type/timetable.type";

export const TimetableService = {
    getTimetable: async (params: { session: string; semester: string }): Promise<TimetableData> => {
        const { data } = await axiosClient.get<TimetableResponse>(`/timetables`, { params });
        return data.data;
    },

    // The timetable template file is a static file built into the frontend's public/documents folder, not a backend API endpoint.
    downloadTimetableTemplate: async (): Promise<Blob> => {
        const response = await fetch(`/admin/documents/timetable-template.xlsx`);
        if (!response.ok) throw new Error("File not found");
        return response.blob();
    },
    uploadTimetable: async (formData: FormData): Promise<void> => {
        await axiosClient.post(`/timetables/bulk-upload`, formData);
    },

    createSingleTimetableEntry: async (payload: CreateTimetableEntryPayload): Promise<void> => {
        await axiosClient.post(`/timetables`, payload);
    },

    updateTimetableEntry: async ({ id, payload }: {
        id: string; payload: UpdateTimetableEntryPayload; }): Promise<void> => {
        await axiosClient.patch(`/timetables/${id}`, payload);
    },

    deleteTimetableEntry: async (id: string): Promise<void> => {
        await axiosClient.delete(`/timetables/${id}`);
    },
};
