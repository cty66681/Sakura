"use client";

import {
  Briefcase,
  Laptop,
  GraduationCap,
  Languages,
  Clock3,
  CalendarDays,
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
      icon: Briefcase,
      label: "工作性质",
      value: employmentType,
    },
    {
      icon: Laptop,
      label: "办公方式",
      value: remote,
    },
    {
      icon: Briefcase,
      label: "工作经验",
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
        职位信息
      </h2>

      <div className="grid gap-5 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-3"
            >
              <Icon
                size={20}
                className="mt-1 text-blue-500"
              />

              <div>
                <div className="text-sm text-slate-500">
                  {item.label}
                </div>

                <div className="mt-1 font-medium text-slate-900">
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}