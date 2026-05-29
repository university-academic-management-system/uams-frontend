import { useState, useMemo } from "react";
import { Box, Flex, Text, Heading, EmptyState, VStack, Center } from "@chakra-ui/react";
import { LuBookOpen } from "react-icons/lu";
import { ProjectHook } from "@hooks/project.hook";
import ProjectsTable from "@components/shared/projects-table";
import type { ProjectTopic, Student } from "@type/project.type";
import { Toaster } from "@components/ui/toaster";

const PROGRAM_TYPES = ["All", "Regular", "Part-Time", "Sandwich"];
const LEVELS = ["All", "100", "200", "300", "400", "500"];
const SESSIONS = ["All", "2023/2024", "2024/2025", "2025/2026"];

export interface StudentProjects {
    student: Student;
    projects: ProjectTopic[];
}

const Projects = () => {
    const [programType, setProgramType] = useState("All");
    const [level, setLevel] = useState("All");
    const [session, setSession] = useState("All");

    const { data: response, isLoading } = ProjectHook.useProjects({
        programType, level, session,
    });

    const studentProjects = useMemo(() => {
        if (!response?.data) return [];
        const map = new Map<string, StudentProjects>();
        response.data.forEach(project => {
            if (!map.has(project.student.id)) {
                map.set(project.student.id, { student: project.student, projects: [] });
            }
            map.get(project.student.id)!.projects.push(project);
        });
        return Array.from(map.values());
    }, [response?.data]);

    const totalCount = studentProjects.length;

    return (
        <Box>
            {/* Header + Filters */}
            <Flex align="center" justify="space-between" mb="5">
                <Heading color="fg.muted" mb="5">
                    Projects{" "}
                    <Text as="span" color="fg.subtle">
                        ({totalCount})
                    </Text>
                </Heading>
            </Flex>

            {/* Projects Table or Empty State */}
            {!isLoading && studentProjects.length === 0 ? (
                <Box
                    bg="white"
                    rounded="md"
                    border="1px solid"
                    borderColor="border.muted"
                    p="5"
                    textAlign="center"
                >
                    <EmptyState.Root>
                        <EmptyState.Content>
                            <EmptyState.Indicator>
                                <LuBookOpen />
                            </EmptyState.Indicator>
                            <VStack textAlign="center">
                                <EmptyState.Title>No projects found</EmptyState.Title>
                                <EmptyState.Description>
                                    {response?.data?.length === 0
                                        ? "No projects have been created yet."
                                        : "Try again later."}
                                </EmptyState.Description>
                            </VStack>
                        </EmptyState.Content>
                    </EmptyState.Root>
                </Box>
            ) : (
                <ProjectsTable studentProjects={studentProjects} isLoading={isLoading} />
            )}

            <Toaster />
        </Box>
    );
};

export default Projects;