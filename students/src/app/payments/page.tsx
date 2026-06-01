import { Badge, Button, Flex, Skeleton, Stack, Table, Text, createListCollection, Portal, Select } from "@chakra-ui/react"
import { useGetPayments, usePaymentByReference } from "@hooks/payment.hook"
import { EmptyStateView } from "@components/shared/empty-state"
import { LuFileDown, LuHistory } from "react-icons/lu"
import { useCallback, useState } from "react"
import { formatCurrency, normalizeLevel, normalizeSemester, toTitleCase } from "@utils/function.util"
import { useReceiptStore } from "@stores/data.store"
import { useMe } from "@hooks/auth.hook"
import type { UserProfile } from "@type/auth.type"
import type { Payment } from "@type/payment.type"

const levels = createListCollection({
    items: [
        { label: "All Levels", value: "ALL" },
        { label: "100 Level", value: "L100" },
        { label: "200 Level", value: "L200" },
        { label: "300 Level", value: "L300" },
        { label: "400 Level", value: "L400" },
    ],
})

const semesters = createListCollection({
    items: [
        { label: "All Semesters", value: "ALL" },
        { label: "First Semester", value: "FIRST" },
        { label: "Second Semester", value: "SECOND" },
        { label: "Third Semester", value: "THIRD" },
    ],
})

const paymentTypes = createListCollection({
    items: [
        { label: "All Types", value: "ALL" },
        { label: "Access Fee & Dues", value: "ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES" },
        { label: "Transcript Fee", value: "TRANSCRIPT_REQUEST_FEE" },
        { label: "ID Card Fee", value: "ID_CARD_FEE" },
        { label: "SIWES Fee", value: "SIWES_FEE" },
    ],
})

const Payments = () => {
    const [page] = useState(1)
    const [level, setLevel] = useState("ALL")
    const [semester, setSemester] = useState("ALL")
    const [type, setType] = useState("ALL")

    const { data, isLoading } = useGetPayments({
        page,
        limit: 10,
        level: level === "ALL" ? undefined : level,
        semester: semester === "ALL" ? undefined : semester,
        type: type === "ALL" ? undefined : type,
    });

    if (isLoading) {
        return (
            <Stack gap="4">
                <Skeleton h="10" />
                <Skeleton h="64" />
            </Stack>
        )
    }

    return (
        <Stack gap="6">
            <Flex gap="4" wrap="wrap">
                <Select.Root
                    collection={levels}
                    value={[level]}
                    onValueChange={(e) => setLevel(e.value[0])}
                    size="lg"
                    bg="bg"
                    width="180px"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select Level" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {levels.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Select.Root
                    collection={semesters}
                    value={[semester]}
                    onValueChange={(e) => setSemester(e.value[0])}
                    size="lg"
                    bg="bg"
                    width="180px"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Select Semester" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {semesters.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                <Select.Root
                    collection={paymentTypes}
                    value={[type]}
                    onValueChange={(e) => setType(e.value[0])}
                    size="lg"
                    bg="bg"
                    width="220px"
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Payment Type" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {paymentTypes.items.map((item) => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Flex>

            {data?.data.length === 0 ? (
                <EmptyStateView
                    icon={<LuHistory />}
                    title="No payments found"
                    description="You haven't made any payments that match the selected filters."
                />
            ) : (
                <Table.ScrollArea border="xs" borderColor="border.muted" rounded="md" overflow="hidden">
                    <Table.Root size="lg" variant="outline" stickyHeader>
                        <Table.Header>
                            <Table.Row bg="bg.muted">
                                <Table.ColumnHeader>S/N</Table.ColumnHeader>
                                <Table.ColumnHeader>Reference</Table.ColumnHeader>
                                <Table.ColumnHeader>Type</Table.ColumnHeader>
                                <Table.ColumnHeader>Amount</Table.ColumnHeader>
                                <Table.ColumnHeader>Session/Level</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Date</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="right">Receipt</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data?.data.map((item, index) => (
                                <Table.Row key={item.id} bg="bg">
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell fontWeight="medium">{item.reference}</Table.Cell>
                                    <Table.Cell fontSize="sm">
                                        {toTitleCase(item.type.replace(/_/g, " "))}
                                    </Table.Cell>
                                    <Table.Cell fontWeight="semibold">
                                        {formatCurrency(item.amount)}
                                    </Table.Cell>
                                    <Table.Cell fontSize="sm">
                                        <Stack gap="0">
                                            <Text>{item.session}</Text>
                                            <Text color="fg.muted" fontSize="xs">{normalizeLevel(item.level)} Level - {normalizeSemester(item.semester)}</Text>
                                        </Stack>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge colorPalette={item.status === "PAID" ? "green" : "red"}>
                                            {item.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell fontSize="sm">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <DownloadReceiptButton reference={item.reference} />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            )}
        </Stack>
    )
}

const DownloadReceiptButton = ({ reference }: { reference: string }) => {
    const { init } = useReceiptStore((state) => state);
    const { isLoading, refetch } = usePaymentByReference(reference);
    const { data: me, isLoading: isLoadingMe } = useMe();

    const handleDownload = useCallback(async () => {
        const { data: newReceipt } = await refetch();

        const receiptData = {
            ...newReceipt,
            firstName: me?.studentProfile?.firstName || "",
            lastName: me?.studentProfile?.surname || "",
            otherName: me?.studentProfile?.otherName || "",
            registrationNo: me?.studentProfile?.registrationNo || "",
            matricNumber: me?.studentProfile?.matricNumber || "",
        } as unknown as Payment & Pick<NonNullable<UserProfile["studentProfile"]>, "firstName" | "surname" | "otherName" | "matricNumber" | "registrationNo">;

        init(receiptData);
    }, [refetch, me, init]);

    return (
        <Button
            disabled={isLoading || isLoadingMe || !reference}
            onClick={handleDownload}
            loading={isLoading || isLoadingMe}
            variant="ghost"
            size="sm"
            colorPalette="accent"
        >
            <LuFileDown /> Download
        </Button>
    )
}

export default Payments;
