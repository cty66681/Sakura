"use client";

import { Gift } from "lucide-react";

export interface JobBenefitProps {
  benefits: string[];
}

export default function JobBenefit({
  benefits,
}: JobBenefitProps) {
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
      <div className="mb-6 flex items-center gap-2">

        <Gift
          size={20}
          className="text-orange-500"
        />

        <h2
          className="
            text-lg
            font-semibold
            text-slate-900
          "
        >
          福利待遇
        </h2>

      </div>

      <div className="flex flex-wrap gap-3">

        {benefits.map((item) => (
          <span
            key={item}
            className="
              rounded-xl
              bg-blue-50
              px-4
              py-2
              text-sm
              font-medium
              text-blue-700
            "
          >
            {item}
          </span>
        ))}

      </div>
    </div>
  );
}