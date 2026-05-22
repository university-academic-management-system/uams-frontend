import * as z from "zod";

export const idCardSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  faculty: z.string().min(1, "Faculty is required"),
  department: z.string().min(1, "Department is required"),
  schoolAddress: z.string().min(1, "School address is required"),
  backDescription: z.string().min(1, "Back description is required").max(120, "Max 120 characters allowed"),
  backDisclaimer: z.string().min(1, "Back disclaimer is required").max(95, "Max 95 characters allowed"),
});

export type IDCardFormData = z.infer<typeof idCardSchema>;
