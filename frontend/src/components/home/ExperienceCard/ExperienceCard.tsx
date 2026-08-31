"use client";

import Link from "next/link";

import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  ArrowRight,
  Clock3,
  User,
} from "lucide-react";

export interface ExperienceCardProps {
  id: number;
  title: string;
  summary: string;
  author: string;
  publishTime: string;
  readTime: string;
  cover?: string;
  tags: string[];
  href?: string;
}

export default function ExperienceCard({
  id,
  title,
  summary,
  author,
  publishTime,
  readTime,
  cover,
  tags,
  href,
}: ExperienceCardProps) {
  const detailHref =
    href ?? `/experience/${id}`;

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
              h-48
              overflow-hidden
              bg-slate-100
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
                h-20
                bg-gradient-to-t
                from-black/25
                to-transparent
              "
            />
          </div>
        ) : (
          <div
            className="
              flex
              h-36
              items-end
              bg-gradient-to-br
              from-slate-100
              via-blue-50
              to-indigo-100
              p-5
            "
          >
            <span
              className="
                rounded-full
                bg-white/80
                px-3
                py-1
                text-xs
                font-bold
                text-slate-600
                backdrop-blur
              "
            >
              在日经验
            </span>
          </div>
        )}

        {/* Content */}

        <div className="p-6">
          {/* Meta */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
              text-xs
              font-medium
              text-slate-400
            "
          >
            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <User size={14} />

              {author}
            </span>

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <Clock3 size={14} />

              {readTime}
            </span>

            <span>
              {publishTime}
            </span>
          </div>

          {/* Title */}

          <h3
            className="
              mt-4
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

          {/* Summary */}

          <p
            className="
              mt-3
              line-clamp-3
              text-sm
              leading-6
              text-slate-500
            "
          >
            {summary}
          </p>

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
              border-slate-100
              pt-5
            "
          >
            <span
              className="
                text-sm
                font-bold
                text-slate-500
                transition-colors
                group-hover:text-blue-600
              "
            >
              阅读全文
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
                group-hover:bg-blue-600
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