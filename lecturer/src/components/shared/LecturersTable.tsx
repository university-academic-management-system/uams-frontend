import {
  Box,
  Table,
  Text,
  Flex,
  Menu,
  Button,
  Portal,
  Drawer,
  CloseButton,
  For,
  Heading,
  Spinner,
  InputGroup,
  Input,
  Dialog,
  EmptyState,
  VStack,
  ButtonGroup,
  IconButton,
  Pagination,
  Stack,
} from "@chakra-ui/react";
import { MoreHorizontal, Search, User, UserRoundPen, Users } from "lucide-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { Staff } from "@type/lecturer.type";
import { StudentHook } from "@hooks/student.hook";
import { CourseHook } from "@hooks/course.hook";
import React, { useState, useEffect } from "react";
import { AcademicHook } from "@hooks/academic.hook";
import { Checkbox } from "../ui/checkbox";
import { toaster } from "@components/ui/toaster";
import type { Student } from "@type/student.type";

interface LecturersTableProps {
  lecturers: Staff[];
  isLoading?: boolean;
}

const COLUMNS = [
  { key: "sn", label: "S/N", width: "60px" },
  { key: "staffId", label: "Staff ID", width: "140px" },
  { key: "name", label: "Name", width: "160px" },
  { key: "email", label: "Email", width: "200px" },
  { key: "phoneNo", label: "Phone No", width: "160px" },
  { key: "role", label: "Role", width: "100px" },
  { key: "AssignedCourse", label: "Assigned Course", width: "160px" },
  { key: "action", label: "Action", width: "70px" },
] as const;

// Helper function to format role strings (extracted from table JSX)
const formatRole = (role: string | undefined): string => {
  if (!role) return "—";
  const KEEP_UPPER = ["HOD", "ERO"];
  if (KEEP_UPPER.includes(role)) return role;
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

const ITEMS_PER_PAGE = 10;

const LecturersTable = ({ lecturers, isLoading }: LecturersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: allCourses = [], isLoading: isCoursesLoading, error: coursesError } = CourseHook.useAllCourses();

  useEffect(() => {
    setCurrentPage(1);
  }, [lecturers]);

  const totalPages = Math.ceil(lecturers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLecturers = lecturers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalCourses = isCoursesLoading ? 0 : coursesError ? 0 : allCourses.length;

  return (
    <Box>
      <Table.ScrollArea>
        <Table.Root size="lg" variant="line" style={{ tableLayout: 'auto', minWidth: '1200px' }} stickyHeader>
          <Table.Header>
            <Table.Row>
              {COLUMNS.map((col) => (
                <Table.ColumnHeader
                  key={col.key}
                  bg="#f8fafc"
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
                <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={12}>
                  <Flex justify="center" align="center" gap="3">
                    <Spinner size="lg" color="accent.500" />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : lecturers.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={12}>
                  <Flex justify="center">
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <Users />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>No lecturers found</EmptyState.Title>
                          <EmptyState.Description>
                            Try adjusting your search or filter criteria.
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedLecturers.map((lecturer, index) => {
                const staffProfile = lecturer.staffProfile;
                // Build full name from firstName, lastName, otherName
                const fullName = [
                  staffProfile?.firstName,
                  staffProfile?.lastName,
                  staffProfile?.otherName,
                ].filter(Boolean).join(" ").trim() || "—";
                
                const role = staffProfile?.staffRoles?.[0];
                const formattedRole = formatRole(role);

                return (
                  <Table.Row key={lecturer.id}>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.600" whiteSpace="nowrap">
                      {startIndex + index + 1}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {staffProfile?.staffNumber || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" fontWeight="600" whiteSpace="nowrap">
                      {fullName}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.500" whiteSpace="nowrap">
                      {lecturer.email || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {staffProfile?.phone || "—"}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {formattedRole}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {totalCourses}
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" whiteSpace="nowrap">
                      <Menu.Root>
                        <Menu.Trigger asChild>
                          <Button variant="ghost" size="xs">
                            <MoreHorizontal />
                          </Button>
                        </Menu.Trigger>
                        <Portal>
                          <Menu.Positioner>
                            <Menu.Content>
                              <Menu.Item value="courses" asChild>
                                <CourseDrawer courses={totalCourses} lecturer={fullName} />
                              </Menu.Item>
                              <Menu.Item value="students" asChild>
                                <StudentDrawer lecturerId={lecturer.id} lecturer={fullName} />
                              </Menu.Item>
                            </Menu.Content>
                          </Menu.Positioner>
                        </Portal>
                      </Menu.Root>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Pagination – only shown when data is loaded, not loading, and there are lecturers */}
      {!isLoading && lecturers.length > 0 && totalPages > 1 && (
        <Flex justify="space-between" align="center" mt="4" px="2">
          <Text fontSize="sm" color="gray.600">
            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, lecturers.length)} of {lecturers.length} lecturers
          </Text>
          <Pagination.Root
            count={lecturers.length}
            pageSize={ITEMS_PER_PAGE}
            page={currentPage}
            onPageChange={(e) => setCurrentPage(e.page)}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton
                    variant={{ base: "ghost", _selected: "outline" }}
                  >
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

// ========== COURSE DRAWER ==========
const CourseDrawer = ({ courses, lecturer }: { courses: any; lecturer: string }) => {
  const courseCount = courses;
  
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="xs" w="full" justifyContent="start" fontWeight="500" _focus={{ ring: "none" }}>
          Courses
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content roundedLeft="xl">
            <Drawer.Header borderBottomWidth="1px" borderColor="border.muted" py="4">
              <Drawer.Title fontSize="lg" fontWeight="600">{lecturer}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body spaceY="4" py="6">
              <Heading size="sm" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                Assigned Courses
              </Heading>
              <Flex direction="column" align="center" justify="center" py="10">
                <Text fontSize="sm" color="fg.subtle">
                  Total courses assigned: {courseCount}
                </Text>
              </Flex>
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

// STUDENT DRAWER
const StudentDrawer = ({ lecturerId, lecturer }: { lecturerId: string; lecturer: string }) => {
  const [open, setOpen] = useState(false);
  const [showAssigned, setShowAssigned] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: activeSession, isLoading: isSessionLoading } = AcademicHook.useActiveSession();
  const { data: students, isLoading, refetch } = StudentHook.useUnassignedStudents();
  const { 
    data: assignedStudents, 
    isLoading: isAssignedLoading, 
    refetch: refetchAssigned 
  } = StudentHook.useAssignedStudents(lecturerId);
  
  const { mutate: assignStudents, isPending: isAssigning } = StudentHook.useAssignStudents({
    onSuccess: () => {
      toaster.create({
        title: "Students assigned successfully",
        type: "success",
      });
      setSelectedStudents(new Set());
      refetch();
      refetchAssigned();
      setOpen(false);
    }
  });

  const { mutate: removeStudent, isPending: isRemoving } = StudentHook.useRemoveAssignedStudent({
    onSuccess: () => {
      toaster.create({
        title: "Student removed successfully",
        type: "success",
      });
      refetchAssigned();
      refetch();
    }
  });

  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [studentToRemove, setStudentToRemove] = useState<Student | null>(null);

  const filteredStudents = React.useMemo(() => {
    if (!students) return [];
    if (!searchTerm.trim()) return students;
    const searchLower = searchTerm.toLowerCase().trim();
    return students.filter(student => {
      const fullName = (student.name || student.fullName || "").toLowerCase();
      const email = (student.email || "").toLowerCase();
      const matricNumber = (student.matricNumber || "").toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower) || matricNumber.includes(searchLower);
    });
  }, [students, searchTerm]);

  const filteredAssignedStudents = React.useMemo(() => {
    if (!assignedStudents) return [];
    if (!searchTerm.trim()) return assignedStudents;
    const searchLower = searchTerm.toLowerCase().trim();
    return assignedStudents.filter(student => {
      const fullName = (student.name || student.fullName || "").toLowerCase();
      const email = (student.email || "").toLowerCase();
      const matricNumber = (student.matricNumber || "").toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower) || matricNumber.includes(searchLower);
    });
  }, [assignedStudents, searchTerm]);

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isAllSelected = students && students.length > 0 && selectedStudents.size === students.length;
  const toggleAll = () => {
    if (isAllSelected) setSelectedStudents(new Set());
    else setSelectedStudents(new Set(students?.map((s) => s.id)));
  };

  const handleAssign = () => {
    if (selectedStudents.size === 0 || !activeSession?.id) return;
    assignStudents({
      lecturerId,
      sessionId: activeSession.id,
      studentIds: Array.from(selectedStudents),
      notes: "students for project supervisor"
    });
  };

  const handleRemoveStudent = () => {
    if (!studentToRemove || !activeSession?.id) return;
    removeStudent({
      lecturerId,
      studentId: studentToRemove.id,
      sessionId: activeSession.id
    });
    setStudentToRemove(null);
  };

  return (
    <Drawer.Root size="md" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="xs" w="full" justifyContent="start" fontWeight="500" _focus={{ ring: "none" }}>
          Students
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content roundedLeft="xl" maxW="450px">
            <Drawer.Header borderBottomWidth="1px" borderColor="border.muted" py="4">
              <Flex justify="space-between" align="center">
                <Box>
                  <Drawer.Title fontSize="lg" fontWeight="600">{lecturer}</Drawer.Title>
                  <Text fontSize="xs" color="fg.muted">Unassigned Students</Text>
                </Box>
                <Flex align="center" gap="2">
                  {students && students.length > 0 && (
                    <Text fontSize="xs" fontWeight="600" color="accent">
                      {selectedStudents.size} selected
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Drawer.Header>
            
            <Stack px="4" pt="3" pb="2" colorPalette={"accent"}>
              <Button 
                w="150px"
                variant="outline"
                onClick={() => setShowAssigned(true)}
                rounded="md"
                px="3"
                py="2"
                fontSize="sm"
                fontWeight="500"
              >
                View Assigned ({assignedStudents?.length || 0})
              </Button>
            </Stack>

            <Box px="4" py="3" borderBottomWidth="1px" borderColor="border.muted">
              <Flex align="center" gap="2" colorPalette={"accent"}>
                <Box flex="1">
                  <InputGroup startElement={<Search />}>
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      border="1px solid"
                      size="lg"
                      pl="10"
                    />
                  </InputGroup>
                </Box>
                {searchTerm && (
                  <Button size="sm" variant="ghost" onClick={() => setSearchTerm('')} color="fg.muted">
                    Clear
                  </Button>
                )}
              </Flex>
            </Box>

            <Drawer.Body spaceY="4" py="6" pb="24" overflowY="auto">
              {isLoading ? (
                <Flex direction="column" align="center" justify="center" py="20" gap="2">
                  <Spinner size="lg" color="accent" />
                  <Text fontSize="sm" color="fg.subtle">Fetching students...</Text>
                </Flex>
              ) : !students || students.length === 0 ? (
                <Flex direction="column" align="center" justify="center" py="20" gap="4">
                  <Box bg="fg.subtle" p="4" rounded="full"><UserRoundPen /></Box>
                  <Box textAlign="center">
                    <Text fontSize="sm" fontWeight="600" color="fg.muted">No students found</Text>
                    <Text fontSize="xs" color="fg.subtle" mt="1">No unassigned final year students available.</Text>
                  </Box>
                </Flex>
              ) : (
                <>
                  <Flex align="center" justify="space-between" mb="4">
                    <Heading size="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                      Students ({filteredStudents.length})
                    </Heading>
                    <Flex align="center" gap="2">
                      <Text fontSize="xs" fontWeight="600" color="fg.muted">Select All</Text>
                      <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
                    </Flex>
                  </Flex>
                  
                  {filteredStudents.length === 0 ? (
                    <Flex direction="column" align="center" justify="center" py="10" gap="2">
                      <Text fontSize="sm" color="fg.muted">No students match your search</Text>
                      <Button size="xs" variant="ghost" color="accent" onClick={() => setSearchTerm('')}>Clear search</Button>
                    </Flex>
                  ) : (
                    <For each={filteredStudents}>
                      {(student) => (
                        <Box 
                          key={student.id}
                          border="1px solid"
                          borderColor={selectedStudents.has(student.id) ? "blue.200" : "gray.100"}
                          bg={selectedStudents.has(student.id) ? "blue.50/30" : "white"}
                          rounded="lg"
                          p="4"
                          position="relative"
                          cursor="pointer"
                          onClick={() => toggleStudent(student.id)}
                        >
                          <Flex align="flex-start" justify="space-between">
                            <Box flex="1">
                              <Text fontWeight="700" fontSize="sm" color="fg.muted" mb="0.5">
                                {student.name || student.fullName}
                              </Text>
                              <Text fontSize="xs" color="fg.muted" fontWeight="500">{student.email}</Text>
                              <Flex align="center" gap="2" mt="2">
                                <Box px="2" py="0.5" bg="fg.subtle" rounded="full">
                                  <Text fontSize="10px" fontWeight="700" color="fg.muted">{student.matricNumber}</Text>
                                </Box>
                                {student.level && (
                                  <Box px="2" py="0.5" bg="blue.50" rounded="full">
                                    <Text fontSize="10px" fontWeight="700" color="accent">
                                      Level {typeof student.level === 'string' ? student.level : student.level.name}
                                    </Text>
                                  </Box>
                                )}
                              </Flex>
                            </Box>
                            <Checkbox checked={selectedStudents.has(student.id)} onCheckedChange={() => toggleStudent(student.id)} onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                          </Flex>
                        </Box>
                      )}
                    </For>
                  )}
                </>
              )}
            </Drawer.Body>
            
            {students && students.length > 0 && (
              <Box position="absolute" bottom="0" left="0" right="0" bg="white" borderTopWidth="1px" borderColor="border.muted" p="4" zIndex="10" borderBottomLeftRadius="xl">
                <Button colorPalette="accent" w="full" h="12" rounded="md" fontWeight="700" onClick={handleAssign} disabled={selectedStudents.size === 0 || isAssigning || isSessionLoading || !activeSession?.id} loading={isAssigning || isSessionLoading} bg="blue.600" _hover={{ bg: "blue.700" }}>
                  Assign ({selectedStudents.size}) Selected Students
                </Button>
              </Box>
            )}
            
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" pos="absolute" top="4" right="4" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>

      {/* Assigned Students Drawer */}
      <Drawer.Root open={showAssigned} onOpenChange={(e) => setShowAssigned(e.open)} placement="start">
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content roundedRight="xl" maxW="450px">
              <Drawer.Header borderBottomWidth="1px" borderColor="border.muted" py="4">
                <Box>
                  <Drawer.Title fontSize="lg" fontWeight="600">{lecturer}</Drawer.Title>
                  <Text fontSize="xs" color="fg.muted">Assigned Students</Text>
                </Box>
              </Drawer.Header>
              <Box px="4" py="3" borderBottomWidth="1px" borderColor="border.muted">
                <Flex align="center" gap="2" colorPalette={"accent"}>
                  <Box flex="1">
                    <InputGroup startElement={<Search />}>
                      <Input
                        type="text"
                        placeholder="Search assigned students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        border="1px solid"
                        pl="10"
                      />
                    </InputGroup>
                  </Box>
                  {searchTerm && (
                    <Button size="sm" variant="ghost" onClick={() => setSearchTerm('')}>
                      Clear
                    </Button>
                  )}
                </Flex>
              </Box>
              <Drawer.Body spaceY="4" py="6" overflowY="auto">
                {isAssignedLoading ? (
                  <Flex direction="column" align="center" justify="center" py="20" gap="2">
                    <Spinner size="lg" color="accent" />
                    <Text fontSize="sm" color="fg.muted">Loading assigned students...</Text>
                  </Flex>
                ) : !assignedStudents || assignedStudents.length === 0 ? (
                  <Flex direction="column" align="center" justify="center" py="20" gap="4">
                    <Box bg="fg.subtle" p="4" rounded="full"><User /></Box>
                    <Box textAlign="center">
                      <Text fontSize="sm" fontWeight="600" color="fg.muted">No assigned students</Text>
                      <Text fontSize="xs" color="fg.subtle" mt="1">This lecturer hasn't been assigned any students yet.</Text>
                      <Button size="sm" colorPalette="accent" mt="4" onClick={() => setShowAssigned(false)}>Back to Unassigned</Button>
                    </Box>
                  </Flex>
                ) : (
                  <>
                    <Heading size="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" mb="4">
                      Students ({filteredAssignedStudents.length})
                    </Heading>
                    <For each={filteredAssignedStudents}>
                      {(student) => (
                        <Box key={student.id} border="1px solid" borderColor="border.muted" bg="white" rounded="md" p="4">
                          <Flex align="flex-start" justify="space-between">
                            <Box flex="1">
                              <Text fontWeight="700" fontSize="sm" color="fg.muted" mb="0.5">{student.name || student.fullName}</Text>
                              <Text fontSize="xs" color="fg.subtle" fontWeight="500">{student.email}</Text>
                              <Flex align="center" gap="2" mt="2">
                                <Box px="2" py="0.5" bg="gray.100" rounded="full">
                                  <Text fontSize="10px" fontWeight="700" color="fg.muted">{student.matricNumber}</Text>
                                </Box>
                                {student.level && (
                                  <Box px="2" py="0.5" bg="green.50" rounded="full">
                                    <Text fontSize="10px" fontWeight="700" color="green.600">
                                      Level {typeof student.level === 'string' ? student.level : student.level.name}
                                    </Text>
                                  </Box>
                                )}
                              </Flex>
                            </Box>
                            <Button size="xs" colorPalette="red" variant="ghost" onClick={() => setStudentToRemove(student)} loading={isRemoving && studentToRemove?.id === student.id}>
                              Remove
                            </Button>
                          </Flex>
                        </Box>
                      )}
                    </For>
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

      {/* Confirmation Dialog */}
      <Dialog.Root open={!!studentToRemove} onOpenChange={() => setStudentToRemove(null)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content rounded="xl" maxW="400px">
              <Dialog.Header borderBottomWidth="1px" borderColor="border.muted" py="4">
                <Dialog.Title fontSize="lg" fontWeight="600">Confirm Removal</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body py="6">
                <Text>Are you sure you want to remove {studentToRemove?.name || studentToRemove?.fullName} from this lecturer?</Text>
              </Dialog.Body>
              <Dialog.Footer borderTopWidth="1px" borderColor="border.muted" py="4">
                <Flex gap="3" justify="flex-end">
                  <Button variant="outline" onClick={() => setStudentToRemove(null)}>Cancel</Button>
                  <Button colorPalette="accent" onClick={handleRemoveStudent} loading={isRemoving} bg="accent">Remove</Button>
                </Flex>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" pos="absolute" top="4" right="4" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Drawer.Root>
  );
};