import { Box, Text, Flex, VStack, EmptyState } from "@chakra-ui/react";
import { LuChartNoAxesCombined } from "react-icons/lu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface LevelStat {
  level: string;
  levelLabel: string;
  avgCgpa: number;
  avgGpa: number;
  carryovers: number;
}

interface AcademicLineChartProps {
  data: LevelStat[];
}

export const AcademicLineChart = ({ data }: AcademicLineChartProps) => {
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
                  No CGPA, GPA, or carryover records available for the current students.
                </EmptyState.Description>
              </VStack>
            </EmptyState.Content>
          </EmptyState.Root>
        </Flex>
      ) : (
        <ResponsiveContainer width="100%" >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="levelLabel" />
            <YAxis domain={[0, 5]} yAxisId="left" />
            <YAxis domain={[0, 'auto']} yAxisId="right" orientation="right" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgCgpa" name="Avg CGPA" stroke="blue" strokeWidth={2} dot={{ r: 4 }} yAxisId="left" />
            <Line type="monotone" dataKey="avgGpa" name="Avg GPA" stroke="green" strokeWidth={2} dot={{ r: 4 }} yAxisId="left" />
            <Line type="monotone" dataKey="carryovers" name="Carryovers Count" stroke="orange" strokeWidth={2} dot={{ r: 4 }} yAxisId="right" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};