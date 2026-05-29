import { Box, Text, Flex, VStack, EmptyState } from "@chakra-ui/react";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface LevelStat {
  level: string;
  levelLabel: string;
  avgCgpa: number;
  avgGpa: number;
  // carryovers removed
}

interface AcademicLineChartProps {
  data: LevelStat[];
}

export const AcademicLineChart = ({ data }: AcademicLineChartProps) => {
  const mutedBorder = "var(--chakra-colors-border-muted)";
  const borderColor = "var(--chakra-colors-border)";

  return (
    <Box h="340px" p={4} rounded="md" borderColor="border.muted">
      <Text mb={2} textAlign="center">Academic Performance Trends</Text>
      {data.length === 0 ? (
        <Flex direction="column" align="center" justify="center" h="calc(100% - 30px)">
          <EmptyState.Root>
            <EmptyState.Content>
              <EmptyState.Indicator>
                <LuChartNoAxesCombined />
              </EmptyState.Indicator>
              <VStack textAlign="center">
                <EmptyState.Title>No performance data</EmptyState.Title>
                <EmptyState.Description>
                  No CGPA or GPA records available for the current students.
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        </Flex>
      ) : (
        <ResponsiveContainer width="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke={mutedBorder}
              strokeWidth={0.5}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="levelLabel"
              axisLine={{ stroke: mutedBorder, strokeWidth: 0.5 }}
              tickLine={{ stroke: mutedBorder, strokeWidth: 0.5 }}
              tick={{ fill: borderColor }}
            />
            <YAxis
              domain={[0, 5]}
              axisLine={{ stroke: mutedBorder, strokeWidth: 0.5 }}
              tickLine={{ stroke: mutedBorder, strokeWidth: 0.5 }}
              tick={{ fill: borderColor }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgCgpa"
              name="Avg CGPA"
              stroke="blue"
              strokeWidth={1}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="avgGpa"
              name="Avg GPA"
              stroke="green"
              strokeWidth={1}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};