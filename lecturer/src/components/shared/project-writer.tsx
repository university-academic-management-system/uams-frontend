import { CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { Rocket } from "lucide-react";
import { Flex, IconButton, Text, Center, Button, VStack } from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import type { ProjectTopic } from "@type/project.type";

const ProjectWriter = ({ project }: { project: ProjectTopic }) => {
    const navigate = useNavigate();
    
    if (!project || !project.document?.googleDocUrl) {
        return (
            <Center flexDir="column" gap="3">
                <Text fontSize="sm" fontWeight="semibold">Project document not found.</Text>
                <Button
                    size="sm"
                    aria-label="Back to projects"
                    onClick={() => navigate("/projects")}
                    width="fit-content"
                >
                    Back to Projects
                </Button>
            </Center>
        );
    }

    return (
        <VStack gap={3} align="center">
            {/* View Project Button (opens dialog) */}
            <Dialog.Root size="full" motionPreset="slide-in-bottom">
                <Dialog.Trigger asChild>
                    <Button size="sm" bg="accent.500" variant="solid">
                        <Rocket size={16} /> View Project
                    </Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title gap="4">
                                    <Flex gap="4">
                                        {project?.title}
                                        <a href={project.document.googleDocUrl} target="_blank" rel="noopener noreferrer">
                                            <IconButton variant="outline" size="xs" aria-label="Open in Google Docs">
                                                <ExternalLink size={16} />
                                            </IconButton>
                                        </a>
                                    </Flex>
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body h="full" asChild>
                                <iframe src={project.document.googleDocUrl} width="100%" height="100%"></iframe>
                            </Dialog.Body>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </VStack>
    );
}

export default ProjectWriter;