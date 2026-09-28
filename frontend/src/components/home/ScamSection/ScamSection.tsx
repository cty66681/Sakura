
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import ScamCard from "../ScamCard";

import { scams } from "@/data/scams";

const PREVIEW_LIMIT = 3;

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
|   limit: 3
| }
|
| 当前使用 "@/data/scams" Mock 数据。
|
| 正式接入后台后：
| - 只返回审核通过、允许公开展示的内容
| - 区分风险提醒、经验分享与尚未核实的举报
| - 不将用户举报直接表述为已经确认的事实
|
|--------------------------------------------------------------------------
*/

export default function ScamSection() {
  const list = scams.slice(0, PREVIEW_LIMIT);

  return (
    <Section
      className="
        border-t
        border-[#F0EBE8]
        bg-[#FFF9F8]
      "
    >
      <Container>
        <SectionHeader
          badge="避坑提醒"
          title="这些常见问题，提前了解一下"
          description="租房、求职、留学和日常消费，看看有哪些值得注意的风险与经验。"
          href="/scam"
          actionText="查看全部避坑"
        />

        {/* 首页最多展示 3 张卡片 */}
        {list.length > 0 ? (
          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-5
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
              mt-8
              flex
              min-h-[170px]
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-[#EADBD8]
              bg-white
              px-5
              text-center
            "
          >
            <div>
              <p
                className="
                  font-semibold
                  text-[#30343B]
                "
              >
                暂时没有避坑内容
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-[#898B91]
                "
              >
                有新内容后，会在这里展示。
              </p>
            </div>
          </div>
        )}

        {/* 查看更多 */}
        <div
          className="
            mt-8
            flex
            justify-center
          "
        >
          <Link
            href="/scam"
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-[#E6D9D7]
              bg-white
              px-6
              text-sm
              font-semibold
              text-[#B94855]
              transition
              hover:border-[#D9515E]
              hover:bg-[#FFF1F0]
            "
          >
            查看更多避坑内容

            <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
