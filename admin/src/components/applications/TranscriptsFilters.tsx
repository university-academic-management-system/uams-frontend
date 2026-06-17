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
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Ready", value: "READY" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ],
});

const DELIVERY_METHODS_COLLECTION = createListCollection({
  items: [
    { label: "All Methods", value: "" },
    { label: "Digital Delivery", value: "DIGITAL_DELIVERY" },
    { label: "Physical Pickup", value: "PHYSICAL_PICKUP" },
  ],
});

interface TranscriptsFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedDeliveryMethod: string;
  setSelectedDeliveryMethod: (val: string) => void;
  clearFilters: () => void;
  handleExport: () => void;
  setCurrentPage: (page: number) => void;
  isExportDisabled: boolean;
}

const TranscriptsFilters = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedDeliveryMethod,
  setSelectedDeliveryMethod,
  clearFilters,
  handleExport,
  setCurrentPage,
  isExportDisabled,
}: TranscriptsFiltersProps) => {
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
          placeholder="Search by name, matric no, or reference..."
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
        {/* Status filter */}
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

        {/* Delivery method filter */}
        <Select.Root
          collection={DELIVERY_METHODS_COLLECTION}
          value={selectedDeliveryMethod ? [selectedDeliveryMethod] : []}
          onValueChange={(e) => {
            setSelectedDeliveryMethod(e.value[0] || "");
            setCurrentPage(1);
          }}
          size="lg"
          width="180px"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger bg="white" border="xs" borderColor="border.muted">
              <Select.ValueText placeholder="Delivery Method" />
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
                {DELIVERY_METHODS_COLLECTION.items.map((item) => (
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

export default TranscriptsFilters;
