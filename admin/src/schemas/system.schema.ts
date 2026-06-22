import { z } from "zod";

export const systemSettingsSchema = z.object({
  // Academic Session
  currentSession: z.string().min(1, "Current session is required"),
  currentSemester: z.string().optional(),

  // Semester 1
  semester1StartDate: z.any().optional(),
  semester1EndDate: z.any().optional(),

  // Semester 2
  semester2StartDate: z.any().optional(),
  semester2EndDate: z.any().optional(),

  // Credit Units
  totalCreditUnit: z.number().min(0).optional(),
  semester1CreditUnit: z.number().min(0).optional(),
  semester2CreditUnit: z.number().min(0).optional(),

  // Grading Policy
  caPercentage: z.number().min(0).max(100),
  examPercentage: z.number().min(0).max(100),

  // Academic Standing
  probationCgpaThreshold: z.number().min(0).optional(),
  suspensionThreshold: z.number().min(0).optional(),

  // SIWES
  siwesRequired: z.boolean().optional(),
  siwesMinimumWeeks: z.number().min(0).optional(),
  siwesLevel: z.string().optional(),
});

export type SystemSettingsData = z.infer<typeof systemSettingsSchema>;
