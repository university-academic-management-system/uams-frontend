export interface StaffProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  otherName: string;
  staffNumber: string;
  phone: string;
  department: string;
  staffRoles: string[];     
  title: string;
  specialization: string;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  id: string;              
  email: string;
  role: string;              
  status: string;           
  staffProfile: StaffProfile;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T[];
  pagination: PaginationMeta;
}

export type StaffResponse = ApiResponse<Staff>;