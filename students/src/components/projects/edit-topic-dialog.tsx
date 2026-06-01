import { Button, CloseButton, Dialog, Field, IconButton, Input, Portal, Stack, Textarea, useDisclosure } from "@chakra-ui/react"
import { useUpdateProjectTopic } from "@hooks/project.hook";
import { useUpdateTopicForm } from "@forms/project.form";
import { LuPencil } from "react-icons/lu";
import { toaster } from "@components/ui/toaster";
import { useQueryClient } from "@tanstack/react-query";
import type { SuggestedTopic } from "@type/project.type";
import { useEffect } from "react";


const EditTopicDialog = ({ topic }: { topic: SuggestedTopic }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useUpdateTopicForm({
        title: topic.title,
        description: topic.description
    });
    const { onClose, open, setOpen } = useDisclosure();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useUpdateProjectTopic(topic.id, {
        onSuccess: () => {
            toaster.success({ description: "Project topic updated successfully" });
            queryClient.invalidateQueries({ queryKey: ["project-topics"] });
            onClose();
        }
    });

    useEffect(() => {
        if (open) {
            reset({
                title: topic.title,
                description: topic.description
            });
        }
    }, [open, topic, reset]);

    const onSubmit = handleSubmit((data) => {
        mutate(data);
    });

    return (
        <Dialog.Root
            open={open}
            size="xl"
            role="alertdialog"
            placement={"center"}
            scrollBehavior={"inside"}
            onOpenChange={(d) => setOpen(d.open)}>
            <Dialog.Trigger asChild>
                <IconButton size="xs" variant="ghost">
                    <LuPencil />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Edit Project Topic</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body bg="bg.subtle" colorPalette={"accent"}>
                            <Stack asChild gap="4" py="4">
                                <form id="edit-topic-form" onSubmit={onSubmit}>
                                    <Stack p="4" gap="4" bg="bg" border="xs" borderColor="border.muted" rounded="md">
                                        <Field.Root invalid={!!errors.title}>
                                            <Field.Label>Topic Title</Field.Label>
                                            <Input size={"xl"} {...register("title")} />
                                            <Field.ErrorText>
                                                {errors.title?.message}
                                            </Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root invalid={!!errors.description}>
                                            <Field.Label>Summary</Field.Label>
                                            <Textarea rows={6} {...register("description")} />
                                            <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Stack>
                                </form>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer pt="4">
                            <Dialog.ActionTrigger asChild>
                                <Button size="xl" variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button type="submit" form="edit-topic-form" size="xl" colorPalette={"accent"} loading={isPending}>Save Changes</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default EditTopicDialog;
