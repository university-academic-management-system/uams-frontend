import { useQuery } from "@tanstack/react-query";
import { CourseService } from "@services/course.service";
import type { Course, CourseEnrollment } from "@type/course.type";

export const useAllCourses = (filters?: { level?: string; semester?: string; session?: string }) => {
  return useQuery<Course[]>({
    queryKey: ["courses", filters],
    queryFn: async () => {
      const response = await CourseService.getAllCourses(filters);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourse = (courseId: string) => {
  return useQuery<Course & { lecturers?: Array<{ name: string; email: string }> }>({
    queryKey: ["courses", courseId],
    queryFn: async () => {
      const response = await CourseService.getAllCourses();
      const course = response.data.find((c) => c.id === courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      return course;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCheckCourseOwnership = (courseId: string) => {
  return useQuery<{ isAssigned: boolean }>({
    queryKey: ["courses", courseId, "ownership"],
    queryFn: async () => {
      const response = await CourseService.getAllCourses();
      const isAssigned = response.data.some((c) => c.id === courseId);
      return { isAssigned };
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseStudents = (courseId: string, session?: string) => {
  return useQuery<CourseEnrollment[]>({
    queryKey: ["courses", courseId, "students", session],
    queryFn: async () => {
      const response = await CourseService.getStudentsForCourse(courseId, session);
      return response.data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCourseStudent = (courseId: string, studentId: string, session?: string) => {
  return useQuery<CourseEnrollment>({
    queryKey: ["courses", courseId, "students", session, studentId],
    queryFn: async () => {
      const response = await CourseService.getStudentsForCourse(courseId, session);
      const student = response.data.find((s) => s.student.id === studentId);
      if (!student) {
        throw new Error("Student not found");
      }
      return student;
    },
    enabled: !!courseId && !!studentId,
    staleTime: 5 * 60 * 1000,
  });
};