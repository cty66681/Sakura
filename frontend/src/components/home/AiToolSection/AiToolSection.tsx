
import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Sakura AI 首页入口
|--------------------------------------------------------------------------
|
| 当前仅展示 AI 功能预告。
| 不请求 Mock 工具数据，也不展示尚未开放的工具卡片。
|
| TODO:
| AI 工具正式上线后，根据真实的可用状态，
| 再决定是否在首页展示具体工具。
|
|--------------------------------------------------------------------------
*/

export default function AiToolSection() {
  return (
    <Section
      className="
        border-t
        border-[#F0EBE8]
        bg-white
      "
    >
      <Container>
        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#F0E2DF]
            bg-gradient-to-br
            from-[#FFF4F1]
            via-[#FFFAF8]
            to-white
            px-6
            py-8
            sm:px-9
            sm:py-10
            lg:px-12
          "
        >
          <div
            className="
              flex
              flex-col
              gap-7
              lg:flex-row
              lg:items-center
              lg:justify-between
              lg:gap-10
            "
          >
            {/* 左侧介绍 */}
            <div className="max-w-2xl">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#EEDAD6]
                  bg-white/80
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[#BF5963]
                "
              >
                <Sparkles size={14} />

                SAKURA AI

                <span
                  className="
                    ml-1
                    rounded-full
                    bg-[#FFF0ED]
                    px-2
                    py-0.5
                    text-[11px]
                    text-[#AD7375]
                  "
                >
                  功能筹备中
                </span>
              </div>

              <h2
                className="
                  mt-5
                  text-2xl
                  font-bold
                  leading-snug
                  tracking-tight
                  text-[#30343B]
                  sm:text-3xl
                "
              >
                让日本生活中的复杂问题，
                <span className="text-[#D9515E]">
                  变得简单一点
                </span>
              </h2>

              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-7
                  text-[#777B83]
                  sm:text-base
                "
              >
                我们计划逐步推出学校信息整理、
                求职资料辅助和日本生活相关的 AI 工具。
                目前功能还在准备中，敬请期待。
              </p>

              {/* 规划方向 */}
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {[
                  "学校信息整理",
                  "求职资料辅助",
                  "日本生活",
                ].map((item) => (
                  <span
                    key={item}
                    className="
                      rounded-full
                      border
                      border-[#EFE3E0]
                      bg-white/80
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-[#817A7C]
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 右侧入口 */}
            <div
              className="
                flex
                shrink-0
                flex-col
                items-start
                gap-2
                lg:items-end
              "
            >
              <Link
                href="/ai-tools"
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#D9515E]
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#C74754]
                "
              >
                查看 AI 工具
                <ArrowRight size={16} />
              </Link>

              <span
                className="
                  px-2
                  text-xs
                  text-[#A29A99]
                "
              >
                部分功能尚未开放
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
