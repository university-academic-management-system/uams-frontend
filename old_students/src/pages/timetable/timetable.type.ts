export interface TimetableItem {
  id: string;
  title: string;
  semester: {
    id: string;
    name: string;
  };
  level: {
    id: string;
    name: string;
  };
  session: {
    id: string;
    name: string;
  };
  programme: {
    id: string;
    name: string;
  };
  schedule: {
    monday?: CourseSlot[];
    tuesday?: CourseSlot[];
    wednesday?: CourseSlot[];
    thursday?: CourseSlot[];
    friday?: CourseSlot[];
    saturday?: CourseSlot[];
    sunday?: CourseSlot[];
  };
}

export interface CourseSlot {
  endTime: string;
  courseId: string;
  startTime: string;
  courseCode: string;
  originalText: string;
}

export interface TimetableResponse {
  success: boolean;
  data: TimetableItem[];
}


export interface TimetableParams {
  semesters: Array<{ id: string; name: string }>;
  sessions: Array<{ id: string; name: string }>;
  levels: Array<{ id: string; name: string }>;
  programs: Array<{ id: string; name: string }>;
}