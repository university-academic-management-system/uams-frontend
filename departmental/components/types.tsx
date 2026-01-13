export type ViewType =
  | "Dashboard"
  | "Program & Courses"
  | "Students"
  | "Staff"
  | "Payments"
  | "ID Card Management"
  | "Announcements"
  | "Settings"
  | "Notifications";

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ChartDataItem {
  year: string;
  value: number;
}

// Authentication related interfaces
export interface AuthData {
  token: string;
  role: string;
  tenantId: string;
  universityId: string;
  facultyId: string | null;
  departmentId: string | null;
  email?: string;
  username?: string;
}

export interface UserSession {
  authData: AuthData | null;
  isLoggedIn: boolean;
}

// Login component props
export interface LoginProps {
  onLogin: (authData: AuthData) => void;
}

// API Response interface for login
export interface LoginResponse {
  token: string;
  role: string;
  tenantId: string;
  universityId: string;
  facultyId: string | null;
  departmentId: string | null;
}

// In your types.ts file, update the Student interface:
// types.ts
export type StudentRole =
  | "Class Rep"
  | "Dept Rep"
  | "None"
  | "Bachelors"
  | "PGD"
  | "Masters";

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phoneNo: string;
  department: string;
  level: string;
  programId: string;
  role: StudentRole;
  createdAt: string;
  isActive: boolean;
}
