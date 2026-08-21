import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";

import HouseGallery from "@/components/house/HouseGallery";
import HousePrice from "@/components/house/HousePrice";
import HouseTag from "@/components/house/HouseTag";
import HouseFeature from "@/components/house/HouseFeature";
import HouseDescription from "@/components/house/HouseDescription";
import HouseMap from "@/components/house/HouseMap";
import HouseContact from "@/components/house/HouseContact";
import HouseInfo from "@/components/house/HouseInfo";

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

        <div className="space-y-8">

          <HouseGallery
            images={house.images}
          />

          <HouseInfo
            title={house.title}
            location={house.location}
            publishTime={house.publishTime}
            views={house.views}
            />

          <div
            className="
              grid
              gap-8
              lg:grid-cols-[1fr_340px]
            "
          >
            <div className="space-y-8">

              <HousePrice
                rent={house.rent}
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
                availableDate={house.availableDate}
              />

              <HouseDescription
                description={house.description}
              />

              <HouseMap
                location={house.location}
              />

            </div>

            <div>

              <HouseContact
                name={house.contactName}
                company={house.company}
                phone={house.phone}
                email={house.email}
              />

            </div>

          </div>

        </div>

      </Container>
    </main>
  );
}