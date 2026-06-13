
export interface UserBasic {
  email: string;
}

export interface Student {
  id: string;
  matricNumber: string;
  firstName: string;
  surname: string;
  otherName?: string;
  user?: UserBasic;
}

export interface SupervisorBasic {
  firstName: string;
  surname: string;
  title: string;
  otherName?: string;
  faculty?: string;
  department?: string;
  user?: UserBasic;
}

export interface ProjectTopic {
  id: string;
  studentId: string;
  supervisorId: string;
  session: string;
  title: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedById?: string;
  approvedAt?: string;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  supervisor?: SupervisorBasic;
}

export interface Project {
  id: string;
  studentId: string;
  supervisorId: string;
  approvedTopicId: string;
  session: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "GRADED";
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
  supervisor?: SupervisorBasic;
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

export interface CreateProjectTopicPayload {
  title: string;
  description: string;
}

export interface UpdateProjectTopicPayload {
  title?: string;
  description?: string;
}

export interface ApproveTopicPayload {
  approved: boolean;
  rejectionReason?: string;
}

export interface BulkAssignPayload {
  assignments: {
    studentId: string;
    supervisorId: string;
  }[];
}

export interface GradeProjectPayload {
  proposalScore: number;
  implementationScore: number;
  documentationScore: number;
  defenseScore: number;
}