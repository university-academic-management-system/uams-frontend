import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectTopicSchema, CreateProjectTopicFormValues } from '../schemas/projects.schemas';

export const useProjectTopicForm = () => {
    return useForm<CreateProjectTopicFormValues>({
        resolver: zodResolver(createProjectTopicSchema),
        defaultValues: {
            title: '',
            description: '',
            document: '',
        },
    });
};
