import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Button,
  CloseButton,
  Flex,
  Table,
  Input,
  Spinner,
  Text,
  Badge,
  Portal,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { useCourseStudents } from "@hooks/course.hook";
import { ResultHook } from "@hooks/result.hook";
import { toaster } from "@components/ui/toaster";
import type { Course } from "@type/course.type";
import * as XLSX from "xlsx";
import { formatLevel } from "@utils/function.util";
import EmptyStateView from "@components/shared/empty-state";
import { LuUsers, LuUpload, LuSparkles } from "react-icons/lu";

interface UploadResultsDrawerProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const UploadResultsDrawer = ({ course, isOpen, onClose }: UploadResultsDrawerProps) => {
  const { data: students, isLoading: studentsLoading } = useCourseStudents(course.id);
  const uploadMutation = ResultHook.useUploadDraft();

  const [scores, setScores] = useState<Record<string, { ca: string; exam: string }>>({});

  useEffect(() => {
    if (students && isOpen) {
      const initialScores: Record<string, { ca: string; exam: string }> = {};
      students.forEach((s) => {
        initialScores[s.student.id] = { ca: "", exam: "" };
      });
      setScores(initialScores);
    }
  }, [students, isOpen]);

  const handleScoreChange = (studentId: string, field: "ca" | "exam", value: string) => {
    // Basic sanitization: only numbers or empty string
    if (value !== "" && isNaN(Number(value))) return;
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const getScoreValue = (val: string) => {
    if (val === "" || isNaN(Number(val))) return 0;
    return Number(val);
  };

  const caInvalid = (val: string) => {
    const num = getScoreValue(val);
    return num < 0 || num > 40;
  };

  const examInvalid = (val: string) => {
    const num = getScoreValue(val);
    return num < 0 || num > 60;
  };

  const getGrade = (total: number) => {
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 45) return "D";
    if (total >= 40) return "E";
    return "F";
  };

  const gradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "green";
      case "B": return "blue";
      case "C": return "gray";
      case "D": return "yellow";
      case "E": return "orange";
      case "F": return "red";
      default: return "gray";
    }
  };

  const handleAutofillMock = () => {
    if (!students) return;
    const mockScores: Record<string, { ca: string; exam: string }> = {};
    students.forEach((s) => {
      let hash = 0;
      const str = s.student.id || "";
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      hash = Math.abs(hash);
      const ca = 18 + (hash % 13);
      const examScore = 32 + ((hash >> 4) % 39);
      mockScores[s.student.id] = { ca: String(ca), exam: String(examScore) };
    });
    setScores(mockScores);
    toaster.success({ description: "Autofilled scores with mock data." });
  };

  const handleUpload = async () => {
    const activeSessionName = course.resultUpload?.session || "2024/2025";
    
    let hasError = false;
    let emptyCount = 0;

    const excelData = students?.map((student) => {
      const studentScores = scores[student.student.id] || { ca: "", exam: "" };
      
      if (studentScores.ca === "" || studentScores.exam === "") {
        emptyCount++;
      }

      const caVal = getScoreValue(studentScores.ca);
      const examVal = getScoreValue(studentScores.exam);
      
      if (caVal < 0 || caVal > 40 || examVal < 0 || examVal > 60) {
        hasError = true;
      }
      
      const total = caVal + examVal;
      const grade = getGrade(total);
      const profile = student.student;
      const studentName = profile
        ? `${profile.firstName || ""} ${profile.surname || ""} ${profile.otherName || ""}`.trim()
        : "N/A";
        
      return {
        "Matric Number": profile?.matricNumber || "N/A",
        "Student Name": studentName,
        "CA Score": caVal,
        "Exam Score": examVal,
        "Total Score": total,
        "Grade": grade,
      };
    }) || [];

    if (hasError) {
      toaster.error({ description: "Please fix invalid scores (CA max 40, Exam max 60)." });
      return;
    }

    if (emptyCount > 0) {
      toaster.error({ description: "Please fill in scores for all students before uploading." });
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      
      const file = new File([excelBuffer], `${course.code}_draft_results.xlsx`, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      await uploadMutation.mutateAsync({
        courseId: course.id,
        session: activeSessionName,
        file,
      });
      
      toaster.success({ description: "Draft results uploaded successfully!" });
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <Drawer.Root size="xl" open={isOpen} onOpenChange={(e) => { if (!e.open) onClose(); }}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg="bg">
            <Drawer.Header borderBottomWidth="1px" borderColor="border.muted" py="4">
              <Flex align="center" justify="space-between">
                <Box>
                  <Heading size="md">Upload Draft Results</Heading>
                  <Text color="fg.muted">
                    {course.title} ({course.code}) — {formatLevel(course.level)} Level
                  </Text>
                </Box>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Flex>
            </Drawer.Header>
            
            <Drawer.Body p="6">
              {studentsLoading ? (
                <Flex align="center" justify="center" py={12}>
                  <Spinner size="lg" color="accent" />
                  <Text ml="3">Loading students...</Text>
                </Flex>
              ) : !students || students.length === 0 ? (
                <EmptyStateView
                  icon={<LuUsers />}
                  title="No students registered"
                  description="There are no students registered for this course yet."
                />
              ) : (
                <Stack gap="4">
                  {/* Actions Toolbar */}
                  <Flex justify="space-between" align="center" bg="bg.muted" p="3" rounded="md">
                    <Text fontSize="sm" fontWeight="medium" color="fg.subtle">
                      Active Session: <Badge colorPalette="teal">{course.resultUpload?.session || "2024/2025"}</Badge>
                    </Text>
                    <Flex gap="3">
                      <Button
                        size="sm"
                        variant="subtle"
                        colorPalette="purple"
                        onClick={handleAutofillMock}
                      >
                        <LuSparkles />
                        Autofill Mock Scores
                      </Button>
                      <Button
                        size="sm"
                        colorPalette="accent"
                        onClick={handleUpload}
                        loading={uploadMutation.isPending}
                      >
                        <LuUpload />
                        Upload Results
                      </Button>
                    </Flex>
                  </Flex>

                  {/* Student Entry Table */}
                  <Table.ScrollArea rounded="md" border="1px solid" borderColor="border.muted">
                    <Table.Root size="sm" variant="outline">
                      <Table.Header bg="bg.subtle">
                        <Table.Row>
                          <Table.ColumnHeader w="50px">S/N</Table.ColumnHeader>
                          <Table.ColumnHeader minW="130px">Matric No.</Table.ColumnHeader>
                          <Table.ColumnHeader minW="200px">Student Name</Table.ColumnHeader>
                          <Table.ColumnHeader w="80px">Level</Table.ColumnHeader>
                          <Table.ColumnHeader w="110px">CA (Max 40)</Table.ColumnHeader>
                          <Table.ColumnHeader w="110px">Exam (Max 60)</Table.ColumnHeader>
                          <Table.ColumnHeader w="80px">Total</Table.ColumnHeader>
                          <Table.ColumnHeader w="80px">Grade</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {students.map((student, idx) => {
                          const sScores = scores[student.student.id] || { ca: "", exam: "" };
                          const caVal = getScoreValue(sScores.ca);
                          const examVal = getScoreValue(sScores.exam);
                          const total = caVal + examVal;
                          const grade = getGrade(total);
                          const isCaError = caInvalid(sScores.ca);
                          const isExamError = examInvalid(sScores.exam);
                          const profile = student.student;
                          const fullName = profile
                            ? `${profile.firstName || ""} ${profile.surname || ""} ${profile.otherName || ""}`.trim()
                            : "—";

                          return (
                            <Table.Row key={student.student.id}>
                              <Table.Cell>{idx + 1}</Table.Cell>
                              <Table.Cell>{profile?.matricNumber || "—"}</Table.Cell>
                              <Table.Cell fontWeight="medium">{fullName}</Table.Cell>
                              <Table.Cell>{formatLevel(profile?.level)}</Table.Cell>
                              <Table.Cell>
                                <Input
                                  size="xs"
                                  placeholder="0-40"
                                  value={sScores.ca}
                                  borderColor={isCaError ? "red.500" : undefined}
                                  onChange={(e) => handleScoreChange(student.student.id, "ca", e.target.value)}
                                  textAlign="center"
                                />
                              </Table.Cell>
                              <Table.Cell>
                                <Input
                                  size="xs"
                                  placeholder="0-60"
                                  value={sScores.exam}
                                  borderColor={isExamError ? "red.500" : undefined}
                                  onChange={(e) => handleScoreChange(student.student.id, "exam", e.target.value)}
                                  textAlign="center"
                                />
                              </Table.Cell>
                              <Table.Cell fontWeight="bold">{total}</Table.Cell>
                              <Table.Cell>
                                <Badge colorPalette={gradeColor(grade)}>{grade}</Badge>
                              </Table.Cell>
                            </Table.Row>
                          );
                        })}
                      </Table.Body>
                    </Table.Root>
                  </Table.ScrollArea>
                </Stack>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export default UploadResultsDrawer;
