import { Button } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";
import { snapdom } from "@zumer/snapdom";
import { useCallback, useTransition } from "react";
import { LuDownload } from "react-icons/lu";

interface CourseResultsDownloaderProps {
  targetId: string;
  filename?: string;
  onBeforeCapture?: () => void | Promise<void>;
  onAfterCapture?: () => void | Promise<void>;
}

export const CourseResultsDownloader = ({
  targetId,
  filename = "course-results",
  onBeforeCapture,
  onAfterCapture,
}: CourseResultsDownloaderProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDownload = useCallback(async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      toaster.error({ description: "Content not found" });
      return;
    }
    try {
      startTransition(async () => {
        // Run before capture (e.g., show hidden elements)
        if (onBeforeCapture) await onBeforeCapture();

        const blob = await snapdom(element);
        await blob.toJpg({ scale: 2, quality: 1, cache: "disabled" });
        await blob.download({ filename: `${filename}.jpg`, type: "jpg", scale: 2 });
        toaster.success({ description: "Download started" });

        // Run after capture (e.g., hide elements again)
        if (onAfterCapture) await onAfterCapture();
      });
    } catch (error) {
      toaster.error({ description: "Error downloading image" });
      console.error(error);
    }
  }, [targetId, filename, onBeforeCapture, onAfterCapture]);

  return (
    <Button
      loading={isPending}
      colorPalette="accent"
      variant="ghost"
      size="sm"
      onClick={handleDownload}
    >
      <LuDownload /> Download Result
    </Button>
  );
};