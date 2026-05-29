"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import { Card, Heading, Stack, Skeleton, Flex, Box, Text, EmptyState, VStack } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { LuChartLine, LuUsers } from "react-icons/lu";
import useAuthStore from "@stores/auth.store";
import { useStudents } from "@hooks/student.hook";
import { useMemo } from "react";

// Helper to extract numeric level from "L100", "L200", etc.
const extractLevelNumber = (level: string): number => {
  const match = level.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const formatLevelLabel = (level: string): string => {
  return level.replace(/^L/, "");
};

export const AcademicPerformanceChart = () => {
  
  const { user } = useAuthStore();
  const { data: students = [], isLoading } = useStudents();
  const role = user?.role;
  const isHodOrEro = role === "HOD" || role === "ERO";

  // Compute chart data only if user is HOD/ERO and there are students
  const chartData = useMemo(() => {
    if (!isHodOrEro || students.length === 0) return [];

    const levelMap = new Map<string, { cgpaSum: number; gpaSum: number; sgpaSum: number; count: number }>();
    students.forEach(student => {
      const level = student.studentProfile?.level;
      if (!level) return;
      const cgpa = student.studentProfile?.cgpa;
      const gpa = student.studentProfile?.gpa;
      const sgpa = student.studentProfile?.sgpa;
      if (cgpa === undefined && gpa === undefined && sgpa === undefined) return;

      if (!levelMap.has(level)) {
        levelMap.set(level, { cgpaSum: 0, gpaSum: 0, sgpaSum: 0, count: 0 });
      }
      const entry = levelMap.get(level)!;
      if (cgpa !== undefined) entry.cgpaSum += cgpa;
      if (gpa !== undefined) entry.gpaSum += gpa;
      if (sgpa !== undefined) entry.sgpaSum += sgpa;
      entry.count += 1;
    });

    return Array.from(levelMap.entries())
      .map(([level, { cgpaSum, gpaSum, sgpaSum, count }]) => ({
        level: formatLevelLabel(level),
        avgCgpa: count > 0 ? +(cgpaSum / count).toFixed(2) : 0,
        avgGpa: count > 0 ? +(gpaSum / count).toFixed(2) : 0,
        avgSgpa: count > 0 ? +(sgpaSum / count).toFixed(2) : 0,
      }))
      .sort((a, b) => extractLevelNumber(a.level) - extractLevelNumber(b.level));
  }, [isHodOrEro, students]);

  
  const chart = useChart({
    data: chartData,
    series: [
      { name: "avgCgpa", label: "CGPA", color: "green" },
      { name: "avgGpa", label: "GPA", color: "blue" },
      { name: "avgSgpa", label: "SGPA", color: "orange" },
    ],
  });

  
  if (!isHodOrEro) return null;

  if (isLoading) {
    return (
      <Card.Root width="full" border="md" borderColor="border.muted">
        <Card.Body p="6">
          <Stack gap="6">
            <Skeleton h="6" w="48" />
            <Skeleton h="300px" w="full" />
          </Stack>
        </Card.Body>
      </Card.Root>
    );
  }

  if (students.length === 0) {
    return (
      <Card.Root width="full" border="md" borderColor="border.muted">
        <Card.Body p="6">
          <Heading size="lg" mb="6" color="fg.muted">Academic Performance Overview</Heading>
          <Flex justify="center" py={12}>
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <LuUsers />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>No student data available</EmptyState.Title>
                  <EmptyState.Description>
                    Student performance records will appear here once available.
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          </Flex>
        </Card.Body>
      </Card.Root>
    );
  }

  if (chartData.length === 0) {
    return null; 
  }

  return (
    <Card.Root width="full" border="md" borderColor="border.muted">
      <Card.Body p="6">
        <Heading size="lg" mb="6" color="fg.muted">Academic Performance Overview</Heading>
        <Box minH="400px" w="full">
          <Chart.Root maxH="sm" chart={chart}>
            <LineChart margin={{ left: -30, right: 10 }} data={chart.data} responsive>
              <CartesianGrid stroke={chart.color("border.muted")} strokeWidth={0.5} vertical={false} />
              <XAxis
                axisLine={{ stroke: chart.color("border"), strokeWidth: 0.5 }}
                dataKey={chart.key("level")}
                tickFormatter={(value) => value}
                stroke={chart.color("border")}
                padding={{ left: 80, right: 20 }}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                axisLine={{ stroke: chart.color("border"), strokeWidth: 0.5 }}
                tickLine={false}
                tickMargin={10}
                domain={[0, 5]}
                stroke={chart.color("border")}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                animationDuration={100}
                cursor={{ stroke: chart.color("border") }}
                content={<Chart.Tooltip />}
              />
              <Legend verticalAlign="top" align="right" content={<Chart.Legend />} />
              {chart.series.map((item) => (
                <Line
                  key={item.name}
                  type="bump"
                  isAnimationActive={false}
                  dataKey={chart.key(item.name)}
                  strokeWidth={1}
                  stroke={chart.color(item.color)}
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </Chart.Root>
        </Box>
      </Card.Body>
    </Card.Root>
  );
};

export default AcademicPerformanceChart;