import { useQuery } from "@tanstack/react-query";
import { TimetableService } from "@services/timetable.service";
import type { TimetableEntry } from "@type/timetable.type";

export const TimetableHook = {
  useTimetable: (filters?: { session?: string; semester?: string }, enabled = true) => {
    return useQuery<TimetableEntry[]>({
      queryKey: ["timetables", filters],
      queryFn: async () => {
        const response = await TimetableService.getTimetable(filters);
        return response.data;
      },
      enabled: enabled,
    });
  },
};