import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Flex, Grid, GridItem, Text, Heading, Button, IconButton, Input, Image, NativeSelect, 
  Table, Checkbox, Badge, 
  Stack, HStack, VStack, 
  useBreakpointValue
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

const TableCheckbox = () => (
  <Checkbox.Root colorPalette="blue" size="sm">
    <Checkbox.HiddenInput />
    <Checkbox.Control rounded="md">
      <Checkbox.Indicator />
    </Checkbox.Control>
  </Checkbox.Root>
);

const performanceData = [
  { name: 'Yr 1', value: 50 },
  { name: 'Yr 2', value: 25 },
  { name: 'Yr 3', value: 72 },
  { name: 'Yr 4', value: 80 },
  { name: 'Yr 5', value: 30 },
  { name: 'Yr 6', value: 70 },
];

const CoursesTab = () => (
  <VStack spacing={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
    <Box 
      bg="white" 
      rounded={{ base: "24px", lg: "32px" }} 
      p={{ base: 6, lg: 8 }} 
      border="1px" 
      borderColor="gray.100" 
      shadow="sm"
      w="full"
    >
      <Heading 
        fontSize={{ base: "md", lg: "lg" }} 
        fontWeight="bold" 
        color="slate.800" 
        mb={{ base: 6, lg: 8 }}
      >
        Registered Courses
      </Heading>
      <Box overflowX="auto" mx={{ base: -6, lg: 0 }} px={{ base: 6, lg: 0 }}>
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row borderBottom="1px" borderColor="gray.50">
              <Table.ColumnHeader px={4} py={3} w="8">
                <TableCheckbox />
              </Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Code</Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Course Title</Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Type</Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Unit</Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Lecturer(s)</Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} color="gray.400" fontSize="10px" textTransform="uppercase">Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Array(8).fill(0).map((_, i) => (
              <Table.Row key={i} _hover={{ bg: 'slate.50' }} transition="background 0.2s" borderBottom="1px" borderColor="gray.50">
                <Table.Cell px={4} py={4}>
                  <TableCheckbox />
                </Table.Cell>
                <Table.Cell px={4} py={4} fontWeight="bold" color="gray.500" fontSize="11px">CSC201.1</Table.Cell>
                <Table.Cell px={4} py={4} fontWeight="bold" color="slate.800" fontSize="11px">
                  {i === 2 ? 'General Studies' : i === 3 ? 'Advanced Calculus' : 'Computer Science Introduction'}
                </Table.Cell>
                <Table.Cell px={4} py={4} color="gray.500" fontSize="11px">
                  {i === 2 ? 'General' : i === 3 ? 'Faculty' : 'Department'}
                </Table.Cell>
                <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="11px">
                  {i === 2 ? '2' : '3'}
                </Table.Cell>
                <Table.Cell px={4} py={4} color="gray.500" fontSize="11px" fontWeight="medium">
                  {i === 2 ? 'Dr. Azubuike Okocha' : 'Dr. Edward Nduka'}
                </Table.Cell>
                <Table.Cell px={4} py={4}>
                  <Badge 
                    px={3} py={1} 
                    bg="green.50" 
                    color="green.500" 
                    rounded="full" 
                    fontSize="9px" 
                    fontWeight="bold" 
                    textTransform="uppercase" 
                    letterSpacing="wider"
                  >
                    Registered
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  </VStack>
);

const ResultsTab = () => {
  const results = [
    { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Distinction' },
    { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 2, ca: 24, exam: 39, total: 63, grade: 'B', remark: 'Very Good' },
    { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 7, exam: 50, total: 57, grade: 'C', remark: 'Credit' },
    { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 1, ca: 21, exam: 25, total: 46, grade: 'D', remark: 'Pass' },
    { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 10, exam: 30, total: 40, grade: 'E', remark: 'Bad' },
    { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Fail' },
    { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Distinction' },
    { code: 'CSC201.1', title: 'Computer Science Introduction', unit: 3, ca: 20, exam: 55, total: 75, grade: 'A', remark: 'Distinction' },
  ];

  const getRemarkStyle = (remark: string) => {
    switch (remark) {
      case 'Distinction':
      case 'Very Good':
        return { bg: 'green.50', color: 'green.500' };
      case 'Credit':
      case 'Pass':
        return { bg: 'blue.50', color: 'blue.500' };
      case 'Bad':
      case 'Fail':
        return { bg: 'red.50', color: 'red.500' };
      default:
        return { bg: 'gray.100', color: 'gray.500' };
    }
  };

  return (
    <VStack spacing={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
      <Grid templateColumns="repeat(12, 1fr)" gap={{ base: 6, lg: 8 }} w="full">
        {/* Chart Section */}
        <GridItem colSpan={{ base: 12, lg: 7 }}>
          <Box 
            bg="white" 
            rounded={{ base: "24px", lg: "32px" }} 
            p={{ base: 6, lg: 8 }} 
            border="1px" 
            borderColor="gray.100" 
            shadow="sm"
          >
            <Flex justify="space-between" align="center" mb={10}>
              <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800">Academic Performance</Heading>
              <Box position="relative">
                <NativeSelect.Root size="sm" w="auto">
                  <NativeSelect.Field 
                    bg="slate.50" 
                    borderColor="gray.100" 
                    fontSize="10px" 
                    fontWeight="bold" 
                    rounded="lg" 
                    textTransform="uppercase"
                  >
                    <option>All Time</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>
            </Flex>
            <Box h={{ base: "60", lg: "64" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                  <Tooltip cursor={{ stroke: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ r: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </GridItem>

        {/* CGPA Section */}
        <GridItem colSpan={{ base: 12, lg: 5 }}>
          <Box 
            bg="white" 
            rounded={{ base: "24px", lg: "32px" }} 
            p={{ base: 6, lg: 8 }} 
            border="1px" 
            borderColor="gray.100" 
            shadow="sm" 
            h="full"
            display="flex" 
            flexDirection="column"
          >
            <Flex justify="space-between" align="center" mb={{ base: 8, lg: 10 }}>
              <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800">CGPA</Heading>
              <Box position="relative">
                <NativeSelect.Root size="sm" w="auto">
                  <NativeSelect.Field 
                    bg="slate.50" 
                    borderColor="gray.100" 
                    fontSize="10px" 
                    fontWeight="bold" 
                    rounded="lg" 
                    textTransform="uppercase"
                  >
                    <option>All Time</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Box>
            </Flex>
            <VStack spacing={{ base: 4, lg: 5 }} flex="1" align="stretch">
              <Flex justify="space-between" fontSize="13px">
                <Text color="gray.400" fontWeight="bold">Total Courses</Text>
                <Text fontWeight="bold" color="slate.800">15</Text>
              </Flex>
              <Flex justify="space-between" fontSize="13px">
                <Text color="gray.400" fontWeight="bold">Total Grade Point</Text>
                <Text fontWeight="bold" color="slate.800">150</Text>
              </Flex>
              <Flex justify="space-between" fontSize="13px">
                <Text color="gray.400" fontWeight="bold">Total Credit Unit</Text>
                <Text fontWeight="bold" color="slate.800">33</Text>
              </Flex>
            </VStack>
            <Flex 
              mt={{ base: 8, lg: 10 }} 
              pt={{ base: 8, lg: 10 }} 
              borderTop="1px" 
              borderColor="gray.100" 
              align="flex-end" 
              justify="space-between"
            >
               <Text color="gray.400" fontWeight="bold" fontSize="13px">Your CGPA</Text>
               <HStack align="baseline" spacing={1}>
                 <Text fontSize={{ base: "4xl", lg: "5xl" }} fontWeight="black" color="blue.500">4.5</Text>
                 <Text fontSize="sm" fontWeight="bold" color="gray.400">/5.0</Text>
               </HStack>
            </Flex>
          </Box>
        </GridItem>
      </Grid>

      {/* Results Table Section */}
      <Box 
        bg="white" 
        rounded={{ base: "24px", lg: "32px" }} 
        p={{ base: 6, lg: 8 }} 
        border="1px" 
        borderColor="gray.100" 
        shadow="sm"
        w="full"
      >
        <Flex direction={{ base: "column", sm: "row" }} align={{ sm: "center" }} justify="space-between" mb={8} gap={4}>
          <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800">Results</Heading>
          <Stack direction={{ base: "column", sm: "row" }} align="center" spacing={4} w={{ base: "full", sm: "auto" }}>
            <Box position="relative" w={{ base: "full", sm: "64" }}>
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2} pointerEvents="none">
                <Search size={14} color="#CBD5E0" />
              </Box>
              <Input 
                placeholder="Search by name" 
                bg="gray.50" 
                borderColor="gray.100" 
                fontSize="11px" 
                rounded="xl" 
                pl={10}
                _focus={{ outline: 'none', borderColor: 'blue.200' }}
              />
            </Box>
            <Box position="relative" w={{ base: "full", sm: "auto" }}>
              <NativeSelect.Root w={{ base: "full", sm: "auto" }}>
                <NativeSelect.Field 
                  bg="slate.50" 
                  borderColor="gray.100" 
                  fontSize="10px" 
                  fontWeight="bold" 
                  rounded="lg" 
                  textTransform="uppercase"
                >
                  <option>All Semesters</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
          </Stack>
        </Flex>

        <Box overflowX="auto" mx={{ base: -6, lg: 0 }} px={{ base: 6, lg: 0 }}>
          <Table.Root variant="outline" minW="900px">
            <Table.Header>
              <Table.Row borderBottom="1px" borderColor="gray.50">
                <Table.ColumnHeader px={4} py={4} w="12"><TableCheckbox /></Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Code</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Course Title</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Unit</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">CA</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Exam</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Total</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Grade</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.500" textTransform="uppercase" fontSize="12px">Remark</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {results.map((item, idx) => (
                <Table.Row key={idx} _hover={{ bg: 'slate.50' }} transition="background 0.2s" borderBottom="1px" borderColor="gray.50">
                  <Table.Cell px={4} py={4}>
                    <TableCheckbox />
                  </Table.Cell>
                  <Table.Cell px={4} py={4} fontWeight="bold" color="gray.500" fontSize="12px">{item.code}</Table.Cell>
                  <Table.Cell px={4} py={4} fontWeight="bold" color="gray.500" fontSize="12px">{item.title}</Table.Cell>
                  <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.unit}</Table.Cell>
                  <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.ca}</Table.Cell>
                  <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.exam}</Table.Cell>
                  <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.total}</Table.Cell>
                  <Table.Cell px={4} py={4} color="gray.500" fontWeight="bold" fontSize="12px">{item.grade}</Table.Cell>
                  <Table.Cell px={4} py={4}>
                    <Badge 
                      px={3} py={1} 
                      rounded="full" 
                      fontSize="10px" 
                      fontWeight="bold" 
                      {...getRemarkStyle(item.remark)}
                    >
                      {item.remark}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </VStack>
  );
};

const ApplicationDetail = ({ onBack }: { onBack: () => void }) => (
  <Box 
    bg="white" 
    rounded={{ base: "24px", lg: "32px" }} 
    border="1px" 
    borderColor="gray.100" 
    shadow="sm" 
    overflow="hidden" 
    display="flex" 
    flexDirection="column" 
    h={{ base: "70vh", lg: "750px" }} 
    animation="slide-in-from-right 0.3s"
  >
    <Flex 
      px={{ base: 6, lg: 8 }} 
      py={{ base: 5, lg: 6 }} 
      borderBottom="1px" 
      borderColor="gray.50" 
      align="center" 
      justify="space-between" 
      flexShrink={0}
    >
      <Flex align="center" gap={{ base: 3, lg: 4 }}>
        <IconButton 
          aria-label="Back" 
          icon={<ChevronLeft size={20} />} 
          onClick={onBack} 
          variant="ghost" 
          rounded="full" 
          color="gray.400" 
          _hover={{ bg: "slate.50" }}
        />
        <Heading 
          fontSize={{ base: "14px", lg: "15px" }} 
          fontWeight="bold" 
          color="slate.800" 
          noOfLines={1} 
          maxW={{ base: "150px", lg: "none" }}
        >
          Complaint - CPT011
        </Heading>
      </Flex>
      <HStack spacing={{ base: 2, lg: 3 }}>
        <Text display={{ base: "none", sm: "inline" }} fontSize="11px" fontWeight="bold" color="gray.400">Status</Text>
        <Badge 
          px={3} py={1} 
          bg="blue.50" 
          color="blue.500" 
          rounded="full" 
          fontSize="9px" 
          fontWeight="bold" 
          textTransform="uppercase" 
          letterSpacing="wider"
        >
          Active
        </Badge>
      </HStack>
    </Flex>
    
    <VStack 
      flex="1" 
      overflowY="auto" 
      p={{ base: 4, lg: 8 }} 
      spacing={{ base: 6, lg: 8 }} 
      bg="white" 
      align="stretch"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '24px' },
      }}
    >
      <Flex direction="column" maxW={{ base: "90%", sm: "85%" }}>
        <Box 
          bg="blue.50" 
          p={{ base: 4, lg: 6 }} 
          rounded={{ base: "20px", lg: "24px" }} 
          border="1px" 
          borderColor="blue.100"
        >
          <Text fontSize={{ base: "12px", lg: "13px" }} color="slate.800" lineHeight="relaxed" fontWeight="medium">
            I hope this message finds you well. I am writing to kindly notify you that my result for MTH 110.1 is currently missing...
          </Text>
        </Box>
        <Text fontSize="10px" fontWeight="bold" color="gray.300" mt={2} px={1}>9:00 am</Text>
      </Flex>

      <Flex direction="column" maxW={{ base: "90%", sm: "85%" }} alignSelf="flex-start">
        <Box 
          bg="white" 
          p={{ base: 4, lg: 6 }} 
          rounded={{ base: "20px", lg: "24px" }} 
          border="1px" 
          borderColor="gray.100" 
          shadow="sm"
        >
          <Text fontSize={{ base: "12px", lg: "13px" }} color="slate.800" lineHeight="relaxed" fontWeight="medium">
            Thank you for bringing this to my attention. Kindly confirm your full name and matric number...
          </Text>
        </Box>
        <Text fontSize="10px" fontWeight="bold" color="gray.300" mt={2} px={1} textAlign="right">10:00 am</Text>
      </Flex>
    </VStack>

    <Box p={{ base: 4, lg: 8 }} bg="white" borderTop="1px" borderColor="gray.50" flexShrink={0}>
      <Box position="relative">
        <Input 
          placeholder="Type text here to follow up on complaint" 
          bg="slate.50" 
          borderColor="gray.200" 
          rounded="2xl" 
          py={{ base: 4, lg: 5 }} 
          pl={{ base: 5, lg: 8 }} 
          pr={{ base: 12, lg: 14 }} 
          fontSize={{ base: "13px", lg: "sm" }} 
          fontWeight="medium" 
          color="slate.800" 
          _focus={{ outline: "none", borderColor: "blue.300" }}
          h="auto"
        />
        <Box position="absolute" right={4} top="50%" transform="translateY(-50%)" display="flex" alignItems="center">
          <IconButton
            aria-label="Send"
            icon={<Send size={16} />}
            variant="ghost"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            size="sm"
            p={2}
            mr={2}
          />
          <Image src="/assets/Paperclip.png" alt="Attach" boxSize="18px" cursor="pointer" />
        </Box>
      </Box>
    </Box>
  </Box>
);

const ApplicationsListView = ({ onLogNew, onSelect }: { onLogNew: () => void, onSelect: (id: string) => void }) => {
  const applications = [
    { id: '1', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '30m ago', status: 'In Progress', color: 'blue' },
    { id: '2', code: 'CPT011', subject: 'Result Remark Request', desc: 'I believe my result for MTH110.1 is not my score...', update: '3d ago', status: 'In Progress', color: 'blue' },
    { id: '3', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '7d ago', status: 'Pending Review', color: 'pink' },
    { id: '4', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1w ago', status: 'Completed', color: 'green' },
    { id: '5', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '2mon ago', status: 'Completed', color: 'green' },
    { id: '6', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1yr ago', status: 'Pending Review', color: 'pink' },
    { id: '7', code: 'CPT011', subject: 'Missing Result Complaint', desc: 'My result for MTH110.1 is missing and i wrote...', update: '1yr ago', status: 'Completed', color: 'green' },
  ];

  return (
    <VStack spacing={{ base: 6, lg: 8 }} w="full" animation="fade-in 0.5s">
      <Flex justify="flex-end" mb={2} w="full">
        <Button 
          leftIcon={<Plus size={18} />} 
          bg="blue.500" 
          color="white" 
          px={6} py={6} 
          rounded="xl" 
          fontSize="13px" 
          fontWeight="bold" 
          shadow="lg" 
          _hover={{ bg: "blue.600" }} 
          onClick={onLogNew}
        >
          Log New Application
        </Button>
      </Flex>

      <Box 
        bg="white" 
        rounded={{ base: "24px", lg: "32px" }} 
        p={{ base: 6, lg: 10 }} 
        border="1px" 
        borderColor="gray.100" 
        shadow="sm" 
        overflow="hidden"
        w="full"
      >
        <Flex direction={{ base: "column", sm: "row" }} align={{ sm: "center" }} justify="space-between" mb={8} gap={4}>
          <Heading fontSize={{ base: "md", lg: "lg" }} fontWeight="bold" color="slate.800">All Applications</Heading>
          <Stack direction={{ base: "column", sm: "row" }} align="center" spacing={4} w={{ base: "full", sm: "auto" }}>
            <Box position="relative" w={{ base: "full", sm: "80" }}>
              <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={2} pointerEvents="none">
                <Search size={14} color="#CBD5E0" />
              </Box>
              <Input 
                placeholder="Search by subject, code, date" 
                bg="gray.50" 
                borderColor="gray.100" 
                fontSize="11px" 
                rounded="xl" 
                pl={10}
                _focus={{ outline: "none", borderColor: "blue.200" }}
              />
            </Box>
            <Box position="relative" w={{ base: "full", sm: "auto" }}>
              <NativeSelect.Root w={{ base: "full", sm: "auto" }}>
                <NativeSelect.Field 
                  bg="slate.50" 
                  borderColor="gray.100" 
                  fontSize="10px" 
                  fontWeight="bold" 
                  rounded="lg" 
                  textTransform="uppercase"
                >
                  <option>All Application</option>
                </NativeSelect.Field>
              </NativeSelect.Root>
            </Box>
          </Stack>
        </Flex>

        <Box overflowX="auto" mx={{ base: -6, lg: 0 }} px={{ base: 6, lg: 0 }}>
          <Table.Root variant="outline" minW="900px">
            <Table.Header>
              <Table.Row borderBottom="1px" borderColor="gray.50">
                <Table.ColumnHeader px={4} py={4} w="12"><TableCheckbox /></Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.400" textTransform="uppercase" fontSize="10px" letterSpacing="wider">Code</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.400" textTransform="uppercase" fontSize="10px" letterSpacing="wider">Subject</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.400" textTransform="uppercase" fontSize="10px" letterSpacing="wider">Description</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.400" textTransform="uppercase" fontSize="10px" letterSpacing="wider">Last Update</Table.ColumnHeader>
                <Table.ColumnHeader px={4} py={4} fontWeight="bold" color="gray.400" textTransform="uppercase" fontSize="10px" letterSpacing="wider">Status</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {applications.map((app, idx) => (
                <Table.Row 
                  key={app.id} 
                  onClick={() => onSelect(app.id)} 
                  cursor="pointer" 
                  _hover={{ bg: "slate.50" }} 
                  transition="background 0.2s"
                  borderBottom="1px"
                  borderColor="gray.50"
                >
                  <Table.Cell px={4} py={5} onClick={(e) => e.stopPropagation()}>
                    <TableCheckbox />
                  </Table.Cell>
                  <Table.Cell px={4} py={5} fontWeight="bold" color="gray.500" fontSize="11px">{app.code}</Table.Cell>
                  <Table.Cell px={4} py={5} fontWeight="bold" color="slate.800" fontSize="11px">{app.subject}</Table.Cell>
                  <Table.Cell px={4} py={5} color="gray.400" fontSize="11px" fontWeight="medium">
                    <Text noOfLines={1} maxW="250px">{app.desc}</Text>
                  </Table.Cell>
                  <Table.Cell px={4} py={5} color="gray.500" fontWeight="bold" fontSize="11px">{app.update}</Table.Cell>
                  <Table.Cell px={4} py={5}>
                    <Badge 
                      px={4} py={1.5} 
                      rounded="full" 
                      fontSize="9px" 
                      fontWeight="bold" 
                      textTransform="uppercase" 
                      letterSpacing="wider"
                      bg={
                        app.color === 'blue' ? 'blue.50' : 
                        app.color === 'green' ? 'green.50' : 
                        'red.50'
                      }
                      color={
                        app.color === 'blue' ? 'blue.500' : 
                        app.color === 'green' ? 'green.500' : 
                        'red.500'
                      }
                    >
                      {app.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </VStack>
  );
};

const Courses: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeSubTab = (() => {
    if (location.pathname.includes('/courses/courses')) return 'courses';
    if (location.pathname.includes('/courses/applications')) return 'applications';
    return 'results';
  })();

  return (
    <Box p={{ base: 4, lg: 8 }} maxW="1600px" mx="auto">
      <VStack spacing={{ base: 6, lg: 8 }} w="full">
        {/* Sub-Tabs Navigation */}
        <Flex justify="center" overflowX="auto" mx={-4} px={4} py={2} w="full">
          <HStack 
            bg="white" 
            p={1} 
            rounded="20px" 
            border="1px" 
            borderColor="gray.100" 
            shadow="sm" 
            spacing={0}
          >
            {(['courses', 'results', 'applications'] as const).map((tab) => (
              <Button
                key={tab}
                onClick={() => navigate(`/courses/${tab}`)}
                variant="ghost"
                px={{ base: 6, sm: 12 }}
                py={6}
                rounded="2xl"
                fontSize={{ base: "12px", lg: "sm" }}
                fontWeight="bold"
                bg={activeSubTab === tab ? 'blue.500' : 'transparent'}
                color={activeSubTab === tab ? 'white' : 'gray.400'}
                _hover={{ 
                  bg: activeSubTab === tab ? 'blue.600' : 'gray.50',
                  color: activeSubTab === tab ? 'white' : 'gray.600'
                }}
                shadow={activeSubTab === tab ? 'md' : 'none'}
                transition="all 0.3s"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </HStack>
        </Flex>

        {/* Conditional Rendering based on Sub-Tab and View State */}
        <Box minH="600px" w="full">
          <Routes>
            <Route path="courses" element={<CoursesTab />} />
            <Route path="results" element={<ResultsTab />} />
            <Route path="applications" element={<ApplicationsListView onLogNew={() => navigate('applications/new')} onSelect={(id: string) => navigate(`applications/${id}`)} />} />
            <Route path="applications/new" element={<ApplicationDetail onBack={() => navigate('/courses/applications')} />} />
            <Route path="applications/:id" element={<ApplicationDetail onBack={() => navigate('/courses/applications')} />} />
            <Route path="*" element={<ResultsTab />} />
          </Routes>
        </Box>
      </VStack>
    </Box>
  );
};

export default Courses;