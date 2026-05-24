import { useState, useMemo, useCallback } from "react";
import { History, RotateCcw } from "lucide-react";
import { LuSearch, LuActivity, LuCalendar } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import {
    Button, CloseButton, Drawer, IconButton, Portal, Box, Flex, Text, Input, Spinner,
    EmptyState, InputGroup, Select, createListCollection, DatePicker,
} from "@chakra-ui/react";
import { Tooltip } from "@components/ui/tooltip";
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

const AuditLogs = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [action, setAction] = useState("");
    const [entity, setEntity] = useState("");
    const [dateRange, setDateRange] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [resetKey, setResetKey] = useState(0);

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

    const logs = useMemo(() => response?.data?.data || [], [response?.data?.data]);
    const pagination = response?.data?.pagination;

    // Dynamically derive unique actions and entities from the fetched logs
    const actionsCollection = useMemo(() => {
        const uniqueActions = Array.from(new Set(logs.map((log: AuditLog) => log.action)));
        return createListCollection({
            items: [
                { label: "All Actions", value: "" },
                ...uniqueActions.map((a: string) => ({ label: a, value: a }))
            ],
        });
    }, [logs]);

    const entitiesCollection = useMemo(() => {
        const uniqueEntities = Array.from(new Set(logs.map((log: AuditLog) => log.entity)));
        return createListCollection({
            items: [
                { label: "All Entities", value: "" },
                ...uniqueEntities.map((e: string) => ({ label: e, value: e }))
            ],
        });
    }, [logs]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); 
    }, []);

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    }, []);

    return (
        <Drawer.Root modal={false} size="xl">
            <Tooltip content="Audit Logs">
                <Drawer.Trigger asChild>
                    <IconButton variant="ghost" size="md" color="fg.muted">
                        <LuActivity />
                    </IconButton>
                </Drawer.Trigger>
            </Tooltip>
            <Portal>
                <Drawer.Positioner pt="14" pr="4" pb="4">
                    <Drawer.Content rounded="md">
                        <Drawer.Header borderBottomWidth="1px" borderColor="border.subtle" pb="4">
                            <Flex direction="column" gap="4">
                                <Flex direction="row" justifyContent="space-between" alignItems="center" gap="4">
                                    <Box>
                                        <Drawer.Title fontSize="2xl" fontWeight="bold" color="fg.muted">Audit Logs</Drawer.Title>
                                        <Text fontSize="xs" color="fg.subtle">Monitor system activity and user actions</Text>
                                    </Box>
                                </Flex>

                                {/* Filters & Search Row */}
                                <Flex direction="column" gap="4" colorPalette="accent">
                                    {/* Search Input & Refresh */}
                                    <Flex gap="3" w="full" alignItems="center">
                                        <Box flex="1">
                                            <InputGroup w="full" startElement={<LuSearch color="#94a3b8" size={20} />}>
                                                <Input
                                                    placeholder="Search by ID, User..."
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    bg="white"
                                                    // h="10"
                                                    size="xl"
                                                    w="full"
                                                />
                                            </InputGroup>
                                        </Box>
                                        <Button 
                                            variant="solid" 
                                            size="xl" 
                                            onClick={() => refetch()}
                                            disabled={isLoading}
                                        >
                                            <RotateCcw size={14} />
                                            Refresh
                                        </Button>
                                    </Flex>

                                    {/* Filters */}
                                    <Flex gap="3" flexWrap="wrap">
                                        <Box flex="1" minW="140px">
                                            <Select.Root 
                                                collection={actionsCollection} 
                                                size="lg" 
                                                value={[action]}
                                                onValueChange={(e) => setAction(e.value[0])}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Control>
                                                    <Select.Trigger bg="white">
                                                        <Select.ValueText placeholder="Action" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {actionsCollection.items.length === 0 ? (
                                                                <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                                                    No options available
                                                                </Box>
                                                            ) : (
                                                                actionsCollection.items.map((item) => (
                                                                    <Select.Item item={item} key={item.value}>
                                                                        {item.label}
                                                                        <Select.ItemIndicator />
                                                                    </Select.Item>
                                                                ))
                                                            )}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root>
                                        </Box>

                                        <Box flex="1" minW="140px">
                                            <Select.Root 
                                                collection={entitiesCollection} 
                                                size="lg" 
                                                value={[entity]}
                                                onValueChange={(e) => setEntity(e.value[0])}
                                            >
                                                <Select.HiddenSelect />
                                                <Select.Control>
                                                    <Select.Trigger bg="white">
                                                        <Select.ValueText placeholder="Entity" />
                                                    </Select.Trigger>
                                                    <Select.IndicatorGroup>
                                                        <Select.Indicator />
                                                    </Select.IndicatorGroup>
                                                </Select.Control>
                                                <Portal>
                                                    <Select.Positioner>
                                                        <Select.Content>
                                                            {entitiesCollection.items.length === 0 ? (
                                                                <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                                                    No options available
                                                                </Box>
                                                            ) : (
                                                                entitiesCollection.items.map((item) => (
                                                                    <Select.Item item={item} key={item.value}>
                                                                        {item.label}
                                                                        <Select.ItemIndicator />
                                                                    </Select.Item>
                                                                ))
                                                            )}
                                                        </Select.Content>
                                                    </Select.Positioner>
                                                </Portal>
                                            </Select.Root>
                                        </Box>

                                        <Box flex="2" minW="260px">
                                            <DatePicker.Root openOnClick
                                                key={resetKey}
                                                size="xl"
                                                selectionMode="range" 
                                                onValueChange={(e) => {
                                                    const range = e.value.map(d => {
                                                        const date = new Date(d.year, d.month - 1, d.day);
                                                        return date.toISOString();
                                                    });
                                                    setDateRange(range);
                                                }}
                                            >
                                                <DatePicker.Control>
                                                    <DatePicker.Input index={0} bg="white" placeholder="Start Date" />
                                                    <DatePicker.Input index={1} bg="white" placeholder="End Date" />
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
                                            size="xl"
                                            colorPalette="red"
                                            onClick={() => {
                                                setAction("");
                                                setEntity("");
                                                setDateRange([]);
                                                setSearchQuery("");
                                                setResetKey(prev => prev + 1);
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Drawer.Header>

                        <Drawer.Body px="4" py="6" bg="bg.subtle">
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
                                <Flex justify="center" py="20" bg="white" borderRadius="md" border="1px solid" borderColor="border.muted">
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
                                <Box bg="white" borderRadius="md" border="1px solid" borderColor="border.muted" overflow="hidden" p={{ base: "4", md: "8" }}>
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
                                                            <Text as="span" fontWeight="bold" color="fg.muted" fontSize="sm">
                                                                {log.entity}
                                                            </Text>
                                                            {log.entityId && (
                                                                <Text as="span" fontSize="xs" color="fg.subtle" bg="bg.subtle" px="2" py="0.5" borderRadius="md" border="1px solid" borderColor="border.muted">
                                                                    ID: {log.entityId.slice(0, 8)}...
                                                                </Text>
                                                            )}
                                                        </Flex>
                                                    </TimelineTitle>
                                                    <TimelineDescription mt="3" color="fg.muted" fontSize="xs">
                                                        <Flex gap="6" mt="1" flexWrap="wrap">
                                                            <Box>
                                                                <Text fontSize="10px" color="fg.subtle" fontWeight="bold" mb="0.5">PERFORMED BY</Text>
                                                                <Text fontWeight="medium">{log.userId}</Text>
                                                            </Box>
                                                            <Box>
                                                                <Text fontSize="10px" color="fg.subtle" fontWeight="bold" mb="0.5">IP ADDRESS</Text>
                                                                <Text fontWeight="medium">{log.ipAddress || "N/A"}</Text>
                                                            </Box>
                                                        </Flex>
                                                    </TimelineDescription>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </TimelineRoot>

                                    {/* Standardized Pagination */}
                                    {pagination && pagination.totalPages > 1 && (
                                        <Flex alignItems="center" justifyContent="space-between" bg="bg.subtle" p="4" mt="8" borderRadius="md" border="1px solid" borderColor="border.muted">
                                            <Text fontSize="xs" color="fg.muted">
                                                Page <Text as="span" fontWeight="bold">{pagination.page}</Text> of <Text as="span" fontWeight="bold">{pagination.totalPages}</Text>
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
                            )}
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="xl" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}

export default AuditLogs;
