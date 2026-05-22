import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react"
import ProjectHooks from "@/hooks/projects.hooks";
import { toaster } from "@/components/ui/toaster";

interface DeleteProjectTopicDialogProps {
    id: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DeleteProjectTopicDialog = ({ id, open, onOpenChange }: DeleteProjectTopicDialogProps) => {
    const { mutate: deleteTopic, isPending } = ProjectHooks.useDeleteProjectTopic();

    const onDelete = () => {
        deleteTopic(id, {
            onSuccess: () => {
                toaster.success({
                    title: "Project topic deleted successfully",
                });
                onOpenChange(false);
            },
            onError: (error: any) => {
                toaster.error({
                    title: error?.response?.data?.message || "Something went wrong",
                });
            }
        });
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} role="alertdialog">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Delete Project Topic</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>Are you sure you want to delete this project topic? This action cannot be undone.</Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" disabled={isPending}>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette="red"
                                loading={isPending}
                                loadingText="Deleting..."
                                onClick={onDelete}
                            >
                                Delete
                            </Button>
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

export default DeleteProjectTopicDialog;
