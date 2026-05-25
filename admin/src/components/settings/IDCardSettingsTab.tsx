import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Edit2, Trash2, CheckCircle } from "lucide-react";
import { IDCardServices } from "@services/idcard.service";
import { toaster } from "@components/ui/toaster";
import { Box, Flex, Text, Image, Spinner, Table, Button, Badge, Dialog, Portal, CloseButton, EmptyState, Field, Input, Textarea, Stack } from "@chakra-ui/react";
import { useIDCardForm } from "@forms/idcard.form";
import type { IDCardFormData } from "@schemas/idcard.schema";

const UploadBox = ({ label, type, preview, fileRef, onFileChange }: { label: string; type: string; preview: string; fileRef: React.RefObject<HTMLInputElement | null>; onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void }) => {
    return (
        <Box>
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">{label}</Text>
            <Flex
                border="2px dashed" borderColor="border.muted" borderRadius="md" p="4"
                alignItems="center" justifyContent="center" minH="120px" bg="slate.50"
                cursor="pointer" _hover={{ borderColor: "blue.300", bg: "blue.50" }}
                transition="all 0.2s" onClick={() => fileRef?.current?.click()} position="relative"
            >
                <input type="file" accept="image/*" ref={fileRef} onChange={(e) => onFileChange(e, type)} style={{ display: "none" }} />
                {preview ? (
                    <Image src={preview} alt={label} maxH="100px" maxW="200px" objectFit="contain" borderRadius="md" />
                ) : (
                    <Flex direction="column" alignItems="center" gap="2">
                        <Upload size={24} color="#94a3b8" />
                        <Text fontSize="xs" color="fg.subtle">Click to upload (max 70KB)</Text>
                    </Flex>
                )}
            </Flex>
        </Box>
    );
};

const IDCardSettingsTab = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [templateId, setTemplateId] = useState("");
    const queryClient = useQueryClient();
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

    const idCardForm = useIDCardForm();
    const { register, watch, reset, setValue, formState: { errors, isValid } } = idCardForm;
    const formData = watch();

    const [initialFormData, setInitialFormData] = useState<IDCardFormData | null>(null);

    const logoRef = useRef<HTMLInputElement>(null);
    const signatureRef = useRef<HTMLInputElement>(null);
    const frontTemplateRef = useRef<HTMLInputElement>(null);
    const backTemplateRef = useRef<HTMLInputElement>(null);

    // Store existing image URLs for preview
    const [existingUrls, setExistingUrls] = useState<Record<string, string>>({});

    type IDCardTemplate = {
        id: string;
        name?: string;
        institutionName?: string;
        institutionAddress?: string;
        faculties?: { name: string }[];
        departments?: { name: string }[];
        backDescription?: string;
        backDisclaimer?: string;
        logo?: string;
        hodSignature?: string;
        signature?: string;
        frontTemplate?: string;
        frontCardTemplate?: string;
        backTemplate?: string;
        backCardTemplate?: string;
        isDefault?: boolean;
        status?: string;
    };

    const { data: templatesData, isLoading } = useQuery({
        queryKey: ["idCardTemplates"],
        queryFn: async (): Promise<IDCardTemplate[]> => {
            const data = await IDCardServices.getAllIDCard();
            return data?.success && data.templates ? data.templates : [];
        }
    });

    const templates: IDCardTemplate[] = templatesData || [];

    const handleEdit = useCallback((t: IDCardTemplate) => {
        setTemplateId(t.id || "");
        const fd = {
            schoolName: t.institutionName || "",
            faculty: t.faculties?.[0]?.name || "",
            department: t.departments?.[0]?.name || "",
            schoolAddress: t.institutionAddress || "",
            backDescription: t.backDescription || "",
            backDisclaimer: t.backDisclaimer || "",
        };
        reset(fd);
        setInitialFormData(fd);
        setExistingUrls({
            logo: t.logo || "",
            signature: t.hodSignature || t.signature || "",
            frontTemplate: t.frontTemplate || t.frontCardTemplate || "",
            backTemplate: t.backTemplate || t.backCardTemplate || "",
        });
        setPreviews({});
        setFiles({});
        setIsFormVisible(true);
    }, [reset]);

    const handleCreateNew = useCallback(() => {
        setTemplateId("");
        reset({
            schoolName: "",
            faculty: "",
            department: "",
            schoolAddress: "",
            backDescription: "",
            backDisclaimer: "",
        });
        setInitialFormData(null);
        setExistingUrls({});
        setPreviews({});
        setFiles({});
        setIsFormVisible(true);
    }, [reset]);

    const deleteMutation = useMutation({
        mutationFn: (id: string) => IDCardServices.deleteIDCard(id, {}),
        onSuccess: (_, id) => {
            toaster.success({ title: "Template deleted safely" });
            if (templateId === id) handleCreateNew();
            queryClient.invalidateQueries({ queryKey: ["idCardTemplates"] });
        },
        onSettled: () => setTemplateToDelete(null)
    });

    const activateMutation = useMutation({
        mutationFn: (id: string) => IDCardServices.activateIDCard(id, {}),
        onSuccess: () => {
            toaster.success({ title: "Template set as default" });
            queryClient.invalidateQueries({ queryKey: ["idCardTemplates"] });
        }
    });

    const handleDelete = useCallback((id: string) => {
        deleteMutation.mutate(id);
    }, [deleteMutation]);

    const handleActivate = useCallback((id: string) => {
        activateMutation.mutate(id);
    }, [activateMutation]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 70 * 1024) {
            toaster.error({ title: "File too large. Max size is 70KB." });
            e.target.value = "";
            return;
        }
        setFiles((prev) => ({ ...prev, [type]: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
        reader.readAsDataURL(file);
    }, []);

    const convertFileToBase64 = useCallback((file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }, []);

    const saveMutation = useMutation({
        mutationFn: async ({ id, payload }: { id?: string, payload: Record<string, unknown> }) => {
            if (id) {
                return await IDCardServices.updateIDCard(id, payload);
            } else {
                return await IDCardServices.createIDCard(payload);
            }
        },
        onSuccess: () => {
            toaster.success({ title: "ID Card settings updated" });
            setFiles({});
            setPreviews({});
            setIsFormVisible(false);
            queryClient.invalidateQueries({ queryKey: ["idCardTemplates"] });
        }
    });

    const onSubmit = idCardForm.handleSubmit(async (data: IDCardFormData) => {
        try {
            const currentTemplate = templateId ? templates.find(t => t.id === templateId) : null;
            const payload: Record<string, unknown> = {
                name: currentTemplate?.name || `Template ${templates.length + 1}`,
                isDefault: currentTemplate?.isDefault ?? false,
                status: currentTemplate?.status || "ACTIVE",
            };

            // Only send changed text fields
            if (!initialFormData || data.schoolName !== initialFormData.schoolName) payload.institutionName = data.schoolName;
            if (!initialFormData || data.schoolAddress !== initialFormData.schoolAddress) payload.institutionAddress = data.schoolAddress;
            if (!initialFormData || data.department !== initialFormData.department) payload.department = data.department;
            if (!initialFormData || data.faculty !== initialFormData.faculty) payload.faculty = data.faculty;
            if (!initialFormData || data.backDescription !== initialFormData.backDescription) payload.backDescription = data.backDescription;
            if (!initialFormData || data.backDisclaimer !== initialFormData.backDisclaimer) payload.backDisclaimer = data.backDisclaimer;

            // Convert files to base64
            if (files.logo) payload.logo = await convertFileToBase64(files.logo);
            if (files.signature) payload.hodSignature = await convertFileToBase64(files.signature);
            if (files.frontTemplate) payload.frontTemplate = await convertFileToBase64(files.frontTemplate);
            if (files.backTemplate) payload.backTemplate = await convertFileToBase64(files.backTemplate);

            saveMutation.mutate({ id: templateId, payload });
        } catch (err: unknown) {
            console.error("Failed to save template:", err);
        }
    });

    if (isLoading) {
        return <Flex justifyContent="center" py="20"><Spinner size="lg" color="blue.500" /></Flex>;
    }





    return (
        <Flex direction="column" gap="8">
            {/* Templates Table Section */}
            <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" p={{ base: "4", md: "8" }}>
                <Flex justifyContent="space-between" alignItems={{ base: "flex-start", sm: "center" }} direction={{ base: "column", sm: "row" }} mb="6" gap="4">
                    <Text fontSize="lg" fontWeight="bold" color="fg.muted">Available Templates</Text>
                    <Button
                        colorPalette="accent"
                        size="xl"
                        onClick={handleCreateNew}
                    >
                        + Create New Template
                    </Button>
                </Flex>
                <Box overflowX="auto">
                    <Table.Root variant="outline">
                        <Table.Header bg="bg.subtle">
                            <Table.Row borderY="xs" borderColor="border.muted">
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">School Name</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Faculty</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Department</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider">Status</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" textAlign="right">Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {templates.map((t) => (
                                <Table.Row key={t.id}>
                                    <Table.Cell>{t.institutionName || "-"}</Table.Cell>
                                    <Table.Cell>{t.faculties?.[0]?.name || "-"}</Table.Cell>
                                    <Table.Cell>{t.departments?.[0]?.name || "-"}</Table.Cell>
                                    <Table.Cell>
                                        {t.isDefault ? (
                                            <Badge color="white" bg="#10b645ff">Default</Badge>
                                        ) : (
                                            <Badge color="white" bg="#87898bff">Inactive</Badge>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                        <Flex gap="2" justifyContent="flex-end">
                                            {!t.isDefault && (
                                                <Button size="xs" colorPalette="green" variant="ghost" title="Set as Default" onClick={() => handleActivate(t.id)}>
                                                    <CheckCircle size={16} />
                                                </Button>
                                            )}
                                            <Button size="xs" colorPalette="accent" variant="ghost" title="Edit" onClick={() => handleEdit(t)}>
                                                <Edit2 size={16} />
                                            </Button>

                                            <Dialog.Root 
                                                open={templateToDelete === t.id} 
                                                onOpenChange={(e) => setTemplateToDelete(e.open ? t.id : null)}
                                                placement="center" closeOnInteractOutside={false}
                                            >
                                                <Dialog.Trigger asChild>
                                                    <Button size="xs" colorPalette="red" variant="ghost" title="Delete">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </Dialog.Trigger>
                                                <Portal>
                                                    <Dialog.Backdrop />
                                                    <Dialog.Positioner>
                                                        <Dialog.Content colorPalette="accent">
                                                            <Dialog.Header>
                                                                <Dialog.Title>Confirm Deletion</Dialog.Title>
                                                            </Dialog.Header>
                                                            <Dialog.Body>
                                                                <Text>
                                                                    Are you sure you want to delete <b>{t.name || "this template"}</b>? 
                                                                    This action cannot be undone.
                                                                </Text>
                                                            </Dialog.Body>
                                                            <Dialog.Footer w="full" justifyContent="flex-end">
                                                                <Dialog.ActionTrigger asChild>
                                                                    <Button variant="outline">Cancel</Button>
                                                                </Dialog.ActionTrigger>
                                                                <Button colorPalette="red" onClick={() => handleDelete(t.id)}>
                                                                    Delete Template
                                                                </Button>
                                                            </Dialog.Footer>
                                                            <Dialog.CloseTrigger asChild>
                                                                <CloseButton size="sm" />
                                                            </Dialog.CloseTrigger>
                                                        </Dialog.Content>
                                                    </Dialog.Positioner>
                                                </Portal>
                                            </Dialog.Root>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                            {templates.length === 0 && (
                                <Table.Row>
                                    <Table.Cell colSpan={5}>
                                        <EmptyState.Root>
                                            <EmptyState.Content>
                                                <EmptyState.Indicator>
                                                    <Upload size={40} />
                                                </EmptyState.Indicator>
                                                <EmptyState.Title>No Templates Found</EmptyState.Title>
                                                <EmptyState.Description>
                                                    Create your first ID card template to get started
                                                </EmptyState.Description>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Box>

            <Dialog.Root 
                open={isFormVisible} 
                onOpenChange={(e) => setIsFormVisible(e.open)}
                size="lg"
                placement="center" closeOnInteractOutside={false}
                scrollBehavior="inside"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>
                                    {templateId ? "Edit Template Details" : "Create New Template"}
                                </Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Flex direction="column" gap="5" colorPalette="accent">
                                    <Flex gap="6" direction={{ base: "column", md: "row" }}>
                                        <Field.Root flex="1" invalid={!!errors.schoolName}>
                                            <Field.Label>School Name</Field.Label>
                                            <Input
                                                {...register("schoolName")}
                                                placeholder="University name"
                                                size="xl"
                                            />
                                            <Field.ErrorText>{errors.schoolName?.message}</Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root flex="1" invalid={!!errors.faculty}>
                                            <Field.Label>Faculty</Field.Label>
                                            <Input
                                                {...register("faculty")}
                                                placeholder="Faculty name"
                                                size="xl"
                                            />
                                            <Field.ErrorText>{errors.faculty?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Flex>
                                    <Flex gap="6" direction={{ base: "column", md: "row" }}>
                                        <Field.Root flex="1" invalid={!!errors.department}>
                                            <Field.Label>Department</Field.Label>
                                            <Input
                                                {...register("department")}
                                                placeholder="Department name"
                                                size="xl"
                                            />
                                            <Field.ErrorText>{errors.department?.message}</Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root flex="1" invalid={!!errors.schoolAddress}>
                                            <Field.Label>School Address</Field.Label>
                                            <Input
                                                {...register("schoolAddress")}
                                                placeholder="School address"
                                                size="xl"
                                            />
                                            <Field.ErrorText>{errors.schoolAddress?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Flex>

                                    {/* Templates */}
                                    <Box borderRadius="md" border="xs" borderColor="border.muted" p="6">
                                        <Text fontSize="md" fontWeight="bold" color="fg.muted" mb="6">Card Templates</Text>
                                        <Flex direction={{ base: "column", md: "row" }} gap="6">
                                            <Box flex="1"><UploadBox label="Front Template" type="frontTemplate" preview={previews.frontTemplate || existingUrls.frontTemplate} fileRef={frontTemplateRef} onFileChange={handleFileChange} /></Box>
                                            <Box flex="1"><UploadBox label="Back Template" type="backTemplate" preview={previews.backTemplate || existingUrls.backTemplate} fileRef={backTemplateRef} onFileChange={handleFileChange} /></Box>
                                        </Flex>
                                    </Box>

                                    {/* Branding */}
                                    <Box borderRadius="md" border="xs" borderColor="border.muted" p="6">
                                        <Text fontSize="md" fontWeight="bold" color="fg.muted" mb="6">Branding</Text>
                                        <Flex direction={{ base: "column", md: "row" }} gap="6">
                                            <Box flex="1"><UploadBox label="University Logo" type="logo" preview={previews.logo || existingUrls.logo} fileRef={logoRef} onFileChange={handleFileChange} /></Box>
                                            <Box flex="1"><UploadBox label="HOD Signature" type="signature" preview={previews.signature || existingUrls.signature} fileRef={signatureRef} onFileChange={handleFileChange} /></Box>
                                        </Flex>
                                    </Box>

                                    {/* Back Card Text */}
                                    <Box borderRadius="md" border="xs" borderColor="border.muted" p="6">
                                        <Text fontSize="md" fontWeight="bold" color="fg.muted" mb="6">Back Card Content</Text>
                                        <Stack gap="6">
                                            <Field.Root invalid={!!errors.backDescription}>
                                                <Flex justifyContent="space-between" mb="2" width="full">
                                                    <Field.Label mb="0">Description</Field.Label>
                                                    <Text fontSize="xs" color="fg.subtle">{formData.backDescription?.length || 0}/120</Text>
                                                </Flex>
                                                <Textarea
                                                    {...register("backDescription", { onChange: (e) => setValue("backDescription", e.target.value.slice(0, 120)) })}
                                                    placeholder="Description on back of card"
                                                    size="xl"
                                                    rows={3}
                                                    resize="none"
                                                    bg="white"
                                                />
                                                <Field.ErrorText>{errors.backDescription?.message}</Field.ErrorText>
                                            </Field.Root>
                                            <Field.Root invalid={!!errors.backDisclaimer}>
                                                <Flex justifyContent="space-between" mb="2" width="full">
                                                    <Field.Label mb="0">Disclaimer</Field.Label>
                                                    <Text fontSize="xs" color="fg.subtle">{formData.backDisclaimer?.length || 0}/95</Text>
                                                </Flex>
                                                <Textarea
                                                    {...register("backDisclaimer", { onChange: (e) => setValue("backDisclaimer", e.target.value.slice(0, 95)) })}
                                                    placeholder="Disclaimer text"
                                                    size="xl"
                                                    rows={3}
                                                    resize="none"
                                                    bg="white"
                                                />
                                                <Field.ErrorText>{errors.backDisclaimer?.message}</Field.ErrorText>
                                            </Field.Root>
                                        </Stack>
                                    </Box>
                                </Flex>
                            </Dialog.Body>
                            <Dialog.Footer gap="3">
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline" size="xl">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    onClick={onSubmit}
                                    loading={saveMutation.isPending}
                                    loadingText="Saving..."
                                    disabled={saveMutation.isPending || !isValid}
                                    colorPalette="accent"
                                    size="xl"
                                >
                                    Save Changes
                                </Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="xl" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

        <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
    </Flex>
);
};

export default IDCardSettingsTab;
