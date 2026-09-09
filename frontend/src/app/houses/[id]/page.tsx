import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";

import HouseGallery from "@/components/house/HouseGallery";
import HousePrice from "@/components/house/HousePrice";
import HouseTag from "@/components/house/HouseTag";
import HouseFeature from "@/components/house/HouseFeature";
import HouseDescription from "@/components/house/HouseDescription";
import HouseContact from "@/components/house/HouseContact";

import { houses } from "@/data/houses";

interface PageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    fromPage?: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 房源详情
|
| GET /api/houses/:id
|
| 当前阶段：
| 从 "@/data/houses" Mock 数据读取。
|
| 后端接入后：
| const house = await getHouseById(id);
|
|--------------------------------------------------------------------------
*/

export default async function HouseDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;

  const { fromPage } =
    await searchParams;

  const page = Number(fromPage);

  const returnHref =
    Number.isInteger(page) &&
    page > 1
      ? `/houses?page=${page}#house-results`
      : "/houses#house-results";

  const house = houses.find(
    (item) => item.id === Number(id)
  );

  if (!house) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

      <section
        className="
          border-b
          border-slate-200
          bg-white
        "
      >
        <Container>
          <div
            className="
              px-4
              py-5
            "
          >
            <Link
              href={returnHref}
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
                mt-4
                flex
                flex-wrap
                items-center
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
                <MapPin size={14} />

                {house.location}
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >
                <CalendarDays size={14} />

                发布于 {house.publishTime}
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                "
              >
                <Eye size={14} />

                {house.views} 次浏览
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="py-8 sm:py-10">
        <Container>
          {/* Gallery */}

          <HouseGallery
            images={house.images}
          />

          {/* Main layout */}

          <div
            className="
              mt-8
              grid
              items-start
              gap-8
              lg:grid-cols-[minmax(0,1fr)_340px]
            "
          >
            {/* LEFT */}

            <div
              className="
                min-w-0
                space-y-6
              "
            >
              <HousePrice
                title={house.title}
                rent={house.rent}
                location={house.location}
                managementFee={
                  house.managementFee
                }
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
                builtYear={
                  house.builtYear
                }
                direction={
                  house.direction
                }
                structure={
                  house.structure
                }
                managementFee={
                  house.managementFee
                }
                deposit={house.deposit}
                keyMoney={house.keyMoney}
                availableDate={
                  house.availableDate
                }
                publishTime={
                  house.publishTime
                }
                views={house.views}
              />

              <HouseDescription
                description={
                  house.description
                }
              />
            </div>

            {/* RIGHT */}

            <aside
              className="
                space-y-4
                lg:sticky
                lg:top-24
              "
            >
              <HouseContact
                name={house.contactName}
                company={house.company}
                phone={house.phone}
                email={house.email}
              />

              {/* Summary */}

              <div
                className="
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-blue-600
                  "
                >
                  HOUSE SUMMARY
                </p>

                <h3
                  className="
                    mt-2
                    font-black
                    text-slate-900
                  "
                >
                  房源概要
                </h3>

                <div className="mt-5 space-y-4">
                  <SummaryRow
                    label="月租"
                    value={house.rent}
                    strong
                  />

                  <SummaryRow
                    label="户型"
                    value={house.layout}
                  />

                  <SummaryRow
                    label="面积"
                    value={house.area}
                  />

                  <SummaryRow
                    label="管理费"
                    value={
                      house.managementFee
                    }
                  />

                  <SummaryRow
                    label="押金"
                    value={house.deposit}
                  />

                  <SummaryRow
                    label="礼金"
                    value={house.keyMoney}
                  />

                  <SummaryRow
                    label="入住时间"
                    value={
                      house.availableDate
                    }
                  />
                </div>
              </div>

              {/* Safety */}

              <div
                className="
                  rounded-[24px]
                  border
                  border-amber-200
                  bg-amber-50
                  p-5
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-amber-800
                  "
                >
                  <ShieldCheck size={18} />

                  <h3
                    className="
                      text-sm
                      font-black
                    "
                  >
                    租房安全提醒
                  </h3>
                </div>

                <p
                  className="
                    mt-3
                    text-xs
                    leading-6
                    text-amber-800/80
                  "
                >
                  签约和付款前请确认房源真实性、
                  初期费用、退房费用、更新费以及保证会社条件。
                  不要仅凭聊天记录向个人账户支付大额费用。
                </p>

                <Link
                  href="/scam"
                  className="
                    mt-4
                    inline-flex
                    text-xs
                    font-bold
                    text-amber-900
                    underline
                    underline-offset-4
                  "
                >
                  查看避坑信息
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        border-b
        border-slate-100
        pb-3
        last:border-b-0
        last:pb-0
      "
    >
      <span
        className="
          text-xs
          text-slate-400
        "
      >
        {label}
      </span>

      <span
        className={`
          text-right
          text-sm
          ${
            strong
              ? "font-black text-blue-600"
              : "font-bold text-slate-800"
          }
        `}
      >
        {value || "未填写"}
      </span>
    </div>
  );
}