import { useEffect } from "react";
import { X } from "lucide-react";
import { 
    Box, 
    Flex, 
    Text, 
    Spinner, 
    Button, 
    Dialog, 
    Input,
    Field,
    SimpleGrid
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentSchema, type StudentFormData } from "@schemas/student.schema";

interface AddStudentFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StudentFormData) => Promise<void>;
    initialData?: any;
}

const AddStudentForm = ({ isOpen, onClose, onSubmit, initialData }: AddStudentFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<StudentFormData>({
        mode: "onChange",
        resolver: zodResolver(StudentSchema) as any,
        defaultValues: {
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
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                registrationNo: initialData.registrationNo || initialData.regNo || "",
                matricNumber: initialData.matricNumber || initialData.matNo || "",
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
                degreeAwardedCode: initialData.degreeAwardedCode || initialData.degreeAwarded || "",
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
                        <Text fontSize="2xl" fontWeight="bold" color="#1D7AD9">
                            {initialData ? "Edit Student" : "Add Student"}
                        </Text>
                        <Dialog.CloseTrigger asChild>
                            <Box as="button" p="2" _hover={{ bg: "fg.subtle" }} borderRadius="full" cursor="pointer" border="none" bg="transparent">
                                <X size={24} color="#94a3b8" />
                            </Box>
                        </Dialog.CloseTrigger>
                    </Flex>

                    <form onSubmit={handleSubmit(onFormSubmit as any)}>
                        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                            <Field.Root invalid={!!errors.registrationNo}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Reg No.</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("registrationNo")} placeholder="UAMS/2023/001" bg="white" />
                                <Field.ErrorText>{errors.registrationNo?.message}</Field.ErrorText>
                            </Field.Root>
                            
                            <Field.Root invalid={!!errors.matricNumber}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Mat No.</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("matricNumber")} placeholder="2023/12345" bg="white" />
                                <Field.ErrorText>{errors.matricNumber?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.email}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Email</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("email")} placeholder="student@example.com" bg="white" />
                                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.firstName}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">First Name</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("firstName")} placeholder="John" bg="white" />
                                <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.surname}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Surname</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("surname")} placeholder="Doe" bg="white" />
                                <Field.ErrorText>{errors.surname?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.otherName}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Other Name</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("otherName")} placeholder="Quincy" bg="white" />
                                <Field.ErrorText>{errors.otherName?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.gender}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Gender</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("gender")} placeholder="MALE" bg="white" />
                                <Field.ErrorText>{errors.gender?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.level}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Level</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("level")} placeholder="L100" bg="white" />
                                <Field.ErrorText>{errors.level?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.admissionMode}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Admission Mode</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("admissionMode")} placeholder="UTME" bg="white" />
                                <Field.ErrorText>{errors.admissionMode?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.admissionYear}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Admission Year</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("admissionYear")} placeholder="2023" bg="white" />
                                <Field.ErrorText>{errors.admissionYear?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.admissionSession}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Admission Session</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("admissionSession")} placeholder="2023/2024" bg="white" />
                                <Field.ErrorText>{errors.admissionSession?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.entryQualification}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Entry Qualification</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("entryQualification")} placeholder="WASSCE" bg="white" />
                                <Field.ErrorText>{errors.entryQualification?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.faculty}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Faculty</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("faculty")} placeholder="Computing" bg="white" />
                                <Field.ErrorText>{errors.faculty?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.department}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Department</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("department")} placeholder="Computer Science" bg="white" />
                                <Field.ErrorText>{errors.department?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.degreeCourse}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Degree Course</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("degreeCourse")} placeholder="Computer Science" bg="white" />
                                <Field.ErrorText>{errors.degreeCourse?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.degreeAwardedCode}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Degree Awarded Code</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("degreeAwardedCode")} placeholder="B.SC" bg="white" />
                                <Field.ErrorText>{errors.degreeAwardedCode?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.degreeDuration}>
                                <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Degree Duration</Field.Label>
                                <Input size="xl" border="xs" borderColor="border.muted" {...register("degreeDuration")} placeholder="4 Years" bg="white" />
                                <Field.ErrorText>{errors.degreeDuration?.message}</Field.ErrorText>
                            </Field.Root>
                        </SimpleGrid>

                        <Flex justifyContent="flex-end" gap="3" mt="8" pt="6">
                            <Button type="button" onClick={onClose} px="8" py="2.5" fontSize="sm" fontWeight="bold" color="fg.muted" bg="white" border="xs" borderColor="border.muted" borderRadius="md" cursor="pointer" _hover={{ bg: "slate.50" }}>
                                Cancel
                            </Button>
                            <Button type="submit" px="8" py="2.5" fontSize="sm" fontWeight="bold" color="white" bg="#1D7AD9" borderRadius="md" disabled={!isValid || isSubmitting} cursor={isSubmitting || !isValid ? "not-allowed" : "pointer"} opacity={isSubmitting || !isValid ? 0.7 : 1} alignItems="center" gap="2">
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
