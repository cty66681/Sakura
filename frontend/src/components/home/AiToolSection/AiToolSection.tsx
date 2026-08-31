import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";

import AiToolCard from "../AiToolCard";

import { aiTools } from "@/data/aiTools";

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页 Sakura AI 工具
|
| GET /api/ai-tools
|
| Query:
| {
|   featured: true,
|   limit: 6
| }
|
| 当前阶段使用 "@/data/aiTools" mock 数据。
|
|--------------------------------------------------------------------------
*/

export default function AiToolSection() {
  const list = aiTools.slice(0, 6);

  return (
    <Section
      className="
        relative
        overflow-hidden
        bg-slate-950
      "
    >
      {/* Background */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[500px]
          w-[900px]
          -translate-x-1/2
          rounded-full
          bg-blue-600/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-0
          h-[400px]
          w-[400px]
          rounded-full
          bg-violet-500/10
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.04]
          [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      <Container>
        <div className="relative z-10">
          {/* Header */}

          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <div className="max-w-3xl">
              <div
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-blue-400/20
                  bg-blue-400/10
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  tracking-wide
                  text-blue-300
                "
              >
                SAKURA AI
              </div>

              <h2
                className="
                  mt-5
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                在日本遇到问题，
                <span
                  className="
                    bg-gradient-to-r
                    from-blue-400
                    via-cyan-300
                    to-violet-400
                    bg-clip-text
                    text-transparent
                  "
                >
                  先问 Sakura
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-base
                  leading-7
                  text-slate-400
                "
              >
                从学校选择、资料整理到求职和日本生活，
                用简单的 AI 工具帮你更快找到答案。
              </p>
            </div>

            <Link
              href="/ai-tools"
              className="
                inline-flex
                h-11
                w-fit
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/5
                px-5
                text-sm
                font-bold
                text-white
                backdrop-blur
                transition
                hover:border-white/20
                hover:bg-white/10
              "
            >
              查看全部 AI 工具
              <span className="ml-2">
                →
              </span>
            </Link>
          </div>

          {/* Tools */}

          {list.length > 0 ? (
            <div
              className="
                mt-12
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {list.map((tool) => (
                <AiToolCard
                  key={tool.id}
                  {...tool}
                />
              ))}
            </div>
          ) : (
            <div
              className="
                mt-12
                flex
                min-h-[220px]
                items-center
                justify-center
                rounded-[28px]
                border
                border-white/10
                bg-white/[0.03]
              "
            >
              <p className="text-sm text-slate-400">
                AI 工具正在准备中
              </p>
            </div>
          )}

          {/* Bottom */}

          <div
            className="
              mt-12
              flex
              flex-col
              gap-4
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.04]
              p-6
              backdrop-blur
              sm:flex-row
              sm:items-center
              sm:justify-between
              lg:p-7
            "
          >
            <div>
              <p className="font-bold text-white">
                不知道该用哪个工具？
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-slate-400
                "
              >
                直接进入 Sakura AI，根据你的问题选择合适的功能。
              </p>
            </div>

            <Link
              href="/ai-tools"
              className="
                inline-flex
                h-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white
                px-6
                text-sm
                font-black
                text-slate-950
                transition
                hover:-translate-y-0.5
                hover:bg-blue-50
              "
            >
              开始使用
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