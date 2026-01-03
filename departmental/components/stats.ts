export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  Student: {
    studentId: string;
    levelId: string;
    programId: string;
  } | null;
  Lecturer: any;
  DepartmentAdmin: {
    departmentId: string;
  } | null;
  FacultyAdmin: {
    facultyId: string;
  } | null;
  UniversityAdmin: {
    title: string;
  } | null;
}

export interface UsersResponse {
  message: string;
  count: number;
  users: User[];
}

export interface StatsData {
  totalStudents: number;
  totalRevenue: number;
  academicStaff: number;
  isLoading: boolean;
  error: string | null;
}
