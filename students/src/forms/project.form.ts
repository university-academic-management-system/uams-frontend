import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectTopicSchema, SuggestTopicsSchema, type SuggestTopicsFormData, type UpdateTopicFormData } from "@schemas/project.schema";

export const useSuggestTopicsForm = () => {
    return useForm<SuggestTopicsFormData>({
        resolver: zodResolver(SuggestTopicsSchema),
        defaultValues: {
            topics: [
                { title: "", description: "" },
                { title: "", description: "" },
                { title: "", description: "" },
            ]
        }
    });
}

export const useUpdateTopicForm = (defaultValues?: UpdateTopicFormData) => {
    return useForm<UpdateTopicFormData>({
        resolver: zodResolver(ProjectTopicSchema),
        defaultValues
    });
}
