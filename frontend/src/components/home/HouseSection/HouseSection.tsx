import Container from "@/components/layout/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

import HouseCard from "../HouseCard";

import { houses } from "@/data/houses";

export default function HouseSection() {
  return (
    <section className="py-24">

      <Container>

        <SectionHeader
          title="热门房源"
          description="精选东京、大阪、名古屋热门房源。"
          href="/house"
          actionText="查看全部"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {houses.map((house) => (
            <HouseCard
              key={house.id}
              {...house}
            />
          ))}

        </div>

        <div className="mt-12 flex justify-center">

          <Button variant="outline">
            查看更多房源
          </Button>

        </div>

      </Container>

    </section>
  );
}