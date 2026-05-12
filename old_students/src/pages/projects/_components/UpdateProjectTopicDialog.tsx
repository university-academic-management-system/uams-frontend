import { Button, CloseButton, Dialog, Field, Input, Portal, Stack, Textarea } from "@chakra-ui/react"
import { Loader2 } from "lucide-react";
import { useProjectTopicForm } from "@/forms/projects.forms";
import ProjectHooks from "@/hooks/projects.hooks";
import { useEffect } from "react";
import { toaster } from "@/components/ui/toaster";
import { ProjectTopic } from "@/types/projects.types";

interface UpdateProjectTopicDialogProps {
    project: ProjectTopic;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UpdateProjectTopicDialog = ({ project, open, onOpenChange }: UpdateProjectTopicDialogProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useProjectTopicForm();

    const { mutate: updateTopic, isPending } = ProjectHooks.useUpdateProjectTopic();

    useEffect(() => {
        if (open) {
            reset({
                title: project.title,
                description: project.description,
            });
        }
    }, [open, project, reset]);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        updateTopic({ id: project.id, data }, {
            onSuccess: () => {
                toaster.success({
                    title: "Project topic updated successfully",
                });
                onOpenChange(false);
            },
            onError: (error: any) => {
                toaster.error({
                    title: error?.response?.data?.message || "Something went wrong",
                });
            }
        });
    }, (error) => console.error(error));

    return (
        <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content asChild>
                        <form id="update-project-topic-form" onSubmit={onSubmit}>
                            <Dialog.Header>
                                <Dialog.Title>Update Project Topic</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Stack gap="4">
                                    <Field.Root invalid={!!errors.title}>
                                        <Field.Label>Title</Field.Label>
                                        <Input
                                            {...register("title")}
                                            placeholder="Enter project topic title"
                                        />
                                        <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                                    </Field.Root>
                                    <Field.Root invalid={!!errors.description}>
                                        <Field.Label>Description</Field.Label>
                                        <Textarea
                                            {...register("description")}
                                            rows={10}
                                            placeholder="Enter project topic description"
                                        />
                                        <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" disabled={isPending}>Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    w="40"
                                    type="submit"
                                    loading={isPending}
                                    loadingText="Updating..."
                                >
                                    Update
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </form>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default UpdateProjectTopicDialog;
