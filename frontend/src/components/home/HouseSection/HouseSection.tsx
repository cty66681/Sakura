"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import HouseCard from "../HouseCard";

import { houses } from "@/data/houses";

const tabs = [
  "全部",
  "东京",
  "近车站",
  "可养宠物",
  "拎包入住",
] as const;

type Tab = (typeof tabs)[number];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页推荐房源
|
| GET /api/houses
|
| Query:
| {
|   featured?: true,
|   region?: string,
|   feature?: string,
|   limit?: 6
| }
|
| 当前阶段使用 "@/data/houses" mock 数据前端筛选。
|
|--------------------------------------------------------------------------
*/

export default function HouseSection() {
  const [activeTab, setActiveTab] =
    useState<Tab>("全部");

  const list = useMemo(() => {
    const filtered = houses.filter((house) => {
      if (activeTab === "全部") {
        return true;
      }

      if (activeTab === "东京") {
        return (
          house.location?.includes("东京") ??
          false
        );
      }

      if (activeTab === "近车站") {
        return house.tags?.some(
          (tag) =>
            tag.includes("近车站") ||
            tag.includes("车站") ||
            tag.includes("徒歩") ||
            tag.includes("步行")
        );
      }

      if (activeTab === "可养宠物") {
        return house.tags?.some(
          (tag) =>
            tag.includes("宠物") ||
            tag.includes("ペット")
        );
      }

      if (activeTab === "拎包入住") {
        return house.tags?.some(
          (tag) =>
            tag.includes("拎包入住") ||
            tag.includes("家具") ||
            tag.includes("家电")
        );
      }

      return true;
    });

    return filtered.slice(0, 6);
  }, [activeTab]);

  const getMoreHref = () => {
    if (activeTab === "东京") {
      return "/houses?region=东京";
    }

    if (activeTab === "近车站") {
      return "/houses?feature=近车站";
    }

    if (activeTab === "可养宠物") {
      return "/houses?feature=可养宠物";
    }

    if (activeTab === "拎包入住") {
      return "/houses?feature=拎包入住";
    }

    return "/houses";
  };

  return (
    <Section
      className="
        relative
        overflow-hidden
        bg-stone-50
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-20
          h-[360px]
          w-[360px]
          rounded-full
          bg-amber-100/40
          blur-3xl
        "
      />

      <Container>
        <div className="relative z-10">
          <SectionHeader
            badge="房源"
            title="顺便看看，有没有合适的住处"
            description="精选日本生活中常见的租房需求，快速查看地区和房源特点。"
            href="/houses"
            actionText="查看全部房源"
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
                border-stone-200
                bg-white/80
                p-1.5
                shadow-sm
                backdrop-blur
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
                        ? "bg-slate-950 text-white"
                        : "text-slate-500 hover:bg-stone-100 hover:text-slate-900"
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
              套房源
            </p>
          </div>

          {/* List */}

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
              {list.map((house) => (
                <HouseCard
                  key={house.id}
                  {...house}
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
                border-stone-300
                bg-white/70
              "
            >
              <div className="text-center">
                <p className="font-bold text-slate-800">
                  当前没有符合条件的房源
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
                  查看全部房源
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
                border-stone-300
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
              查看更多房源
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