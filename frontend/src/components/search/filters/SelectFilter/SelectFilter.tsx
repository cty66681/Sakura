"use client";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFilterProps {
  options: SelectOption[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SelectFilter({
  options,
  value,
  placeholder = "请选择",
  onChange,
}: SelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4
        py-3
        text-sm
        text-slate-700
        outline-none
        transition-all
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
      "
    >
      <option value="">
        {placeholder}
      </option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}