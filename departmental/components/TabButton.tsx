import React from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
      active
        ? "bg-white text-blue-600 shadow-sm"
        : "text-slate-500 hover:text-slate-700"
    }`}
  >
    {icon} {label}
  </button>
);

export default TabButton;
