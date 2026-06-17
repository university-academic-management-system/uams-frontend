import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  Portal,
  Stack,
  Spinner,
  Text,
  Box,
  Image,
} from "@chakra-ui/react";
import { Camera, Check, X } from "lucide-react";
import { IDCardHooks } from "@hooks/idcard.hook";
import { toaster } from "@components/ui/toaster";
import type { IDCardRequest } from "@type/idCard.type";
import jsPDF from "jspdf";

interface IDCardCaptureDialogProps {
  request: IDCardRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const IDCardCaptureDialog = ({ request, isOpen, onClose }: IDCardCaptureDialogProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const templateImgRef = useRef<HTMLImageElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: templates } = IDCardHooks.useIDCardTemplates();
  const uploadMutation = IDCardHooks.useUploadToStorage();
  const updateMutation = IDCardHooks.useUpdateIDCardRequest();

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

      // Wait for template image to load if it's not already
      if (!templateImg.complete || templateImg.naturalWidth === 0) {
        await new Promise((resolve) => {
          const checkLoad = () => {
            if (templateImg.complete || templateImg.naturalWidth > 0) {
              resolve(null);
            }
          };
          templateImg.onload = checkLoad;
          templateImg.onerror = resolve; // Fall through even if error
          checkLoad(); // Check if already loaded
        });
      }

      canvas.width = templateImg.naturalWidth  || templateImg.width;
      canvas.height = templateImg.naturalHeight || templateImg.height;

      ctx.drawImage(templateImg, 0, 0);

      const photoImg = new window.Image();
      await new Promise((resolve, reject) => {
        photoImg.onload = resolve;
        photoImg.onerror = (e) => {
          console.error('Photo image load error:', e);
          reject(e);
        };
        photoImg.src = imageData;
      });

      photoImg.style.objectFit = "cover";
      const photoX = 26;
      const photoY = 119;
      const photoWidth = 116;
      const photoHeight = 128;
      ctx.drawImage(photoImg, photoX, photoY, photoWidth, photoHeight);

      const result = canvas.toDataURL("image/png");
      setPreviewImage(result);
    } catch (e) {
      console.error('Error generating preview:', e);
      toaster.error({ title: "Failed to generate preview" });
    }
  }, []);

  const capturePhoto = useCallback(() => {
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
        generatePreview(imageData);
      }
    }
  }, [stopCamera, generatePreview]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setPreviewImage(null);
    startCamera();
  }, [startCamera]);

  const generatePDF = useCallback(async () => {
    if (!capturedImage || !templates?.data || !request) return;

    setIsProcessing(true);
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98],
      });

      const frontImg = new window.Image();
      frontImg.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        frontImg.onload = resolve;
        frontImg.onerror = reject;
        frontImg.src = templates.data.frontUrl;
      });

      pdf.addImage(frontImg, "PNG", 0, 0, 85.6, 53.98);

      const photoImg = new window.Image();
      photoImg.src = capturedImage;

      await new Promise((resolve, reject) => {
        photoImg.onload = resolve;
        photoImg.onerror = reject;
      });

      pdf.addImage(photoImg, "PNG", 5, 5, 25, 30);

      pdf.setFontSize(8);
      pdf.text(`${request.student.firstName} ${request.student.lastName}`, 35, 15);
      pdf.text(request.student.matricNumber || "", 35, 22);
      pdf.text(request.student.level || "", 35, 29);

      pdf.addPage();

      const backImg = new window.Image();
      backImg.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        backImg.onload = resolve;
        backImg.onerror = reject;
        backImg.src = templates.data.backUrl;
      });

      pdf.addImage(backImg, "PNG", 0, 0, 85.6, 53.98);

      const pdfBlob = pdf.output("blob");
      const pdfFile = new File([pdfBlob], `id-card-${request.id}.pdf`, {
        type: "application/pdf",
      });

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
                  toaster.success({ title: "ID card issued successfully" });
                  onClose();
                },
                onError: () => {
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
  }, [capturedImage, templates, request, uploadMutation, updateMutation, onClose]);

  useEffect(() => {
    if (isOpen && !capturedImage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      startCamera();
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
              <Dialog.Title>Issue ID Card - {request?.student.firstName} {request?.student.lastName}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="4" alignItems="center">
                {!capturedImage ? (
                  <>
                    <Box
                      position="relative"
                      width="640px"
                      height="480px"
                      // bg="black"
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

                    {/* Hidden template image for canvas drawing - use local to avoid tainted canvas */}
                    <Image
                      ref={templateImgRef}
                      src="/admin/assets/id-card-front-template.png"
                      alt="ID card front template"
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
                    <Box
                      width="auto"
                      maxWidth="100%"
                      borderRadius="md"
                      overflow="hidden"
                      border="2px solid"
                      borderColor="border.muted"
                    >
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="ID card preview"
                          style={{ width: "80em", height: "auto" }}
                        />
                      )}
                    </Box>
                    <Stack direction="row" gap="4">
                      <Button
                        size="xl"
                        onClick={generatePDF}
                        disabled={isProcessing}
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
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default IDCardCaptureDialog;
