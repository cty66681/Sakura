"use client";

import {
  Check,
  Gift,
  Sparkles,
} from "lucide-react";

export interface JobBenefitProps {
  benefits: string[];
}

export default function JobBenefit({
  benefits,
}: JobBenefitProps) {
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
              text-emerald-600
            "
          >
            <Gift size={18} />

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
              "
            >
              BENEFITS
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
            福利待遇
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            企业提供的主要福利与员工支持
          </p>
        </div>

        {benefits.length > 0 && (
          <div
            className="
              hidden
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
              text-emerald-600
              sm:flex
            "
          >
            <Sparkles size={19} />
          </div>
        )}
      </div>

      {/* Benefits */}

      {benefits.length > 0 ? (
        <div
          className="
            mt-6
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          {benefits.map((item) => (
            <div
              key={item}
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-emerald-100
                bg-emerald-50/60
                px-4
                py-3.5
              "
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-emerald-600
                  shadow-sm
                "
              >
                <Check size={15} strokeWidth={3} />
              </div>

              <span
                className="
                  text-sm
                  font-bold
                  text-slate-700
                "
              >
                {item}
              </span>
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
          暂未填写福利待遇
        </div>
      )}
    </section>
  );
}