// src/components/shared/LecturersTable.tsx
import { useState, useMemo } from "react";
import {
  Box,
  Table,
  Text,
  Flex,
  Button,
  Portal,
  Drawer,
  CloseButton,
  For,
  Heading,
  Spinner,
  ButtonGroup,
  IconButton,
  Pagination,
  Badge,
  Menu,
  Input,
  InputGroup,
} from "@chakra-ui/react";
import { MoreHorizontal, Users } from "lucide-react";
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu";
import type { Staff, LecturersTableProps } from "@type/lecturer.type";
import { LECTURERS_TABLE_COLUMNS } from "@type/lecturer.type";
import { formatRole } from "@utils/function.util";
import EmptyStateView from "@components/shared/empty-state";
import { useStudents } from "@hooks/student.hook";
import { useBulkAssignSupervisors } from "@hooks/project.hook";
import { toaster } from "@components/ui/toaster";
import { Checkbox } from "@components/ui/checkbox";

const CoursesDrawer = ({
  open,
  setOpen,
  lecturer,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  lecturer: Staff;
}) => {
  const courses = lecturer.courses || [];
  const name =
    `${lecturer.staffProfile?.firstName || ""} ${lecturer.staffProfile?.lastName || ""} ${lecturer.staffProfile?.otherName || ""}`.trim() ||
    "Staff";

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title fontSize="md">Courses for {name}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body spaceY="4" py="6">
              <Heading size="sm" color="fg.muted">Assigned Courses</Heading>
              <For
                each={courses}
                fallback={
                  <EmptyStateView
                    icon={<Users />}
                    title="No courses assigned"
                    description="This lecturer has not been assigned any courses."
                  />
                }
              >
                {(course) => (
                  <Box
                    key={course.id}
                    border="1px solid"
                    borderColor="border.muted"
                    rounded="lg"
                    p="4"
                  >
                    <Text color="fg.muted" fontSize="sm" mb="1">{course.code}</Text>
                    <Heading size="sm" color="fg.muted">{course.title}</Heading>
                  </Box>
                )}
              </For>
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

const AssignStudentDrawer = ({
  open,
  setOpen,
  lecturer,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  lecturer: Staff;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  const { data: students = [], isLoading: isLoadingStudents } = useStudents();
  const { mutateAsync: assignSupervisors, isPending: isAssigning } = useBulkAssignSupervisors();

  const name =
    `${lecturer.staffProfile?.firstName || ""} ${lecturer.staffProfile?.lastName || ""} ${lecturer.staffProfile?.otherName || ""}`.trim() ||
    "Staff";

  // Filter students based on search query, showing only 400 Level students
  const filteredStudents = useMemo(() => {
    const levelStudents = students.filter((student) => student.studentProfile?.level === "L400");
    const query = searchQuery.toLowerCase().trim();
    if (!query) return levelStudents;
    return levelStudents.filter((student) => {
      const profile = student.studentProfile;
      const fullName = `${profile?.firstName || ""} ${profile?.lastName || ""} ${profile?.otherName || ""}`.toLowerCase();
      const matric = (profile?.matricNumber || "").toLowerCase();
      const email = (student.email || "").toLowerCase();
      return fullName.includes(query) || matric.includes(query) || email.includes(query);
    });
  }, [students, searchQuery]);

  const levelStudentsCount = useMemo(() => {
    return students.filter((student) => student.studentProfile?.level === "L400").length;
  }, [students]);

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredStudents.map((s) => s.id);
      setSelectedStudentIds(new Set(allIds));
    } else {
      setSelectedStudentIds(new Set());
    }
  };

  const isAllSelected = filteredStudents.length > 0 && filteredStudents.every((s) => selectedStudentIds.has(s.id));
  const isSomeSelected = filteredStudents.length > 0 && filteredStudents.some((s) => selectedStudentIds.has(s.id)) && !isAllSelected;

  const handleAssign = async () => {
    if (selectedStudentIds.size === 0) return;
    try {
      const payload = {
        studentIds: Array.from(selectedStudentIds),
        supervisorId: lecturer.id,
      };
      await assignSupervisors(payload);
      toaster.success({
        title: "Assignment Successful",
        description: `Successfully assigned ${selectedStudentIds.size} student(s) to ${name}.`,
      });
      setSelectedStudentIds(new Set());
      setSearchQuery("");
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      toaster.error({
        title: "Assignment Failed",
        description: error?.response?.data?.message || error?.message || "An error occurred while assigning students.",
      });
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title fontSize="md">Assign Students to {name}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body spaceY="4" py="6" display="flex" flexDirection="column" maxH="calc(100vh - 120px)">
              {/* Search Box */}
              <InputGroup startElement={<LuSearch />}>
                <Input
                  placeholder="Search students by name, matric no, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="md"
                />
              </InputGroup>

              {isLoadingStudents ? (
                <Flex justify="center" align="center" flex="1" py="10">
                  <Spinner size="lg" color="accent.500" />
                </Flex>
              ) : levelStudentsCount === 0 ? (
                <Flex justify="center" align="center" flex="1" py="10">
                  <EmptyStateView
                    icon={<Users />}
                    title="No 400 Level students found"
                    description="There are no 400 Level students available in this department."
                  />
                </Flex>
              ) : (
                <Flex flexDirection="column" flex="1" overflow="hidden" spaceY="3">
                  {/* Select All Checkbox */}
                  <Box pb="2" borderBottom="1px solid" borderColor="border.muted">
                    <Checkbox
                      colorPalette="accent"
                      checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                      onCheckedChange={(details) => handleSelectAll(!!details.checked)}
                    >
                      <Text fontWeight="600" fontSize="sm">
                        Select All ({filteredStudents.length} students)
                      </Text>
                    </Checkbox>
                  </Box>

                  {/* Scrollable list */}
                  <Box overflowY="auto" flex="1" pr="1" spaceY="1">
                    {filteredStudents.length === 0 ? (
                      <Text color="fg.muted" fontSize="sm" textAlign="center" py="4">
                        No students match your search criteria.
                      </Text>
                    ) : (
                      filteredStudents.map((student) => {
                        const profile = student.studentProfile;
                        const studentName = `${profile?.lastName || ""} ${profile?.firstName || ""} ${profile?.otherName || ""}`.trim() || student.email;
                        return (
                          <Flex
                            key={student.id}
                            p="3"
                            rounded="md"
                            _hover={{ bg: "bg.muted" }}
                            borderBottom="1px solid"
                            borderColor="border.muted"
                            align="center"
                          >
                            <Checkbox
                              colorPalette="accent"
                              checked={selectedStudentIds.has(student.id)}
                              onCheckedChange={() => handleToggleStudent(student.id)}
                            >
                              <Box ml="2">
                                <Text fontWeight="600" fontSize="sm">
                                  {studentName}
                                </Text>
                                <Text fontSize="xs" color="fg.muted">
                                  {profile?.matricNumber || "No Matric No."} • {profile?.level || "Unknown Level"} • {student.email}
                                </Text>
                              </Box>
                            </Checkbox>
                          </Flex>
                        );
                      })
                    )}
                  </Box>
                </Flex>
              )}
            </Drawer.Body>

            <Drawer.Footer borderTop="1px solid" borderColor="border.muted" py="4" px="6" justifyContent="flex-end">
              <Button
                colorPalette="accent"
                size="sm"
                onClick={handleAssign}
                disabled={selectedStudentIds.size === 0 || isAssigning}
                loading={isAssigning}
              >
                Assign ({selectedStudentIds.size})
              </Button>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" pos="absolute" top="4" right="4" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

const LecturerActionCell = ({ lecturer }: { lecturer: Staff }) => {
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="ghost" size="xs">
            <MoreHorizontal />
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="courses" onClick={() => setCoursesOpen(true)}>
                Courses
              </Menu.Item>
              <Menu.Item value="assign" onClick={() => setAssignOpen(true)}>
                Assign Student
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <CoursesDrawer open={coursesOpen} setOpen={setCoursesOpen} lecturer={lecturer} />
      <AssignStudentDrawer open={assignOpen} setOpen={setAssignOpen} lecturer={lecturer} />
    </>
  );
};

interface LecturersTablePropsExtended extends LecturersTableProps {
  paginatedLecturers: Staff[];
  startIndex: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const LecturersTable = ({
  lecturers,
  isLoading,
  paginatedLecturers,
  startIndex,
  currentPage,
  totalPages,
  perPage,
  onPageChange,
}: LecturersTablePropsExtended) => {
  return (
    <Box>
      <Table.ScrollArea>
        <Table.Root size="lg" variant="outline" stickyHeader>
          <Table.Header>
            <Table.Row>
              {LECTURERS_TABLE_COLUMNS.map((col) => (
                <Table.ColumnHeader
                  key={col.key}
                  bg="bg.muted"
                  fontSize="lg"
                  fontWeight="600"
                  color="fg.muted"
                  textTransform="none"
                  minW={col.width}
                  px="4"
                  py="3"
                  whiteSpace="nowrap"
                >
                  {col.label}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={LECTURERS_TABLE_COLUMNS.length} textAlign="center" py={12}>
                  <Flex justify="center" align="center" gap="3">
                    <Spinner size="lg" color="accent.500" />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : lecturers.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={LECTURERS_TABLE_COLUMNS.length} textAlign="center" py={12}>
                  <EmptyStateView
                    icon={<Users />}
                    title="No lecturers found"
                    description="Try adjusting your search or filter criteria."
                  />
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedLecturers.map((lecturer, index) => {
                const staffRole = lecturer.staffProfile?.staffRoles?.[0];
                const formattedRole = formatRole(staffRole);
                const courseCount = lecturer.courses?.length ?? 0;
                return (
                  <Table.Row key={lecturer.id}>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.600" whiteSpace="nowrap">
                      {startIndex + index + 1}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {lecturer.staffProfile?.staffNumber || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" fontWeight="600" whiteSpace="nowrap">
                      {`${lecturer.staffProfile?.firstName || ""} ${lecturer.staffProfile?.lastName || ""} ${lecturer.staffProfile?.otherName || ""}`.trim() || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.500" whiteSpace="nowrap">
                      {lecturer.email || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {lecturer.staffProfile?.phone || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" whiteSpace="nowrap">
                      <Badge colorPalette="gray" variant="subtle" fontSize="sm" px="2" py="0.5">
                        {formattedRole}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {courseCount}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" whiteSpace="nowrap">
                      <LecturerActionCell lecturer={lecturer} />
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Pagination controls */}
      {!isLoading && lecturers.length > 0 && totalPages > 1 && (
        <Flex justify="center" mt="4">
          <Pagination.Root
            count={lecturers.length}
            pageSize={perPage}
            page={currentPage}
            onPageChange={(e) => onPageChange(e.page)}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                    {page.value}
                  </IconButton>
                )}
              />
              <Pagination.NextTrigger asChild>
                <IconButton>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Flex>
      )}
    </Box>
  );
};

export default LecturersTable;