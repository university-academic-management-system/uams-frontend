import { useState, useRef } from "react";
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
  Heading,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { LuUsers, LuCircleAlert, LuFileText, LuChartNoAxesCombined, LuEllipsis } from "react-icons/lu";
import type { Student } from "@type/student.type";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface StudentsTableProps {
  students: Student[];
  isLoading?: boolean;
  error?: Error | null;
  currentSession?: string;
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

const capitaliseName = (name: string | undefined): string => {
  if (!name) return "—";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatLevel = (level: string | undefined): string => {
  if (!level) return "—";
  return level.replace(/^L/, "");
};

const StudentsTable = ({
  students,
  isLoading,
  error,
  currentSession = "",
}: StudentsTableProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const chartsRef = useRef<HTMLDivElement>(null);

  // Computed Chart Data
  const uniqueLevels = Array.from(new Set(students.map(s => formatLevel(s.studentProfile?.level)).filter(Boolean))).sort();

  const levelStats = uniqueLevels.map(level => {
    const studentsInLevel = students.filter(s => formatLevel(s.studentProfile?.level) === level);
    const avgCgpa = studentsInLevel.reduce((sum, s) => sum + (s.studentProfile?.cgpa || 0), 0) / (studentsInLevel.length || 1);
    const avgGpa = studentsInLevel.reduce((sum, s) => sum + (s.studentProfile?.gpa || 0), 0) / (studentsInLevel.length || 1);
    const carryovers = studentsInLevel.filter(s => (s.studentProfile?.carryoverCourses || 0) > 0).length;
    
    return {
      level,
      avgCgpa: Number(avgCgpa.toFixed(2)),
      avgGpa: Number(avgGpa.toFixed(2)),
      carryovers,
    };
  });

  const totalStudents = students.length;
  const registeredStudents = students.filter(s => s.studentProfile?.registrationStatus === "REGISTERED").length;
  const unregisteredStudents = totalStudents - registeredStudents;
  
  const registrationData = [
    { name: "Registered", value: registeredStudents },
    { name: "Unregistered", value: unregisteredStudents }
  ];
  
  const PIE_COLORS = ["green", "red"];

  const handleOpenDrawer = (student: Student) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => setDrawerOpen(false);

  // Export individual student record as PDF
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

  const exportSummaryCharts = async () => {
    if (!chartsRef.current) return;
    try {
      const canvas = await html2canvas(chartsRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.text("Academic Overview Summary", 14, 15);
      pdf.addImage(imgData, "PNG", 10, 20, pdfWidth - 20, pdfHeight - 20);
      pdf.save(`Charts_Summary_${currentSession || "All"}.pdf`);
    } catch (error) {
      console.error("Failed to export charts:", error);
    }
  };

  return (
    <Box>
      {/* Summary Charts Section */}
      {students.length > 0 && (
        <Box mb={6} p={4} rounded="md" borderColor="border.muted" ref={chartsRef} bg="bg.panel">
          <Flex justify="space-between" align="center" mb={4} colorPalette={"accent"}>
            <Heading size="md">Academic Overview</Heading>
            <Button size="md" onClick={exportSummaryCharts}>
           <LuFileText />   Export Charts as PDF
            </Button>
          </Flex>
          {currentSession && <Text fontSize="sm" color="fg.muted" mb={4}>Current Session: {currentSession}</Text>}
          <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
            {/* CGPA Line Chart */}
            <Box h="300px" p={4} rounded="md" borderColor="border.muted">
              <Text  mb={2} textAlign="center">Average CGPA by Level</Text>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={levelStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis domain={[0, 5]} />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Line type="monotone" dataKey="avgCgpa" name="Avg CGPA" stroke="blue" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            
            {/* GPA Line Chart */}
            <Box h="300px" p={4} rounded="md" borderColor="border.muted">
              <Text mb={2} textAlign="center">Average GPA by Level</Text>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={levelStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis domain={[0, 5]} />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Line type="monotone" dataKey="avgGpa" name="Avg GPA" stroke="blue" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* Carryovers Line Chart */}
            <Box h="300px" p={4} rounded="md" borderColor="border.muted">
              <Text mb={2} textAlign="center">Students with Carryovers</Text>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={levelStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Line type="monotone" dataKey="carryovers" name="Carryovers Count" stroke="blue" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            {/* Registration Pie Chart */}
            <Box h="300px" p={4} rounded="md" borderColor="border.muted">
              <Text mb={2} textAlign="center">Registration Status</Text>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={registrationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {registrationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <RechartsLegend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Box>
      )}

      <Box borderWidth="1px" borderColor="border.muted" rounded="md" overflowX="auto">
        <Table.Root size="lg" variant="line" css={{ tableLayout: "auto", minWidth: "1300px" }} stickyHeader>
          <Table.Header>
            <Table.Row>
              {COLUMNS.map((col) => (
                <Table.ColumnHeader
                  key={col.key}
                  fontSize="md"
                  bg="#f8fafc"
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
              students.map((student, index) => {
                const profile = student.studentProfile;
                const firstName = capitaliseName(profile?.firstName);
                const lastName = capitaliseName(profile?.lastName);
                const otherName = capitaliseName(profile?.otherName);
                const fullName = [firstName, lastName, otherName].filter((p) => p !== "—").join(" ");
                return (
                  <Table.Row key={student.id} borderBottomWidth="1px" borderBottomColor="border.muted">
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {index + 1}
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
                      {profile?.registrationStatus?.replace("_", " ") || "—"}
                    </Table.Cell>
                    <Table.Cell px="3" py="3" whiteSpace="nowrap" fontSize="md" color="fg.muted">
                      {profile?.academicStanding?.replace("_", " ") || "—"}
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

      {/* Right Drawer */}
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
                    <LuFileText />    Download Full Academic Record (PDF)
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

export default StudentsTable;