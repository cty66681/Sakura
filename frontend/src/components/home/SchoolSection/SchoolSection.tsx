
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import SchoolCard from "../SchoolCard";

import { schools } from "@/data/schools";

const PREVIEW_LIMIT = 3;

const tabs = [
  "全部",
  "大学",
  "大学院",
  "专门学校",
  "语言学校",
] as const;

type Tab = (typeof tabs)[number];

const moreLinks: Record<Tab, string> = {
  全部: "/schools",
  大学: "/schools/university?degree=大学",
  大学院: "/schools/university?degree=大学院",
  专门学校: "/schools/college",
  语言学校: "/schools/language",
};

function getTodayInJapan(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    Number(
      parts.find((part) => part.type === type)?.value ?? 0
    );

  return (
    get("year") * 10000 +
    get("month") * 100 +
    get("day")
  );
}

function parseDeadline(value: string): number | null {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
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

// Mock 数据的首页预览日期。
// 正式后台应按请求时的日本日期动态筛选。
const TODAY_IN_JAPAN = getTodayInJapan();

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| GET /api/schools/home
|
| Query:
| {
|   type?: "大学" | "大学院" | "专门学校" | "语言学校",
|   limit?: number
| }
|
| 当前仅展示 Mock 学校资料。
|
| 正式后台应提供：
| - 经核实的招生批次
| - 对应批次的申请截止日期
| - 招生状态与最后核实时间
|
| 不能仅凭某轮截止日期推断学校停止招生。
|
|--------------------------------------------------------------------------
*/

export default function SchoolSection() {
  const [activeTab, setActiveTab] =
    useState<Tab>("全部");

  const filteredSchools = useMemo(() => {
    return schools
      .filter(
        (school) =>
          activeTab === "全部" ||
          school.type === activeTab
      )
      .filter((school) => {
        const deadline = parseDeadline(
          school.deadline
        );

        // 无法识别的日期不擅自判定过期。
        return (
          deadline === null ||
          deadline >= TODAY_IN_JAPAN
        );
      })
      .sort((a, b) => {
        const aDate =
          parseDeadline(a.deadline) ??
          Number.MAX_SAFE_INTEGER;

        const bDate =
          parseDeadline(b.deadline) ??
          Number.MAX_SAFE_INTEGER;

        return aDate - bDate;
      });
  }, [activeTab]);

  const visibleSchools = filteredSchools.slice(
    0,
    PREVIEW_LIMIT
  );

  return (
    <Section
      className="
        border-t
        border-[#F0EBE8]
        bg-[#FAF9F7]
      "
    >
      <Container>
        <SectionHeader
          badge="日本升学"
          title="看看日本有哪些学校"
          description="大学、大学院、专门学校和语言学校，先了解不同选择，再慢慢比较。"
          href="/schools"
          actionText="进入学校中心"
        />

        {/* 分类 */}
        <div
          className="
            mt-7
            flex
            flex-col
            gap-4
            border-b
            border-[#ECE7E4]
            pb-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              -mx-1
              flex
              max-w-full
              gap-2
              overflow-x-auto
              px-1
              pb-1
            "
          >
            {tabs.map((tab) => {
              const active = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    min-h-10
                    shrink-0
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    transition
                    ${
                      active
                        ? "bg-[#D9515E] text-white"
                        : "border border-[#EAE5E2] bg-white text-slate-600 hover:border-[#E8B8BC] hover:bg-[#FFF1F0] hover:text-[#CA4D59]"
                    }
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <p className="shrink-0 text-xs text-slate-500">
            当前显示{" "}
            <span className="font-bold text-slate-800">
              {visibleSchools.length}
            </span>{" "}
            条资料
          </p>
        </div>

        {/* 学校卡片 */}
        {visibleSchools.length > 0 ? (
          <div
            className="
              mt-7
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {visibleSchools.map((school) => (
              <SchoolCard
                key={school.id}
                {...school}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              mt-7
              rounded-2xl
              border
              border-dashed
              border-[#E8E1DE]
              bg-white
              px-5
              py-12
              text-center
            "
          >
            <p className="font-semibold text-slate-800">
              暂时没有近期截止日期资料
            </p>

            <p className="mt-2 text-sm text-slate-500">
              这不代表学校停止招生，可以进入学校中心继续查看。
            </p>
          </div>
        )}

        {/* Mock 数据说明 */}
        <p
          className="
            mt-5
            text-center
            text-xs
            leading-5
            text-slate-400
          "
        >
          当前为示例数据，非真实招生公告。
          正式申请前请核对学校官方募集要项。
        </p>

        {/* 更多 */}
        <div className="mt-7 flex justify-center">
          <Link
            href={moreLinks[activeTab]}
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-[#E6D9D7]
              bg-white
              px-6
              text-sm
              font-semibold
              text-[#B94855]
              transition
              hover:border-[#D9515E]
              hover:bg-[#FFF1F0]
            "
          >
            {activeTab === "全部"
              ? "查看全部学校"
              : `查看更多${activeTab}`}

            <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
