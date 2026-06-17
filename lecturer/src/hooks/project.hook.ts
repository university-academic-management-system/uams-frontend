// hooks/project.hook.ts
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  getProjectTopics,
  createProjectTopic,
  updateProjectTopic,
  approveProjectTopic,
  assignSupervisor,
  unassignStudent,
  getProjects,
  gradeProject,
} from "@services/project.service";
import type {
  ProjectTopic,
  Project,
  AssignSupervisorPayload,
  AssignSupervisorResponse,
  UnassignStudentPayload,
  UnassignStudentResponse,
  ApproveTopicPayload,
  UpdateProjectTopicPayload,
  GradeProjectPayload,
  GradeProjectResponse,
  ProjectFilters,
  ProjectTopicFilters,
  ApproveProjectTopicResponse,
} from "@type/project.type";

// ---------- Project Topics ----------
export const useProjectTopics = (
  filters?: ProjectTopicFilters,
  options?: UseQueryOptions<ProjectTopic[], Error>
) =>
  useQuery<ProjectTopic[], Error>({
    queryKey: ["project-topics", filters],
    queryFn: () => getProjectTopics(filters),
    ...options,
  });

export const useCreateProjectTopic = (
  options?: UseMutationOptions<ProjectTopic, Error, { title: string; description: string }>
) =>
  useMutation<ProjectTopic, Error, { title: string; description: string }>({
    mutationFn: (payload) => createProjectTopic(payload),
    ...options,
  });

export const useUpdateProjectTopic = (
  options?: UseMutationOptions<ProjectTopic, Error, { topicId: string; payload: UpdateProjectTopicPayload }>
) =>
  useMutation<ProjectTopic, Error, { topicId: string; payload: UpdateProjectTopicPayload }>({
    mutationFn: ({ topicId, payload }) => updateProjectTopic(topicId, payload),
    ...options,
  });

export const useApproveProjectTopic = (
  options?: UseMutationOptions<ApproveProjectTopicResponse, Error, { topicId: string; payload: ApproveTopicPayload }>
) =>
  useMutation<ApproveProjectTopicResponse, Error, { topicId: string; payload: ApproveTopicPayload }>({
    mutationFn: ({ topicId, payload }) => approveProjectTopic(topicId, payload),
    ...options,
  });

// ---------- Supervisor Assignment ----------
export const useAssignSupervisor = (
  options?: UseMutationOptions<AssignSupervisorResponse, Error, AssignSupervisorPayload>
) =>
  useMutation<AssignSupervisorResponse, Error, AssignSupervisorPayload>({
    mutationFn: (payload) => assignSupervisor(payload),
    ...options,
  });

export const useUnassignStudent = (
  options?: UseMutationOptions<UnassignStudentResponse, Error, UnassignStudentPayload>
) =>
  useMutation<UnassignStudentResponse, Error, UnassignStudentPayload>({
    mutationFn: (payload) => unassignStudent(payload),
    ...options,
  });

// ---------- Projects ----------
export const useProjects = (filters?: ProjectFilters, options?: UseQueryOptions<Project[], Error>) =>
  useQuery<Project[], Error>({
    queryKey: ["projects", filters],
    queryFn: () => getProjects(filters),
    ...options,
  });

export const useGradeProject = (
  options?: UseMutationOptions<GradeProjectResponse, Error, { projectId: string; payload: GradeProjectPayload }>
) =>
  useMutation<GradeProjectResponse, Error, { projectId: string; payload: GradeProjectPayload }>({
    mutationFn: ({ projectId, payload }) => gradeProject(projectId, payload),
    ...options,
  });