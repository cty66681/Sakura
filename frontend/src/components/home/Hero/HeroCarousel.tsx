"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CarouselItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const items: CarouselItem[] = [
  {
    id: 1,
    title: "东京国际文化学院",
    subtitle: "2027年4月生 · 火热招生中",
    image: "/images/schools/1.jpg",
    href: "/schools/language/1",
  },
  {
    id: 2,
    title: "ISI日本语学校",
    subtitle: "热门学校 · 推荐指数★★★★★",
    image: "/images/schools/2.jpg",
    href: "/schools/language/2",
  },
  {
    id: 3,
    title: "ECC日本语学院",
    subtitle: "最新奖学金公布",
    image: "/images/schools/3.jpg",
    href: "/schools/language/3",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((v) => (v + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const item = items[current];

  return (
    <div
      className="
        relative

        h-[430px]
        w-full

        overflow-hidden

        rounded-[36px]

        border
        border-white/40

        bg-white

        shadow-[0_35px_80px_rgba(15,23,42,.18)]
      "
    >
      {/* 图片 */}

      <img
        src={item.image}
        alt={item.title}
        className="
          absolute
          inset-0

          h-full
          w-full

          object-cover

          transition-all
          duration-700
        "
      />

      {/* 黑色渐变 */}

      <div
        className="
          absolute
          inset-0

          bg-gradient-to-t
          from-black/80
          via-black/20
          to-transparent
        "
      />

      {/* 顶部标签 */}

      <div
        className="
          absolute
          left-7
          top-7
        "
      >
        <div
          className="
            rounded-full

            bg-white/15

            px-4
            py-2

            backdrop-blur-xl

            text-sm
            font-semibold

            text-white
          "
        >
          🔥 今日推荐
        </div>
      </div>

      {/* 内容 */}

      <div
        className="
          absolute

          bottom-8

          left-8

          right-8
        "
      >
        <p
          className="
            text-blue-200

            text-sm

            font-semibold
          "
        >
          推荐学校
        </p>

        <h2
          className="
            mt-3

            text-[36px]

            font-black

            leading-tight

            text-white
          "
        >
          {item.title}
        </h2>

        <p
          className="
            mt-3

            text-base

            text-slate-200
          "
        >
          {item.subtitle}
        </p>

        <Link
          href={item.href}
          className="
            mt-8

            inline-flex

            items-center

            gap-2

            rounded-full

            bg-white

            px-6

            py-3.5

            font-semibold

            text-slate-900

            transition-all

            hover:scale-105

            hover:shadow-xl
          "
        >
          查看学校

          <ArrowRight size={18} />
        </Link>
      </div>

      {/* 左右按钮 */}

      <button
        onClick={() =>
          setCurrent(
            current === 0
              ? items.length - 1
              : current - 1
          )
        }
        className="
          absolute

          left-6

          top-1/2

          -translate-y-1/2

          flex

          h-12
          w-12

          items-center
          justify-center

          rounded-full

          bg-black/25

          text-white

          backdrop-blur-xl

          transition

          hover:bg-black/45
        "
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() =>
          setCurrent(
            (current + 1) % items.length
          )
        }
        className="
          absolute

          right-6

          top-1/2

          -translate-y-1/2

          flex

          h-12
          w-12

          items-center
          justify-center

          rounded-full

          bg-black/25

          text-white

          backdrop-blur-xl

          transition

          hover:bg-black/45
        "
      >
        <ChevronRight />
      </button>

      {/* 指示器 */}

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
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 ${
              current === index
                ? "h-2.5 w-9 rounded-full bg-white"
                : "h-2.5 w-2.5 rounded-full bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}