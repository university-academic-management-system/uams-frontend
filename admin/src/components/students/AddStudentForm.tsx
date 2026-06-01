import { useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { 
    Flex, 
    Text, 
    Spinner, 
    Button, 
    Dialog, 
    Input,
    Field,
    SimpleGrid,
    Select,
    Portal,
    createListCollection
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { type StudentFormData } from "@schemas/student.schema";
import type { Student } from "@type/student.type";
import useStudentForm from "@forms/student.form";

const GENDER_COLLECTION = createListCollection({
    items: [
        { label: "Male", value: "MALE" },
        { label: "Female", value: "FEMALE" }
    ]
});

const LEVELS_COLLECTION = createListCollection({
    items: ['L100', 'L200', 'L300', 'L400', 'L500', 'L600', 'L700', 'L800'].map(l => ({ label: l, value: l }))
});

const DURATION_COLLECTION = createListCollection({
    items: ['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Years', '7 Years'].map(l => ({ label: l, value: l }))
});

interface AddStudentFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StudentFormData) => Promise<void>;
    initialData?: Student | null;
}

const AddStudentForm = ({ isOpen, onClose, onSubmit, initialData }: AddStudentFormProps) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useStudentForm();

    useEffect(() => {
        if (initialData) {
            reset({
                registrationNo: initialData.registrationNo || "",
                matricNumber: initialData.matricNumber || "",
                firstName: initialData.firstName || "",
                surname: initialData.surname || "",
                otherName: initialData.otherName || "",
                email: initialData.email || "",
                gender: initialData.gender || "",
                level: initialData.level || "",
                admissionMode: initialData.admissionMode || "",
                entryQualification: initialData.entryQualification || "",
                faculty: initialData.faculty || "",
                department: initialData.department || "",
                degreeCourse: initialData.degreeCourse || "",
                degreeAwardedCode: initialData.degreeAwardedCode || "",
                degreeDuration: initialData.degreeDuration || initialData.courseDuration || "4 Years",
                admissionYear: initialData.admissionYear || 2023,
                admissionSession: initialData.admissionSession || "2023/2024",
            });
        } else {
            reset({
                registrationNo: "",
                matricNumber: "",
                firstName: "",
                surname: "",
                otherName: "",
                email: "",
                gender: "",
                level: "",
                admissionMode: "",
                entryQualification: "",
                faculty: "",
                department: "",
                degreeCourse: "",
                degreeAwardedCode: "",
                degreeDuration: "4 Years",
                admissionYear: 2023,
                admissionSession: "2023/2024",
            });
        }
    }, [initialData, reset, isOpen]);

    const onFormSubmit = async (data: StudentFormData) => {
        try {
            await onSubmit(data);
            onClose();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" closeOnInteractOutside={false}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content bg="white" borderRadius="md" maxW="4xl" p="8" colorPalette="accent">
                    <Flex justifyContent="space-between" alignItems="center" mb="8">
                        <Text fontSize="2xl" fontWeight="bold">
                            {initialData ? "Edit Student" : "Add Student"}
                        </Text>
                        <Dialog.CloseTrigger asChild>
                            <Button  variant="ghost" size="xl" colorPalette="grey">
                                <X size={24} color="grey"/>
                            </Button>
                        </Dialog.CloseTrigger>
                    </Flex>

                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <form onSubmit={handleSubmit(onFormSubmit as any)}>
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                            <Field.Root invalid={!!errors.registrationNo}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Reg No.</Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("registrationNo")} placeholder="UAMS/2023/001" bg="white" />
                                <Field.ErrorText>{errors.registrationNo?.message}</Field.ErrorText>
                            </Field.Root>
                            
                            <Field.Root required invalid={!!errors.matricNumber}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Mat No. <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("matricNumber")} placeholder="2023/12345" bg="white" />
                                <Field.ErrorText>{errors.matricNumber?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root required invalid={!!errors.email}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Email <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("email")} placeholder="student@example.com" bg="white" />
                                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root required invalid={!!errors.firstName}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">First Name <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("firstName")} placeholder="John" bg="white" />
                                <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root required invalid={!!errors.surname}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Surname <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("surname")} placeholder="Doe" bg="white" />
                                <Field.ErrorText>{errors.surname?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.otherName}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Other Name</Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("otherName")} placeholder="Quincy" bg="white" />
                                <Field.ErrorText>{errors.otherName?.message}</Field.ErrorText>
                            </Field.Root>

                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Field.Root required invalid={!!errors.gender}>
                                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Gender <Field.RequiredIndicator /></Field.Label>
                                        <Select.Root 
                                            collection={GENDER_COLLECTION} 
                                            value={field.value ? [field.value] : []} 
                                            onValueChange={(e) => field.onChange(e.value[0] || "")} 
                                            size="lg"
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                    <Select.ValueText placeholder="Select gender" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator>
                                                        <ChevronDown size={16} color="#64748b" />
                                                    </Select.Indicator>
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {GENDER_COLLECTION.items.map((item) => (
                                                            <Select.Item item={item} key={item.value}>
                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                        <Field.ErrorText>{errors.gender?.message}</Field.ErrorText>
                                    </Field.Root>
                                )}
                            />

                            <Controller
                                name="level"
                                control={control}
                                render={({ field }) => (
                                    <Field.Root required invalid={!!errors.level}>
                                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Level <Field.RequiredIndicator /></Field.Label>
                                        <Select.Root 
                                            collection={LEVELS_COLLECTION} 
                                            value={field.value ? [field.value] : []} 
                                            onValueChange={(e) => field.onChange(e.value[0] || "")} 
                                            size="lg"
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                    <Select.ValueText placeholder="Select level" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator>
                                                        <ChevronDown size={16} color="#64748b" />
                                                    </Select.Indicator>
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {LEVELS_COLLECTION.items.map((item) => (
                                                            <Select.Item item={item} key={item.value}>
                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                        <Field.ErrorText>{errors.level?.message}</Field.ErrorText>
                                    </Field.Root>
                                )}
                            />

                            <Field.Root required invalid={!!errors.admissionMode}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Admission Mode <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("admissionMode")} placeholder="UTME" bg="white" />
                                <Field.ErrorText>{errors.admissionMode?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.admissionYear}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Admission Year</Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("admissionYear", { valueAsNumber: true })} placeholder="2023" type="number" bg="white" />
                                <Field.ErrorText>{errors.admissionYear?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.admissionSession}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Admission Session</Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("admissionSession")} placeholder="2023/2024" bg="white" />
                                <Field.ErrorText>{errors.admissionSession?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root required invalid={!!errors.entryQualification}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Entry Qualification <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("entryQualification")} placeholder="WASSCE" bg="white" />
                                <Field.ErrorText>{errors.entryQualification?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root required invalid={!!errors.faculty}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Faculty <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("faculty")} placeholder="Computing" bg="white" />
                                <Field.ErrorText>{errors.faculty?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root required invalid={!!errors.department}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Department <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("department")} placeholder="Computer Science" bg="white" />
                                <Field.ErrorText>{errors.department?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root required invalid={!!errors.degreeCourse}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Degree Course <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("degreeCourse")} placeholder="Computer Science" bg="white" />
                                <Field.ErrorText>{errors.degreeCourse?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root required invalid={!!errors.degreeAwardedCode}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Degree Awarded Code <Field.RequiredIndicator /></Field.Label>
                                <Input size="lg" border="xs" borderColor="border.muted" {...register("degreeAwardedCode")} placeholder="B.SC" bg="white" />
                                <Field.ErrorText>{errors.degreeAwardedCode?.message}</Field.ErrorText>
                            </Field.Root>

                            <Controller
                                name="degreeDuration"
                                control={control}
                                render={({ field }) => (
                                    <Field.Root required invalid={!!errors.degreeDuration}>
                                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Degree Duration <Field.RequiredIndicator /></Field.Label>
                                        <Select.Root 
                                            collection={DURATION_COLLECTION} 
                                            value={field.value ? [field.value] : []} 
                                            onValueChange={(e) => field.onChange(e.value[0] || "")} 
                                            size="lg"
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger bg="white" border="xs" borderColor="border.muted">
                                                    <Select.ValueText placeholder="Select duration" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator>
                                                        <ChevronDown size={16} color="#64748b" />
                                                    </Select.Indicator>
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content>
                                                        {DURATION_COLLECTION.items.map((item) => (
                                                            <Select.Item item={item} key={item.value}>
                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                        <Field.ErrorText>{errors.degreeDuration?.message}</Field.ErrorText>
                                    </Field.Root>
                                )}
                            />
                        </SimpleGrid>

                        <Flex justifyContent="flex-end" gap="3" mt="8" pt="6">
                            <Button type="button" onClick={onClose} size="xl" fontWeight="bold" color="fg.muted" bg="white" border="xs" borderColor="border.muted" borderRadius="md" cursor="pointer" _hover={{ bg: "slate.50" }}>
                                Cancel
                            </Button>
                            <Button type="submit" size="xl" fontWeight="bold" color="white" bg="#1D7AD9" borderRadius="md" disabled={!isValid || isSubmitting} cursor={isSubmitting || !isValid ? "not-allowed" : "pointer"} opacity={isSubmitting || !isValid ? 0.7 : 1} alignItems="center" gap="2">
                                {isSubmitting && <Spinner size="sm" />}
                                {initialData ? "Save Changes" : "Add Student"}
                            </Button>
                        </Flex>
                    </form>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default AddStudentForm;
