import { useMemo } from "react";
import { Download, FileX } from "lucide-react";
import { PaymentServices } from "@services/payment.service";
import { 
    Box, 
    Table, 
    EmptyState, 
    VStack, 
    Flex, 
    Heading, 
    Button, 
    Spinner, 
    Text 
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

interface PaymentsSummaryViewProps {
    onViewAllRevenue: (programTypeId: string, programTypeName: string) => void;
}

interface ProgramTypeSummary {
    id: string;
    name: string;
    code: string;
    totalAmount: string;
    totalPayments: number;
    accessFee: { total: string; count: number; amount: number; average: string | number };
    idCardFee: { total: string; count: number; amount: number; average: string | number };
    transcriptFee?: { total: string; count: number; amount: number; average: string | number };
    otherPayments: { total: string; count: number; amount: number };
}

const PaymentsSummaryView = ({ onViewAllRevenue }: PaymentsSummaryViewProps) => {
    const { data: summaryResponse, isLoading: summaryLoading, isError } = useQuery({
        queryKey: ["payments-summary"],
        queryFn: () => PaymentServices.getPaymentsSummary(),
    });

    const programTypeList = useMemo(() => {
        if (!summaryResponse?.success) return [];
        const programTypes: Record<string, ProgramTypeSummary> = summaryResponse.data.summary.programTypes;
        return Object.values(programTypes);
    }, [summaryResponse]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
        }).format(amount);
    };

    return (
        <Box p="6">
            <Flex direction="column" gap="6">
                {/* Header */}
                <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                        <Heading size="lg" fontWeight="bold" color="fg.muted">Payments Overview</Heading>
                        <Text fontSize="sm" color="fg.muted">Revenue summary across different programme types</Text>
                    </Box>
                    <Button bg="#1D7AD9" color="white" borderRadius="md" fontWeight="bold" fontSize="sm" px="5" py="2.5" _hover={{ bg: "blue.700" }}>
                        <Download size={16} /> Export Summary
                    </Button>
                </Flex>

                {/* Table Container */}
                <Box bg="white" borderRadius="md" border="1px solid" borderColor="border.muted" overflow="hidden" shadow="none">
                    <Table.Root size="sm" variant="line">
                        <Table.Header bg="gray.50">
                            <Table.Row>
                                <Table.ColumnHeader color="fg.muted">S/N</Table.ColumnHeader>
                                <Table.ColumnHeader color="fg.muted">PROGRAMME TYPE</Table.ColumnHeader>
                                <Table.ColumnHeader color="fg.muted">ACCESS FEE</Table.ColumnHeader>
                                <Table.ColumnHeader color="fg.muted">ID CARD FEE</Table.ColumnHeader>
                                <Table.ColumnHeader color="fg.muted">TRANSCRIPT FEE</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="right"></Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {summaryLoading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="20">
                                        <Flex direction="column" alignItems="center" justify="center" gap="4">
                                            <Spinner size="xl" color="accent" />
                                            <Text color="fg.muted">Loading summary data...</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : isError || !summaryResponse?.success ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="20">
                                        <Flex justify="center">
                                            <Text color="red.500">Failed to load revenue data. Please try again.</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : programTypeList.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} py="20">
                                        <EmptyState.Root>
                                            <EmptyState.Content>
                                                <EmptyState.Indicator>
                                                    <FileX />
                                                </EmptyState.Indicator>
                                                <VStack textAlign="center">
                                                    <EmptyState.Title>No Payment Data Found</EmptyState.Title>
                                                    <EmptyState.Description>
                                                        There are currently no recorded payments for any programme type.
                                                    </EmptyState.Description>
                                                </VStack>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                programTypeList.map((pt, index) => (
                                    <Table.Row key={pt.id} _hover={{ bg: "gray.50" }}>
                                        <Table.Cell fontSize="xs" fontWeight="medium">{index + 1}</Table.Cell>
                                        <Table.Cell fontSize="sm" fontWeight="bold">{pt.name}</Table.Cell>
                                        <Table.Cell fontSize="sm" fontWeight="medium" color="fg.muted">
                                            {formatCurrency(pt.accessFee?.amount ?? 0)}
                                        </Table.Cell>
                                        <Table.Cell fontSize="sm" fontWeight="medium" color="fg.muted">
                                            {formatCurrency(pt.idCardFee?.amount ?? 0)}
                                        </Table.Cell>
                                        <Table.Cell fontSize="sm" fontWeight="medium" color="fg.muted">
                                            {formatCurrency(0)} {/* Transcript needs separate fetch or API update */}
                                        </Table.Cell>
                                        <Table.Cell textAlign="right">
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                borderRadius="md"
                                                color="#1D7AD9"
                                                fontWeight="bold"
                                                onClick={() => onViewAllRevenue(pt.id, pt.name)}
                                            >
                                                View Details
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Flex>
        </Box>
    );
};

export default PaymentsSummaryView;