"use client";

import { useState } from "react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

import SchoolCard from "../SchoolCard";

import { schools } from "@/data/schools";

const tabs = [
  "全部",
  "大学",
  "大学院",
  "专门学校",
  "语言学校",
];

export default function SchoolSection() {
  const [activeTab, setActiveTab] = useState("全部");

  // 后期数据库筛选
  const list = schools.slice(0, 6);

  return (
    <Section className="bg-slate-50">

      <Container>

        <SectionHeader
          badge="🎓 日本升学"
          title="推荐学校"
          description="大学、大学院、专门学校、语言学校最新招生信息。"
          href="/schools"
          actionText="查看全部"
        />

        {/* Tabs */}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

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

          <div className="text-sm text-slate-500">
            已收录
            <span className="mx-2 font-bold text-blue-600">
              {schools.length}
            </span>
            所学校
          </div>

        </div>

        {/* Card */}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {list.map((school) => (

            <SchoolCard
              key={school.id}
              {...school}
            />

          ))}

        </div>

        {/* Bottom */}

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
            查看更多学校 →
          </Button>

        </div>

      </Container>

    </Section>
  );
}