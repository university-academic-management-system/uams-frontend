import { useState } from "react";
import { AnnouncementServices } from "@services/announcement.service";
import { toaster } from "@components/ui/toaster";
import { 
    Button, 
    Dialog, 
    Portal, 
    Field, 
    Input, 
    Stack, 
    Textarea, 
    Box, 
    CloseButton,
    createListCollection,
    Select
} from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

const recipientCollection = createListCollection({
    items: [
        { label: "Student", value: "STUDENT" },
        { label: "Staff", value: "OTHERS" },
    ],
});

const CreateAnnouncementModal = ({ isOpen, onClose, onCreated }: Props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            toaster.error({ title: "Please enter a title" });
            return;
        }
        if (selectedRecipients.length === 0) {
            toaster.error({ title: "Please select at least one recipient" });
            return;
        }
        if (!description.trim()) {
            toaster.error({ title: "Please enter a description" });
            return;
        }

        setLoading(true);
        try {
            await Promise.all(
                selectedRecipients.map((isFor) =>
                    AnnouncementServices.createAnnouncement({
                        title: title.toUpperCase(),
                        body: description,
                        isFor,
                    })
                )
            );

            toaster.success({ title: "Announcement created successfully" });
            onCreated();
            onClose();
            setTitle("");
            setDescription("");
            setSelectedRecipients([]);
        } catch (error) {
            console.error("Failed to create announcement:", error);
            toaster.error({ title: "Failed to create announcement" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root 
            open={isOpen} 
            onOpenChange={(e) => !e.open && onClose()}
            size="lg"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content rounded="md">
                        <Dialog.Header borderBottom="1px solid" borderColor="border.muted" py="6" px="8">
                            <Dialog.Title color="accent" fontWeight="bold">
                                Create New Announcement
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body p="8">
                            <Stack gap="6">
                                {/* Title Input */}
                                <Field.Root invalid={!title && loading}>
                                    <Field.Label fontWeight="bold" color="fg.subtle">
                                        Title <Box as="span" color="red.500">*</Box>
                                    </Field.Label>
                                    <Input
                                        size="xl"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Announcement Title"
                                        _placeholder={{ color: "fg.subtle" }}
                                    />
                                </Field.Root>

                                {/* Recipients Select */}
                                <Field.Root invalid={selectedRecipients.length === 0 && loading}>
                                    <Field.Label fontWeight="bold" color="fg.subtle">
                                        Recipient(s) <Box as="span" color="red.500">*</Box>
                                    </Field.Label>
                                    <Select.Root
                                        multiple
                                        collection={recipientCollection}
                                        value={selectedRecipients}
                                        onValueChange={(e) => setSelectedRecipients(e.value)}
                                        size="lg"
                                    >
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Select Recipient(s)" />
                                        </Select.Trigger>
                                        <Select.Content>
                                            {recipientCollection.items.map((item) => (
                                                <Select.Item item={item} key={item.value}>
                                                    <Select.ItemText>{item.label}</Select.ItemText>
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                </Field.Root>

                                {/* Description Textarea */}
                                <Field.Root invalid={!description && loading}>
                                    <Field.Label fontWeight="bold" color="fg.subtle">
                                        Description <Box as="span" color="red.500">*</Box>
                                    </Field.Label>
                                    <Textarea
                                        size="xl"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe announcement in details"
                                        _placeholder={{ color: "fg.subtle" }}
                                        rows={6}
                                        resize="none"
                                    />
                                </Field.Root>
                            </Stack>
                        </Dialog.Body>

                        <Dialog.Footer borderTop="1px solid" borderColor="border.muted" p="8" gap="3">
                            <Dialog.ActionTrigger asChild>
                                <Button 
                                    variant="subtle" 
                                    size="xl" 
                                    px="8"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                size="xl"
                                px="8"
                                loading={loading}
                                disabled={loading || !title || !description || selectedRecipients.length === 0}
                                onClick={handleSubmit}
                            >
                                Create Announcement
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" pos="absolute" right="4" top="4" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CreateAnnouncementModal;
