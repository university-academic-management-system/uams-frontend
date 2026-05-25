import { Badge, Button, Flex, Heading, Input, Skeleton, Stack, Table, Text, Field, Select, Portal, Alert, List, useSelectContext, DownloadTrigger } from "@chakra-ui/react"
import { useTranscripts, useInitializePayment, usePaymentDetails } from "@hooks/registration.hook"
import { EmptyStateView } from "@components/shared/empty-state"
import { LuFileDown, LuFileText, LuPlus } from "react-icons/lu"
import { useState } from "react"
import { createListCollection } from "@chakra-ui/react"
import { CloseButton, Dialog } from "@chakra-ui/react"
import { useCreateTranscriptForm } from "@forms/transcript.form"
import type { CreateTranscriptFormData } from "@schemas/transcript.schema"
import { Controller } from "react-hook-form"
import { PaymentType, type PaymentDetails } from "@type/registration.type"
import { formatCurrency, toTitleCase } from "@utils/function.util"
import { useLocation } from "react-router"

const deliveryMethods = createListCollection({
    items: [
        { label: "Digital Delivery", value: "DIGITAL_DELIVERY" },
        { label: "Courier Service", value: "COURIER_SERVICE" },
        { label: "Physical Pickup", value: "PHYSICAL_PICKUP" },
    ],
})

const TranscriptsTabsContent = () => {
    const [page] = useState(1)
    const { data, isLoading } = useTranscripts({ page, limit: 10 })

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "yellow"
            case "IN_PROGRESS": return "blue"
            case "DELIVERED": return "green"
            case "CANCELLED": return "red"
            case "READY": return "purple"
            default: return "gray"
        }
    }

    if (isLoading) {
        return (
            <Stack gap="4">
                <Skeleton h="10" />
                <Skeleton h="64" />
            </Stack>
        )
    }

    return (
        <Stack gap="4">
            {(data?.transcripts?.length || 0) > 0 && <Flex justify={"space-between"}>
                <Heading>Transcripts&nbsp;Applications</Heading>
                <CreateTranscriptDialog />
            </Flex>}

            {data?.transcripts.length === 0 ? (
                <EmptyStateView
                    icon={<LuFileText />}
                    title="No transcripts found"
                    description="You haven't requested any transcripts yet."
                    action={<CreateTranscriptDialog />}
                />
            ) : (
                <Table.ScrollArea maxW={{ base: "xl", md: "full" }} bg="bg" border="xs" borderColor="border.muted" rounded="md" overflow="hidden">
                    <Table.Root size="lg" variant="outline" stickyHeader>
                        <Table.Header>
                            <Table.Row bg="bg.muted">
                                <Table.ColumnHeader>Reference</Table.ColumnHeader>
                                <Table.ColumnHeader>Purpose</Table.ColumnHeader>
                                <Table.ColumnHeader>Delivery Method</Table.ColumnHeader>
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader>Payment status</Table.ColumnHeader>
                                <Table.ColumnHeader>Date </Table.ColumnHeader>
                                <Table.ColumnHeader>Receipt</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {data?.transcripts.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell fontWeight="medium">{item.reference}</Table.Cell>
                                    <Table.Cell>{item.purpose}</Table.Cell>
                                    <Table.Cell>
                                        {item.deliveryMethod.replace("_", " ")}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge colorPalette={getStatusColor(item.status)}>
                                            {toTitleCase(item.status)}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <DownloadReceiptcriptButton />
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
            )}
        </Stack >
    )
}


const data = async () => {
    const res = await fetch("https://picsum.photos/200/300")
    return res.blob()
}


const DownloadReceiptcriptButton = () => {

    return (
        <DownloadTrigger
            data={data}
            fileName="sample.jpg"
            mimeType="image/jpeg"
            asChild
        >
            <Button variant="ghost" size="sm" colorPalette="accent">
                <LuFileDown /> Download
            </Button>
        </DownloadTrigger>
    )
}


const CreateTranscriptDialog = () => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useCreateTranscriptForm()
    const path = useLocation().pathname;

    const { data: paymentDetails, isLoading } = usePaymentDetails(PaymentType.TRANSCRIPT_REQUEST_FEE);

    const { mutate: initializePayment, isPending: isInitializing } = useInitializePayment({
        onSuccess: (response) => {
            window.location.href = response.authorization_url;
        }
    });


    const onSubmit = (data: CreateTranscriptFormData) => {
        initializePayment({
            type: PaymentType.TRANSCRIPT_REQUEST_FEE,
            redirectUrl: `${window.location.origin}/students${path}?tab=transcripts`,
            address: data.address,
            purpose: data.purpose,
            deliveryMethod: data.deliveryMethod
        })
    }

    if (isLoading) {
        return <Skeleton w="full" h="full" />
    }


    return (
        <Dialog.Root role="alertdialog" size="lg" placement={"center"} onOpenChange={(d) => {
            if (!d.open) {
                reset()
            }
        }}>
            <Dialog.Trigger asChild>
                <Button variant="solid" colorPalette="accent" size="xl">
                    <LuPlus /> Request Transcript
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Dialog.Header>
                                <Dialog.Title>Request a transcript</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body spaceY="4">
                                <Alert.Root status="info">
                                    <Alert.Indicator />
                                    <Stack>
                                        <Alert.Title>Payment Information</Alert.Title>
                                        <Alert.Content>
                                            <List.Root>
                                                <List.Item>
                                                    Fill in the required details below.
                                                </List.Item>
                                                <List.Item>
                                                    Upon submitting the form &#x2010; you&apos;ll be redirected to Paystack to complete payment.
                                                </List.Item>
                                                <List.Item>
                                                    Amount depends on your chosen delivery method (hard copy / electronic).
                                                </List.Item>
                                                <List.Item>
                                                    Additional courier or postage charges may apply for hard-copy delivery.
                                                </List.Item>
                                                <List.Item>
                                                    Electronic delivery is free.
                                                </List.Item>
                                            </List.Root>
                                        </Alert.Content>
                                    </Stack>
                                </Alert.Root>

                                <Stack gap="4" colorPalette={"accent"}>
                                    <Field.Root invalid={!!errors.purpose}>
                                        <Field.Label>Purpose of Application</Field.Label>
                                        <Input
                                            placeholder="e.g. Admission processing"
                                            {...register("purpose")}
                                            disabled={isInitializing}
                                            size="xl"
                                        />
                                        <Field.ErrorText>{errors.purpose?.message}</Field.ErrorText>
                                    </Field.Root>

                                    <Controller
                                        control={control}
                                        name="deliveryMethod"
                                        render={({ field }) => (
                                            <Field.Root invalid={!!errors.deliveryMethod}>
                                                <Select.Root
                                                    collection={deliveryMethods}
                                                    value={field.value ? [field.value] : []}
                                                    onValueChange={(e) => field.onChange(e.value[0])}
                                                    disabled={isInitializing}
                                                    size="lg"
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Label>Delivery Method</Select.Label>
                                                    <Select.Control>
                                                        <Select.Trigger>
                                                            <Select.ValueText placeholder="Select method" w="full" />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <SelectedAmount paymentDetails={paymentDetails || []} />
                                                            <Select.Indicator />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Portal>
                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {deliveryMethods.items.map((method) => (
                                                                    <Select.Item item={method} key={method.value}>
                                                                        <Flex w="full" justify={"space-between"}>
                                                                            {method.label}
                                                                            <Text color="accent">
                                                                                {formatCurrency((paymentDetails?.find((item) => item.deliveryMethod === method.value)?.total || 0)) || "N/A"}
                                                                            </Text>
                                                                        </Flex>
                                                                        <Select.ItemIndicator />
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Content>
                                                        </Select.Positioner>
                                                    </Portal>
                                                </Select.Root>
                                                <Field.ErrorText>{errors.deliveryMethod?.message}</Field.ErrorText>
                                            </Field.Root>
                                        )}
                                    />

                                    <Field.Root invalid={!!errors.address}>
                                        <Field.Label>Delivery Address</Field.Label>
                                        <Input
                                            placeholder="Enter full address"
                                            {...register("address")}
                                            disabled={isInitializing}
                                            size="xl"
                                        />
                                        <Field.ErrorText>{errors.address?.message}</Field.ErrorText>
                                    </Field.Root>
                                </Stack>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button size="xl" variant="outline" disabled={isInitializing}>Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button size="xl" type="submit" loading={isInitializing} colorPalette="accent">Submit Request</Button>
                            </Dialog.Footer>
                        </form>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}


const SelectedAmount = ({ paymentDetails }: { paymentDetails: PaymentDetails[] }) => {
    const d = useSelectContext();
    return d.value?.length ? <Text color="accent">
        {formatCurrency((paymentDetails?.find((item) => item.deliveryMethod === d.value[0])?.total || 0)) || "N/A"}
    </Text> : null
}
export default TranscriptsTabsContent;
