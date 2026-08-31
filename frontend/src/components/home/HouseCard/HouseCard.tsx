"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  ArrowRight,
  Building2,
  Home,
  MapPin,
  Maximize2,
} from "lucide-react";

export interface HouseCardProps {
  id: number;
  title: string;
  rent: string;
  layout: string;
  area: string;
  location: string;
  images?: string[];
  tags: string[];
  href?: string;
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
  href,
}: HouseCardProps) {
  const detailHref = href ?? `/houses/${id}`;
  const cover = images[0];

  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-0
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-xl
      "
    >
      {/* Favorite */}

      <div className="absolute right-4 top-4 z-20">
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

      <Link href={detailHref} className="block">
        {/* Cover */}

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
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-[1.04]
                "
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

          {/* Layout */}

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
            <Home size={13} className="text-blue-500" />

            <span>{layout}</span>

            <span className="text-slate-300">·</span>

            <Maximize2 size={12} className="text-slate-400" />

            <span>{area}</span>
          </div>
        </div>

        {/* Content */}

        <div className="p-5 sm:p-6">
          {/* Price */}

          <div className="flex items-end gap-1">
            <span
              className="
                text-2xl
                font-black
                tracking-tight
                text-blue-600
              "
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

          {/* Title */}

          <h3
            className="
              mt-3
              line-clamp-2
              min-h-[52px]
              text-lg
              font-black
              leading-[1.45]
              text-slate-950
              transition-colors
              group-hover:text-blue-600
            "
          >
            {title}
          </h3>

          {/* Location */}

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

          {/* Tags */}

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
              {tags.slice(0, 4).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}

          {/* Bottom */}

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
              className="
                text-sm
                font-bold
                text-slate-500
                transition-colors
                group-hover:text-slate-900
              "
            >
              查看房源详情
            </span>

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-500
                transition-all
                duration-300
                group-hover:bg-slate-950
                group-hover:text-white
              "
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