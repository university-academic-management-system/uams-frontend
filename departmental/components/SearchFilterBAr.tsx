// components/SearchFilterBar.tsx
import React from "react";
import { Search, X } from "lucide-react";

interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filterOptions: string[];
  defaultFilterLabel?: string;
  onClearFilters: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  filterOptions,
  defaultFilterLabel = "All Items",
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, email or student ID"
            className="bg-white border border-slate-200 text-xs py-2 pl-10 pr-3 rounded-lg outline-none w-full focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? defaultFilterLabel : option}
              </option>
            ))}
          </select>

          <button
            className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            onClick={onClearFilters}
          >
            <X size={16} className="text-slate-800" />
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};
