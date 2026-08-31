"use client";

import Link from "next/link";

import {
  ArrowRight,
  MapPin,
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Tag from "@/components/ui/Tag";
import Card from "@/components/ui/Card/Card";
import FavoriteButton from "@/components/ui/FavoriteButton";

export interface JobCardProps {
  id: number;
  company: string;
  title: string;
  location: string;
  salary: string;
  tags: string[];
  publishTime: string;
  verified?: boolean;
  href?: string;
}

export default function JobCard({
  id,
  company,
  title,
  location,
  salary,
  tags,
  publishTime,
  verified,
  href,
}: JobCardProps) {
  const detailHref =
    href ?? `/jobs/${id}`;

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

      <div
        className="
          absolute
          right-5
          top-5
          z-20
        "
      >
        <FavoriteButton />
      </div>

      <Link
        href={detailHref}
        className="block h-full"
      >
        <div className="flex h-full flex-col p-6">
          {/* Company */}

          <div
            className="
              flex
              items-start
              gap-4
              pr-12
            "
          >
            <Avatar
              name={company}
              size="lg"
            />

            <div className="min-w-0">
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <h3
                  className="
                    truncate
                    font-bold
                    text-slate-800
                  "
                >
                  {company}
                </h3>

                {verified && (
                  <Badge variant="blue">
                    企业认证
                  </Badge>
                )}
              </div>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                "
              >
                {publishTime}
              </p>
            </div>
          </div>

          {/* Title */}

          <h2
            className="
              mt-6
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
          </h2>

          {/* Salary */}

          <p
            className="
              mt-4
              text-2xl
              font-black
              tracking-tight
              text-slate-950
            "
          >
            {salary}
          </p>

          {/* Location */}

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
              className="shrink-0"
            />

            <span className="line-clamp-1">
              {location}
            </span>
          </div>

          {/* Tags */}

          <div
            className="
              mt-5
              flex
              flex-wrap
              gap-2
            "
          >
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
              mt-auto
              pt-6
            "
          >
            <div
              className="
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
                  group-hover:text-slate-950
                "
              >
                查看职位详情
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
                  group-hover:bg-slate-950
                  group-hover:text-white
                "
              >
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}