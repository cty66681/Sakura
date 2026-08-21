"use client";

import { useState } from "react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

import HouseCard from "../HouseCard";

import { houses } from "@/data/houses";

const tabs = [
  "全部",
  "东京",
  "近车站",
  "可养宠物",
  "拎包入住",
];

export default function HouseSection() {
  const [activeTab, setActiveTab] = useState("全部");

  // 后期这里直接接数据库
  const list = houses.slice(0, 6);

  return (
    <Section className="bg-white">

      <Container>

        <SectionHeader
          badge="🏠 热门房源"
          title="推荐房源"
          description="精选东京及周边优质房源，留学生、上班族都能快速找到合适住房。"
          href="/houses"
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
            当前推荐
            <span className="mx-2 font-bold text-blue-600">
              {houses.length}
            </span>
            套房源
          </div>

        </div>

        {/* House List */}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {list.map((house) => (

            <HouseCard
              key={house.id}
              {...house}
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
            查看更多房源 →
          </Button>

        </div>

      </Container>

    </Section>
  );
}