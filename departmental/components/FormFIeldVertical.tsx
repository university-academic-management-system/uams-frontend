import React from "react";

interface FormFieldVerticalProps {
  label: string;
  placeholder?: string;
  type?: "text" | "select";
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
}

const FormFieldVertical: React.FC<FormFieldVerticalProps> = ({
  label,
  placeholder,
  type = "text",
  options = [],
  value,
  onChange,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
        {label}
      </label>
      {type === "text" ? (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
        />
      ) : (
        <select
          value={value}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default FormFieldVertical;
