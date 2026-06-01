export interface ProjectTopic {
    title: string;
    description: string;
}

export interface SuggestedTopic extends ProjectTopic {
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

export interface SuggestTopicsPayload {
    topics: ProjectTopic[];
}

export type UpdateProjectTopicPayload = ProjectTopic

export interface SuggestTopicsResponse {
    status: string;
    message: string;
    data: string;
}

export interface UpdateProjectTopicResponse {
    status: string;
    message: string;
    data: string;
}

export interface GetProjectTopicsResponse {
    status: string;
    message: string;
    data: SuggestedTopic[];
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

export interface Project {
    id: string;
    studentId: string;
    supervisorId: string;
    approvedTopicId: string | null;
    session: string;
    status: string;
    googleDriveFileId: string | null;
    googleDocUrl: string | null;
    googleDocEmail: string | null;
    emailVerified: boolean;
    emailVerifiedAt: string | null;
    proposalScore: number | null;
    implementationScore: number | null;
    documentationScore: number | null;
    defenseScore: number | null;
    totalScore: number | null;
    grade: string | null;
    gradePoint: number | null;
    submittedAt: string | null;
    defenseDate: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    student: {
        matricNumber: string;
        firstName: string;
        surname: string;
        otherName: string;
        user: {
            email: string;
        };
    };
    supervisor: Supervisor;
    approvedTopic: SuggestedTopic | null;
}

export interface GetProjectsResponse {
    status: string;
    message: string;
    data: Project;
}

export interface GoogleConnectResponse {
    status: string;
    message: string;
    data: {
        authUrl: string;
    };
}

export interface StartProjectResponse {
    status: string;
    message: string;
    data: Project;
}
