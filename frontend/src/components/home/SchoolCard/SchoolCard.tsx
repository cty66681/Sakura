"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  MapPin,
} from "lucide-react";

export interface SchoolCardProps {
  id: number;
  name: string;
  type: string;
  location: string;
  deadline: string;
  tags: string[];
  href: string;
}

export default function SchoolCard({
  id,
  name,
  type,
  location,
  deadline,
  tags,
  href,
}: SchoolCardProps) {
  return (
    <Card
      className="
        group
        relative
        overflow-hidden
        p-0
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Favorite */}

      <div className="absolute right-5 top-5 z-20">
        <FavoriteButton />
      </div>

      {/* Main clickable area */}

      <Link
        href={href}
        className="block p-6"
      >
        {/* Header */}

        <div className="flex items-start gap-4 pr-12">
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-600
              transition
              group-hover:bg-blue-600
              group-hover:text-white
            "
          >
            <GraduationCap size={23} />
          </div>

          <div className="min-w-0">
            <span
              className="
                inline-flex
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-[11px]
                font-bold
                text-slate-500
              "
            >
              {type}
            </span>

            <h3
              className="
                mt-2
                line-clamp-2
                text-xl
                font-black
                leading-snug
                text-slate-900
                transition
                group-hover:text-blue-600
              "
            >
              {name}
            </h3>
          </div>
        </div>

        {/* Info */}

        <div className="mt-6 space-y-3">
          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >
            <MapPin
              size={16}
              className="shrink-0 text-blue-500"
            />

            {location}
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >
            <CalendarDays
              size={16}
              className="shrink-0 text-orange-500"
            />

            申请截止：{deadline}
          </div>
        </div>

        {/* Tags */}

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag) => (
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
            border-slate-100
            pt-5
          "
        >
          <span
            className="
              text-sm
              font-bold
              text-slate-500
              transition
              group-hover:text-blue-600
            "
          >
            查看学校详情
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
              transition
              group-hover:bg-blue-600
              group-hover:text-white
            "
          >
            <ArrowRight size={16} />
          </div>
        </div>
      </Link>
    </Card>
  );
}