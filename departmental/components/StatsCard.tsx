import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  bgColor,
  description,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500">{label}</h3>
        <div className={`${bgColor} p-2.5 rounded-xl`}>{icon}</div>
      </div>
      <div className="mb-2">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      {description && (
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      )}
    </div>
  );
};
