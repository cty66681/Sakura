"use client";

export interface SearchHotProps {
  keywords: string[];
  onClick?: (keyword: string) => void;
}

export default function SearchHot({
  keywords,
  onClick,
}: SearchHotProps) {
  return (
    <div className="mb-8">

      <h3 className="mb-3 text-sm font-semibold text-slate-500">
        热门搜索
      </h3>

      <div className="flex flex-wrap gap-3">

        {keywords.map((item) => (
          <button
            key={item}
            onClick={() => onClick?.(item)}
            className="
              rounded-full
              border
              border-slate-200

              bg-white

              px-4
              py-2

              text-sm

              transition

              hover:border-blue-500
              hover:text-blue-600
            "
          >
            {item}
          </button>
        ))}

      </div>

    </div>
  );
}