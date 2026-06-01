import axiosClient from "@configs/axios.config"
import type { GetProjectsResponse, GetProjectTopicsResponse, GoogleConnectResponse, StartProjectResponse, SuggestTopicsPayload, SuggestTopicsResponse, UpdateProjectTopicPayload, UpdateProjectTopicResponse } from "@type/project.type"

export const suggestProjectTopicsApi = async (payload: SuggestTopicsPayload) => {
    const { data } = await axiosClient.post<SuggestTopicsResponse>("/projects/topics", payload);
    return data;
}

export const updateProjectTopicApi = async (topicId: string, payload: UpdateProjectTopicPayload) => {
    const { data } = await axiosClient.patch<UpdateProjectTopicResponse>(`/projects/topics/${topicId}`, payload);
    return data;
}

export const getProjectTopicsApi = async (session?: string) => {
    const { data } = await axiosClient.get<GetProjectTopicsResponse>("/projects/topics", {
        params: { session }
    });
    return data.data;
}



export const getProjectsApi = async () => {
    const { data } = await axiosClient.get<GetProjectsResponse>("/projects");
    return data.data;
}

export const connectGoogleApi = async () => {
    const { data } = await axiosClient.get<GoogleConnectResponse>("/projects/google/connect");
    return data;
}

export const startProjectApi = async () => {
    const { data } = await axiosClient.post<StartProjectResponse>("/projects/start");
    return data;
}
