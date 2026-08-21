import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Section from "@/components/layout/Section";
import AiToolCard from "../AiToolCard";

import { aiTools } from "@/data/aiTools";

export default function AiToolSection() {
  return (
    <Section>

      <Container>

        <SectionHeader
            badge="🔥 今日动态"
            title="AI工具"
            description="工作、房源、经验、避坑、日本资讯一站获取。"
            href="/feed"
            actionText="查看全部"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {aiTools.map((tool) => (
            <AiToolCard
              key={tool.id}
              {...tool}
            />
          ))}

        </div>

        <div className="mt-12 flex justify-center">

          <Button variant="outline">
            查看全部 AI 工具
          </Button>

        </div>

      </Container>

    </Section>
  );
}