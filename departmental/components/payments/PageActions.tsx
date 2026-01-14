import { Button } from "@/components/ui/Button";

interface Props {
  onSave: () => void;
  isSaving?: boolean;
}

export const PageActions = ({ onSave, isSaving = false }: Props) => {
  return (
    <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-200">
      <Button onClick={onSave} variant="primary" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

