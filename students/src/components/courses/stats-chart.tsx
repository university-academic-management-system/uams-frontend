import { Chart, useChart } from "@chakra-ui/charts"
import { Box, Center, Flex, GridItem, SimpleGrid, Skeleton } from "@chakra-ui/react"
import EmptyStateView from "@components/shared/empty-state"
import { useResults } from "@hooks/course.hook"
import { ResultsData } from "@type/course.type"
import type { Level, Semester } from "@type/index.type"
import { useMemo } from "react"
import { LuChartBar } from "react-icons/lu"
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, Rectangle, Sector, Tooltip, XAxis, YAxis } from "recharts"


// mock the chart data here
export const MOCK_RESULTS: ResultsData = {
    gpa: 3.85,
    cgpa: 3.72,
    results: [
        {
            id: "1",
            courseId: "c1",
            studentId: "s1",
            session: "2023/2024",
            semester: "FIRST",
            level: "L100",
            ca: 28,
            examScore: 52,
            totalScore: 80,
            grade: "A",
            gradePoint: 5,
            gradePointCredit: 15,
            status: "PASSED",
            isCarryover: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            course: {
                id: "c1",
                code: "CSC101",
                title: "Introduction to Computer Science",
                description: "Basic CS concepts",
                units: 3,
                level: "L100",
                semester: "FIRST",
                courseType: "CORE",
                status: "ACTIVE",
                programmeId: "p1",
                isCarryoverAllowed: true,
                courseRepId: null,
                assistantCourseRepId: null,
                classRepId: null,
                assistantClassRepId: null,
                progressionRuleId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isRegistered: true,
                isCarryover: false
            },
            lecturer: {
                title: "Dr.",
                firstName: "Abebe",
                surname: "Bikila",
                otherName: "",
                email: "abebe@uams.edu",
                faculty: "Science",
                department: "Computer Science"
            }
        },
        {
            id: "2",
            courseId: "c2",
            studentId: "s1",
            session: "2023/2024",
            semester: "FIRST",
            level: "L100",
            ca: 24,
            examScore: 41,
            totalScore: 65,
            grade: "B",
            gradePoint: 4,
            gradePointCredit: 12,
            status: "PASSED",
            isCarryover: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            course: {
                id: "c2",
                code: "MTH101",
                title: "Elementary Mathematics I",
                description: "Algebra and Trigonometry",
                units: 3,
                level: "L100",
                semester: "FIRST",
                courseType: "CORE",
                status: "ACTIVE",
                programmeId: "p1",
                isCarryoverAllowed: true,
                courseRepId: null,
                assistantCourseRepId: null,
                classRepId: null,
                assistantClassRepId: null,
                progressionRuleId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isRegistered: true,
                isCarryover: false
            },
            lecturer: {
                title: "Prof.",
                firstName: "Sarah",
                surname: "Johnson",
                otherName: "",
                email: "sarah.j@uams.edu",
                faculty: "Science",
                department: "Mathematics"
            }
        },
        {
            id: "3",
            courseId: "c3",
            studentId: "s1",
            session: "2023/2024",
            semester: "FIRST",
            level: "L100",
            ca: 20,
            examScore: 35,
            totalScore: 55,
            grade: "C",
            gradePoint: 3,
            gradePointCredit: 6,
            status: "PASSED",
            isCarryover: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            course: {
                id: "c3",
                code: "PHY101",
                title: "General Physics I",
                description: "Mechanics and Properties of Matter",
                units: 2,
                level: "L100",
                semester: "FIRST",
                courseType: "CORE",
                status: "ACTIVE",
                programmeId: "p1",
                isCarryoverAllowed: true,
                courseRepId: null,
                assistantCourseRepId: null,
                classRepId: null,
                assistantClassRepId: null,
                progressionRuleId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isRegistered: true,
                isCarryover: false
            },
            lecturer: {
                title: "Mr.",
                firstName: "David",
                surname: "Smith",
                otherName: "",
                email: "d.smith@uams.edu",
                faculty: "Science",
                department: "Physics"
            }
        },
        {
            id: "4",
            courseId: "c4",
            studentId: "s1",
            session: "2023/2024",
            semester: "FIRST",
            level: "L100",
            ca: 15,
            examScore: 30,
            totalScore: 45,
            grade: "D",
            gradePoint: 2,
            gradePointCredit: 4,
            status: "PASSED",
            isCarryover: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            course: {
                id: "c4",
                code: "GST101",
                title: "Use of English I",
                description: "English language skills",
                units: 2,
                level: "L100",
                semester: "FIRST",
                courseType: "GST",
                status: "ACTIVE",
                programmeId: "p1",
                isCarryoverAllowed: true,
                courseRepId: null,
                assistantCourseRepId: null,
                classRepId: null,
                assistantClassRepId: null,
                progressionRuleId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isRegistered: true,
                isCarryover: false
            },
            lecturer: {
                title: "Mrs.",
                firstName: "Grace",
                surname: "Okon",
                otherName: "",
                email: "grace.o@uams.edu",
                faculty: "Arts",
                department: "English"
            }
        },
        {
            id: "5",
            courseId: "c5",
            studentId: "s1",
            session: "2023/2024",
            semester: "FIRST",
            level: "L100",
            ca: 22,
            examScore: 48,
            totalScore: 70,
            grade: "A",
            gradePoint: 5,
            gradePointCredit: 10,
            status: "PASSED",
            isCarryover: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            course: {
                id: "c5",
                code: "CSC103",
                title: "Computer Programming I",
                description: "Introduction to programming",
                units: 2,
                level: "L100",
                semester: "FIRST",
                courseType: "CORE",
                status: "ACTIVE",
                programmeId: "p1",
                isCarryoverAllowed: true,
                courseRepId: null,
                assistantCourseRepId: null,
                classRepId: null,
                assistantClassRepId: null,
                progressionRuleId: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isRegistered: true,
                isCarryover: false
            },
            lecturer: {
                title: "Dr.",
                firstName: "John",
                surname: "Doe",
                otherName: "",
                email: "j.doe@uams.edu",
                faculty: "Science",
                department: "Computer Science"
            }
        }
    ],
    pagination: {
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
    }
}




const StatsChart = ({ level, semester }: { level: Level, semester: Semester | "ALL" }) => {
    const { data: resultResponse, isLoading } = useResults({ level, semester });
    const response = MOCK_RESULTS;

    const chartData = useMemo(() => {
        if (!response?.results) return [];
        return response.results.map((item) => ({
            score: item.totalScore || 0,
            code: item.course.code,
        }));
    }, [response]);

    const chart = useChart({
        data: chartData,
        series: [{ name: "score", color: "accent" }],
    })

    if (isLoading) {
        return (
            <Flex gap="4" direction={{ base: "column", md: "row" }}>
                <Center h="sm" flex="1" border="xs" rounded="md" borderColor="border.muted">
                    <Skeleton h="200px" w="full" mx="4" />
                </Center>
                <Center h="sm" w={{ base: "full", md: "320px" }} border="xs" rounded="md" borderColor="border.muted">
                    <Skeleton h="200px" w="200px" rounded="full" />
                </Center>
            </Flex>
        )
    }

    if (response?.results.every(item => item.grade === null)) return (
        <Box border="xs" rounded="md" p="4" borderColor="border.muted" bg="bg" w="full">
            <EmptyStateView
                icon={<LuChartBar />}
                title="No Grades Available"
                description="No grades available to display chart for this semester."
            />
        </Box>
    );

    return (
        <SimpleGrid w="full" columns={{ base: 1, md: 4 }} gap="4" border="xs" bg="bg" rounded="md" p="4" borderColor="border.muted">
            <GridItem colSpan={3}>
                <Chart.Root maxH="xl" chart={chart} >
                    <BarChart data={chart.data} responsive>
                        <CartesianGrid stroke={chart.color("border.subtle")} vertical={false} />
                        <XAxis
                            axisLine={false}
                            tickLine={false}
                            dataKey={chart.key("code")}
                            fontSize={12}
                        />
                        <Tooltip
                            cursor={{ fill: chart.color("bg.subtle") }}
                            animationDuration={100}
                            content={<Chart.Tooltip />}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}`}
                            fontSize={12}
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
                                    style={{ fontWeight: "600", fill: chart.color("fg") }}
                                />
                            </Bar>
                        ))}
                    </BarChart>
                </Chart.Root>
            </GridItem>

            <GridItem spaceY="4">
                <GradeChart level={level} semester={semester} />
                <GPACGPAChart level={level} semester={semester} />
            </GridItem>
        </SimpleGrid>
    )
}




const GradeChart = ({ level, semester }: { level: string, semester: string }) => {
    const { data: resultResponse } = useResults({ level, semester });
    const response = MOCK_RESULTS;

    const gradeData = useMemo(() => {
        if (!response?.results) return [];

        const grades = ["A", "B", "C", "D", "E", "F"];
        const counts = response.results.reduce((acc, curr) => {
            const grade = curr.grade || "N/A";
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors: Record<string, string> = {
            "A": "green.500",
            "B": "blue",
            "C": "gray",
            "D": "yellow",
            "E": "orange",
            "F": "red",
            "N/A": "bg.muted"
        };

        return grades
            .map(grade => ({
                name: grade,
                value: counts[grade] || 0,
                color: colors[grade]
            }))
            .filter(item => item.value > 0);
    }, [response]);

    const chart = useChart({
        data: gradeData,
    })

    return (
        <Chart.Root w={{ base: "full", md: "320px" }} chart={chart} maxH="xs">
            <PieChart responsive>
                <Tooltip
                    cursor={false}
                    animationDuration={100}
                    content={<Chart.Tooltip hideLabel />}
                />
                <Pie
                    isAnimationActive={true}
                    data={chart.data}
                    dataKey={chart.key("value")}
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    shape={(props) => (
                        <Sector {...props} fill={chart.color(props.payload!.color)} />
                    )}
                >
                    <LabelList
                        dataKey="name"
                        position="inside"
                        fill="white"
                        stroke="none"
                        fontSize={12}
                    />
                </Pie>
            </PieChart>
        </Chart.Root>
    )
}


const GPACGPAChart = ({ level, semester }: { level: string, semester: string }) => {
    const { data: resultResponse } = useResults({ level, semester });
    const response = MOCK_RESULTS;

    const chart = useChart({
        data: [
            { value: response?.gpa || 0, type: "GPA", color: "accent" },
            { value: response?.cgpa || 0, type: "CGPA", color: "green.500" },
        ],
    })

    return (
        <Chart.Root maxH="xs" chart={chart}>
            <BarChart data={chart.data} responsive>
                <CartesianGrid stroke={chart.color("border.subtle")} vertical={false} />
                <XAxis axisLine={false} tickLine={false} dataKey={chart.key("type")} />
                <Tooltip
                    cursor={{ fill: chart.color("bg.subtle") }}
                    animationDuration={100}
                    content={<Chart.Tooltip />}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0.0, 5.0]}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar
                    isAnimationActive={true}
                    dataKey={chart.key("value")}
                    shape={(props) => (
                        <Rectangle {...props} fill={chart.color(props.payload!.color)} />
                    )}
                >
                    <LabelList
                        dataKey={chart.key("value")}
                        position="top"
                        style={{ fontWeight: "600", fill: chart.color("fg") }}
                    />
                </Bar>
            </BarChart>
        </Chart.Root>
    )
}


export default StatsChart;
