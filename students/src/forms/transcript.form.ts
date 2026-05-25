import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTranscriptSchema, type CreateTranscriptFormData } from "@schemas/transcript.schema";

export const useCreateTranscriptForm = () => {
    return useForm<CreateTranscriptFormData>({
        resolver: zodResolver(CreateTranscriptSchema),
        defaultValues: {
            purpose: "",
            deliveryMethod: undefined,
            address: "",
        },
    });
}
