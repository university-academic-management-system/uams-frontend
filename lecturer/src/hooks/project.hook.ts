// @hooks/project.hook.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectTopics,
  createProjectTopic,
  updateProjectTopic,
  approveProjectTopic,
  getProjects,
  startProject,
  gradeProject,
  bulkAssignSupervisors,
  unassignStudent,
  deleteProjectTopic,
} from "@services/project.service";
import type {
  ProjectTopicFilters,
  CreateProjectTopicPayload,
  UpdateProjectTopicPayload,
  ApproveTopicPayload,
  ProjectFilters,
  GradeProjectPayload,
  BulkAssignPayload,
} from "@type/project.type";

const PROJECT_TOPICS_KEY = "project-topics";
const PROJECTS_KEY = "projects";

// Project Topics
export const useProjectTopics = (filters?: ProjectTopicFilters) => {
  return useQuery({
    queryKey: [PROJECT_TOPICS_KEY, filters],
    queryFn: () => getProjectTopics(filters),
  });
};

export const useCreateProjectTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectTopicPayload) => createProjectTopic(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_TOPICS_KEY] });
    },
  });
};

export const useUpdateProjectTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, payload }: { topicId: string; payload: UpdateProjectTopicPayload }) =>
      updateProjectTopic(topicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_TOPICS_KEY] });
    },
  });
};

export const useApproveProjectTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, payload }: { topicId: string; payload: ApproveTopicPayload }) =>
      approveProjectTopic(topicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_TOPICS_KEY] });
    },
  });
};

// Projects 
export const useProjects = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: [PROJECTS_KEY, filters],
    queryFn: () => getProjects(filters),
  });
};

export const useStartProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => startProject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
  });
};

export const useGradeProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: string; payload: GradeProjectPayload }) =>
      gradeProject(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
    },
  });
};

// Assignment (Admin/HOD) 
export const useBulkAssignSupervisors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkAssignPayload) => bulkAssignSupervisors(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [PROJECT_TOPICS_KEY] });
    },
  });
};

export const useUnassignStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => unassignStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [PROJECT_TOPICS_KEY] });
    },
  });
};

export const useDeleteProjectTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (topicId: string) => deleteProjectTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_TOPICS_KEY] });
    },
  });
};