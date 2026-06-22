import {
  createListCollection,
  EmptyState,
  Flex,
  Portal,
  Select,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useMemo, useState, lazy, Suspense } from "react";
import { CalendarX } from "lucide-react";
import { useTimetable } from "@hooks/timetable.hooks";
import { useTotals } from "@hooks/dashboard.hook";

const TimetableCalendarView = lazy(() => import("@components/shared/timetable-calendarview"));

const generateSessionOptions = () => {
  const currentYear = new Date().getFullYear();
  const sessions = [];
  for (let year = currentYear; year >= currentYear - 10; year--) {
    sessions.push(`${year}/${year + 1}`);
  }
  return sessions;
};

const TimeTable = () => {
  const sessionList = useMemo(() => generateSessionOptions(), []);
  const { data: settings } = useTotals();
  const sessionCollection = createListCollection({
    items: sessionList.map((s) => ({ label: s, value: s })),
  });

  const semesterCollection = createListCollection({
    items: [
      { label: "1st Semester", value: "FIRST" },
      { label: "2nd Semester", value: "SECOND" },
      { label: "3rd Semester", value: "THIRD" },
    ],
  });

  const [selectedSession, setSelectedSession] = useState(() => settings?.currentSession || "");
  const [selectedSemester, setSelectedSemester] = useState(() => settings?.currentSemester || "FIRST");

  const { data: timetableData, isLoading, error } = useTimetable(
    { session: selectedSession, semester: selectedSemester },
    true
  );

  return (
    <Stack gap="6">
      <Flex gap="3" wrap="wrap" justify="flex-end">
        <Select.Root
          collection={sessionCollection}
          value={[selectedSession]}
          onValueChange={(e) => setSelectedSession(e.value[0])}
          size="lg"
          width="220px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
              <Select.ValueText placeholder="Select session" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {sessionCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Select.Root
          collection={semesterCollection}
          value={[selectedSemester]}
          onValueChange={(e) => setSelectedSemester(e.value[0])}
          size="lg"
          width="200px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
              <Select.ValueText placeholder="Select semester" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {semesterCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Flex>

      {isLoading ? (
        <Flex alignItems="center" justifyContent="center" minH="400px">
          <Spinner size="xl" color="accent" borderWidth="3px" />
          <Text ml="4" color="fg.muted">Loading timetable...</Text>
        </Flex>
      ) : error ? (
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <CalendarX />
            </EmptyState.Indicator>
            <EmptyState.Title>Failed to Load Timetable</EmptyState.Title>
            <EmptyState.Description>
              {error.message || "An unexpected error occurred."}
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <Suspense fallback={<Spinner size="xl" color="accent" />}>
          <TimetableCalendarView timetableData={timetableData!} />
        </Suspense>
      )}
    </Stack>
  );
};

export default TimeTable;