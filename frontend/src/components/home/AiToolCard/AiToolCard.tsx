"use client";

import Link from "next/link";

import {
  ArrowRight,
  Briefcase,
  FileSearch,
  FileText,
  GraduationCap,
  Languages,
  ShieldAlert,
} from "lucide-react";

export const icons = {
  FileText,
  Briefcase,
  GraduationCap,
  FileSearch,
  ShieldAlert,
  Languages,
};

export type IconName = keyof typeof icons;

export interface AiToolCardProps {
  id: number;
  title: string;
  description: string;
  icon: IconName;
  href?: string;
  status?: "available" | "coming";
}

export default function AiToolCard({
  id,
  title,
  description,
  icon,
  href,
  status = "available",
}: AiToolCardProps) {
  const Icon = icons[icon];

  const isComing =
    status === "coming";

  const detailHref =
    href ?? `/ai-tools/${id}`;

  const content = (
    <>
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-blue-400/15
            bg-blue-400/10
            text-blue-300
            transition-all
            duration-300
            group-hover:border-blue-400/30
            group-hover:bg-blue-400/15
          "
        >
          <Icon size={24} />
        </div>

        {isComing && (
          <span
            className="
              rounded-full
              border
              border-white/10
              bg-white/5
              px-3
              py-1
              text-[11px]
              font-bold
              text-slate-400
            "
          >
            即将开放
          </span>
        )}
      </div>

      {/* Title */}

      <h3
        className="
          mt-6
          text-xl
          font-black
          text-white
          transition-colors
          group-hover:text-blue-300
        "
      >
        {title}
      </h3>

      {/* Description */}

      <p
        className="
          mt-3
          line-clamp-3
          min-h-[72px]
          text-sm
          leading-6
          text-slate-400
        "
      >
        {description}
      </p>

      {/* Bottom */}

      <div
        className="
          mt-7
          flex
          items-center
          justify-between
          border-t
          border-white/10
          pt-5
        "
      >
        <span
          className={`
            text-sm
            font-bold
            transition-colors
            ${
              isComing
                ? "text-slate-500"
                : "text-slate-300 group-hover:text-white"
            }
          `}
        >
          {isComing
            ? "功能开发中"
            : "立即体验"}
        </span>

        <div
          className={`
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            transition-all
            ${
              isComing
                ? "bg-white/5 text-slate-600"
                : `
                  bg-white/5
                  text-slate-400
                  group-hover:bg-blue-500
                  group-hover:text-white
                `
            }
          `}
        >
          <ArrowRight size={16} />
        </div>
      </div>
    </>
  );

  if (isComing) {
    return (
      <div
        className="
          group
          rounded-[24px]
          border
          border-white/10
          bg-white/[0.035]
          p-6
          opacity-70
          backdrop-blur
        "
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={detailHref}
      className="
        group
        block
        rounded-[24px]
        border
        border-white/10
        bg-white/[0.045]
        p-6
        backdrop-blur
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-400/25
        hover:bg-white/[0.07]
        hover:shadow-2xl
        hover:shadow-blue-950/30
      "
    >
      {content}
    </Link>
  );
}