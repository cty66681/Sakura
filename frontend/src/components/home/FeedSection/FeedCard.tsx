import Card from "@/components/ui/Card";
import FavoriteButton from "@/components/ui/FavoriteButton";

import {
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";

export interface FeedItem {
  id: number;

  type:
    | "job"
    | "house"
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

const badgeMap = {
  job: {
    text: "工作",
    className: "bg-blue-100 text-blue-700",
  },

  house: {
    text: "房源",
    className: "bg-emerald-100 text-emerald-700",
  },

  experience: {
    text: "经验",
    className: "bg-orange-100 text-orange-700",
  },

  scam: {
    text: "防骗",
    className: "bg-red-100 text-red-700",
  },

  news: {
    text: "资讯",
    className: "bg-violet-100 text-violet-700",
  },
};

export default function FeedCard({
  item,
}: FeedCardProps) {
  const badge = badgeMap[item.type];

  return (
    <Card
      className="
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

        <MoreHorizontal
          size={18}
          className="text-slate-400"
        />

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
          text-slate-500
          leading-7
        "
      >
        {item.summary}
      </p>

      {/* Cover */}

      {item.cover && (
        <img
          src={item.cover}
          alt={item.title}
          className="
            mt-6
            h-52
            w-full
            rounded-2xl
            object-cover
          "
        />
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

          border-t

          pt-5
        "
      >
        <div className="flex items-center gap-6">

          <div className="flex items-center gap-2 text-slate-500">

            <FavoriteButton
                size={20}
            />

            {item.likes}

          </div>

          <div className="flex items-center gap-2 text-slate-500">

            <MessageCircle
                size={18}
                className="
                    cursor-pointer
                    transition-all
                    duration-200
                    hover:text-blue-600"/>

            {item.comments}

          </div>

          <div className="flex items-center gap-2 text-slate-500">

            <Eye
              size={18}
              className="
                  transition-colors
                  hover:text-slate-800"/>

            {item.views}

          </div>

        </div>

        <button
          className="
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