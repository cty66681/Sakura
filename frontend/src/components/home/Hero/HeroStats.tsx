"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  BookOpen,
  Bot,
  CircleAlert,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const mainCards = [
  {
    title: "学校中心",
    description:
      "大学・大学院、语言学校、专门学校，一站查询。",
    href: "/schools",
    icon: GraduationCap,
    badge: "热门",
  },
  {
    title: "在日经验",
    description:
      "签证、生活、手续、学习与工作的真实经验。",
    href: "/experience",
    icon: BookOpen,
    badge: "实用",
  },
  {
    title: "避坑提醒",
    description:
      "租房、求职、合同、诈骗等常见风险信息。",
    href: "/scam",
    icon: CircleAlert,
    badge: "必看",
  },
];

const topics = [
  {
    title: "东京语言学校怎么选？",
    href: "/schools/language?region=东京",
    type: "学校",
  },
  {
    title: "日本租房前要注意什么？",
    href: "/scam?q=租房",
    type: "避坑",
  },
  {
    title: "第一次在日本生活要准备什么？",
    href: "/experience?q=日本生活",
    type: "经验",
  },
];

export default function HeroStats() {
  return (
    <div className="w-full max-w-[540px]">
      {/* Top Feature */}

      <div
        className="
          relative
          overflow-hidden
          rounded-[30px]
          border
          border-white/10
          bg-white/[0.055]
          p-7
          shadow-2xl
          shadow-black/20
          backdrop-blur-2xl
        "
      >
        {/* Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-20
            h-56
            w-56
            rounded-full
            bg-blue-500/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-24
            left-10
            h-48
            w-48
            rounded-full
            bg-violet-500/10
            blur-3xl
          "
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/10
                bg-white/[0.06]
                px-3
                py-1.5
                text-xs
                font-bold
                text-slate-300
              "
            >
              <Sparkles
                size={14}
                className="text-blue-400"
              />

              Sakura 导航
            </div>

            <span className="text-xs font-semibold text-slate-500">
              日本生活常用入口
            </span>
          </div>

          <h2
            className="
              mt-6
              max-w-[390px]
              text-3xl
              font-black
              leading-tight
              tracking-tight
              text-white
            "
          >
            不知道从哪里开始？
          </h2>

          <p
            className="
              mt-3
              max-w-[430px]
              text-sm
              leading-6
              text-slate-400
            "
          >
            从学校、生活经验和避坑信息开始，
            快速找到现在最需要的内容。
          </p>

          <div className="mt-7 grid gap-3">
            {mainCards.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="
                    group
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.035]
                    p-4
                    transition
                    duration-300
                    hover:border-blue-400/25
                    hover:bg-white/[0.065]
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/[0.06]
                      text-slate-300
                      transition
                      group-hover:bg-blue-500/15
                      group-hover:text-blue-300
                    "
                  >
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">
                        {item.title}
                      </h3>

                      <span
                        className="
                          rounded-full
                          bg-blue-500/10
                          px-2
                          py-0.5
                          text-[10px]
                          font-bold
                          text-blue-300
                        "
                      >
                        {item.badge}
                      </span>
                    </div>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-500
                      "
                    >
                      {item.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="
                      shrink-0
                      text-slate-600
                      transition
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                      group-hover:text-blue-400
                    "
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Today */}

        <div
          className="
            rounded-[26px]
            border
            border-white/10
            bg-white/[0.045]
            p-5
            backdrop-blur-xl
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-slate-500
                "
              >
                Today
              </p>

              <h3 className="mt-1 font-black text-white">
                今日值得看
              </h3>
            </div>

            <Sparkles
              size={17}
              className="text-amber-400"
            />
          </div>

          <div className="mt-4 space-y-1">
            {topics.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-2
                  py-2.5
                  transition
                  hover:bg-white/[0.05]
                "
              >
                <span
                  className="
                    shrink-0
                    rounded-md
                    bg-white/[0.06]
                    px-2
                    py-1
                    text-[10px]
                    font-bold
                    text-slate-400
                  "
                >
                  {item.type}
                </span>

                <span
                  className="
                    min-w-0
                    flex-1
                    truncate
                    text-xs
                    text-slate-400
                    transition
                    group-hover:text-white
                  "
                >
                  {item.title}
                </span>

                <ArrowUpRight
                  size={13}
                  className="
                    shrink-0
                    text-slate-600
                    transition
                    group-hover:text-blue-400
                  "
                />
              </Link>
            ))}
          </div>
        </div>

        {/* AI */}

        <Link
          href="/ai-tools"
          className="
            group
            relative
            overflow-hidden
            rounded-[26px]
            border
            border-blue-400/15
            bg-gradient-to-b
            from-blue-500/10
            to-violet-500/[0.06]
            p-5
            backdrop-blur-xl
            transition
            hover:border-blue-400/30
          "
        >
          <div
            className="
              absolute
              -right-10
              -top-10
              h-28
              w-28
              rounded-full
              bg-blue-500/15
              blur-2xl
            "
          />

          <div className="relative flex h-full flex-col">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-2xl
                bg-blue-500/15
                text-blue-300
              "
            >
              <Bot size={19} />
            </div>

            <div className="mt-auto pt-8">
              <p className="text-xs font-bold text-blue-300">
                Sakura AI
              </p>

              <h3
                className="
                  mt-1
                  text-lg
                  font-black
                  leading-snug
                  text-white
                "
              >
                不会找？
                <br />
                直接问 AI
              </h3>

              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-1
                  text-xs
                  font-bold
                  text-slate-400
                  transition
                  group-hover:text-blue-300
                "
              >
                开始使用

                <ArrowUpRight size={13} />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}