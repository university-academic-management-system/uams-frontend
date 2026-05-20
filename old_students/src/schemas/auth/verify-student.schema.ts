import { z } from 'zod';

export const verifyStudentSchema = z.object({
  matricNumber: z.string().min(1, 'Please enter your matriculation or reg. number'),
});

export type VerifyStudentSchema = z.infer<typeof verifyStudentSchema>;
