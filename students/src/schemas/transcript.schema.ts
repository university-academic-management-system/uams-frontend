import { z } from "zod";

export const CreateTranscriptSchema = z.object({
    purpose: z.string().min(3, "Purpose must be at least 3 characters").max(255),
    deliveryMethod: z.enum(["DIGITAL_DELIVERY", "COURIER_SERVICE", "PHYSICAL_PICKUP"], {
        required_error: "Please select a delivery method",
    }),
    address: z.string().min(5, "Address must be at least 5 characters").max(500),
});

export type CreateTranscriptFormData = z.infer<typeof CreateTranscriptSchema>;
