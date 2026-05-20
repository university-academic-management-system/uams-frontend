import { Box, Button, EmptyState, Flex, Stack, Text, For, Grid, GridItem } from "@chakra-ui/react";
import CreateProjectTopicDialog from "./_components/CreateProjectTopicDialog";
import { TextAlignCenter } from "lucide-react";
import ProjectHooks from "@/hooks/projects.hooks";
import ProjectCard from "./_components/ProjectCard";
import SupervisorInfo from "./_components/SupervisorInfo";
import { ProjectTopic } from "@/types/projects.types";
import { useMemo } from "react";

const Projects = () => {
    const { data: projectsResponse, isLoading } = ProjectHooks.useProjectTopics();
    const projects = (projectsResponse?.data || []) as ProjectTopic[];
    const hasApprovedTopic = useMemo(() => {
        return projects.some((project) => project.status === "approved");
    }, [projects]);

    if (isLoading) return <Text p="6">Loading...</Text>

    return (
        <Box p="6">
            <Flex justify="space-between" align="center" mb="6">
                <Text fontSize="2xl" fontWeight="bold">
                    Projects
                </Text>

                <CreateProjectTopicDialog isShown={!hasApprovedTopic} />
            </Flex>

            <Grid templateColumns={{ base:"1fr", md:"repeat(3, 1fr)"}} gap="6">
                <GridItem colSpan={2}>
                    <For each={projects} fallback={
                        <EmptyState.Root>
                            <EmptyState.Content>
                                <EmptyState.Indicator>
                                    <TextAlignCenter />
                                </EmptyState.Indicator>
                                <Stack textAlign="center">
                                    <EmptyState.Title>
                                        No project topics found
                                    </EmptyState.Title>
                                    <EmptyState.Description>
                                        Add a new project topic to get started
                                    </EmptyState.Description>
                                </Stack>
                                <CreateProjectTopicDialog isShown={!hasApprovedTopic} />
                            </EmptyState.Content>
                        </EmptyState.Root>
                    }>
                        {(project) => (
                            <Box mb="4" key={project.id}>
                                <ProjectCard project={project} />
                            </Box>
                        )}
                    </For>
                </GridItem>

                <GridItem colSpan={1}>
                    <SupervisorInfo />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default Projects;
