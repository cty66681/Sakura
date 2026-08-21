"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  GraduationCap,
  Globe,
  Landmark,
  Star,
  Coins,
} from "lucide-react";

interface UniversityCardProps {
  id: string;
  name: string;
  image: string;
  location: string;
  type: string;
  qs: number;
  hensachi: number;
  tuition: string;
  eju: boolean;
  rating: number;
  tags: string[];
}

export default function UniversityCard({
  id,
  name,
  image,
  location,
  type,
  qs,
  hensachi,
  tuition,
  eju,
  rating,
  tags,
}: UniversityCardProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="flex">

        {/* 图片 */}

        <div className="relative h-[260px] w-[320px] shrink-0">

          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />

        </div>

        {/* 内容 */}

        <div className="flex flex-1 flex-col justify-between p-8">

          <div>

            <div className="flex items-center gap-3">

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                {type}
              </span>

              <div className="flex items-center gap-1 text-slate-500">

                <MapPin size={14} />

                {location}

              </div>

            </div>

            <h2 className="mt-4 text-4xl font-black">
              {name}
            </h2>

            <div className="mt-6 grid grid-cols-4 gap-6">

              <Info
                icon={<Globe size={18} />}
                label="QS"
                value={`#${qs}`}
              />

              <Info
                icon={<GraduationCap size={18} />}
                label="偏差值"
                value={String(hensachi)}
              />

              <Info
                icon={<Landmark size={18} />}
                label="EJU"
                value={eju ? "需要" : "无需"}
              />

              <Info
                icon={<Coins size={18} />}
                label="学费"
                value={tuition}
              />

            </div>

            <div className="mt-6 flex flex-wrap gap-3">

              {tags.map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1
                    text-sm
                  "
                >
                  {tag}
                </span>
              ))}

            </div>

          </div>

          <div className="mt-8 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Star
                size={18}
                className="fill-yellow-400 text-yellow-400"
              />

              <span className="text-lg font-bold">
                {rating}
              </span>

            </div>

            <Link
              href={`/schools/university/${id}`}
              className="
                rounded-2xl
                bg-blue-600
                px-8
                py-4
                font-bold
                text-white
                transition
                hover:bg-blue-700
              "
            >
              查看详情
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center gap-2 text-slate-400">

        {icon}

        <span className="text-sm">
          {label}
        </span>

      </div>

      <div className="font-bold text-lg">
        {value}
      </div>

    </div>
  );
}