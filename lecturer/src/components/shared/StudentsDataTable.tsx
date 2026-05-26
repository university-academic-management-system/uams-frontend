// src/components/shared/StudentsDataTable.tsx
import { useState } from "react";
import {
  Box,
  Table,
  Center,
  Spinner,
  EmptyState,
  VStack,
  Badge,
  Menu,
  Portal,
  IconButton,
  Drawer,
  CloseButton,
  Flex,
  Text,
  Button,
  Grid,
  ButtonGroup,
  Pagination,
} from "@chakra-ui/react";
import { LuUsers, LuCircleAlert, LuFileText, LuChartNoAxesCombined, LuEllipsis, LuChevronRight, LuChevronLeft, LuChevronDown } from "react-icons/lu";
import type { Student } from "@type/student.type";
import jsPDF from "jspdf";
import { capitaliseName, formatLevel } from "@utils/function.util";

interface StudentsDataTableProps {
  students: Student[];
  isLoading?: boolean;
  error?: Error | null;
}

const COLUMNS = [
  { key: "sn", label: "S/N", width: "50px" },
  { key: "fullName", label: "Full Name", width: "180px" },
  { key: "regNo", label: "Reg No.", width: "140px" },
  { key: "matNo", label: "Mat. No.", width: "130px" },
  { key: "email", label: "Email", width: "180px" },
  { key: "phoneNo", label: "Phone No", width: "140px" },
  { key: "gender", label: "Gender", width: "80px" },
  { key: "level", label: "Level", width: "80px" },
  { key: "admissionYear", label: "Admission Year", width: "130px" },
  { key: "admissionSession", label: "Admission Session", width: "140px" },
  { key: "regStatus", label: "Registration Status", width: "150px" },
  { key: "academicStanding", label: "Academic Standing", width: "150px" },
  { key: "cgpa", label: "CGPA", width: "80px" },
  { key: "status", label: "Status", width: "100px" },
  { key: "action", label: "", width: "50px" },
] as const;

// Helper to format and color registration status
const getRegistrationStatusBadge = (status: string | undefined) => {
  if (!status) return <Badge>Unknown</Badge>;
  const normalized = status.toUpperCase();
  let colorScheme = "gray";
  let label = status.replace("_", " ");
  switch (normalized) {
    case "REGISTERED":
      colorScheme = "green";
      break;
    case "PENDING":
      colorScheme = "yellow";
      break;
    case "INCOMPLETE":
      colorScheme = "orange";
      break;
    case "CLEARED":
      colorScheme = "blue";
      break;
  }
  return <Badge colorPalette={colorScheme}>{label}</Badge>;
};

// Helper to format and color academic standing
const getAcademicStandingBadge = (standing: string | undefined) => {
  if (!standing) return <Badge>Unknown</Badge>;
  const normalized = standing.toUpperCase();
  let colorScheme = "gray";
  let label = standing.replace("_", " ");
  switch (normalized) {
    case "GOOD_STANDING":
      colorScheme = "green";
      label = "Good Standing";
      break;
    case "PROBATION":
      colorScheme = "red";
      break;
    case "SUSPENDED":
      colorScheme = "red";
      break;
    case "WARNING":
      colorScheme = "yellow";
      break;
    case "WITHDRAWN":
      colorScheme = "gray";
      break;
  }
  return <Badge colorPalette={colorScheme}>{label}</Badge>;
};

export const StudentsDataTable = ({ students, isLoading, error }: StudentsDataTableProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const totalPages = Math.ceil(students.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedStudents = students.slice(startIndex, startIndex + perPage);

  const handleOpenDrawer = (student: Student) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
  };

  const exportStudentRecord = async (student: Student) => {
    try {
      setIsExporting(true);
      const doc = new jsPDF({ orientation: "portrait" });
      const profile = student.studentProfile;
      if (!profile) return;

      doc.setFontSize(16);
      doc.text("Academic Record", 14, 15);
      doc.setFontSize(12);
      doc.text(`Name: ${capitaliseName(profile.firstName)} ${capitaliseName(profile.lastName)}`, 14, 30);
      doc.text(`Matric No: ${profile.matricNumber || "—"}`, 14, 40);
      doc.text(`Level: ${formatLevel(profile.level)}`, 14, 50);
      doc.text(`Programme: ${profile.degreeAwarded || "—"}`, 14, 60);
      doc.text(`Current Session: ${profile.currentSession || "—"}`, 14, 70);
      doc.text(`CGPA: ${profile.cgpa ?? "—"}`, 14, 80);
      doc.text(`GPA: ${profile.gpa ?? "—"}`, 14, 90);
      doc.text(`SGPA: ${profile.sgpa ?? "—"}`, 14, 100);
      doc.text(`Total Credits Earned: ${profile.totalCreditsEarned}`, 14, 110);
      doc.text(`Total Credits Attempted: ${profile.totalCreditsAttempted}`, 14, 120);
      doc.text(`Carryover Courses: ${profile.carryoverCourses ?? 0}`, 14, 130);

      const levelNum = parseInt(formatLevel(profile.level), 10);
      if (!isNaN(levelNum) && levelNum >= 400) {
        doc.text("Project Topic: (not stored in profile)", 14, 150);
      }

      doc.save(`Student_Record_${profile.matricNumber || student.id}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Box>
      {/* Page size selector – left aligned */}
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
              <Box color="fg.muted">
                <LuChevronDown size={14} />
              </Box>
            </Flex>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="10" onClick={() => { setPerPage(10); setCurrentPage(1); }}>10 rows</Menu.Item>
                <Menu.Item value="20" onClick={() => { setPerPage(20); setCurrentPage(1); }}>20 rows</Menu.Item>
                <Menu.Item value="50" onClick={() => { setPerPage(50); setCurrentPage(1); }}>50 rows</Menu.Item>
                <Menu.Item value="100" onClick={() => { setPerPage(100); setCurrentPage(1); }}>100 rows</Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>

      <Box borderWidth="1px" borderColor="border.muted" rounded="md" overflowX="auto">
        <Table.Root size="lg" variant="outline" stickyHeader>
          <Table.Header>
            <Table.Row>
              {COLUMNS.map((col) => (
                <Table.ColumnHeader
                  key={col.key}
                  fontSize="md"
                  bg="bg.muted"
                  color="fg.subtle"
                  textTransform="none"
                  minW={col.width}
                  px="3"
                  py="3"
                  whiteSpace="nowrap"
                  borderBottomWidth="1px"
                  borderBottomColor="border.muted"
                >
                  {col.label}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={10}>
                  <Center>
                    <Spinner size="lg" color="accent.500" />
                  </Center>
                </Table.Cell>
              </Table.Row>
            ) : error ? (
              <Table.Row>
                <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={10}>
                  <EmptyState.Root>
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <LuCircleAlert />
                      </EmptyState.Indicator>
                      <VStack textAlign="center">
                        <EmptyState.Title>Failed to load students</EmptyState.Title>
                        <EmptyState.Description>{error.message}</EmptyState.Description>
                      </VStack>
                    </EmptyState.Content>
                  </EmptyState.Root>
                </Table.Cell>
              </Table.Row>
            ) : students.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={COLUMNS.length} textAlign="center" py={10}>
                  <EmptyState.Root>
                    <EmptyState.Content>
                      <EmptyState.Indicator>
                        <LuUsers />
                      </EmptyState.Indicator>
                      <VStack textAlign="center">
                        <EmptyState.Title>No students found</EmptyState.Title>
                        <EmptyState.Description>Try adjusting your search or filters.</EmptyState.Description>
                      </VStack>
                    </EmptyState.Content>
                  </EmptyState.Root>
                </Table.Cell>
              </Table.Row>
            ) : (
              paginatedStudents.map((student, index) => {
                const profile = student.studentProfile;
                const firstName = capitaliseName(profile?.firstName);
                const lastName = capitaliseName(profile?.lastName);
                const otherName = capitaliseName(profile?.otherName);
                const fullName = [firstName, lastName, otherName].filter((p) => p !== "—").join(" ");
                return (
                  <Table.Row key={student.id} borderBottomWidth="1px" borderBottomColor="border.muted">
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {startIndex + index + 1}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                      {fullName || "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                      {profile?.registrationNo || "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted" fontWeight="500">
                      {profile?.matricNumber || "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {student.email}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {profile?.phone || "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {profile?.gender || "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {formatLevel(profile?.level)}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {profile?.admissionYear || "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {profile?.admissionSession || "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {getRegistrationStatusBadge(profile?.registrationStatus)}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {getAcademicStandingBadge(profile?.academicStanding)}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {profile?.cgpa ?? "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      <Badge colorPalette={student.status === "ACTIVE" ? "green" : "red"}>{student.status || "ACTIVE"}</Badge>
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap">
                      <Menu.Root>
                        <Menu.Trigger asChild>
                          <IconButton size="sm" variant="ghost">
                            <LuEllipsis />
                          </IconButton>
                        </Menu.Trigger>
                        <Portal>
                          <Menu.Positioner>
                            <Menu.Content>
                              <Menu.Item value="stats" onClick={() => handleOpenDrawer(student)}>
                                <LuChartNoAxesCombined /> Stats & Records
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
      </Box>

      {/* Pagination – centered */}
      {!isLoading && students.length > 0 && totalPages > 1 && (
        <Flex justify="center" mt="4">
          <Pagination.Root
            count={students.length}
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

      {/* Right Drawer – unchanged */}
      <Drawer.Root open={drawerOpen} onOpenChange={(details) => setDrawerOpen(details.open)} placement="end" size="md">
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Student Performance Dashboard</Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body>
                {selectedStudent && (() => {
                  const profile = selectedStudent.studentProfile;
                  if (!profile) return <Text>No profile data available.</Text>;
                  return (
                    <Box>
                      <Text fontSize="lg" mb={4}>
                        {capitaliseName(profile.firstName)} {capitaliseName(profile.otherName)}
                      </Text>
                      <Grid templateColumns="1fr 1fr" gap={4} mb={6}>
                        <Box p={3} rounded="md" borderColor="border.muted">
                          <Text fontSize="sm" color="fg.subtle">CGPA</Text>
                          <Text fontSize="md">{profile.cgpa ?? "N/A"}</Text>
                        </Box>
                        <Box p={3} rounded="md" borderColor="border.muted">
                          <Text fontSize="sm" color="fg.subtle">GPA</Text>
                          <Text fontSize="md">{profile.gpa ?? "N/A"}</Text>
                        </Box>
                        <Box p={3} rounded="md" borderColor="border.muted">
                          <Text fontSize="sm" color="fg.subtle">SGPA</Text>
                          <Text fontSize="md">{profile.sgpa ?? "N/A"}</Text>
                        </Box>
                        <Box p={3} rounded="md" borderColor="border.muted">
                          <Text fontSize="sm" color="fg.subtle">Carryover Courses</Text>
                          <Text fontSize="md">{profile.carryoverCourses ?? 0}</Text>
                        </Box>
                        <Box p={3} rounded="md" borderColor="border.muted">
                          <Text fontSize="sm" color="fg.subtle">Credits Earned</Text>
                          <Text fontSize="md">{profile.totalCreditsEarned}</Text>
                        </Box>
                        <Box p={3} rounded="md" borderColor="border.muted">
                          <Text fontSize="sm" color="fg.subtle">Credits Attempted</Text>
                          <Text fontSize="md">{profile.totalCreditsAttempted}</Text>
                        </Box>
                      </Grid>
                      <Button
                        onClick={() => exportStudentRecord(selectedStudent)}
                        loading={isExporting}
                        colorPalette="accent"
                        w="full"
                        size="lg"
                      >
                        <LuFileText /> Download Full Academic Record
                      </Button>
                    </Box>
                  );
                })()}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};