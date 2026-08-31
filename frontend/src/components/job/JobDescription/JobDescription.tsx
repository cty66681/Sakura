"use client";

import {
  BriefcaseBusiness,
  FileText,
} from "lucide-react";

export interface JobDescriptionProps {
  description: string;
}

export default function JobDescription({
  description,
}: JobDescriptionProps) {
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
            <FileText size={18} />

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
              "
            >
              JOB DESCRIPTION
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
            职位描述
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            工作内容、岗位职责以及相关要求
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
          <BriefcaseBusiness size={19} />
        </div>
      </div>

      {/* Description */}

      {paragraphs.length > 0 ? (
        <div className="mt-7 space-y-4">
          {paragraphs.map((paragraph, index) => (
            <div
              key={`${paragraph}-${index}`}
              className="
                flex
                items-start
                gap-3
              "
            >
              <div
                className="
                  mt-[9px]
                  h-1.5
                  w-1.5
                  shrink-0
                  rounded-full
                  bg-blue-500
                "
              />

              <p
                className="
                  text-[15px]
                  leading-8
                  text-slate-700
                "
              >
                {paragraph}
              </p>
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
            py-10
            text-center
            text-sm
            text-slate-400
          "
        >
          暂未填写职位描述
        </div>
      )}
    </section>
  );
}