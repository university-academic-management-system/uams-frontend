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

const STATUSES_COLLECTION = createListCollection({
  items: [
    { label: "All Statuses", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Completed", value: "COMPLETED" },
  ],
});

interface IDCardsFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  clearFilters: () => void;
  handleExport: () => void;
  setCurrentPage: (page: number) => void;
  isExportDisabled: boolean;
}

const IDCardsFilters = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  clearFilters,
  handleExport,
  setCurrentPage,
  isExportDisabled,
}: IDCardsFiltersProps) => {
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
          placeholder="Search by name or matric number..."
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
          width="160px"
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
              <Select.Content zIndex="popover" bg="white" border="xs" borderColor="border.muted" borderRadius="md">
                {STATUSES_COLLECTION.items.map((item) => (
                  <Select.Item item={item} key={item.value} _hover={{ bg: "slate.50" }} px="3" py="2" cursor="pointer">
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>

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

export default IDCardsFilters;
