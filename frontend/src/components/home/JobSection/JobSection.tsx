
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import JobCard from "../JobCard";
import { jobs } from "@/data/jobs";

const PREVIEW_LIMIT = 3;

const HIGH_MONTHLY_SALARY = 700000;
const HIGH_ANNUAL_SALARY = HIGH_MONTHLY_SALARY * 12;

const tabs = [
  "全部",
  "IT",
  "正社員",
  "高薪",
  "东京",
] as const;

type Tab = (typeof tabs)[number];

const moreLinks: Record<Tab, string> = {
  全部: "/jobs",
  IT: "/jobs?category=IT",
  正社員: "/jobs?employmentType=正社員",
  高薪: "/jobs?salary=high",
  东京: "/jobs?region=东京",
};

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
|   salaryMin?: number,
|   moderationStatus: "approved",
|   limit: 3
| }
|
| 当前使用 "@/data/jobs" Mock 数据。
|
| 正式接入后台后：
| - 只返回审核通过且允许公开展示的职位
| - 确认岗位仍在招聘且未过展示有效期
| - 根据真实薪资类型与金额进行筛选
| - 认证标识必须来自实际认证结果
|
|--------------------------------------------------------------------------
*/

export default function JobSection() {
  const [activeTab, setActiveTab] =
    useState<Tab>("全部");

  const filteredJobs = useMemo(() => {
    return jobs
      .filter(
        (job) =>
          job.moderationStatus === "approved"
      )
      .filter((job) => {
        switch (activeTab) {
          case "全部":
            return true;

          case "IT":
            return job.category === "it";

          case "正社員":
            return (
              job.employmentType === "正社員"
            );

          case "高薪": {
            if (
              typeof job.salaryMin !== "number"
            ) {
              return false;
            }

            if (job.salaryType === "monthly") {
              return (
                job.salaryMin >=
                HIGH_MONTHLY_SALARY
              );
            }

            if (job.salaryType === "annual") {
              return (
                job.salaryMin >=
                HIGH_ANNUAL_SALARY
              );
            }

            // 时薪、日薪及项目报酬没有
            // 统一换算依据，暂不纳入此筛选。
            return false;
          }

          case "东京":
            return (
              job.location.includes("东京") ||
              job.location.includes("東京")
            );

          default:
            return true;
        }
      })
      .sort((a, b) =>
        b.publishTime.localeCompare(a.publishTime)
      );
  }, [activeTab]);

  const visibleJobs = filteredJobs.slice(
    0,
    PREVIEW_LIMIT
  );

  const totalCount = filteredJobs.length;

  return (
    <Section
      className="
        border-t
        border-[#F0EBE8]
        bg-white
      "
    >
      <Container>
        <SectionHeader
          badge="工作机会"
          title="看看有没有适合你的工作"
          description="浏览日本各地的职位信息，按行业、雇佣形式、薪资和地区快速查看。"
          href="/jobs"
          actionText="查看全部工作"
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
                  title={
                    tab === "高薪"
                      ? "月薪70万日元起，或年薪840万日元起"
                      : undefined
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
            共{" "}
            <span className="font-bold text-slate-800">
              {totalCount}
            </span>{" "}
            条示例职位
          </p>
        </div>

        {/* 高薪筛选标准 */}
        {activeTab === "高薪" && (
          <p
            className="
              mt-4
              text-xs
              leading-5
              text-slate-500
            "
          >
            当前筛选标准：月薪 70 万日元起，
            或年薪 840 万日元起。
          </p>
        )}

        {/* 首页最多显示三条职位 */}
        {visibleJobs.length > 0 ? (
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
            {visibleJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
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
              bg-[#FAF9F7]
              px-5
              text-center
            "
          >
            <div>
              <p className="font-semibold text-slate-800">
                暂时没有符合条件的职位
              </p>

              <p className="mt-2 text-sm text-slate-500">
                可以切换分类，看看其他工作。
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
                  查看其他职位
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mock 数据提醒 */}
        <p
          className="
            mt-5
            text-center
            text-xs
            leading-5
            text-slate-400
          "
        >
          当前为示例数据，并非实时招聘信息。
        </p>

        {/* 查看更多 */}
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
              ? "查看全部工作"
              : "查看更多职位"}

            <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
