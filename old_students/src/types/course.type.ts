export interface CourseData {
  status: string;
  data: AcademicYearData;
}

export interface AcademicYearData {
  "2025/2026": YearData;
}

export interface YearData {
  "100": LevelData;  // 100 level courses
}

export interface LevelData {
  "First Semester": Course[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  learningHours: number;
  practicalHours: number;
  isRegistered: boolean;
}