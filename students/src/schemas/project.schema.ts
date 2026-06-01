import { z } from "zod";

export const ProjectTopicSchema = z.object({
    title: z.string().min(1, "Topic title is required"),
    description: z.string().min(1, "Topic summary is required"),
});

export const SuggestTopicsSchema = z.object({
    topics: z.array(ProjectTopicSchema).length(3, "All 3 project topics must be filled"),
});

export type SuggestTopicsFormData = z.infer<typeof SuggestTopicsSchema>;
export type UpdateTopicFormData = z.infer<typeof ProjectTopicSchema>;
