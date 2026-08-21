"use client";

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioFilterProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function RadioFilter({
  options,
  value,
  onChange,
}: RadioFilterProps) {
  return (
    <div className="space-y-3">
      {options.map((item) => (
        <label
          key={item.value}
          className="
            flex
            cursor-pointer
            items-center
            gap-3
            rounded-lg
            p-2
            transition
            hover:bg-slate-50
          "
        >
          <input
            type="radio"
            name="radio-filter"
            value={item.value}
            checked={value === item.value}
            onChange={() => onChange(item.value)}
            className="
              h-4
              w-4
              border-slate-300
              text-blue-600
              focus:ring-blue-500
            "
          />

          <span className="text-sm text-slate-700">
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
}