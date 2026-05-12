import { Card, Text, Menu, Button, Flex, Stack, Box, IconButton, Portal, Heading, Badge } from "@chakra-ui/react";
import { MoreVertical, Edit, Trash, Rocket } from "lucide-react";
import { ProjectTopic } from "@/types/projects.types";
import { useState } from "react";
import UpdateProjectTopicDialog from "./UpdateProjectTopicDialog";
import DeleteProjectTopicDialog from "./DeleteProjectTopicDialog";
import ProjectHooks from "@/hooks/projects.hooks";
import { toaster } from "@/components/ui/toaster";
import { Link } from "react-router";
import ProjectWriter from "./ProjectWriter";

interface ProjectCardProps {
    project: ProjectTopic;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { mutate: startProject, isPending: isStarting } = ProjectHooks.useStartProject();

    const handleStartProject = () => {
        startProject(project.id, {
            onSuccess: () => {
                toaster.success({
                    title: "Project started successfully",
                });
            },
            onError: (error: any) => {
                toaster.error({
                    title: error?.response?.data?.message || "Something went wrong",
                });
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'green';
            case 'pending': return 'yellow';
            case 'rejected': return 'red';
            default: return 'gray';
        }
    };

    return (
        <Card.Root variant="outline">
            <Card.Body>
                <Flex justify="space-between" align="start">
                    <Stack gap="2" flex="1" w="full">
                        <Flex justify="space-between" w="full" align="center">
                            <Flex align="center" gap="4">
                                <Heading fontWeight="semibold" fontSize="lg" lineClamp={1}>
                                    {project.title}
                                </Heading>
                                <Badge colorPalette={getStatusColor(project.status)} variant="surface" size="sm" textTransform="capitalize">
                                    {project.status}
                                </Badge>
                            </Flex>
                            {project.status !== 'approved' && <Menu.Root>
                                <Menu.Trigger asChild>
                                    <IconButton variant="ghost" size="xs" aria-label="Project options">
                                        <MoreVertical size={16} />
                                    </IconButton>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.Item value="update" onClick={() => setUpdateDialogOpen(true)}>
                                                <Edit size={14} style={{ marginRight: '8px' }} /> Update
                                            </Menu.Item>
                                            <Menu.Item value="delete" onClick={() => setDeleteDialogOpen(true)} color="red.500">
                                                <Trash size={14} style={{ marginRight: '8px' }} /> Delete
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>}
                        </Flex>


                        <Text color="gray.600" w="full" whiteSpace="pre-wrap" fontSize="sm">
                            {project.description}
                        </Text>

                        <Flex justify="space-between" align="end" mt="4">
                            <Text color="gray.400" fontSize="xs">
                                Created on {new Date(project.createdAt).toLocaleDateString()}
                            </Text>

                            {project.status === 'approved' && !project.document && (
                                <Button
                                    size="sm"
                                    // colorPalette="blue"
                                    bg="var(--color-accent)"
                                    variant="solid"
                                    loading={isStarting}
                                    onClick={handleStartProject}
                                >
                                    <Rocket size={16} /> Start Project
                                </Button>
                            )}
                            {project.status === 'approved' && project.document && (
                                <ProjectWriter project={project} />
                            )}
                        </Flex>
                    </Stack>
                </Flex>
            </Card.Body>

            <UpdateProjectTopicDialog
                project={project}
                open={updateDialogOpen}
                onOpenChange={setUpdateDialogOpen}
            />
            <DeleteProjectTopicDialog
                id={project.id}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            />
        </Card.Root>
    );
};

export default ProjectCard;
