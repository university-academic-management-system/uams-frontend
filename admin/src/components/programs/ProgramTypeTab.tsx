import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramTypeSchema, type ProgramTypeFormData } from "@schemas/program.schema";
import { ProgramServices } from "@services/program.service";
import { toaster } from "@components/ui/toaster";
import {
  Box,
  Flex,
  Text,
  Input,
  Spinner,
  Textarea,
  Button,
  Select,
  Field,
  Portal,
  createListCollection,
  Table,
  Dialog,
  EmptyState,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { Edit, Trash2, X, Plus, GraduationCap, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const typeCollection = createListCollection({
  items: [
    { label: "Diploma", value: "DIPLOMA" },
    { label: "Undergraduate", value: "UNDERGRADUATE" },
    { label: "Postgraduate", value: "POSTGRADUATE" },
    { label: "Sandwich", value: "SANDWICH" },
  ],
});

const ProgramTypeTab = () => {
  const [programTypes, setProgramTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const createForm = useForm<ProgramTypeFormData>({
    mode: "onChange",
    resolver: zodResolver(ProgramTypeSchema),
    defaultValues: { name: "", code: "", type: "", description: "" }
  });

  const editForm = useForm<ProgramTypeFormData>({
    mode: "onChange",
    resolver: zodResolver(ProgramTypeSchema),
    defaultValues: { name: "", code: "", type: "UNDERGRADUATE", description: "" }
  });

  const fetchProgramTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ProgramServices.getProgramTypes();
      const list = Array.isArray(data) ? data : (data as any)?.data || [];
      setProgramTypes(list);
    } catch (err) {
      // Error toast handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgramTypes();
  }, [fetchProgramTypes]);

  const handleEdit = useCallback((pt: any) => {
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
      setIsSaving(true);
      await ProgramServices.createProgramType({
        code: data.code,
        name: data.name,
        type: data.type.toUpperCase(),
      });
      toaster.success({ title: "Program Type created successfully" });
      createForm.reset();
      setIsCreating(false);
      await fetchProgramTypes();
    } catch (error: any) {
      // Error toast handled by axios interceptor
    } finally {
      setIsSaving(false);
    }
  }, [createForm, fetchProgramTypes]);

  const handleCancelCreate = useCallback(() => {
    createForm.reset();
    setIsCreating(false);
  }, [createForm]);

  const handleSave = useCallback(async (data: ProgramTypeFormData) => {
    if (!editingId) return;
    try {
      setIsSaving(true);
      await ProgramServices.updateProgramType(editingId, data);
      toaster.success({ title: "Program type updated" });
      handleCancel();
      await fetchProgramTypes();
    } catch (error: any) {
      // Error toast handled by axios interceptor
    } finally {
      setIsSaving(false);
    }
  }, [editingId, handleCancel, fetchProgramTypes]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Delete this program type?")) {
      try {
        await ProgramServices.deleteProgramType(id);
        toaster.success({ title: "Program type deleted" });
        await fetchProgramTypes();
      } catch (err) {
        // Error toast handled by axios interceptor
      }
    }
  }, [fetchProgramTypes]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds(
      selectedIds.length === programTypes.length
        ? []
        : programTypes.map((pt) => pt.id),
    );
  }, [selectedIds, programTypes]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected program types?`,
      )
    ) {
      try {
        await Promise.all(
          selectedIds.map((id) => ProgramServices.deleteProgramType(id)),
        );
        toaster.success({
          title: `${selectedIds.length} program types deleted`,
        });
        setSelectedIds([]);
        await fetchProgramTypes();
      } catch (err) {
        // Error toast handled by axios interceptor
      }
    }
  }, [selectedIds, fetchProgramTypes]);

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
        let valA = a[sortConfig.key] || "";
        let valB = b[sortConfig.key] || "";

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

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" minH="400px">
        <Flex direction="column" alignItems="center" gap="4">
          <Spinner size="xl" color="blue.500" borderWidth="3px" />
          <Text color="fg.muted">Loading program types...</Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="8">
      {/* Create Form Dialog */}
      <Dialog.Root
        open={isCreating}
        onOpenChange={(e) => {
          setIsCreating(e.open);
          if (!e.open) handleCancelCreate();
        }}
        size="xl"
        placement="center"
        closeOnInteractOutside={false}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="sm" border="xs" borderColor="border.muted" overflow="hidden" colorPalette="accent">
              <form onSubmit={createForm.handleSubmit(handleCreate)} style={{ width: '100%' }}>
                <Dialog.CloseTrigger />
                <Dialog.Header p="6" borderBottom="xs" borderColor="border.muted">
                  <VStack align="start" gap={1}>
                    <Dialog.Title
                      fontSize="lg"
                      fontWeight="bold"
                      color="fg.muted"
                    >
                      Create Program Type
                    </Dialog.Title>
                    <Text fontSize="sm" color="fg.subtle">
                      Add a new program type to the system (e.g., Bachelor of Science, Master of Arts)
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

                    <Field.Root invalid={!!createForm.formState.errors.code}>
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Code</Field.Label>
                      <Input
                        {...createForm.register("code")}
                        placeholder="e.g. BSC"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                      <Field.ErrorText>{createForm.formState.errors.code?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!createForm.formState.errors.type}>
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
                                    typeCollection.items.map((item: any) => (
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
                <Dialog.Footer p="6" borderTop="xs" borderColor="border.muted" gap="3">
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      borderColor="border.muted"
                      color="fg.muted"
                      px="8"
                      fontWeight="bold"
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
                    bg="accent"
                    color="white"
                    px="10"
                    fontWeight="bold"
                    size="xl"
                  >
                    <Plus size={16} /> Create Program Type
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
        size="xl"
        placement="center"
        closeOnInteractOutside={false}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="sm" border="xs" borderColor="border.muted" overflow="hidden" colorPalette="accent">
              <form onSubmit={editForm.handleSubmit(handleSave)} style={{ width: '100%' }}>
                <Dialog.CloseTrigger />
                <Dialog.Header p="6" borderBottom="xs" borderColor="border.muted">
                  <VStack align="start" gap={1}>
                    <Dialog.Title fontSize="lg" fontWeight="bold" color="fg.muted">
                      Edit Program Type
                    </Dialog.Title>
                    <Text fontSize="sm" color="fg.muted">
                      Update the details of the existing program type.
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

                    <Field.Root invalid={!!editForm.formState.errors.code}>
                      <Field.Label fontSize="sm" fontWeight="medium" color="fg.muted">Code</Field.Label>
                      <Input
                        {...editForm.register("code")}
                        placeholder="e.g. BSC"
                        size="xl"
                        _placeholder={{ color: "fg.subtle" }}
                      />
                      <Field.ErrorText>{editForm.formState.errors.code?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!editForm.formState.errors.type}>
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
                                    typeCollection.items.map((item: any) => (
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
                <Dialog.Footer p="6" borderTop="xs" borderColor="border.muted" gap="3">
                  <Dialog.ActionTrigger asChild>
                    <Button
                      variant="outline"
                      borderColor="border.muted"
                      color="fg.muted"
                      px="8"
                      fontWeight="bold"
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
                    bg="accent"
                    color="white"
                    px="10"
                    fontWeight="bold"
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
        <Flex p="6" alignItems="center" borderBottom="1px solid" borderColor="border.muted">
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="fg.muted">
              Program Types ({programTypes.length})
            </Text>
            <Text fontSize="xs" color="fg.subtle" mt="0.5">
              Manage all academic program types and degree formats
            </Text>
          </Box>
          {!isCreating && !editingId && (
            <Button
              onClick={() => setIsCreating(true)}
              size="xl"
              fontSize="sm"
              fontWeight="bold"
              bg="#1D7AD9"
              color="white"
              ml="auto"
            >
              <Plus size={16} /> Create Program Type
            </Button>
          )}
        </Flex>

        <Box overflowX="auto">
          <Table.Root size="sm" variant="outline" border="none" colorPalette="accent">
            <Table.Header bg="slate.50">
              <Table.Row borderColor="border.muted">
                <Table.ColumnHeader px="6" py="4" w="12" textAlign="center">
                  <Checkbox.Root
                    checked={
                      programTypes.length > 0 &&
                      selectedIds.length === programTypes.length
                    }
                    onCheckedChange={toggleSelectAll}
                    cursor="pointer"
                    colorPalette="accent"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox.Root>
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
                  <Table.Cell colSpan={6} py="12">
                    <EmptyState.Root>
                      <EmptyState.Content>
                        <EmptyState.Indicator>
                          <GraduationCap size={40} />
                        </EmptyState.Indicator>
                        <VStack textAlign="center">
                          <EmptyState.Title>
                            No Program Types Found
                          </EmptyState.Title>
                          <EmptyState.Description>
                            Add a new program type to start organizing your
                            academic structure.
                          </EmptyState.Description>
                          <Button
                            onClick={() => setIsCreating(true)}
                            bg="#1D7AD9"
                            color="white"
                            size="xl"
                            mt="4"
                            fontWeight="bold"
                          >
                            <Plus size={16} /> Create Program Type
                          </Button>
                        </VStack>
                      </EmptyState.Content>
                    </EmptyState.Root>
                  </Table.Cell>
                </Table.Row>
              ) : (
                sortedProgramTypes.map((pt, index) => (
                  <Table.Row
                    key={pt.id}
                    bg={selectedIds.includes(pt.id) ? "blue.50" : undefined}
                    _hover={{ bg: "slate.50" }}
                    borderColor="border.muted"
                    fontSize="sm"
                    color="fg.muted"
                  >
                    <Table.Cell px="6" py="4" textAlign="center">
                      <Checkbox.Root
                        checked={selectedIds.includes(pt.id)}
                        onCheckedChange={() => toggleSelection(pt.id)}
                        cursor="pointer"
                        colorPalette="accent"
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Root>
                    </Table.Cell>
                    <Table.Cell px="6" py="4">{index + 1}</Table.Cell>
                    <Table.Cell px="6" py="4" fontWeight="medium">{pt.name}</Table.Cell>
                    <Table.Cell px="6" py="4">{pt.code || "—"}</Table.Cell>
                    <Table.Cell px="6" py="4">{pt.type || "—"}</Table.Cell>
                    <Table.Cell px="6" py="4" textAlign="center">
                      <Flex justifyContent="center" gap="2">
                        <Dialog.Trigger asChild>
                          <Button
                            aria-label="Edit"
                            size="sm"
                            variant="ghost"
                            color="fg.subtle"
                            _hover={{ bg: "fg.subtle" }}
                            onClick={() => handleEdit(pt)}
                            borderRadius="full"
                            minW="auto"
                            p="1"
                          >
                            <Edit size={16} />
                          </Button>
                        </Dialog.Trigger>
                        <Button
                          aria-label="Delete"
                          size="sm"
                          variant="ghost"
                          color="red.400"
                          _hover={{ bg: "red.50" }}
                          onClick={() => handleDelete(pt.id)}
                          borderRadius="full"
                          minW="auto"
                          p="1"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <Flex
          position="fixed"
          bottom="8"
          left="50%"
          transform="translateX(-50%)"
          bg="white"
          px="6"
          py="3"
          borderRadius="md"
          boxShadow="none"
          border="xs"
          borderColor="border.muted"
          alignItems="center"
          gap="6"
          zIndex="50"
        >
          <Text fontSize="sm" fontWeight="bold" color="fg.muted">
            {selectedIds.length} items selected
          </Text>
          <Box w="px" h="6" bg="fg.subtle" />
          <Button
            onClick={handleBulkDelete}
            bg="red.500"
            color="white"
            px="4"
            py="2"
            borderRadius="lg"
            fontSize="xs"
            fontWeight="bold"
            _hover={{ bg: "red.600" }}
          >
            <Trash2 size={16} /> Delete
          </Button>
          <Box w="px" h="6" bg="fg.subtle" />
          <Button
            aria-label="Unselect all"
            variant="ghost"
            size="sm"
            color="fg.subtle"
            _hover={{ bg: "fg.subtle" }}
            onClick={() => setSelectedIds([])}
          >
            <X size={20} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default ProgramTypeTab;
