export interface ResultsApiResponse {
  success: boolean;
  data: AcademicYearResults;
}

export interface AcademicYearResults {
  [academicYear: string]: LevelResults;
}

export interface LevelResults {
  [level: string]: SemesterResults;  // level: "100", "200", etc.
}

export interface SemesterResults {
  [semester: string]: CourseResult[];  // semester: "First Semester", "Second Semester"
}

export interface CourseResult {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  isRegistered: boolean;
  result: ResultDetail | null;
}

export interface ResultDetail {
  id: string;
  totalScore: number;
  letterGrade: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  examScore: number;
  caScore: number;        // CA = Continuous Assessment
  practical: number;
  test: number;
  remarks: string | null;
}