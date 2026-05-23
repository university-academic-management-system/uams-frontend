import { useState, useMemo, useCallback } from "react";
import { 
    Box, Flex, Text, Input, Spinner, 
    Table, Button, Badge, Portal, Select, 
    createListCollection, InputGroup,
    Heading
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuRotateCcw, LuEye, LuArrowLeft } from "react-icons/lu";
import { Search, ChevronDown, X } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import { 
    PaginationItems, 
    PaginationNextTrigger, 
    PaginationPrevTrigger, 
    PaginationRoot 
} from "@components/ui/pagination";
import type { Payment, TransactionsListProps } from "@type/payment.type";
import PaymentDetailsSidebar from "./PaymentDetailsSidebar";

const ITEMS_PER_PAGE = 10;

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        PAID: "green",
        PENDING: "yellow",
        FAILED: "red",
        CANCELLED: "gray",
    };
    return (
        <Badge variant="subtle" colorPalette={colors[status] || "gray"} borderRadius="md" size="sm" px="3">
            {status}
        </Badge>
    );
};

const TransactionsList = ({ onBack, programTypeId, programTypeName }: TransactionsListProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sessionFilter, setSessionFilter] = useState("");

    const [levelFilter, setLevelFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    // Sidebar state
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const { data: response, isLoading, isError, refetch } = useQuery({
        queryKey: ["payments", currentPage, searchQuery, statusFilter, typeFilter, sessionFilter, levelFilter, programTypeId],
        queryFn: () => PaymentServices.getPayments(
            currentPage, 
            ITEMS_PER_PAGE, 
            searchQuery, 
            statusFilter, 
            typeFilter, 
            sessionFilter,
            levelFilter
        ),
    });

    const payments = useMemo(() => response?.data || [], [response?.data]);
    const pagination = response?.pagination;

    // Dynamically derive unique values from fetched data for filters
    const typeCollection = useMemo(() => {
        const types = Array.from(new Set(payments.map(p => p.type)));
        return createListCollection({
            items: [
                { label: "All Types", value: "" },
                ...types.map(t => ({ label: t.replace(/_/g, " "), value: t }))
            ]
        });
    }, [payments]);

    const sessionCollection = useMemo(() => {
        const sessions = Array.from(new Set(payments.map(p => p.session)));
        return createListCollection({
            items: [
                { label: "All Sessions", value: "" },
                ...sessions.map(s => ({ label: s, value: s }))
            ]
        });
    }, [payments]);

    const levelCollection = useMemo(() => {
        const levels = Array.from(new Set(payments.map(p => p.level)));
        return createListCollection({
            items: [
                { label: "All Levels", value: "" },
                ...levels.map(l => ({ label: l, value: l }))
            ]
        });
    }, [payments]);



    const statusCollection = useMemo(() => createListCollection({
        items: [
            { label: "All Statuses", value: "" },
            { label: "Paid", value: "PAID" },
            { label: "Pending", value: "PENDING" },
            { label: "Failed", value: "FAILED" },
        ]
    }), []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    }, []);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    }, []);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }, []);

    return (
        <Box>
            <Flex direction="column" gap="6">
                <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={onBack} 
                            mb="2" 
                            p="0" 
                            borderRadius="md"
                            fontWeight="bold"
                            color="accent"
                        >
                            <LuArrowLeft /> Back to Summary
                        </Button>
                        <Heading size="2xl" fontWeight="bold" color="fg.muted">
                            {programTypeName || "All"} Transactions
                        </Heading>
                        <Text fontSize="sm" color="fg.subtle">Detailed transaction history</Text>
                    </Box>
                    <Button 
                        bg="accent" 
                        color="white" 
                        borderRadius="md" 
                        size="xl"
                        variant="solid" 
                        onClick={() => refetch()} 
                        disabled={isLoading}
                    >
                        <LuRotateCcw /> Refresh
                    </Button>
                </Flex>

                {/* Table Container with integrated Filters */}
                <Box bg="white" borderRadius="md" border="1px solid" borderColor="border.muted" overflow="hidden" shadow="none">
                    
                    <Flex p="6" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="4" colorPalette="accent">
                        <InputGroup startElement={<Search size={20} color="gray" />} flex="1" minW="220px" maxW="400px">
                            <Input
                                size="lg"
                                type="text"
                                placeholder="Search by reference or ID..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                bg="white"
                                border="xs"
                                borderColor="border.muted"
                                ps="11"
                            />
                        </InputGroup>

                        <Flex gap="3" alignItems="center" flexWrap="wrap">
                            <Select.Root 
                                collection={statusCollection} 
                                value={statusFilter ? [statusFilter] : []} 
                                onValueChange={(e) => { setStatusFilter(e.value[0] || ""); setCurrentPage(1); }} 
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
                                            {statusCollection.items.map((item) => (
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
                                collection={typeCollection.items.length > 0 ? typeCollection : createListCollection({ items: [{ label: "All Types", value: "" }] })} 
                                value={typeFilter ? [typeFilter] : []} 
                                onValueChange={(e) => { setTypeFilter(e.value[0] || ""); setCurrentPage(1); }} 
                                size="lg" 
                                width="180px"
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                        <Select.ValueText placeholder="Payment Type" />
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
                                            {(typeCollection.items.length > 0 ? typeCollection : createListCollection({ items: [{ label: "All Types", value: "" }] })).items.map((item) => (
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
                                collection={sessionCollection.items.length > 0 ? sessionCollection : createListCollection({ items: [{ label: "All Sessions", value: "" }] })} 
                                value={sessionFilter ? [sessionFilter] : []} 
                                onValueChange={(e) => { setSessionFilter(e.value[0] || ""); setCurrentPage(1); }} 
                                size="lg" 
                                width="140px"
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                        <Select.ValueText placeholder="Session" />
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
                                            {(sessionCollection.items.length > 0 ? sessionCollection : createListCollection({ items: [{ label: "All Sessions", value: "" }] })).items.map((item) => (
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
                                collection={levelCollection.items.length > 0 ? levelCollection : createListCollection({ items: [{ label: "All Levels", value: "" }] })} 
                                value={levelFilter ? [levelFilter] : []} 
                                onValueChange={(e) => { setLevelFilter(e.value[0] || ""); setCurrentPage(1); }} 
                                size="lg" 
                                width="130px"
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
                                            {(levelCollection.items.length > 0 ? levelCollection : createListCollection({ items: [{ label: "All Levels", value: "" }] })).items.map((item) => (
                                                <Select.Item item={item} key={item.value}>
                                                    <Select.ItemText>{item.label}</Select.ItemText>
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>

                            <Button 
                                onClick={() => {
                                    setStatusFilter("");
                                    setTypeFilter("");
                                    setSessionFilter("");
                                    setLevelFilter("");
                                    setSearchQuery("");
                                    setCurrentPage(1);
                                }} 
                                variant="ghost" 
                                color="fg.muted" 
                                size="xl" 
                                px="3" 
                                aria-label="Clear filters"
                            >
                                <X size={16} />
                            </Button>
                        </Flex>
                    </Flex>

                    {isLoading ? (
                        <Flex direction="column" alignItems="center" justify="center" py="20" gap="4">
                            <Spinner size="xl" color="accent" />
                            <Text color="fg.muted">Loading transactions...</Text>
                        </Flex>
                    ) : isError ? (
                        <Flex justify="center" py="20">
                            <Text color="red.500">Failed to load payments. Please try again.</Text>
                        </Flex>
                    ) : (
                        <Table.Root size="sm" variant="line">
                            <Table.Header bg="bg.subtle">
                                <Table.Row>
                                    <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">S/N</Table.ColumnHeader>
                                    <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">DATE</Table.ColumnHeader>
                                    <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">REFERENCE</Table.ColumnHeader>
                                    <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">TYPE</Table.ColumnHeader>
                                    <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">AMOUNT</Table.ColumnHeader>
                                    <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">SESSION/LEVEL</Table.ColumnHeader>
                                    <Table.ColumnHeader bg="slate.50" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" whiteSpace="nowrap">STATUS</Table.ColumnHeader>
                                    <Table.ColumnHeader bg="slate.50" px="6" py="4" textAlign="right"></Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {payments.map((payment: Payment, index: number) => (
                                    <Table.Row key={payment.id} _hover={{ bg: "slate.50" }} borderColor="border.muted">
                                        <Table.Cell px="6" py="4" fontSize="xs" fontWeight="bold" color="fg.muted">
                                            {((currentPage - 1) * ITEMS_PER_PAGE) + index + 1}
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4" fontSize="xs" fontWeight="medium">
                                            {formatDate(payment.createdAt)}
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4">
                                            <Text fontWeight="bold" fontSize="xs">{payment.reference}</Text>
                                            <Text fontSize="2xs" color="fg.subtle">ID: {payment.studentId.slice(0, 8)}...</Text>
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4" fontSize="xs">
                                            <Text fontWeight="medium">{payment.type.replace(/_/g, " ")}</Text>
                                            <Text fontSize="2xs" color="fg.subtle">{payment.paymentChannel}</Text>
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4" fontWeight="bold" color="accent" fontSize="xs">
                                            {formatCurrency(payment.amount)}
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4" fontSize="xs">
                                            <Text fontWeight="medium">{payment.session}</Text>
                                            <Text fontSize="2xs" color="fg.subtle">{payment.level} - {payment.semester}</Text>
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4">
                                            <StatusBadge status={payment.status} />
                                        </Table.Cell>
                                        <Table.Cell px="6" py="4" textAlign="right">
                                            <Button 
                                                variant="ghost" 
                                                size="xs"
                                                borderRadius="md"
                                                color="accent"
                                                fontWeight="bold"
                                                onClick={() => setSelectedPayment(payment)}
                                            >
                                                <LuEye /> Details
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}

                    {/* Pagination Container */}
                    {pagination && pagination.totalPages > 1 && (
                        <Flex alignItems="center" justifyContent="space-between" bg="bg.subtle" p="4" borderTop="1px solid" borderColor="border.muted">
                            <Text fontSize="xs" color="fg.muted">
                                Showing page <Text as="span" fontWeight="bold">{pagination.page}</Text> of {pagination.totalPages}
                                {" "}({pagination.total} total transactions)
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
            </Flex>

            <PaymentDetailsSidebar 
                isOpen={!!selectedPayment} 
                onClose={() => setSelectedPayment(null)} 
                payment={selectedPayment} 
            />
        </Box>
    );
};

export default TransactionsList;