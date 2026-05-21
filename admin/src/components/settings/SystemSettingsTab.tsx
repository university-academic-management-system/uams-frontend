import { useState, useEffect, useCallback } from "react";
import { toaster } from "@components/ui/toaster";
import { Calendar, Percent } from "lucide-react";
import { SystemServices } from "@services/system.service";
import type { UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { SystemSettingsData } from "@schemas/system.schema";
import { useSystemSettingsForm } from "@forms/system.form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Box, 
  Flex, 
  Text, 
  Input, 
  Button, 
  Field, 
  Stack, 
  Spinner,
  Portal,
} from "@chakra-ui/react";
import { 
    DatePickerRoot, 
    DatePickerControl, 
    DatePickerInput, 
    DatePickerIndicatorGroup, 
    DatePickerTrigger, 
    DatePickerContent, 
    DatePickerView, 
    DatePickerHeader, 
    DatePickerDayTable, 
    DatePickerMonthTable, 
    DatePickerYearTable, 
    DatePickerPositioner
} from "@components/ui/date-picker";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

const DatePickerField = ({ 
  label, 
  valueName, 
  error,
  watch,
  setValue,
  isEditing
}: { 
  label: string; 
  valueName: keyof SystemSettingsData; 
  error?: { message?: string };
  watch: UseFormWatch<SystemSettingsData>;
  setValue: UseFormSetValue<SystemSettingsData>;
  isEditing: boolean;
}) => {
  const val = watch(valueName) as DateValue | undefined;
  return (
    <Field.Root invalid={!!error}>
      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">{label}</Field.Label>
      <DatePickerRoot
        value={val ? [val] : []}
        onValueChange={(e) => setValue(valueName, e.value[0])}
        disabled={!isEditing}
        width="full"
        size="xl"
        openOnClick
      >
        <DatePickerControl>
          <DatePickerInput />
          <DatePickerIndicatorGroup>
            <DatePickerTrigger>
              <Calendar size={16} />
            </DatePickerTrigger>
          </DatePickerIndicatorGroup>
        </DatePickerControl>
        <Portal>
          <DatePickerPositioner>
            <DatePickerContent>
              <DatePickerView view="day">
                <DatePickerHeader />
                <DatePickerDayTable />
              </DatePickerView>
              <DatePickerView view="month">
                <DatePickerHeader />
                <DatePickerMonthTable />
              </DatePickerView>
              <DatePickerView view="year">
                <DatePickerHeader />
                <DatePickerYearTable />
              </DatePickerView>
            </DatePickerContent>
          </DatePickerPositioner>
        </Portal>
      </DatePickerRoot>
      {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
    </Field.Root>
  );
};

const SystemSettingsTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useSystemSettingsForm();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["systemSettings"],
    queryFn: () => SystemServices.getSystemSettings(),
  });

  useEffect(() => {
    if (settingsData) {
      reset({
        currentSession: settingsData.currentSession,
        semester1StartDate: settingsData.semester1StartDate ? parseDate(new Date(settingsData.semester1StartDate).toISOString().split('T')[0]) : undefined,
        semester1EndDate: settingsData.semester1EndDate ? parseDate(new Date(settingsData.semester1EndDate).toISOString().split('T')[0]) : undefined,
        caPercentage: settingsData.caPercentage,
        examPercentage: settingsData.examPercentage,
      });
    }
  }, [settingsData, reset]);

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => SystemServices.updateSystemSettings(payload),
    onSuccess: () => {
      toaster.success({ title: "System settings updated successfully" });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["systemSettings"] });
    },
    onError: (err) => {
      console.error("Failed to update system settings", err);
    }
  });

  const onSubmit = useCallback(
    (data: SystemSettingsData) => {
      const payload = {
        ...data,
        semester1StartDate: data.semester1StartDate?.toString(),
        semester1EndDate: data.semester1EndDate?.toString(),
      };
      updateMutation.mutate(payload);
    },
    [updateMutation]
  );

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (settingsData) {
      reset({
        currentSession: settingsData.currentSession,
        semester1StartDate: settingsData.semester1StartDate ? parseDate(new Date(settingsData.semester1StartDate).toISOString().split('T')[0]) : undefined,
        semester1EndDate: settingsData.semester1EndDate ? parseDate(new Date(settingsData.semester1EndDate).toISOString().split('T')[0]) : undefined,
        caPercentage: settingsData.caPercentage,
        examPercentage: settingsData.examPercentage,
      });
    }
  }, [reset, settingsData]);

  if (isLoading) {
    return (
      <Flex justifyContent="center" py="20">
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" p={{ base: "6", md: "10" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justifyContent="space-between" alignItems="center" mb="8">
          <Flex alignItems="center" gap="3">
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="fg.muted">System Configuration</Text>
              <Text fontSize="sm" color="fg.subtle">Manage global academic parameters and policies</Text>
            </Box>
          </Flex>
          <Button
            type={isEditing ? "submit" : "button"}
            onClick={() => !isEditing && setIsEditing(true)}
            colorPalette={isEditing ? "accent" : "gray"}
            variant={isEditing ? "solid" : "subtle"}
            loading={updateMutation.isPending}
            loadingText="Saving..."
            disabled={isEditing ? (!isValid || updateMutation.isPending) : false}
          >
            {isEditing ? "Save Changes" : "Edit Configuration"}
          </Button>
        </Flex>

        <Stack gap="10" colorPalette="accent">
          {/* Academic Session */}
          <Box>
            <Flex alignItems="center" gap="2" mb="4">
              <Calendar size={18} color="#1D7AD9" />
              <Text fontWeight="bold" fontSize="md" color="fg.muted">Academic Session & Semesters</Text>
            </Flex>
            <Box p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <Stack gap="6">
                <Field.Root invalid={!!errors.currentSession}>
                  <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Current Session</Field.Label>
                  <Input
                    {...register("currentSession")}
                    placeholder="e.g. 2025/2026"
                    readOnly={!isEditing}
                    size="xl"
                    bg={isEditing ? "white" : "transparent"}
                  />
                  <Field.ErrorText>{errors.currentSession?.message}</Field.ErrorText>
                </Field.Root>

                <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                  <DatePickerField 
                    label="Semester 1 Start Date" 
                    valueName="semester1StartDate" 
                    error={errors.semester1StartDate} 
                    watch={watch}
                    setValue={setValue}
                    isEditing={isEditing}
                  />
                  <DatePickerField 
                    label="Semester 1 End Date" 
                    valueName="semester1EndDate" 
                    error={errors.semester1EndDate} 
                    watch={watch}
                    setValue={setValue}
                    isEditing={isEditing}
                  />
                </Box>
              </Stack>
            </Box>
          </Box>

          {/* Grading Policy */}
          <Box>
            <Flex alignItems="center" gap="2" mb="4">
              <Percent size={18} color="#1D7AD9" />
              <Text fontWeight="bold" fontSize="md" color="fg.muted">Grading Policy</Text>
            </Flex>
            <Box p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                <Field.Root invalid={!!errors.caPercentage}>
                  <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Continuous Assessment (%)</Field.Label>
                  <Input
                    type="number"
                    {...register("caPercentage", { valueAsNumber: true })}
                    disabled={!isEditing}
                    size="xl"
                    bg={isEditing ? "white" : "transparent"}
                  />
                  <Field.ErrorText>{errors.caPercentage?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors.examPercentage}>
                  <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Examination (%)</Field.Label>
                  <Input
                    type="number"
                    {...register("examPercentage", { valueAsNumber: true })}
                    disabled={!isEditing}
                    size="xl"
                    bg={isEditing ? "white" : "transparent"}
                  />
                  <Field.ErrorText>{errors.examPercentage?.message}</Field.ErrorText>
                </Field.Root>
              </Box>
            </Box>
          </Box>
        </Stack>

        {isEditing && (
          <Flex justifyContent="flex-end" mt="10" gap="4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorPalette="accent"
              loading={updateMutation.isPending}
              loadingText="Saving..."
              disabled={!isValid || updateMutation.isPending}
            >
              Save Changes
            </Button>
          </Flex>
        )}
      </form>
    </Box>
  );
};

export default SystemSettingsTab;
