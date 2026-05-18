// ResultDetail.tsx
import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Text,
  Heading,
  Button,
  Stack,
  Table,
  DownloadTrigger,
  FileUpload,
  Dialog,
  Portal,
  CloseButton,
  Badge,
  For,
  Flex,
  Spinner,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { Download, ArrowLeft, UploadCloud, FileUp } from "lucide-react";
import { Link, useParams, useLocation } from "react-router";
import { ResultHook } from "@hooks/result.hook";
import { CourseHook } from "@hooks/course.hook";
import { toaster, Toaster } from "@components/ui/toaster";
import useUserStore from "@stores/user.store";
import axiosClient from "@configs/axios.config";
import type { Course } from "@type/course.type";

const ResultDetail = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const { user } = useUserStore();
  const isERO = useMemo(() => user?.role === "ERO", [user]);

  // Hooks
  const { data: pendingResults = [], isLoading: pendingLoading } = ResultHook.usePendingResults();
  const { data: approvedResults = [], isLoading: approvedLoading } = ResultHook.useApprovedResults();

  // Course details 
  const stateCourse = location.state?.course;
  const { data: fetchedCourse, isLoading: courseLoading } = CourseHook.useCourse(courseId!);
  const courseData = stateCourse || fetchedCourse;

  const { data: courseOwnership, isLoading: ownershipLoading } = CourseHook.useCheckCourseOwnership(courseId!);

  const isLoading = pendingLoading || approvedLoading || (!courseData && courseLoading) || ownershipLoading;

  const results = useMemo(() => {
    const all = [...(pendingResults || []), ...(approvedResults || [])];
    return all.filter((r) => r.courseId === courseId);
  }, [pendingResults, approvedResults, courseId]);

  // Download handler
  const handleResultDownload = useCallback(async (resultId: string, fileUrl: string, type: string) => {
    let downloadUrl = fileUrl;
    if (type === "RESULT") {
      try {
        const response = await axiosClient.get(`/results/${resultId}/download`);
        if (response.data?.data?.downloadUrl) {
          downloadUrl = response.data.data.downloadUrl;
        }
      } catch (err) {
        console.error("Failed to get draft download URL, trying direct fileUrl", err);
      }
    }

    if (!downloadUrl) {
      throw new Error("No download URL available");
    }

    const response = await axiosClient.get(downloadUrl, {
      responseType: "blob",
    });
    return response.data;
  }, []);

  const tableItems = useMemo(() => {
    return (results || []).map((result) => ({
      id: result.id,
      session: result.session,
      level: result.level,
      semester: result.semester,
      isApproved: result.status === "APPROVED",
      fileDownloadUrl: result.fileUrl || "",
      fileName: `result_${result.courseCode}_${result.session.replace("/", "-")}.xlsx`,
      fileMimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      finalResultDownloadUrl: result.status === "APPROVED" ? (result.fileUrl || "") : "",
      finalResultFileName: `final_result_${result.courseCode}_${result.session.replace("/", "-")}.xlsx`,
      finalResultMimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }));
  }, [results]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="200px" color={"accent"}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Stack gap="4">
      <Link to="/results">
        <Button size="xs" variant="ghost">
          <ArrowLeft /> Back
        </Button>
      </Link>

      <Heading>{courseData?.title} ({courseData?.code})</Heading>

      <Box p="4" bg="bg" rounded="md" spaceY="4">
        <Flex justify="space-between">
          <Heading>Results</Heading>
          {courseOwnership?.isAssigned && courseData && (
            <ResultUploadDialog type="RESULT" course={courseData} />
          )}
        </Flex>

        <Table.ScrollArea w="full">
          <Table.Root size="sm" variant="outline">
            <Table.Header bg="bg">
              <Table.Row>
                <Table.ColumnHeader minW="100px">Session</Table.ColumnHeader>
                <Table.ColumnHeader minW="100px">Level</Table.ColumnHeader>
                <Table.ColumnHeader minW="100px">Semester</Table.ColumnHeader>
                <Table.ColumnHeader minW="100px">Status</Table.ColumnHeader>
                <Table.ColumnHeader minW="100px">Draft</Table.ColumnHeader>
                <Table.ColumnHeader minW="100px">Final</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <For
                fallback={
                  <Table.Row>
                    <Table.Cell textAlign="center" colSpan={6}>No results found</Table.Cell>
                  </Table.Row>
                }
                each={tableItems}
              >
                {(item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.session}</Table.Cell>
                    <Table.Cell>{item.level}</Table.Cell>
                    <Table.Cell>{item.semester}</Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={item.isApproved ? "green" : "orange"}>
                        {item.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {courseOwnership?.isAssigned ? (
                        item.fileDownloadUrl ? (
                          <DownloadTrigger
                            data={() => handleResultDownload(item.id, item.fileDownloadUrl, "RESULT")}
                            fileName={item.fileName}
                            mimeType={item.fileMimeType}
                            asChild
                          >
                            <Button size="xs" variant="surface">
                              <Download /> Download Result
                            </Button>
                          </DownloadTrigger>
                        ) : courseData ? (
                          <ResultUploadDialog type="RESULT" course={courseData} />
                        ) : null
                      ) : item.fileDownloadUrl ? (
                        <DownloadTrigger
                          data={() => handleResultDownload(item.id, item.fileDownloadUrl, "RESULT")}
                          fileName={item.fileName}
                          mimeType={item.fileMimeType}
                          asChild
                        >
                          <Button size="xs" variant="surface">
                            <Download /> Download Result
                          </Button>
                        </DownloadTrigger>
                      ) : (
                        <Text color="fg.subtle">N/A</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {isERO ? (
                        item.finalResultDownloadUrl ? (
                          <DownloadTrigger
                            data={() => handleResultDownload(item.id, item.finalResultDownloadUrl, "FINAL")}
                            fileName={item.finalResultFileName}
                            mimeType={item.finalResultMimeType}
                            asChild
                          >
                            <Button size="xs" variant="surface">
                              <Download /> Download Final Result
                            </Button>
                          </DownloadTrigger>
                        ) : courseData ? (
                          <ResultUploadDialog type="FINAL" course={courseData} resultUploadId={item.id} />
                        ) : null
                      ) : item.finalResultDownloadUrl ? (
                        <DownloadTrigger
                          data={() => handleResultDownload(item.id, item.finalResultDownloadUrl, "FINAL")}
                          fileName={item.finalResultFileName}
                          mimeType={item.finalResultMimeType}
                          asChild
                        >
                          <Button size="xs" variant="surface">
                            <Download /> Download Final Result
                          </Button>
                        </DownloadTrigger>
                      ) : (
                        <Text color="fg.subtle">N/A</Text>
                      )}
                    </Table.Cell>
                  </Table.Row>
                )}
              </For>
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
      <Toaster />
    </Stack>
  );
};

export default ResultDetail;

// ========== UPLOAD DIALOG WITH CHAKRA SELECT ==========
const ResultUploadDialog = ({ course, type, resultUploadId }: { type: "RESULT" | "FINAL"; course: Course; resultUploadId?: string }) => {
  const { mutate: uploadDraft, isPending: isDraftPending } = ResultHook.useUploadDraft();
  const { mutate: uploadFinal, isPending: isFinalPending } = ResultHook.useUploadFinal();
  const [file, setFile] = useState<File | null>(null);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const isPending = isDraftPending || isFinalPending;

  // Session options
  const sessionOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let year = currentYear; year >= 1999; year--) {
      options.push(`${year}/${year + 1}`);
    }
    return options;
  }, []);

  const sessionCollection = useMemo(
    () =>
      createListCollection({
        items: sessionOptions.map((s) => ({ label: s, value: s })),
      }),
    [sessionOptions]
  );

  // Level options
  const levelOptions = ["100", "200", "300", "400", "500", "600", "700", "800"];
  const levelCollection = useMemo(
    () =>
      createListCollection({
        items: levelOptions.map((l) => ({ label: `${l} Level`, value: l })),
      }),
    [levelOptions]
  );

  const handleUpload = useCallback(() => {
    if (!file) return;

    if (type === "RESULT") {
      if (!selectedSession) {
        toaster.error({ description: "Please select a session" });
        return;
      }
      if (!selectedLevel) {
        toaster.error({ description: "Please select a level" });
        return;
      }

      uploadDraft(
        {
          courseId: course.id,
          session: selectedSession,
          semester: course.semester,
          level: selectedLevel,
          file,
        },
        {
          onSuccess: () => {
            toaster.success({ description: "Draft results uploaded successfully" });
            setFile(null);
            setSelectedSession("");
            setSelectedLevel("");
          },
          onError: (err: any) => {
            toaster.error({ description: err?.message || "Failed to upload draft results" });
          },
        }
      );
    } else {
      if (!resultUploadId) return;
      uploadFinal(
        {
          id: resultUploadId,
          file,
        },
        {
          onSuccess: () => {
            toaster.success({ description: "Final results uploaded successfully" });
            setFile(null);
          },
          onError: (err: any) => {
            toaster.error({ description: err?.message || "Failed to upload final results" });
          },
        }
      );
    }
  }, [file, type, course, selectedSession, selectedLevel, resultUploadId, uploadDraft, uploadFinal]);

  const handleDownloadTemplateFile = useCallback(async () => {
    const response = await axiosClient.get("/lecturer/result_template_file.xlsx", {
      responseType: "blob",
    });
    return response.data;
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button size="xs" variant="surface">
          <UploadCloud /> Upload {type === "RESULT" ? "Result" : "Final Result"}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Upload {type === "RESULT" ? "Result" : "Final Result"}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body spaceY="4">
              {type === "RESULT" && (
                <Stack gap="3">
                  {/* Session Select */}
                  <Box>
                    <Text mb="1" fontSize="sm" fontWeight="medium">
                      Session
                    </Text>
                    <Select.Root
                      collection={sessionCollection}
                      value={[selectedSession]}
                      onValueChange={(e) => setSelectedSession(e.value[0])}
                      size="md"
                      width="100%"
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select Session" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {sessionCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Box>

                  {/* Level Select */}
                  <Box>
                    <Text mb="1" fontSize="sm" fontWeight="medium">
                      Level
                    </Text>
                    <Select.Root
                      collection={levelCollection}
                      value={[selectedLevel]}
                      onValueChange={(e) => setSelectedLevel(e.value[0])}
                      size="md"
                      width="100%"
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
                        <Select.Trigger>
                          <Select.ValueText placeholder="Select Level" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                          <Select.Indicator />
                        </Select.IndicatorGroup>
                      </Select.Control>
                      <Select.Positioner>
                        <Select.Content>
                          {levelCollection.items.map((item) => (
                            <Select.Item key={item.value} item={item}>
                              {item.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Select.Root>
                  </Box>
                </Stack>
              )}

              <Box>
                <Text mb="2" fontSize="sm" fontWeight="medium">
                  Result File
                </Text>
                <FileUpload.Root onFileAccept={(details) => setFile(details.files[0])}>
                  <FileUpload.HiddenInput />
                  <FileUpload.Trigger asChild>
                    <Button w="full" variant="outline" justifyContent="start" size="sm">
                      <FileUp /> Select file
                    </Button>
                  </FileUpload.Trigger>
                  <FileUpload.List showSize clearable />
                </FileUpload.Root>
              </Box>

              <DownloadTrigger
                data={handleDownloadTemplateFile}
                fileName={`result_sample_${course.id}.xlsx`}
                mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                asChild
              >
                <Button variant="outline" size="sm" w="full">
                  <Download /> Download Sample File
                </Button>
              </DownloadTrigger>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button flex="1" variant="outline">
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                flex="2"
                bg="accent"
                onClick={handleUpload}
                disabled={isPending}
                loading={isPending}
                loadingText="Uploading..."
              >
                Upload
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};