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

export default function FeedCard({
  item,
}: FeedCardProps) {
  const badge =
    badgeMap[item.type];

  return (
    <Card
      className="
        group
        cursor-pointer
        p-6
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`
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

          <span className="text-sm text-slate-400">
            {item.publishTime}
          </span>
        </div>

        <button
          type="button"
          aria-label="更多操作"
          className="
            rounded-lg
            p-1.5
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
        >
          <MoreHorizontal
            size={18}
          />
        </button>
      </div>

      {/* Title */}

      <h2
        className="
          mt-5
          text-2xl
          font-bold
          text-slate-900
          transition-colors
          group-hover:text-blue-600
        "
      >
        {item.title}
      </h2>

      {/* Summary */}

      <p
        className="
          mt-3
          line-clamp-2
          leading-7
          text-slate-500
        "
      >
        {item.summary}
      </p>

      {/* Cover */}

      {item.cover && (
        <div
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            bg-slate-100
          "
        >
          <img
            src={item.cover}
            alt={item.title}
            className="
              h-52
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
          <MapPin size={16} />

          {item.location}
        </div>
      )}

      {/* Footer */}

      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          gap-4
          border-t
          border-slate-100
          pt-5
        "
      >
        <div
          className="
            flex
            items-center
            gap-5
          "
        >
          {/* Favorite */}

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >
            <FavoriteButton
              size={20}
            />

            {item.likes}
          </div>

          {/* Comment */}

          <button
            type="button"
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
              transition
              hover:text-blue-600
            "
          >
            <MessageCircle
              size={18}
            />

            {item.comments}
          </button>

          {/* Views */}

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >
            <Eye size={18} />

            {item.views}
          </div>
        </div>

        <button
          type="button"
          className="
            shrink-0
            text-sm
            font-semibold
            text-blue-600
            transition
            hover:translate-x-1
          "
        >
          阅读全文 →
        </button>
      </div>
    </Card>
  );
}