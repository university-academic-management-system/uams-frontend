import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Download, Edit, Trash2, X, Search } from "lucide-react";
import { ProgramServices } from "@services/program.service";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import { Box, Flex, Text, Input, Spinner, Button, InputGroup } from "@chakra-ui/react";

interface ProgramsTabProps {
    isCreatingRoute?: boolean;
    isEditingRoute?: boolean;
}

const ProgramsTab = ({ isCreatingRoute, isEditingRoute }: ProgramsTabProps) => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState<any[]>([]);
    const [programTypes, setProgramTypes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({ name: "", code: "", programTypeId: "", description: "", type: "", duration: 4 });

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            setIsLoading(true);
            const [progs, types] = await Promise.all([
                ProgramServices.getProgramsByDepartment(),
                ProgramServices.getProgramTypes(),
            ]);
            const progList = Array.isArray(progs) ? progs : (progs as any)?.data || (progs as any)?.programs || [];
            const typeList = Array.isArray(types) ? types : (types as any)?.data || [];
            setPrograms(progList);
            setProgramTypes(typeList);
        } catch (err) {
            // Error toast handled by axios interceptor
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await ProgramServices.createProgram({ name: formData.name, code: formData.code, type: formData.programTypeId, duration: formData.duration, description: formData.description });
            toaster.success({ title: "Program created" });
            await fetchPrograms();
            navigate("/program-courses/programs");
        } catch (error: any) {
            // Error toast handled by axios interceptor
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this program?")) {
            try {
                await ProgramServices.deleteProgram(id);
                toaster.success({ title: "Program deleted" });
                await fetchPrograms();
            } catch (err: any) {
                // Error toast handled by axios interceptor
            }
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((p) => p.id));
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected programs?`)) {
            try {
                await Promise.all(selectedIds.map((id) => ProgramServices.deleteProgram(id)));
                toaster.success({ title: `${selectedIds.length} programs deleted` });
                setSelectedIds([]);
                await fetchPrograms();
            } catch (err) {
                // Error toast handled by axios interceptor
            }
        }
    };

    const handleExport = () => {
        exportToExcel(programs.map((p) => ({ Name: p.name, Code: p.code, Type: p.programType?.name || "N/A", Status: p.isActive ? "Active" : "Inactive" })), "Programs", "Programs");
    };

    const filtered = programs.filter((p) => !searchTerm || p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.code?.toLowerCase().includes(searchTerm.toLowerCase()));

    const getTypeLabel = (typeId: string) => programTypes.find((t) => t.id === typeId)?.name || "N/A";

    if (isLoading) {
        return (
            <Flex alignItems="center" justifyContent="center" minH="400px">
                <Flex direction="column" alignItems="center" gap="4">
                    <Spinner size="xl" color="blue.500" borderWidth="3px" />
                    <Text color="fg.muted">Loading programs...</Text>
                </Flex>
            </Flex>
        );
    }

    if (isCreatingRoute || isEditingRoute) {
        return (
            <Box bg="white" borderRadius="md" p="8" border="xs" borderColor="border.muted">
                <Text fontSize="xl" fontWeight="bold" color="fg.muted" mb="8">
                    {isEditingRoute ? "Edit Program" : "Create Program"}
                </Text>
                <Flex direction={{ base: "column", lg: "row" }} gap="8">
                    <Flex direction="column" gap="6" flex="1">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Program Name</Text>
                            <Input value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g. Computer Science" bg="slate.50" border="xs" borderColor="border.muted" borderRadius="md" />
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Program Code</Text>
                            <Input value={formData.code} onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))} placeholder="e.g. CSC" bg="slate.50" border="xs" borderColor="border.muted" borderRadius="md" />
                        </Box>
                    </Flex>
                    <Flex direction="column" gap="6" flex="1">
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Program Type</Text>
                            <select value={formData.programTypeId} onChange={(e) => setFormData((prev) => ({ ...prev, programTypeId: e.target.value }))} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }}>
                                <option value="">Select type</option>
                                {programTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb="2">Description</Text>
                            <textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} rows={3} style={{ width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }} />
                        </Box>
                    </Flex>
                </Flex>
                <Flex justifyContent="flex-end" gap="3" mt="8">
                    <Box as="button" onClick={() => navigate("/program-courses/programs")} px="8" py="2.5" borderRadius="md" fontSize="sm" border="xs" borderColor="border.muted" color="fg.muted" cursor="pointer" _hover={{ bg: "slate.50" }}>Cancel</Box>
                    <Flex as="button" onClick={handleSave} px="8" py="2.5" borderRadius="md" fontSize="sm" fontWeight="bold" bg="#00B01D" color="white" cursor="pointer" border="none" _hover={{ bg: "green.700" }} opacity={isSaving ? 0.5 : 1}>
                        {isSaving ? "Saving..." : "Create Program"}
                    </Flex>
                </Flex>
            </Box>
        );
    }

    return (
        <Flex direction="column" gap="8">
            <Flex justifyContent="flex-end" gap="4">
                <Button onClick={handleExport} bg="white" color="blue.600" px="5" py="2.5" borderRadius="md" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" _hover={{ bg: "blue.50" }} cursor="pointer">
                    <Download size={18} /> Export
                </Button>
                <Button onClick={() => navigate("/program-courses/programs/new")} bg="blue.600" color="white" px="5" py="2.5" borderRadius="md" display="flex" alignItems="center" gap="2" fontSize="sm" fontWeight="bold" cursor="pointer">
                    <Plus size={18} /> Create Program
                </Button>
            </Flex>

            <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted">
                <Flex p="6" alignItems="center">
                    <Text fontSize="lg" fontWeight="bold" color="fg.muted">Created Programs ({filtered.length})</Text>
                    <InputGroup startElement={<Search />} ml="auto" width="260px">
                    <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} maxW="64" bg="white" border="xs" borderColor="border.muted" borderRadius="md" fontSize="xs" px="4" py="2.5" />
                    </InputGroup>
                </Flex>

                <Box overflowX="auto">
                    <Box as="table" w="full" textAlign="left">
                        <Box as="thead">
                            <Box as="tr" bg="slate.50" borderY="1px solid" borderColor="border.muted">
                                <Box as="th" px="6" py="4" w="12" textAlign="center">
                                    <input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={toggleSelectAll} style={{ cursor: "pointer" }} />
                                </Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase">Program Name</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase">Type</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase">Duration</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase">Status</Box>
                                <Box as="th" px="6" py="4" fontSize="11px" fontWeight="bold" color="fg.muted" textTransform="uppercase" textAlign="center">Actions</Box>
                            </Box>
                        </Box>
                        <Box as="tbody">
                            {filtered.length === 0 ? (
                                <Box as="tr"><td colSpan={6} style={{ padding: "48px 0", textAlign: "center", color: "#94a3b8" }}>No programs found</td></Box>
                            ) : filtered.map((prog) => (
                                <Box as="tr" key={prog.id} _hover={{ bg: "slate.50" }} borderBottom="xs" borderColor="border.muted" fontSize="sm" color="fg.muted" bg={selectedIds.includes(prog.id) ? "blue.50" : undefined}>
                                    <Box as="td" px="6" py="4" textAlign="center">
                                        <input type="checkbox" checked={selectedIds.includes(prog.id)} onChange={() => toggleSelection(prog.id)} style={{ cursor: "pointer" }} />
                                    </Box>
                                    <Box as="td" px="6" py="4" fontWeight="semibold" color="fg.muted">{prog.name}</Box>
                                    <Box as="td" px="6" py="4">{prog.programType?.name || getTypeLabel(prog.programTypeId)}</Box>
                                    <Box as="td" px="6" py="4">{prog.duration} Year{prog.duration !== 1 ? "s" : ""}</Box>
                                    <Box as="td" px="6" py="4">
                                        <Text as="span" px="4" py="1" borderRadius="full" fontSize="11px" fontWeight="bold" bg={prog.isActive ? "green.100" : "gray.100"} color={prog.isActive ? "green.600" : "gray.600"}>
                                            {prog.isActive ? "Active" : "Inactive"}
                                        </Text>
                                    </Box>
                                    <Box as="td" px="6" py="4" textAlign="center">
                                        <Flex justifyContent="center" gap="2">
                                            <Box as="button" onClick={() => navigate(`/program-courses/programs/edit/${prog.id}`)} p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" color="fg.subtle" cursor="pointer" border="none" bg="transparent"><Edit size={16} /></Box>
                                            <Box as="button" onClick={() => handleDelete(prog.id)} p="1" _hover={{ bg: "red.50" }} borderRadius="full" color="red.400" cursor="pointer" border="none" bg="transparent"><Trash2 size={16} /></Box>
                                        </Flex>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Floating Action Bar */}
            {selectedIds.length > 0 && (
                <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px="6" py="3" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" alignItems="center" gap="6" zIndex="50">
                    <Text fontSize="sm" fontWeight="bold" color="fg.muted">{selectedIds.length} items selected</Text>
                    <Box w="px" h="6" bg="fg.subtle" />
                    <Button onClick={handleBulkDelete} display="flex" alignItems="center" gap="2" bg="red.500" color="white" px="4" py="2" borderRadius="md" fontSize="xs" fontWeight="bold" _hover={{ bg: "red.600" }} cursor="pointer" border="none">
                        <Trash2 size={16} /> Delete
                    </Button>
                    <Box w="px" h="6" bg="fg.subtle" />
                    <Button onClick={() => setSelectedIds([])} p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" color="fg.subtle" cursor="pointer" border="none" bg="transparent" title="Unselect all">
                        <X size={20} />
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};

export default ProgramsTab;
