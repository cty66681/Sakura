"use client";

import { MapPin } from "lucide-react";

export interface HouseMapProps {
  location: string;
}

export default function HouseMap({
  location,
}: HouseMapProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
      "
    >
      <div className="p-6">

        <h2
          className="
            mb-4
            text-lg
            font-semibold
            text-slate-900
          "
        >
          地图位置
        </h2>

        <div
          className="
            flex
            items-center
            gap-2
            text-slate-600
          "
        >
          <MapPin size={18} />

          <span>{location}</span>
        </div>

      </div>

      <div
        className="
          flex
          h-[350px]
          items-center
          justify-center
          bg-slate-100
          text-slate-500
        "
      >
        Google Map
      </div>
    </div>
  );
}