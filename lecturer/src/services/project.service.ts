// services/project.service.ts
import axiosClient from "@configs/axios.config";
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
export const getProjectTopics = async (filters?: ProjectTopicFilters): Promise<ProjectTopic[]> => {
  const response = await axiosClient.get<{ data: ProjectTopic[] }>("/projects/topics", { params: filters });
  return response.data.data;
};

export const createProjectTopic = async (payload: { title: string; description: string }): Promise<ProjectTopic> => {
  const response = await axiosClient.post<{ data: ProjectTopic }>("/projects/topics", payload);
  return response.data.data;
};

export const updateProjectTopic = async (topicId: string, payload: UpdateProjectTopicPayload): Promise<ProjectTopic> => {
  const response = await axiosClient.patch<{ data: ProjectTopic }>(`/projects/topics/${topicId}`, payload);
  return response.data.data;
};

export const approveProjectTopic = async (topicId: string, payload: ApproveTopicPayload): Promise<ApproveProjectTopicResponse> => {
  const response = await axiosClient.patch<{ data: ApproveProjectTopicResponse }>(`/projects/topics/${topicId}/approve`, payload);
  return response.data.data;
};

export const assignSupervisor = async (payload: AssignSupervisorPayload): Promise<AssignSupervisorResponse> => {
  const response = await axiosClient.post<AssignSupervisorResponse>("/supervisors/assign", payload);
  return response.data;
};

export const unassignStudent = async (payload: UnassignStudentPayload): Promise<UnassignStudentResponse> => {
  const response = await axiosClient.delete<UnassignStudentResponse>("/supervisors/unassign", { data: payload });
  return response.data;
};

export const getProjects = async (filters?: ProjectFilters): Promise<Project[]> => {
  const response = await axiosClient.get<{ data: Project[] }>("/projects", { params: filters });
  return response.data.data;
};

export const gradeProject = async (projectId: string, payload: GradeProjectPayload): Promise<GradeProjectResponse> => {
  const response = await axiosClient.post<GradeProjectResponse>(`/projects/${projectId}/grade`, payload);
  return response.data;
};

