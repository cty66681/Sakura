
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import ExperienceCard from "../ExperienceCard";

import { experiences } from "@/data/experiences";

const PREVIEW_LIMIT = 3;

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页经验精选
|
| GET /api/experiences
|
| Query:
| {
|   featured: true,
|   limit: 3
| }
|
| 当前使用 "@/data/experiences" Mock 数据。
|
| 正式接入后台后：
| - 只返回允许公开展示的文章
| - 返回实际发布日期和作者公开资料
| - 按精选规则或实际发布时间排序
|
|--------------------------------------------------------------------------
*/

export default function ExperienceSection() {
  const list = experiences.slice(0, PREVIEW_LIMIT);

  return (
    <Section
      className="
        border-t
        border-[#F0EBE8]
        bg-white
      "
    >
      <Container>
        <SectionHeader
          badge="在日经验"
          title="看看其他人在日本的生活经验"
          description="租房、求职、留学和日常生活，遇到问题时，也许别人的经历能给你一点参考。"
          href="/experience"
          actionText="查看全部经验"
        />

        {/* 首页精选经验 */}
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
              <ExperienceCard
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
              border-[#EAE5E2]
              bg-[#FAF9F7]
              px-5
              text-center
            "
          >
            <div>
              <p className="font-semibold text-[#30343B]">
                暂时还没有经验文章
              </p>

              <p className="mt-2 text-sm text-[#898B91]">
                有新内容后，会在这里展示。
              </p>
            </div>
          </div>
        )}

        {/* 查看更多 */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/experience"
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
            查看更多生活经验
            <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
