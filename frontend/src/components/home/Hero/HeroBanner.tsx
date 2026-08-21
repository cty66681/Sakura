"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Star,
} from "lucide-react";

import { heroBanners } from "@/data/heroBanner";

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setCurrent(
      (current - 1 + heroBanners.length) % heroBanners.length
    );
  };

  const next = () => {
    setCurrent(
      (current + 1) % heroBanners.length
    );
  };

  const banner = heroBanners[current];

  return (
    <div
      className="
        relative
        h-[300px]
        w-full
        overflow-hidden
        rounded-[36px]
        border
        border-white/10
        shadow-[0_40px_80px_rgba(0,0,0,.35)]
      "
    >
      {/* Image */}

      <Image
        src={banner.image}
        alt={banner.title}
        fill
        priority
        className="
          object-cover
          transition-all
          duration-700
          hover:scale-105
        "
      />

      {/* Overlay */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-r

          from-black/80

          via-black/35

          to-black/15
        "
      />

      {/* Badge */}

      <span
        className="
          absolute
          top-3
          left-8

          z-30

          rounded-full

          bg-blue-500/25

          px-3
          py-1

          text-xs
          font-semibold
          tracking-wide

          text-sky-200

          backdrop-blur
        "
      >
        推荐学校
      </span>

      {/* Content */}

      <div
        className="
          absolute
          inset-0

          flex
          flex-col
          justify-end

          pl-15
          px-9
          pr-10
          pb-8
          pt-14

          text-white
        "
      >
      <h2
        className="
          mt-5
          text-[38px]
          font-black
          leading-tight
        "
      >
        {banner.title}
      </h2>

        <div
          className="
            mt-3

            flex

            items-center

            gap-4

            text-sm

            text-white/90
          "
        >
          <div className="flex items-center gap-1">
            <Star
              size={15}
              fill="#facc15"
              className="text-yellow-400"
            />
            <span>4.9</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin size={15} />
            东京 · 新宿
          </div>
        </div>

        <p className="mt-3 text-sm text-blue-200 ">
          2027年4月招生
        </p>
        <p
          className="
            mt-4

            max-w-sm

            text-sm

            leading-7

            text-white/80
          "
        >
          {banner.subtitle}
        </p>

        <button
          className="
            mt-7

            inline-flex
            w-fit

            items-center

            gap-2

            rounded-full

            bg-white

            px-6
            py-3

            font-semibold

            text-slate-900

            transition-all

            duration-300

            hover:scale-105

            hover:bg-blue-600

            hover:text-white
          "
        >
          {banner.button}

          <ArrowRight size={18} />
        </button>
      </div>

      {/* Left */}

      <button
        onClick={prev}
        className="
          absolute

          left-0
          top-1/2

          flex

          h-12
          w-12

          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          border
          border-white/20

          bg-black/20

          text-white

          backdrop-blur-xl

          transition-all

          duration-300

          hover:scale-110

          hover:bg-white/20
        "
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right */}

      <button
        onClick={next}
        className="
          absolute

          right-5
          top-1/2

          flex

          h-12
          w-12

          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          border
          border-white/20

          bg-black/20

          text-white

          backdrop-blur-xl

          transition-all

          duration-300

          hover:scale-110

          hover:bg-white/20
        "
      >
        <ChevronRight size={22} />
      </button>

      {/* Pagination */}

      <div
        className="
          absolute

          bottom-6

          left-1/2

          flex

          -translate-x-1/2

          gap-2
        "
      >
        {heroBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 rounded-full ${
              index === current
                ? "h-[5px] w-10 bg-white"
                : "h-[5px] w-5 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}