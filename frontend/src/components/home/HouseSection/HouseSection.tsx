
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import HouseCard from "../HouseCard";

import { houses } from "@/data/houses";

const PREVIEW_LIMIT = 3;

const tabs = [
  "全部",
  "东京",
  "近车站",
  "可养宠物",
  "拎包入住",
] as const;

type Tab = (typeof tabs)[number];

const moreLinks: Record<Tab, string> = {
  全部: "/houses",
  东京: "/houses?region=东京",
  近车站: "/houses?feature=近车站",
  可养宠物: "/houses?feature=可养宠物",
  拎包入住: "/houses?feature=拎包入住",
};

/*
 * 获取日本当地日期。
 * 用于避免已过展示有效期的房源继续出现在首页。
 */
function getTodayInJapan(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

/*
 * 仅识别 YYYY-MM-DD 或 ISO 格式的日期。
 * 没有有效截止日期时，不擅自判定房源过期。
 */
function getDatePart(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const match = value.match(
    /^(\d{4}-\d{2}-\d{2})(?:$|T)/
  );

  return match?.[1] ?? null;
}

function includesKeyword(
  values: string[] | undefined,
  keywords: string[]
): boolean {
  return (
    values?.some((value) =>
      keywords.some((keyword) =>
        value.toLowerCase().includes(
          keyword.toLowerCase()
        )
      )
    ) ?? false
  );
}

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| GET /api/houses
|
| Query:
| {
|   featured?: true,
|   region?: string,
|   feature?: string,
|   listingStatus: "available",
|   moderationStatus: "approved",
|   limit: 3
| }
|
| 当前阶段使用 "@/data/houses" Mock 数据。
|
| 正式接入后台后：
| 1. 只返回审核通过、允许公开展示的房源。
| 2. 排除已出租、暂停出租、隐藏和过期的房源。
| 3. 根据真实的房源状态及有效期筛选。
| 4. 按实际发布时间或后台推荐规则排序。
|
|--------------------------------------------------------------------------
*/

export default function HouseSection() {
  const [activeTab, setActiveTab] =
    useState<Tab>("全部");

  const filteredHouses = useMemo(() => {
    const today = getTodayInJapan();

    return houses
      .filter((house) => {
        // 首页只展示已审核、当前可出租的房源。
        if (
          house.moderationStatus !== "approved" ||
          house.listingStatus !== "available"
        ) {
          return false;
        }

        // 如果有明确的有效期，排除已过期房源。
        const expiresAt = getDatePart(
          house.expiresAt
        );

        if (expiresAt && expiresAt < today) {
          return false;
        }

        return true;
      })
      .filter((house) => {
        if (activeTab === "全部") {
          return true;
        }

        if (activeTab === "东京") {
          return (
            house.prefecture?.includes("東京") ||
            house.prefecture?.includes("东京") ||
            house.location?.includes("东京") ||
            house.location?.includes("東京") ||
            false
          );
        }

        if (activeTab === "近车站") {
          // 有实际步行时间时，优先使用它。
          if (
            typeof house.walkMinutes === "number" &&
            Number.isFinite(house.walkMinutes)
          ) {
            return house.walkMinutes <= 10;
          }

          // 没有步行时间时，使用已有标签。
          return includesKeyword(
            house.tags,
            [
              "近车站",
              "车站近",
              "駅近",
              "步行",
              "徒歩",
            ]
          );
        }

        if (activeTab === "可养宠物") {
          const keywords = [
            "宠物",
            "ペット",
            "pet",
          ];

          return (
            includesKeyword(house.tags, keywords) ||
            includesKeyword(house.features, keywords)
          );
        }

        if (activeTab === "拎包入住") {
          const keywords = [
            "拎包入住",
            "家具",
            "家电",
            "家具付き",
            "家電付き",
            "furnished",
          ];

          return (
            includesKeyword(house.tags, keywords) ||
            includesKeyword(house.features, keywords)
          );
        }

        return true;
      })
      .sort((a, b) =>
        b.publishTime.localeCompare(a.publishTime)
      );
  }, [activeTab]);

  const visibleHouses = filteredHouses.slice(
    0,
    PREVIEW_LIMIT
  );

  const totalCount = filteredHouses.length;

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
          badge="日本租房"
          title="看看有没有合适的住处"
          description="按地区和居住需求快速浏览房源，找到感兴趣的房子后再查看详细信息。"
          href="/houses"
          actionText="查看全部房源"
        />

        {/* 分类筛选 */}
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
                  onClick={() =>
                    setActiveTab(tab)
                  }
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

          <p
            className="
              shrink-0
              text-xs
              text-slate-500
              sm:text-sm
            "
          >
            当前可展示{" "}
            <span className="font-bold text-slate-800">
              {totalCount}
            </span>{" "}
            套
          </p>
        </div>

        {/* 首页最多展示三套房源 */}
        {visibleHouses.length > 0 ? (
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
            {visibleHouses.map((house) => (
              <HouseCard
                key={house.id}
                {...house}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              mt-7
              flex
              min-h-[180px]
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-[#E8E1DE]
              bg-white
              px-5
              text-center
            "
          >
            <div>
              <p className="font-semibold text-slate-800">
                当前没有符合条件的房源
              </p>

              <p className="mt-2 text-sm text-slate-500">
                可以切换分类，看看其他房源。
              </p>

              {activeTab !== "全部" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("全部")
                  }
                  className="
                    mt-4
                    min-h-10
                    rounded-full
                    px-4
                    text-sm
                    font-semibold
                    text-[#C64B58]
                    transition
                    hover:bg-[#FFF1F0]
                  "
                >
                  查看其他房源
                </button>
              )}
            </div>
          </div>
        )}

        {/* 查看更多 */}
        <div className="mt-8 flex justify-center">
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
              ? "查看全部房源"
              : "查看更多房源"}

            <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
