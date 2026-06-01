import { connectGoogleApi, getProjectsApi, getProjectTopicsApi, startProjectApi, suggestProjectTopicsApi, updateProjectTopicApi } from "@apis/project.api"
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query"
import type { GoogleConnectResponse, Project, StartProjectResponse, SuggestedTopic, SuggestTopicsPayload, SuggestTopicsResponse, UpdateProjectTopicPayload, UpdateProjectTopicResponse } from "@type/project.type"

export const useSuggestProjectTopics = (
    options?: UseMutationOptions<SuggestTopicsResponse, Error, SuggestTopicsPayload>
) => useMutation<SuggestTopicsResponse, Error, SuggestTopicsPayload>({
    mutationFn: (payload: SuggestTopicsPayload) => suggestProjectTopicsApi(payload),
    ...options
})

export const useUpdateProjectTopic = (
    topicId: string,
    options?: UseMutationOptions<UpdateProjectTopicResponse, Error, UpdateProjectTopicPayload>
) => useMutation<UpdateProjectTopicResponse, Error, UpdateProjectTopicPayload>({
    mutationFn: (payload: UpdateProjectTopicPayload) => updateProjectTopicApi(topicId, payload),
    ...options
})

export const useGetProjectTopics = (
    session?: string,
    options?: UseQueryOptions<SuggestedTopic[], Error>
) => useQuery<SuggestedTopic[], Error>({
    queryKey: ["project-topics", session],
    queryFn: () => getProjectTopicsApi(session),
    ...options
})

export const useGetProjects = (
    options?: UseQueryOptions<Project, Error>
) => useQuery<Project, Error>({
    queryKey: ["projects"],
    queryFn: () => getProjectsApi(),
    ...options
})

export const useConnectGoogle = (
    options?: UseMutationOptions<GoogleConnectResponse, Error, void>
) => useMutation<GoogleConnectResponse, Error, void>({
    mutationFn: () => connectGoogleApi(),
    ...options
})

export const useStartProject = (
    options?: UseMutationOptions<StartProjectResponse, Error, void>
) => useMutation<StartProjectResponse, Error, void>({
    mutationFn: () => startProjectApi(),
    ...options
})
