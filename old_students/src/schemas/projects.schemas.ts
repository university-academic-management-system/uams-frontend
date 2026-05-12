import { z } from 'zod';

export const createProjectTopicSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long').max(100, 'Title must not exceed 100 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters long').max(1000, 'Description must not exceed 1000 characters'),
    document: z.string(),
});

export type CreateProjectTopicFormValues = z.infer<typeof createProjectTopicSchema>;
