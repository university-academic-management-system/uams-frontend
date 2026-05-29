import { Box, Table, Text, Flex, Button, CloseButton, Dialog, Drawer, Portal, Card, Input, Textarea, Stack, Field, Select, createListCollection, useDisclosure } from "@chakra-ui/react";
import type { ProjectTopic } from "@type/project.type";
import { ProjectHook } from "@hooks/project.hook";
import { toaster } from "@components/ui/toaster";
import ProjectWriter from "./project-writer";
import type { StudentProjects } from "@pages/projects/Projects";
import useUpdateProjectForm from "@forms/update-project.form";
import type { UpdateProjectSchema } from "@schemas/project/update-project.schema";

const StatusBadge = ({ status }: { status: "pending" | "approved" | string }) => {
    const isPending = status === "pending" || status === "Pending";
    return (
        <Flex
            align="center"
            gap="1"
            px="3"
            py="1"
            borderRadius="full"
            bg={isPending ? "orange.50" : "green.50"}
            color={isPending ? "orange.500" : "green.500"}
            fontSize="11px"
            fontWeight="600"
            w="fit-content"
            textTransform="capitalize"
        >
            {status}
        </Flex>
    );
};

const statusCollection = createListCollection({
    items: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
    ],
});

const TopicDialog = ({ topic }: { topic: ProjectTopic }) => {
    const { mutate: updateProject, isPending } = ProjectHook.useUpdateProject();
    const { open, onClose, setOpen } = useDisclosure();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useUpdateProjectForm({
        title: topic.title,
        status: topic.status,
        description: topic.description,
    });

    const currentStatus = watch("status");

    const onSubmit = (data: UpdateProjectSchema) => {
        updateProject({
            id: topic.id,
            payload: data,
        }, {
            onSuccess() {
                toaster.success({ description: "Changes saved!", closable: true })
                onClose();
            }
        });
    };

    return (
        <Dialog.Root role="alertdialog" open={open} onOpenChange={(d) => setOpen(d.open)}>
            <Dialog.Trigger asChild>
                <Button size="sm">Update Options</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Update Project Topic</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <form id="update-project-form" onSubmit={handleSubmit(onSubmit)}>
                                <Stack gap="4" align="stretch">
                                    <Field.Root invalid={!!errors.title}>
                                        <Field.Label>Title</Field.Label>
                                        <Input
                                            type="text"
                                            {...register("title")}
                                        />
                                        {errors.title && (
                                            <Field.ErrorText>{errors.title.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root invalid={!!errors.status}>
                                        <Field.Label>Status</Field.Label>
                                        <Select.Root
                                            collection={statusCollection}
                                            size="sm"
                                            value={[currentStatus]}
                                            onValueChange={(e) => setValue("status", e.value[0] as "pending" | "approved", { shouldValidate: true })}
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger>
                                                    <Select.ValueText placeholder="Select status" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {statusCollection.items.map((item: any) => (
                                                            <Select.Item item={item} key={item.value}>
                                                                {item.label}
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                        {errors.status && (
                                            <Field.ErrorText>{errors.status.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root invalid={!!errors.description}>
                                        <Field.Label>Description</Field.Label>
                                        <Textarea
                                            rows={4}
                                            {...register("description")}
                                        />
                                        {errors.description && (
                                            <Field.ErrorText>{errors.description.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>
                                </Stack>
                            </form>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button type="submit" form="update-project-form" w="40" loading={isPending} loadingText="Saving..." disabled={isPending}>Save</Button>
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

const TopicsDrawer = ({ studentProjects }: { studentProjects: StudentProjects }) => {
    return (
        <Drawer.Root>
            <Drawer.Trigger asChild>
                <Button size="sm" variant="outline">View Topics</Button>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content style={{ maxWidth: "450px" }}>
                        <Drawer.Header>
                            <Drawer.Title>Topics for {studentProjects.student.name}</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <Flex direction="column" gap="4">
                                {studentProjects.projects.map(topic => (
                                    <Card.Root key={topic.id} width="100%">
                                        <Card.Body gap="2">
                                            <Flex justify="space-between" align="start">
                                                <Card.Title mt="2" fontSize="md">{topic.title}</Card.Title>
                                                <StatusBadge status={topic.status} />
                                            </Flex>
                                            <Card.Description fontSize="sm" mt="2" color="gray.600">
                                                {topic.description}
                                            </Card.Description>
                                            <Flex mt="3" gap="4" fontSize="xs" color="gray.500">
                                                <Text>Created: {new Date(topic.createdAt).toLocaleDateString()}</Text>
                                                <Text>Updated: {new Date(topic.updatedAt).toLocaleDateString()}</Text>
                                            </Flex>
                                        </Card.Body>
                                        <Card.Footer justifyContent="flex-end">
                                            <TopicDialog topic={topic} />
                                        </Card.Footer>
                                    </Card.Root>
                                ))}
                                {studentProjects.projects.length === 0 && (
                                    <Text fontSize="sm" color="gray.500">No topics found.</Text>
                                )}
                            </Flex>
                        </Drawer.Body>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

interface ProjectsTableProps {
    studentProjects: StudentProjects[];
    isLoading?: boolean;
}

const COLUMNS = [
    { key: "sn", label: "S/N", width: "50px" },
    { key: "studentName", label: "Student", width: "200px" },
    { key: "matricNumber", label: "Matric number", width: "160px" },
    { key: "action", label: "Action", width: "120px" },
] as const;

const ProjectsTable = ({ studentProjects, isLoading }: ProjectsTableProps) => {
    if (isLoading) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">Loading projects...</Text>
            </Flex>
        );
    }

    if (studentProjects.length === 0) {
        return (
            <Flex justify="center" py="12">
                <Text color="gray.500" fontSize="sm">No students found.</Text>
            </Flex>
        );
    }

    return (
        <Box borderRadius="lg" border="1px solid" borderColor="gray.100" bg="white" overflowX="auto">
            <Table.Root size="sm" variant="line">
                <Table.Header>
                    <Table.Row bg="gray.50">
                        {COLUMNS.map((col) => (
                            <Table.ColumnHeader
                                key={col.key}
                                fontSize="xs"
                                fontWeight="600"
                                color="gray.600"
                                textTransform="none"
                                minW={col.width}
                                px="4"
                                py="3"
                                whiteSpace="nowrap"
                                textAlign={col.key === "action" ? "center" : "left"} 
                            >
                                {col.label}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {studentProjects.map((record, index) => {
                        const approvedProject = record.projects.find(p => p.status === "approved");
                        return (
                            <Table.Row
                                key={record.student.id}
                                _hover={{ bg: "gray.50" }}
                                transition="background 0.15s"
                            >
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.600">
                                    {index + 1}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                    {record.student.name}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5" fontSize="xs" color="gray.700">
                                    {record.student.matricNumber}
                                </Table.Cell>
                                <Table.Cell px="4" py="3.5">
                                     <Flex justify="center" width="100%">
                                    {approvedProject ? (
                                        <ProjectWriter project={approvedProject} />
                                    ) : (
                                        <TopicsDrawer studentProjects={record} />
                                    )}
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Box>
    );
};

export default ProjectsTable;
