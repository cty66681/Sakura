"use client";

export interface HouseTagProps {
  tags: string[];
}

export default function HouseTag({
  tags,
}: HouseTagProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
      "
    >
      <h2
        className="
          mb-5
          text-lg
          font-semibold
          text-slate-900
        "
      >
        房屋标签
      </h2>

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="
              rounded-full
              bg-blue-50
              px-4
              py-2
              text-sm
              font-medium
              text-blue-600
            "
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}