import { useState, useEffect, useCallback } from "react";
import { toaster } from "@components/ui/toaster";
import { Calendar, Percent, GraduationCap, BookOpen, ShieldAlert } from "lucide-react";
import { SystemServices } from "@services/system.service";
import type { UseFormWatch, UseFormSetValue, UseFormRegister } from "react-hook-form";
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
  createListCollection,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { Switch } from "@components/ui/switch";
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

const levelCollection = createListCollection({
    items: [
        { label: "100", value: "L100" },
        { label: "200", value: "L200" },
        { label: "300", value: "L300" },
        { label: "400", value: "L400" },
        { label: "500", value: "L500" },
    ],
});

const semesterCollection = createListCollection({
    items: [
        { label: "1st Semester", value: "FIRST" },
        { label: "2nd Semester", value: "SECOND" },
    ],
});

const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) => (
  <Flex alignItems="center" gap="2" mb="4">
    {icon}
    <Box>
      <Text fontWeight="bold" fontSize="md" color="fg.muted">{title}</Text>
      {subtitle && <Text fontSize="xs" color="fg.subtle">{subtitle}</Text>}
    </Box>
  </Flex>
);

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
  // In read mode, show a plain readOnly input so text stays black (not faded)
  if (!isEditing) {
    return (
      <Field.Root>
        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">{label}</Field.Label>
        <Input
          value={val ? val.toString() : ""}
          readOnly
          size="xl"
          bg="transparent"
        />
      </Field.Root>
    );
  }
  return (
    <Field.Root invalid={!!error}>
      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">{label}</Field.Label>
      <DatePickerRoot
        value={val ? [val] : []}
        onValueChange={(e) => setValue(valueName, e.value[0])}
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

const NumberField = ({
  label,
  name,
  register,
  error,
  isEditing,
  suffix,
}: {
  label: string;
  name: keyof SystemSettingsData;
  register: UseFormRegister<SystemSettingsData>;
  error?: { message?: string };
  isEditing: boolean;
  suffix?: string;
}) => (
  <Field.Root invalid={!!error}>
    <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">{label}</Field.Label>
    <Flex align="center" gap="2">
      <Input
        type="number"
        {...register(name, { valueAsNumber: true })}
        readOnly={!isEditing}
        size="xl"
        bg={isEditing ? "white" : "transparent"}
        flex="1"
      />
      {suffix && <Text fontSize="sm" color="fg.subtle" whiteSpace="nowrap">{suffix}</Text>}
    </Flex>
    {error && <Field.ErrorText>{error.message}</Field.ErrorText>}
  </Field.Root>
);

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

  const parseDateSafe = (dateStr: string | null | undefined) => {
    if (!dateStr) return undefined;
    try {
      return parseDate(new Date(dateStr).toISOString().split('T')[0]);
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    if (settingsData) {
      reset({
        currentSession: settingsData.currentSession,
        currentSemester: settingsData.currentSemester,
        semester1StartDate: parseDateSafe(settingsData.semester1StartDate),
        semester1EndDate: parseDateSafe(settingsData.semester1EndDate),
        semester2StartDate: parseDateSafe(settingsData.semester2StartDate),
        semester2EndDate: parseDateSafe(settingsData.semester2EndDate),
        totalCreditUnit: settingsData.totalCreditUnit,
        semester1CreditUnit: settingsData.semester1CreditUnit,
        semester2CreditUnit: settingsData.semester2CreditUnit,
        caPercentage: settingsData.caPercentage,
        examPercentage: settingsData.examPercentage,
        probationCgpaThreshold: settingsData.probationCgpaThreshold,
        suspensionThreshold: settingsData.suspensionThreshold,
        siwesRequired: settingsData.siwesRequired,
        siwesMinimumWeeks: settingsData.siwesMinimumWeeks,
        siwesLevel: settingsData.siwesLevel,
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
        semester1StartDate: data.semester1StartDate ? new Date(data.semester1StartDate.toString()).toISOString() : undefined,
        semester1EndDate: data.semester1EndDate ? new Date(data.semester1EndDate.toString()).toISOString() : undefined,
        semester2StartDate: data.semester2StartDate ? new Date(data.semester2StartDate.toString()).toISOString() : undefined,
        semester2EndDate: data.semester2EndDate ? new Date(data.semester2EndDate.toString()).toISOString() : undefined,
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
        currentSemester: settingsData.currentSemester,
        semester1StartDate: parseDateSafe(settingsData.semester1StartDate),
        semester1EndDate: parseDateSafe(settingsData.semester1EndDate),
        semester2StartDate: parseDateSafe(settingsData.semester2StartDate),
        semester2EndDate: parseDateSafe(settingsData.semester2EndDate),
        totalCreditUnit: settingsData.totalCreditUnit,
        semester1CreditUnit: settingsData.semester1CreditUnit,
        semester2CreditUnit: settingsData.semester2CreditUnit,
        caPercentage: settingsData.caPercentage,
        examPercentage: settingsData.examPercentage,
        probationCgpaThreshold: settingsData.probationCgpaThreshold,
        suspensionThreshold: settingsData.suspensionThreshold,
        siwesRequired: settingsData.siwesRequired,
        siwesMinimumWeeks: settingsData.siwesMinimumWeeks,
        siwesLevel: settingsData.siwesLevel,
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
      {/* Header — outside form so Edit/Cancel can never trigger submit */}
      <Flex justifyContent="space-between" alignItems="center" mb="8">
        <Flex alignItems="center" gap="3">
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="fg.muted">System Configuration</Text>
            <Text fontSize="sm" color="fg.subtle">Manage global academic parameters and policies</Text>
          </Box>
        </Flex>
        <Flex gap="3">
          <Button
            type="button"
            colorPalette={isEditing ? "red" : "gray"}
            variant={isEditing ? "solid" : "subtle"}
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            disabled={updateMutation.isPending}
            size="xl"
          >
            {isEditing ? "Cancel" : "Edit Configuration"}
          </Button>
          {isEditing && (
            <Button
              type="submit"
              form="system-settings-form"
              colorPalette="accent"
              loading={updateMutation.isPending}
              loadingText="Saving..."
              disabled={!isValid || updateMutation.isPending}
              size="xl"
            >
              Save Changes
            </Button>
          )}
        </Flex>
      </Flex>

      <form id="system-settings-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="10" colorPalette="accent">

          {/* ── Academic Session ── */}
          <Box>
            <SectionHeader
              icon={<Calendar size={18} color="#1D7AD9" />}
              title="Academic Session & Semesters"
              subtitle="Configure the current session, active semester, and semester date ranges"
            />
            <Box p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <Stack gap="6">
                <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
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

                  <Field.Root>
                    <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Current Semester</Field.Label>
                    {isEditing ? (
                      <Select.Root
                        collection={semesterCollection}
                        value={watch("currentSemester") ? [watch("currentSemester") as string] : []}
                        onValueChange={(e) => setValue("currentSemester", e.value[0])}
                        size="lg"
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                            <Select.ValueText placeholder="Select semester" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {semesterCollection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    ) : (
                      <Input
                        value={semesterCollection.items.find(i => i.value === watch("currentSemester"))?.label ?? watch("currentSemester") ?? ""}
                        readOnly
                        size="xl"
                        w="full"
                        bg="transparent"
                      />
                    )}
                  </Field.Root>
                </SimpleGrid>

                <Text fontSize="sm" fontWeight="semibold" color="fg.subtle">Semester 1</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
                  <DatePickerField label="Start Date" valueName="semester1StartDate" error={errors.semester1StartDate} watch={watch} setValue={setValue} isEditing={isEditing} />
                  <DatePickerField label="End Date" valueName="semester1EndDate" error={errors.semester1EndDate} watch={watch} setValue={setValue} isEditing={isEditing} />
                </SimpleGrid>

                <Text fontSize="sm" fontWeight="semibold" color="fg.subtle">Semester 2</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
                  <DatePickerField label="Start Date" valueName="semester2StartDate" error={errors.semester2StartDate} watch={watch} setValue={setValue} isEditing={isEditing} />
                  <DatePickerField label="End Date" valueName="semester2EndDate" error={errors.semester2EndDate} watch={watch} setValue={setValue} isEditing={isEditing} />
                </SimpleGrid>
              </Stack>
            </Box>
          </Box>

          {/* ── Credit Units ── */}
          <Box>
            <SectionHeader
              icon={<BookOpen size={18} color="#1D7AD9" />}
              title="Credit Units"
              subtitle="Set the total and per-semester credit unit requirements"
            />
            <Box p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                <NumberField label="Total Credit Units" name="totalCreditUnit" register={register} error={errors.totalCreditUnit} isEditing={isEditing} suffix="units" />
                <NumberField label="Semester 1 Credit Units" name="semester1CreditUnit" register={register} error={errors.semester1CreditUnit} isEditing={isEditing} suffix="units" />
                <NumberField label="Semester 2 Credit Units" name="semester2CreditUnit" register={register} error={errors.semester2CreditUnit} isEditing={isEditing} suffix="units" />
              </SimpleGrid>
            </Box>
          </Box>

          {/* ── Grading Policy ── */}
          <Box>
            <SectionHeader
              icon={<Percent size={18} color="#1D7AD9" />}
              title="Grading Policy"
              subtitle="Configure how CA and exam scores are weighted"
            />
            <Box p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
                <NumberField label="Continuous Assessment (%)" name="caPercentage" register={register} error={errors.caPercentage} isEditing={isEditing} suffix="%" />
                <NumberField label="Examination (%)" name="examPercentage" register={register} error={errors.examPercentage} isEditing={isEditing} suffix="%" />
              </SimpleGrid>
            </Box>
          </Box>

          {/* ── Academic Standing ── */}
          <Box>
            <SectionHeader
              icon={<ShieldAlert size={18} color="#1D7AD9" />}
              title="Academic Standing"
              subtitle="Define thresholds for probation and suspension"
            />
            <Box p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
                <NumberField label="Probation CGPA Threshold" name="probationCgpaThreshold" register={register} error={errors.probationCgpaThreshold} isEditing={isEditing} suffix="CGPA" />
                <NumberField label="Suspension Threshold (semesters)" name="suspensionThreshold" register={register} error={errors.suspensionThreshold} isEditing={isEditing} suffix="sem." />
              </SimpleGrid>
            </Box>
          </Box>

          {/* ── SIWES ── */}
          <Box>
            <SectionHeader
              icon={<GraduationCap size={18} color="#1D7AD9" />}
              title="SIWES Configuration"
              subtitle="Student Industrial Work Experience Scheme requirements"
            />
            <Box p="6" borderRadius="md" border="xs" borderColor="border.muted">
              <Stack gap="6">
                <Field.Root>
                  <Flex align="center" justify="space-between">
                    <Box>
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="0">SIWES Required</Field.Label>
                      <Text fontSize="xs" color="fg.subtle">Whether SIWES is mandatory for graduation</Text>
                    </Box>
                    <Switch
                      checked={!!watch("siwesRequired")}
                      onCheckedChange={(e) => setValue("siwesRequired", e.checked)}
                      disabled={!isEditing}
                      colorPalette="accent"
                    />
                  </Flex>
                </Field.Root>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
                  <NumberField label="Minimum SIWES Weeks" name="siwesMinimumWeeks" register={register} error={errors.siwesMinimumWeeks} isEditing={isEditing} suffix="weeks" />

                  <Field.Root>
                    <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">SIWES Level</Field.Label>
                    {isEditing ? (
                      <Select.Root
                        collection={levelCollection}
                        value={watch("siwesLevel") ? [watch("siwesLevel") as string] : []}
                        onValueChange={(e) => setValue("siwesLevel", e.value[0])}
                        size="lg"
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                            <Select.ValueText placeholder="Select level" />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content>
                              {levelCollection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>{item.label}</Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    ) : (
                      <Input
                        value={levelCollection.items.find(i => i.value === watch("siwesLevel"))?.label ?? watch("siwesLevel") ?? ""}
                        readOnly
                        size="xl"
                        w="full"
                        bg="transparent"
                      />
                    )}
                  </Field.Root>
                </SimpleGrid>
              </Stack>
            </Box>
          </Box>

        </Stack>

      </form>
    </Box>
  );
};

export default SystemSettingsTab;
