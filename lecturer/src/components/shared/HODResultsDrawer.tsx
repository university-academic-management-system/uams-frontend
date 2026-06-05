import { useState, useRef, useEffect } from "react";
import {
  Drawer,
  Box,
  Button,
  CloseButton,
  Flex,
  Table,
  Spinner,
  Text,
  Badge,
  Portal,
  Heading,
  Tabs,
  Stack,
  Dialog,
  Textarea,
} from "@chakra-ui/react";
import { ResultHook } from "@hooks/result.hook";
import { toaster } from "@components/ui/toaster";
import type { Course } from "@type/course.type";
import ENV from "@configs/env.config";
import { formatLevel } from "@utils/function.util";
import EmptyStateView from "@components/shared/empty-state";
import { LuHourglass, LuDownload, LuUpload, LuCircleX, LuCircleCheck } from "react-icons/lu";

interface HODResultsDrawerProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const HODResultsDrawer = ({ course, isOpen, onClose }: HODResultsDrawerProps) => {
  const { data: pendingResults = [], isLoading: pendingLoading } = ResultHook.usePendingResults();
  const { data: approvedResults = [], isLoading: approvedLoading } = ResultHook.useApprovedResults();

  const downloadDraftMutation = ResultHook.useDownloadDraft();
  const rejectDraftMutation = ResultHook.useRejectDraft();
  const uploadFinalMutation = ResultHook.useUploadFinal();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter in memory for this course
  const coursePending = Array.isArray(pendingResults) ? pendingResults.filter((r) => r.courseId === course.id) : [];
  const courseApproved = Array.isArray(approvedResults) ? approvedResults.filter((r) => r.courseId === course.id) : [];

  const [selectedPendingId, setSelectedPendingId] = useState<string | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Default select first pending result when list loads
  useEffect(() => {
    if (coursePending.length > 0) {
      setSelectedPendingId(coursePending[0].id);
    } else {
      setSelectedPendingId(null);
    }
  }, [pendingResults]);

  const selectedPending = coursePending.find((r) => r.id === selectedPendingId);

  const handleDownloadDraft = async () => {
    if (!selectedPendingId) return;
    try {
      const { downloadUrl } = await downloadDraftMutation.mutateAsync(selectedPendingId);
      const absoluteUrl = downloadUrl.startsWith("http")
        ? downloadUrl
        : `${ENV.API_BASE_URL}${downloadUrl}`;
      window.open(absoluteUrl, "_blank");
      toaster.success({ description: "Draft results download started." });
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleRejectClick = () => {
    setRejectReason("");
    setIsRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedPendingId || !rejectReason.trim()) return;
    try {
      await rejectDraftMutation.mutateAsync({
        id: selectedPendingId,
        payload: { reason: rejectReason },
      });
      toaster.success({ description: "Draft results rejected successfully." });
      setIsRejectDialogOpen(false);
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  const handleUploadFinalClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFinalFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPendingId) return;
    try {
      await uploadFinalMutation.mutateAsync({
        id: selectedPendingId,
        file,
      });
      toaster.success({ description: "Final results uploaded and approved successfully!" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Final upload failed:", err);
    }
  };

  const columns = {
    pending: ["", "S/N", "Uploader", "Session", "Semester", "Uploaded Date", "Status"],
    approved: ["S/N", "Approver / Uploader", "Session", "Semester", "Approved Date", "Status", "Action"],
  };

  return (
    <>
      <Drawer.Root size="xl" open={isOpen} onOpenChange={(e) => { if (!e.open) onClose(); }}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content bg="bg">
              <Drawer.Header borderBottomWidth="1px" borderColor="border.muted" py="4">
                <Flex align="center" justify="space-between">
                  <Box>
                    <Heading size="md">Result Drafts & Approvals</Heading>
                    <Text color="fg.muted">
                      {course.title} ({course.code}) — {formatLevel(course.level)} Level
                    </Text>
                  </Box>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Drawer.CloseTrigger>
                </Flex>
              </Drawer.Header>

              <Drawer.Body p="6">
                <Tabs.Root defaultValue="pending" variant="line" colorPalette="accent">
                  <Tabs.List mb="6">
                    <Tabs.Trigger value="pending">Pending Result</Tabs.Trigger>
                    <Tabs.Trigger value="approved">Approved Result</Tabs.Trigger>
                  </Tabs.List>

                  {/* Pending Results Tab */}
                  <Tabs.Content value="pending">
                    {pendingLoading ? (
                      <Flex align="center" justify="center" py={12}>
                        <Spinner size="lg" color="accent" />
                        <Text ml="3">Loading pending drafts...</Text>
                      </Flex>
                    ) : (
                      <Stack gap="4">
                        {/* Actions bar – always visible */}
                        <Flex justify="space-between" align="center" bg="bg.muted" p="3" rounded="md">
                          <Text fontWeight="medium" color="fg.subtle">
                            {selectedPending ? (
                              <>
                                Selected: Draft by <strong style={{ color: "var(--chakra-colors-fg)" }}>{selectedPending.uploaderName}</strong> ({selectedPending.session})
                              </>
                            ) : (
                              "Select a draft result row to perform actions"
                            )}
                          </Text>
                          <Flex gap="2">
                            <Button
                              size="sm"
                              variant="subtle"
                              colorPalette="blue"
                              onClick={handleDownloadDraft}
                              disabled={!selectedPendingId}
                              loading={downloadDraftMutation.isPending}
                            >
                              <LuDownload /> Download Draft
                            </Button>
                            <Button
                              size="sm"
                              variant="subtle"
                              colorPalette="red"
                              onClick={handleRejectClick}
                              disabled={!selectedPendingId}
                            >
                              <LuCircleX /> Reject
                            </Button>
                            <Button
                              size="sm"
                              colorPalette="green"
                              onClick={handleUploadFinalClick}
                              disabled={!selectedPendingId}
                              loading={uploadFinalMutation.isPending}
                            >
                              <LuUpload /> Upload Final
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFinalFileChange}
                              style={{ display: "none" }}
                              accept=".xlsx,.xls,.csv"
                            />
                          </Flex>
                        </Flex>

                        {/* Pending Draft Table - no hover effect */}
                        <Table.ScrollArea rounded="md" border="1px solid" borderColor="border.muted">
                          <Table.Root size="sm" variant="outline" interactive>
                            <Table.Header bg="bg.subtle">
                              <Table.Row>
                                {columns.pending.map((col) => (
                                  <Table.ColumnHeader key={col} w={col === "" ? "40px" : col === "S/N" ? "50px" : col === "Uploader" ? "150px" : "auto"}>
                                    {col}
                                  </Table.ColumnHeader>
                                ))}
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {coursePending.length === 0 ? (
                                <Table.Row>
                                  <Table.Cell colSpan={columns.pending.length} textAlign="center" py={10}>
                                    <EmptyStateView
                                      icon={<LuHourglass />}
                                      title="No pending results"
                                      description="There are no pending draft results uploaded for this course."
                                    />
                                  </Table.Cell>
                                </Table.Row>
                              ) : (
                                coursePending.map((draft, idx) => (
                                  <Table.Row
                                    key={draft.id}
                                    onClick={() => setSelectedPendingId(draft.id)}
                                    bg={selectedPendingId === draft.id ? "bg.subtle" : undefined}
                                    _hover={{ bg: "transparent" }} // remove hover background
                                  >
                                    <Table.Cell onClick={(e) => e.stopPropagation()}>
                                      {selectedPendingId === draft.id ? (
                                        <LuCircleCheck color="var(--chakra-colors-accent-fg)" size="18" style={{ cursor: "pointer" }} onClick={() => setSelectedPendingId(draft.id)} />
                                      ) : (
                                        <Box
                                          onClick={() => setSelectedPendingId(draft.id)}
                                          w="4"
                                          h="4"
                                          border="1px solid"
                                          borderColor="border.muted"
                                          rounded="full"
                                          cursor="pointer"
                                        />
                                      )}
                                    </Table.Cell>
                                    <Table.Cell>{idx + 1}</Table.Cell>
                                    <Table.Cell fontWeight="semibold">{draft.uploaderName}</Table.Cell>
                                    <Table.Cell>{draft.session}</Table.Cell>
                                    <Table.Cell>{draft.semester}</Table.Cell>
                                    <Table.Cell>
                                      {new Date(draft.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                      <Badge colorPalette="yellow">{draft.status}</Badge>
                                    </Table.Cell>
                                  </Table.Row>
                                ))
                              )}
                            </Table.Body>
                          </Table.Root>
                        </Table.ScrollArea>
                      </Stack>
                    )}
                  </Tabs.Content>

                  {/* Approved Results Tab */}
                  <Tabs.Content value="approved">
                    {approvedLoading ? (
                      <Flex align="center" justify="center" py={12}>
                        <Spinner size="lg" color="accent" />
                        <Text ml="3">Loading approved results...</Text>
                      </Flex>
                    ) : (
                      <Table.ScrollArea rounded="md" border="1px solid" borderColor="border.muted">
                        <Table.Root size="sm" variant="outline">
                          <Table.Header bg="bg.subtle">
                            <Table.Row>
                              {columns.approved.map((col) => (
                                <Table.ColumnHeader key={col} textAlign={col === "Action" ? "right" : "left"}>
                                  {col}
                                </Table.ColumnHeader>
                              ))}
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {courseApproved.length === 0 ? (
                              <Table.Row>
                                <Table.Cell colSpan={columns.approved.length} textAlign="center" py={10}>
                                  <EmptyStateView
                                    icon={<LuCircleCheck />}
                                    title="No approved results"
                                    description="There are no approved results files uploaded for this course yet."
                                  />
                                </Table.Cell>
                              </Table.Row>
                            ) : (
                              courseApproved.map((app, idx) => (
                                <Table.Row key={app.id} _hover={{ bg: "transparent" }}>
                                  <Table.Cell>{idx + 1}</Table.Cell>
                                  <Table.Cell fontWeight="semibold">{app.uploaderName}</Table.Cell>
                                  <Table.Cell>{app.session}</Table.Cell>
                                  <Table.Cell>{app.semester}</Table.Cell>
                                  <Table.Cell>
                                    {new Date(app.createdAt).toLocaleDateString()}
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Badge colorPalette="green">APPROVED</Badge>
                                  </Table.Cell>
                                  <Table.Cell textAlign="right">
                                    {app.fileUrl && (
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        colorPalette="accent"
                                        onClick={() => window.open(app.fileUrl, "_blank")}
                                      >
                                        <LuDownload /> Download File
                                      </Button>
                                    )}
                                  </Table.Cell>
                                </Table.Row>
                              ))
                            )}
                          </Table.Body>
                        </Table.Root>
                      </Table.ScrollArea>
                    )}
                  </Tabs.Content>
                </Tabs.Root>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* Reject Confirmation Dialog */}
      <Dialog.Root role="alertdialog" open={isRejectDialogOpen} onOpenChange={(e) => setIsRejectDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content bg="bg">
              <Dialog.Header>
                <Dialog.Title>Reject Draft Result</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap="4">
                  <Text color="fg.muted">
                    Provide a reason for rejecting this results draft. The lecturer will be notified to make corrections.
                  </Text>
                  <Textarea
                    placeholder="E.g., CA scores exceed maximum bounds, missing grades, etc."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setIsRejectDialogOpen(false)}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette="red"
                  size="sm"
                  loading={rejectDraftMutation.isPending}
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason.trim()}
                >
                  Reject
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default HODResultsDrawer;