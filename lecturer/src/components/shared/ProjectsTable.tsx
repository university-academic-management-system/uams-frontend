// src/components/shared/ProjectsTable.tsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Box,
  Table,
  Text,
  Flex,
  Button,
  CloseButton,
  Portal,
  Spinner,
  Drawer,
  Heading,
  Separator,
  Skeleton,
  Badge,
  Menu,
  IconButton,
  Select,
  HStack,
  Stack,
  Dialog,
  Field,
  Center,
  NumberInput,
} from "@chakra-ui/react";
import { LuEllipsis, LuEye, LuEyeOff, LuCheck, LuFileText } from "react-icons/lu";
import {
  useProjectTopics,
  useApproveProjectTopic,
  useGradeProject,
} from "@hooks/project.hook";
import { toaster } from "@components/ui/toaster";
import type { ProjectTopic, StudentProjects } from "@type/project.type";
import EmptyStateView from "@components/shared/empty-state";
import ProjectWriter from "@components/shared/ProjectWriter";

// ── Helper: generate academic years from 1999/2000 to current session only ──
const generateSessionOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  const currentSession = `${currentYear - 1}/${currentYear}`;
  const startYear = 1999;
  const sessions: string[] = [];
  // Start from current session and go backwards to 1999/2000
  for (let year = currentYear - 1; year >= startYear; year--) {
    sessions.push(`${year}/${year + 1}`);
  }
  return sessions;
};

// ── Helper: get the current academic session ────────────────────────────────
const getCurrentSession = (): string => {
  const currentYear = new Date().getFullYear();
  return `${currentYear - 1}/${currentYear}`;
};

// ── Status badge ───────────────────────────────────────────────────────────
const TopicStatusBadge = ({ status }: { status: ProjectTopic["status"] }) => {
  const palette =
    status === "APPROVED" ? "green" : status === "REJECTED" ? "red" : "orange";
  return (
    <Badge colorPalette={palette} variant="subtle" size="sm">
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
};

// ── Approved topic card ───────────────────────────────────────────────────
const ApprovedTopicCard = ({ topic }: { topic: ProjectTopic }) => (
  <Box
    border="1px solid"
    borderColor="green.200"
    rounded="lg"
    p="4"
    spaceY="2"
    bg="green.50/30"
    _dark={{ bg: "green.900/20" }}
  >
    <Flex align="center" justify="space-between" gap="2">
      <Heading size="xs" fontWeight="700" flex="1">
        {topic.title}
      </Heading>
      <TopicStatusBadge status={topic.status} />
    </Flex>
    {topic.description && (
      <Text fontSize="xs" color="fg.muted" whiteSpace="pre-wrap" pt="1">
        {topic.description}
      </Text>
    )}
  </Box>
);

// ── Pending topic row (approve only) ──────────────────────────────────────
const PendingTopicRow = ({
  topic,
  onApprove,
  isApproving,
}: {
  topic: ProjectTopic;
  onApprove: (id: string) => void;
  isApproving: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      border="1px solid"
      borderColor="border.muted"
      rounded="md"
      p="3"
      spaceY="2"
    >
      <Flex align="center" justify="space-between" gap="3">
        <Text fontWeight="600" fontSize="sm" flex="1" lineClamp={expanded ? undefined : 1}>
          {topic.title}
        </Text>
        <Flex gap="1.5" shrink="0" align="center">
          <Button
            size="xs"
            variant="outline"
            onClick={() => setExpanded((p) => !p)}
            disabled={!topic.description}
            aria-label="Review description"
          >
            {expanded ? <LuEyeOff /> : <LuEye />}
            {expanded ? "Hide" : "Review"}
          </Button>
          <Button
            size="xs"
            colorPalette="green"
            variant="solid"
            onClick={() => onApprove(topic.id)}
            loading={isApproving}
            aria-label="Approve topic"
          >
            <LuCheck />
            Approve
          </Button>
        </Flex>
      </Flex>
      {expanded && topic.description && (
        <Text fontSize="xs" color="fg.muted" whiteSpace="pre-wrap" pt="1">
          {topic.description}
        </Text>
      )}
    </Box>
  );
};

// ── Topics drawer ──────────────────────────────────────────────────────────
const TopicsDrawer = ({
  open,
  setOpen,
  record,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  record: StudentProjects;
}) => {
  const studentName =
    `${record.student.surname} ${record.student.firstName} ${record.student.otherName ?? ""}`.trim();
  const studentId = record.student.id;
  const matricNumber = record.student.matricNumber;

  const { data: allTopics = [], isLoading, refetch } = useProjectTopics();
  const { mutateAsync: approveTopic, isPending: isApproving } = useApproveProjectTopic();

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  const studentTopics = useMemo(() => {
    return allTopics.filter((topic) => {
      if (topic.studentId === studentId) return true;
      if (topic.student?.matricNumber === matricNumber) return true;
      return false;
    });
  }, [allTopics, studentId, matricNumber]);

  const approvedTopics = studentTopics.filter((t) => t.status === "APPROVED");
  const pendingTopics = studentTopics.filter((t) => t.status !== "APPROVED");

  const handleApprove = async (topicId: string) => {
    try {
      await approveTopic({ topicId, payload: { approved: true } });
      toaster.success({
        title: "Topic Approved",
        description: "The topic has been approved. All other topics have been removed.",
      });
      refetch();
    } catch (err: any) {
      toaster.error({
        title: "Approval Failed",
        description: err?.response?.data?.message ?? err?.message ?? "An error occurred.",
      });
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottom="1px solid" borderColor="border.muted" pb="4">
              <Box>
                <Drawer.Title fontSize="md">
                  Project Topics — {studentName}
                </Drawer.Title>
                <Text fontSize="xs" color="fg.muted" mt="0.5">
                  {matricNumber}
                </Text>
              </Box>
            </Drawer.Header>
            <Drawer.Body py="5" overflowY="auto" spaceY="5">
              {isLoading ? (
                <Flex justify="center" align="center" py="16">
                  <Spinner size="lg" color="accent.500" />
                </Flex>
              ) : studentTopics.length === 0 ? (
                <Flex justify="center" align="center" py="16">
                  <EmptyStateView
                    icon={<LuFileText />}
                    title="No topics submitted"
                    description="This student has not submitted any project topics yet."
                  />
                </Flex>
              ) : (
                <>
                  {approvedTopics.length > 0 && (
                    <Box spaceY="3">
                      <Text fontSize="xs" fontWeight="700" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                        Approved
                      </Text>
                      {approvedTopics.map((topic) => (
                        <ApprovedTopicCard key={topic.id} topic={topic} />
                      ))}
                    </Box>
                  )}
                  {approvedTopics.length > 0 && pendingTopics.length > 0 && <Separator />}
                  {pendingTopics.length > 0 && (
                    <Box spaceY="2">
                      <Text fontSize="xs" fontWeight="700" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                        Pending ({pendingTopics.length})
                      </Text>
                      {pendingTopics.map((topic) => (
                        <PendingTopicRow
                          key={topic.id}
                          topic={topic}
                          onApprove={handleApprove}
                          isApproving={isApproving}
                        />
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" pos="absolute" top="4" right="4" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

// ── Assessment Dialog (using NumberInput for all scores) ─────────────────────
const AssessmentDialog = ({
  open,
  onClose,
  record,
}: {
  open: boolean;
  onClose: () => void;
  record: StudentProjects;
}) => {
  const activeProject = record.projects.find(p => p.googleDocUrl) || record.projects[0];
  const projectId = activeProject?.id;

  const [scores, setScores] = useState({
    proposalScore: 0,
    implementationScore: 0,
    documentationScore: 0,
    defenseScore: 0,
  });

  const { mutate: gradeProject, isPending } = useGradeProject();

  const handleChange = (field: keyof typeof scores, valueAsNumber: number) => {
    setScores((prev) => ({ ...prev, [field]: isNaN(valueAsNumber) ? 0 : valueAsNumber }));
  };

  const handleSubmit = () => {
    if (!projectId) {
      toaster.error({ title: "Error", description: "No project ID found." });
      return;
    }
    gradeProject(
      { projectId, payload: scores },
      {
        onSuccess: () => {
          toaster.success({ title: "Scores saved", description: "Assessment scores have been submitted." });
          onClose();
        },
        onError: (err: any) => {
          toaster.error({ title: "Error", description: err?.response?.data?.message ?? err.message });
        },
      }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Assessment Scores</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label>Proposal Score</Field.Label>
                  <NumberInput.Root
                    value={scores.proposalScore.toString()}
                    onValueChange={(e) => handleChange("proposalScore", e.valueAsNumber)}
                    min={0}
                    max={100}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>
                <Field.Root>
                  <Field.Label>Implementation Score</Field.Label>
                  <NumberInput.Root
                    value={scores.implementationScore.toString()}
                    onValueChange={(e) => handleChange("implementationScore", e.valueAsNumber)}
                    min={0}
                    max={100}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>
                <Field.Root>
                  <Field.Label>Documentation Score</Field.Label>
                  <NumberInput.Root
                    value={scores.documentationScore.toString()}
                    onValueChange={(e) => handleChange("documentationScore", e.valueAsNumber)}
                    min={0}
                    max={100}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>
                <Field.Root>
                  <Field.Label>Defense Score</Field.Label>
                  <NumberInput.Root
                    value={scores.defenseScore.toString()}
                    onValueChange={(e) => handleChange("defenseScore", e.valueAsNumber)}
                    min={0}
                    max={100}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button colorPalette="blue" onClick={handleSubmit} loading={isPending}>
                Submit Scores
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

// ── Row actions (navigates to trigger original ProjectWriter) ──────────────
const RowActions = ({ record }: { record: StudentProjects }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const activeProject = record.projects.find((p) => p.googleDocUrl) || record.projects[0];

  const handleViewProject = () => {
    if (!activeProject?.googleDocUrl) {
      toaster.warning({ description: "No project document available." });
      return;
    }
    const url = `${location.pathname}?doc-url=${encodeURIComponent(activeProject.googleDocUrl)}#project-editor`;
    navigate(url);
  };

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton size="sm" variant="ghost">
            <LuEllipsis />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="topics" onClick={() => setTopicsOpen(true)}>
                Topics
              </Menu.Item>
              <Menu.Item value="project" onClick={handleViewProject}>
                View Project
              </Menu.Item>
              <Menu.Item value="assessment" onClick={() => setAssessmentOpen(true)}>
                Assessment
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <TopicsDrawer open={topicsOpen} setOpen={setTopicsOpen} record={record} />
      <AssessmentDialog open={assessmentOpen} onClose={() => setAssessmentOpen(false)} record={record} />
    </>
  );
};

// ----- Extended Table Columns -----
const COLUMNS = [
  { key: "sn", label: "S/N", width: "50px" },
  { key: "studentName", label: "Student", width: "180px" },
  { key: "matricNumber", label: "Matric number", width: "140px" },
  { key: "session", label: "Session", width: "100px" },
  { key: "defenseScore", label: "Defense Score", width: "110px" },
  { key: "totalScore", label: "Total Score", width: "100px" },
  { key: "gradePoint", label: "Grade Point", width: "100px" },
  { key: "grade", label: "Grade", width: "80px" },
  { key: "status", label: "Status", width: "100px" },
  { key: "action", label: "Action", width: "60px" },
] as const;

const formatProjectStatus = (status?: string) => {
  if (!status) return "No Project";
  const words = status.replace(/_/g, " ").toLowerCase().split(" ");
  const titleCase = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return titleCase;
};

const getStatusColorPalette = (status?: string) => {
  if (!status) return "gray";
  const s = status.toUpperCase();
  if (s === "IN_PROGRESS") return "blue";
  if (s === "COMPLETED") return "green";
  if (s === "GRADED") return "purple";
  if (s === "NOT_STARTED") return "yellow";
  return "gray";
};

const TableSkeleton = () => (
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
            {COLUMNS.map((col, i) => (
              <Table.Cell key={i} px="4" py="3.5" whiteSpace="nowrap">
                <Skeleton h="4" w={col.key === "action" ? "8" : "20"} />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Box>
);

interface ProjectsTableProps {
  studentProjects: StudentProjects[];
  isLoading?: boolean;
}

const ProjectsTable = ({ studentProjects, isLoading }: ProjectsTableProps) => {
  const sessionOptions = useMemo(() => generateSessionOptions(), []);
  const currentSession = useMemo(() => getCurrentSession(), []);

  const [selectedSession, setSelectedSession] = useState<string>("");

  useEffect(() => {
    if (sessionOptions.length === 0) return;
    // If current session exists in options, select it; otherwise the first (most recent)
    const defaultSession = sessionOptions.includes(currentSession)
      ? currentSession
      : sessionOptions[0];
    setSelectedSession(defaultSession);
  }, [sessionOptions, currentSession]);

  const safeProjects = Array.isArray(studentProjects) ? studentProjects : [];

  const filteredProjects = useMemo(() => {
    if (!selectedSession) return safeProjects;
    return safeProjects.filter((record) =>
      record.projects.some((proj) => proj.session === selectedSession)
    );
  }, [safeProjects, selectedSession]);

  if (isLoading) return <TableSkeleton />;

  return (
    <Stack gap="4">
      <HStack py={2} px="4" justify="flex-end">
        <Select.Root
          value={selectedSession ? [selectedSession] : []}
          onValueChange={(e) => setSelectedSession(e.value[0])}
          size="md"
          width="180px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Session" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {sessionOptions.map((session) => (
                  <Select.Item key={session} item={session}>
                    {session}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </HStack>

      <Box overflowX="auto" maxW="100%">
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
            {filteredProjects.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={COLUMNS.length} textAlign="center" py="10" whiteSpace="nowrap">
                  <EmptyStateView
                    icon={<LuFileText />}
                    title="No projects found"
                    description={`No projects for session ${selectedSession}.`}
                  />
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredProjects.map((record, index) => {
                const activeProject = record.projects.find(p => p.googleDocUrl);
                const status = activeProject?.status;
                const formattedStatus = formatProjectStatus(status);
                const colorPalette = getStatusColorPalette(status);
                return (
                  <Table.Row key={record.student.id}>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                      {`${record.student.surname} ${record.student.firstName} ${record.student.otherName || ""}`.trim()}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                      {record.student.matricNumber}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                      {activeProject?.session || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                      {activeProject?.defenseScore ?? "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                      {activeProject?.totalScore ?? "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                      {activeProject?.gradePoint ?? "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="xs" color="fg.muted" whiteSpace="nowrap">
                      {activeProject?.grade ?? "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" whiteSpace="nowrap">
                      <Badge colorPalette={colorPalette} variant="subtle">
                        {formattedStatus}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" whiteSpace="nowrap">
                      <Flex justify="center" width="100%">
                        <RowActions record={record} />
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      <ProjectWriter />
    </Stack>
  );
};

export default ProjectsTable;