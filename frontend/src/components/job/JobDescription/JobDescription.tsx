"use client";

export interface JobDescriptionProps {
  description: string;
}

export default function JobDescription({
  description,
}: JobDescriptionProps) {
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
        职位描述
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