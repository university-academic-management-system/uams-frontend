// src/components/shared/ProjectsTable.tsx
import { useMemo, useState } from "react";
import {
  Box,
  Table,
  Text,
  Flex,
  Button,
  CloseButton,
  Dialog,
  Portal,
  Card,
  Input,
  Textarea,
  Stack,
  Field,
  Select,
  createListCollection,
  useDisclosure,
  Skeleton,
  Badge,
  Menu,
  IconButton,
} from "@chakra-ui/react";
import { LuEllipsis } from "react-icons/lu";
import { useUpdateProjectTopic } from "@hooks/project.hook";
import { toaster } from "@components/ui/toaster";
import useUpdateProjectForm from "@forms/update-project.form";
import type { UpdateProjectSchema } from "@schemas/project/update-project.schema";
import type { ProjectTopic, StudentProjects } from "@type/project.type";

// StatusBadge component (for topics only, keep it)
const StatusBadge = ({ status }: { status: string }) => {
  const isPending = status === "pending" || status === "PENDING" || status === "NOT_STARTED";
  const isApproved = status === "approved" || status === "APPROVED" || status === "IN_PROGRESS";
  return (
    <Badge
      bg={isPending ? "orange.50" : isApproved ? "green.50" : "gray.50"}
      color={isPending ? "orange.500" : isApproved ? "green.500" : "gray.500"}
    >
      {status.toLowerCase()}
    </Badge>
  );
};

// TopicDialog (kept because it's used inside the topics display? Actually topics display removed.
// But we keep it in case it's needed elsewhere – but we'll remove TopicsContent.
// Since TopicsContent is removed, we can also remove TopicDialog. But let's keep it if you plan to reuse.
// For now, we'll keep it but it's unused after removal. We'll comment out or remove entire topics section.
// We'll remove all topics-related code since "View Topics" is gone.
// So remove TopicDialog, TopicsContent, etc.
const statusCollection = createListCollection({
  items: [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
  ],
});

// TopicDialog is no longer needed because View Topics is removed.
// We'll remove it to clean up.

// ----- RowActions component (only View Project) -----
const RowActions = ({ record }: { record: StudentProjects }) => {
  const activeProject = record.projects.find(p => p.googleDocUrl);

  const handleViewProject = () => {
    if (activeProject?.googleDocUrl) {
      window.open(activeProject.googleDocUrl, "_blank");
    } else {
      toaster.warning({ description: "No project document available." });
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton size="sm" variant="ghost">
          <LuEllipsis />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="project" onClick={handleViewProject}>
              View Project
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

// ----- Table columns -----
const COLUMNS = [
  { key: "sn", label: "S/N", width: "50px" },
  { key: "studentName", label: "Student", width: "200px" },
  { key: "matricNumber", label: "Matric number", width: "160px" },
  { key: "status", label: "Status", width: "120px" },
  { key: "action", label: "Action", width: "60px" },
] as const;

// Helper to format status for display
const formatProjectStatus = (status?: string) => {
  if (!status) return "No Project";
  return status.replace(/_/g, " ").toLowerCase();
};

// Helper to get color palette based on status
const getStatusColorPalette = (status?: string) => {
  if (!status) return "gray";
  const s = status.toUpperCase();
  if (s === "IN_PROGRESS") return "blue";
  if (s === "COMPLETED") return "green";
  if (s === "GRADED") return "purple";
  if (s === "NOT_STARTED") return "yellow";
  return "gray";
};

const TableSkeleton = () => {
  return (
    <Box rounded="md" borderColor="border.muted" overflowX="auto">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            {COLUMNS.map((col) => (
              <Table.ColumnHeader
                key={col.key}
                fontSize="md"
                fontWeight="600"
                color="bg.subtle"
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
          {Array.from({ length: 5 }).map((_, idx) => (
            <Table.Row key={idx}>
              <Table.Cell px="4" py="3.5"><Skeleton h="4" w="8" /></Table.Cell>
              <Table.Cell px="4" py="3.5"><Skeleton h="4" w="32" /></Table.Cell>
              <Table.Cell px="4" py="3.5"><Skeleton h="4" w="24" /></Table.Cell>
              <Table.Cell px="4" py="3.5"><Skeleton h="6" w="20" /></Table.Cell>
              <Table.Cell px="4" py="3.5"><Flex justify="center"><Skeleton h="8" w="8" rounded="md" /></Flex></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

// ----- Main Table component -----
interface ProjectsTableProps {
  studentProjects: StudentProjects[];
  isLoading?: boolean;
}

const ProjectsTable = ({ studentProjects, isLoading }: ProjectsTableProps) => {
  const safeProjects = Array.isArray(studentProjects) ? studentProjects : [];

  if (isLoading) return <TableSkeleton />;
  if (safeProjects.length === 0) {
    return (
      <Flex justify="center" py="12">
        <Text color="gray.500" fontSize="sm">No students with active projects found.</Text>
      </Flex>
    );
  }

  return (
    <Box rounded="md" borderColor="border.muted" bg="white" overflowX="auto">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            {COLUMNS.map((col) => (
              <Table.ColumnHeader
                key={col.key}
                fontSize="sm"
                color="fg.muted"
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
          {safeProjects.map((record, index) => {
            const activeProject = record.projects.find(p => p.googleDocUrl);
            const status = activeProject?.status;
            const formattedStatus = formatProjectStatus(status);
            const colorPalette = getStatusColorPalette(status);
            return (
              <Table.Row key={record.student.id}>
                <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted">
                  {index + 1}
                </Table.Cell>
                <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted">
                  {`${record.student.surname} ${record.student.firstName} ${record.student.otherName || ""}`.trim()}
                </Table.Cell>
                <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted">
                  {record.student.matricNumber}
                </Table.Cell>
                <Table.Cell px="4" py="3.5">
                  <Badge colorPalette={colorPalette} variant="subtle">
                    {formattedStatus}
                  </Badge>
                </Table.Cell>
                <Table.Cell px="4" py="3.5">
                  <Flex justify="center" width="100%">
                    <RowActions record={record} />
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