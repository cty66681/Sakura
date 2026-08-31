"use client";

import {
  FileText,
  Home,
} from "lucide-react";

export interface HouseDescriptionProps {
  description: string;
}

export default function HouseDescription({
  description,
}: HouseDescriptionProps) {
  const paragraphs = description
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

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

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-2
              text-blue-600
            "
          >
            <FileText size={17} />

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
              "
            >
              PROPERTY DESCRIPTION
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
            房源介绍
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            了解房屋环境、交通以及入住相关信息
          </p>
        </div>

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
          <Home size={18} />
        </div>
      </div>

      {/* Description */}

      {paragraphs.length > 0 ? (
        <div
          className="
            mt-6
            space-y-4
            rounded-2xl
            border
            border-slate-100
            bg-slate-50/60
            p-5
            sm:p-6
          "
        >
          {paragraphs.map(
            (paragraph, index) => (
              <div
                key={`${index}-${paragraph}`}
                className="
                  flex
                  items-start
                  gap-3
                "
              >
                <span
                  className="
                    mt-[10px]
                    h-1.5
                    w-1.5
                    shrink-0
                    rounded-full
                    bg-blue-500
                  "
                />

                <p
                  className="
                    text-sm
                    leading-8
                    text-slate-700
                    sm:text-[15px]
                  "
                >
                  {paragraph}
                </p>
              </div>
            )
          )}
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
            px-6
            py-10
            text-center
            text-sm
            text-slate-400
          "
        >
          暂未填写房源介绍
        </div>
      )}
    </section>
  );
}