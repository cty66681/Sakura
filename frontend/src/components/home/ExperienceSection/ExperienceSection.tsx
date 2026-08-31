import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/ui/SectionHeader";

import ExperienceCard from "../ExperienceCard";

import { experiences } from "@/data/experiences";

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
|   limit: 6
| }
|
| 当前阶段使用 "@/data/experiences" mock 数据。
|
|--------------------------------------------------------------------------
*/

export default function ExperienceSection() {
  const list = experiences.slice(0, 6);

  return (
    <Section className="bg-white">
      <Container>
        <SectionHeader
          badge="在日经验"
          title="别人踩过的坑，你可以提前知道"
          description="来自在日生活、工作、租房、留学和办手续的真实经验整理。"
          href="/experience"
          actionText="查看全部经验"
        />

        {/* Experience cards */}

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
            <ExperienceCard
              key={item.id}
              {...item}
            />
          ))}
        </div>

        {/* Bottom */}

        <div className="mt-12 flex justify-center">
          <Link
            href="/experience"
            className="
              inline-flex
              h-12
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              px-7
              text-sm
              font-bold
              text-slate-700
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-slate-900
              hover:bg-slate-900
              hover:text-white
            "
          >
            查看更多在日经验
            <span className="ml-2">
              →
            </span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}