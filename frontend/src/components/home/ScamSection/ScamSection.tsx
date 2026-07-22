import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ScamCard from "../ScamCard";
import { scams } from "@/data/scams";

export default function ScamSection() {
  return (
    <section className="py-24">

      <Container>

        <SectionHeader
          title="避坑防骗"
          description="每天更新日本最新诈骗案例，帮助大家提高警惕。"
          href="/scam"
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

    </section>
  );
}