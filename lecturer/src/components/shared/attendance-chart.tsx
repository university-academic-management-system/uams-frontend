import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { X } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { AttendanceDataPoint } from "@type/dashboard.type";

interface AttendanceChartProps {
    data: AttendanceDataPoint[];
    fromDate: string;
    toDate: string;
    onFromDateChange: (value: string) => void;
    onToDateChange: (value: string) => void;
    onClear: () => void;
}

const AttendanceChart = ({
    data,
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onClear,
}: AttendanceChartProps) => {
    return (
        <Box
            bg="white"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.100"
            p="6"
        >
            {/* Header with filters */}
            <Flex align="center" justify="space-between" mb="8">
                <Text fontSize="md" fontWeight="600" color="gray.800">
                    Attendance Charts
                </Text>

                <Flex align="center" gap="4">
                    <Flex align="center" gap="1.5">
                        <Text fontSize="xs" color="gray.400" fontWeight="500">From</Text>
                        <Flex
                            align="center"
                            bg="gray.50"
                            border="1px solid"
                            borderColor="gray.100"
                            borderRadius="md"
                            px="2.5"
                            py="1.5"
                            gap="2"
                        >
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => onFromDateChange(e.target.value)}
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: "#4A5568",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    cursor: "pointer",
                                }}
                            />
                        </Flex>
                    </Flex>

                    <Flex align="center" gap="1.5">
                        <Text fontSize="xs" color="gray.400" fontWeight="500">To</Text>
                        <Flex
                            align="center"
                            bg="gray.50"
                            border="1px solid"
                            borderColor="gray.100"
                            borderRadius="md"
                            px="2.5"
                            py="1.5"
                            gap="2"
                        >
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => onToDateChange(e.target.value)}
                                style={{
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: "#4A5568",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    cursor: "pointer",
                                }}
                            />
                        </Flex>
                    </Flex>

                    {((fromDate && fromDate !== new Date().toISOString().split("T")[0]) || 
                      (toDate && toDate !== new Date().toISOString().split("T")[0])) && (
                        <Icon
                            as={X}
                            boxSize="3.5"
                            color="gray.400"
                            cursor="pointer"
                            _hover={{ color: "gray.600" }}
                            onClick={onClear}
                        />
                    )}
                </Flex>
            </Flex>

            {/* Chart */}
            <Box h="280px">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis
                            dataKey="courseCode"
                            tick={{ fontSize: 12, fill: "#718096" }}
                            axisLine={{ stroke: "#E2E8F0" }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                            tick={{ fontSize: 12, fill: "#718096" }}
                            axisLine={{ stroke: "#E2E8F0" }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #E2E8F0",
                                fontSize: "12px",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="attendance"
                            stroke="#38A169"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#38A169", strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default AttendanceChart;
