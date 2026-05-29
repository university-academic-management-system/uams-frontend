import { useState, useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import { type ProgramTypeFormData } from "@schemas/program.schema";
import useProgramTypeForm from "@forms/programType.form";
import { ProgramHooks } from "@hooks/program.hook";
import { toaster } from "@components/ui/toaster";
import {
  Box,
  Flex,
  Text,
  Input,
  Textarea,
  Button,
  Select,
  Field,
  Portal,
  createListCollection,
  Table,
  Dialog,
  EmptyState,
  VStack,
  CloseButton,
  Popover,
} from "@chakra-ui/react";
import {Trash2, Plus, GraduationCap, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Pencil } from "lucide-react";

const typeCollection = createListCollection({
  items: [
    { label: "Diploma", value: "DIPLOMA" },
    { label: "Undergraduate", value: "UNDERGRADUATE" },
    { label: "Postgraduate", value: "POSTGRADUATE" },
    { label: "Sandwich", value: "SANDWICH" },
  ],
});

const ProgramTypeTab = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const createForm = useProgramTypeForm();
  const editForm = useProgramTypeForm({ type: "UNDERGRADUATE" });

  const { data: rawProgramTypes = [] } = ProgramHooks.useProgramTypes();
  const programTypes = useMemo(() => Array.isArray(rawProgramTypes) ? rawProgramTypes : (rawProgramTypes as { data?: typeof rawProgramTypes })?.data || [], [rawProgramTypes]);
  
  const { mutateAsync: createProgramType, isPending: isCreatingMut } = ProgramHooks.useCreateProgramType();
  const { mutateAsync: updateProgramType, isPending: isUpdatingMut } = ProgramHooks.useUpdateProgramType();
  const { mutateAsync: deleteProgramType, isPending: isDeletingMut } = ProgramHooks.useDeleteProgramType();

  const isSaving = isCreatingMut || isUpdatingMut || isDeletingMut;

  const handleEdit = useCallback((pt: { id: string; name: string; code?: string; type?: string; description?: string }) => {
    setEditingId(pt.id);
    editForm.reset({
      name: pt.name,
      code: pt.code || "",
      type: pt.type || "UNDERGRADUATE",
      description: pt.description || "",
    });
  }, [editForm]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    editForm.reset();
  }, [editForm]);

  const handleCreate = useCallback(async (data: ProgramTypeFormData) => {
    try {
      await createProgramType({
        id: data.code.toLowerCase(),
        code: data.code,
        name: data.name,
        type: data.type.toUpperCase(),
      });
      toaster.success({ title: "Programme Type created successfully" });
      createForm.reset();
      setIsCreating(false);
    } catch {
      // Error toast handled by axios interceptor
    }
  }, [createForm, createProgramType]);

  const handleCancelCreate = useCallback(() => {
    createForm.reset();
    setIsCreating(false);
  }, [createForm]);

  const handleSave = useCallback(async (data: ProgramTypeFormData) => {
    if (!editingId) return;
    try {
      await updateProgramType({ id: editingId, data });
      toaster.success({ title: "Programme type updated" });
      handleCancel();
    } catch {
      // Error toast handled by axios interceptor
    }
  }, [editingId, handleCancel, updateProgramType]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Delete this programme type?")) {
      try {
        await deleteProgramType(id);
        toaster.success({ title: "Programme type deleted" });
      } catch {
        // Error toast handled by axios interceptor
      }
    }
  }, [deleteProgramType]);


  const requestSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  }, []);

  const renderSortIcon = useCallback((key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown size={14} color="#94a3b8" style={{ marginLeft: "4px" }} />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} color="#2563eb" style={{ marginLeft: "4px" }} />
    ) : (
      <ArrowDown size={14} color="#2563eb" style={{ marginLeft: "4px" }} />
    );
  }, [sortConfig]);

  const sortedProgramTypes = useMemo(() => {
    const sortable = [...programTypes];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        const key = sortConfig.key as keyof typeof a;
        let valA: string = String(a[key] ?? "");
        let valB: string = String(b[key] ?? "");

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [programTypes, sortConfig]);



  return (
    <Flex direction="column" gap="8">
      <Flex position="absolute" top="0" right="0" zIndex="10">
        <Button
          colorPalette="accent"
          onClick={() => setIsCreating(true)}
          size="xl"
          fontSize="sm"
        >
          <Plus size={16} /> Create Programme Type
        </Button>
      </Flex>
      {/* Create Form Dialog */}
      <Dialog.Root
        open={isCreating}
        onOpenChange={(e) => {
          setIsCreating(e.open);
          if (!e.open) handleCancelCreate();
        }}
        size="lg"
        placement="center"
        closeOnInteractOutside={false}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="sm" border="xs" borderColor="border.muted" overflow="hidden" colorPalette="accent">
              <form onSubmit={createForm.handleSubmit(handleCreate)} style={{ width: '100%' }}>
                <Dialog.CloseTrigger asChild>
                  <CloseButton colorPalette="gray" />
                </Dialog.CloseTrigger>
                <Dialog.Header p="6">
                  <VStack align="start" gap={1}>
                    <Dialog.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.muted"
                    >
                      Create Programme Type
                    </Dialog.Title>
                    <Text fontSize="sm" color="fg.subtle">
                      Add a new programme type to the system (e.g., Bachelor of Science, Master of Arts)
                    </Text>
                  </VStack>
                </Dialog.Header>
                <Dialog.Body p="8">
                  <VStack align="stretch" gap="6">
                    <Field.Root invalid={!!createForm.formState.errors.name}>
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Name</Field.Label>
                      <Input
                        {...createForm.register("name")}
                        placeholder="e.g. Bachelor of Science"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                      <Field.ErrorText>{createForm.formState.errors.name?.message}</Field.ErrorText>
                    </Field.Root>

                    <Flex gap="6">
                      <Field.Root invalid={!!createForm.formState.errors.code} flex="1">
                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Code</Field.Label>
                        <Input
                          {...createForm.register("code")}
                          placeholder="e.g. BSC"
                          size="xl"
                          _placeholder={{ color: "fg.subtle" }}
                        />
                        <Field.ErrorText>{createForm.formState.errors.code?.message}</Field.ErrorText>
                      </Field.Root>
  
                      <Field.Root invalid={!!createForm.formState.errors.type} flex="1">
                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Type</Field.Label>
                        <Controller
                          control={createForm.control}
                          name="type"
                          render={({ field }) => (
                            <Select.Root
                              collection={typeCollection}
                              value={field.value ? [field.value] : []}
                              onValueChange={(e) => field.onChange(e.value[0])}
                              size="lg"
                              colorPalette="accent"
                            >
                              <Select.HiddenSelect />
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="Select type" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                  <Select.Indicator />
                                </Select.IndicatorGroup>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content>
                                    {typeCollection.items.length === 0 ? (
                                      <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                        No options available
                                      </Box>
                                    ) : (
                                      typeCollection.items.map((item: { label: string; value: string }) => (
                                        <Select.Item key={item.value} item={item}>
                                          <Select.ItemText>{item.label}</Select.ItemText>
                                          <Select.ItemIndicator />
                                        </Select.Item>
                                      ))
                                    )}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                          )}
                        />
                        <Field.ErrorText>{createForm.formState.errors.type?.message}</Field.ErrorText>
                      </Field.Root>
                    </Flex>

                    <Field.Root invalid={!!createForm.formState.errors.description}>
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Description</Field.Label>
                      <Textarea
                        {...createForm.register("description")}
                        rows={4}
                        size="xl"
                        placeholder="Optional description"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                      <Field.ErrorText>{createForm.formState.errors.description?.message}</Field.ErrorText>
                    </Field.Root>
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer p="6" gap="3">
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      colorPalette="gray"
                      size="xl"
                    >
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    type="submit"
                    loading={isSaving}
                    loadingText="Creating..."
                    disabled={!createForm.formState.isValid || isSaving}
                    size="xl"
                  >
                    <Plus size={16} /> Create Programme Type
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Edit Form Dialog */}
      <Dialog.Root
        open={!!editingId}
        onOpenChange={(e) => {
          if (!e.open) handleCancel();
        }}
        size="lg"
        placement="center"
        closeOnInteractOutside={false}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="sm" border="xs" borderColor="border.muted" overflow="hidden" colorPalette="accent">
              <form onSubmit={editForm.handleSubmit(handleSave)} style={{ width: '100%' }}>
                <Dialog.CloseTrigger asChild>
                  <CloseButton colorPalette="gray" />
                </Dialog.CloseTrigger>
                <Dialog.Header p="6">
                  <VStack align="start" gap={1}>
                    <Dialog.Title fontSize="lg" fontWeight="bold" color="fg.muted">
                      Edit Programme Type
                    </Dialog.Title>
                    <Text fontSize="sm" color="fg.muted">
                      Update the details of the existing programme type.
                    </Text>
                  </VStack>
                </Dialog.Header>
                <Dialog.Body p="8">
                  <VStack align="stretch" gap="6">
                    <Field.Root invalid={!!editForm.formState.errors.name}>
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Name</Field.Label>
                      <Input
                        {...editForm.register("name")}
                        placeholder="e.g. Bachelor of Science"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                      <Field.ErrorText>{editForm.formState.errors.name?.message}</Field.ErrorText>
                    </Field.Root>

                    <Flex gap="6">
                      <Field.Root invalid={!!editForm.formState.errors.code} flex="1">
                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Code</Field.Label>
                        <Input
                          {...editForm.register("code")}
                          placeholder="e.g. BSC"
                          size="xl"
                          _placeholder={{ color: "fg.subtle" }}
                        />
                        <Field.ErrorText>{editForm.formState.errors.code?.message}</Field.ErrorText>
                      </Field.Root>
  
                      <Field.Root invalid={!!editForm.formState.errors.type} flex="1">
                        <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Type</Field.Label>
                        <Controller
                          control={editForm.control}
                          name="type"
                          render={({ field }) => (
                            <Select.Root
                              collection={typeCollection}
                              value={field.value ? [field.value] : []}
                              onValueChange={(e) => field.onChange(e.value[0])}
                              size="lg"
                              colorPalette="accent"
                            >
                              <Select.HiddenSelect />
                              <Select.Control>
                                <Select.Trigger>
                                  <Select.ValueText placeholder="Select type" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                  <Select.Indicator />
                                </Select.IndicatorGroup>
                              </Select.Control>
                              <Portal>
                                <Select.Positioner>
                                  <Select.Content>
                                    {typeCollection.items.length === 0 ? (
                                      <Box px="4" py="3" textAlign="center" color="fg.muted" fontSize="sm">
                                        No options available
                                      </Box>
                                    ) : (
                                      typeCollection.items.map((item: { label: string; value: string }) => (
                                        <Select.Item key={item.value} item={item}>
                                          <Select.ItemText>{item.label}</Select.ItemText>
                                          <Select.ItemIndicator />
                                        </Select.Item>
                                      ))
                                    )}
                                  </Select.Content>
                                </Select.Positioner>
                              </Portal>
                            </Select.Root>
                          )}
                        />
                        <Field.ErrorText>{editForm.formState.errors.type?.message}</Field.ErrorText>
                      </Field.Root>
                    </Flex>

                    <Field.Root invalid={!!editForm.formState.errors.description}>
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Description</Field.Label>
                      <Textarea
                        {...editForm.register("description")}
                        rows={4}
                        size="xl"
                        placeholder="Optional description"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                      <Field.ErrorText>{editForm.formState.errors.description?.message}</Field.ErrorText>
                    </Field.Root>
                  </VStack>
                </Dialog.Body>
                <Dialog.Footer p="6" gap="3">
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      colorPalette="gray"
                      size="xl"
                    >
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    type="submit"
                    loading={isSaving}
                    loadingText="Saving..."
                    disabled={!editForm.formState.isValid || isSaving}
                    size="xl"
                  >
                    Save Changes
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Table */}
      <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" overflow="hidden">

        <Table.ScrollArea w="full">
          <Table.Root size="sm" variant="outline" border="none" colorPalette="accent">
            <Table.Header bg=" bg.subtle">
              <Table.Row borderColor="border.muted">
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  w="16"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("sn")}
                  userSelect="none"
                  _hover={{ bg: "slate.100" }}
                >
                  <Flex alignItems="center" gap="1">
                    S/N {renderSortIcon("sn")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("name")}
                  userSelect="none"
                  _hover={{ bg: "slate.100" }}
                >
                  <Flex alignItems="center" gap="1">
                    NAME {renderSortIcon("name")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("code")}
                  userSelect="none"
                  _hover={{ bg: "slate.100" }}
                >
                  <Flex alignItems="center" gap="1">
                    CODE {renderSortIcon("code")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  px="6"
                  py="4"
                  fontSize="11px"
                  fontWeight="bold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  cursor="pointer"
                  onClick={() => requestSort("type")}
                  userSelect="none"
                  _hover={{ bg: "slate.100" }}
                >
                  <Flex alignItems="center" gap="1">
                    TYPE {renderSortIcon("type")}
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" textAlign="center">ACTIONS</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {programTypes.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} py="12">
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <GraduationCap size={40} />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>
                            No Programme Types Found
                          </EmptyState.Title>
                          <EmptyState.Description>
                            Add a new programme type to start organizing your
                            academic structure.
                          </EmptyState.Description>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              ) : (
                sortedProgramTypes.map((pt, index) => (
                  <Table.Row
                    key={pt.id}
                    _hover={{ bg: "slate.50" }}
                    borderColor="border.muted"
                    fontSize="sm"
                    color="fg.muted"
                  >
                    <Table.Cell px="6" py="4">{index + 1}</Table.Cell>
                    <Table.Cell px="6" py="4" fontWeight="medium">{pt.name}</Table.Cell>
                    <Table.Cell px="6" py="4">{pt.code || "—"}</Table.Cell>
                    <Table.Cell px="6" py="4">{pt.type || "—"}</Table.Cell>
                    <Table.Cell px="6" py="4" textAlign="center">
                      <Popover.Root
                        positioning={{ placement: "bottom-end" }}
                        open={openPopoverId === pt.id}
                        onOpenChange={(e) => setOpenPopoverId(e.open ? pt.id : null)}
                      >
                        <Popover.Trigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            px="0"
                            color="fg.subtle"
                          >
                            <MoreHorizontal size={20} />
                          </Button>
                        </Popover.Trigger>
                        <Portal>
                          <Popover.Positioner zIndex="popover">
                            <Popover.Content
                              bg="white"
                              borderRadius="md"
                              boxShadow="md"
                              border="xs"
                              borderColor="border.muted"
                              w="48"
                              overflow="hidden"
                              outline="none"
                            >
                              <Popover.Body p="1">
                                <Button
                                  variant="ghost"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setOpenPopoverId(null);
                                    handleEdit(pt);
                                  }}
                                  w="full"
                                  justifyContent="flex-start"
                                  size="sm"
                                >
                                  <Pencil size={16} /> Edit details
                                </Button>
                                <Button
                                  variant="ghost"
                                  colorPalette="red"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    setOpenPopoverId(null);
                                    handleDelete(pt.id);
                                  }}
                                  w="full"
                                  justifyContent="flex-start"
                                  size="sm"
                                >
                                  <Trash2 size={16} /> Delete programme
                                </Button>
                              </Popover.Body>
                            </Popover.Content>
                          </Popover.Positioner>
                        </Portal>
                      </Popover.Root>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>


    </Flex>
  );
};

export default ProgramTypeTab;
