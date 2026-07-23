import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

import AiToolCard from "../AiToolCard";

import { aiTools } from "@/data/aiTools";

export default function AiToolSection() {
  return (
    <section className="py-24">

      <Container>

        <SectionHeader
          title="AI 工具"
          description="AI 帮助你更快融入日本生活、学习和工作。"
          href="/ai"
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

    </section>
  );
}