import { useEffect, useCallback } from "react";
import { NotificationServices } from "@services/notification.service";
import { toaster } from "@components/ui/toaster";
import useAnnouncementForm from "@forms/announcement.form";
import type { AnnouncementFormData } from "@schemas/announcement.schema";
import { 
    Button, 
    Dialog, 
    Portal, 
    Field, 
    Input, 
    Stack, 
    Textarea, 
    Box, 
    Flex,
    CloseButton,
    createListCollection,
    Select
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

const recipientTypeCollection = createListCollection({
    items: [
        { label: "All Users", value: "ALL" },
        { label: "By Role", value: "ROLE" },
    ],
});

const targetRoleCollection = createListCollection({
    items: [
        { label: "Student", value: "STUDENT" },
        { label: "Staff", value: "STAFF" },
        { label: "Admin", value: "ADMIN" },
        { label: "System Admin", value: "SYSTEM_ADMIN" },
    ],
});

const notificationTypeCollection = createListCollection({
    items: [
        { label: "Info", value: "INFO" },
        { label: "Success", value: "SUCCESS" },
        { label: "Warning", value: "WARNING" },
        { label: "Error", value: "ERROR" },
    ],
});

const CreateAnnouncementModal = ({ isOpen, onClose, onCreated }: Props) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting, isValid },
    } = useAnnouncementForm();

    const selectedRecipientType = watch("recipientType");
    const isRoleSelected = selectedRecipientType === "ROLE";

    // Reset form when modal is closed/opened
    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = useCallback(async (data: AnnouncementFormData) => {
        try {
            if (data.recipientType === "ROLE") {
                await Promise.all(
                    data.targetRole.map((role) =>
                        NotificationServices.createNotification({
                            recipientType: "ROLE",
                            targetRole: role,
                            title: data.title,
                            message: data.message,
                            type: data.type,
                        })
                    )
                );
            } else {
                await NotificationServices.createNotification({
                    recipientType: "ALL",
                    title: data.title,
                    message: data.message,
                    type: data.type,
                });
            }

            toaster.success({ title: "Announcement created successfully" });
            onCreated();
            onClose();
            reset();
        } catch (error) {
            console.error("Failed to create announcement:", error);
            // Error toast handled by axios interceptor
        }
    }, [onCreated, onClose, reset]);

    return (
        <Dialog.Root 
            open={isOpen} 
            onOpenChange={(e) => !e.open && onClose()}
            size="lg"
            placement="center" closeOnInteractOutside={false}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content rounded="md">
                        <Dialog.Header>
                            <Dialog.Title color="fg.muted" fontWeight="bold" fontSize="xl">
                                Create New Announcement
                            </Dialog.Title>
                        </Dialog.Header>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Dialog.Body p="8">
                                <Stack gap="6" colorPalette="accent">
                                    {/* Title Input */}
                                    <Field.Root invalid={!!errors.title}>
                                        <Field.Label fontWeight="bold" color="fg.subtle">
                                            Title <Box as="span" color="red.500">*</Box>
                                        </Field.Label>
                                        <Input
                                            size="xl"
                                            placeholder="Announcement Title"
                                            _placeholder={{ color: "fg.subtle" }}
                                            {...register("title")}
                                            bg="white"
                                            border="xs"
                                            borderColor="border.muted"
                                        />
                                        <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                                    </Field.Root>

                                    {/* Recipient Type & Target Role */}
                                    <Flex gap="4" direction={{ base: "column", md: "row" }}>
                                        <Controller
                                            name="recipientType"
                                            control={control}
                                            render={({ field }) => (
                                                <Field.Root invalid={!!errors.recipientType} flex="1">
                                                    <Field.Label fontWeight="bold" color="fg.subtle">
                                                        Recipient Type <Box as="span" color="red.500">*</Box>
                                                    </Field.Label>
                                                    <Select.Root
                                                        collection={recipientTypeCollection}
                                                        value={[field.value]}
                                                        onValueChange={(e) => {
                                                            const val = e.value[0] as "ALL" | "ROLE";
                                                            field.onChange(val);
                                                            if (val !== "ROLE") {
                                                                setValue("targetRole", []);
                                                            }
                                                        }}
                                                        size="lg"
                                                    >
                                                        <Select.HiddenSelect />
                                                        <Select.Control>
                                                            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                                <Select.ValueText placeholder="Select recipient type" />
                                                            </Select.Trigger>
                                                            <Select.IndicatorGroup>
                                                                <Select.Indicator />
                                                            </Select.IndicatorGroup>
                                                        </Select.Control>
                                                        <Portal>
                                                            <Select.Positioner>
                                                                <Select.Content>
                                                                    {recipientTypeCollection.items.map((item) => (
                                                                        <Select.Item item={item} key={item.value}>
                                                                            <Select.ItemText>{item.label}</Select.ItemText>
                                                                            <Select.ItemIndicator />
                                                                        </Select.Item>
                                                                    ))}
                                                                </Select.Content>
                                                            </Select.Positioner>
                                                        </Portal>
                                                    </Select.Root>
                                                    <Field.ErrorText>{errors.recipientType?.message}</Field.ErrorText>
                                                </Field.Root>
                                            )}
                                        />

                                        {isRoleSelected && (
                                            <Controller
                                                name="targetRole"
                                                control={control}
                                                render={({ field }) => (
                                                    <Field.Root invalid={!!errors.targetRole} flex="1">
                                                        <Field.Label fontWeight="bold" color="fg.subtle">
                                                            Target Role(s) <Box as="span" color="red.500">*</Box>
                                                        </Field.Label>
                                                        <Select.Root
                                                            multiple
                                                            collection={targetRoleCollection}
                                                            value={field.value || []}
                                                            onValueChange={(e) => field.onChange(e.value)}
                                                            size="lg"
                                                        >
                                                            <Select.HiddenSelect />
                                                            <Select.Control>
                                                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                                    <Select.ValueText placeholder="Select target role(s)" />
                                                                </Select.Trigger>
                                                                <Select.IndicatorGroup>
                                                                    <Select.Indicator />
                                                                </Select.IndicatorGroup>
                                                            </Select.Control>
                                                            <Portal>
                                                                <Select.Positioner>
                                                                    <Select.Content>
                                                                        {targetRoleCollection.items.map((item) => (
                                                                            <Select.Item item={item} key={item.value}>
                                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                                <Select.ItemIndicator />
                                                                            </Select.Item>
                                                                        ))}
                                                                    </Select.Content>
                                                                </Select.Positioner>
                                                            </Portal>
                                                        </Select.Root>
                                                        <Field.ErrorText>{errors.targetRole?.message}</Field.ErrorText>
                                                    </Field.Root>
                                                )}
                                            />
                                        )}
                                    </Flex>

                                    {/* Notification Type */}
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <Field.Root invalid={!!errors.type}>
                                                <Field.Label fontWeight="bold" color="fg.subtle">
                                                    Type <Box as="span" color="red.500">*</Box>
                                                </Field.Label>
                                                <Select.Root
                                                    collection={notificationTypeCollection}
                                                    value={[field.value]}
                                                    onValueChange={(e) => field.onChange(e.value[0])}
                                                    size="lg"
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Control>
                                                        <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                            <Select.ValueText placeholder="Select notification type" />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Portal>
                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {notificationTypeCollection.items.map((item) => (
                                                                    <Select.Item item={item} key={item.value}>
                                                                        <Select.ItemText>{item.label}</Select.ItemText>
                                                                        <Select.ItemIndicator />
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Content>
                                                        </Select.Positioner>
                                                    </Portal>
                                                </Select.Root>
                                                <Field.ErrorText>{errors.type?.message}</Field.ErrorText>
                                            </Field.Root>
                                        )}
                                    />

                                    {/* Message Textarea */}
                                    <Field.Root invalid={!!errors.message}>
                                        <Field.Label fontWeight="bold" color="fg.subtle">
                                            Message <Box as="span" color="red.500">*</Box>
                                        </Field.Label>
                                        <Textarea
                                            size="xl"
                                            placeholder="Describe announcement in details"
                                            _placeholder={{ color: "fg.subtle" }}
                                            rows={6}
                                            resize="none"
                                            {...register("message")}
                                            bg="white"
                                            border="xs"
                                            borderColor="border.muted"
                                        />
                                        <Field.ErrorText>{errors.message?.message}</Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button 
                                        variant="subtle" 
                                        size="xl" 
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    size="xl"
                                    bg="accent"
                                    color="white"
                                    loading={isSubmitting}
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                >
                                    Create Announcement
                                </Button>
                            </Dialog.Footer>
                        </form>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="xl" pos="absolute" right="4" top="4" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default CreateAnnouncementModal;
