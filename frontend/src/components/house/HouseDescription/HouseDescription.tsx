"use client";

export interface HouseDescriptionProps {
  description: string;
}

export default function HouseDescription({
  description,
}: HouseDescriptionProps) {
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
          mb-6
          text-lg
          font-semibold
          text-slate-900
        "
      >
        房源介绍
      </h2>

      <div
        className="
          whitespace-pre-line
          leading-8
          text-slate-700
        "
      >
        {description}
      </div>
    </div>
  );
}