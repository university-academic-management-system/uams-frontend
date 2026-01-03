interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value: string;
  options: Option[];
  loading?: boolean;
  onChange: (value: string) => void;
}

const DropdownField = ({ label, value, options, loading, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-600">{label}</label>
      <select
        value={value}
        disabled={loading}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2.5 bg-slate-50 rounded-xl text-xs"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownField;
