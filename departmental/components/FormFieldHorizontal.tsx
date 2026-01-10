// FormFieldHorizontal.tsx - UPDATED VERSION
import React from "react";
import { ChevronDown } from "lucide-react";

interface FormFieldHorizontalProps {
  label: string;
  placeholder?: string;
  type?: "text" | "select" | "textarea";
  options?: Array<{ label: string; value: string }> | string[]; // ✅ Allow both formats
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

const FormFieldHorizontal: React.FC<FormFieldHorizontalProps> = ({
  label,
  placeholder,
  type = "text",
  options = [],
  value,
  onChange,
  required = false,
}) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Helper to normalize options
  const normalizedOptions = React.useMemo(() => {
    if (options.length === 0) return [];

    // If options are objects with label/value
    if (
      typeof options[0] === "object" &&
      "label" in options[0] &&
      "value" in options[0]
    ) {
      return options as Array<{ label: string; value: string }>;
    }

    // If options are strings, convert to label/value pairs
    return (options as string[]).map((opt) => ({
      label: opt,
      value: opt,
    }));
  }, [options]);

  return (
    <div className="flex items-start gap-12 group">
      <label className="text-sm font-bold text-slate-600 w-28 pt-2 shrink-0">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex-1 max-w-sm">
        {type === "text" && (
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            required={required}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
          />
        )}
        {type === "select" && (
          <div className="relative group/select">
            <select
              value={value}
              onChange={handleChange}
              required={required}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">{placeholder || "Select an option"}</option>
              {normalizedOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown size={14} />
            </div>
          </div>
        )}
        {type === "textarea" && (
          <textarea
            value={value}
            onChange={handleChange}
            required={required}
            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 outline-none h-28 resize-none transition-all"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default FormFieldHorizontal;

