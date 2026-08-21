import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";

import HouseGallery from "@/components/house/HouseGallery";
import HousePrice from "@/components/house/HousePrice";
import HouseTag from "@/components/house/HouseTag";
import HouseFeature from "@/components/house/HouseFeature";
import HouseDescription from "@/components/house/HouseDescription";
import HouseMap from "@/components/house/HouseMap";
import HouseContact from "@/components/house/HouseContact";

import { houses } from "@/data/houses";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HouseDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const house = houses.find(
    (item) => item.id === Number(id)
  );

  if (!house) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container>

        <HouseGallery
          images={house.images}
        />

        <div className="mt-8 space-y-8">

          <HousePrice
            title={house.title}
            rent={house.rent}
            location={house.location}
            managementFee={house.managementFee}
            deposit={house.deposit}
            keyMoney={house.keyMoney}
            />

          <HouseTag
            tags={house.tags}
          />

          <HouseFeature
            layout={house.layout}
            area={house.area}
            floor={house.floor}
            builtYear={house.builtYear}
            direction={house.direction}
            structure={house.structure}
            managementFee={house.managementFee}
            deposit={house.deposit}
            keyMoney={house.keyMoney}
            availableDate={house.availableDate}
            publishTime={house.publishTime}
            views={house.views}
          />

          <HouseDescription 
            description={house.description}
          />

          <HouseMap
            location={house.location}
          />

          <HouseContact 
            name={house.contact.name}
            company={house.contact.company}
            phone={house.contact.phone}
            email={house.contact.email}
            />

        </div>

      </Container>
    </main>
  );
}