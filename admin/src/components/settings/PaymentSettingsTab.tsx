import { useState, useEffect, useCallback } from "react";
import { toaster } from "@components/ui/toaster";
// import { AcademicServices } from "@services/academic.service";
import { ProgramServices } from "@services/program.service";
import { PaymentServices } from "@services/payment.service";
import { useAsync } from "react-use";
import { paymentConfigSchema, type PaymentConfigData } from "@schemas/payment.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Flex, Text, Field, Input, Stack } from "@chakra-ui/react";

const usePaymentConfigForm = () => {
  return useForm<PaymentConfigData>({
    mode: "onChange",
    resolver: zodResolver(paymentConfigSchema),
    defaultValues: {
      program_type_id: "",
      paystack_public_key: "",
      paystack_secret_key: "",
      annual_access_fee: 0,
      annual_access_merchant_fee: 0,
      annual_access_split_key: "",
      department_annual_access_dues: 0,
      department_annual_access_merchant_fee: 0,
      department_annual_access_split_key: "",
      id_card_payment: 0,
      id_card_merchant_fee: 0,
      id_card_split_key: "",
      transcript_fee: 0,
      transcript_merchant_fee: 0,
      transcript_split_key: "",
      transcript_digital_fee: 0,
      transcript_digital_merchant_fee: 0,
      transcript_courier_fee: 0,
      transcript_courier_merchant_fee: 0,
      transcript_pickup_fee: 0,
      transcript_pickup_merchant_fee: 0
    }
  })
}

const PaymentSettingsTab = () => {
  const [activeProgramType, setActiveProgramType] = useState<{id:string,name:string}>({id:"",name:""});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);


  const programTypes = useAsync(async () => {
      try {
        const typesData = await ProgramServices.getProgramTypes();
        const types = Array.isArray(typesData) ? typesData : (typesData as any)?.data || [];
        const activeTypes = types?.filter((type: any) => type.isActive) || [];
        if (activeTypes.length > 0) setActiveProgramType({ id: activeTypes[0].id, name: activeTypes[0].name });
        return activeTypes;
      } catch (err) {
        console.error("Failed to fetch program types:", err);
      }
  }, [])

  const getCredentials = useAsync(async () => {
    try {
      if(!activeProgramType.id) return null;
      const data = await PaymentServices.getPaymentConfig(activeProgramType.id);
      return data;
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      toaster.error({ title: "Failed to fetch credentials" });
      return null;
    }
  }, [activeProgramType.id]); 

  const paymentConfigForm = usePaymentConfigForm();
  const annualAccessSplitKey = paymentConfigForm.watch("annual_access_split_key");

  useEffect(() => {
      paymentConfigForm.setValue("department_annual_access_split_key", annualAccessSplitKey);
  }, [annualAccessSplitKey, paymentConfigForm]);

  useEffect(() => {
    if (getCredentials.value) {
      const data = getCredentials.value;
      paymentConfigForm.reset({
        program_type_id: data.metadata?.program_type_id,
        paystack_public_key: data.paystack_config?.public_key,
        paystack_secret_key: data.paystack_config?.secret_key,
        annual_access_fee: data.payment_amount_settings?.annual_access?.base_fee || 0,
        annual_access_merchant_fee: data.payment_amount_settings?.annual_access?.merchant_fee || 0,
        annual_access_split_key: data.payment_amount_settings?.annual_access?.split_key || "",
        department_annual_access_dues: data.payment_amount_settings?.department_annual_access?.base_fee || 0,
        department_annual_access_merchant_fee: data.payment_amount_settings?.department_annual_access?.merchant_fee || 0,
        department_annual_access_split_key: data.payment_amount_settings?.department_annual_access?.split_key || "",
        id_card_payment: data.payment_amount_settings?.id_card?.base_fee || 0,
        id_card_merchant_fee: data.payment_amount_settings?.id_card?.merchant_fee || 0,
        id_card_split_key: data.payment_amount_settings?.id_card?.split_key || "",
        transcript_fee: data.payment_amount_settings?.transcript?.base_fee || 0,
        transcript_merchant_fee: data.payment_amount_settings?.transcript?.merchant_fee || 0,
        transcript_split_key: data.payment_amount_settings?.transcript?.split_key || "",
        transcript_digital_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.digital_delivery?.base_amount || 0,
        transcript_digital_merchant_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.digital_delivery?.merchant_fee || 0,
        transcript_courier_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.courier_service?.base_amount || 0,
        transcript_courier_merchant_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.courier_service?.merchant_fee || 0,
        transcript_pickup_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.physical_pickup?.base_amount || 0,
        transcript_pickup_merchant_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.physical_pickup?.merchant_fee || 0
      });
    } else if (getCredentials.value === null) { 
      // Reset form if no config
      paymentConfigForm.reset({
        annual_access_fee: 0, annual_access_merchant_fee: 0, annual_access_split_key: "",
        department_annual_access_dues: 0, department_annual_access_merchant_fee: 0, department_annual_access_split_key: "",
        id_card_payment: 0, id_card_merchant_fee: 0, id_card_split_key: "",
        transcript_fee: 0, transcript_merchant_fee: 0, transcript_split_key: "",
        transcript_digital_fee: 0, transcript_digital_merchant_fee: 0,
        transcript_courier_fee: 0, transcript_courier_merchant_fee: 0,
        transcript_pickup_fee: 0, transcript_pickup_merchant_fee: 0
      });
    }
  }, [getCredentials.value, activeProgramType.id, paymentConfigForm]);

  const patchPaymentConfig = useCallback(async () => {
    const payload = {
      program_type_id: activeProgramType.id,
      paystack_public_key: paymentConfigForm.getValues("paystack_public_key")?.trim(),
      paystack_secret_key: paymentConfigForm.getValues("paystack_secret_key")?.trim(),
      annual_access_fee: paymentConfigForm.getValues("annual_access_fee"),
      annual_access_merchant_fee: paymentConfigForm.getValues("annual_access_merchant_fee"),
      annual_access_split_key: paymentConfigForm.getValues("annual_access_split_key")?.trim(),
      department_annual_access_dues: paymentConfigForm.getValues("department_annual_access_dues") ,
      department_annual_access_merchant_fee: paymentConfigForm.getValues("department_annual_access_merchant_fee"),
      department_annual_access_split_key: paymentConfigForm.getValues("department_annual_access_split_key")?.trim(),
      id_card_payment: paymentConfigForm.getValues("id_card_payment"),
      id_card_merchant_fee: paymentConfigForm.getValues("id_card_merchant_fee"),
      id_card_split_key: paymentConfigForm.getValues("id_card_split_key")?.trim(),
      transcript_fee: paymentConfigForm.getValues("transcript_fee"),
      transcript_merchant_fee: paymentConfigForm.getValues("transcript_merchant_fee"),
      transcript_split_key: paymentConfigForm.getValues("transcript_split_key")?.trim(),
      transcript_delivery_options: {
        digital_delivery: {
          base_amount: paymentConfigForm.getValues("transcript_digital_fee"),
          merchant_fee: paymentConfigForm.getValues("transcript_digital_merchant_fee"),
          description: "Email delivery"
        },
        courier_service: {
          base_amount: paymentConfigForm.getValues("transcript_courier_fee"),
          merchant_fee: paymentConfigForm.getValues("transcript_courier_merchant_fee"),
          description: "Doorstep delivery"
        },
        physical_pickup: {
          base_amount: paymentConfigForm.getValues("transcript_pickup_fee"),
          merchant_fee: paymentConfigForm.getValues("transcript_pickup_merchant_fee"),
          description: "Pick up at registry"
        }
      }
    }
    
    setIsSaving(true);
    try {
      await PaymentServices.patchPaymentConfig(payload);
      toaster.success({ title: "Payment config updated successfully" });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save payment config:", error);
      toaster.error({ title: "Failed to save payment config" });
    } finally {
      setIsSaving(false);
    }
  }, [activeProgramType.id, paymentConfigForm]); 



  return (
    <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" p={{ base: "6", md: "10" }} colorPalette="accent">
      <Flex wrap="wrap" gap="4" justifyContent="space-between" alignItems="flex-start" mb="6">
        <Text fontSize="xl" fontWeight="bold">Payment Settings</Text>
        <Button 
          onClick={() => setIsEditing(!isEditing)} 
          disabled={isSaving}
          colorPalette={isEditing ? "red" : "gray"}
          variant={isEditing ? "solid" : "subtle"}
          size="sm"
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </Flex>



      {/* program types */}
      <Flex mt="6" borderRadius="md" bg="gray.100" p="2" gap="2" w="fit" alignItems="center">
        {programTypes.loading ? (
          <Text fontSize="sm" color="gray.600" px="4" py="2">Loading program types...</Text>
        ) : (
           <>
           {programTypes.value?.map((type: any) => (
            <Button 
              onClick={() => setActiveProgramType({ id: type.id, name: type.name })} 
              key={type.id} 
              variant={activeProgramType.id === type.id ? "solid" : "ghost"}
              colorPalette={activeProgramType.id === type.id ? "accent" : "gray"}
              size="sm"
            >
              {type.name}
            </Button>
           ))}
           </>
        )}
      </Flex>

      <form onSubmit={paymentConfigForm.handleSubmit(patchPaymentConfig)}>
      {/* public /private keys */}
      <Box p="6" borderRadius="md" border="xs" borderColor="border.muted" mt="12" bg="slate.50">
          <Text fontWeight="bold" mb="4">Paystack API Credentials</Text>
          <Flex gap="6" w="full" direction={{ base: "column", md: "row" }}>
              <Field.Root flex="1">
                <Field.Label>Public Key</Field.Label>
                <Input 
                  {...paymentConfigForm.register("paystack_public_key")} 
                  readOnly={!isEditing}
                  placeholder="pk_test_..."
                  size="xl"
                  bg={isEditing ? "white" : "transparent"}
                />
              </Field.Root>

              <Field.Root flex="1">
                <Field.Label>Secret Key</Field.Label>
                <Input 
                  {...paymentConfigForm.register("paystack_secret_key")} 
                  readOnly={!isEditing}
                  placeholder="sk_test_..."
                  size="xl"
                  bg={isEditing ? "white" : "transparent"}
                />
              </Field.Root>
          </Flex>
      </Box>

      {/* informations grid */}
      <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mt="10">
        
        {/* annual access fee */}
        <Box p="6" borderRadius="md" border="xs" borderColor="border.muted" bg="slate.50">
          <Text fontWeight="bold" mb="4">Annual Access Fee</Text>
          <Stack gap="5">
            <Field.Root invalid={!!paymentConfigForm.formState.errors.annual_access_split_key}>
              <Field.Label>Split Key</Field.Label>
              <Input {...paymentConfigForm.register("annual_access_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.annual_access_split_key?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!paymentConfigForm.formState.errors.annual_access_fee}>
              <Field.Label>Base Amount</Field.Label>
              <Input type="number" {...paymentConfigForm.register("annual_access_fee", { valueAsNumber: true })} readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.annual_access_fee?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!paymentConfigForm.formState.errors.annual_access_merchant_fee}>
              <Field.Label>Merchant Fee</Field.Label>
              <Input type="number" {...paymentConfigForm.register("annual_access_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.annual_access_merchant_fee?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Box>

        {/* annual department dues fee */}
        <Box p="6" borderRadius="md" border="xs" borderColor="border.muted" bg="slate.50">
          <Text fontWeight="bold" mb="4">Annual Department Dues</Text>
          <Stack gap="5">
            <Field.Root invalid={!!paymentConfigForm.formState.errors.department_annual_access_split_key}>
              <Field.Label>Split Key</Field.Label>
              <Input type="text" {...paymentConfigForm.register("department_annual_access_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly size="xl" bg="transparent" />
              <Field.ErrorText>{paymentConfigForm.formState.errors.department_annual_access_split_key?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!paymentConfigForm.formState.errors.department_annual_access_dues}>
              <Field.Label>Base Amount</Field.Label>
              <Input type="number" {...paymentConfigForm.register("department_annual_access_dues", { valueAsNumber: true })} readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.department_annual_access_dues?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!paymentConfigForm.formState.errors.department_annual_access_merchant_fee}>
              <Field.Label>Merchant Fee</Field.Label>
              <Input type="number" {...paymentConfigForm.register("department_annual_access_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.department_annual_access_merchant_fee?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Box>

        {/* ID CARD payment */}
        <Box p="6" borderRadius="md" border="xs" borderColor="border.muted" bg="slate.50">
          <Text fontWeight="bold" mb="4">ID Card Payment</Text>
          <Stack gap="5">
            <Field.Root invalid={!!paymentConfigForm.formState.errors.id_card_split_key}>
              <Field.Label>Split Key</Field.Label>
              <Input {...paymentConfigForm.register("id_card_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.id_card_split_key?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!paymentConfigForm.formState.errors.id_card_payment}>
              <Field.Label>Base Amount</Field.Label>
              <Input type="number" {...paymentConfigForm.register("id_card_payment", { valueAsNumber: true })} readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.id_card_payment?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!paymentConfigForm.formState.errors.id_card_merchant_fee}>
              <Field.Label>Merchant Fee</Field.Label>
              <Input type="number" {...paymentConfigForm.register("id_card_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.id_card_merchant_fee?.message}</Field.ErrorText>
            </Field.Root>
          </Stack>
        </Box>

        {/* transcript */}
        <Box p="6" borderRadius="md" border="xs" borderColor="border.muted" gridColumn={{ base: "1", lg: "1 / -1" }} bg="slate.50">
          <Text fontWeight="bold" mb="6">Transcript Delivery Options</Text>
          
          <Flex direction={{ base: "column", md: "row" }} gap="6" mb="8">
            <Field.Root flex="1">
              <Field.Label>Global Base Amount</Field.Label>
              <Input type="number" {...paymentConfigForm.register("transcript_fee", { valueAsNumber: true })} readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
            </Field.Root>

            <Field.Root flex="1">
              <Field.Label>Global Merchant Fee</Field.Label>
              <Input type="number" {...paymentConfigForm.register("transcript_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
            </Field.Root>

            <Field.Root flex="1" invalid={!!paymentConfigForm.formState.errors.transcript_split_key}>
              <Field.Label>Global Split Key</Field.Label>
              <Input {...paymentConfigForm.register("transcript_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing} size="xl" bg={isEditing ? "white" : "transparent"} />
              <Field.ErrorText>{paymentConfigForm.formState.errors.transcript_split_key?.message}</Field.ErrorText>
            </Field.Root>
          </Flex>

          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap="6">
            <Box bg="white" p="5" borderRadius="md" border="xs" borderColor="border.muted">
              <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="1">Digital Delivery</Text>
              <Text fontSize="xs" color="fg.subtle" mb="4">Email delivery</Text>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label fontSize="xs">Base Fee</Field.Label>
                  <Input type="number" {...paymentConfigForm.register("transcript_digital_fee", { valueAsNumber: true })} readOnly={!isEditing} size="lg" bg={isEditing ? "slate.50" : "transparent"} />
                </Field.Root>
                <Field.Root>
                  <Field.Label fontSize="xs">Merchant Fee</Field.Label>
                  <Input type="number" {...paymentConfigForm.register("transcript_digital_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} size="lg" bg={isEditing ? "slate.50" : "transparent"} />
                </Field.Root>
              </Stack>
            </Box>

            <Box bg="white" p="5" borderRadius="md" border="xs" borderColor="border.muted">
              <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="1">Courier Service</Text>
              <Text fontSize="xs" color="fg.subtle" mb="4">Doorstep delivery</Text>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label fontSize="xs">Base Fee</Field.Label>
                  <Input type="number" {...paymentConfigForm.register("transcript_courier_fee", { valueAsNumber: true })} readOnly={!isEditing} size="lg" bg={isEditing ? "slate.50" : "transparent"} />
                </Field.Root>
                <Field.Root>
                  <Field.Label fontSize="xs">Merchant Fee</Field.Label>
                  <Input type="number" {...paymentConfigForm.register("transcript_courier_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} size="lg" bg={isEditing ? "slate.50" : "transparent"} />
                </Field.Root>
              </Stack>
            </Box>

            <Box bg="white" p="5" borderRadius="md" border="xs" borderColor="border.muted">
              <Text fontSize="sm" fontWeight="bold" color="fg.muted" mb="1">Physical Pickup</Text>
              <Text fontSize="xs" color="fg.subtle" mb="4">Pick up at registry</Text>
              <Stack gap="4">
                <Field.Root>
                  <Field.Label fontSize="xs">Base Fee</Field.Label>
                  <Input type="number" {...paymentConfigForm.register("transcript_pickup_fee", { valueAsNumber: true })} readOnly={!isEditing} size="lg" bg={isEditing ? "slate.50" : "transparent"} />
                </Field.Root>
                <Field.Root>
                  <Field.Label fontSize="xs">Merchant Fee</Field.Label>
                  <Input type="number" {...paymentConfigForm.register("transcript_pickup_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} size="lg" bg={isEditing ? "slate.50" : "transparent"} />
                </Field.Root>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      {isEditing && (
        <Button 
          type="submit"
          loading={isSaving}
          loadingText="Saving..."
          disabled={isSaving || !paymentConfigForm.formState.isValid}
          colorPalette="accent"
          mt="6"
        >
          Save Changes
        </Button>
      )}
      </form>
    </Box>
  )
}

export default PaymentSettingsTab;
