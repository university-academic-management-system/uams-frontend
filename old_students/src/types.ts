import { Level, Semester, Session, RegistrationData, StudentProfile } from "./services/types";

export type NavigationItem = 'dashboard' | 'projects' | 'courses' | 'registration' | 'timetable' | 'payments' | 'announcements' | 'settings' | 'profile';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  status: 'In Progress' | 'Completed' | 'Upcoming';
  grade?: string;
  progress: number;
}

export interface Payment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CoursesRegViewProps {
  levels: Level[];
  semesters: Semester[];
  sessions: Session[];
  registrationData: RegistrationData | null;
  studentProfile: StudentProfile | null;
  isLoading: boolean;
}
