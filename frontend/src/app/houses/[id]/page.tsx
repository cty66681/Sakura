import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  CircleCheck,
  CircleOff,
  Clock3,
  Eye,
  MapPin,
  PauseCircle,
  ShieldCheck,
  BadgeCheck,
  Building2,
  UserRound,
} from "lucide-react";

import Container from "@/components/layout/Container";

import HouseGallery from "@/components/house/HouseGallery";
import HousePrice from "@/components/house/HousePrice";
import HouseTag from "@/components/house/HouseTag";
import HouseFeature from "@/components/house/HouseFeature";
import HouseDescription from "@/components/house/HouseDescription";
import HouseContact from "@/components/house/HouseContact";
import CommentSection from "@/components/comments/CommentSection";

import {
  HOUSE_LISTING_STATUS_LABELS,
  type HouseListingStatus,
} from "@/data/houses";

interface PageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    returnTo?: string;
  }>;
}

interface ApiHouse {
  id: number;

  publisher: {
    id: string;
    name: string;
    company: string | null;
    verified: boolean;
  };

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

  floor: string | null;
  builtYear: number | null;
  direction: string | null;
  structure: string | null;

  availableFrom: string | null;

  foreignerAllowed: boolean | null;
  studentAllowed: boolean | null;

  description: string;

  features: string[];
  tags: string[];

  listingStatus: HouseListingStatus;

  lastVerifiedAt: string | null;
  expiresAt: string | null;

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

interface HouseApiResponse {
  success: boolean;
  data: ApiHouse;
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
| 公开接口只返回允许公开的房源资料。
|
| 注意：
| 正式后端上线以后，不要把完整私人联系方式
| 直接混在房源公开接口里返回。
|
|--------------------------------------------------------------------------
*/

function formatYen(value: number) {
  return `¥${value.toLocaleString("ja-JP")}`;
}

function formatMonths(value: number) {
  return `${value}个月`;
}

function formatArea(value: number) {
  return `${value}㎡`;
}

function getVerifiedLabel(
  lastVerifiedAt: string | null
) {
  if (!lastVerifiedAt) {
    return "尚未确认";
  }

  const verifiedDate = new Date(
    lastVerifiedAt
  );

  if (
    Number.isNaN(
      verifiedDate.getTime()
    )
  ) {
    return "确认时间未知";
  }

  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(verifiedDate);
}

function formatJapanDateTime(
  value: string | null
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(date);
}

function getStatusDescription(
  status: HouseListingStatus
) {
  if (status === "available") {
    return "当前仍接受咨询和申请。用户提交申请不会改变房源本身的公开状态。";
  }

  if (status === "paused") {
    return "发布者暂时停止接受新的申请。房源仍然保留，可以收藏并稍后再次查看。";
  }

  if (status === "rented") {
    return "该房源已经确认出租，目前不再接受新的申请。";
  }

  if (status === "expired") {
    return "该房源已经超过有效确认期限，需要发布者重新确认后才能恢复正常受理。";
  }

  return "该房源当前无法公开受理。";
}

function getStatusClassName(
  status: HouseListingStatus
) {
  if (status === "available") {
    return `
      border-emerald-200
      bg-emerald-50
      text-emerald-800
    `;
  }

  if (status === "paused") {
    return `
      border-amber-200
      bg-amber-50
      text-amber-800
    `;
  }

  if (status === "expired") {
    return `
      border-orange-200
      bg-orange-50
      text-orange-800
    `;
  }

  return `
    border-slate-200
    bg-slate-100
    text-slate-700
  `;
}

  export default async function HouseDetailPage({
    params,
    searchParams,
  }: PageProps) {
    const { id } = await params;

    const { returnTo } =
      await searchParams;

    const safeReturnTo =
      returnTo === "/houses" ||
      returnTo?.startsWith(
        "/houses?"
      ) ||
      returnTo?.startsWith(
        "/houses#"
      );

    const returnHref =
      safeReturnTo && returnTo
        ? returnTo
        : "/houses#house-results";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/houses/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      notFound();
    }

    const result: HouseApiResponse =
      await response.json();

    if (!result.success || !result.data) {
      notFound();
    }

    const apiHouse = result.data;

    const house = {
    id: apiHouse.id,

    publisherId: apiHouse.publisher.id,
    publisherName: apiHouse.publisher.name,
    publisherCompany:
      apiHouse.publisher.company ?? "",
    publisherVerified:
      apiHouse.publisher.verified,

    title: apiHouse.title,

    rent: formatYen(apiHouse.rent),

    managementFee:
      apiHouse.managementFee > 0
        ? formatYen(apiHouse.managementFee)
        : "无",

    deposit:
      formatMonths(
        apiHouse.depositMonths
      ),

    keyMoney:
      formatMonths(
        apiHouse.keyMoneyMonths
      ),

    layout: apiHouse.layout,

    area: formatArea(apiHouse.area),

    location: apiHouse.location,

    station:
      apiHouse.station ?? "",

    walkMinutes:
      apiHouse.walkMinutes,

    floor:
      apiHouse.floor ?? "",

    builtYear:
      apiHouse.builtYear
        ? String(apiHouse.builtYear)
        : "",

    direction:
      apiHouse.direction ?? "",

    structure:
      apiHouse.structure ?? "",

    availableDate:
      apiHouse.availableFrom ?? "",

    foreignerAllowed:
      apiHouse.foreignerAllowed,

    studentAllowed:
      apiHouse.studentAllowed,

    description:
      apiHouse.description,

    tags:
      apiHouse.tags,

    listingStatus:
      apiHouse.listingStatus,

    lastVerifiedAt:
      apiHouse.lastVerifiedAt,

    expiresAt:
      apiHouse.expiresAt,

    views:
      apiHouse.views,

    publishTime:
      apiHouse.publishedAt ??
      apiHouse.createdAt,

    images:
      apiHouse.images
        .sort(
          (a, b) =>
            a.sortOrder - b.sortOrder
        )
        .map((image) => image.url),
  };

  /*
  |--------------------------------------------------------------------------
  | 公开访问保护
  |--------------------------------------------------------------------------
  |
  | pending / rejected / hidden 内容
  | 不应该通过猜 URL 直接访问。
  |
  |--------------------------------------------------------------------------
  */

  if (
    house.listingStatus === "hidden"
  ) {
    notFound();
  }

  const listingStatus =
    house.listingStatus;

  const verifiedLabel =
    getVerifiedLabel(
      house.lastVerifiedAt
    );

  const verifiedDate =
    formatJapanDateTime(
      house.lastVerifiedAt
    );

  const foreignerText =
    house.foreignerAllowed === true
      ? "可以入住"
      : house.foreignerAllowed ===
          false
        ? "不可入住"
        : "条件待确认";

  const studentText =
    house.studentAllowed === true
      ? "可以入住"
      : house.studentAllowed ===
          false
        ? "不可入住"
        : "条件待确认";

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
                <CalendarDays
                  size={14}
                />

                发布于{" "}
                {house.publishTime}
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

            {/* ================================================= */}
            {/* STATUS */}
            {/* ================================================= */}

            <div
              className={`
                mt-5
                rounded-2xl
                border
                px-4
                py-4
                ${getStatusClassName(
                  listingStatus
                )}
              `}
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-start
                  sm:justify-between
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div className="mt-0.5 shrink-0">
                    {listingStatus ===
                      "available" && (
                      <CircleCheck
                        size={20}
                      />
                    )}

                    {listingStatus ===
                      "paused" && (
                      <PauseCircle
                        size={20}
                      />
                    )}

                    {listingStatus ===
                      "rented" && (
                      <CircleOff
                        size={20}
                      />
                    )}

                    {listingStatus ===
                      "expired" && (
                      <Clock3
                        size={20}
                      />
                    )}
                  </div>

                  <div>
                    <p
                      className="
                        text-sm
                        font-black
                      "
                    >
                      {
                        HOUSE_LISTING_STATUS_LABELS[
                          listingStatus
                        ]
                      }
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        opacity-80
                      "
                    >
                      {getStatusDescription(
                        listingStatus
                      )}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    text-xs
                    font-bold
                  "
                >
                  <Clock3 size={14} />

                  {verifiedLabel}
                </div>
              </div>

              {verifiedDate && (
                <p
                  className="
                    mt-3
                    border-t
                    border-current/10
                    pt-3
                    text-xs
                    opacity-70
                  "
                >
                  最后确认：
                  {verifiedDate}
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="py-8 sm:py-10">
        <Container>
          <HouseGallery
            images={house.images}
          />

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
                location={
                  house.location
                }
                managementFee={
                  house.managementFee
                }
                deposit={
                  house.deposit
                }
                keyMoney={
                  house.keyMoney
                }
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
                deposit={
                  house.deposit
                }
                keyMoney={
                  house.keyMoney
                }
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

              <CommentSection
                contentType="house"
                contentId={house.id}
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
                houseId={house.id}
                publisherId={house.publisherId}
                houseTitle={house.title}
                rent={house.rent}
                location={house.location}
                layout={house.layout}
                area={house.area}
                station={house.station}
                walkMinutes={house.walkMinutes}
                listingStatus={listingStatus}
              />

              {/* Publisher */}

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
                  PUBLISHER
                </p>

                <h3
                  className="
                    mt-2
                    font-black
                    text-slate-900
                  "
                >
                  发布者信息
                </h3>

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-slate-100
                      text-slate-500
                    "
                  >
                    {house.publisherCompany ? (
                      <Building2 size={22} />
                    ) : (
                      <UserRound size={22} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <p
                        className="
                          truncate
                          text-sm
                          font-black
                          text-slate-900
                        "
                      >
                        {house.publisherName || "发布者"}
                      </p>

                      {house.publisherVerified && (
                        <BadgeCheck
                          size={17}
                          className="
                            shrink-0
                            text-blue-500
                          "
                        />
                      )}
                    </div>

                    {house.publisherCompany && (
                      <p
                        className="
                          mt-1
                          truncate
                          text-xs
                          text-slate-500
                        "
                      >
                        {house.publisherCompany}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    bg-slate-50
                    px-3
                    py-3
                  "
                >
                  <span
                    className="
                      text-xs
                      font-medium
                      text-slate-500
                    "
                  >
                    认证状态
                  </span>

                  {house.publisherVerified ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-xs
                        font-bold
                        text-blue-600
                      "
                    >
                      <BadgeCheck size={14} />
                      已认证
                    </span>
                  ) : (
                    <span
                      className="
                        text-xs
                        font-bold
                        text-slate-500
                      "
                    >
                      未认证
                    </span>
                  )}
                </div>

                <p
                  className="
                    mt-4
                    text-xs
                    leading-5
                    text-slate-400
                  "
                >
                  联系和签约前，请自行确认发布者身份以及房源相关资料。
                </p>
                <Link
                  href={`/publishers/${house.publisherId}`}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-bold
                    text-slate-700
                    transition
                    hover:border-blue-200
                    hover:bg-blue-50
                    hover:text-blue-600
                  "
                >
                  查看发布者主页
                </Link>
              </div>

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
                    label="当前状态"
                    value={
                      HOUSE_LISTING_STATUS_LABELS[
                        listingStatus
                      ]
                    }
                  />

                  <SummaryRow
                    label="月租"
                    value={house.rent}
                    strong
                  />

                  <SummaryRow
                    label="户型"
                    value={
                      house.layout
                    }
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
                    value={
                      house.deposit
                    }
                  />

                  <SummaryRow
                    label="礼金"
                    value={
                      house.keyMoney
                    }
                  />

                  <SummaryRow
                    label="外国人入住"
                    value={
                      foreignerText
                    }
                  />

                  <SummaryRow
                    label="学生入住"
                    value={
                      studentText
                    }
                  />

                  <SummaryRow
                    label="入住时间"
                    value={
                      house.availableDate
                    }
                  />

                  <SummaryRow
                    label="最后确认"
                    value={
                      verifiedLabel
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
                  <ShieldCheck
                    size={18}
                  />

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