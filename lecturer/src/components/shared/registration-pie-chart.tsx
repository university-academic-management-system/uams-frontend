// src/components/shared/RegistrationPieChart.tsx
import { Box, Text } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RegistrationData {
  name: string;
  value: number;
}

interface RegistrationPieChartProps {
  data: RegistrationData[];
  colors?: string[];
}

export const RegistrationPieChart = ({ data, colors = ["green", "red"] }: RegistrationPieChartProps) => {
  return (
    <Box h="350px" p={4} rounded="md" borderColor="border.muted" display="flex" justifyContent="center">
      <Box width="100%" maxW="500px">
        <Text mb={2} textAlign="center">Registration Status</Text>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};