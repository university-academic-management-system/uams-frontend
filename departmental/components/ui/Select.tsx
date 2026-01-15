import React from "react";

// components/ui/Select.tsx

interface SelectProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const Select = ({
  label,
  children,
  className = "",
  ...props
}: SelectProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        className={`px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
