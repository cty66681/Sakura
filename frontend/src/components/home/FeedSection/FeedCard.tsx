
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  ArrowRight,
  Eye,
  MapPin,
  MessageCircle,
} from "lucide-react";

export interface FeedItem {
  id: number;

  type:
    | "job"
    | "house"
    | "school"
    | "experience"
    | "scam"
    | "news";

  title: string;
  summary: string;
  description: string;
  location?: string;
  publishTime: string;
  cover?: string;
  likes: number;
  comments: number;
  views: number;
}

interface FeedCardProps {
  item: FeedItem;
}

const badgeMap: Record<
  FeedItem["type"],
  {
    text: string;
    className: string;
  }
> = {
  job: {
    text: "工作",
    className: "bg-blue-50 text-blue-700",
  },
  house: {
    text: "房源",
    className: "bg-emerald-50 text-emerald-700",
  },
  school: {
    text: "学校",
    className: "bg-indigo-50 text-indigo-700",
  },
  experience: {
    text: "经验",
    className: "bg-amber-50 text-amber-700",
  },
  scam: {
    text: "避坑",
    className: "bg-rose-50 text-rose-700",
  },
  news: {
    text: "资讯",
    className: "bg-violet-50 text-violet-700",
  },
};

function getFeedHref(item: FeedItem): string {
  switch (item.type) {
    case "job":
      return `/jobs/${item.id}`;

    case "house":
      return `/houses/${item.id}`;

    case "experience":
      return `/experience/${item.id}`;

    case "scam":
      return `/scam/${item.id}`;

    case "school":
      // TODO [API - GET]
      // 后端增加 schoolType 和实际学校详情 ID 后，
      // 再跳转至对应学校详情页。
      return "/schools";

    case "news":
      // 资讯详情页尚未接入。
      // 暂时通过全站搜索查找相关信息。
      return `/search?q=${encodeURIComponent(
        item.title
      )}`;
  }
}

export default function FeedCard({
  item,
}: FeedCardProps) {
  const router = useRouter();

  /*
   * 记录加载失败的图片地址。
   * 没有封面或封面失效时，不显示整个图片区域。
   * 图片地址更新后，新图片仍然可以正常加载。
   */
  const [failedCover, setFailedCover] =
    useState<string | null>(null);

  const cover = item.cover?.trim();

  const showCover =
    Boolean(cover) && failedCover !== cover;

  const badge = badgeMap[item.type];

  const href = getFeedHref(item);

  function openComments() {
    // TODO [API - GET]
    // 正式评论系统接入后，
    // 详情页需要提供 #comments 区域。
    router.push(`${href}#comments`);
  }

  return (
    <Card
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-rose-200
        hover:shadow-[0_8px_28px_rgba(50,40,40,0.06)]
        sm:p-6
      "
    >
      {/* 主要内容：点击进入详情 */}
      <Link
        href={href}
        aria-label={`查看：${item.title}`}
        className="
          block
          rounded-lg
          outline-none
          focus-visible:ring-2
          focus-visible:ring-rose-400
          focus-visible:ring-offset-4
        "
      >
        {/* 分类与发布时间 */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <span
            className={`
              inline-flex
              items-center
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              ${badge.className}
            `}
          >
            {badge.text}
          </span>

          <span className="text-xs text-slate-400">
            {item.publishTime}
          </span>
        </div>

        {/* 标题 */}
        <h3
          className="
            mt-4
            line-clamp-2
            text-lg
            font-bold
            leading-snug
            text-slate-900
            transition-colors
            group-hover:text-[#D34F5C]
            sm:text-xl
          "
        >
          {item.title}
        </h3>

        {/* 简介 */}
        <p
          className="
            mt-3
            line-clamp-3
            text-sm
            leading-7
            text-slate-500
          "
        >
          {item.summary}
        </p>

        {/* 有真实图片且加载成功时才显示 */}
        {showCover && cover && (
          <div
            className="
              mt-4
              overflow-hidden
              rounded-xl
              bg-slate-50
            "
          >
            <img
              src={cover}
              alt={item.title}
              loading="lazy"
              decoding="async"
              onError={() => {
                setFailedCover(cover);
              }}
              className="
                h-44
                w-full
                object-cover
                transition-transform
                duration-300
                group-hover:scale-[1.02]
                sm:h-52
              "
            />
          </div>
        )}

        {/* 地区 */}
        {item.location && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-1.5
              text-xs
              text-slate-500
              sm:text-sm
            "
          >
            <MapPin
              size={15}
              className="
                shrink-0
                text-slate-400
              "
            />

            <span className="truncate">
              {item.location}
            </span>
          </div>
        )}
      </Link>

      {/* 底部交互 */}
      <div
        className="
          mt-auto
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          border-t
          border-slate-100
          pt-4
          [&:not(:first-child)]:mt-5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-4
            sm:gap-5
          "
        >
          {/* 收藏：保留原有组件 */}
          <div
            className="
              flex
              items-center
              gap-1.5
              text-sm
              text-slate-500
            "
          >
            <FavoriteButton size={20} />

            <span>{item.likes}</span>
          </div>

          {/* 评论 */}
          <button
            type="button"
            aria-label={`查看 ${item.comments} 条评论`}
            onClick={openComments}
            className="
              inline-flex
              min-h-10
              items-center
              gap-1.5
              rounded-lg
              text-sm
              text-slate-500
              transition-colors
              hover:text-[#D34F5C]
            "
          >
            <MessageCircle size={18} />

            <span>{item.comments}</span>
          </button>

          {/* 浏览量 */}
          <div
            className="
              flex
              items-center
              gap-1.5
              text-sm
              text-slate-500
            "
            aria-label={`${item.views} 次浏览`}
          >
            <Eye size={18} />

            <span>{item.views}</span>
          </div>
        </div>

        {/* 阅读全文 */}
        <Link
          href={href}
          className="
            inline-flex
            min-h-10
            shrink-0
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-[#D34F5C]
            transition
            hover:gap-2.5
            sm:text-sm
          "
        >
          查看详情
          <ArrowRight size={16} />
        </Link>
      </div>
    </Card>
  );
}
