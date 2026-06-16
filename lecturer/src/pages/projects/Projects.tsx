// src/pages/projects/Projects.tsx
import { useMemo } from "react";
import {
  Box,
  EmptyState,
  VStack,
} from "@chakra-ui/react";
import { LuBookOpen } from "react-icons/lu";
import { useProjects } from "@hooks/project.hook";
import ProjectsTable from "@components/shared/ProjectsTable";
import { Toaster } from "@components/ui/toaster";
import type { StudentProjects } from "@type/project.type";

const Projects = () => {
  const { data: projects = [], isLoading, error } = useProjects();

  const studentProjects = useMemo((): StudentProjects[] => {
    if (!projects.length) return [];
    const map = new Map<string, StudentProjects>();
    projects.forEach((project) => {
      if (!project.student) return;
      const studentId = project.student.id;
      if (!map.has(studentId)) {
        map.set(studentId, {
          student: project.student,
          projects: [],
        });
      }
      map.get(studentId)!.projects.push(project);
    });
    return Array.from(map.values());
  }, [projects]);

  return (
    <Box bg="bg">

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
                  {error ? "Failed to load projects." : "Try adjusting your filters or check back later."}
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