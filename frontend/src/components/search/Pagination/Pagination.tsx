"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center

          rounded-xl

          border
          border-slate-200

          transition

          hover:bg-slate-100

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const current = index + 1;

        return (
          <button
            key={current}
            onClick={() => onChange(current)}
            className={`
              h-10
              w-10
              rounded-xl
              text-sm
              font-medium
              transition

              ${
                current === page
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 hover:bg-slate-100"
              }
            `}
          >
            {current}
          </button>
        );
      })}

      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center

          rounded-xl

          border
          border-slate-200

          transition

          hover:bg-slate-100

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}