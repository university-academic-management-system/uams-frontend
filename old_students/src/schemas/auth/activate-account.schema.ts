import { z } from 'zod';

export const activateAccountSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Please enter your email address'),
  phone: z.string().min(1, 'Please enter your phone number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ActivateAccountSchema = z.infer<typeof activateAccountSchema>;
