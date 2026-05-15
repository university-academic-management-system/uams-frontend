export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: any;
  ipAddress: string;
  createdAt: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLogsResponse {
  success: boolean;
  message: string;
  data: {
    data: AuditLog[];
    pagination: PaginationMetadata;
  };
}
