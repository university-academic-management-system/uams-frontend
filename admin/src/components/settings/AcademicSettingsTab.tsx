import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramTypeSchema, type ProgramTypeFormData } from "@schemas/program.schema";
import { Plus, GraduationCap } from "lucide-react";
import { ProgramServices } from "@services/program.service";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Input, Button, Field } from "@chakra-ui/react";

const AcademicSettingsTab = () => {
    const [isSaving, setIsSaving] = useState(false);
    
    const form = useForm<ProgramTypeFormData>({
        mode: "onChange",
        resolver: zodResolver(ProgramTypeSchema),
        defaultValues: { name: "", code: "", type: "", description: "" }
    });

    const handleCancel = () => {
        form.reset({ name: "", code: "", type: "", description: "" });
    };

    const handleSave = async (data: ProgramTypeFormData) => {
        try {
            setIsSaving(true);
            await ProgramServices.createProgramType({ ...data, type: data.type.toUpperCase() });
            toaster.success({ title: "Program Type created successfully" });
            handleCancel();
        } catch (error: any) {
            // Error toast handled by axios interceptor
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Flex direction="column" gap="8">
            <Box bg="white" borderRadius="2xl" border="xs" borderColor="border.muted" overflow="hidden" colorPalette="accent">
                <Flex p="6" borderBottom="xs" borderColor="border.muted" alignItems="center" gap="3">
                    <Flex bg="blue.50" p="2" borderRadius="lg"><GraduationCap size={20} color="#2563eb" /></Flex>
                    <Box>
                        <Text fontSize="lg" fontWeight="bold" color="fg.muted">Create Program Type</Text>
                        <Text fontSize="sm" color="fg.muted">Add a new program type to the system (e.g., Bachelor of Science, Master of Arts)</Text>
                    </Box>
                </Flex>

                <form onSubmit={form.handleSubmit(handleSave)}>
                    <Box p="8">
                        <Flex direction={{ base: "column", lg: "row" }} gap="8">
                            <Flex direction="column" gap="6" flex="1">
                                <Field.Root invalid={!!form.formState.errors.name}>
                                    <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Name</Field.Label>
                                    <Input {...form.register("name")} placeholder="e.g. Bachelor of Science" bg="slate.50" border="xs" borderColor="border.muted" borderRadius="lg" />
                                    <Field.ErrorText>{form.formState.errors.name?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root invalid={!!form.formState.errors.code}>
                                    <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Code</Field.Label>
                                    <Input {...form.register("code")} placeholder="e.g. BSC" bg="slate.50" border="xs" borderColor="border.muted" borderRadius="lg" />
                                    <Field.ErrorText>{form.formState.errors.code?.message}</Field.ErrorText>
                                </Field.Root>
                            </Flex>
                            <Flex direction="column" gap="6" flex="1">
                                <Field.Root invalid={!!form.formState.errors.type}>
                                    <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Type</Field.Label>
                                    <Input {...form.register("type")} placeholder="e.g. UNDERGRADUATE, POST-GRADUATE" bg="slate.50" border="xs" borderColor="border.muted" borderRadius="lg" />
                                    <Field.ErrorText>{form.formState.errors.type?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root invalid={!!form.formState.errors.description}>
                                    <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Description</Field.Label>
                                    <textarea {...form.register("description")} rows={3} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} placeholder="Optional description" />
                                    <Field.ErrorText>{form.formState.errors.description?.message}</Field.ErrorText>
                                </Field.Root>
                            </Flex>
                        </Flex>

                        <Flex wrap="wrap" justifyContent="flex-end" gap="3" mt="8">
                            <Button type="button" onClick={handleCancel} px="8" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="medium" variant="outline" borderColor="border.muted" color="fg.muted" cursor="pointer" _hover={{ bg: "slate.50" }}>Clear</Button>
                            <Button type="submit" loading={isSaving} disabled={!form.formState.isValid || isSaving} px="8" py="2.5" borderRadius="lg" fontSize="sm" fontWeight="bold" bg="#00B01D" color="white" cursor="pointer" _hover={{ bg: "green.700" }}>
                                {isSaving ? "Creating..." : <><Plus size={16} /> Create Program Type</>}
                            </Button>
                        </Flex>
                    </Box>
                </form>
            </Box>

            {/* Info Note */}
            <Flex bg="blue.50" border="xs" borderColor="blue.100" borderRadius="xl" p="4" alignItems="flex-start" gap="3">
                <Flex bg="blue.100" p="1.5" borderRadius="full" mt="0.5"><GraduationCap size={14} color="#2563eb" /></Flex>
                <Box>
                    <Text fontSize="sm" fontWeight="medium" color="blue.800">Note</Text>
                    <Text fontSize="sm" color="blue.700">
                        Program types are typically created once during initial setup. To view and manage existing program types, go to <Text as="span" fontWeight="semibold">Programs & Courses → Program Types</Text>.
                    </Text>
                </Box>
            </Flex>
        </Flex>
    );
};

export default AcademicSettingsTab;
