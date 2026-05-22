import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import projectService from "../services/projects.services";
import { CreateProjectTopicDto } from "../types/projects.types";

const ProjectHooks = {
    useProjectTopics: () => {
        return useQuery({
            queryKey: ["projectTopics"],
            queryFn: () => projectService.getProjectTopics(),
        });
    },
    useDeleteProjectTopic: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (id: string) => projectService.deleteProjectTopic(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["projectTopics"] });
            },
        });
    },

    useUpdateProjectTopic: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ id, data }: { id: string, data: CreateProjectTopicDto }) => projectService.updateProjectTopic(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["projectTopics"] });
            },
        });
    },

    useCreateProjectTopic: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (data: CreateProjectTopicDto) => projectService.createProjectTopic(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["projectTopics"] });
            },
        });
    },

    useSupervisor: () => {
        return useQuery({
            queryKey: ["supervisor"],
            queryFn: () => projectService.getSupervisor(),
        });
    },

    useStartProject: () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: (topicId: string) => projectService.startProject(topicId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["projectTopics"] });
            },
        });
    }
};

export default ProjectHooks;
