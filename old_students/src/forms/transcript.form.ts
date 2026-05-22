import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transcriptSchema, type TranscriptSchema } from "@/schemas/registration/transcript.schema";

export const useTranscriptForm = () => {
    return useForm<TranscriptSchema>({
        resolver: zodResolver(transcriptSchema),
        defaultValues: {
            institution_name: "",
            recipient_name: "",
            delivery_method: "",
            recipient_address: "",
            recipient_email: "",
            purpose: "",
        },
    });
};
