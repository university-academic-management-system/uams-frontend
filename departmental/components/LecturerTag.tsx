import React from "react";
import { X } from "lucide-react";

interface LecturerTagProps {
  name: string;
  onRemove?: () => void;
}

const LecturerTag: React.FC<LecturerTagProps> = ({ name, onRemove }) => (
  <div className="flex items-center gap-2 bg-[#E9EDF5] text-[#818E9B] px-3 py-1 rounded text-xs font-medium">
    {name}
    <X
      size={12}
      className="cursor-pointer hover:text-rose-500 transition-colors"
      onClick={onRemove}
    />
  </div>
);

export default LecturerTag;
