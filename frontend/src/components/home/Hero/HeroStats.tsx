"use client";

import HeroBanner from "./HeroBanner";

import Card from "@/components/ui/Card";

import {
  GraduationCap,
  BriefcaseBusiness,
  House,
  ShieldAlert,
  Flame,
  ArrowRight,
  MapPin,
  Building2,
} from "lucide-react";

export default function HeroStats() {
  return (
    <div
      className="
        w-full
        max-w-[560px]
        space-y-6
      "
    >
      {/* Banner */}

      <HeroBanner />

      {/* Bottom */}

      <div className="grid gap-5">

        {/* 第一排 */}

        <div className="grid grid-cols-2 gap-5">

          {/* 今日新增 */}

          <Card
            glass
            className="
              rounded-[28px]
              p-6
              min-h-[230px]
              border
              border-white/10
            "
          >
            <div className="flex items-center gap-2">

              <Flame
                size={18}
                className="text-orange-500"
              />

              <h3 className="text-lg font-bold">
                今日新增
              </h3>

            </div>

            <div className="mt-7 space-y-5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <GraduationCap
                    size={18}
                    className="text-violet-500"
                  />

                  <span>学校</span>

                </div>

                <span className="font-bold text-violet-500">
                  +5
                </span>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <ShieldAlert
                    size={18}
                    className="text-red-500"
                  />

                  <span>避坑</span>

                </div>

                <span className="font-bold text-red-500">
                  +7
                </span>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <BriefcaseBusiness
                    size={18}
                    className="text-blue-500"
                  />

                  <span>工作</span>

                </div>

                <span className="font-bold text-blue-500">
                  +18
                </span>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <House
                    size={18}
                    className="text-emerald-500"
                  />

                  <span>房源</span>

                </div>

                <span className="font-bold text-emerald-500">
                  +12
                </span>

              </div>

            </div>

          </Card>

          {/* 热门专题 */}

          <Card
            glass
            className="
              rounded-[28px]
              p-6
              min-h-[230px]
              border
              border-white/10
            "
          >

            <div className="flex items-center justify-between">

              <h3 className="text-lg font-bold">
                🔥 热门专题
              </h3>

              <ArrowRight
                size={18}
                className="text-slate-400"
              />

            </div>

            <div className="mt-7 space-y-3">

              {[
                "日本语言学校",
                "东京租房",
                "Java工作",
                "日本避坑",
              ].map((item) => (

                <button
                  key={item}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between

                    rounded-xl

                    px-3
                    py-2

                    text-sm

                    transition-all

                    hover:bg-white/10
                    hover:text-blue-400
                  "
                >

                  <span>{item}</span>

                  <ArrowRight size={15} />

                </button>

              ))}

            </div>

          </Card>

        </div>

        {/* 第二排 */}

        <div className="grid grid-cols-2 gap-5">

          {/* 热门职位 */}

          <Card
            glass
            className="
              rounded-[28px]
              p-6
              min-h-[190px]
              border
              border-white/10
            "
          >

            <div className="flex items-center justify-between">

              <h3 className="font-bold text-lg">
                💼 热门职位
              </h3>

              <BriefcaseBusiness
                size={18}
                className="text-blue-500"
              />

            </div>

            <div className="mt-6">

              <p className="text-lg font-bold">
                Frontend Engineer
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">

                <Building2 size={15} />

                Mercari

              </div>

              <p className="mt-3 font-semibold text-blue-500">
                ¥650万 ~ ¥900万
              </p>

            </div>

          </Card>

          {/* 推荐房源 */}

          <Card
            glass
            className="
              rounded-[28px]
              p-6
              min-h-[190px]
              border
              border-white/10
            "
          >

            <div className="flex items-center justify-between">

              <h3 className="font-bold text-lg">
                🏠 推荐房源
              </h3>

              <House
                size={18}
                className="text-emerald-500"
              />

            </div>

            <div className="mt-6">

              <p className="text-lg font-bold">
                江东区 1LDK
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">

                <MapPin size={15} />

                JR 徒步4分钟

              </div>

              <p className="mt-3 font-semibold text-emerald-500">
                ¥82,000 / 月
              </p>

            </div>

          </Card>

        </div>

      </div>

    </div>
  );
}