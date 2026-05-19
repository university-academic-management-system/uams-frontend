import { useQuery } from "@tanstack/react-query";
import { CourseService } from "@services/course.service";
import { StudentServices } from "@services/student.service";
import type { Course } from "@type/course.type";
import type { Student } from "@type/student.type";

export const CourseHook = {
  useAllCourses: () => {
    return useQuery<Course[]>({
      queryKey: ["courses"],
      queryFn: async () => {
        const response = await CourseService.getAllCourses();
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  },

  useCourse: (courseId: string) => {
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
  },

  useCheckCourseOwnership: (courseId: string) => {
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
  },

  useCourseStudents: (courseId: string) => {
    return useQuery<Student[]>({
      queryKey: ["courses", courseId, "students"],
      queryFn: async () => {
        const coursesResponse = await CourseService.getAllCourses();
        const course = coursesResponse.data.find((c) => c.id === courseId);
        if (!course) return [];

        const studentsResponse = await StudentServices.getDepartmentStudents();
        const allStudents = (studentsResponse?.data || []) as Student[];

        return allStudents.filter(
          (student) => student.studentProfile?.level === course.level
        );
      },
      enabled: !!courseId,
      staleTime: 5 * 60 * 1000,
    });
  },

  useCourseStudent: (courseId: string, studentId: string) => {
    return useQuery<Student>({
      queryKey: ["courses", courseId, "students", studentId],
      queryFn: async () => {
        const studentsResponse = await StudentServices.getDepartmentStudents();
        const allStudents = (studentsResponse?.data || []) as Student[];
        const student = allStudents.find((s) => s.id === studentId);
        if (!student) {
          throw new Error("Student not found");
        }
        return student;
      },
      enabled: !!courseId && !!studentId,
      staleTime: 5 * 60 * 1000,
    });
  },
};