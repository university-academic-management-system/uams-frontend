import apiClient from "./api";
import { CreateProjectTopicDto, ProjectTopicResponse, MySupervisorResponse } from "../types/projects.types";

const projectService = {
    createProjectTopic: async (data: CreateProjectTopicDto): Promise<ProjectTopicResponse> => {
        const response = await apiClient.post<ProjectTopicResponse>("/project-topics", data);
        return response.data;
    },

    updateProjectTopic: async (id: string, data: CreateProjectTopicDto): Promise<ProjectTopicResponse> => {
        const response = await apiClient.patch<ProjectTopicResponse>(`/project-topics/${id}`, data);
        return response.data;
    },
    deleteProjectTopic: async (id: string): Promise<ProjectTopicResponse> => {
        const response = await apiClient.delete<ProjectTopicResponse>(`/project-topics/${id}`);
        return response.data;
    },

    getProjectTopics: async (): Promise<{ success: boolean; data: any[] }> => {
        const response = await apiClient.get("/project-topics/my-topics");
        return response.data;
    },

    getSupervisor: async (): Promise<MySupervisorResponse> => {
        const response = await apiClient.get<MySupervisorResponse>("/project-topics/supervisor");
        return response.data;
    },

    startProject: async (topicId: string): Promise<ProjectTopicResponse> => {
        const response = await apiClient.post<ProjectTopicResponse>("/project-topics/start-project", { topicId });
        return response.data;
    }
};

export default projectService;
