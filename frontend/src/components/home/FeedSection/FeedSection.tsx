"use client";

import { useState } from "react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

import FeedCard from "./FeedCard";

import { feeds } from "@/data/feed";

const tabs = [
  "全部",
  "工作",
  "房源",
  "学校",
  "避坑",
  "资讯",
];

export default function FeedSection() {
  const [activeTab, setActiveTab] = useState("全部");

  // 现在先保留数据，后面接数据库直接过滤
  const list = feeds;

  return (
    <Section className="bg-slate-50">

      <Container>

        <SectionHeader
          badge="🔥 今日动态"
          title="最新动态"
          description="工作、房源、学校、避坑、日本资讯实时更新。"
          href="/feed"
          actionText="查看全部"
        />

        {/* Top */}

        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Tabs */}

          <div className="flex flex-wrap gap-3">

            {tabs.map((tab) => (

              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  rounded-full
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-300
                  ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  }
                `}
              >
                {tab}
              </button>

            ))}

          </div>

          {/* Count */}

          <div className="text-sm text-slate-500">
            今日更新
            <span className="mx-2 font-bold text-blue-600">
              {feeds.length}
            </span>
            条内容
          </div>

        </div>

        {/* Feed */}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {list.map((item) => (

            <FeedCard
              key={item.id}
              item={item}
            />

          ))}

        </div>

        {/* More */}

        <div className="mt-14 flex justify-center">

          <Button
            variant="outline"
            className="
              h-12
              rounded-full
              px-8
              text-base
            "
          >
            查看更多动态 →
          </Button>

        </div>

      </Container>

    </Section>
  );
}