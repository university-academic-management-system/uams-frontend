// @hooks/programme.hook.ts
import { useQuery } from "@tanstack/react-query";
import { getAllProgrammes, getProgrammeById } from "@services/programme.service";
import type { ProgrammeFilters } from "@type/programme.type";

const PROGRAMMES_QUERY_KEY = "programmes";

export const useProgrammes = (filters?: ProgrammeFilters) => {
  return useQuery({
    queryKey: [PROGRAMMES_QUERY_KEY, filters],
    queryFn: () => getAllProgrammes(filters),
  });
};

export const useProgramme = (id: string) => {
  return useQuery({
    queryKey: [PROGRAMMES_QUERY_KEY, id],
    queryFn: () => getProgrammeById(id),
    enabled: !!id,
  });
};


