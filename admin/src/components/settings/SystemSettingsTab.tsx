import { useState, useEffect } from "react";
import { toaster } from "@components/ui/toaster";
import { Settings2, Calendar, Percent } from "lucide-react";
import { SystemServices } from "@services/system.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { systemSettingsSchema, type SystemSettingsData } from "@schemas/system.schema";
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

const SystemSettingsTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<SystemSettingsData>({
    mode: "onChange",
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      caPercentage: 30,
      examPercentage: 70,
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await SystemServices.getSystemSettings();
      if (data) {
        reset({
          currentSession: data.currentSession,
          semester1StartDate: data.semester1StartDate ? parseDate(new Date(data.semester1StartDate).toISOString().split('T')[0]) : undefined,
          semester1EndDate: data.semester1EndDate ? parseDate(new Date(data.semester1EndDate).toISOString().split('T')[0]) : undefined,
          caPercentage: data.caPercentage,
          examPercentage: data.examPercentage,
        });
      }
    } catch (err) {
      console.error("Failed to fetch system settings", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SystemSettingsData) => {
    try {
      setIsSaving(true);
      const payload = {
        ...data,
        semester1StartDate: data.semester1StartDate?.toString(),
        semester1EndDate: data.semester1EndDate?.toString(),
      };
      await SystemServices.updateSystemSettings(payload);
      toaster.success({ title: "System settings updated successfully" });
      setIsEditing(false);
      await fetchSettings();
    } catch (err) {
      console.error("Failed to update system settings", err);
      // Error toast handled by axios interceptor
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Flex justifyContent="center" py="20">
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }

  const DatePickerField = ({ label, valueName, error }: { label: string, valueName: keyof SystemSettingsData, error?: any }) => {
    const val = watch(valueName) as DateValue | undefined;
    return (
      <Field.Root invalid={!!error}>
        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">{label}</Field.Label>
        <DatePickerRoot
          value={val ? [val] : []}
          onValueChange={(e) => setValue(valueName, e.value[0])}
          disabled={!isEditing}
          width="full"
        >
          <DatePickerControl>
            <DatePickerInput bg={isEditing ? "white" : "slate.50"} border="xs" borderColor="border.muted" borderRadius="md" />
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

  return (
    <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" p={{ base: "6", md: "10" }} colorPalette="accent">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justifyContent="space-between" alignItems="center" mb="8">
          <Flex alignItems="center" gap="3">
            <Box p="2" bg="blue.50" borderRadius="md">
              <Settings2 size={24} color="#1D7AD9" />
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="fg.muted">System Configuration</Text>
              <Text fontSize="sm" color="fg.muted">Manage global academic parameters and policies</Text>
            </Box>
          </Flex>
          <Button
            type={isEditing ? "submit" : "button"}
            onClick={() => !isEditing && setIsEditing(true)}
            colorPalette={isEditing ? "accent" : "gray"}
            variant={isEditing ? "solid" : "subtle"}
            loading={isSaving}
            loadingText="Saving..."
            disabled={isEditing ? (!isValid || isSaving) : false}
          >
            {isEditing ? "Save Changes" : "Edit Configuration"}
          </Button>
        </Flex>

        <Stack gap="10">
          {/* Academic Session */}
          <Box>
            <Flex alignItems="center" gap="2" mb="4">
              <Calendar size={18} color="#1D7AD9" />
              <Text fontWeight="bold" fontSize="md" color="fg.muted">Academic Session & Semesters</Text>
            </Flex>
            <Box bg="slate.50" p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <Stack gap="6">
                <Field.Root invalid={!!errors.currentSession}>
                  <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Current Session</Field.Label>
                  <Input
                    {...register("currentSession")}
                    placeholder="e.g. 2025/2026"
                    readOnly={!isEditing}
                    bg={isEditing ? "white" : "transparent"}
                  />
                  <Field.ErrorText>{errors.currentSession?.message}</Field.ErrorText>
                </Field.Root>

                <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                  <DatePickerField label="Semester 1 Start Date" valueName="semester1StartDate" error={errors.semester1StartDate} />
                  <DatePickerField label="Semester 1 End Date" valueName="semester1EndDate" error={errors.semester1EndDate} />
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
            <Box bg="slate.50" p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="6">
                <Field.Root invalid={!!errors.caPercentage}>
                  <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Continuous Assessment (%)</Field.Label>
                  <Input
                    type="number"
                    {...register("caPercentage", { valueAsNumber: true })}
                    disabled={!isEditing}
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
              onClick={() => {
                setIsEditing(false);
                fetchSettings();
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              colorPalette="accent"
              loading={isSaving}
              loadingText="Saving..."
              disabled={!isValid || isSaving}
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
