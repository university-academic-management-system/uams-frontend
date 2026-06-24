import { useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Skeleton,
  SimpleGrid,
  Table,
  Badge,
  Stack,
  DataList,
  Image,
} from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LabelList } from "recharts";
import { LuUsers } from "react-icons/lu";
import { useCourseStudents } from "@hooks/course.hook";
import { ResultHook } from "@hooks/result.hook";
import type { Course } from "@type/course.type";
import EmptyStateView from "@components/shared/empty-state";
import { CourseResultsDownloader } from "@components/shared/course-result-downloader";
import { useTotals } from "@hooks/dashboard.hook";

interface CourseResultsViewProps {
  courseId: string;
  course: Course;
}

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



// Skeleton components
const DetailsSkeleton = () => (
  <DataList.Root size="sm" width="full" p="6">
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      {Array.from({ length: 7 }).map((_, i) => (
        <DataList.Item key={i}>
          <DataList.ItemLabel><Skeleton h="4" w="24" /></DataList.ItemLabel>
          <DataList.ItemValue><Skeleton h="4" w="32" /></DataList.ItemValue>
        </DataList.Item>
      ))}
    </SimpleGrid>
  </DataList.Root>
);

const ChartSkeleton = () => (
  <Box p="6" bg="bg" rounded="md" borderColor="border.muted">
    <Skeleton h="6" w="48" mb="4" />
    <Skeleton h="280px" w="full" rounded="md" />
  </Box>
);

const TableSkeleton = () => (
  <Table.ScrollArea rounded="md" w="full" borderColor="border.muted">
    <Table.Root size="sm" variant="outline">
      <Table.Header>
        <Table.Row>
          {["S/N", "Student Name", "Matric No.", "CA", "Exam Score", "Total Score", "Grade", "Grade Point", "Grade Point Credit"].map((col) => (
            <Table.ColumnHeader key={col}>{col}</Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Table.Row key={idx}>
            {Array.from({ length: 9 }).map((_, i) => (
              <Table.Cell key={i}>
                <Skeleton h="4" w={i === 0 ? "6" : i === 1 ? "32" : i === 2 ? "24" : "12"} />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Table.ScrollArea>
);

export const CourseResultsView = ({ courseId, course }: CourseResultsViewProps) => {
  const { data: settings, isLoading: settingsLoading } = useTotals();
  const { data: students, isLoading: studentsLoading } = useCourseStudents(courseId);
  const { data: resultsData, isLoading: resultsLoading } = ResultHook.useCourseResults(
    courseId,
    course?.level,
    course?.semester
  );

  const department = useMemo(() => settings?.department || "N/A", [settings]);
  const faculty = useMemo(() => settings?.faculty || "N/A", [settings]);

  const courseCode = course?.code || "N/A";
  const courseTitle = course?.title || "N/A";
  const courseLevel = course?.level?.replace(/^L/, "") || "N/A";
  const courseSemester = course?.semester || "N/A";
  const courseUnits = course?.units ?? "N/A";

  const mutedBorder = "var(--chakra-colors-border-muted)";

  const results = useMemo(() => {
    return resultsData?.results || [];
  }, [resultsData]);

  const gradeDistribution = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    results.forEach((r) => {
      if (counts[r.grade as keyof typeof counts] !== undefined) {
        counts[r.grade as keyof typeof counts]++;
      }
    });
    return [
      { grade: "A", count: counts.A, color: "green" },
      { grade: "B", count: counts.B, color: "blue" },
      { grade: "C", count: counts.C, color: "gray" },
      { grade: "D", count: counts.D, color: "yellow" },
      { grade: "E", count: counts.E, color: "orange" },
      { grade: "F", count: counts.F, color: "red" },
    ];
  }, [results]);

  const chart = useChart({
    data: gradeDistribution,
    series: [{ name: "count", label: "Students", color: "accent" }],
  });

  if (studentsLoading || settingsLoading || resultsLoading) {
    return (
      <Stack gap="4" colorPalette="accent">
        <DetailsSkeleton />
        <ChartSkeleton />
        <Box spaceY="3">
          <Skeleton h="6" w="48" />
          <TableSkeleton />
        </Box>
      </Stack>
    );
  }

  return (
    <Stack gap="4" colorPalette="accent">
      {/* Header with download button */}
      <Flex justify="space-between" align="center" px="6" pt="4">
        <Heading size="lg" color="fg.muted">Course Results</Heading>
        <CourseResultsDownloader
          targetId="course-results-content"
          filename={`${courseCode}_${courseLevel}_results`}
        />
      </Flex>

      {/* Content to be downloaded */}
      <Box id="course-results-content">
        <Stack w="full" align="center" mb="6" pt="4">
          <Image src="./assets/sidebar-collapsed-logo.png" alt="UPHCSC Logo" h="auto" w="36" />
          <Heading size="3xl" w="full" textAlign="center" fontSize="2xl">
            {courseTitle} Result
          </Heading>
        </Stack>


        {/* Course Details Grid */}
        <DataList.Root size="sm" width="full" p="6">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <DataList.Item>
              <DataList.ItemLabel color="fg.subtle">Course Code</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold" textAlign="right">{courseCode}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel color="fg.subtle">Course Title</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold" textAlign="right">{courseTitle}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel color="fg.subtle">Department</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold" textAlign="right">{department}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel color="fg.subtle">Level</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold" textAlign="right">{courseLevel}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel color="fg.subtle">Faculty</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold" textAlign="right">{faculty}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel color="fg.subtle">Semester</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold" textAlign="right">{courseSemester}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item>
              <DataList.ItemLabel color="fg.subtle">Units</DataList.ItemLabel>
              <DataList.ItemValue fontWeight="semibold" textAlign="right">{courseUnits}</DataList.ItemValue>
            </DataList.Item>
          </SimpleGrid>
        </DataList.Root>

        {/* Grade Distribution Chart */}
        <Box p="6" bg="bg" rounded="md" borderColor="border.muted">
          <Heading size="md" mb="4" color="fg.muted">Grade Distribution Overview</Heading>
          <Box h="300px" w="full">
            <Chart.Root maxH="xs" chart={chart}>
              <BarChart data={chart.data} responsive>
                <CartesianGrid stroke={mutedBorder} strokeWidth={0.5} vertical={false} />
                <XAxis
                  axisLine={{ stroke: chart.color("border"), strokeWidth: 0.5 }}
                  dataKey={chart.key("grade")}
                  stroke={chart.color("border")}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  axisLine={{ stroke: chart.color("border"), strokeWidth: 0.5 }}
                  tickLine={false}
                  tickMargin={10}
                  stroke={chart.color("border")}
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                />
                {chart.series.map((item) => (
                  <Bar
                    key={item.name}
                    isAnimationActive={true}
                    dataKey={chart.key(item.name)}
                    fill={chart.color(item.color)}
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey={chart.key(item.name)}
                      position="top"
                      style={{ fontWeight: "600", fill: chart.color("fg"), fontSize: 10 }}
                    />
                  </Bar>
                ))}
              </BarChart>
            </Chart.Root>
          </Box>
        </Box>

        {/* Student Results Table */}
        <Box spaceY="3" p="6">
          <Heading size="md" color="fg.muted">Detailed Student Results</Heading>
          <Table.ScrollArea rounded="md" w="full" borderColor="border.muted">
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader w="50px">S/N</Table.ColumnHeader>
                  <Table.ColumnHeader minW="200px">Student Name</Table.ColumnHeader>
                  <Table.ColumnHeader w="100px">Matric No.</Table.ColumnHeader>
                  <Table.ColumnHeader w="80px">CA</Table.ColumnHeader>
                  <Table.ColumnHeader w="80px">Exam Score</Table.ColumnHeader>
                  <Table.ColumnHeader w="100px">Total Score</Table.ColumnHeader>
                  <Table.ColumnHeader w="80px">Grade</Table.ColumnHeader>
                  <Table.ColumnHeader w="100px">Grade Point</Table.ColumnHeader>
                  <Table.ColumnHeader w="120px">Grade Point Credit</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {!students || students.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={9} textAlign="center" py={10}>
                      <EmptyStateView
                        icon={<LuUsers />}
                        title="No students found"
                        description="There are no students registered for this course."
                      />
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  results.map((r, index) => {
                    const rowBg = r.grade === "F" ? "red.subtle/5" : undefined;
                    return (
                      <Table.Row key={r.id} bg={rowBg}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell fontWeight="medium">{r?.student?.surname} {r?.student?.firstName} {r?.student?.otherName}</Table.Cell>
                        <Table.Cell>{r?.student?.matricNumber}</Table.Cell>
                        <Table.Cell>{r?.ca || 0}</Table.Cell>
                        <Table.Cell>{r?.examScore || 0}</Table.Cell>
                        <Table.Cell fontWeight="bold">{r?.totalScore || 0}</Table.Cell>
                        <Table.Cell><Badge colorPalette={gradeColor(r?.grade || "-")}>{r?.grade}</Badge></Table.Cell>
                        <Table.Cell>{r?.gradePoint || 0}</Table.Cell>
                        <Table.Cell>{r?.gradePointCredit || 0}</Table.Cell>
                      </Table.Row>
                    );
                  })
                )}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>
      </Box>
    </Stack>
  );
};

export default CourseResultsView;