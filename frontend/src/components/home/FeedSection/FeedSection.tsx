"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

import SectionHeader from "@/components/ui/SectionHeader";

import FeedCard from "./FeedCard";

import { feeds } from "@/data/feed";

const tabs = [
  "全部",
  "工作",
  "房源",
  "学校",
  "避坑",
  "资讯",
] as const;

type Tab = (typeof tabs)[number];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页今日动态
|
| GET /api/feed
|
| Query:
| {
|   type?: "job" | "house" | "school" | "scam" | "news",
|   limit?: 6
| }
|
| 当前阶段使用 "@/data/feed" mock 数据前端过滤。
|
|--------------------------------------------------------------------------
*/

const tabTypeMap: Record<
  Exclude<Tab, "全部">,
  string
> = {
  工作: "job",
  房源: "house",
  学校: "school",
  避坑: "scam",
  资讯: "news",
};

export default function FeedSection() {
  const [activeTab, setActiveTab] =
    useState<Tab>("全部");

  const list = useMemo(() => {
    if (activeTab === "全部") {
      return feeds.slice(0, 6);
    }

    const targetType =
      tabTypeMap[activeTab];

    return feeds
      .filter(
        (item) =>
          item.type === targetType
      )
      .slice(0, 6);
  }, [activeTab]);

  const currentCount =
    activeTab === "全部"
      ? feeds.length
      : feeds.filter(
          (item) =>
            item.type ===
            tabTypeMap[
              activeTab as Exclude<
                Tab,
                "全部"
              >
            ]
        ).length;

  return (
    <Section className="bg-white">
      <Container>
        <SectionHeader
          badge="今日动态"
          title="今天，日本有什么值得看"
          description="学校、生活、避坑、资讯，以及最新发布的实用信息。"
          href="/feed"
          actionText="查看全部动态"
        />

        {/* Filter bar */}

        <div
          className="
            mt-8
            flex
            flex-col
            gap-5
            border-b
            border-slate-100
            pb-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active =
                activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab)
                  }
                  className={`
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    transition
                    ${
                      active
                        ? "bg-slate-950 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                    }
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <p className="text-sm text-slate-400">
            {activeTab === "全部"
              ? "今日更新"
              : `${activeTab}内容`}

            <span className="mx-1.5 font-black text-slate-900">
              {currentCount}
            </span>

            条
          </p>
        </div>

        {/* Feed */}

        {list.length > 0 ? (
          <div
            className="
              mt-9
              grid
              grid-cols-1
              gap-5
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
              mt-9
              flex
              min-h-[220px]
              items-center
              justify-center
              rounded-[28px]
              border
              border-dashed
              border-slate-200
              bg-slate-50
            "
          >
            <div className="text-center">
              <p className="font-bold text-slate-700">
                暂时没有相关动态
              </p>

              <p className="mt-2 text-sm text-slate-400">
                后续有新内容时会显示在这里。
              </p>
            </div>
          </div>
        )}

        {/* Bottom action */}

        <div className="mt-10 flex justify-center">
          <Link
            href={
              activeTab === "全部"
                ? "/feed"
                : `/feed?type=${encodeURIComponent(
                    tabTypeMap[
                      activeTab as Exclude<
                        Tab,
                        "全部"
                      >
                    ]
                  )}`
            }
            className="
              inline-flex
              h-11
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              px-6
              text-sm
              font-bold
              text-slate-700
              transition
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-950
            "
          >
            查看更多
            <span className="ml-2">
              →
            </span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}