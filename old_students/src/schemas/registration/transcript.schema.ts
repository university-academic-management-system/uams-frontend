import { z } from 'zod';

export const transcriptSchema = z.object({
  institution_name: z.string().min(1, 'Institution name is required'),
  recipient_name: z.string().min(1, 'Recipient name is required'),
  delivery_method: z.string().min(1, 'Delivery method is required'),
  recipient_address: z.string().optional(),
  recipient_email: z.string().optional(),
  purpose: z.string().optional(),
});

export type TranscriptSchema = z.infer<typeof transcriptSchema>;
