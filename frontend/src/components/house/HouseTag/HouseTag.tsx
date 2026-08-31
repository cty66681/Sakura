"use client";

import {
  CheckCircle2,
  Sparkles,
  Tags,
} from "lucide-react";

export interface HouseTagProps {
  tags: string[];
}

export default function HouseTag({
  tags,
}: HouseTagProps) {
  return (
    <section
      className="
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        sm:p-7
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className="
              flex
              items-center
              gap-2
              text-blue-600
            "
          >
            <Tags size={17} />

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
              "
            >
              HOUSE FEATURES
            </p>
          </div>

          <h2
            className="
              mt-2
              text-xl
              font-black
              text-slate-950
            "
          >
            房源特点
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            快速了解这套房源的主要优势
          </p>
        </div>

        {tags.length > 0 && (
          <div
            className="
              hidden
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-600
              sm:flex
            "
          >
            <Sparkles size={18} />
          </div>
        )}
      </div>

      {/* Tags */}

      {tags.length > 0 ? (
        <div
          className="
            mt-6
            flex
            flex-wrap
            gap-2.5
          "
        >
          {tags.map((tag) => (
            <div
              key={tag}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-blue-100
                bg-blue-50/70
                px-3.5
                py-2.5
                text-sm
                font-bold
                text-blue-700
              "
            >
              <CheckCircle2
                size={15}
                className="shrink-0 text-blue-500"
              />

              {tag}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-dashed
            border-slate-200
            bg-slate-50
            px-5
            py-8
            text-center
            text-sm
            text-slate-400
          "
        >
          暂无房源特点
        </div>
      )}
    </section>
  );
}