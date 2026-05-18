import { z } from "zod";

export const ProgramTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().optional(),
});
export type ProgramTypeFormData = z.infer<typeof ProgramTypeSchema>;

export const SessionSchema = z.object({
  name: z.string().min(1, "Session Name is required"),
  semesters: z.string().min(1, "Semesters count is required"),
  duration: z.string().min(1, "Duration is required"),
  startDate: z.string().min(1, "Start Date is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});
export type SessionFormData = z.infer<typeof SessionSchema>;

export const CourseSchema = z.object({
  title: z.string().min(1, "Course Title is required"),
  code: z.string().min(1, "Course Code is required"),
  units: z.string().min(1, "Credit Units is required"),
  description: z.string().optional(),
  semester: z.string().min(1, "Semester is required"),
  level: z.string().min(1, "Level is required"),
  programTypeId: z.string().min(1, "Program Type is required"),
  courseType: z.string().min(1, "Course Type is required"),
  allowCarryover: z.boolean(),
});
export type CourseFormData = z.infer<typeof CourseSchema>;
