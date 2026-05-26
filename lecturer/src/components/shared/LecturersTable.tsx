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
  EmptyState,
  VStack,
  ButtonGroup,
  IconButton,
  Pagination,
  Badge,
  Menu,
} from "@chakra-ui/react";
import { MoreHorizontal, Users, ChevronDown } from "lucide-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { Staff } from "@type/lecturer.type";
import { CourseHook } from "@hooks/course.hook";
import React, { useState, useEffect } from "react";

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

const formatRole = (role: string | undefined | null): string => {
  if (!role) return "—";
  const upperKeep = ["HOD", "ERO"];
  if (upperKeep.includes(role)) return role;
  const withSpaces = role.replace(/_/g, " ");
  return withSpaces
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const LecturersTable = ({ lecturers, isLoading }: LecturersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedLecturer, setSelectedLecturer] = useState<Staff | null>(null);
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);
  const { data: assignedCourses = [] } = CourseHook.useAllCourses();

  useEffect(() => {
    setCurrentPage(1);
  }, [lecturers, perPage]);

  const totalPages = Math.ceil(lecturers.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedLecturers = lecturers.slice(startIndex, startIndex + perPage);

  return (
    <Box>
      {/* Toolbar – page size selector on the left */}
      <Flex justify="flex-start" mb="4">
        <Menu.Root>
          <Menu.Trigger asChild>
            <Flex
              align="center"
              gap="2"
              border="xs"
              borderColor="border.muted"
              px="4"
              h="36px"
              rounded="md"
              bg="white"
              cursor="pointer"
            >
              <Text fontSize="sm" color="fg.muted" fontWeight="500">Show</Text>
              <Flex
                bg="accent.50"
                color="accent.500"
                px="2"
                py="0.5"
                rounded="sm"
                align="center"
                justify="center"
              >
                <Text fontSize="sm" fontWeight="600">{perPage}</Text>
              </Flex>
              <Box>
                <ChevronDown size={14} />
              </Box>
            </Flex>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="10" onClick={() => setPerPage(10)}>10 rows</Menu.Item>
                <Menu.Item value="20" onClick={() => setPerPage(20)}>20 rows</Menu.Item>
                <Menu.Item value="50" onClick={() => setPerPage(50)}>50 rows</Menu.Item>
                <Menu.Item value="100" onClick={() => setPerPage(100)}>100 rows</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>

      <Table.ScrollArea>
        <Table.Root size="lg" variant="outline" stickyHeader>
          <Table.Header>
            <Table.Row>
              {COLUMNS.map((col) => (
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
                      <Badge colorPalette="blue" variant="subtle" fontSize="sm" px="2" py="0.5">
                        {formattedRole}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell px="4" py="3.5" fontSize="md" color="gray.700" whiteSpace="nowrap">
                      {courseCount}
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
                              <Menu.Item
                                value="courses"
                                onClick={() => {
                                  setSelectedLecturer(lecturer);
                                  setIsCourseDrawerOpen(true);
                                }}
                              >
                                Courses
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

      {/* Pagination (centered) */}
      {!isLoading && lecturers.length > 0 && totalPages > 1 && (
        <Flex justify="center" mt="4">
          <Pagination.Root
            count={lecturers.length}
            pageSize={perPage}
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

      {/* Course Drawer */}
      {selectedLecturer && (
        <CourseDrawer
          open={isCourseDrawerOpen}
          onOpenChange={(open) => setIsCourseDrawerOpen(open)}
          courses={selectedLecturer.courses || []}
          lecturer={`${selectedLecturer.staffProfile?.firstName || ""} ${selectedLecturer.staffProfile?.lastName || ""}`.trim() || "Staff"}
        />
      )}
    </Box>
  );
};

// COURSE DRAWER (unchanged)
const CourseDrawer = ({ 
  open, 
  onOpenChange, 
  courses, 
  lecturer 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  courses: any[]; 
  lecturer: string; 
}) => {
  return (
    <Drawer.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title fontSize="lg">{lecturer}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body spaceY="4" py="6">
              <Heading size="sm" color="fg.muted">Assigned Courses</Heading>
              <For each={courses}
                fallback={
                  <Flex direction="column" align="center" justify="center" py="10" opacity="0.6">
                    <Text fontSize="sm" color="fg.subtle">No courses assigned</Text>
                  </Flex>
                }>
                {(course) => (
                  <Box key={course.id}
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

export default LecturersTable;