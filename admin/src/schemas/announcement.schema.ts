import { z } from "zod";

export const announcementSchema = z
    .object({
        title: z.string().trim().min(1, "Title is required"),
        recipientType: z.enum(["ALL", "ROLE"], {
            message: "Recipient Type is required",
        }),
        targetRole: z.array(z.string()),
        type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"], {
            message: "Notification Type is required",
        }),
        message: z.string().trim().min(1, "Message is required"),
    })
    .refine(
        (data) => {
            if (data.recipientType === "ROLE") {
                return data.targetRole && data.targetRole.length > 0;
            }
            return true;
        },
        {
            message: "At least one Target Role is required when Recipient Type is 'By Role'",
            path: ["targetRole"],
        }
    );

export type AnnouncementFormData = z.infer<typeof announcementSchema>;
