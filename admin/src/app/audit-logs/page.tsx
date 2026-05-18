import { useState, useMemo } from "react";
import { History, RotateCcw } from "lucide-react";
import { LuSearch, LuCalendar } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import {
  Box, Flex, Text, Input, Spinner,
  EmptyState,
  Button,
  InputGroup,
  Portal,
  Select,
  createListCollection,
  DatePicker,
} from "@chakra-ui/react";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from "@components/ui/timeline";
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
} from "@components/ui/pagination";
import { AuditLogServices } from "@services/auditLog.service";
import type { AuditLog } from "@type/audit.type";

const ITEMS_PER_PAGE = 20;

const AuditLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // TanStack Query for data fetching
  const { data: response, isLoading, isError, refetch } = useQuery({
      queryKey: ["audit-logs", currentPage, searchQuery, action, entity, dateRange],
      queryFn: () => {
          const [startDate, endDate] = dateRange;
          return AuditLogServices.getAuditLogs(
              currentPage, 
              ITEMS_PER_PAGE, 
              searchQuery,
              action,
              entity,
              startDate,
              endDate
          );
      },
  });

  const logs = response?.data?.data || [];
  const pagination = response?.data?.pagination;

  // Dynamically derive unique actions and entities from the fetched logs
  const actionsCollection = useMemo(() => {
      const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
      return createListCollection({
          items: [
              { label: "All Actions", value: "" },
              ...uniqueActions.map(a => ({ label: a, value: a }))
          ],
      });
  }, [logs]);

  const entitiesCollection = useMemo(() => {
      const uniqueEntities = Array.from(new Set(logs.map(log => log.entity)));
      return createListCollection({
          items: [
              { label: "All Entities", value: "" },
              ...uniqueEntities.map(e => ({ label: e, value: e }))
          ],
      });
  }, [logs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1); 
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Box minH="80vh">
      <Flex direction="column" mb="8" gap="6">
        <Flex direction={{ base: "column", md: "row" }} justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }} gap="4">
            <Box>
            <Text fontSize="2xl" fontWeight="bold" color="fg.muted">Audit Logs</Text>
            <Text fontSize="sm" color="fg.muted">Monitor system activity and user actions</Text>
            </Box>
            <Flex gap="3" flexWrap="nowrap" alignItems="center" w={{ base: "full", md: "auto" }}>
            <InputGroup flex="1" startElement={<LuSearch color="#94a3b8" />}>
                <Input
                placeholder="Search by ID, User..."
                value={searchQuery}
                onChange={handleSearchChange}
                bg="white"
                borderRadius="md"
                fontSize="sm"
                w="full"
                maxW={{ base: "full", md: "280px" }}
                />
            </InputGroup>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                disabled={isLoading}
            >
                <RotateCcw size={16} />
                Refresh
            </Button>
            </Flex>
        </Flex>

        {/* Filters Row */}
        <Flex gap="4" flexWrap="wrap" alignItems="flex-end" bg="bg.subtle" p="5" borderRadius="xl" border="1px solid" borderColor="border.muted">
            <Box flex="1" minW="200px">
                <Text fontSize="xs" fontWeight="bold" color="fg.muted" mb="2">ACTION</Text>
                <Select.Root 
                    collection={actionsCollection} 
                    size="sm" 
                    value={[action]}
                    onValueChange={(e) => setAction(e.value[0])}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger bg="white">
                            <Select.ValueText placeholder="Filter Action" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {actionsCollection.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Box>

            <Box flex="1" minW="200px">
                <Text fontSize="xs" fontWeight="bold" color="fg.muted" mb="2">ENTITY</Text>
                <Select.Root 
                    collection={entitiesCollection} 
                    size="sm" 
                    value={[entity]}
                    onValueChange={(e) => setEntity(e.value[0])}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger bg="white">
                            <Select.ValueText placeholder="Filter Entity" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {entitiesCollection.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Box>

            <Box flex="2" minW="300px">
                <Text fontSize="xs" fontWeight="bold" color="fg.muted" mb="2">DATE RANGE</Text>
                <DatePicker.Root 
                    selectionMode="range" 
                    onValueChange={(e) => {
                        const range = e.value.map(d => {
                            // Convert CalendarDate to JS Date for toISOString()
                            const date = new Date(d.year, d.month - 1, d.day);
                            return date.toISOString();
                        });
                        setDateRange(range);
                    }}
                >
                    <DatePicker.Control>
                        <DatePicker.Input index={0} bg="white" fontSize="xs" placeholder="Start Date" />
                        <DatePicker.Input index={1} bg="white" fontSize="xs" placeholder="End Date" />
                        <DatePicker.IndicatorGroup>
                            <DatePicker.Trigger>
                                <LuCalendar />
                            </DatePicker.Trigger>
                        </DatePicker.IndicatorGroup>
                    </DatePicker.Control>
                    <Portal>
                        <DatePicker.Positioner>
                            <DatePicker.Content>
                                <DatePicker.View view="day">
                                    <DatePicker.Header />
                                    <DatePicker.DayTable />
                                </DatePicker.View>
                                <DatePicker.View view="month">
                                    <DatePicker.Header />
                                    <DatePicker.MonthTable />
                                </DatePicker.View>
                                <DatePicker.View view="year">
                                    <DatePicker.Header />
                                    <DatePicker.YearTable />
                                </DatePicker.View>
                            </DatePicker.Content>
                        </DatePicker.Positioner>
                    </Portal>
                </DatePicker.Root>
            </Box>

            <Button 
                variant="ghost" 
                size="sm" 
                colorPalette="red"
                onClick={() => {
                    setAction("");
                    setEntity("");
                    setDateRange([]);
                    setSearchQuery("");
                }}
            >
                Clear Filters
            </Button>
        </Flex>
      </Flex>

      <Box bg="white" borderRadius="md" border="1px solid" borderColor="border.muted" overflow="hidden">
        <Box p={{ base: "4", md: "8" }}>
        {isLoading ? (
          <Flex direction="column" alignItems="center" justify="center" py="20" gap="4">
            <Spinner size="xl" color="accent" borderWidth="3px" />
            <Text color="fg.muted" fontWeight="medium">Fetching latest activity...</Text>
          </Flex>
        ) : isError ? (
            <Flex justify="center" py="20">
              <Text color="red.500">Failed to load audit logs. Please try again.</Text>
            </Flex>
        ) : logs.length === 0 ? (
          <Flex justify="center" py="20">
            <EmptyState.Root>
                <EmptyState.Content>
                    <EmptyState.Indicator>
                        <History size={40} />
                    </EmptyState.Indicator>
                    <EmptyState.Title mt="4">No Logs Found</EmptyState.Title>
                    <EmptyState.Description>
                        {searchQuery ? "Try adjusting your search criteria" : "No activity has been logged yet"}
                    </EmptyState.Description>
                </EmptyState.Content>
            </EmptyState.Root>
          </Flex>
        ) : (
          <TimelineRoot maxW="3xl" mx="auto">
            {logs.map((log: AuditLog) => (
              <TimelineItem key={log.id}>
                <TimelineContent width="auto" minW="140px" textAlign="right" pr="6">
                  <Text fontSize="sm" fontWeight="bold" color="fg.muted">
                    {formatDate(log.createdAt).split(",")[0]}
                  </Text>
                  <Text fontSize="xs" color="fg.subtle">
                    {formatDate(log.createdAt).split(",")[1]?.trim()}
                  </Text>
                </TimelineContent>
                <TimelineConnector bg="white" color="accent">
                  <History size={14} />
                </TimelineConnector>
                <TimelineContent pl="6" pb="10">
                  <TimelineTitle>
                    <Flex gap="3" align="center" flexWrap="wrap">
                      <Text as="span" px="2.5" py="1" bg="blue.50" color="blue.700" borderRadius="full" fontSize="xs" fontWeight="extrabold" textTransform="uppercase" letterSpacing="wider">
                        {log.action}
                      </Text>
                      <Text as="span" fontWeight="bold" color="fg.muted" fontSize="md">
                        {log.entity}
                      </Text>
                      {log.entityId && (
                        <Text as="span" fontSize="xs" color="fg.subtle" bg="bg.subtle" px="2" py="0.5" borderRadius="md" border="1px solid" borderColor="border.muted">
                          ID: {log.entityId.slice(0, 8)}...
                        </Text>
                      )}
                    </Flex>
                  </TimelineTitle>
                  <TimelineDescription mt="3" color="fg.muted" fontSize="sm">
                    <Flex gap="6" mt="1" flexWrap="wrap">
                      <Box>
                        <Text fontSize="xs" color="fg.subtle" fontWeight="bold" mb="0.5">PERFORMED BY</Text>
                        <Text fontWeight="medium">{log.userId}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="fg.subtle" fontWeight="bold" mb="0.5">IP ADDRESS</Text>
                        <Text fontWeight="medium">{log.ipAddress || "N/A"}</Text>
                      </Box>
                    </Flex>
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </TimelineRoot>
        )}
        </Box>

        {/* Standardized Pagination */}
        {pagination && pagination.totalPages > 1 && (
            <Flex alignItems="center" justifyContent="space-between" bg="bg.subtle" p="6" borderTop="1px solid" borderColor="border.muted">
              <Text fontSize="sm" color="fg.muted">
                Showing page <Text as="span" fontWeight="bold" color="fg.default">{pagination.page}</Text> of <Text as="span" fontWeight="bold" color="fg.default">{pagination.totalPages}</Text>
                {" "}(<Text as="span" fontWeight="bold">{pagination.total}</Text> total logs)
              </Text>
              
              <PaginationRoot
                count={pagination.total}
                pageSize={ITEMS_PER_PAGE}
                page={currentPage}
                onPageChange={(e) => setCurrentPage(e.page)}
              >
                <Flex gap="2">
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </Flex>
              </PaginationRoot>
            </Flex>
          )}
      </Box>
    </Box>
  );
};

export default AuditLogsPage;
