import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Camera, Download, X, Upload, IdCard } from "lucide-react";
import axiosClient from "@configs/axios.config";
import { IDCardServices } from "@services/idcard.service";
import { toaster } from "@components/ui/toaster";
import { exportToExcel } from "@utils/excel.util";
import { 
    Box, 
    Flex, 
    Text, 
    Button, 
    EmptyState, 
    Table, 
    Input, 
    InputGroup, 
    Heading, 
    Dialog,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { 
    PaginationRoot, 
    PaginationItems, 
    PaginationPrevTrigger, 
    PaginationNextTrigger 
} from "@components/ui/pagination";

import type { Student, IDCardSettings } from "@type/idCard.type";

const ITEMS_PER_PAGE = 20;

const IDCardPage = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [idCardSettings, setIdCardSettings] = useState<IDCardSettings | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch ID card settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await IDCardServices.getDefaultIDCard();
                if (response?.template) {
                    setIdCardSettings({
                        frontTemplate: response.template.frontCardTemplate || response.template.frontTemplate,
                        backTemplate: response.template.backCardTemplate || response.template.backTemplate,
                        backDescription: response.template.backDescription,
                        backDisclaimer: response.template.backDisclaimer,
                        signature: response.template.hodSignature || response.template.signature,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch ID card settings", error);
            }
        };
        fetchSettings();
    }, []);

    // Fetch students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get("/university-admin/students", { params: { limit: 1000 } });
                const transformed: Student[] = (response.data.students || []).map((s: any) => ({
                    id: s.id,
                    idNo: s.studentId,
                    name: s.user?.fullName || "N/A",
                    matric: s.studentId,
                    faculty: s.Department?.Faculty?.name || "N/A",
                    department: s.Department?.name || "N/A",
                    level: s.level || "N/A",
                    graduationDate: "2026-06-15",
                    hasPaidIDCardFee: s.PaymentTransactions?.some((t: any) => t.payment_for === "ID Card Fee Payment" && t.status === "success") || false,
                    avatar: s.user?.avatar || "",
                }));
                setStudents(transformed);
            } catch (err) {
                console.error("Failed to fetch students", err);
                // Error toast handled by axios interceptor
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Filters
    const uniqueLevels = useMemo(() => Array.from(new Set(students.map((s) => s.level).filter((l) => l && l !== "N/A"))).sort(), [students]);

    const allFiltered = useMemo(() => {
        return students.filter((s) => {
            const matchesStatus = statusFilter === "all" || (statusFilter === "paid" && s.hasPaidIDCardFee) || (statusFilter === "unpaid" && !s.hasPaidIDCardFee);
            const matchesLevel = levelFilter === "all" || s.level === levelFilter;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.matric.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.faculty.toLowerCase().includes(q);
            return matchesStatus && matchesLevel && matchesSearch;
        });
    }, [students, statusFilter, levelFilter, searchQuery]);

    const totalPages = Math.ceil(allFiltered.length / ITEMS_PER_PAGE) || 1;
    const paginatedStudents = allFiltered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, levelFilter]);

    // Selection
    const toggleSelection = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
    const toggleSelectAll = () => setSelectedIds(selectedIds.length === paginatedStudents.length && paginatedStudents.length > 0 ? [] : paginatedStudents.map((s) => s.id));

    // Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            if (videoRef.current) { videoRef.current.srcObject = stream; setCameraActive(true); }
        } catch { toaster.error({ title: "Camera access denied" }); }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) { ctx.drawImage(videoRef.current, 0, 0, 640, 480); setCapturedPhoto(canvasRef.current.toDataURL("image/jpeg", 0.9)); stopCamera(); }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toaster.error({ title: "File too large (max 5MB)" }); return; }
        const reader = new FileReader();
        reader.onloadend = () => { setCapturedPhoto(reader.result as string); stopCamera(); };
        reader.readAsDataURL(file);
    };

    const handleIssueCard = (student: Student) => {
        setCurrentStudent(student);
        setCapturedPhoto(null);
        setShowModal(true);
        setTimeout(() => startCamera(), 100);
    };

    // Upload photo to server
    const uploadPhotoToServer = async (): Promise<boolean> => {
        if (!currentStudent || !capturedPhoto) return false;
        setUploadingPhoto(true);
        try {
            const response = await fetch(capturedPhoto);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append("avatar", blob, `${currentStudent.matric}.jpg`);
            await axiosClient.put(`/admin/students/avatar?studentId=${currentStudent.matric}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            return true;
        } catch (err: any) {
            // Error toast handled by axios interceptor
            return false;
        } finally {
            setUploadingPhoto(false);
        }
    };

    // Generate PDF
    const generateIDCardPDF = async () => {
        if (!currentStudent || !capturedPhoto) return;
        setGeneratingPDF(true);
        try {
            const uploadSuccess = await uploadPhotoToServer();
            if (!uploadSuccess) { setGeneratingPDF(false); return; }

            const { jsPDF } = await import("jspdf");
            const cardWidth = 85.6, cardHeight = 54;
            const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [cardWidth, cardHeight] });

            const loadImage = (src: string): Promise<HTMLImageElement | null> => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error(`Failed to load image: ${src}`);
                        resolve(null);
                    };
                    img.src = src;
                    setTimeout(() => resolve(null), 10000); // 10s timeout
                });
            };

            const frontSrc = idCardSettings?.frontTemplate || "/admin/idcard-front.png";
            const backSrc = idCardSettings?.backTemplate || "/admin/idcard-back.png";

            const [frontTemplate, backTemplate] = await Promise.all([
                loadImage(frontSrc),
                loadImage(backSrc)
            ]);

            if (!frontTemplate) {
                toaster.error({ title: "Failed to load ID card template" });
                setGeneratingPDF(false);
                return;
            }

            // Front
            doc.addImage(frontTemplate, "PNG", 0, 0, cardWidth, cardHeight);
            doc.addImage(capturedPhoto!, "JPEG", 5.5, 20.5, 19.7, 23.1);

            doc.setFontSize(3.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            const textX = 27; let textY = 23; const lineHeight = 3.8;
            const infoLines = [
                `NAME: ${currentStudent.name}`, `MATRIC NO.: ${currentStudent.matric}`,
                `FACULTY: ${currentStudent.faculty}`, `DEPT: ${currentStudent.department}`,
                `EXPIRY DATE: ${currentStudent.graduationDate}`,
            ];
            
            infoLines.forEach((line, i) => {
                const maxWidth = cardWidth - textX - 5;
                const lines = doc.splitTextToSize(line, maxWidth);
                if (lines.length > 1) {
                    lines.forEach((lineText: string, lineIndex: number) => {
                        doc.text(lineText, textX, (textY + i * lineHeight) + (lineIndex * 1.5));
                    });
                } else {
                    doc.text(line, textX, textY + i * lineHeight);
                }
            });

            // Back
            if (backTemplate) {
                doc.addPage([cardWidth, cardHeight], "landscape");
                doc.addImage(backTemplate, "PNG", 0, 0, cardWidth, cardHeight);

                // Add Back Text
                const backDescription = idCardSettings?.backDescription || "The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt";
                const backDisclaimer = idCardSettings?.backDisclaimer || "If found please return to the office of the Chief Security Officer University of Port Harcourt";

                doc.setTextColor(15, 23, 42); // slate-900 equivalent
                
                // Description
                doc.setFontSize(3.5);
                doc.setFont("helvetica", "bold");
                const descLines = doc.splitTextToSize(backDescription, cardWidth - 20);
                doc.text(descLines, cardWidth / 2, 20, { align: "center" });

                // Disclaimer
                doc.setFontSize(3);
                const discLines = doc.splitTextToSize(backDisclaimer, cardWidth - 20);
                doc.text(discLines, cardWidth / 2, 30, { align: "center" });

                // Signature
                const sigSrc = idCardSettings?.signature;
                if (sigSrc) {
                    const signatureImg = await loadImage(sigSrc);
                    if (signatureImg) {
                        doc.addImage(signatureImg, "PNG", (cardWidth / 2) - 15, cardHeight - 18, 30, 6, undefined, 'FAST');
                    }
                }

                // Signature Line and Label
                doc.setDrawColor(15, 23, 42);
                doc.setLineWidth(0.2);
                doc.line((cardWidth / 2) - 15, cardHeight - 11, (cardWidth / 2) + 15, cardHeight - 11);
                
                doc.setFontSize(2.5);
                doc.text("Department Admin's Signature", cardWidth / 2, cardHeight - 8, { align: "center" });
            }

            doc.save(`${currentStudent.name.replace(/\s+/g, "_")}_ID_Card.pdf`);
            toaster.success({ title: "ID Card PDF generated!" });
            setTimeout(() => { setShowModal(false); setCapturedPhoto(null); stopCamera(); }, 1000);
        } catch (err) {
            console.error("PDF generation error:", err);
            toaster.error({ title: "Failed to generate PDF" });
        } finally {
            setGeneratingPDF(false);
        }
    };

    // Bulk downloads
    const handleBulkDownloadIDCards = async () => {
        if (selectedIds.length === 0) return;
        let toastId;
        try {
            toastId = toaster.create({ title: "Downloading ID Cards...", type: "loading" });
            const templateResponse = await IDCardServices.getDefaultIDCard();
            const templateId = templateResponse?.template?.id;
            if (!templateId) { 
                if (toastId) toaster.dismiss(toastId);
                toaster.error({ title: "No default template found" }); 
                return; 
            }
            const blob = await IDCardServices.bulkDownloadIDCards(selectedIds, templateId);
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            const link = document.createElement("a"); link.href = url; link.download = "ID_Cards.pdf";
            document.body.appendChild(link); link.click(); link.remove();
            
            if (toastId) toaster.dismiss(toastId);
            toaster.success({ title: "Download started" });
            setSelectedIds([]);
        } catch (err) { 
            if (toastId) toaster.dismiss(toastId);
            // Error toast handled by axios interceptor
        }
    };

    const handleBulkDownloadBanner = async () => {
        if (selectedIds.length === 0) return;
        let toastId;
        try {
            toastId = toaster.create({ title: "Downloading Banner...", type: "loading" });
            const blob = await IDCardServices.bulkDownloadBanner(selectedIds);
            const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            const link = document.createElement("a"); link.href = url; link.download = "Banners.pdf";
            document.body.appendChild(link); link.click(); link.remove();
            
            if (toastId) toaster.dismiss(toastId);
            toaster.success({ title: "Download started" });
            setSelectedIds([]);
        } catch (err) { 
            if (toastId) toaster.dismiss(toastId);
            // Error toast handled by axios interceptor
        }
    };

    // Export
    const handleExportStudents = () => {
        exportToExcel(students.map((s) => ({
            "Student Name": s.name, "Matric No": s.matric, "Department": s.department,
            "Faculty": s.faculty, "Level": s.level, "ID Card Fee Paid": s.hasPaidIDCardFee ? "Yes" : "No",
        })), "Students_List", "Students");
        toaster.success({ title: "Exporting students table to Excel..." });
    };

    return (
        <Box maxW="1400px" mx="auto" px="4">
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center" mb="8" flexWrap="wrap" gap="4">
                <Box>
                    <Heading size="lg" fontWeight="bold" color="fg.muted">Student ID Issuance</Heading>
                    <Text fontSize="sm" color="fg.muted">Capture photos and generate official department ID cards.</Text>
                </Box>
                <Flex gap="3" alignItems="center" flexWrap="wrap" w={{ base: "100%", lg: "auto" }}>
                    <Box flex={{ base: "1 1 45%", lg: "none" }}>
                        <select 
                            value={levelFilter} 
                            onChange={(e) => setLevelFilter(e.target.value)}
                            style={{ 
                                width: "100%", padding: "10px 16px", border: "1px solid #e2e8f0", 
                                background: "#f8fafc", borderRadius: "6px", fontSize: "14px", 
                                fontWeight: 500, color: "#475569", outline: "none"
                            }}
                        >
                            <option value="all">All Levels</option>
                            {uniqueLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </Box>
                    <Box flex={{ base: "1 1 45%", lg: "none" }}>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            style={{ 
                                width: "100%", padding: "10px 16px", border: "1px solid #e2e8f0", 
                                background: "#f8fafc", borderRadius: "6px", fontSize: "14px", 
                                fontWeight: 500, color: "#475569", outline: "none"
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                        </select>
                    </Box>
                    <InputGroup startElement={<Search size={18} color="#94a3b8" />} w={{ base: "100%", lg: "320px" }}>
                        <Input
                            placeholder="Search name or matric..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            bg="white"
                            border="xs"
                            borderColor="border.muted"
                            borderRadius="md"
                            fontSize="sm"
                            px="10"
                        />
                    </InputGroup>
                </Flex>
            </Flex>

            {/* Table Container */}
            <Box bg="white" borderRadius="md" border="xs" borderColor="border.muted" boxShadow="none" overflow="hidden">
                <Flex p="6" alignItems="center" justifyContent="space-between" borderBottom="xs" borderColor="border.muted" flexWrap="wrap" gap="4">
                    <Text fontSize="lg" fontWeight="bold" color="fg.muted">Students ({allFiltered.length})</Text>
                    <Button 
                        onClick={handleExportStudents} 
                        variant="outline"
                        borderColor="border.muted"
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                        color="fg.muted"
                        _hover={{ bg: "slate.50" }}
                    >
                        <Download size={14} /> Export Table
                    </Button>
                </Flex>

                <Box overflowX="auto">
                    <Table.Root w="full" textAlign="left" colorPalette="accent">
                        <Table.Header bg="slate.50">
                            <Table.Row borderBottom="xs" borderColor="border.muted">
                                <Table.ColumnHeader px="6" py="4" w="12" textAlign="center" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="fg.muted" letterSpacing="wider">
                                    <input type="checkbox" checked={paginatedStudents.length > 0 && selectedIds.length === paginatedStudents.length} onChange={toggleSelectAll} />
                                </Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="fg.muted" letterSpacing="wider">Student Name</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="fg.muted" letterSpacing="wider">Matric No</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="fg.muted" letterSpacing="wider">Department</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="fg.muted" letterSpacing="wider">Level</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" textAlign="center" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="fg.muted" letterSpacing="wider">Status</Table.ColumnHeader>
                                <Table.ColumnHeader px="6" py="4" textAlign="center" fontSize="11px" textTransform="uppercase" fontWeight="bold" color="fg.muted" letterSpacing="wider">Action</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {loading ? (
                                <Table.Row>
                                    <Table.Cell colSpan={7} py="12" textAlign="center">
                                        <Flex direction="column" alignItems="center" gap="3">
                                            <Spinner size="lg" color="blue.500" />
                                            <Text color="fg.muted" fontSize="sm">Fetching students...</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : paginatedStudents.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={7} py="12">
                                        <EmptyState.Root>
                                            <EmptyState.Content>
                                                <EmptyState.Indicator>
                                                    <IdCard />
                                                </EmptyState.Indicator>
                                                <EmptyState.Title>
                                                    {statusFilter === "all" ? "No Students Found" : `No ${statusFilter} students found`}
                                                </EmptyState.Title>
                                                <EmptyState.Description>Try adjusting your search or filter criteria</EmptyState.Description>
                                            </EmptyState.Content>
                                        </EmptyState.Root>
                                    </Table.Cell>
                                </Table.Row>
                            ) : paginatedStudents.map((s) => (
                                <Table.Row
                                    key={s.id}
                                    _hover={{ bg: "slate.50" }}
                                    borderBottom="xs" borderColor="border.muted" color="fg.muted"
                                    bg={selectedIds.includes(s.id) ? "blue.50" : "transparent"}
                                >
                                    <Table.Cell px="6" py="4" textAlign="center">
                                        <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleSelection(s.id)} />
                                    </Table.Cell>
                                    <Table.Cell px="6" py="4" fontWeight="bold" color="fg.muted">{s.name}</Table.Cell>
                                    <Table.Cell px="6" py="4">{s.matric}</Table.Cell>
                                    <Table.Cell px="6" py="4">{s.department}</Table.Cell>
                                    <Table.Cell px="6" py="4">{s.level}</Table.Cell>
                                    <Table.Cell px="6" py="4" textAlign="center">
                                        <Text as="span" px="3" py="1" borderRadius="full" fontSize="10px" fontWeight="bold"
                                            bg={s.hasPaidIDCardFee ? "green.100" : "red.100"}
                                            color={s.hasPaidIDCardFee ? "green.700" : "red.700"}
                                        >
                                            {s.hasPaidIDCardFee ? "FEE PAID" : "UNPAID"}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell px="6" py="4" textAlign="center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={!s.hasPaidIDCardFee}
                                            color={s.hasPaidIDCardFee ? "blue.600" : "gray.300"}
                                            fontWeight="bold"
                                            onClick={() => handleIssueCard(s)}
                                            _hover={s.hasPaidIDCardFee ? { textDecoration: "underline", bg: "transparent" } : {}}
                                        >
                                            Issue Card
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Flex alignItems="center" justifyContent="space-between" p="4" bg="white" borderTop="xs" borderColor="border.muted">
                        <Text fontSize="sm" color="fg.muted">
                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, allFiltered.length)} of {allFiltered.length} students
                        </Text>
                        <PaginationRoot 
                            count={allFiltered.length} 
                            pageSize={ITEMS_PER_PAGE} 
                            page={currentPage}
                            onPageChange={(e) => setCurrentPage(e.page)}
                            variant="outline"
                            size="sm"
                        >
                            <Flex gap="2">
                                <PaginationPrevTrigger />
                                <PaginationItems />
                                <PaginationNextTrigger />
                            </Flex>
                        </PaginationRoot>
                    </Flex>
                )}
            </Box>

            {/* Capture Modal */}
            <Dialog.Root open={showModal} onOpenChange={(e) => { if (!e.open) { setShowModal(false); stopCamera(); setCapturedPhoto(null); } }} placement="center" closeOnInteractOutside={false}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bg="white" borderRadius="md" boxShadow="none" w="full" maxW="2xl" overflow="hidden" colorPalette="accent">
                        <Flex p="6" borderBottom="xs" borderColor="border.muted" alignItems="center" justifyContent="space-between">
                            <Heading size="md" fontWeight="bold" color="fg.muted">Capture & Issue: {currentStudent?.name}</Heading>
                            <Dialog.CloseTrigger asChild>
                                <Box as="button" onClick={() => { setShowModal(false); stopCamera(); setCapturedPhoto(null); }} p="2" _hover={{ bg: "slate.50" }} borderRadius="full" border="none" bg="transparent" cursor="pointer"><X size={20} /></Box>
                            </Dialog.CloseTrigger>
                        </Flex>

                        <Box p="6" maxH="70vh" overflowY="auto">
                            <Flex direction="column" alignItems="center" gap="6">
                                <Box w="full" bg="#0f172a" borderRadius="md" overflow="hidden" position="relative" border="4px solid" borderColor="slate.50">
                                    {!capturedPhoto ? (
                                        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "300px" }} />
                                    ) : (
                                        <img src={capturedPhoto} style={{ width: "100%", height: "100%", objectFit: "contain", minHeight: "300px" }} alt="Captured student" />
                                    )}
                                </Box>

                                {!capturedPhoto ? (
                                    <Flex gap="4" w="full">
                                        <Button onClick={captureImage} flex="1" bg="blue.600" color="white" borderRadius="md" h="12" fontWeight="bold" disabled={!cameraActive}>
                                            <Camera size={18} /> Capture Photo
                                        </Button>
                                        <Button as="label" flex="1" bg="slate.50" color="fg.muted" borderRadius="md" h="12" fontWeight="bold" cursor="pointer">
                                            <Upload size={18} /> Upload Image
                                            <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display: "none" }} />
                                        </Button>
                                    </Flex>
                                ) : (
                                    <Button onClick={() => { setCapturedPhoto(null); startCamera(); }} w="full" bg="slate.50" color="fg.muted" borderRadius="md" h="12" fontWeight="bold">
                                        Retake Photo
                                    </Button>
                                )}

                                {capturedPhoto && (
                                    <Box w="full" mt="4">
                                        <Text fontSize="xs" fontWeight="bold" color="fg.subtle" textTransform="uppercase" mb="4">ID Card Preview</Text>
                                        <Flex direction={{ base: "column", md: "row" }} gap="4">
                                            {/* Front View */}
                                            <Box flex="1" position="relative" aspectRatio="400/250" borderRadius="md" border="xs" borderColor="border.muted" overflow="hidden">
                                                <img src={idCardSettings?.frontTemplate || "/admin/idcard-front.png"} style={{ width: "100%", height: "100%" }} alt="Front" />
                                                <img src={capturedPhoto} style={{ position: "absolute", top: "38%", left: "6.5%", width: "23%", height: "43%", objectFit: "cover", border: "1px solid white" }} alt="Student" />
                                                <Box position="absolute" left="32%" top="42.5%" w="45%" fontSize="7px" fontWeight="bold" color="black" textTransform="uppercase">
                                                    <VStack align="start" gap="2.5" lineHeight="1">
                                                        <Text>NAME: {currentStudent?.name}</Text>
                                                        <Text>MATRIC NO.: {currentStudent?.matric}</Text>
                                                        <Text>FACULTY: {currentStudent?.faculty}</Text>
                                                        <Text>DEPT: {currentStudent?.department}</Text>
                                                        <Text>EXPIRY DATE: {currentStudent?.graduationDate}</Text>
                                                    </VStack>
                                                </Box>
                                            </Box>
                                            {/* Back View */}
                                            <Box flex="1" position="relative" aspectRatio="400/250" borderRadius="md" border="xs" borderColor="border.muted" overflow="hidden">
                                                <img src={idCardSettings?.backTemplate || "/admin/idcard-back.png"} style={{ width: "100%", height: "100%" }} alt="Back" />
                                                <Box position="absolute" inset="0" p="6" pt="10" display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                                    <Text fontSize="9px" fontWeight="bold" color="slate.900" mb="2" lineHeight="1.2">
                                                        {idCardSettings?.backDescription || "The holder whose name and photograph appear on this I.D. Card is a bonafide student of the University of Port Harcourt"}
                                                    </Text>
                                                    <Text fontSize="8px" fontWeight="bold" color="slate.900" lineHeight="1.2">
                                                        {idCardSettings?.backDisclaimer || "If found please return to the office of the Chief Security Officer University of Port Harcourt"}
                                                    </Text>
                                                    <Box mt="auto" mb="6" display="flex" flexDirection="column" alignItems="center">
                                                        {idCardSettings?.signature && (
                                                            <img src={idCardSettings.signature} alt="Signature" style={{ width: "176px", height: "28px", objectFit: "contain" }} />
                                                        )}
                                                        <Box w="160px" h="1.5px" bg="slate.900" mb="1" />
                                                        <Text fontSize="7px" fontWeight="bold" color="slate.900">Department Admin's Signature</Text>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Flex>
                                    </Box>
                                )}
                            </Flex>
                        </Box>

                        <Box p="6" bg="slate.50" borderTop="xs" borderColor="border.muted">
                            <Button 
                                onClick={generateIDCardPDF} 
                                w="full" 
                                bg="green.600" 
                                color="white" 
                                h="14" 
                                borderRadius="md" 
                                fontWeight="bold" 
                                loading={generatingPDF || uploadingPhoto}
                                loadingText={uploadingPhoto ? "Uploading Photo..." : "Generating PDF..."}
                                disabled={!capturedPhoto}
                            >
                                <Download size={20} /> Generate ID Card PDF
                            </Button>
                        </Box>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>

            {/* Floating Action Bar */}
            {selectedIds.length > 1 && (
                <Flex position="fixed" bottom="8" left="50%" transform="translateX(-50%)" bg="white" px="6" py="3" borderRadius="md" boxShadow="none" border="xs" borderColor="border.muted" alignItems="center" gap="6" zIndex="50">
                    <Text fontSize="sm" fontWeight="bold" color="fg.muted">{selectedIds.length} items</Text>
                    <Box w="px" h="6" bg="fg.subtle" />
                    <Button onClick={handleBulkDownloadBanner} bg="#1D7AD9" color="white" px="4" py="2" borderRadius="md" fontSize="xs" fontWeight="bold" _hover={{ bg: "blue.700" }}>
                        <Download size={16} /> Bulk Download Banner
                    </Button>
                    <Button onClick={handleBulkDownloadIDCards} bg="#1D7AD9" color="white" px="4" py="2" borderRadius="md" fontSize="xs" fontWeight="bold" _hover={{ bg: "blue.700" }}>
                        <Download size={16} /> Bulk Download ID-Cards
                    </Button>
                    <Box w="px" h="6" bg="fg.subtle" />
                    <Box as="button" onClick={() => setSelectedIds([])} p="1" _hover={{ bg: "fg.subtle" }} borderRadius="full" border="none" bg="transparent" cursor="pointer"><X size={20} /></Box>
                </Flex>
            )}

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} style={{ display: "none" }} width={640} height={480} />
        </Box>
    );
};

export default IDCardPage;