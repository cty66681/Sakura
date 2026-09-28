"use client";

interface RangeFilterProps {
  min: string;
  max: string;
  unit?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export default function RangeFilter({
  min,
  max,
  unit,
  minPlaceholder = "最低",
  maxPlaceholder = "最高",
  onMinChange,
  onMaxChange,
}: RangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        value={min}
        onChange={(e) => onMinChange(e.target.value)}
        placeholder={minPlaceholder}
        className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
      />

      <span className="shrink-0 text-sm text-slate-400">~</span>

      <input
        type="number"
        min="0"
        value={max}
        onChange={(e) => onMaxChange(e.target.value)}
        placeholder={maxPlaceholder}
        className="w-full min-w-0 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
      />

      {unit && (
        <span className="shrink-0 text-xs text-slate-500">
          {unit}
        </span>
      )}
    </div>
  );
}