"use client";

import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  Eye,
  MapPin,
  MessageCircle,
  MoreHorizontal,
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
    className:
      "bg-blue-100 text-blue-700",
  },

  house: {
    text: "房源",
    className:
      "bg-emerald-100 text-emerald-700",
  },

  school: {
    text: "学校",
    className:
      "bg-indigo-100 text-indigo-700",
  },

  experience: {
    text: "经验",
    className:
      "bg-orange-100 text-orange-700",
  },

  scam: {
    text: "避坑",
    className:
      "bg-red-100 text-red-700",
  },

  news: {
    text: "资讯",
    className:
      "bg-violet-100 text-violet-700",
  },
};

function getFeedHref(item: FeedItem) {
  if (item.type === "job") {
    return `/jobs/${item.id}`;
  }

  if (item.type === "house") {
    return `/houses/${item.id}`;
  }

  if (item.type === "experience") {
    return `/experience/${item.id}`;
  }

  if (item.type === "scam") {
    return `/scam/${item.id}`;
  }

  /*
   * 学校目前存在三个独立模块，
   * 首页 feed 数据还没有 schoolType，
   * 暂时进入学校中心，避免制造错误详情链接。
   *
   * 后端以后应该返回：
   * {
   *   id,
   *   type: "school",
   *   schoolType: "language" | "university" | "college"
   * }
   *
   * 然后直接进入对应学校详情。
   */
  if (item.type === "school") {
    return "/schools";
  }

  /*
   * 资讯模块目前还没有正式详情页。
   * 先进入全站搜索，不制造 /news/:id 404。
   *
   * 后续 News 模块建立以后改成：
   * /news/${item.id}
   */
  return `/search?q=${encodeURIComponent(
    item.title
  )}`;
}

export default function FeedCard({
  item,
}: FeedCardProps) {
  const router = useRouter();

  const badge = badgeMap[item.type];

  const href = getFeedHref(item);

  function openDetail() {
    router.push(href);
  }

  function openComments() {
    /*
     * 评论系统建立后，
     * 所有正式详情页都会有 #comments 区域。
     */
    router.push(`${href}#comments`);
  }

  return (
    <Card
      className="
        group
        relative
        cursor-pointer
        p-5
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-lg
        sm:p-6
      "
    >
      <div
        role="link"
        tabIndex={0}
        aria-label={`查看：${item.title}`}
        onClick={openDetail}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openDetail();
          }
        }}
        className="
          outline-none
          focus-visible:ring-2
          focus-visible:ring-blue-500
          focus-visible:ring-offset-4
        "
      >
        {/* Header */}

        <div className="flex items-center justify-between gap-3">
          <div
            className="
              flex
              min-w-0
              flex-wrap
              items-center
              gap-2
              sm:gap-3
            "
          >
            <span
              className={`
                shrink-0
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

            <span
              className="
                truncate
                text-xs
                text-slate-400
                sm:text-sm
              "
            >
              {item.publishTime}
            </span>
          </div>

          <button
            type="button"
            aria-label="更多操作"
            onClick={(event) => {
              event.stopPropagation();

              /*
               * 后续这里可以打开：
               * 分享 / 举报 / 不感兴趣
               */
            }}
            className="
              relative
              z-10
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Title */}

        <h2
          className="
            mt-5
            text-xl
            font-black
            leading-snug
            text-slate-900
            transition-colors
            group-hover:text-blue-600
            sm:text-2xl
          "
        >
          {item.title}
        </h2>

        {/* Summary */}

        <p
          className="
            mt-3
            line-clamp-2
            text-sm
            leading-7
            text-slate-500
            sm:text-base
          "
        >
          {item.summary}
        </p>

        {/* Cover */}

        {item.cover && (
          <div
            className="
              mt-5
              overflow-hidden
              rounded-2xl
              bg-slate-100
              sm:mt-6
            "
          >
            <img
              src={item.cover}
              alt={item.title}
              className="
                aspect-[16/9]
                w-full
                object-cover
                transition
                duration-500
                group-hover:scale-[1.02]
              "
            />
          </div>
        )}

        {/* Location */}

        {item.location && (
          <div
            className="
              mt-5
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

            <span className="truncate">
              {item.location}
            </span>
          </div>
        )}

        {/* Footer */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            gap-3
            border-t
            border-slate-100
            pt-4
            sm:gap-4
            sm:pt-5
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
              sm:gap-5
            "
          >
            {/* Favorite */}

            <div
              onClick={(event) => {
                event.stopPropagation();
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
              className="
                relative
                z-10
                flex
                items-center
                gap-1.5
                text-sm
                text-slate-500
                sm:gap-2
              "
            >
              <FavoriteButton size={20} />

              <span>{item.likes}</span>
            </div>

            {/* Comment */}

            <button
              type="button"
              aria-label={`查看 ${item.comments} 条评论`}
              onClick={(event) => {
                event.stopPropagation();
                openComments();
              }}
              className="
                relative
                z-10
                flex
                min-h-10
                items-center
                gap-1.5
                rounded-lg
                px-1
                text-sm
                text-slate-500
                transition
                hover:text-blue-600
                sm:gap-2
              "
            >
              <MessageCircle size={18} />

              {item.comments}
            </button>

            {/* Views */}

            <div
              className="
                flex
                items-center
                gap-1.5
                text-sm
                text-slate-500
                sm:gap-2
              "
            >
              <Eye size={18} />

              {item.views}
            </div>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openDetail();
            }}
            className="
              relative
              z-10
              hidden
              min-h-10
              shrink-0
              items-center
              text-sm
              font-bold
              text-blue-600
              transition
              hover:translate-x-1
              sm:inline-flex
            "
          >
            阅读全文 →
          </button>
        </div>
      </div>
    </Card>
  );
}