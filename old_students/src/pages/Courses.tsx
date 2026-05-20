import React, { useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router';
import {
  Box, Flex, Grid, GridItem, Text, Heading, Button, IconButton, Input, Image, NativeSelect,
  Table, Checkbox, Badge,
  Stack, HStack, VStack,
  useBreakpointValue, Textarea,
  Tabs,
  InputGroup,
  Select,
  Portal,
  createListCollection,
  ListCollection
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Search, Plus, ChevronLeft, Send, ChevronDown } from 'lucide-react';
import { getAssetPath } from '../utils/assetPath';
import apiClient from '../services/api';
import { toaster } from '../components/ui/toaster';
import {
  getRegistrations
} from '../services/registrationService';
import {
  RegisteredCourse
} from '../services/types';
import CourseHooks from '@/hooks/course.hooks';
import { LuSearch } from 'react-icons/lu';
import { AcademicYearData, CourseData } from '@/types/course.type';
import ConfigsHooks from '@/hooks/config.hooks';
import { AcademicData, Semester } from '@/types/config.types';
import ResultsHooks from '@/hooks/results.hooks';



const CoursesNResults = () => {
  const { data: courses, isLoading: isLoadingCourses } = CourseHooks.useCourses();
  const { data: configs, isLoading: isLoadingConfigs } = ConfigsHooks.useConfigs();
  const { data: results, isLoading: isLoadingResults } = ResultsHooks.useResults();

  const levels = useMemo(() => {
    if (configs) {
      return createListCollection({
        items: configs?.levels?.map(l => ({ label: l.name, value: l.id }))
      })
    }
  }, [configs, createListCollection]);

  if (isLoadingCourses || isLoadingConfigs) return <Text p="6">Loading...</Text>

  return (
    <Box spaceY="6" p="6">

      <Tabs.Root spaceY="6" defaultValue="courses" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="courses">Courses</Tabs.Trigger>
          <Tabs.Trigger value="projects">Results</Tabs.Trigger>
        </Tabs.List>


        <Tabs.Content bg="bg" rounded="md" p="4" spaceY="4" value="courses">
          <CoursesTabContent levels={levels} courses={courses} semesters={configs?.semesters} />
        </Tabs.Content>


        {/* results */}
        <Tabs.Content bg="bg" rounded="md" p="4" spaceY="4" value="projects">
          <ResultsTabContent levels={levels} results={results} semesters={configs?.semesters} />
        </Tabs.Content>
      </Tabs.Root>

    </Box>
  )
}

const CoursesTabContent = ({ levels, courses, semesters }: {
  levels: ListCollection<{
    label: string;
    value: string;
  }>, courses: any, semesters: Semester[] | undefined
}) => {
  const [selectedLevel, setSelectedLevel] = React.useState<string[]>(
    levels?.items[0] ? [levels.items[0].value] : []
  );
  const [selectedSemester, setSelectedSemester] = React.useState<string>(
    semesters?.[0]?.name || ""
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCourses = useMemo(() => {
    if (!courses || !selectedLevel[0] || !selectedSemester) return [];

    // Find the level label from levels collection
    const levelLabel = levels.items.find(l => l.value === selectedLevel[0])?.label;
    if (!levelLabel) return [];

    // The data structure seems to be nested: AcademicYear -> Level -> Semester
    // Based on course.type.ts: AcademicYearData { "2025/2026": { "100": { "First Semester": [...] } } }
    const yearData = Object.values(courses)[0] as any;
    if (!yearData) return [];

    const levelData = yearData[levelLabel];
    if (!levelData) return [];

    const semesterCourses = levelData[selectedSemester];
    if (!semesterCourses) return [];

    // Filter by search query
    let result = semesterCourses;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      result = semesterCourses.filter((course: any) =>
        course.code.toLowerCase().includes(lowerQuery) ||
        course.title.toLowerCase().includes(lowerQuery)
      );
    }

    // Always sort by course code
    return [...result].sort((a, b) => a.code.localeCompare(b.code));
  }, [courses, selectedLevel, levels, searchQuery, selectedSemester]);

  return (
    <VStack align="stretch" spaceY="6" w="full">
      <Flex justify={"space-between"} align="center">
        <InputGroup
          w="50%"
          startElement={<LuSearch />}
        >
          <Input
            placeholder='Search course'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Flex gap="4">
          <Select.Root
            collection={levels}
            value={selectedLevel}
            onValueChange={(e) => setSelectedLevel(e.value)}
            size="sm"
            width="40"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select level" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {levels?.items?.map((level) => (
                    <Select.Item item={level} key={level.value}>
                      {level.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Flex>
      </Flex>

      <Tabs.Root
        value={selectedSemester}
        onValueChange={(e) => setSelectedSemester(e.value)}
        variant="line"
      >
        <Tabs.List w="fit">
          {semesters?.map((semester) => (
            <Tabs.Trigger value={semester.name} key={semester.id}>
              {semester.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <Table.ScrollArea rounded="md" overflow="auto" minW="calc(100vw_-_140px)">
        <Table.Root size="sm">
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.ColumnHeader w="40">Course Code</Table.ColumnHeader>
              <Table.ColumnHeader w="400px">Course Title</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Credit Units</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course: any) => (
                <Table.Row key={course.id}>
                  <Table.Cell borderColor={"border!important"} fontWeight="medium">{course.code}</Table.Cell>
                  <Table.Cell borderColor={"border!important"}>{course.title}</Table.Cell>
                  <Table.Cell borderColor={"border!important"} textAlign="center">{course.creditUnits}</Table.Cell>
                  <Table.Cell borderColor={"border!important"} textAlign="center">
                    <Badge colorPalette={course.isRegistered ? "green" : "gray"} variant="subtle">
                      {course.isRegistered ? "Registered" : "Not Registered"}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py="10" color="gray.500">
                  No courses found for {selectedSemester} at the selected level.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </VStack>
  )
}


const ResultsTabContent = ({ levels, results, semesters }: {
  levels: ListCollection<{
    label: string;
    value: string;
  }>, results: any, semesters: Semester[] | undefined
}) => {
  const [selectedLevel, setSelectedLevel] = React.useState<string[]>(
    levels?.items[0] ? [levels.items[0].value] : []
  );
  const [selectedSemester, setSelectedSemester] = React.useState<string>(
    semesters?.[0]?.name || ""
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredResults = useMemo(() => {
    if (!results || !selectedLevel[0] || !selectedSemester) return [];

    // Find the level label from levels collection
    const levelLabel = levels.items.find(l => l.value === selectedLevel[0])?.label;
    if (!levelLabel) return [];

    // results: AcademicYearResults { "2025/2026": { "100": { "First Semester": [...] } } }
    const yearData = Object.values(results)[0] as any;
    if (!yearData) return [];

    // Try to find the level key. levelLabel might be "100 Level" but key is "100"
    const levelKey = Object.keys(yearData).find(key =>
      levelLabel.includes(key) || key.includes(levelLabel)
    );
    const levelData = levelKey ? yearData[levelKey] : null;
    if (!levelData) return [];

    const semesterResults = levelData[selectedSemester];
    if (!semesterResults) return [];

    // Filter by search query
    let resultList = semesterResults;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase().trim();
      resultList = semesterResults.filter((item: any) =>
        item.courseCode.toLowerCase().includes(lowerQuery) ||
        item.courseTitle.toLowerCase().includes(lowerQuery)
      );
    }

    // Always sort by course code
    return [...resultList].sort((a, b) => a.courseCode.localeCompare(b.courseCode));
  }, [results, selectedLevel, levels, searchQuery, selectedSemester]);

  return (
    <VStack align="stretch" spaceY="6" w="full">
      <Flex justify={"space-between"} align="center">
        <InputGroup
          w="50%"
          startElement={<LuSearch />}
        >
          <Input
            placeholder='Search course code or title'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Flex gap="4">
          <Select.Root
            collection={levels}
            value={selectedLevel}
            onValueChange={(e) => setSelectedLevel(e.value)}
            size="sm"
            width="40"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select level" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {levels?.items?.map((level) => (
                    <Select.Item item={level} key={level.value}>
                      {level.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Flex>
      </Flex>

      <Tabs.Root 
        value={selectedSemester} 
        onValueChange={(e) => setSelectedSemester(e.value)} 
        variant="line"
      >
        <Tabs.List w="fit">
          {semesters?.map((semester) => (
            <Tabs.Trigger value={semester.name} key={semester.id}>
              {semester.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <Table.ScrollArea rounded="md" overflow="hidden">
        <Table.Root size="sm">
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.ColumnHeader w="40">Code</Table.ColumnHeader>
              <Table.ColumnHeader w="400px">Title</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Units</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">CA</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Exam</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Total</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Grade</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredResults.length > 0 ? (
              filteredResults.map((item: any) => (
                <Table.Row key={item.courseId}>
                  <Table.Cell borderColor={"border!important"} fontWeight="medium">{item.courseCode}</Table.Cell>
                  <Table.Cell borderColor={"border!important"}>{item.courseTitle}</Table.Cell>
                  <Table.Cell borderColor={"border!important"} textAlign="center">{item.creditUnits}</Table.Cell>
                  <Table.Cell borderColor={"border!important"} textAlign="center">
                    {item.result?.caScore ?? "N/A"}
                  </Table.Cell>
                  <Table.Cell borderColor={"border!important"} textAlign="center">
                    {item.result?.examScore ?? "N/A"}
                  </Table.Cell>
                  <Table.Cell borderColor={"border!important"} textAlign="center" fontWeight="bold">
                    {item.result?.totalScore ?? "N/A"}
                  </Table.Cell>
                  <Table.Cell borderColor={"border!important"} textAlign="center">
                    <Badge
                      colorPalette={
                        item.result?.letterGrade === "F" ? "red" :
                          item.result?.letterGrade ? "green" : "gray"
                      }
                      variant="solid"
                    >
                      {item.result?.letterGrade ?? "N/A"}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={7} textAlign="center" py="10" color="gray.500">
                  No results found for {selectedSemester} at the selected level.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </VStack>
  )
}

export default CoursesNResults;



























// const TableCheckbox = () => (
//   <Checkbox.Root colorPalette="blue" size="sm">
//     <Checkbox.HiddenInput />
//     <Checkbox.Control rounded="md">
//       <Checkbox.Indicator />
//     </Checkbox.Control>
//   </Checkbox.Root>
// );

// const performanceData = [
//   { name: 'Yr 1', value: 50 },
//   { name: 'Yr 2', value: 25 },
//   { name: 'Yr 3', value: 72 },
//   { name: 'Yr 4', value: 80 },
//   { name: 'Yr 5', value: 30 },
//   { name: 'Yr 6', value: 70 },
// ];

// import {
//   getRegistrations
// } from '../services/registrationService';
// import {
//   RegisteredCourse
// } from '../services/types';
// import { Loader2 } from 'lucide-react';

// const CoursesTab = () => {
//   const [courses, setCourses] = React.useState<RegisteredCourse[]>([]);
//   const [isLoading, setIsLoading] = React.useState(true);

//   React.useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const data = await getRegistrations();
//         if (data && data.courses) {
//           setCourses(data.courses);
//         }
//       } catch (error) {
//         console.error('Failed to fetch courses', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   return (
//     <VStack gap={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
//       <Box
//         bg="white"
//         rounded={{ base: "24px", lg: "32px" }}
//         p={{ base: 6, lg: 8 }}
//         border="1px"
//         borderColor="gray.100"
//         shadow="sm"
//         w="full"
//       >
//         <Heading
//           fontSize={{ base: "md", lg: "lg" }}
//           fontWeight="bold"
//           color="slate.800"
//           mb={{ base: 6, lg: 8 }}
//         >
//           Registered Courses
//         </Heading>
//         <Box overflowX="auto" mx={{ base: -6, lg: 0 }} px={{ base: 6, lg: 0 }}>
//           <Table.Root variant="outline">
//             <Table.Header>
//               <Table.Row borderBottom="1px" borderColor="gray.50">
//                 <Table.ColumnHeader px={4} py={3} w="8">
//                   <TableCheckbox />
//                 </Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Code</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Course Title</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Type</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Unit</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Lecturer(s)</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Status</Table.ColumnHeader>
//               </Table.Row>
//             </Table.Header>
//             <Table.Body>
//               {isLoading ? (
//                 <Table.Row>
//                   <Table.Cell colSpan={7} px={4} py={8} textAlign="center">
//                     <Flex justify="center" align="center" gap={2}>
//                       <Loader2 className="animate-spin text-blue-500" size={20} />
//                       <Text color="gray.500" fontSize="sm">Loading courses...</Text>
//                     </Flex>
//                   </Table.Cell>
//                 </Table.Row>
//               ) : courses.length === 0 ? (
//                 <Table.Row>
//                   <Table.Cell colSpan={7} px={4} py={8} textAlign="center" color="gray.500" fontSize="sm">
//                     No registered courses found.
//                   </Table.Cell>
//                 </Table.Row>
//               ) : (
//                 courses.map((course) => (
//                   <Table.Row key={course.id} _hover={{ bg: 'slate.50' }} transition="background 0.2s" borderBottom="1px" borderColor="gray.50">
//                     <Table.Cell px={4} py={4}>
//                       <TableCheckbox />
//                     </Table.Cell>
//                     <Table.Cell px={4} py={4} fontWeight="bold" color="gray.500" fontSize="11px">{course.code}</Table.Cell>
//                     <Table.Cell px={4} py={4} fontWeight="bold" color="slate.800" fontSize="11px">
//                       {course.title}
//                     </Table.Cell>
//                     <Table.Cell px={4} py={4} color="gray.500" fontSize="11px">
//                       {course.type || 'Departmental'}
//                     </Table.Cell>
//                     <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="11px">
//                       {course.creditUnits}
//                     </Table.Cell>
//                     <Table.Cell px={4} py={4} color="gray.500" fontSize="11px" fontWeight="medium">
//                       {course.lecturer || 'Not Assigned'}
//                     </Table.Cell>
//                     <Table.Cell px={4} py={4}>
//                       <Badge
//                         px={3} py={1}
//                         bg={course.status === 'registered' ? "green.50" : course.status === 'pending' ? "yellow.50" : "red.50"}
//                         color={course.status === 'registered' ? "green.500" : course.status === 'pending' ? "yellow.600" : "red.500"}
//                         rounded="full"
//                         fontSize="9px"
//                         fontWeight="bold"
//                         textTransform="uppercase"
//                         letterSpacing="wider"
//                       >
//                         {course.status}
//                       </Badge>
//                     </Table.Cell>
//                   </Table.Row>
//                 ))
//               )}
//             </Table.Body>
//           </Table.Root>
//         </Box>
//       </Box>
//     </VStack>
//   );
// };


// const ResultsTab = () => {
//   const results = [
//     { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Distinction' },
//     { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 2, ca: 24, exam: 39, total: 63, grade: 'B', remark: 'Very Good' },
//     { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 7, exam: 50, total: 57, grade: 'C', remark: 'Credit' },
//     { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 1, ca: 21, exam: 25, total: 46, grade: 'D', remark: 'Pass' },
//     { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 10, exam: 30, total: 40, grade: 'E', remark: 'Bad' },
//     { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Fail' },
//     { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Distinction' },
//     { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Distinction' },
//   ];

//   const getRemarkStyle = (remark: string) => {
//   switch (remark) {
//     case 'Excellent':
//       return { bg: 'green.50', color: 'green.600' };
//     case 'Very Good':
//       return { bg: 'green.50', color: 'green.400' };
//     case 'Good':
//       return { bg: 'blue.50', color: 'blue.500' };
//     case 'Fair':
//       return { bg: 'yellow.50', color: 'yellow.600' };
//     case 'Pass':
//       return { bg: 'orange.50', color: 'orange.500' };
//     case 'Fail':
//       return { bg: 'red.50', color: 'red.500' };
//     default:
//       return { bg: 'gray.100', color: 'gray.500' };
//   }
// };

//   return (
//     <VStack gap={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
//       <Grid templateColumns="repeat(12, 1fr)" gap={{ base: 6, lg: 8 }} w="full">
//         {/* Chart Section */}
//         <GridItem colSpan={{ base: 12, lg: 7 }}>
//           <Box
//             bg="white"
//             rounded={{ base: "24px", lg: "32px" }}
//             p={{ base: 6, lg: 8 }}
//             border="1px"
//             borderColor="gray.100"
//             shadow="sm"
//           >
//             <Flex justify="space-between" align="center" mb={10}>
//               <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800">Academic Performance</Heading>
//               <Box position="relative">
//                 <NativeSelect.Root size="sm" w="auto">
//                   <NativeSelect.Field
//                     bg="slate.50"
//                     borderColor="gray.100"
//                     fontSize="10px"
//                     fontWeight="bold"
//                     rounded="lg"
//                     textTransform="uppercase"
//                   >
//                     <option>All Time</option>
//                   </NativeSelect.Field>
//                 </NativeSelect.Root>
//               </Box>
//             </Flex>
//             <Box h={{ base: "60", lg: "64" }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={performanceData}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
//                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
//                   <Tooltip cursor={{ stroke: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
//                   <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ r: 0 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Box>
//           </Box>
//         </GridItem>

//         {/* CGPA Section */}
//         <GridItem colSpan={{ base: 12, lg: 5 }}>
//           <Box
//             bg="white"
//             rounded={{ base: "24px", lg: "32px" }}
//             p={{ base: 6, lg: 8 }}
//             border="1px"
//             borderColor="gray.100"
//             shadow="sm"
//             h="full"
//             display="flex"
//             flexDirection="column"
//           >
//             <Flex justify="space-between" align="center" mb={{ base: 8, lg: 10 }}>
//               <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800">CGPA</Heading>
//               <Box position="relative">
//                 <NativeSelect.Root size="sm" w="auto">
//                   <NativeSelect.Field
//                     bg="slate.50"
//                     borderColor="gray.100"
//                     fontSize="10px"
//                     fontWeight="bold"
//                     rounded="lg"
//                     textTransform="uppercase"
//                   >
//                     <option>All Time</option>
//                   </NativeSelect.Field>
//                 </NativeSelect.Root>
//               </Box>
//             </Flex>
//             <VStack gap={{ base: 4, lg: 5 }} flex="1" align="stretch">
//               <Flex justify="space-between" fontSize="13px">
//                 <Text color="gray.400" fontWeight="bold">Total Courses</Text>
//                 <Text fontWeight="bold" color="slate.800">15</Text>
//               </Flex>
//               <Flex justify="space-between" fontSize="13px">
//                 <Text color="gray.400" fontWeight="bold">Total Grade Point</Text>
//                 <Text fontWeight="bold" color="slate.800">150</Text>
//               </Flex>
//               <Flex justify="space-between" fontSize="13px">
//                 <Text color="gray.400" fontWeight="bold">Total Credit Unit</Text>
//                 <Text fontWeight="bold" color="slate.800">33</Text>
//               </Flex>
//             </VStack>
//             <Flex
//               mt={{ base: 8, lg: 10 }}
//               pt={{ base: 8, lg: 10 }}
//               borderTop="1px"
//               borderColor="gray.100"
//               align="flex-end"
//               justify="space-between"
//             >
//                <Text color="gray.400" fontWeight="bold" fontSize="13px">Your CGPA</Text>
//                <HStack align="baseline" gap={1}>
//                  <Text fontSize={{ base: "4xl", lg: "5xl" }} fontWeight="black" color="blue.500">4.5</Text>
//                  <Text fontSize="sm" fontWeight="bold" color="gray.400">/5.0</Text>
//                </HStack>
//             </Flex>
//           </Box>
//         </GridItem>
//       </Grid>

//       {/* Results Table Section */}
//       <Box
//         bg="white"
//         rounded={{ base: "24px", lg: "32px" }}
//         p={{ base: 6, lg: 8 }}
//         border="1px"
//         borderColor="gray.100"
//         shadow="sm"
//         w="full"
//       >
//         <Flex direction={{ base: "column", sm: "row" }} align={{ sm: "center" }} justify="space-between" mb={8} gap={4}>
//           <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800">Results</Heading>
//           <Stack direction={{ base: "column", sm: "row" }} align="center" gap={4} w={{ base: "full", sm: "auto" }}>
//             <Box position="relative" w={{ base: "full", sm: "64" }}>
//               <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2} pointerEvents="none">
//                 <Search size={14} color="#CBD5E0" />
//               </Box>
//               <Input
//                 placeholder="Search by name"
//                 bg="gray.50"
//                 borderColor="gray.100"
//                 fontSize="11px"
//                 rounded="xl"
//                 pl={10}
//                 _focus={{ outline: 'none', borderColor: 'blue.200' }}
//               />
//             </Box>
//             <Box position="relative" w={{ base: "full", sm: "auto" }}>
//               <NativeSelect.Root w={{ base: "full", sm: "auto" }}>
//                 <NativeSelect.Field
//                   bg="slate.50"
//                   borderColor="gray.100"
//                   fontSize="10px"
//                   fontWeight="bold"
//                   rounded="lg"
//                   textTransform="uppercase"
//                 >
//                   <option>All Semesters</option>
//                 </NativeSelect.Field>
//               </NativeSelect.Root>
//             </Box>
//           </Stack>
//         </Flex>

//         <Box overflowX="auto" mx={{ base: -6, lg: 0 }} px={{ base: 6, lg: 0 }}>
//           <Table.Root variant="outline" minW="900px">
//             <Table.Header>
//               <Table.Row borderBottom="1px" borderColor="gray.50">
//                 <Table.ColumnHeader px={4} py={4} w="12"><TableCheckbox /></Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Code</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Course Title</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Unit</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">CA</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Exam</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Total</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Grade</Table.ColumnHeader>
//                 <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Remark</Table.ColumnHeader>
//               </Table.Row>
//             </Table.Header>
//             <Table.Body>
//               {results.map((item, idx) => (
//                 <Table.Row key={idx} _hover={{ bg: 'slate.50' }} transition="background 0.2s" borderBottom="1px" borderColor="gray.50">
//                   <Table.Cell px={4} py={4}>
//                     <TableCheckbox />
//                   </Table.Cell>
//                   <Table.Cell px={4} py={4} fontWeight="bold" color="gray.500" fontSize="12px">{item.code}</Table.Cell>
//                   <Table.Cell px={4} py={4} fontWeight="bold" color="gray.500" fontSize="12px">{item.title}</Table.Cell>
//                   <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.unit}</Table.Cell>
//                   <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.ca}</Table.Cell>
//                   <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.exam}</Table.Cell>
//                   <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.total}</Table.Cell>
//                   <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.grade}</Table.Cell>
//                   <Table.Cell px={4} py={4}>
//                     <Badge
//                       px={3} py={1}
//                       rounded="full"
//                       fontSize="10px"
//                       fontWeight="bold"
//                       {...getRemarkStyle(item.remark)}
//                     >
//                       {item.remark}
//                     </Badge>
//                   </Table.Cell>
//                 </Table.Row>
//               ))}
//             </Table.Body>
//           </Table.Root>
//         </Box>
//       </Box>
//     </VStack>
//   );
// };


// const ComplaintsListView = ({ onLogNew, onSelect }: { onLogNew: () => void, onSelect: (id: string) => void }) => {
//   const [query, setQuery] = React.useState('');
//   const [statusFilter, setStatusFilter] = React.useState('all');
//   const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);
//   const [complaints, setComplaints] = React.useState<any[]>([]);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     apiClient.get('/complaints')
//       .then((res) => {
//         const data = res.data?.data ?? res.data;
//         setComplaints(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => console.error('Failed to fetch complaints:', err))
//       .finally(() => setLoading(false));
//   }, []);

//   const mapStatus = (status: string) => {
//     switch (status?.toUpperCase()) {
//       case 'RESOLVED': return 'Resolved';
//       case 'DECLINED': return 'Declined';
//       case 'ON_PROGRESS': return 'Pending';
//       case 'PENDING': return 'Pending';
//       default: return 'Pending';
//     }
//   };

//   const timeAgo = (dateStr: string) => {
//     const now = new Date();
//     const date = new Date(dateStr);
//     const diffMs = now.getTime() - date.getTime();
//     const mins = Math.floor(diffMs / 60000);
//     if (mins < 1) return 'Just now';
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins / 60);
//     if (hrs < 24) return `${hrs}hr${hrs > 1 ? 's' : ''} ago`;
//     const days = Math.floor(hrs / 24);
//     if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
//     const months = Math.floor(days / 30);
//     return `${months} month${months > 1 ? 's' : ''} ago`;
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'Resolved': return { bg: '#dcfce7', color: '#16a34a' };
//       case 'Declined': return { bg: '#ffedd5', color: '#ea580c' };
//       case 'Pending':
//       default: return { bg: '#f1f5f9', color: '#64748b' };
//     }
//   };

//   const filtered = React.useMemo(() => {
//     return complaints.filter((c) => {
//       const displayStatus = mapStatus(c.status);
//       if (query) {
//         const q = query.toLowerCase();
//         if (!c.subject?.toLowerCase().includes(q) && !c.compliant?.toLowerCase().includes(q)) return false;
//       }
//       if (statusFilter !== 'all' && displayStatus !== statusFilter) return false;
//       return true;
//     });
//   }, [complaints, query, statusFilter]);

//   const truncate = (text: string, max = 45) => text.length > max ? text.substring(0, max) + '...' : text;

//   return (
//     <VStack gap={0} w="full" animation="fade-in 0.5s">
//       {/* Search + Filter + Button Row */}
//       <Flex
//         w="full"
//         gap={3}
//         align="center"
//         mb={6}
//         direction={{ base: 'column', md: 'row' }}
//       >
//         {/* Search */}
//         <Box position="relative" flex={1} maxW={{ md: '400px' }}>
//           <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.300" zIndex={1}>
//             <Search size={16} />
//           </Box>
//           <Input
//             placeholder="Search by subject..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             bg="white"
//             border="1px solid"
//             borderColor="gray.200"
//             rounded="lg"
//             pl={10}
//             pr={4}
//             py={2}
//             fontSize="13px"
//             fontWeight="medium"
//             color="slate.700"
//             _placeholder={{ color: 'gray.300' }}
//             _focus={{ outline: 'none', borderColor: 'blue.300' }}
//             h="40px"
//           />
//         </Box>

//         <Flex gap={3} align="center" ml={{ md: 'auto' }}>
//           {/* Status Filter */}
//           <Box position="relative">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               style={{
//                 background: 'white',
//                 border: '1px solid #e2e8f0',
//                 borderRadius: '8px',
//                 padding: '6px 30px 6px 12px',
//                 fontSize: '12px',
//                 fontWeight: 600,
//                 color: '#334155',
//                 appearance: 'none',
//                 cursor: 'pointer',
//                 height: '40px',
//               }}
//             >
//               <option value="all">Status</option>
//               <option value="Pending">Pending</option>
//               <option value="Resolved">Resolved</option>
//               <option value="Declined">Declined</option>
//             </select>
//             <Box position="absolute" right={2} top="50%" transform="translateY(-50%)" pointerEvents="none" color="gray.400">
//               <ChevronDown size={14} />
//             </Box>
//           </Box>

//           {/* New Complaint Button */}
//           <Button
//             onClick={onLogNew}
//             bg="#D9ECFF"
//             color="blue.500"
//             rounded="lg"
//             px={5}
//             h="40px"
//             fontSize="13px"
//             fontWeight="bold"
//             _hover={{ bg: 'blue.200' }}
//             shadow="sm"
//           >
//             <Plus size={16} style={{ marginRight: '6px' }} />
//             New complaint
//           </Button>
//         </Flex>
//       </Flex>

//       {/* Table */}
//       <Box
//         bg="white"
//         rounded={{ base: '20px', lg: '24px' }}
//         border="1px"
//         borderColor="gray.100"
//         shadow="sm"
//         overflowX="auto"
//         w="full"
//       >
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr style={{ backgroundColor: '#F8FAFC' }}>
//               <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600, width: '60px' }}>S/N</th>
//               <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Subject</th>
//               <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Description</th>
//               <th style={{ padding: '16px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Created at</th>
//               <th style={{ padding: '16px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
//                   <Flex justify="center" align="center" gap={2}>
//                     <Loader2 size={18} className="animate-spin" />
//                     Loading complaints...
//                   </Flex>
//                 </td>
//               </tr>
//             ) : filtered.length === 0 ? (
//               <tr>
//                 <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
//                   No complaints found
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((c, idx) => {
//                 const displayStatus = mapStatus(c.status);
//                 const badge = getStatusBadge(displayStatus);
//                 const desc = c.compliant || '';
//                 return (
//                   <tr
//                     key={c.id}
//                     style={{
//                       borderBottom: '1px solid #f8fafc',
//                       cursor: 'pointer',
//                       backgroundColor: hoveredRow === c.id ? '#f8fafc' : 'transparent',
//                     }}
//                     onMouseEnter={() => setHoveredRow(c.id)}
//                     onMouseLeave={() => setHoveredRow(null)}
//                     onClick={() => onSelect(c.id)}
//                   >
//                     <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{idx + 1}</td>
//                     <td style={{ padding: '16px 20px', fontSize: '13px', color: '#334155', fontWeight: 500 }}>{c.subject}</td>
//                     <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b', fontWeight: 400, position: 'relative' }}>
//                       <span style={{ cursor: 'default' }}>
//                         {truncate(desc)}
//                       </span>
//                       {/* Custom tooltip on hover */}
//                       {hoveredRow === c.id && desc.length > 45 && (
//                         <Box
//                           position="absolute"
//                           top="-8px"
//                           left="20px"
//                           bg="white"
//                           border="1px solid"
//                           borderColor="gray.200"
//                           rounded="lg"
//                           p={3}
//                           shadow="lg"
//                           zIndex={10}
//                           maxW="350px"
//                           fontSize="12px"
//                           color="slate.600"
//                           fontWeight="medium"
//                           lineHeight="1.5"
//                           pointerEvents="none"
//                         >
//                           {desc}
//                         </Box>
//                       )}
//                     </td>
//                     <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{timeAgo(c.createdAt)}</td>
//                     <td style={{ padding: '16px 20px', textAlign: 'center' }}>
//                       <Badge
//                         px={3} py={1}
//                         bg={badge.bg}
//                         color={badge.color}
//                         rounded="full"
//                         fontSize="11px"
//                         fontWeight="bold"
//                         textTransform="capitalize"
//                       >
//                         {displayStatus}
//                       </Badge>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </Box>
//     </VStack>
//   );
// };

// const MakeComplaintView = ({ onBack }: { onBack: () => void }) => {
//   const [subject, setSubject] = React.useState('');
//   const [message, setMessage] = React.useState('');
//   const [submitting, setSubmitting] = React.useState(false);

//   const handleSubmit = async () => {
//     if (!subject.trim() || !message.trim()) {
//       toaster.create({ title: 'Please fill in both Subject and Message', type: 'error' });
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await apiClient.post('/complaints', {
//         subject: subject.trim(),
//         compliant: message.trim(),
//       });
//       toaster.create({ title: 'Complaint filed successfully', type: 'success' });
//       onBack();
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || 'Failed to file complaint';
//       toaster.create({ title: msg, type: 'error' });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//   <Box
//     bg="white"
//     rounded={{ base: "24px", lg: "32px" }}
//     p={{ base: 6, lg: 10 }}
//     border="1px"
//     borderColor="gray.100"
//     shadow="sm"
//     animation="fade-in 0.3s"
//   >
//     <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800" mb={6}>
//       Make Complaint
//     </Heading>

//     {/* Subject */}
//     <Box mb={5}>
//       <Text fontSize="13px" fontWeight="bold" color="slate.700" mb={2}>Subject</Text>
//       <Input
//         placeholder="Missing script"
//         value={subject}
//         onChange={(e) => setSubject(e.target.value)}
//         bg="gray.50"
//         border="1px solid"
//         borderColor="gray.200"
//         rounded="lg"
//         px={4}
//         py={5}
//         fontSize="13px"
//         fontWeight="medium"
//         color="slate.800"
//         _placeholder={{ color: 'gray.300' }}
//         _focus={{ outline: 'none', borderColor: 'blue.300' }}
//         h="auto"
//       />
//     </Box>

//     {/* Message */}
//     <Box mb={8}>
//       <Text fontSize="13px" fontWeight="bold" color="slate.700" mb={2}>Message</Text>
//       <Textarea
//         placeholder="Your message here..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         bg="gray.50"
//         border="1px solid"
//         borderColor="gray.200"
//         rounded="lg"
//         px={4}
//         py={4}
//         fontSize="13px"
//         fontWeight="medium"
//         color="slate.800"
//         w="full"
//         minH="200px"
//         resize="vertical"
//         _placeholder={{ color: 'gray.300' }}
//         _focus={{ outline: 'none', borderColor: 'blue.300' }}
//         css={{
//           '&::placeholder': { color: '#cbd5e1' },
//           '&:focus': { outline: 'none', borderColor: '#93c5fd' },
//         }}
//       />
//     </Box>

//     {/* Actions */}
//     <Flex justify="flex-end" gap={3}>
//       <Button
//         onClick={onBack}
//         variant="ghost"
//         border="1px solid"
//         borderColor="gray.200"
//         rounded="lg"
//         px={4}
//         py={3}
//         fontSize="13px"
//         fontWeight="bold"
//         color="gray.500"
//         bg="white"
//         _hover={{ bg: 'gray.100' }}
//         h="auto"
//         disabled={submitting || !subject.trim() || !message.trim()}
//       >
//         Cancel
//       </Button>
//       <Button
//         onClick={handleSubmit}
//         bg="blue.500"
//         color="white"
//         rounded="lg"
//         px={6}
//         py={3}
//         fontSize="13px"
//         fontWeight="bold"
//         _hover={{ bg: 'blue.600' }}
//         shadow="sm"
//         h="auto"
//         loading={submitting}
//         loadingText="Submitting..."
//       >
//         Submit
//       </Button>
//     </Flex>
//   </Box>
//   );
// };

// const Courses: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const activeSubTab = (() => {
//     if (location.pathname.includes('/courses/courses')) return 'courses';
//     if (location.pathname.includes('/courses/complaints')) return 'complaints';
//     return 'results';
//   })();

//   return (
//     <Box p={{ base: 4, lg: 8 }} maxW="1600px" mx="auto">
//       <VStack gap={{ base: 6, lg: 8 }} w="full">
//         {/* Sub-Tabs Navigation */}
//         <Flex justify="center" overflowX="auto" mx={-4} px={4} py={2} w="full">
//           <HStack
//             bg="white"
//             p={1}
//             rounded="20px"
//             border="1px"
//             borderColor="gray.100"
//             shadow="sm"
//             gap={0}
//           >
//             {(['courses', 'results', 'complaints'] as const).map((tab) => {
//               const tabLabels: Record<string, string> = { courses: 'Courses', results: 'Results', complaints: 'Complaints' };
//               return (
//               <Button
//                 key={tab}
//                 onClick={() => navigate(`/courses/${tab}`)}
//                 variant="ghost"
//                 px={{ base: 6, sm: 12 }}
//                 py={6}
//                 rounded="2xl"
//                 fontSize={{ base: "12px", lg: "sm" }}
//                 fontWeight="bold"
//                 bg={activeSubTab === tab ? 'blue.500' : 'transparent'}
//                 color={activeSubTab === tab ? 'white' : 'gray.400'}
//                 _hover={{
//                   bg: activeSubTab === tab ? 'blue.600' : 'gray.50',
//                   color: activeSubTab === tab ? 'white' : 'gray.600'
//                 }}
//                 shadow={activeSubTab === tab ? 'md' : 'none'}
//                 transition="all 0.3s"
//               >
//                 {tabLabels[tab]}
//               </Button>
//               );
//             })}
//           </HStack>
//         </Flex>

//         {/* Conditional Rendering based on Sub-Tab and View State */}
//         <Box minH="600px" w="full">
//           <Routes>
//             <Route path="courses" element={<CoursesTab />} />
//             <Route path="results" element={<ResultsTab />} />
//             <Route path="complaints" element={<ComplaintsListView onLogNew={() => navigate('complaints/new')} onSelect={(id: string) => navigate(`complaints/${id}`)} />} />
//             <Route path="complaints/new" element={<MakeComplaintView onBack={() => navigate('/courses/complaints')} />} />
//             <Route path="*" element={<ResultsTab />} />
//           </Routes>
//         </Box>
//       </VStack>
//     </Box>
//   );
// };

// export default Courses;