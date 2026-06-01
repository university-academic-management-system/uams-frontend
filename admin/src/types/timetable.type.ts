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
  };
}

export interface TimetableData {
  semesterStartDate: string;
  semesterEndDate: string;
  entries: TimetableEntry[];
}

export interface TimetableResponse {
  status: string;
  message: string;
  data: TimetableData;
}

export interface TimetableParams {
  semesters: Array<{ id: string; name: string }>;
  sessions: Array<{ id: string; name: string }>;
  levels: Array<{ id: string; name: string }>;
  programs: Array<{ id: string; name: string }>;
}

export interface CreateTimetableEntryPayload {
  courseId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  venue?: string;
  session: string;
  semester: string;
  level: string;
}

export interface UpdateTimetableEntryPayload {
  courseId?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  venue?: string;
  session?: string;
  semester?: string;
  level?: string;
}