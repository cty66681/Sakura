"use client";

import { MapPin, Eye, Clock } from "lucide-react";

export interface HouseInfoProps {
  title: string;
  location: string;
  publishTime: string;
  views: number;
}

export default function HouseInfo({
  title,
  location,
  publishTime,
  views,
}: HouseInfoProps) {
  return (
    <div className="space-y-5">

      <h1
        className="
          text-4xl
          font-bold
          leading-tight
          text-slate-900
        "
      >
        {title}
      </h1>

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-6

          text-sm
          text-slate-500
        "
      >
        <div className="flex items-center gap-2">
          <MapPin size={18} />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span>{publishTime}</span>
        </div>

        <div className="flex items-center gap-2">
          <Eye size={18} />
          <span>{views} 次浏览</span>
        </div>
      </div>

    </div>
  );
}