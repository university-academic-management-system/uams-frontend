import {
  Flex,
  Input,
  InputGroup,
  Button,
  Select,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import { Search, ChevronDown, X, Download } from "lucide-react";
import type { StudentStatus, StudentLevel } from "@type/student.type";

const STUDENT_STATUSES: StudentStatus[] = ["ACTIVE", "SUSPENDED", "DELETED"];
const STUDENT_LEVELS: StudentLevel[] = [
  "L100",
  "L200",
  "L300",
  "L400"
];

const STATUSES_COLLECTION = createListCollection({
  items: [
    { label: "All Statuses", value: "" },
    ...STUDENT_STATUSES.map((s) => ({
      label: s.charAt(0) + s.slice(1).toLowerCase(),
      value: s,
    })),
  ],
});

const LEVELS_COLLECTION = createListCollection({
  items: [
    { label: "All Levels", value: "" },
    ...STUDENT_LEVELS.map((l) => ({ label: l.replace(/^L/i, ""), value: l })),
  ],
});

interface StudentsFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
  selectedSession: string;
  setSelectedSession: (val: string) => void;
  clearFilters: () => void;
  handleExport: () => void;
  setCurrentPage: (page: number) => void;
  isExportDisabled: boolean;
}

const StudentsFilters = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedLevel,
  setSelectedLevel,
  selectedSession,
  setSelectedSession,
  clearFilters,
  handleExport,
  setCurrentPage,
  isExportDisabled,
}: StudentsFiltersProps) => {
  return (
    <Flex
      p="6"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap="4"
      colorPalette="accent"
    >
      <InputGroup
        startElement={<Search size={20} color="gray" />}
        flex="1"
        minW="220px"
        maxW="400px"
      >
        <Input
          size="lg"
          type="text"
          placeholder="Search by name, email or student ID..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          bg="white"
          border="1px solid"
          borderColor="border.muted"
          ps="11"
        />
      </InputGroup>

      <Flex gap="3" alignItems="center" flexWrap="wrap">
        <Select.Root
          collection={STATUSES_COLLECTION}
          value={selectedStatus ? [selectedStatus] : []}
          onValueChange={(e) => {
            setSelectedStatus(e.value[0] || "");
            setCurrentPage(1);
          }}
          size="lg"
          width="140px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
              <Select.ValueText placeholder="Status" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator>
                <ChevronDown size={16} color="#64748b" />
              </Select.Indicator>
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {STATUSES_COLLECTION.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Select.Root
          collection={LEVELS_COLLECTION}
          value={selectedLevel ? [selectedLevel] : []}
          onValueChange={(e) => {
            setSelectedLevel(e.value[0] || "");
            setCurrentPage(1);
          }}
          size="lg"
          width="140px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
              <Select.ValueText placeholder="Level" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator>
                <ChevronDown size={16} color="#64748b" />
              </Select.Indicator>
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {LEVELS_COLLECTION.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

        <Input
          size="lg"
          placeholder="Session (e.g. 2025/2026)"
          value={selectedSession}
          onChange={(e) => {
            setSelectedSession(e.target.value);
            setCurrentPage(1);
          }}
          bg="white"
          border="xs"
          borderColor="border.muted"
          width="170px"
        />

        <Button
          onClick={clearFilters}
          variant="ghost"
          color="fg.muted"
          size="xl"
          px="3"
          aria-label="Clear filters"
        >
          <X size={16} />
        </Button>

        <Button
          onClick={handleExport}
          size="xl"
          variant="outline"
          border="xs" 
          borderColor="border.muted"
          colorPalette="gray"
          disabled={isExportDisabled}
        >
          <Download size={20} /> Export table
        </Button>
      </Flex>
    </Flex>
  );
};

export default StudentsFilters;
