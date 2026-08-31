"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  GraduationCap,
  Languages,
  Laptop,
  UserRoundCheck,
} from "lucide-react";

export interface JobInfoProps {
  employmentType: string;
  remote: string;
  experience: string;
  education: string;
  language: string;
  workingHours: string;
  holiday: string;
}

export default function JobInfo({
  employmentType,
  remote,
  experience,
  education,
  language,
  workingHours,
  holiday,
}: JobInfoProps) {
  const items = [
    {
      icon: BriefcaseBusiness,
      label: "雇佣类型",
      value: employmentType,
    },
    {
      icon: Laptop,
      label: "工作方式",
      value: remote,
    },
    {
      icon: UserRoundCheck,
      label: "经验要求",
      value: experience,
    },
    {
      icon: GraduationCap,
      label: "学历要求",
      value: education,
    },
    {
      icon: Languages,
      label: "日语要求",
      value: language,
    },
    {
      icon: Clock3,
      label: "工作时间",
      value: workingHours,
    },
    {
      icon: CalendarDays,
      label: "休息制度",
      value: holiday,
    },
  ];

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

      <div>
        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.16em]
            text-blue-600
          "
        >
          JOB INFORMATION
        </p>

        <h2
          className="
            mt-2
            text-xl
            font-black
            text-slate-950
          "
        >
          职位基本信息
        </h2>
      </div>

      {/* Information */}

      <div
        className="
          mt-6
          grid
          overflow-hidden
          rounded-2xl
          border
          border-slate-100
          sm:grid-cols-2
        "
      >
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`
                flex
                min-h-[100px]
                items-center
                gap-4
                p-4
                transition
                hover:bg-slate-50
                sm:p-5
                ${
                  index !== items.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }
                ${
                  index < items.length - 2
                    ? "sm:border-b"
                    : ""
                }
                ${
                  index % 2 === 0
                    ? "sm:border-r"
                    : ""
                }
              `}
            >
              {/* Icon */}

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <Icon size={19} />
              </div>

              {/* Text */}

              <div className="min-w-0">
                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  {item.label}
                </p>

                <p
                  className="
                    mt-1
                    break-words
                    text-sm
                    font-bold
                    leading-6
                    text-slate-800
                  "
                >
                  {item.value || "未填写"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}