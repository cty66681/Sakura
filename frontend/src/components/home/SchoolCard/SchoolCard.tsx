"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  CalendarDays,
  GraduationCap,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";

export interface SchoolCardProps {
  id: number;
  name: string;
  type: string;
  location: string;
  deadline: string;
  tags: string[];
}

export default function SchoolCard({
  id,
  name,
  type,
  location,
  deadline,
  tags,
}: SchoolCardProps) {
  return (
    <Link
      href={`/schools/${id}`}
      className="block"
    >
      <Card
        className="
          group
          p-6
          transition-all
          duration-300
          hover:-translate-y-2
          hover:shadow-2xl
        "
      >
        {/* Header */}

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-br
                from-blue-500
                to-cyan-500
                text-white
              "
            >
              <GraduationCap size={26} />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h3
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                    transition
                    group-hover:text-blue-600
                  "
                >
                  {name}
                </h3>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                {type}
              </p>

            </div>

          </div>

          <FavoriteButton />

        </div>

        {/* Rating */}

        <div className="mt-5 flex items-center gap-2">

          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-semibold text-slate-700">
            4.8
          </span>

          <span className="text-sm text-slate-400">
            留学生推荐
          </span>

        </div>

        {/* Info */}

        <div className="mt-5 space-y-3">

          <div className="flex items-center gap-2 text-slate-500">

            <MapPin
              size={18}
              className="text-blue-500"
            />

            {location}

          </div>

          <div className="flex items-center gap-2 text-slate-500">

            <CalendarDays
              size={18}
              className="text-orange-500"
            />

            截止：{deadline}

          </div>

        </div>

        {/* Tags */}

        <div className="mt-6 flex flex-wrap gap-2">

          {tags.map((tag) => (

            <Tag key={tag}>
              {tag}
            </Tag>

          ))}

        </div>

        {/* AI */}

        <div
          className="
            mt-6
            rounded-xl
            bg-blue-50
            p-4
          "
        >

          <p className="text-xs font-semibold text-blue-600">
            🤖 AI 推荐
          </p>

          <p className="mt-2 text-sm text-slate-600">
            适合留学生申请，
            外国人支持完善，
            IT、商科专业热度较高。
          </p>

        </div>

        {/* Bottom */}

        <Button
          className="
            mt-6
            w-full
          "
        >
          查看学校

          <ArrowRight
            size={18}
            className="ml-2"
          />

        </Button>

      </Card>
    </Link>
  );
}