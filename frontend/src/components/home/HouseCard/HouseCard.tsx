"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock3,
  Home,
  MapPin,
  Maximize2,
  UserRoundCheck,
} from "lucide-react";

import {
  HOUSE_LISTING_STATUS_LABELS,
  type HouseListingStatus,
} from "@/data/houses";

export interface HouseCardProps {
  id: number;
  title: string;
  rent: string;
  layout: string;
  area: string;
  location: string;

  images?: string[];
  tags: string[];

  listingStatus?: HouseListingStatus;

  lastVerifiedAt?: string | null;

  foreignerAllowed?: boolean | null;
  studentAllowed?: boolean | null;

  href?: string;
}

/* =========================================================
   最后确认时间
========================================================= */

function getVerifiedLabel(
  lastVerifiedAt: string | null | undefined
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

  const formattedDate =
    new Intl.DateTimeFormat(
      "zh-CN",
      {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(verifiedDate);

  return `最后确认 ${formattedDate}`;
}

/* =========================================================
   STATUS STYLE
========================================================= */

function getStatusStyle(
  status: HouseListingStatus
) {
  if (status === "available") {
    return {
      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    };
  }

  if (status === "paused") {
    return {
      badge:
        "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    };
  }

  if (status === "rented") {
    return {
      badge:
        "border-slate-200 bg-slate-100 text-slate-600",
      dot: "bg-slate-400",
    };
  }

  if (status === "expired") {
    return {
      badge:
        "border-orange-200 bg-orange-50 text-orange-700",
      dot: "bg-orange-500",
    };
  }

  return {
    badge:
      "border-slate-200 bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
  };
}

export default function HouseCard({
  id,
  title,
  rent,
  layout,
  area,
  location,
  images = [],
  tags,

  listingStatus = "available",

  lastVerifiedAt = null,

  foreignerAllowed = null,
  studentAllowed = null,

  href,
}: HouseCardProps) {
  const detailHref =
    href ?? `/houses/${id}`;

  const cover = images[0];

  const statusStyle =
    getStatusStyle(
      listingStatus
    );

  const verifiedLabel =
    getVerifiedLabel(
      lastVerifiedAt
    );

  const isUnavailable =
    listingStatus === "rented" ||
    listingStatus === "expired" ||
    listingStatus === "hidden";

  return (
    <Card
      className={`
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        bg-white
        p-0
        shadow-sm
        transition-all
        duration-300
        ${
          isUnavailable
            ? "border-slate-200 opacity-75"
            : "border-slate-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
        }
      `}
    >
      {/* =====================================================
          Favorite
      ===================================================== */}

      <div className="absolute right-4 top-4 z-30">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/60
            bg-white/90
            shadow-sm
            backdrop-blur-md
          "
        >
          <FavoriteButton />
        </div>
      </div>

      <Link
        href={detailHref}
        className="block"
      >
        {/* =====================================================
            Cover
        ===================================================== */}

        <div
          className="
            relative
            h-48
            overflow-hidden
            bg-slate-100
            sm:h-52
          "
        >
          {cover ? (
            <>
              <img
                src={cover}
                alt={title}
                className={`
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  ${
                    isUnavailable
                      ? "grayscale-[35%]"
                      : "group-hover:scale-[1.04]"
                  }
                `}
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-slate-950/45
                  via-transparent
                  to-transparent
                "
              />
            </>
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                flex-col
                items-center
                justify-center
                bg-gradient-to-br
                from-slate-100
                via-stone-50
                to-blue-50
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-slate-400
                  shadow-sm
                "
              >
                <Building2 size={26} />
              </div>

              <p
                className="
                  mt-3
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                暂无房源照片
              </p>
            </div>
          )}

          {/* =====================================================
              Status
          ===================================================== */}

          <div
            className={`
              absolute
              left-4
              top-4
              z-20
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              px-3
              py-1.5
              text-xs
              font-bold
              shadow-sm
              backdrop-blur
              ${statusStyle.badge}
            `}
          >
            <span
              className={`
                h-2
                w-2
                rounded-full
                ${statusStyle.dot}
              `}
            />

            {
              HOUSE_LISTING_STATUS_LABELS[
                listingStatus
              ]
            }
          </div>

          {/* =====================================================
              Layout
          ===================================================== */}

          <div
            className="
              absolute
              bottom-4
              left-4
              flex
              items-center
              gap-2
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-xs
              font-bold
              text-slate-700
              shadow-sm
              backdrop-blur
            "
          >
            <Home
              size={13}
              className="text-blue-500"
            />

            <span>
              {layout}
            </span>

            <span className="text-slate-300">
              ·
            </span>

            <Maximize2
              size={12}
              className="text-slate-400"
            />

            <span>
              {area}
            </span>
          </div>
        </div>

        {/* =====================================================
            Content
        ===================================================== */}

        <div className="p-5 sm:p-6">
          {/* =====================================================
              Price
          ===================================================== */}

          <div className="flex items-end gap-1">
            <span
              className={`
                text-2xl
                font-black
                tracking-tight
                ${
                  isUnavailable
                    ? "text-slate-500"
                    : "text-blue-600"
                }
              `}
            >
              {rent}
            </span>

            <span
              className="
                mb-0.5
                text-xs
                font-medium
                text-slate-400
              "
            >
              / 月
            </span>
          </div>

          {/* =====================================================
              Title
          ===================================================== */}

          <h3
            className={`
              mt-3
              line-clamp-2
              min-h-[52px]
              text-lg
              font-black
              leading-[1.45]
              transition-colors
              ${
                isUnavailable
                  ? "text-slate-600"
                  : "text-slate-950 group-hover:text-blue-600"
              }
            `}
          >
            {title}
          </h3>

          {/* =====================================================
              Location
          ===================================================== */}

          <div
            className="
              mt-3
              flex
              items-start
              gap-2
              text-sm
              text-slate-500
            "
          >
            <MapPin
              size={15}
              className="
                mt-0.5
                shrink-0
                text-slate-400
              "
            />

            <span className="line-clamp-1">
              {location}
            </span>
          </div>

          {/* =====================================================
              Verification
          ===================================================== */}

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-slate-100
                px-2.5
                py-1.5
                text-xs
                font-semibold
                text-slate-600
              "
            >
              <Clock3 size={13} />

              {verifiedLabel}
            </div>
          </div>

          {/* =====================================================
              入住资格
          ===================================================== */}

          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-2
            "
          >
            {foreignerAllowed ===
              true && (
              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-cyan-50
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-cyan-700
                "
              >
                <BadgeCheck
                  size={13}
                />

                外国人可入住
              </div>
            )}

            {studentAllowed ===
              true && (
              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-blue-50
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-blue-700
                "
              >
                <UserRoundCheck
                  size={13}
                />

                学生可入住
              </div>
            )}

            {foreignerAllowed ===
              null && (
              <div
                className="
                  rounded-lg
                  bg-slate-100
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                外国人入住条件待确认
              </div>
            )}

            {studentAllowed ===
              null && (
              <div
                className="
                  rounded-lg
                  bg-slate-100
                  px-2.5
                  py-1.5
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                学生入住条件待确认
              </div>
            )}
          </div>

          {/* =====================================================
              Tags
          ===================================================== */}

          {tags.length > 0 && (
            <div
              className="
                mt-5
                flex
                min-h-[28px]
                flex-wrap
                gap-2
              "
            >
              {tags
                .filter(
                  (tag) =>
                    tag !==
                      "外国人可" &&
                    tag !==
                      "留学生可" &&
                    tag !==
                      "学生可"
                )
                .slice(0, 4)
                .map(
                  (tag) => (
                    <Tag key={tag}>
                      {tag}
                    </Tag>
                  )
                )}
            </div>
          )}

          {/* =====================================================
              Bottom
          ===================================================== */}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              border-t
              border-slate-100
              pt-4
            "
          >
            <span
              className={`
                text-sm
                font-bold
                transition-colors
                ${
                  isUnavailable
                    ? "text-slate-400"
                    : "text-slate-500 group-hover:text-slate-900"
                }
              `}
            >
              {listingStatus ===
              "paused"
                ? "查看暂停受理房源"
                : listingStatus ===
                    "rented"
                  ? "查看已租出房源"
                  : listingStatus ===
                      "expired"
                    ? "查看历史房源"
                    : "查看房源详情"}
            </span>

            <div
              className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                transition-all
                duration-300
                ${
                  isUnavailable
                    ? "bg-slate-100 text-slate-400"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-950 group-hover:text-white"
                }
              `}
            >
              <ArrowRight
                size={16}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                "
              />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}