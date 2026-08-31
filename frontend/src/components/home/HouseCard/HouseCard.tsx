"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  ArrowRight,
  Building2,
  MapPin,
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
  const detailHref =
    href ?? `/houses/${id}`;

  const cover = images[0];

  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        bg-white
        p-0
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Favorite */}

      <div className="absolute right-4 top-4 z-20">
        <div
          className="
            rounded-full
            bg-white/90
            p-1
            shadow-sm
            backdrop-blur
          "
        >
          <FavoriteButton />
        </div>
      </div>

      <Link
        href={detailHref}
        className="block"
      >
        {/* Cover */}

        {cover ? (
          <div
            className="
              relative
              h-52
              overflow-hidden
              bg-stone-100
            "
          >
            <img
              src={cover}
              alt={title}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.03]
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-24
                bg-gradient-to-t
                from-black/30
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-4
                left-4
                rounded-full
                bg-white/90
                px-3
                py-1.5
                text-xs
                font-bold
                text-slate-700
                shadow-sm
                backdrop-blur
              "
            >
              {layout} · {area}
            </div>
          </div>
        ) : (
          <div
            className="
              flex
              h-44
              items-center
              justify-center
              bg-gradient-to-br
              from-stone-100
              via-amber-50
              to-stone-200
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
                bg-white/80
                text-stone-500
                shadow-sm
              "
            >
              <Building2 size={26} />
            </div>
          </div>
        )}

        {/* Content */}

        <div className="p-6">
          <h3
            className="
              line-clamp-2
              text-xl
              font-black
              leading-snug
              text-slate-900
              transition-colors
              group-hover:text-blue-600
            "
          >
            {title}
          </h3>

          {/* Rent */}

          <div className="mt-3 flex items-end gap-2">
            <p
              className="
                text-2xl
                font-black
                tracking-tight
                text-slate-950
              "
            >
              {rent}
            </p>
          </div>

          {/* Info */}

          {!cover && (
            <p
              className="
                mt-4
                text-sm
                font-medium
                text-slate-600
              "
            >
              {layout} · {area}
            </p>
          )}

          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >
            <MapPin
              size={16}
              className="shrink-0 text-stone-500"
            />

            <span className="line-clamp-1">
              {location}
            </span>
          </div>

          {/* Tags */}

          <div className="mt-5 flex flex-wrap gap-2">
            {tags
              .slice(0, 4)
              .map((tag) => (
                <Tag key={tag}>
                  {tag}
                </Tag>
              ))}
          </div>

          {/* Bottom */}

          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              border-t
              border-stone-100
              pt-5
            "
          >
            <span
              className="
                text-sm
                font-bold
                text-slate-500
                transition-colors
                group-hover:text-slate-950
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
                bg-stone-100
                text-stone-500
                transition-all
                group-hover:bg-slate-950
                group-hover:text-white
              "
            >
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}