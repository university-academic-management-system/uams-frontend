import { useState, useMemo } from "react";
import { 
    Box, Flex, Text, Input, Spinner, 
    Table, Button, Badge, Portal, Select, 
    createListCollection, InputGroup,
    Heading
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuSearch, LuRotateCcw, LuEye, LuArrowLeft } from "react-icons/lu";
import { PaymentServices } from "@services/payment.service";
import { 
    PaginationItems, 
    PaginationNextTrigger, 
    PaginationPrevTrigger, 
    PaginationRoot 
} from "@components/ui/pagination";
import type { Payment, TransactionsListProps } from "@type/payment.type";

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
    const [semesterFilter, setSemesterFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data: response, isLoading, isError, refetch } = useQuery({
        queryKey: ["payments", currentPage, searchQuery, statusFilter, typeFilter, sessionFilter, levelFilter, semesterFilter, programTypeId],
        queryFn: () => PaymentServices.getPayments(
            currentPage, 
            ITEMS_PER_PAGE, 
            searchQuery, 
            statusFilter, 
            typeFilter, 
            sessionFilter,
            levelFilter,
            semesterFilter
        ),
    });

    const payments = response?.data || [];
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

    const semesterCollection = useMemo(() => {
        const semesters = Array.from(new Set(payments.map(p => p.semester)));
        return createListCollection({
            items: [
                { label: "All Semesters", value: "" },
                ...semesters.map(s => ({ label: s, value: s }))
            ]
        });
    }, [payments]);

    const statusCollection = createListCollection({
        items: [
            { label: "All Statuses", value: "" },
            { label: "Paid", value: "PAID" },
            { label: "Pending", value: "PENDING" },
            { label: "Failed", value: "FAILED" },
        ]
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <Box p="6">
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
                            color="#1D7AD9"
                            _hover={{ bg: "transparent", color: "blue.500" }}
                        >
                            <LuArrowLeft /> Back to Summary
                        </Button>
                        <Heading size="lg" fontWeight="bold" color="fg.muted">
                            {programTypeName || "All"} Transactions
                        </Heading>
                        <Text fontSize="sm" color="fg.muted">Detailed transaction history</Text>
                    </Box>
                    <Button 
                        bg="#1D7AD9" 
                        color="white" 
                        borderRadius="md" 
                        fontWeight="bold" 
                        fontSize="sm" 
                        px="5" 
                        py="2.5" 
                        onClick={() => refetch()} 
                        disabled={isLoading}
                        _hover={{ bg: "blue.700" }}
                    >
                        <LuRotateCcw /> Refresh
                    </Button>
                </Flex>

                {/* Filters Row */}
                <Flex gap="4" flexWrap="wrap" bg="bg.subtle" p="4" borderRadius="md" border="1px solid" borderColor="border.muted">
                    <InputGroup flex="1" minW="250px" startElement={<LuSearch color="#94a3b8" />}>
                        <Input
                            placeholder="Search by reference or ID..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            bg="white"
                            fontSize="sm"
                            borderRadius="md"
                            _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                        />
                    </InputGroup>

                    <Select.Root 
                        collection={statusCollection} 
                        size="sm" 
                        width="180px"
                        value={[statusFilter]}
                        onValueChange={(e) => setStatusFilter(e.value[0])}
                    >
                        <Select.Control>
                            <Select.Trigger bg="white" borderRadius="md">
                                <Select.ValueText placeholder="Status" />
                            </Select.Trigger>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {statusCollection.items.map(item => (
                                        <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Select.Root 
                        collection={typeFilter === "" ? createListCollection({ items: [{ label: "All Types", value: "" }] }) : typeCollection} 
                        size="sm" 
                        width="200px"
                        value={[typeFilter]}
                        onValueChange={(e) => setTypeFilter(e.value[0])}
                    >
                        {/* Fallback for typeCollection if empty */}
                        <Select.Control>
                            <Select.Trigger bg="white" borderRadius="md">
                                <Select.ValueText placeholder="Payment Type" />
                            </Select.Trigger>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {(typeCollection.items.length > 0 ? typeCollection : createListCollection({ items: [{ label: "All Types", value: "" }] })).items.map(item => (
                                        <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Select.Root 
                        collection={sessionCollection} 
                        size="sm" 
                        width="150px"
                        value={[sessionFilter]}
                        onValueChange={(e) => setSessionFilter(e.value[0])}
                    >
                        <Select.Control>
                            <Select.Trigger bg="white" borderRadius="md">
                                <Select.ValueText placeholder="Session" />
                            </Select.Trigger>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {sessionCollection.items.map(item => (
                                        <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Select.Root 
                        collection={levelCollection} 
                        size="sm" 
                        width="120px"
                        value={[levelFilter]}
                        onValueChange={(e) => setLevelFilter(e.value[0])}
                    >
                        <Select.Control>
                            <Select.Trigger bg="white" borderRadius="md">
                                <Select.ValueText placeholder="Level" />
                            </Select.Trigger>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {levelCollection.items.map(item => (
                                        <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Select.Root 
                        collection={semesterCollection} 
                        size="sm" 
                        width="150px"
                        value={[semesterFilter]}
                        onValueChange={(e) => setSemesterFilter(e.value[0])}
                    >
                        <Select.Control>
                            <Select.Trigger bg="white" borderRadius="md">
                                <Select.ValueText placeholder="Semester" />
                            </Select.Trigger>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {semesterCollection.items.map(item => (
                                        <Select.Item item={item} key={item.value}>{item.label}</Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        borderRadius="md"
                        color="red.500"
                        fontWeight="bold"
                        onClick={() => {
                            setStatusFilter("");
                            setTypeFilter("");
                            setSessionFilter("");
                            setLevelFilter("");
                            setSemesterFilter("");
                            setSearchQuery("");
                        }}
                    >
                        Clear Filters
                    </Button>
                </Flex>

                {/* Table Container */}
                <Box bg="white" borderRadius="md" border="1px solid" borderColor="border.muted" overflow="hidden" shadow="none">
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
                            <Table.Header bg="gray.50">
                                <Table.Row>
                                    <Table.ColumnHeader color="fg.muted">DATE</Table.ColumnHeader>
                                    <Table.ColumnHeader color="fg.muted">REFERENCE</Table.ColumnHeader>
                                    <Table.ColumnHeader color="fg.muted">TYPE</Table.ColumnHeader>
                                    <Table.ColumnHeader color="fg.muted">AMOUNT</Table.ColumnHeader>
                                    <Table.ColumnHeader color="fg.muted">SESSION/LEVEL</Table.ColumnHeader>
                                    <Table.ColumnHeader color="fg.muted">STATUS</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="right"></Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {payments.map((payment: Payment) => (
                                    <Table.Row key={payment.id} _hover={{ bg: "gray.50" }}>
                                        <Table.Cell fontSize="xs" fontWeight="medium">
                                            {formatDate(payment.createdAt)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text fontWeight="bold" fontSize="xs">{payment.reference}</Text>
                                            <Text fontSize="2xs" color="fg.subtle">ID: {payment.studentId.slice(0, 8)}...</Text>
                                        </Table.Cell>
                                        <Table.Cell fontSize="xs">
                                            <Text fontWeight="medium">{payment.type.replace(/_/g, " ")}</Text>
                                            <Text fontSize="2xs" color="fg.subtle">{payment.paymentChannel}</Text>
                                        </Table.Cell>
                                        <Table.Cell fontWeight="bold" color="accent" fontSize="xs">
                                            {formatCurrency(payment.amount)}
                                        </Table.Cell>
                                        <Table.Cell fontSize="xs">
                                            <Text fontWeight="medium">{payment.session}</Text>
                                            <Text fontSize="2xs" color="fg.subtle">{payment.level} - {payment.semester}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <StatusBadge status={payment.status} />
                                        </Table.Cell>
                                        <Table.Cell textAlign="right">
                                            <Button 
                                                variant="ghost" 
                                                size="xs"
                                                borderRadius="md"
                                                color="#1D7AD9"
                                                fontWeight="bold"
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
        </Box>
    );
};

export default TransactionsList;