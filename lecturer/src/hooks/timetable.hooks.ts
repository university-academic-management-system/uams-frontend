import { useQuery } from "@tanstack/react-query";
import { getTimetable } from "@services/timetable.service";
import type { TimetableData } from "@type/timetable.type";

export const useTimetable = (filters: { session: string; semester: string }, enabled = true) => {
  return useQuery<TimetableData>({
    queryKey: ["timetables", filters],
    queryFn: () => getTimetable(filters),
    enabled: enabled && !!filters.session && !!filters.semester,
  });
};