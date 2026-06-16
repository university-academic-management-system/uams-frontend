export interface ProjectTopic {
  title: string;
  description: string;
}

export interface SuggestedProject extends ProjectTopic {
    id: string;
    studentId: string;
    supervisorId: string;
    session: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    approvedById: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AssignedSupervisor {
  supervisorId: string[];
  studentId: string;
}

export interface AssignSupervisorPayload {
  studentId: string[];
  supervisorId: string;
}

export interface AssignSupervisorResponse {
  status: string;
  message: string;
  data: string;
}

export interface UnassignStudent {
  studentId: string;
}

export interface UnassignStudentPayload {
  studentId: string;
}

export interface UnassignStudentResponse {
  status: string;
  message: string;
  data: string;
}

export interface ApproveProjectTopicPayload {
  topicId: string;
  approved: boolean;
}

export interface ApproveProjectTopicResponse {
  status: string;
  message: string;
  data: string;
}

export type UpdateProjectTopicPayload = ProjectTopic

export interface UpdateProjectTopicResponse {
    status: string;
    message: string;
    data: string;
}

export interface Supervisor {
    firstName: string;
    surname: string;
    title: string;
    otherName: string;
    faculty: string;
    department: string;
    user: {
        email: string;
    };
}

export interface Student {
    firstName: string;
    surname: string;
    otherName: string;
    matricNumber: string;
    faculty: string;
    department: string;
    user: {
        email: string;
    };
}

export interface Project {
  id: string;
  studentId: string;
  supervisorId: string;
  approvedTopicId: string;
  session: string;
  status: string;
  googleDriveFileId?: string;
  googleDocUrl?: string;
  googleDocEmail?: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string | null;
  proposalScore?: number | null;
  implementationScore?: number | null;
  documentationScore?: number | null;
  defenseScore?: number | null;
  totalScore?: number | null;
  grade?: string | null;
  gradePoint?: number | null;
  submittedAt?: string | null;
  defenseDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  supervisor?: Supervisor;
  approvedTopic?: ProjectTopic;
}

export interface StudentProjects {
  student: Student;
  projects: Project[];
}

export interface ProjectFilters {
  session?: string;
  status?: Project["status"];
}

export interface ProjectTopicFilters {
  session?: string;
}

export interface ApproveTopicPayload {
  approved: boolean;
  rejectionReason?: string;
}

export interface GradeProject{
  projectId: string;
}

export interface GradeProjectPayload {
  proposalScore: number;
  implementationScore: number;
  documentationScore: number;
  defenseScore: number;
}

export interface GradeProjectResponse {
  status: string;
  message: string;
  data: Project;
}

