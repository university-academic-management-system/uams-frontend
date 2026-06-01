import { Button, CloseButton, Dialog, Field, Input, Portal, Span, Stack, Textarea, useDisclosure } from "@chakra-ui/react"
import { useSuggestProjectTopics } from "@hooks/project.hook";
import { useSuggestTopicsForm } from "@forms/project.form";
import { LuPlus } from "react-icons/lu";
import { toaster } from "@components/ui/toaster";
import { useQueryClient } from "@tanstack/react-query";


const CreateTopicDialog = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useSuggestTopicsForm();
    const { onClose, open, setOpen } = useDisclosure();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useSuggestProjectTopics({
        onSuccess: () => {
            toaster.success({ description: "Project topics suggested successfully" });
            queryClient.invalidateQueries({ queryKey: ["project-topics"] });
            reset();
            onClose();
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutate({ topics: data.topics });
    });

    return (
        <Dialog.Root
            open={open}
            size="xl"
            role="alertdialog"
            placement={"center"}
            scrollBehavior={"inside"}
            onOpenChange={(d) => {
                if (d.open) {
                    setOpen(true);
                } else {
                    reset();
                    setOpen(false);
                }
            }}>
            <Dialog.Trigger asChild>
                <Button size="xl" colorPalette={"accent"}>
                    <LuPlus /> Create Project Topics
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header flexDir={"column"}>
                            <Dialog.Title>Create Project Topics</Dialog.Title>
                            <Span color="fg.subtle">You are required to suggest exactly 3 project topics</Span>
                        </Dialog.Header>
                        <Dialog.Body bg="bg.subtle" colorPalette={"accent"}>
                            <Stack asChild gap="4" py="4">
                                <form id="create-topic-form" onSubmit={onSubmit}>
                                    {[0, 1, 2].map((index) => {
                                        const topicError = errors.topics?.[index];
                                        return (
                                            <Stack key={index} p="4" gap="4" bg="bg" border="xs" borderColor="border.muted" rounded="md">
                                                <Field.Root invalid={!!topicError?.title}>
                                                    <Field.Label>#{index + 1} Topic</Field.Label>
                                                    <Input size={"xl"} {...register(`topics.${index}.title` as const)} />
                                                    <Field.ErrorText>
                                                        {topicError?.title?.message}
                                                    </Field.ErrorText>
                                                </Field.Root>
                                                <Field.Root invalid={!!topicError?.description}>
                                                    <Field.Label>Summary</Field.Label>
                                                    <Textarea rows={6} {...register(`topics.${index}.description` as const)} />
                                                    <Field.ErrorText>{topicError?.description?.message}</Field.ErrorText>
                                                </Field.Root>
                                            </Stack>
                                        )
                                    })}
                                </form>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer pt="4">
                            <Dialog.ActionTrigger asChild>
                                <Button size="xl" variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button type="submit" form="create-topic-form" size="xl" colorPalette={"accent"} loading={isPending}>Save</Button>
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

export default CreateTopicDialog;
