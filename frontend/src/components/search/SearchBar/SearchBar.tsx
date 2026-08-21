"use client";

import { Search } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative">

        <Search
          size={20}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch?.();
            }
          }}
          placeholder="搜索工作、房源、学校..."
          className="
            h-14
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-white
            pl-12
            pr-28
            text-base
            outline-none
            transition
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />

        <button
          type="button"
          onClick={onSearch}
          className="
            absolute
            right-2
            top-1/2
            -translate-y-1/2
            h-10
            rounded-xl
            bg-blue-600
            px-5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          搜索
        </button>

      </div>
    </div>
  );
}