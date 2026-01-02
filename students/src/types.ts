
export type NavigationItem = 'dashboard' | 'courses' | 'registration' | 'schedule' | 'payments' | 'settings';

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
