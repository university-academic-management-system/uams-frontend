import { Box, Flex, Text, Heading, Icon, Spinner, Table } from "@chakra-ui/react";
import { Download } from "lucide-react";
import { PaymentHook } from "@hooks/payment.hook";
import type { ProgramRevenue, ProgramTypeSummary } from "@type/payment.type";

interface PaymentsSummaryViewProps {
    onViewAllRevenue: (programTypeId: string, programTypeName: string) => void;
}

const PaymentsSummaryView = ({ onViewAllRevenue }: PaymentsSummaryViewProps) => {
    const { data, isLoading } = PaymentHook.usePayments();

    const revenueData: ProgramRevenue[] = data?.success
        ? Object.values(data.data.summary.programTypes).map((pt: ProgramTypeSummary) => ({
              programTypeId: pt.id,
              programType: pt.name,
              accessFee: pt.accessFee.amount,
              idCardFee: pt.idCardFee.amount,
              transcriptFee: pt.transcriptFee.amount,
          }))
        : [];

    const formatCurrency = (amount: number) =>
        "₦" + new Intl.NumberFormat("en-NG").format(amount);

    /* ─── Shared th styles ─── */
    const thStyle = {
        px: "8",
        py: "5",
        fontSize: "xs",
        fontWeight: "bold",
        color: "#64748b",
        textTransform: "uppercase" as const,
        letterSpacing: "wider",
    };

    return (
        <Box minH="100vh" bg="#F8FAFC">
            <Box maxW="1400px" mx="auto" py="2" px="2">
                {/* Header */}
                <Flex justify="space-between" align="center" mb="8">
                    <Heading as="h1" size="2xl" fontWeight="bold" fontSize="24px" fontFamily="sans-serif" color="#0f172a">
                        Payments History
                    </Heading>
                    <Flex
                        as="button"
                        align="center"
                        gap="2"
                        bg="#1D7AD9"
                        color="white"
                        px="5"
                        py="2.5"
                        borderRadius="lg"
                        fontSize="sm"
                        fontWeight="bold"
                        boxShadow="0 10px 15px -3px rgba(59,130,246,0.2)"
                        _hover={{ bg: "#1d4ed8" }}
                        transition="all 0.2s"
                        border="none"
                        cursor="pointer"
                    >
                        <Icon as={Download} boxSize="18px" />
                        Export
                    </Flex>
                </Flex>

                {/* Table */}
                <Box
                    bg="white"
                    borderRadius="xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="#e2e8f0"
                    overflow="hidden"
                >
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row bg="#f8fafc">
                                <Table.ColumnHeader {...thStyle} w="16">S/N</Table.ColumnHeader>
                                <Table.ColumnHeader {...thStyle}>Program Types</Table.ColumnHeader>
                                <Table.ColumnHeader {...thStyle}>Access Fee</Table.ColumnHeader>
                                <Table.ColumnHeader {...thStyle}>ID Card Fee</Table.ColumnHeader>
                                <Table.ColumnHeader {...thStyle}>Transcript Fee</Table.ColumnHeader>
                                <Table.ColumnHeader {...thStyle} textAlign="right">Revenue</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {isLoading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} px="8" py="12" textAlign="center" color="#94a3b8">
                                        <Flex justify="center" align="center" gap="2">
                                            <Spinner size="sm" color="#94a3b8" />
                                            <Text>Loading revenue data...</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : revenueData.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} px="8" py="12" textAlign="center" color="#94a3b8">
                                        No program types found
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                revenueData.map((row, index) => (
                                    <Table.Row
                                        key={row.programTypeId}
                                        _hover={{ bg: "rgba(248,250,252,0.5)" }}
                                        transition="colors 0.15s"
                                    >
                                        <Table.Cell px="8" py="6" color="#64748b" fontWeight="medium">
                                            {index + 1}
                                        </Table.Cell>
                                        <Table.Cell px="8" py="6" fontWeight="bold" color="#334155">
                                            {row.programType}
                                        </Table.Cell>
                                        <Table.Cell px="8" py="6" fontWeight="bold" color="#64748b">
                                            {formatCurrency(row.accessFee)}
                                        </Table.Cell>
                                        <Table.Cell px="8" py="6" fontWeight="bold" color="#64748b">
                                            {formatCurrency(row.idCardFee)}
                                        </Table.Cell>
                                        <Table.Cell px="8" py="6" fontWeight="bold" color="#64748b">
                                            {formatCurrency(row.transcriptFee)}
                                        </Table.Cell>
                                        <Table.Cell px="8" py="6" textAlign="right">
                                            <Text
                                                as="button"
                                                onClick={() => onViewAllRevenue(row.programTypeId, row.programType)}
                                                color="#1D7AD9"
                                                fontWeight="bold"
                                                fontSize="xs"
                                                _hover={{ textDecoration: "underline" }}
                                                bg="transparent"
                                                border="none"
                                                cursor="pointer"
                                                textAlign="right"
                                            >
                                                View all<br />revenue
                                            </Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>
        </Box>
    );
};

export default PaymentsSummaryView;
