import { LuUser } from "react-icons/lu";

export interface DashboardStatCardProps {
  label: string
  icon: typeof LuUser
  value: (stats: StudentDashboardData) => string | number
  description?: (stats: StudentDashboardData) => string | undefined
  color?: (stats: StudentDashboardData) => string | undefined
}

export interface TimetableProps {
  stats?: StudentDashboardData;
}

export interface DashboardMetric {
  session: string;
  semesters: {
    semester: string;
    value: string | number;
  }[];
}

export interface AcademicPerformanceChartProps {
  gpa: DashboardMetric[];
  cgpa: DashboardMetric[];
  sgpa: DashboardMetric[];
}

export interface AcademicPerformanceChartProps {
  gpa: DashboardMetric[];
  cgpa: DashboardMetric[];
  sgpa: DashboardMetric[];
}


export interface TimetableEntry {
  id: string;
  courseId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string | null;
  session: string;
  semester: string;
  level: string;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    code: string;
    title: string;
  }
}

export interface TimetableResponse {
  status: string;
  message: string;
  data: {
    semesterStartDate: string;
    semesterEndDate: string;
    entries: TimetableEntry[];
  };
}

export interface StudentDashboardData {
  currentSession: string;
  currentSemester: string;
  department: string;
  faculty: string;
  level: string;
  totalCoursesToBeRegistered: number;
  totalCoursesRegistered: number;
  standing: DashboardMetric[];
  gpa: DashboardMetric[];
  cgpa: DashboardMetric[];
  sgpa: DashboardMetric[];
  academicStanding: string;
  carryoverCourses: number;
}

export interface DashboardResponse {
  status: string;
  message: string;
  data: StudentDashboardData;
}