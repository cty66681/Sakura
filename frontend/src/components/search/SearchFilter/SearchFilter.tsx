"use client";

import { ReactNode } from "react";
import { RotateCcw } from "lucide-react";

export interface SearchFilterProps {
  children: ReactNode;
  onReset?: () => void;
}

export default function SearchFilter({
  children,
  onReset,
}: SearchFilterProps) {
  return (
    <div
      className="
        sticky
        top-24

        rounded-2xl

        border
        border-slate-200

        bg-white

        p-6

        shadow-sm
      "
    >
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            筛选条件
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            根据条件快速筛选结果
          </p>

        </div>

        <button
          type="button"
          onClick={onReset}
          className="
            flex
            items-center
            gap-2

            rounded-lg

            px-3
            py-2

            text-sm
            text-blue-600

            transition-all

            hover:bg-blue-50
          "
        >
          <RotateCcw size={15} />

          清空筛选
        </button>

      </div>

      {/* Filter */}

      <div className="space-y-8">

        {children}

      </div>

    </div>
  );
}