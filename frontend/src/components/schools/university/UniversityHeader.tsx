"use client";

import Image from "next/image";
import {
  MapPin,
  Globe,
  Star,
  GraduationCap,
  Heart,
  Share2,
  ExternalLink,
  Landmark,
  Coins,
  School,
} from "lucide-react";

export default function UniversityHeader() {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-slate-900
      "
    >
      {/* Cover */}

      <div className="relative h-[460px]">

        <Image
          src="/images/university/university01.jpg"
          alt="东京大学"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div
          className="
            absolute
            inset-0

            bg-gradient-to-t

            from-slate-950

            via-slate-950/55

            to-transparent
          "
        />

      </div>

      {/* Top Buttons */}

      <div
        className="
          absolute
          right-8
          top-8

          flex
          gap-3
        "
      >
        <button
          className="
            flex
            h-12
            w-12

            items-center
            justify-center

            rounded-full

            bg-white/15

            text-white

            backdrop-blur

            transition

            hover:bg-white/25
          "
        >
          <Heart size={20} />
        </button>

        <button
          className="
            flex
            h-12
            w-12

            items-center
            justify-center

            rounded-full

            bg-white/15

            text-white

            backdrop-blur

            transition

            hover:bg-white/25
          "
        >
          <Share2 size={20} />
        </button>

        <button
          className="
            flex
            h-12
            w-12

            items-center
            justify-center

            rounded-full

            bg-white/15

            text-white

            backdrop-blur

            transition

            hover:bg-white/25
          "
        >
          <ExternalLink size={20} />
        </button>
      </div>

      {/* Bottom */}

      <div
        className="
          absolute
          bottom-0
          left-0

          w-full

          p-10
        "
      >
        {/* Tags */}

        <div className="mb-6 flex flex-wrap gap-3">

          <span className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white">
            国立大学
          </span>

          <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm text-white">
            QS #28
          </span>

          <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm text-white">
            偏差值 72
          </span>

          <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm text-white">
            EJU 必须
          </span>

          <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm text-white">
            JLPT N1
          </span>

        </div>

        {/* Title */}

        <h1
          className="
            text-6xl
            font-black
            text-white
          "
        >
          东京大学
        </h1>

        <p
          className="
            mt-3
            text-xl
            text-slate-200
          "
        >
          The University of Tokyo
        </p>

        {/* Info */}

        <div
          className="
            mt-8

            flex
            flex-wrap

            gap-8

            text-white/90
          "
        >
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            东京 · 文京区
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap size={18} />
            本科 / 大学院
          </div>

          <div className="flex items-center gap-2">
            <Globe size={18} />
            国际招生
          </div>
        </div>

        {/* Stats */}

        <div
          className="
            mt-10

            grid

            gap-5

            md:grid-cols-3

            xl:grid-cols-6
          "
        >
          {[
            {
              icon: <Landmark size={18} />,
              title: "学校性质",
              value: "国立",
            },
            {
              icon: <Coins size={18} />,
              title: "学费",
              value: "53.5万",
            },
            {
              icon: <School size={18} />,
              title: "创立",
              value: "1877",
            },
            {
              icon: <Star size={18} />,
              title: "QS",
              value: "#28",
            },
            {
              icon: <GraduationCap size={18} />,
              title: "留学生",
              value: "4600+",
            },
            {
              icon: <Globe size={18} />,
              title: "官网",
              value: "Official",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="
                rounded-2xl

                border
                border-white/10

                bg-white/10

                p-5

                backdrop-blur
              "
            >
              <div className="flex items-center gap-2 text-slate-300">
                {item.icon}
                <span className="text-sm">
                  {item.title}
                </span>
              </div>

              <h3
                className="
                  mt-3

                  text-2xl

                  font-black

                  text-white
                "
              >
                {item.value}
              </h3>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}