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
  Badge, // added Badge
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { MoreHorizontal, Search, User, UserRoundPen, Users } from "lucide-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useNavigate } from "react-router";
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

const pageSizeCollection = createListCollection({
  items: [
    { label: "10 per page", value: "10" },
    { label: "20 per page", value: "20" },
    { label: "50 per page", value: "50" },
    { label: "100 per page", value: "100" },
  ],
});

// Helper function to format role: replace underscores, capitalize words, keep HOD/ERO uppercase
const formatRole = (role: string | undefined | null): string => {
  if (!role) return "—";
  const upperKeep = ["HOD", "ERO"];
  if (upperKeep.includes(role)) return role;
  // Replace underscores with spaces
  const withSpaces = role.replace(/_/g, " ");
  // Capitalize each word
  return withSpaces
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const LecturersTable = ({ lecturers, isLoading }: LecturersTableProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLecturer, setSelectedLecturer] = useState<Staff | null>(null);
  const [isCourseDrawerOpen, setIsCourseDrawerOpen] = useState(false);
  const { data: assignedCourses = [] } = CourseHook.useAllCourses();

  useEffect(() => {
    setCurrentPage(1);
  }, [lecturers]);

  const totalPages = Math.ceil(lecturers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLecturers = lecturers.slice(startIndex, startIndex + pageSize);

  return (
    <Box>
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
                      {lecturer.courses?.length ?? 0}
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

      {/* Pagination – only shown when data is loaded, not loading, and there are lecturers */}
      {!isLoading && lecturers.length > 0 && (
        <Flex justify="space-between" align="center" mt="4" px="2" wrap="wrap" gap="4">
          <Flex align="center" gap="4">
            <Text fontSize="sm" color="gray.600">
              Showing {startIndex + 1}–{Math.min(startIndex + pageSize, lecturers.length)} of {lecturers.length} lecturers
            </Text>
            <Select.Root
              collection={pageSizeCollection}
              value={[pageSize.toString()]}
              onValueChange={(e) => {
                setPageSize(Number(e.value[0]));
                setCurrentPage(1); // Reset to first page when page size changes
              }}
              size="sm"
              width="130px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="10 per page" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content>
                  {pageSizeCollection.items.map((item) => (
                    <Select.Item key={item.value} item={item}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Flex>

          {totalPages > 1 && (
            <Pagination.Root
              count={lecturers.length}
              pageSize={pageSize}
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
          )}
        </Flex>
      )}
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

// COURSE DRAWER
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
              <Drawer.Title fontSize="lg" >{lecturer}</Drawer.Title>
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
