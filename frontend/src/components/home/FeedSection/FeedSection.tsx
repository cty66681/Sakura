
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import FeedCard from "./FeedCard";
import { feeds } from "@/data/feed";

const FEED_PREVIEW_LIMIT = 4;

const tabs = [
  "全部",
  "工作",
  "房源",
  "学校",
  "避坑",
  "资讯",
] as const;

type Tab = (typeof tabs)[number];

const tabTypeMap: Record<
  Exclude<Tab, "全部">,
  "job" | "house" | "school" | "scam" | "news"
> = {
  工作: "job",
  房源: "house",
  学校: "school",
  避坑: "scam",
  资讯: "news",
};

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| GET /api/feed
|
| Query:
| {
|   type?: "job" | "house" | "school" | "scam" | "news",
|   limit?: number,
|   page?: number
| }
|
| 正式接入后台后，只返回允许公开展示的内容。
| 首页预览上限为 4 条。
|
|--------------------------------------------------------------------------
*/

export default function FeedSection() {
  const [activeTab, setActiveTab] =
    useState<Tab>("全部");

  // 先按分类筛选，再限制首页展示数量。
  const filteredFeeds = useMemo(() => {
    if (activeTab === "全部") {
      return feeds;
    }

    const targetType = tabTypeMap[activeTab];

    return feeds.filter(
      (item) => item.type === targetType
    );
  }, [activeTab]);

  const list = filteredFeeds.slice(
    0,
    FEED_PREVIEW_LIMIT
  );

  const currentCount = filteredFeeds.length;

  const moreHref =
    activeTab === "全部"
      ? "/feed"
      : `/feed?type=${encodeURIComponent(
          tabTypeMap[activeTab]
        )}`;

  return (
    <Section className="bg-white">
      <Container>
        <SectionHeader
          badge="今日动态"
          title="今天，日本有什么值得看"
          description="工作、房源、学校、避坑和资讯，看看最近有哪些实用信息。"
          href="/feed"
          actionText="查看全部动态"
        />

        {/* 分类筛选 */}
        <div
          className="
            mt-7
            flex
            flex-col
            gap-4
            border-b
            border-slate-100
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
                        ? "bg-slate-950 text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-[#D34F5C]"
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
              text-slate-400
              sm:text-sm
            "
          >
            共{" "}
            <span className="font-bold text-slate-700">
              {currentCount}
            </span>{" "}
            条
          </p>
        </div>

        {/* 首页最多展示四条 */}
        {list.length > 0 ? (
          <div
            className="
              mt-7
              grid
              grid-cols-1
              gap-4
              lg:grid-cols-2
            "
          >
            {list.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div
            className="
              mt-7
              flex
              min-h-[170px]
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-200
              bg-slate-50
              px-5
            "
          >
            <div className="text-center">
              <p className="font-semibold text-slate-700">
                暂时没有相关动态
              </p>

              <p className="mt-2 text-sm text-slate-400">
                可以切换分类看看其他内容。
              </p>
            </div>
          </div>
        )}

        {/* 查看完整内容 */}
        {currentCount > 0 && (
          <div className="mt-8 flex justify-center">
            <Link
              href={moreHref}
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                px-6
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:border-rose-200
                hover:bg-rose-50
                hover:text-[#D34F5C]
              "
            >
              查看更多
              <span className="ml-2">→</span>
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
