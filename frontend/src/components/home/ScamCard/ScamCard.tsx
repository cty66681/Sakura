"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  ArrowRight,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

export interface ScamCardProps {
  id: number;
  title: string;
  summary: string;
  level: string;
  publishTime: string;
  tags: string[];
  href?: string;
}

function getLevelStyle(level: string) {
  if (
    level.includes("高") ||
    level.includes("严重") ||
    level.includes("危险")
  ) {
    return {
      badge: "bg-red-100 text-red-700",
      icon: "bg-red-50 text-red-600",
    };
  }

  if (
    level.includes("中") ||
    level.includes("注意")
  ) {
    return {
      badge: "bg-orange-100 text-orange-700",
      icon: "bg-orange-50 text-orange-600",
    };
  }

  return {
    badge: "bg-amber-100 text-amber-700",
    icon: "bg-amber-50 text-amber-600",
  };
}

export default function ScamCard({
  id,
  title,
  summary,
  level,
  publishTime,
  tags,
  href,
}: ScamCardProps) {
  const detailHref =
    href ?? `/scam/${id}`;

  const levelStyle =
    getLevelStyle(level);

  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        border-rose-100
        bg-white
        p-0
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-rose-200
        hover:shadow-xl
      "
    >
      {/* Favorite */}

      <div className="absolute right-5 top-5 z-20">
        <FavoriteButton />
      </div>

      <Link
        href={detailHref}
        className="block p-6"
      >
        {/* Header */}

        <div className="flex items-start gap-4 pr-12">
          <div
            className={`
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              ${levelStyle.icon}
            `}
          >
            <ShieldAlert size={22} />
          </div>

          <div className="min-w-0">
            <span
              className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[11px]
                font-bold
                ${levelStyle.badge}
              `}
            >
              {level}
            </span>

            <h3
              className="
                mt-2
                line-clamp-2
                text-xl
                font-black
                leading-snug
                text-slate-900
                transition-colors
                group-hover:text-rose-600
              "
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Summary */}

        <p
          className="
            mt-5
            line-clamp-3
            text-sm
            leading-6
            text-slate-500
          "
        >
          {summary}
        </p>

        {/* Tags */}

        <div className="mt-5 flex flex-wrap gap-2">
          {tags
            .slice(0, 4)
            .map((tag) => (
              <Tag key={tag}>
                {tag}
              </Tag>
            ))}
        </div>

        {/* Publish time */}

        <div
          className="
            mt-6
            flex
            items-center
            gap-2
            text-xs
            font-medium
            text-slate-400
          "
        >
          <TriangleAlert size={15} />

          {publishTime}
        </div>

        {/* Bottom */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            border-t
            border-rose-100
            pt-5
          "
        >
          <span
            className="
              text-sm
              font-bold
              text-slate-500
              transition-colors
              group-hover:text-rose-600
            "
          >
            查看避坑详情
          </span>

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-rose-50
              text-rose-500
              transition-all
              group-hover:bg-rose-600
              group-hover:text-white
            "
          >
            <ArrowRight size={16} />
          </div>
        </div>
      </Link>
    </Card>
  );
}