import { ProgramServices } from "@services/program.service"
import { useQueryClient, useMutation, useSuspenseQuery, type UseMutationOptions } from "@tanstack/react-query"
import type { ProgramTypeResponse } from "@type/program.type"
export const ProgramHooks = {
    useProgramTypes: (options?: any) => useSuspenseQuery<ProgramTypeResponse[]>({
        queryKey: ["program-types"],
        queryFn: ProgramServices.getProgramTypes,
        ...options,
    }),

    useCreateProgramType: (options?: UseMutationOptions<ProgramTypeResponse, Error, Record<string, unknown>>) => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ProgramServices.createProgramType,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["program-types"] });
            },
            ...options
        });
    },

    useDeleteProgramType: (options?: UseMutationOptions<void, Error, string>) => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ProgramServices.deleteProgramType,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["program-types"] });
            },
            ...options
        });
    },

    useUpdateProgramType: (options?: UseMutationOptions<ProgramTypeResponse, Error, { id: string; data: Record<string, unknown> }>) => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, data }) => ProgramServices.updateProgramType(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["program-types"] });
            },
            ...options
        });
    },
}
