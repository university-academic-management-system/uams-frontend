import { ActionBar, Button, Portal, CloseButton } from "@chakra-ui/react";
import { Download, Trash2 } from "lucide-react";

interface StudentsTableActionBarProps {
  selectedIds: string[];
  clearSelection: () => void;
  handleBulkDownload: () => void;
  handleBulkDelete: () => void;
}

const StudentsTableActionBar = ({
  selectedIds,
  clearSelection,
  handleBulkDownload,
  handleBulkDelete,
}: StudentsTableActionBarProps) => {
  return (
    <ActionBar.Root
      open={selectedIds.length > 1}
      onOpenChange={(e) => {
        if (!e.open) clearSelection();
      }}
      closeOnInteractOutside={false}
    >
      <Portal>
        <ActionBar.Positioner zIndex="50">
          <ActionBar.Content borderRadius="md" p="2">
            <ActionBar.SelectionTrigger>
              {selectedIds.length} items selected
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator />
            <Button
              onClick={handleBulkDownload}
              size="xl"
              borderRadius="md"
              bg="#1D7AD9"
              color="white"
              display="flex"
              alignItems="center"
              gap="2"
              cursor="pointer"
              border="none"
            >
              <Download size={16} /> Bulk Download
            </Button>
            <Button
              onClick={handleBulkDelete}
              size="xl"
              borderRadius="md"
              bg="red.500"
              color="white"
              display="flex"
              alignItems="center"
              gap="2"
              cursor="pointer"
              border="none"
            >
              <Trash2 size={16} /> Bulk Delete
            </Button>
            <ActionBar.CloseTrigger asChild>
              <CloseButton size="xl" />
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
};

export default StudentsTableActionBar;
