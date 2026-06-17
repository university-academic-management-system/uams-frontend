import { useState, useEffect, useCallback } from "react";
import { toaster } from "@components/ui/toaster";
import { ProgramServices } from "@services/program.service";
import { PaymentServices } from "@services/payment.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePaymentConfigForm } from "@forms/payment.form";
import { Box, Button, Flex, Text, Field, Input, Stack, Tabs } from "@chakra-ui/react";
import type { PaymentConfigData } from "@schemas/payment.schema";

type FieldName = string;

interface SubComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  isEditing: boolean;
}



// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const PaystackCredentials = ({ form, isEditing }: SubComponentProps) => (
  <Box p="6" borderRadius="md" border="xs" borderColor="border.muted" mt="12">
    <Text fontWeight="bold" mb="4">Paystack API Credentials</Text>
    <Flex gap="6" w="full" direction={{ base: "column", md: "row" }}>
      <Field.Root flex="1">
        <Field.Label>Public Key</Field.Label>
        <Input
          {...form.register("paystack_public_key")}
          readOnly={!isEditing}
          placeholder="pk_test_..."
          size="xl"
          bg={isEditing ? "white" : "transparent"}
        />
      </Field.Root>
      <Field.Root flex="1">
        <Field.Label>Secret Key</Field.Label>
        <Input
          {...form.register("paystack_secret_key")}
          readOnly={!isEditing}
          placeholder="sk_test_..."
          size="xl"
          bg={isEditing ? "white" : "transparent"}
        />
      </Field.Root>
    </Flex>
  </Box>
)

interface FeeSectionProps extends SubComponentProps {
  title: string;
  splitKeyField: FieldName;
  baseFeeField: FieldName;
  merchantFeeField: FieldName;
  splitKeyReadOnly?: boolean;
}

const FeeSection = ({
  form, isEditing, title,
  splitKeyField, baseFeeField, merchantFeeField,
  splitKeyReadOnly = false,
}: FeeSectionProps) => (
  <Box p="6" borderRadius="md" border="xs" borderColor="border.muted">
    <Text fontWeight="bold" mb="4">{title}</Text>
    <Stack gap="5">
      <Field.Root invalid={!!form.formState.errors[splitKeyField]}>
        <Field.Label>Split Key</Field.Label>
        <Input
          {...form.register(splitKeyField)}
          placeholder="SPL_xxxxxxxxxx"
          readOnly={!isEditing || splitKeyReadOnly}
          size="xl"
          bg={isEditing && !splitKeyReadOnly ? "white" : "transparent"}
        />
        <Field.ErrorText>{form.formState.errors[splitKeyField]?.message}</Field.ErrorText>
      </Field.Root>
      <Field.Root invalid={!!form.formState.errors[baseFeeField]}>
        <Field.Label>Base Amount</Field.Label>
        <Input
          type="number"
          {...form.register(baseFeeField, { valueAsNumber: true })}
          readOnly={!isEditing}
          size="xl"
          bg={isEditing ? "white" : "transparent"}
        />
        <Field.ErrorText>{form.formState.errors[baseFeeField]?.message}</Field.ErrorText>
      </Field.Root>
      <Field.Root invalid={!!form.formState.errors[merchantFeeField]}>
        <Field.Label>Merchant Fee</Field.Label>
        <Input
          type="number"
          {...form.register(merchantFeeField, { valueAsNumber: true })}
          readOnly={!isEditing}
          size="xl"
          bg={isEditing ? "white" : "transparent"}
        />
        <Field.ErrorText>{form.formState.errors[merchantFeeField]?.message}</Field.ErrorText>
      </Field.Root>
    </Stack>
  </Box>
)

interface DeliveryCardProps extends SubComponentProps {
  title: string;
  description: string;
  baseFeeField: FieldName;
  merchantFeeField: FieldName;
}

const DeliveryOptionCard = ({ form, isEditing, title, description, baseFeeField, merchantFeeField }: DeliveryCardProps) => (
  <Box bg="white" p="5" borderRadius="md" border="xs" borderColor="border.muted">
    <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="1">{title}</Text>
    <Text fontSize="xs" color="fg.subtle" mb="4">{description}</Text>
    <Stack gap="4">
      <Field.Root>
        <Field.Label fontSize="xs">Base Fee</Field.Label>
        <Input
          type="number"
          {...form.register(baseFeeField, { valueAsNumber: true })}
          readOnly={!isEditing}
          size="xl"
        />
      </Field.Root>
      <Field.Root>
        <Field.Label fontSize="xs">Merchant Fee</Field.Label>
        <Input
          type="number"
          {...form.register(merchantFeeField, { valueAsNumber: true })}
          readOnly={!isEditing}
          size="xl"
        />
      </Field.Root>
    </Stack>
  </Box>
)

const TranscriptOptions = ({ form, isEditing }: SubComponentProps) => (
  <Box p="6" borderRadius="md" border="xs" borderColor="border.muted" gridColumn={{ base: "1", lg: "1 / -1" }}>
    <Text fontWeight="bold" mb="6">Transcript Delivery Options</Text>

    <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap="6">
      <DeliveryOptionCard
        form={form}
        isEditing={isEditing}
        title="Digital Delivery"
        description="Email delivery"
        baseFeeField="transcript_digital_fee"
        merchantFeeField="transcript_digital_merchant_fee"
      />
      <DeliveryOptionCard
        form={form}
        isEditing={isEditing}
        title="Courier Service"
        description="Doorstep delivery"
        baseFeeField="transcript_courier_fee"
        merchantFeeField="transcript_courier_merchant_fee"
      />
      <DeliveryOptionCard
        form={form}
        isEditing={isEditing}
        title="Physical Pickup"
        description="Pick up at registry"
        baseFeeField="transcript_pickup_fee"
        merchantFeeField="transcript_pickup_merchant_fee"
      />
    </Box>
  </Box>
)

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Main component — only fetches programmes and renders tabs
// ---------------------------------------------------------------------------

const PaymentSettingsTab = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: programmes, isLoading } = useQuery({
    queryKey: ["programmes"],
    queryFn: ProgramServices.getProgramTypes,
  });

  // Derive active tab: user selection or first programme
  const activeTab = selectedId ?? programmes?.[0]?.id ?? "";

  if (isLoading) {
    return (
      <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" p={{ base: "6", md: "10" }}>
        <Text fontSize="xl" fontWeight="bold">Payment Settings</Text>
        <Text mt="4" color="gray.500">Loading programmes...</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" p={{ base: "6", md: "10" }} colorPalette="accent">
      <Text fontSize="xl" fontWeight="bold">Payment Settings</Text>

      <Tabs.Root
        mt="4"
        variant="enclosed"
        value={activeTab}
        onValueChange={(details) => setSelectedId(details.value)}
      >
        <Tabs.List w="fit">
          {programmes?.map((p) => (
            <Tabs.Trigger value={p.id} key={p.id}>{p.name}</Tabs.Trigger>
          ))}
        </Tabs.List>

        {programmes?.map((p) => (
          <Tabs.Content value={p.id} key={p.id}>
            <ProgrammeContent programmeId={p.id} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
};

// ---------------------------------------------------------------------------
// Per-programme content — self-contained query, form, mutation
// ---------------------------------------------------------------------------

const ProgrammeContent = ({ programmeId }: { programmeId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: configData } = useQuery({
    queryKey: ["paymentConfig", programmeId],
    queryFn: () => PaymentServices.getPaymentConfig(programmeId),
    enabled: !!programmeId,
  });

  const form = usePaymentConfigForm();
  const annualAccessSplitKey = form.watch("annual_access_split_key");

  // Mirror annual_access_split_key → department_annual_access_split_key (read-only)
  useEffect(() => {
    form.setValue("department_annual_access_split_key", annualAccessSplitKey);
  }, [annualAccessSplitKey, form]);

  // Populate form when config data arrives
  useEffect(() => {
    if (!configData) return;
    const d = configData.data ?? configData;
    const s = d.paymentAmountSettings ?? {};
    const annual = s.ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES ?? {};
    const transcript = s.TRANSCRIPT_REQUEST_FEE ?? {};
    const idCard = s.ID_CARD_FEE ?? {};
    const delivery = transcript.deliveryOptions ?? {};

    form.reset({
      paystack_public_key: d.paystackConfig?.publicKey ?? "",
      paystack_secret_key: d.paystackConfig?.secretKey ?? "",
      annual_access_fee: annual.annualAccess?.baseFee ?? 0,
      annual_access_merchant_fee: annual.annualAccess?.merchantFee ?? 0,
      annual_access_split_key: annual.splitKey || "",
      department_annual_access_dues: annual.departmentalDues?.baseFee ?? 0,
      department_annual_access_merchant_fee: annual.departmentalDues?.merchantFee ?? 0,
      department_annual_access_split_key: annual.splitKey || "",
      id_card_payment: idCard.baseFee ?? 0,
      id_card_merchant_fee: idCard.merchantFee ?? 0,
      id_card_split_key: idCard.splitKey || "",
      transcript_fee: transcript.baseFee ?? 0,
      transcript_merchant_fee: transcript.merchantFee ?? 0,
      transcript_split_key: transcript.splitKey || "",
      transcript_digital_fee: delivery.DIGITAL_DELIVERY?.baseFee ?? 0,
      transcript_digital_merchant_fee: delivery.DIGITAL_DELIVERY?.merchantFee ?? 0,
      transcript_courier_fee: delivery.COURIER_SERVICE?.baseFee ?? 0,
      transcript_courier_merchant_fee: delivery.COURIER_SERVICE?.merchantFee ?? 0,
      transcript_pickup_fee: delivery.PHYSICAL_PICKUP?.baseFee ?? 0,
      transcript_pickup_merchant_fee: delivery.PHYSICAL_PICKUP?.merchantFee ?? 0,
    });
    form.trigger();
  }, [configData, form]);

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => PaymentServices.updatePaymentConfig(payload),
    onSuccess: () => {
      toaster.success({ title: "Payment config updated successfully" });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["paymentConfig", programmeId] });
    },
  });

  const onSubmit = useCallback((v: PaymentConfigData) => {
    const payload = {
      type: "payments",
      value: {
        paystackPublicKey: v.paystack_public_key?.trim(),
        paystackSecretKey: v.paystack_secret_key?.trim(),
        programmeId,
        paymentAmountSettings: {
          ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES: {
            annualAccess: {
              baseFee: v.annual_access_fee,
              merchantFee: v.annual_access_merchant_fee,
            },
            departmentalDues: {
              baseFee: v.department_annual_access_dues,
              merchantFee: v.department_annual_access_merchant_fee,
            },
            splitKey: v.annual_access_split_key?.trim(),
          },
          TRANSCRIPT_REQUEST_FEE: {
            splitKey: v.transcript_split_key?.trim(),
            deliveryOptions: {
              DIGITAL_DELIVERY: {
                baseFee: v.transcript_digital_fee,
                merchantFee: v.transcript_digital_merchant_fee,
                description: "Email delivery",
              },
              COURIER_SERVICE: {
                baseFee: v.transcript_courier_fee,
                merchantFee: v.transcript_courier_merchant_fee,
                description: "Doorstep delivery",
              },
              PHYSICAL_PICKUP: {
                baseFee: v.transcript_pickup_fee,
                merchantFee: v.transcript_pickup_merchant_fee,
                description: "Pick up at registry",
              },
            },
          },
          ID_CARD_FEE: {
            baseFee: v.id_card_payment,
            merchantFee: v.id_card_merchant_fee,
            splitKey: v.id_card_split_key?.trim(),
          },
        },
      },
    };
    updateMutation.mutate(payload);
  }, [programmeId, updateMutation]);

  return (
    <>
      <Flex align="center" gap="4" my="4">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          disabled={updateMutation.isPending}
          colorPalette={isEditing ? "red" : "gray"}
          variant={isEditing ? "solid" : "subtle"}
          size="xl"
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
        {isEditing && (
          <Button
            form={`payment-settings-form-${programmeId}`}
            type="submit"
            loading={updateMutation.isPending}
            loadingText="Saving..."
            disabled={updateMutation.isPending || !form.formState.isValid}
            colorPalette="accent"
            size="xl"
          >
            Save Changes
          </Button>
        )}
      </Flex>

      <form onSubmit={form.handleSubmit(onSubmit)} id={`payment-settings-form-${programmeId}`}>
        <PaystackCredentials form={form} isEditing={isEditing} />

        <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mt="4">
          <FeeSection
            form={form}
            isEditing={isEditing}
            title="Annual Access Fee"
            splitKeyField="annual_access_split_key"
            baseFeeField="annual_access_fee"
            merchantFeeField="annual_access_merchant_fee"
          />
          <FeeSection
            form={form}
            isEditing={isEditing}
            title="Annual Department Dues"
            splitKeyField="department_annual_access_split_key"
            baseFeeField="department_annual_access_dues"
            merchantFeeField="department_annual_access_merchant_fee"
            splitKeyReadOnly
          />
          <FeeSection
            form={form}
            isEditing={isEditing}
            title="ID Card Payment"
            splitKeyField="id_card_split_key"
            baseFeeField="id_card_payment"
            merchantFeeField="id_card_merchant_fee"
          />
          <TranscriptOptions form={form} isEditing={isEditing} />
        </Box>
      </form>
    </>
  );
};

export default PaymentSettingsTab;
