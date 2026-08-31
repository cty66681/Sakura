"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CircleAlert,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";

import HeroSearch from "./HeroSearch";

const quickEntries = [
  {
    title: "找学校",
    description: "大学・语言学校・专门学校",
    href: "/schools",
    icon: GraduationCap,
  },
  {
    title: "看经验",
    description: "在日生活真实经验",
    href: "/experience",
    icon: BookOpen,
  },
  {
    title: "查避坑",
    description: "诈骗・合同・生活风险",
    href: "/scam",
    icon: CircleAlert,
  },
];

const hotKeywords = [
  {
    label: "东京语言学校",
    href: "/schools/language?region=东京",
  },
  {
    label: "IT・AI 专门学校",
    href: "/schools/college?category=IT・AI",
  },
  {
    label: "日本大学",
    href: "/schools/university",
  },
  {
    label: "租房避坑",
    href: "/scam?q=租房",
  },
];

export default function HeroContent() {
  const router = useRouter();

  return (
    <div className="w-full max-w-[760px]">
      {/* Badge */}

      <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 backdrop-blur">
        <Sparkles size={15} />

        Sakura 日本生活信息平台

        <span className="h-1 w-1 rounded-full bg-blue-400" />

        Beta
      </div>

      {/* Title */}

      <h1 className="mt-7 max-w-[720px] text-[46px] font-black leading-[1.06] tracking-[-0.045em] text-white sm:text-[58px] lg:text-[68px] xl:text-[74px]">
        在日本生活，

        <span className="mt-2 block bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
          需要的信息一次找到。
        </span>
      </h1>

      {/* Description */}

      <p className="mt-7 max-w-[650px] text-base leading-8 text-slate-300 sm:text-lg">
        学校、在日经验、避坑信息、生活资讯、房源和工作。
        不需要在十几个网站之间来回找，
        Sakura 帮你把真正有用的信息整理到一起。
      </p>

      {/* Trust points */}

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
        <TrustPoint>
          中文信息
        </TrustPoint>

        <TrustPoint>
          日本本地内容
        </TrustPoint>

        <TrustPoint>
          搜索直接到结果
        </TrustPoint>

        <TrustPoint>
          AI 辅助查找
        </TrustPoint>
      </div>

      {/* Main Search */}

      <div className="mt-9">
        <HeroSearch />
      </div>

      {/* Hot Search */}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-bold text-slate-500">
          热门：
        </span>

        {hotKeywords.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() =>
              router.push(item.href)
            }
            className="
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              px-3.5
              py-1.5
              text-xs
              font-medium
              text-slate-400
              transition
              hover:border-blue-400/30
              hover:bg-blue-500/10
              hover:text-blue-200
            "
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Quick Entry */}

      <div className="mt-9 grid gap-3 sm:grid-cols-3">
        {quickEntries.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="
                group
                rounded-2xl
                border
                border-white/10
                bg-white/[0.045]
                p-4
                backdrop-blur
                transition
                duration-300
                hover:-translate-y-0.5
                hover:border-blue-400/30
                hover:bg-white/[0.07]
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/[0.07]
                    text-slate-300
                    transition
                    group-hover:bg-blue-500/15
                    group-hover:text-blue-300
                  "
                >
                  <Icon size={17} />
                </div>

                <ArrowRight
                  size={15}
                  className="
                    mt-1
                    text-slate-600
                    transition
                    group-hover:translate-x-0.5
                    group-hover:text-blue-400
                  "
                />
              </div>

              <p className="mt-4 text-sm font-black text-white">
                {item.title}
              </p>

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TrustPoint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <BadgeCheck
        size={14}
        className="text-emerald-400"
      />

      {children}
    </span>
  );
}