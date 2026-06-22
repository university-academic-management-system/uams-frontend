import { z } from "zod";

export const StaffSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  otherName: z.string().optional(),
  email: z.email("Invalid email address"),
  gender: z.string().min(1, "Gender is required"),
  staffNumber: z.string().min(1, "Staff number is required"),
  title: z.string().min(1, "Title is required"),
  phone: z.string().min(1, "Phone number is required"),
  staffRoles: z.array(z.string()).min(1, "At least one role is required"),
  faculty: z.string().min(1, "Faculty is required"),
  department: z.string().min(1, "Department is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type StaffFormData = z.infer<typeof StaffSchema>;
