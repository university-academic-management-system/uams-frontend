import {
  Box,
  Button,
  Center,
  CloseButton,
  createListCollection,
  Drawer,
  EmptyState,
  Heading,
  HStack,
  Portal,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { TimetableHook } from "@hooks/timetable.hooks";
import type { TimetableEntry } from "@type/timetable.type";
import { LEVELS, SEMESTERS } from "@type/timetable.type";
import { memo, useEffect, useMemo, useState } from "react";
import { LuCircleAlert, LuCalendarX } from "react-icons/lu";
import useAuthStore from "@stores/auth.store";

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatLevelDisplay = (level: string, includeLevelWord: boolean = false) => {
  if (!level) return "—";
  if (level === "GRADUATED" || level === "WITHDRAWN") {
    return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  }
  const stripped = level.replace(/^L/i, "");
  return includeLevelWord ? `${stripped} Level` : stripped;
};

const levelOptions = createListCollection({
  items: [
    { label: "All Levels", value: "" },
    ...LEVELS.map((level) => ({ label: formatLevelDisplay(level, true), value: level })),
  ],
});

const semesterLabels: Record<string, string> = {
  FIRST: "First Semester",
  SECOND: "Second Semester",
  THIRD: "Third Semester",
};

const semesterOptions = createListCollection({
  items: SEMESTERS.map((semester) => ({
    label: semesterLabels[semester] || semester,
    value: semester,
  })),
});

// Table skeleton component
const TableSkeleton = () => {
  const columns = [
    "Day", "Start Time", "End Time", "Venue", "Level", "Semester", "Session", "Course Code", "Actions"
  ];
  return (
    <Box rounded="md" borderWidth="1px" borderColor="border.muted" overflowX="auto">
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            {columns.map((col) => (
              <Table.ColumnHeader key={col} bg="bg.muted" fontSize="md" fontWeight="600" color="fg.muted" px="4" py="3">
                {col}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Table.Row key={idx}>
              {columns.map((col, i) => (
                <Table.Cell key={i} px="4" py="3">
                  <Skeleton h="4" w={col === "Actions" ? "16" : "24"} />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

const Timetable = () => {
  const { user } = useAuthStore();

  const currentYear = new Date().getFullYear();
  const fallbackSession = `${currentYear}/${currentYear + 1}`;

  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(user?.currentSemester || "FIRST");
  const [selectedSession, setSelectedSession] = useState(user?.currentSession || fallbackSession);

  useEffect(() => {
    if (user?.currentSemester) setSelectedSemester(user.currentSemester);
    if (user?.currentSession) setSelectedSession(user.currentSession);
  }, [user]);

  const { data: timetables, isLoading: isQueryLoading, error } = TimetableHook.useTimetable(
    { session: selectedSession, semester: selectedSemester },
    !!selectedSession && !!selectedSemester
  );

  const isLoading = isQueryLoading || !selectedSession || !selectedSemester;

  const sessionOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1999;
    const sessions = [];
    for (let year = currentYear; year >= startYear; year--) {
      sessions.push(`${year}/${year + 1}`);
    }
    return createListCollection({ items: sessions.map((s) => ({ label: s, value: s })) });
  }, []);

  const filteredTimetables = useMemo(() => {
    const entries = Array.isArray(timetables) ? timetables : [];
    let filtered = entries;
    if (selectedSession) filtered = filtered.filter((t) => t.session === selectedSession);
    if (selectedLevel) filtered = filtered.filter((t) => t.level === selectedLevel);
    if (selectedSemester) filtered = filtered.filter((t) => t.semester === selectedSemester);
    return filtered;
  }, [timetables, selectedSession, selectedLevel, selectedSemester]);

  if (isLoading) {
    return (
      <Box p="4">
        <HStack gap="4" mb="4" justify="flex-end">
          <Skeleton h="10" w="160px" />
          <Skeleton h="10" w="140px" />
          <Skeleton h="10" w="180px" />
        </HStack>
        <TableSkeleton />
      </Box>
    );
  }

  if (error) {
    return (
      <Center minH="100vh">
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuCircleAlert />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>Error</EmptyState.Title>
              <EmptyState.Description>{error.message}</EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Center>
    );
  }

  return (
    <Stack>
      <Box bg="bg" rounded="md" p="4">
        <HStack gap="4" mb="4" justify="flex-end">
          <Select.Root
            collection={sessionOptions}
            value={[selectedSession]}
            onValueChange={(e) => setSelectedSession(e.value[0])}
            size="lg"
            width="160px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select session" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {sessionOptions.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root
            collection={levelOptions}
            value={[selectedLevel]}
            onValueChange={(e) => setSelectedLevel(e.value[0])}
            size="lg"
            width="140px"
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
                  {levelOptions.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <Select.Root
            collection={semesterOptions}
            value={[selectedSemester]}
            onValueChange={(e) => setSelectedSemester(e.value[0])}
            size="lg"
            width="180px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select semester" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {semesterOptions.items.map((item) => (
                    <Select.Item item={item} key={item.value}>
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </HStack>

        <Table.ScrollArea>
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Day</Table.ColumnHeader>
                <Table.ColumnHeader>Start Time</Table.ColumnHeader>
                <Table.ColumnHeader>End Time</Table.ColumnHeader>
                <Table.ColumnHeader>Venue</Table.ColumnHeader>
                <Table.ColumnHeader>Level</Table.ColumnHeader>
                <Table.ColumnHeader>Semester</Table.ColumnHeader>
                <Table.ColumnHeader>Session</Table.ColumnHeader>
                <Table.ColumnHeader>Course Code</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredTimetables.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={9} textAlign="center" py={10}>
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <LuCalendarX />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>No timetable entries found</EmptyState.Title>
                          <EmptyState.Description>
                            {timetables && Array.isArray(timetables) && timetables.length === 0
                              ? "No timetable data available for the selected session and semester."
                              : "Try adjusting your filters to see more results."}
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredTimetables.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.dayOfWeek}</Table.Cell>
                    <Table.Cell>{formatTime(item.startTime)}</Table.Cell>
                    <Table.Cell>{formatTime(item.endTime)}</Table.Cell>
                    <Table.Cell>{item.venue}</Table.Cell>
                    <Table.Cell>{formatLevelDisplay(item.level, false)}</Table.Cell>
                    <Table.Cell>{item.semester}</Table.Cell>
                    <Table.Cell>{item.session}</Table.Cell>
                    <Table.Cell>{item.course.code}</Table.Cell>
                    <Table.Cell>
                      <DetailsDrawer item={item} />
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Stack>
  );
};

const DetailsDrawer = memo(({ item }: { item: TimetableEntry }) => {
  return (
    <Drawer.Root size="md">
      <Drawer.Trigger asChild>
        <Button variant="outline" size="xs">View</Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Timetable Details</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap="3">
                <HStack><Text fontWeight="bold">Course Code:</Text><Text>{item.course.code}</Text></HStack>
                <HStack><Text fontWeight="bold">Day:</Text><Text>{item.dayOfWeek}</Text></HStack>
                <HStack><Text fontWeight="bold">Time:</Text><Text>{formatTime(item.startTime)} – {formatTime(item.endTime)}</Text></HStack>
                <HStack><Text fontWeight="bold">Venue:</Text><Text>{item.venue}</Text></HStack>
                <HStack><Text fontWeight="bold">Session:</Text><Text>{item.session}</Text></HStack>
                <HStack><Text fontWeight="bold">Semester:</Text><Text>{item.semester}</Text></HStack>
                <HStack><Text fontWeight="bold">Level:</Text><Text>{formatLevelDisplay(item.level, true)}</Text></HStack>
              </Stack>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
});

export default Timetable;