
import { useRef } from "react";
import { Box, Flex, Heading, Button, Text } from "@chakra-ui/react";
import { LuFileText } from "react-icons/lu";
import { useStudents } from "@hooks/student.hook";
import { AcademicLineChart } from "./academic-students-chart";
import { RegistrationPieChart } from "./registration-pie-chart";
import { StudentsDataTable } from "./students-data-table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatLevel } from "@utils/function.util";

const StudentsOverview = () => {
  const { data: students = [], isLoading, error } = useStudents();
  const chartsRef = useRef<HTMLDivElement>(null);

  // Compute levelStats for the line chart
  const uniqueLevels = Array.from(new Set(students.map(s => formatLevel(s.studentProfile?.level)).filter(Boolean))).sort();

  const levelStats = uniqueLevels.map(level => {
    const studentsInLevel = students.filter(s => formatLevel(s.studentProfile?.level) === level);
    const avgCgpa = studentsInLevel.reduce((sum, s) => sum + (s.studentProfile?.cgpa || 0), 0) / (studentsInLevel.length || 1);
    const avgGpa = studentsInLevel.reduce((sum, s) => sum + (s.studentProfile?.gpa || 0), 0) / (studentsInLevel.length || 1);
    const carryovers = studentsInLevel.filter(s => (s.studentProfile?.carryoverCourses || 0) > 0).length;
    return {
      level,
      levelLabel: `${level} Level`,
      avgCgpa: Number(avgCgpa.toFixed(2)),
      avgGpa: Number(avgGpa.toFixed(2)),
      carryovers,
    };
  }).sort((a, b) => parseInt(a.level, 10) - parseInt(b.level, 10));

  // Compute registration data for pie chart
  const totalStudents = students.length;
  const registeredStudents = students.filter(s => s.studentProfile?.registrationStatus === "REGISTERED").length;
  const unregisteredStudents = totalStudents - registeredStudents;
  const registrationData = [
    { name: "Registered", value: registeredStudents },
    { name: "Unregistered", value: unregisteredStudents }
  ];

  const exportSummaryCharts = async () => {
    if (!chartsRef.current) return;
    try {
      const canvas = await html2canvas(chartsRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.text("Academic Overview Summary", 14, 15);
      pdf.addImage(imgData, "PNG", 10, 20, pdfWidth - 20, pdfHeight - 20);
      pdf.save(`Charts_Summary_${new Date().getFullYear()}.pdf`);
    } catch (error) {
      console.error("Failed to export charts:", error);
    }
  };

  return (
    <Box>
      {students.length > 0 && (
        <Box mb={6} p={4} rounded="md" borderColor="border.muted" ref={chartsRef} bg="bg.panel">
          <Flex justify="space-between" align="center" mb={4} colorPalette="accent">
            <Heading size="md">Academic Overview</Heading>
            <Button size="md" onClick={exportSummaryCharts}>
              <LuFileText /> Export Charts
            </Button>
          </Flex>
          <Flex direction="column" gap={9}>
            <AcademicLineChart data={levelStats} />
            <RegistrationPieChart data={registrationData} />
          </Flex>
        </Box>
      )}
      <StudentsDataTable students={students} isLoading={isLoading} error={error} />
    </Box>
  );
};

export default StudentsOverview;