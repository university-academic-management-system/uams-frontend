export interface ProjectDocument {
    startedAt: string;
    googleDocId: string;
    googleDocUrl: string;
}

export interface ProjectTopic {
    id: string;
    title: string;
    description: string;
    document?: ProjectDocument | null;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectTopicDto {
    title: string;
    description: string;
    document?: string;
}

export interface ProjectTopicResponse {
    success: boolean;
    data: ProjectTopic;
    message?: string;
}

export interface Supervisor {
    id: string;
    name: string | null;
    email: string | null;
    staffNumber: string | null;
    assignmentId: string;
    sessionId: string;
}

export interface MySupervisorResponse {
    success: boolean;
    data: Supervisor | null;
}
