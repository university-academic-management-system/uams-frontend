import { CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { Rocket } from "lucide-react";
import { Box, Flex, Heading, IconButton, Text, Center, Button } from "@chakra-ui/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { ProjectTopic } from "@/types/projects.types";


const ProjectWriter = ({ project }: { project: ProjectTopic }) => {
    const navigate = useNavigate();

    if (!project || !project.document?.googleDocUrl) {
        return (
            <Center h="100vh" flexDir="column" gap="4">
                <Text fontSize="lg" fontWeight="semibold">Project document not found.</Text>
                <Button
                    aria-label="Back to projects"
                    onClick={() => navigate("/projects")}
                >
                    Back to Projects
                </Button>
            </Center>
        );
    }


    return (
        <Dialog.Root size="full" motionPreset="slide-in-bottom">
            <Dialog.Trigger asChild>
                <Button
                    size="sm"
                    bg="var(--color-accent)"
                    variant="solid"
                >
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
    )
}


export default ProjectWriter;