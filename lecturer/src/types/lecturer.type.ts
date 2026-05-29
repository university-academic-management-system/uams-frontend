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
  courses?: any[];
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

export interface LecturersTableProps {
  lecturers: Staff[];
  isLoading?: boolean;
}

export const LECTURERS_TABLE_COLUMNS = [
  { key: "sn",            label: "S/N",            width: "60px"  },
  { key: "staffId",       label: "Staff ID",       width: "140px" },
  { key: "name",          label: "Name",           width: "160px" },
  { key: "email",         label: "Email",          width: "200px" },
  { key: "phoneNo",       label: "Phone No",       width: "160px" },
  { key: "role",          label: "Role",           width: "100px" },
  { key: "AssignedCourse",label: "Assigned Course",width: "160px" },
  { key: "action",        label: "Action",         width: "70px"  },
] as const;