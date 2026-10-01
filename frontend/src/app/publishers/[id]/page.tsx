import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Home,
  MapPin,
  UserRound,
} from "lucide-react";

import Container from "@/components/layout/Container";
import HouseCard from "@/components/home/HouseCard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface PublisherHouse {
  id: number;
  title: string;

  rent: number;
  managementFee: number;

  depositMonths: number;
  keyMoneyMonths: number;

  layout: string;
  area: number;

  prefecture: string;
  city: string;

  station: string | null;
  walkMinutes: number | null;

  foreignerAllowed: boolean | null;
  studentAllowed: boolean | null;

  tags: string[];
  features: string[];

  listingStatus:
    | "available"
    | "paused"
    | "rented"
    | "expired"
    | "hidden";

  lastVerifiedAt: string | null;

  views: number;

  publishedAt: string | null;
  createdAt: string;

  images: {
    id: string;
    url: string;
    sortOrder: number;
  }[];

  location: string;
}

interface PublisherApiResponse {
  success: boolean;

  data: {
    id: string;
    name: string;
    company: string | null;
    verified: boolean;
    createdAt: string;

    houseCount: number;

    houses: PublisherHouse[];
  };
}

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

function formatArea(value: number) {
  return `${value}㎡`;
}

function formatJapanDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
    }
  ).format(date);
}

export default async function PublisherPage({
  params,
}: PageProps) {
  const { id } = await params;

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000"
    }/api/publishers/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    notFound();
  }

  const result: PublisherApiResponse =
    await response.json();

  if (!result.success || !result.data) {
    notFound();
  }

  const publisher = result.data;

  const joinedAt =
    formatJapanDate(
      publisher.createdAt
    );

  return (
    <main className="min-h-screen bg-slate-50">
      <section
        className="
          border-b
          border-slate-200
          bg-white
        "
      >
        <Container>
          <div className="px-4 py-8 sm:py-10">
            <Link
              href="/houses"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-slate-500
                transition
                hover:text-slate-900
              "
            >
              <ArrowLeft size={16} />
              返回房源列表
            </Link>

            <div
              className="
                mt-8
                flex
                flex-col
                gap-6
                sm:flex-row
                sm:items-start
                sm:justify-between
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-[20px]
                    bg-slate-100
                    text-slate-500
                  "
                >
                  {publisher.company ? (
                    <Building2 size={28} />
                  ) : (
                    <UserRound size={28} />
                  )}
                </div>

                <div className="min-w-0">
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    <h1
                      className="
                        text-2xl
                        font-black
                        text-slate-950
                        sm:text-3xl
                      "
                    >
                      {publisher.name}
                    </h1>

                    {publisher.verified && (
                      <div
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-full
                          bg-blue-50
                          px-2.5
                          py-1
                          text-xs
                          font-bold
                          text-blue-600
                        "
                      >
                        <BadgeCheck size={14} />
                        已认证
                      </div>
                    )}
                  </div>

                  {publisher.company && (
                    <p
                      className="
                        mt-2
                        text-sm
                        font-medium
                        text-slate-500
                      "
                    >
                      {publisher.company}
                    </p>
                  )}

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-x-5
                      gap-y-2
                      text-xs
                      text-slate-400
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <CalendarDays size={14} />
                      加入于 {joinedAt}
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <Home size={14} />
                      {publisher.houseCount} 套公开房源
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`
                  inline-flex
                  h-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-2
                  text-xs
                  font-bold
                  ${
                    publisher.verified
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-100 text-slate-500"
                  }
                `}
              >
                {publisher.verified ? (
                  <>
                    <BadgeCheck size={14} />
                    认证发布者
                  </>
                ) : (
                  <>
                    <UserRound size={14} />
                    普通发布者
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-12">
        <Container>
          <div className="px-4">
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-blue-600
                  "
                >
                  LISTINGS
                </p>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-black
                    text-slate-950
                  "
                >
                  发布中的房源
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  这里仅显示当前可以公开查看的房源。
                </p>
              </div>

              <div
                className="
                  rounded-full
                  bg-blue-50
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  text-blue-600
                "
              >
                {publisher.houseCount} 套
              </div>
            </div>

            {publisher.houses.length > 0 ? (
              <div
                className="
                  mt-7
                  grid
                  gap-6
                  md:grid-cols-2
                  xl:grid-cols-3
                "
              >
                {publisher.houses.map(
                  (house) => (
                    <HouseCard
                      key={house.id}
                      id={house.id}
                      title={house.title}
                      rent={formatYen(
                        house.rent
                      )}
                      layout={house.layout}
                      area={formatArea(
                        house.area
                      )}
                      location={
                        house.location
                      }
                      images={house.images.map(
                        (image) =>
                          image.url
                      )}
                      tags={house.tags}
                      listingStatus={
                        house.listingStatus
                      }
                      lastVerifiedAt={
                        house.lastVerifiedAt
                      }
                      foreignerAllowed={
                        house.foreignerAllowed
                      }
                      studentAllowed={
                        house.studentAllowed
                      }
                      publisherName={
                        publisher.name
                      }
                      publisherCompany={
                        publisher.company ?? ""
                      }
                      publisherVerified={
                        publisher.verified
                      }
                      href={`/houses/${house.id}`}
                    />
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  mt-8
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  px-6
                  py-16
                  text-center
                  shadow-sm
                "
              >
                <MapPin
                  size={30}
                  className="
                    mx-auto
                    text-slate-300
                  "
                />

                <h3
                  className="
                    mt-4
                    font-black
                    text-slate-900
                  "
                >
                  暂无公开房源
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                  "
                >
                  该发布者目前没有可公开查看的房源。
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}