import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  Portal,
  Stack,
  Spinner,
  Text,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import { Camera, Check, X } from "lucide-react";
import { IDCardHooks } from "@hooks/idcard.hook";
import { toaster } from "@components/ui/toaster";
import type { IDCardRequest, IDCardStudent } from "@type/idCard.type";
import {
  Document,
  Page,
  View,
  Text as PDFText,
  Image as PDFImage,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";
import { SettingsHooks } from "@hooks/settings.hook";
import moment from "moment";
import ENV from "@configs/env.config";
import { sleep } from "@utils/function.util";


Font.register({
  family: 'Inter',
  src: "/admin/assets/Inter_18pt-Bold.ttf",
  fontWeight: "bold"
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  cardContainer: {
    position: "relative",
    width: 500,
    height: 295,
    marginBottom: 20,
  },
  cardImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  photo: {
    position: "absolute",
    left: 26,
    top: 117,
    width: 117,
    height: 128,
  },
  text: {
    position: "absolute",
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
    fontFamily: "Inter",
  },
});

interface IDCardDocumentProps {
  frontUrl: string;
  backUrl: string;
  signatureUrl?: string;
  student: IDCardStudent;
  capturedImage: string;
  expiryDate?: string;
}

const IDCardDocument = ({
  frontUrl,
  backUrl,
  signatureUrl,
  student,
  capturedImage,
  expiryDate,
}: IDCardDocumentProps) => (
  <Document>
    {/* Front Page */}
    <Page style={styles.page}>
      <View style={styles.cardContainer}>
        <PDFImage style={styles.cardImage} src={frontUrl} />
        <PDFImage style={styles.photo} src={capturedImage} />
        <PDFText style={{ ...styles.text, left: 225, top: 129 }}>
          {student.surname} {student.firstName} {student.otherName}
        </PDFText>
        <PDFText style={{ ...styles.text, left: 270, top: 153 }}>
          {student.matricNumber}
        </PDFText>
        <PDFText style={{ ...styles.text, left: 244, top: 174 }}>
          {student.faculty?.toUpperCase()}
        </PDFText>
        <PDFText style={{ ...styles.text, left: 216, top: 197 }}>
          {student.department?.toUpperCase()}
        </PDFText>
        <PDFText style={{ ...styles.text, left: 275, top: 220 }}>
          {expiryDate}
        </PDFText>
      </View>

      <View style={styles.cardContainer}>
        <PDFImage style={styles.cardImage} src={backUrl} />
        {signatureUrl && (
          <PDFImage
            style={{
              position: "absolute",
              height: 40,
              bottom: 72,
              left: "45%",
              transform: "translateX(-45%)",
            }}
            src={signatureUrl}
          />
        )}
      </View>
    </Page>
  </Document>
);

interface IDCardCaptureDialogProps {
  request: IDCardRequest | null;
  isOpen: boolean;
  student: IDCardStudent;
  onClose: () => void;
}

const IDCardCaptureDialog = ({ request, isOpen, student, onClose }: IDCardCaptureDialogProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const templateImgRef = useRef<HTMLImageElement>(null);
  const backTemplateImgRef = useRef<HTMLImageElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  // Added the missing state declaration here
  const [, setPreviewImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: templates } = IDCardHooks.useIDCardTemplates();
  const uploadMutation = IDCardHooks.useUploadToStorage();
  const updateMutation = IDCardHooks.useUpdateIDCardRequest();
  const { data: settings } = SettingsHooks.useDepartmentSettings();

  const startCamera = useCallback(async () => {
    if (stream) return;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (error) {
      toaster.error({ title: "Failed to access camera" });
      console.error("Camera error:", error);
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraReady(false);
    }
  }, [stream]);

  const generatePreview = useCallback(async (imageData: string) => {
    if (!previewCanvasRef.current || !templateImgRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const templateImg = templateImgRef.current;

      if (!templateImg.complete || templateImg.naturalWidth === 0) {
        await new Promise((resolve) => {
          const checkLoad = () => {
            if (templateImg.complete || templateImg.naturalWidth > 0) {
              resolve(null);
            }
          };
          templateImg.onload = checkLoad;
          templateImg.onerror = resolve;
          checkLoad();
        });
      }

      canvas.width = templateImg.naturalWidth || templateImg.width;
      canvas.height = templateImg.naturalHeight || templateImg.height;

      ctx.drawImage(templateImg, 0, 0);

      const photoImg = new window.Image();
      // Crucial fix: Assign crossOrigin anonymously for S3 compilation pipelines
      photoImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        photoImg.onload = resolve;
        photoImg.onerror = (e) => {
          console.error('Photo image load error:', e);
          reject(e);
        };
        photoImg.src = imageData;
      });

      const photoX = 26;
      const photoY = 119;
      const photoWidth = 116;
      const photoHeight = 128;
      ctx.drawImage(photoImg, photoX, photoY, photoWidth, photoHeight);

      ctx.fillStyle = "black";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.fillText(` ${student?.surname} ${student?.firstName} ${student?.otherName}`, 205, 140);
      ctx.fillText(`${student.matricNumber}`, 248, 164);
      ctx.fillText(`${student.faculty || ""}`, 228, 185);
      ctx.fillText(`${student.department}`, 200, 208);
      ctx.fillText(`${moment(settings?.data?.semester2StartDate).format("YYYY-MM-DD") || ""}`, 255, 231);

      const result = canvas.toDataURL("image/png");
      setPreviewImage(result);
    } catch (e) {
      console.error('Error generating preview:', e);
      toaster.error({ title: "Failed to generate preview" });
    }
  }, [student, settings]);

  const capturePhoto = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        stopCamera();
        await generatePreview(imageData);
      }
    }
  }, [stopCamera, generatePreview]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setPreviewImage(null);
    startCamera();
  }, [startCamera]);

  const generatePDF = useCallback(async () => {
    if (
      !capturedImage ||
      !request ||
      !student ||
      !templates?.data?.frontUrl ||
      !templates?.data?.backUrl
    ) return;

    setIsProcessing(true);
    try {
      // Create the template URLs using the storage stream endpoint
      const frontUrl = `${new URL("storage/stream?key=" + extractStoragePath(templates.data.frontUrl), ENV.API_BASE_URL + "/api").toString()}`;
      const backUrl = `${new URL("storage/stream?key=" + extractStoragePath(templates.data.backUrl), ENV.API_BASE_URL + "/api").toString()}`;
      const signatureUrl = templates.data.signatureUrl
        ? `${new URL("storage/stream?key=" + extractStoragePath(templates.data.signatureUrl), ENV.API_BASE_URL + "/api").toString()}`
        : undefined;
      const expiryDate = moment(settings?.data?.semester2StartDate).format("YYYY-MM-DD");

      // Generate the PDF using @react-pdf/renderer
      const docInstance = pdf(
        <IDCardDocument
          frontUrl={frontUrl}
          backUrl={backUrl}
          signatureUrl={signatureUrl}
          student={student}
          capturedImage={capturedImage}
          expiryDate={expiryDate}
        />
      );


      // Generate the blob for upload
      const pdfBlob = await docInstance.toBlob();
      const pdfFile = new File([pdfBlob], `id-card-${student?.matricNumber}.pdf`, {
        type: "application/pdf",
      });

      // Download the PDF
      const a = document.createElement("a");
      a.href = URL.createObjectURL(pdfBlob);
      a.download = `id-card-${student?.matricNumber}.pdf`;
      a.click();

      // Clean up the URL object
      URL.revokeObjectURL(a.href);

      // Upload
      uploadMutation.mutate(
        { file: pdfFile, folderName: "idcards" },
        {
          onSuccess: (uploadResponse) => {
            updateMutation.mutate(
              {
                id: request.id,
                data: {
                  status: "ISSUED",
                  fileKey: uploadResponse.data.key,
                  paymentRef: request.paymentRef,
                },
              },
              {
                onSuccess: () => {
                  setIsProcessing(false);
                  toaster.success({ title: "ID card issued successfully" });
                  onClose();
                },
                onError: () => {
                  setIsProcessing(false);
                  toaster.error({ title: "Failed to update ID card request" });
                },
              }
            );
          },
          onError: () => {
            toaster.error({ title: "Failed to upload ID card" });
            setIsProcessing(false);
          },
        }
      );
    } catch (error) {
      console.error("PDF generation error:", error);
      toaster.error({ title: "Failed to generate ID card" });
      setIsProcessing(false);
    }
  }, [capturedImage, request, student, templates, settings, uploadMutation, updateMutation, onClose]);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      sleep(0).then(() => startCamera());
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, capturedImage, startCamera, stopCamera]);

  const handleCancel = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    setPreviewImage(null);
    onClose();
  }, [stopCamera, onClose]);

  return (
    <Dialog.Root
      size="xl"
      placement="center"
      closeOnInteractOutside={false}
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleCancel();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content colorPalette="accent">
            <Dialog.Header>
              <Dialog.Title>Issue ID Card - {student?.surname || ""} {student?.firstName || ""} {student?.otherName || ""}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="4" alignItems="center">
                {!capturedImage ? (
                  <>
                    <Box
                      position="relative"
                      width="640px"
                      height="480px"
                      borderRadius="md"
                      overflow="hidden"
                    >
                      {!isCameraReady && (
                        <Stack
                          position="absolute"
                          inset="0"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                        >
                          <Spinner size="xl" />
                          <Text mt="4">Starting camera...</Text>
                        </Stack>
                      )}
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </Box>

                    {/* Hidden system templates explicitly appending crossOrigin parameters */}
                    <img
                      ref={templateImgRef}
                      src={templates?.data?.frontUrl}
                      crossOrigin="anonymous"
                      alt="ID card front template"
                      style={{ display: 'none' }}
                    />
                    <img
                      ref={backTemplateImgRef}
                      src={templates?.data?.backUrl}
                      crossOrigin="anonymous"
                      alt="ID card back template"
                      style={{ display: 'none' }}
                    />

                    <Stack direction="row" gap="4">
                      <Button
                        size="xl"
                        onClick={capturePhoto}
                        disabled={!isCameraReady || isProcessing}
                        colorPalette="blue"
                      >
                        <Camera /> Capture Photo
                      </Button>
                      <Button
                        size="xl"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isProcessing}
                      >
                        <X /> Cancel
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    {/* Visual Preview (for user) */}
                    <Box
                      position="relative"
                      width="463px"
                      height="295px"
                      borderRadius="md"
                      overflow="hidden"
                      border="2px solid"
                      borderColor="border.muted"
                      bg="white"
                    >
                      {templates?.data?.frontUrl && (
                        <img
                          crossOrigin="anonymous"
                          src={`${new URL("storage/stream?key=" + extractStoragePath(templates.data.frontUrl || ""), ENV.API_BASE_URL + "/api").toString()}`}
                          alt="Front template layer"
                          style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", inset: 0 }}
                        />
                      )}

                      {capturedImage && (
                        <Box
                          position="absolute"
                          left="26px"
                          top="117px"
                          width="117px"
                          height="128px"
                          overflow="hidden"
                        >
                          <img
                            src={capturedImage}
                            alt="Student"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </Box>
                      )}

                      <Box position="absolute" left="205px" top="125px" color="black" fontWeight="bold" fontSize="12px" fontFamily="Inter, sans-serif">
                        <Text>{student?.surname} {student?.firstName} {student?.otherName}</Text>
                      </Box>
                      <Box position="absolute" left="248px" top="148px" color="black" fontWeight="bold" fontSize="12px" fontFamily="Inter, sans-serif">
                        <Text>{student?.matricNumber || ""}</Text>
                      </Box>
                      <Box position="absolute" left="228px" top="169px" color="black" fontWeight="bold" fontSize="12px" fontFamily="Inter, sans-serif">
                        <Text>{student?.faculty?.toLocaleUpperCase() || ""}</Text>
                      </Box>
                      <Box position="absolute" left="200px" top="191px" color="black" fontWeight="bold" fontSize="12px" fontFamily="Inter, sans-serif">
                        <Text>{student?.department?.toLocaleUpperCase() || ""}</Text>
                      </Box>
                      <Box position="absolute" left="255px" top="215px" color="black" fontWeight="bold" fontSize="12px" fontFamily="Inter, sans-serif">
                        <Text>{moment(settings?.data?.semester2StartDate).format("YYYY-MM-DD") || ""}</Text>
                      </Box>
                    </Box>

                    <Stack direction="row" gap="4">
                      <Button
                        size="xl"
                        onClick={generatePDF}
                        disabled={isProcessing || !capturedImage}
                        loading={isProcessing}
                        loadingText="Processing..."
                        colorPalette="green"
                      >
                        <Check /> Issue ID Card
                      </Button>
                      <Button
                        size="xl"
                        variant="outline"
                        onClick={retakePhoto}
                        disabled={isProcessing}
                      >
                        <Camera /> Retake Photo
                      </Button>
                      <Button
                        size="xl"
                        variant="outline"
                        colorPalette="red"
                        onClick={handleCancel}
                        disabled={isProcessing}
                      >
                        <X /> Cancel
                      </Button>
                    </Stack>
                  </>
                )}

                <canvas ref={canvasRef} style={{ display: "none" }} />
                <canvas ref={previewCanvasRef} style={{ display: "none" }} />
              </Stack>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root >
  );
};

export default IDCardCaptureDialog;


function extractStoragePath(urlStr: string) {
  try {
    const url = new URL(urlStr);
    return url.pathname.slice(1);
  } catch (error) {
    console.error("Invalid URL passed", error);
    return "";
  }
}