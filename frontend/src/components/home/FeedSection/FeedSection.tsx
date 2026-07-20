import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import FeedCard from "./FeedCard";
import { feeds } from "@/data/feed";

export default function FeedSection() {
  return (
    <section className="py-24">
      <Container>

        <SectionHeader
          title="今日动态"
          description="工作、房源、经验、避坑、日本资讯一站获取。"
          href="/feed"
          actionText="查看全部"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {feeds.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button variant="outline">
            查看更多动态
          </Button>
        </div>

      </Container>
    </section>
  );
}