export type DayOfWeek = 
  | "MONDAY" 
  | "TUESDAY" 
  | "WEDNESDAY" 
  | "THURSDAY" 
  | "FRIDAY" 
  | "SATURDAY" 
  | "SUNDAY";

export type Semester = "FIRST" | "SECOND" | "THIRD";

export type Level = "L100" | "L200" | "L300" | "L400" | "L500" | "GRADUATED" | "WITHDRAWN";

export const SEMESTERS: Semester[] = ["FIRST", "SECOND", "THIRD"];
export const LEVELS: Level[] = ["L100", "L200", "L300", "L400", "L500", "GRADUATED", "WITHDRAWN"];

export interface TimetableEntry {
  id: string;
  courseId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;  
  endTime: string;     
  venue: string;
  session: string;     
  semester: Semester;
  level: Level;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

export type TimetableResponse = ApiResponse<TimetableEntry[]>;