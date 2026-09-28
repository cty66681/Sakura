
"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  MapPin,
} from "lucide-react";

export interface SchoolCardProps {
  id: number;
  name: string;
  type: string;
  location: string;
  deadline: string;
  tags: string[];
  href: string;
}

/*
 * 获取日本当地日期。
 * 只用于判断所列的明确截止日是否已经过去。
 * 不能据此判断学校是否仍在招生。
 */
function getTodayInJapan(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const getPart = (type: string) =>
    Number(
      parts.find((part) => part.type === type)?.value ?? 0
    );

  return (
    getPart("year") * 10000 +
    getPart("month") * 100 +
    getPart("day")
  );
}

/*
 * 只识别完整的年月日，例如：
 * 2026-10-31
 * 2026/10/31
 * 2026年10月31日
 *
 * 模糊日期和多个招生批次不做自动判断。
 */
function parseDeadline(value: string): number | null {
  const match = value.trim().match(
    /^(\d{4})(?:[-/.]|年)(\d{1,2})(?:[-/.]|月)(\d{1,2})日?$/
  );

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return year * 10000 + month * 100 + day;
}

const TODAY_IN_JAPAN = getTodayInJapan();

export default function SchoolCard({
  name,
  type,
  location,
  deadline,
  tags,
  href,
}: SchoolCardProps) {
  const parsedDeadline = parseDeadline(deadline);

  const isPastDeadline =
    parsedDeadline !== null &&
    parsedDeadline < TODAY_IN_JAPAN;

  const hasDeadline = deadline.trim().length > 0;

  return (
    <Card
      className="
        group
        relative
        h-full
        overflow-hidden
        rounded-2xl
        border
        border-[#ECE7E4]
        bg-white
        p-0
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-[#EABAC0]
        hover:shadow-[0_8px_28px_rgba(70,45,45,0.06)]
      "
    >
      {/* 收藏：保持独立，不影响详情链接 */}
      <div className="absolute right-5 top-5 z-20">
        <FavoriteButton />
      </div>

      <Link
        href={href}
        className="
          flex
          h-full
          flex-col
          p-5
          outline-none
          focus-visible:ring-2
          focus-visible:ring-[#D9515E]
          focus-visible:ring-inset
          sm:p-6
        "
      >
        {/* 学校名称 */}
        <div className="flex items-start gap-3 pr-10">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#FFF0EE]
              text-[#D9515E]
            "
          >
            <GraduationCap
              size={22}
              strokeWidth={1.8}
            />
          </div>

          <div className="min-w-0 flex-1">
            <span
              className="
                inline-flex
                rounded-md
                bg-[#F7F5F3]
                px-2.5
                py-1
                text-xs
                font-semibold
                text-[#787780]
              "
            >
              {type}
            </span>

            <h3
              className="
                mt-2
                line-clamp-2
                text-lg
                font-bold
                leading-snug
                text-[#30343B]
                transition-colors
                group-hover:text-[#C64B58]
                sm:text-xl
              "
            >
              {name}
            </h3>
          </div>
        </div>

        {/* 地区与申请资料 */}
        <div className="mt-6 space-y-3">
          <div
            className="
              flex
              items-start
              gap-2
              text-sm
              text-[#777B83]
            "
          >
            <MapPin
              size={16}
              className="
                mt-0.5
                shrink-0
                text-[#B77E7F]
              "
            />

            <span>{location}</span>
          </div>

          <div
            className="
              flex
              items-start
              gap-2
              text-sm
              text-[#777B83]
            "
          >
            <CalendarDays
              size={16}
              className="
                mt-0.5
                shrink-0
                text-[#B77E7F]
              "
            />

            <div className="min-w-0">
              <p>
                {hasDeadline
                  ? `资料所列申请截止：${deadline}`
                  : "申请截止日期待确认"}
              </p>

              {isPastDeadline && (
                <p
                  className="
                    mt-1.5
                    text-xs
                    font-semibold
                    text-[#C64B58]
                  "
                >
                  该轮截止日期已过
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 日期说明 */}
        <p
          className="
            mt-4
            rounded-lg
            bg-[#FAF8F6]
            px-3
            py-2
            text-xs
            leading-5
            text-[#89868A]
          "
        >
          {isPastDeadline
            ? "请查看学校是否公布了新一轮招生信息。"
            : "招生时间及受理状态，请以学校当期募集要项为准。"}
        </p>

        {/* 标签 */}
        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        {/* 底部 */}
        <div
          className="
            mt-auto
            flex
            items-center
            justify-between
            gap-3
            border-t
            border-[#F0EBE9]
            pt-5
            [&:not(:first-child)]:mt-6
          "
        >
          <span
            className="
              text-sm
              font-semibold
              text-[#555961]
              transition-colors
              group-hover:text-[#C64B58]
            "
          >
            查看学校资料
          </span>

          <span
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#FFF0EE]
              text-[#D9515E]
              transition-colors
              group-hover:bg-[#D9515E]
              group-hover:text-white
            "
          >
            <ArrowRight size={17} />
          </span>
        </div>
      </Link>
    </Card>
  );
}
