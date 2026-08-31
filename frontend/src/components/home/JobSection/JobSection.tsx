"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import JobCard from "../JobCard";

import { jobs } from "@/data/jobs";

const tabs = [
  "全部",
  "IT",
  "正社員",
  "高薪",
  "东京",
] as const;

type Tab = (typeof tabs)[number];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页推荐职位
|
| GET /api/jobs
|
| Query:
| {
|   featured?: true,
|   category?: string,
|   employmentType?: string,
|   region?: string,
|   salary?: string,
|   limit?: 6
| }
|
| 当前阶段使用 "@/data/jobs" mock 数据前端筛选。
|
|--------------------------------------------------------------------------
*/

export default function JobSection() {
  const [activeTab, setActiveTab] =
    useState<Tab>("全部");

  const list = useMemo(() => {
    const filtered = jobs.filter((job) => {
      if (activeTab === "全部") {
        return true;
      }

      if (activeTab === "IT") {
        const text = [
          job.title,
          ...(job.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return [
          "it",
          "java",
          "python",
          "react",
          "frontend",
          "backend",
          "engineer",
          "开发",
          "工程师",
          "ai",
        ].some((keyword) =>
          text.includes(keyword.toLowerCase())
        );
      }

      if (activeTab === "正社員") {
        const text = [
          job.title,
          ...(job.tags ?? []),
        ].join(" ");

        return (
          text.includes("正社員") ||
          text.includes("正社员")
        );
      }

      if (activeTab === "高薪") {
        const text = [
          job.salary,
          ...(job.tags ?? []),
        ].join(" ");

        return (
          text.includes("高薪") ||
          text.includes("700") ||
          text.includes("800") ||
          text.includes("900") ||
          text.includes("1000")
        );
      }

      if (activeTab === "东京") {
        return (
          job.location?.includes("东京") ??
          false
        );
      }

      return true;
    });

    return filtered.slice(0, 6);
  }, [activeTab]);

  const getMoreHref = () => {
    switch (activeTab) {
      case "IT":
        return "/jobs?category=IT";

      case "正社員":
        return "/jobs?employmentType=正社員";

      case "高薪":
        return "/jobs?salary=high";

      case "东京":
        return "/jobs?region=东京";

      default:
        return "/jobs";
    }
  };

  return (
    <Section
      className="
        relative
        overflow-hidden
        bg-white
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-24
          h-[380px]
          w-[380px]
          rounded-full
          bg-blue-100/35
          blur-3xl
        "
      />

      <Container>
        <div className="relative z-10">
          <SectionHeader
            badge="工作"
            title="也看看，有没有更适合你的机会"
            description="整理在日华人常关注的 IT、正社員、高薪及东京职位，找工作时可以顺手看看。"
            href="/jobs"
            actionText="查看全部工作"
          />

          {/* Tabs */}

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
                flex
                w-fit
                max-w-full
                flex-wrap
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-1.5
              "
            >
              {tabs.map((tab) => (
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
                      activeTab === tab
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-500 hover:bg-white hover:text-slate-900"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            <p className="text-sm text-slate-500">
              当前显示
              <span className="mx-1.5 font-black text-slate-900">
                {list.length}
              </span>
              个职位
            </p>
          </div>

          {/* Jobs */}

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
              {list.map((job) => (
                <JobCard
                  key={job.id}
                  {...job}
                />
              ))}
            </div>
          ) : (
            <div
              className="
                mt-10
                flex
                min-h-[240px]
                items-center
                justify-center
                rounded-[28px]
                border
                border-dashed
                border-slate-200
                bg-slate-50/70
              "
            >
              <div className="text-center">
                <p className="font-bold text-slate-800">
                  当前没有符合条件的职位
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setActiveTab("全部")
                  }
                  className="
                    mt-3
                    text-sm
                    font-bold
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  查看全部职位
                </button>
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
                border
                border-slate-200
                bg-white
                px-7
                text-sm
                font-bold
                text-slate-700
                transition
                hover:-translate-y-0.5
                hover:border-slate-950
                hover:bg-slate-950
                hover:text-white
              "
            >
              查看更多工作
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