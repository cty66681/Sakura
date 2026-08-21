"use client";

import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  Star,
  Globe,
  Heart,
  Share2,
  BadgeCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

interface Props {
  id: string;
}

export default function LanguageSchoolHeader({
  id,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-slate-950">

      {/* Background */}

      <div className="absolute inset-0">

        <div
          className="
            absolute
            -left-32
            -top-24
            h-96
            w-96
            rounded-full
            bg-blue-600/20
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-0
            top-10
            h-[420px]
            w-[420px]
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

      </div>

      <Container>

        <div className="relative py-14">

          {/* 返回 */}

          <Link
            href="/schools/language"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/5
              px-4
              py-2
              text-sm
              text-slate-300
              transition
              hover:border-blue-400
              hover:text-white
            "
          >
            <ArrowLeft size={16} />

            返回语言学校
          </Link>

          {/* 主体 */}

          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:justify-between">

            {/* 左 */}

            <div className="flex flex-1 gap-6">

              {/* Logo */}

              <div
                className="
                  flex
                  h-28
                  w-28
                  shrink-0
                  items-center
                  justify-center
                  rounded-3xl
                  bg-gradient-to-br
                  from-blue-500
                  to-cyan-500
                  text-white
                  shadow-2xl
                "
              >

                <GraduationCap size={48} />

              </div>

              {/* 信息 */}

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <span
                    className="
                      rounded-full
                      bg-blue-500/20
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-blue-300
                    "
                  >
                    语言学校
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-emerald-500/20
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-emerald-300
                    "
                  >
                    官方认证
                  </span>

                </div>

                <h1
                  className="
                    mt-5
                    text-5xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  东京国际文化学院
                </h1>

                <p className="mt-3 text-lg text-slate-300">
                  Tokyo International Language School
                </p>

                {/* 信息 */}

                <div className="mt-7 flex flex-wrap gap-6 text-sm">

                  <div className="flex items-center gap-2 text-slate-300">

                    <MapPin
                      size={18}
                      className="text-blue-400"
                    />

                    东京 · 新宿区

                  </div>

                  <div className="flex items-center gap-2 text-slate-300">

                    <Globe
                      size={18}
                      className="text-cyan-400"
                    />

                    支持留学生

                  </div>

                  <div className="flex items-center gap-2">

                    <Star
                      size={18}
                      className="
                        fill-yellow-400
                        text-yellow-400
                      "
                    />

                    <span className="font-semibold text-white">
                      4.8
                    </span>

                    <span className="text-slate-400">
                      (326条评价)
                    </span>

                  </div>

                </div>

                {/* Tags */}

                <div className="mt-8 flex flex-wrap gap-3">

                  {[
                    "N2升学",
                    "签证率高",
                    "宿舍",
                    "中国人友好",
                    "EJU",
                    "JLPT",
                  ].map((item) => (

                    <span
                      key={item}
                      className="
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        px-4
                        py-2
                        text-sm
                        text-slate-300
                      "
                    >
                      {item}
                    </span>

                  ))}

                </div>

              </div>

            </div>

            {/* 右 */}

            <div
              className="
                w-full
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-6
                backdrop-blur
                lg:w-80
              "
            >

              <div className="space-y-4">

                <Button className="w-full h-12 text-base">
                  我要报名
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12"
                >
                  官网链接
                </Button>

              </div>

              <div className="mt-8 space-y-4">

                <button
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-3
                    text-slate-300
                    transition
                    hover:border-blue-400
                  "
                >
                  <Heart size={18} />
                  收藏学校
                </button>

                <button
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-3
                    text-slate-300
                    transition
                    hover:border-blue-400
                  "
                >
                  <Share2 size={18} />
                  分享学校
                </button>

              </div>

              <div
                className="
                  mt-8
                  rounded-2xl
                  bg-blue-500/10
                  p-4
                "
              >

                <div className="flex items-center gap-2">

                  <BadgeCheck
                    size={18}
                    className="text-blue-400"
                  />

                  <span className="font-semibold text-blue-300">
                    AI 推荐
                  </span>

                </div>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  非常适合希望进入日本大学、
                  大学院或专门学校的留学生，
                  学校管理规范，
                  中国学生比例适中，
                  升学率较高。
                </p>

              </div>

            </div>

          </div>

        </div>

      </Container>

    </section>
  );
}