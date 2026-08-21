"use client";

import { Clock3, X } from "lucide-react";

const histories = [
  "Java",
  "React",
  "东京大学",
  "池袋租房",
  "AWS",
];

export default function SearchHistory() {
  return (
    <div className="mt-8">

      <div className="mb-4 flex items-center justify-between">

        <div className="flex items-center gap-2">

          <Clock3
            size={18}
            className="text-slate-500"
          />

          <h3 className="text-sm font-semibold text-slate-700">
            最近搜索
          </h3>

        </div>

        <button
          className="
            text-sm
            text-slate-400

            transition-colors

            hover:text-red-500
          "
        >
          清空
        </button>

      </div>

      <div className="flex flex-wrap gap-3">

        {histories.map((item) => (
          <button
            key={item}
            className="
              group

              flex
              items-center
              gap-2

              rounded-full

              border
              border-slate-200

              bg-white

              px-4
              py-2

              text-sm
              text-slate-600

              transition-all

              hover:border-blue-500
              hover:bg-blue-50
            "
          >
            {item}

            <X
              size={14}
              className="
                opacity-0

                transition-all

                group-hover:opacity-100
              "
            />

          </button>
        ))}

      </div>

    </div>
  );
}