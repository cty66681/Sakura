"use client";

export interface CheckboxOption {
  label: string;
  value: string;
}

export interface CheckboxFilterProps {
  options: CheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export default function CheckboxFilter({
  options,
  value,
  onChange,
}: CheckboxFilterProps) {
  const toggle = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

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
            transition-colors
            hover:bg-slate-50
          "
        >
          <input
            type="checkbox"
            checked={value.includes(item.value)}
            onChange={() => toggle(item.value)}
            className="
              h-4
              w-4
              rounded
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