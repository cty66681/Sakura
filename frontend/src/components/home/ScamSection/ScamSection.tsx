import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ScamCard from "../ScamCard";
import { scams } from "@/data/scams";
import Section from "@/components/layout/Section";

export default function ScamSection() {
  return (
    <Section>

      <Container>

        <SectionHeader
            badge="🔥 今日动态"
            title="日本避雷"
            description="工作、房源、经验、避坑、日本资讯一站获取。"
            href="/feed"
            actionText="查看全部"
        />
        
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {scams.map((item) => (
            <ScamCard
              key={item.id}
              {...item}
            />
          ))}

        </div>

        <div className="mt-12 flex justify-center">

          <Button variant="outline">
            查看更多案例
          </Button>

        </div>

      </Container>

    </Section>
  );
}