"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

import SectionHeader from "@/components/ui/SectionHeader";

import SchoolCard from "../SchoolCard";

import { schools } from "@/data/schools";

const tabs = [
  "全部",
  "大学",
  "大学院",
  "专门学校",
  "语言学校",
] as const;

type Tab = (typeof tabs)[number];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页推荐学校
|
| GET /api/schools/home
|
| Query:
| {
|   type?: "university" | "college" | "language",
|   degree?: "大学" | "大学院",
|   limit?: 6
| }
|
| 当前阶段：
| 使用 "@/data/schools" mock 数据前端筛选。
|
|--------------------------------------------------------------------------
*/

export default function SchoolSection() {
  const [activeTab, setActiveTab] =
    useState<Tab>("全部");

  const list = useMemo(() => {
    const filtered = schools.filter((school) => {
    if (activeTab === "全部") {
      return true;
    }

    return school.type === activeTab;
  });

    return filtered.slice(0, 6);
  }, [activeTab]);

  const getMoreHref = () => {
    if (activeTab === "大学") {
      return "/schools/university?degree=大学";
    }

    if (activeTab === "大学院") {
      return "/schools/university?degree=大学院";
    }

    if (activeTab === "专门学校") {
      return "/schools/college";
    }

    if (activeTab === "语言学校") {
      return "/schools/language";
    }

    return "/schools";
  };

  return (
    <Section
      className="
        relative
        overflow-hidden
        bg-slate-50
      "
    >
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-20
          h-[420px]
          w-[420px]
          rounded-full
          bg-blue-200/30
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-0
          h-[360px]
          w-[360px]
          rounded-full
          bg-indigo-100/40
          blur-3xl
        "
      />

      <Container>
        <div className="relative z-10">
          <SectionHeader
            badge="日本升学"
            title="找到适合你的学校"
            description="大学・大学院、语言学校、专门学校，按类型快速查看。"
            href="/schools"
            actionText="进入学校中心"
          />

          {/* Tabs + Count */}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                inline-flex
                w-fit
                max-w-full
                flex-wrap
                gap-2
                rounded-2xl
                border
                border-slate-200/80
                bg-white/80
                p-1.5
                shadow-sm
                backdrop-blur
              "
            >
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
                      rounded-xl
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      transition
                      ${
                        active
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }
                    `}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-slate-500">
              当前显示
              <span className="mx-1.5 font-black text-blue-600">
                {list.length}
              </span>
              所推荐学校
            </p>
          </div>

          {/* Cards */}

          {list.length > 0 ? (
            <div
              className="
                mt-10
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {list.map((school) => (
                <SchoolCard
                  key={school.id}
                  {...school}
                />
              ))}
            </div>
          ) : (
            <div
              className="
                mt-10
                flex
                min-h-[260px]
                items-center
                justify-center
                rounded-[28px]
                border
                border-dashed
                border-slate-300
                bg-white/70
              "
            >
              <div className="text-center">
                <p className="font-bold text-slate-800">
                  暂时没有相关学校
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  当前 mock 数据还没有覆盖这个分类。
                </p>
              </div>
            </div>
          )}

          {/* Bottom */}

          <div className="mt-12 flex justify-center">
            <Link
              href={getMoreHref()}
              className="
                inline-flex
                h-12
                items-center
                justify-center
                rounded-full
                bg-slate-950
                px-7
                text-sm
                font-bold
                text-white
                transition
                hover:-translate-y-0.5
                hover:bg-blue-600
              "
            >
              {activeTab === "全部"
                ? "进入学校中心"
                : `查看更多${activeTab}`}

              <span className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}