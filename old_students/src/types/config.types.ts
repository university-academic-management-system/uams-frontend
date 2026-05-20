export interface ApiResponse {
  success: boolean;
  data: AcademicData;
}

export interface AcademicData {
  semesters: Semester[];
  sessions: Session[];
  levels: Level[];
  programs: Program[];
}

export interface Semester {
  id: string;
  name: string;
}

export interface Session {
  id: string;
  name: string;  // Format: "2025/2026"
}

export interface Level {
  id: string;
  name: string;  // Format: "100", "200", "300", etc.
}

export interface Program {
  id: string;
  name: string;  // e.g., "Computer Science"
}