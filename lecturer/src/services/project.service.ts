// @services/project.service.ts
import axiosClient from "@configs/axios.config";
import type {
  Project,
  ProjectTopic,
  ProjectFilters,
  ProjectTopicFilters,
  CreateProjectTopicPayload,
  UpdateProjectTopicPayload,
  ApproveTopicPayload,
  BulkAssignPayload,
  GradeProjectPayload,
} from "@type/project.type";

// Project Topics
export const getProjectTopics = async (filters?: ProjectTopicFilters): Promise<ProjectTopic[]> => {
  const params = filters || {};
  const response = await axiosClient.get<{ data: ProjectTopic[] }>("/projects/topics", { params });
  return response.data.data;
};

export const createProjectTopic = async (payload: CreateProjectTopicPayload): Promise<ProjectTopic> => {
  const response = await axiosClient.post<{ data: ProjectTopic }>("/projects/topics", payload);
  return response.data.data;
};

export const updateProjectTopic = async (topicId: string, payload: UpdateProjectTopicPayload): Promise<ProjectTopic> => {
  const response = await axiosClient.patch<{ data: ProjectTopic }>(`/projects/topics/${topicId}`, payload);
  return response.data.data;
};

export const approveProjectTopic = async (topicId: string, payload: ApproveTopicPayload): Promise<ProjectTopic> => {
  const response = await axiosClient.patch<{ data: ProjectTopic }>(`/projects/topics/${topicId}/approve`, payload);
  return response.data.data;
};

// Projects
export const getProjects = async (filters?: ProjectFilters): Promise<Project[]> => {
  const params = filters || {};
  const response = await axiosClient.get<{ data: Project[] }>("/projects", { params });
  return response.data.data;
};

export const startProject = async (): Promise<Project> => {
  const response = await axiosClient.post<{ data: Project }>("/projects/start");
  return response.data.data;
};

export const gradeProject = async (projectId: string, payload: GradeProjectPayload): Promise<Project> => {
  const response = await axiosClient.patch<{ data: Project }>(`/projects/${projectId}/grade`, payload);
  return response.data.data;
};

// Supervisor Assignment (HOD/Admin)
export const bulkAssignSupervisors = async (payload: BulkAssignPayload): Promise<void> => {
  await axiosClient.post("/projects/assign", payload);
};

export const unassignStudent = async (studentId: string): Promise<void> => {
  await axiosClient.delete(`/projects/students/${studentId}/unassign`);
};