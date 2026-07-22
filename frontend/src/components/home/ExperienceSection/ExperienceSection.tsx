import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ExperienceCard from "../ExperienceCard";
import { experiences } from "@/data/experiences";

export default function ExperienceSection() {
  return (
    <section className="py-24">
      <Container>

        <SectionHeader
          title="经验分享"
          description="真实记录在日本生活、工作、求职、创业经验。"
          href="/experience"
          actionText="查看全部"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {experiences.map((item) => (
            <ExperienceCard
              key={item.id}
              {...item}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline">
            查看更多经验
          </Button>
        </div>

      </Container>
    </section>
  );
}