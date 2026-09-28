
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Compass,
  GraduationCap,
  House,
  MapPinned,
} from "lucide-react";

type ScenarioId = "arrival" | "moving" | "career" | "study";

const scenarios = [
  {
    id: "arrival",
    title: "刚来日本",
    description: "生活手续，从这里慢慢理清",
    icon: MapPinned,
    links: [
      {
        label: "初到日本的生活经验",
        href: `/search?q=${encodeURIComponent("日本生活")}`,
      },
      {
        label: "办理手机与银行卡",
        href: `/search?q=${encodeURIComponent("手机 银行卡")}`,
      },
      {
        label: "了解常见骗局",
        href: "/scam",
      },
    ],
  },
  {
    id: "moving",
    title: "准备搬家",
    description: "找房、算费用、看注意事项",
    icon: House,
    links: [
      {
        label: "查看房源",
        href: "/houses",
      },
      {
        label: "看看租房经验",
        href: `/search?q=${encodeURIComponent("租房经验")}`,
      },
      {
        label: "租房前需要避开的坑",
        href: `/search?q=${encodeURIComponent("租房避坑")}`,
      },
    ],
  },
  {
    id: "career",
    title: "想换工作",
    description: "职位、面试与求职风险",
    icon: BriefcaseBusiness,
    links: [
      {
        label: "查看招聘信息",
        href: "/jobs",
      },
      {
        label: "看看求职经验",
        href: `/search?q=${encodeURIComponent("求职经验")}`,
      },
      {
        label: "了解招聘风险",
        href: `/search?q=${encodeURIComponent("招聘避坑")}`,
      },
    ],
  },
  {
    id: "study",
    title: "准备升学",
    description: "选学校、查专业与报考信息",
    icon: GraduationCap,
    links: [
      {
        label: "查看学校中心",
        href: "/schools",
      },
      {
        label: "了解语言学校",
        href: "/schools/language",
      },
      {
        label: "了解专门学校",
        href: "/schools/college",
      },
    ],
  },
] satisfies {
  id: ScenarioId;
  title: string;
  description: string;
  icon: typeof Compass;
  links: { label: string; href: string }[];
}[];

export default function HeroStats() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] =
    useState<ScenarioId | null>(null);

  const activeScenario = scenarios.find(
    (item) => item.id === selected
  );

  return (
    <section
      className="
        w-full
        rounded-[22px]
        border
        border-[#F0E0D9]
        bg-[#FFF5F0]
        p-4
        sm:p-5
      "
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="sakura-life-guide"
        onClick={() => setExpanded((value) => !value)}
        className="
          flex
          w-full
          items-center
          gap-3
          text-left
        "
      >
        <span
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-[#FBE3DD]
            text-[#D7505D]
          "
        >
          <Compass size={22} strokeWidth={1.8} />
        </span>

        <span className="min-w-0 flex-1">
          <span
            className="
              block
              text-[15px]
              font-bold
              text-[#30343B]
            "
          >
            不知道从哪开始？
          </span>

          <span
            className="
              mt-1
              block
              text-xs
              leading-5
              text-[#85818A]
              sm:text-sm
            "
          >
            按你现在的情况，找到需要的信息
          </span>
        </span>

        <span
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#D7505D]
          "
        >
          <ChevronDown
            size={20}
            className={`transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {expanded && (
        <div
          id="sakura-life-guide"
          className="
            mt-5
            border-t
            border-[#EBDCD6]
            pt-5
          "
        >
          <p className="mb-3 text-sm font-medium text-[#62656B]">
            选一个最接近你当前情况的：
          </p>

          <div className="grid gap-2 sm:grid-cols-4">
            {scenarios.map((item) => {
              const Icon = item.icon;
              const isSelected = selected === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelected(item.id)}
                  className={`
                    flex
                    min-h-[116px]
                    flex-col
                    items-start
                    rounded-xl
                    border
                    p-3.5
                    text-left
                    transition
                    ${
                      isSelected
                        ? "border-[#E6A5A6] bg-white shadow-sm"
                        : "border-[#EFE5E1] bg-white/75 hover:border-[#E6B5B3] hover:bg-white"
                    }
                  `}
                >
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                    className={
                      isSelected
                        ? "text-[#D7505D]"
                        : "text-[#8E8180]"
                    }
                  />

                  <span className="mt-3 text-sm font-bold text-[#30343B]">
                    {item.title}
                  </span>

                  <span className="mt-1 text-xs leading-5 text-[#8A8990]">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>

          {activeScenario && (
            <div
              className="
                mt-4
                rounded-xl
                border
                border-[#F0E3DF]
                bg-white
                p-4
              "
            >
              <h3 className="text-sm font-bold text-[#343941]">
                {activeScenario.title}，可以先看看
              </h3>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {activeScenario.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="
                      group
                      flex
                      min-h-12
                      items-center
                      justify-between
                      gap-3
                      rounded-lg
                      bg-[#FAF8F6]
                      px-3
                      py-2.5
                      text-sm
                      font-medium
                      text-[#555961]
                      transition
                      hover:bg-[#FFF0EC]
                      hover:text-[#C74654]
                    "
                  >
                    <span>{link.label}</span>

                    <ArrowUpRight
                      size={16}
                      className="
                        shrink-0
                        text-[#C57E81]
                        transition
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                      "
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
