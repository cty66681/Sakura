import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import ScamCard from "../ScamCard";

import { scams } from "@/data/scams";

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页避坑精选
|
| GET /api/scams
|
| Query:
| {
|   featured: true,
|   limit: 6
| }
|
| 当前阶段使用 "@/data/scams" mock 数据。
|
|--------------------------------------------------------------------------
*/

export default function ScamSection() {
  const list = scams.slice(0, 6);

  return (
    <Section
      className="
        relative
        overflow-hidden
        bg-rose-50/70
      "
    >
      {/* Background decoration */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-10
          h-[420px]
          w-[420px]
          rounded-full
          bg-orange-200/30
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-0
          h-[360px]
          w-[360px]
          rounded-full
          bg-rose-200/30
          blur-3xl
        "
      />

      <Container>
        <div className="relative z-10">
          <SectionHeader
            badge="避坑提醒"
            title="有些坑，提前知道就能避开"
            description="租房、求职、留学、消费和生活中的常见问题，整理真实案例和注意事项。"
            href="/scam"
            actionText="查看全部避坑"
          />

          {/* Cards */}

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
              {list.map((item) => (
                <ScamCard
                  key={item.id}
                  {...item}
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
                border-rose-200
                bg-white/70
              "
            >
              <div className="text-center">
                <p className="font-bold text-slate-800">
                  暂时没有避坑内容
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  后续会持续补充新的案例和提醒。
                </p>
              </div>
            </div>
          )}

          {/* Bottom */}

          <div className="mt-12 flex justify-center">
            <Link
              href="/scam"
              className="
                inline-flex
                h-12
                items-center
                justify-center
                rounded-full
                bg-slate-950
                px-7
                text-sm
                font-bold
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-rose-600
              "
            >
              查看更多避坑案例
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