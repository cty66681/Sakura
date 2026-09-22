"use client";

import {
  useCallback,
  useState,
  useSyncExternalStore,
} from "react";
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
  Check,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export type LanguageSchoolHeaderData = {
  id: string;
  name: string;
  englishName: string;
  location: string;
  type: "升学型" | "综合型" | "就业型";
  rating: number;
  foreignerRating: number;
  risk: "低风险" | "需要注意";
  chineseSupport: boolean;
  universitySupport: boolean;
  graduateSupport: boolean;
  visaSupport: boolean;
  website: string;
  tags: string[];
};

interface Props {
  school: LanguageSchoolHeaderData;
  returnHref?: string;
}

const FAVORITE_KEY = "sakura-language-school-favorites";
const FAVORITE_EVENT = "sakura-language-school-favorite-change";

export default function LanguageSchoolHeader({
  school,
  returnHref = "/schools/language",
}: Props) {
  
  const subscribeFavorite =
  useCallback(
    (
      onStoreChange: () => void
    ) => {
      const handleFavoriteChange =
        () => {
          onStoreChange();
        };

      const handleStorage = (
        event: StorageEvent
      ) => {
        if (
          event.key ===
          FAVORITE_KEY
        ) {
          onStoreChange();
        }
      };

      window.addEventListener(
        FAVORITE_EVENT,
        handleFavoriteChange
      );

      window.addEventListener(
        "storage",
        handleStorage
      );

      return () => {
        window.removeEventListener(
          FAVORITE_EVENT,
          handleFavoriteChange
        );

        window.removeEventListener(
          "storage",
          handleStorage
        );
      };
    },
    []
  );

const getFavoriteSnapshot =
  useCallback(() => {
    try {
      const saved =
        localStorage.getItem(
          FAVORITE_KEY
        );

      if (!saved) {
        return false;
      }

      const favorites: string[] =
        JSON.parse(saved);

      return favorites.includes(
        school.id
      );
    } catch {
      return false;
    }
  }, [school.id]);

const getFavoriteServerSnapshot =
  useCallback(
    () => false,
    []
  );

const favorite =
  useSyncExternalStore(
    subscribeFavorite,
    getFavoriteSnapshot,
    getFavoriteServerSnapshot
  );

const [copied, setCopied] =
  useState(false);

  const handleFavorite = () => {
    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST / DELETE]
    |--------------------------------------------------------------------------
    |
    | 收藏：
    |
    | POST /api/language-schools/:id/favorite
    |
    | 取消收藏：
    |
    | DELETE /api/language-schools/:id/favorite
    |
    | 现在暂时使用 localStorage。
    |
    |--------------------------------------------------------------------------
    */

    try {
      const saved = localStorage.getItem(FAVORITE_KEY);

      let favorites: string[] = saved
        ? JSON.parse(saved)
        : [];

      if (favorites.includes(school.id)) {
        favorites = favorites.filter(
          (id) => id !== school.id
        );
      } else {
        favorites.push(school.id);
      }

      localStorage.setItem(
        FAVORITE_KEY,
        JSON.stringify(favorites)
      );

      const nextFavorite = favorites.includes(
        school.id
      );

      window.dispatchEvent(
        new CustomEvent(FAVORITE_EVENT, {
          detail: {
            id: school.id,
            favorite: nextFavorite,
          },
        })
      );
    } catch {
      return;
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: school.name,
          text: `查看 ${school.name} 的学校信息`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // 用户主动取消分享时不需要处理
    }
  };

  const handleWebsite = () => {
    if (!school.website) {
      return;
    }

    window.open(
      school.website,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const aiRecommendation = (() => {
    if (school.type === "就业型") {
      return "适合希望提升日语能力并以在日本就业为主要目标的学生。可以重点确认就业指导、企业介绍、签证支持以及毕业后的就业实绩。";
    }

    if (school.graduateSupport) {
      return "适合计划进入日本大学或大学院继续升学的留学生。可以重点关注升学指导、EJU、JLPT、研究计划书以及面试辅导。";
    }

    if (school.universitySupport) {
      return "适合以日本大学或专门学校升学为主要目标的留学生。建议结合学费、地区、升学指导和留学生支持进行比较。";
    }

    return "适合希望系统学习日语并体验日本生活的学生。建议结合课程方向、学费、地区和留学生支持综合判断。";
  })();

  const displayTags = Array.from(
    new Set([
      school.type,
      ...school.tags,
      ...(school.chineseSupport
        ? ["中文支持"]
        : []),
      ...(school.visaSupport
        ? ["签证支持"]
        : []),
    ])
  ).slice(0, 6);

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
            bg-emerald-600/20
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
            href={returnHref}
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
              hover:border-emerald-400
              hover:text-white
            "
          >
            <ArrowLeft size={16} />

            返回语言学校
          </Link>

          {/* 主体 */}

          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:justify-between">
            {/* 左 */}

            <div className="flex flex-1 flex-col gap-6 sm:flex-row">
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
                  from-emerald-500
                  to-cyan-500
                  text-white
                  shadow-2xl
                "
              >
                <GraduationCap size={48} />
              </div>

              {/* 信息 */}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
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
                    {school.type}
                  </span>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${
                        school.risk === "低风险"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-orange-500/20 text-orange-300"
                      }
                    `}
                  >
                    {school.risk === "低风险"
                      ? "🟢 低风险"
                      : "🟡 需要注意"}
                  </span>
                </div>

                <h1
                  className="
                    mt-5
                    text-4xl
                    font-black
                    tracking-tight
                    text-white
                    sm:text-5xl
                  "
                >
                  {school.name}
                </h1>

                <p className="mt-3 text-lg text-slate-300">
                  {school.englishName}
                </p>

                {/* 信息 */}

                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin
                      size={18}
                      className="text-emerald-400"
                    />

                    {school.location}
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <Globe
                      size={18}
                      className="text-cyan-400"
                    />

                    {school.visaSupport
                      ? "支持留学生 · 签证支持"
                      : "支持留学生"}
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
                      {school.rating.toFixed(1)}
                    </span>

                    <span className="text-slate-400">
                      综合评分
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-400">
                      外国人友好度
                    </span>

                    <span className="font-semibold text-white">
                      {school.foreignerRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Tags */}

                <div className="mt-8 flex flex-wrap gap-3">
                  {displayTags.map((item) => (
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
                {/*
                  TODO [API - POST]

                  正式报名功能：

                  POST /api/language-schools/:id/applications

                  目前先进入 Sakura 报名页面。
                */}

                <Link
                  href={`/schools/apply?schoolId=${encodeURIComponent(
                    school.id
                  )}&schoolName=${encodeURIComponent(
                    school.name
                  )}&type=language`}
                  className="block"
                >
                  <Button className="h-12 w-full text-base">
                    我要报名
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="h-12 w-full"
                  onClick={handleWebsite}
                >
                  官网链接
                </Button>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  onClick={handleFavorite}
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    border
                    px-4
                    py-3
                    transition
                    ${
                      favorite
                        ? "border-rose-400/40 bg-rose-500/10 text-rose-300"
                        : "border-white/10 text-slate-300 hover:border-emerald-400"
                    }
                  `}
                >
                  <Heart
                    size={18}
                    className={
                      favorite
                        ? "fill-current"
                        : ""
                    }
                  />

                  {favorite
                    ? "已收藏"
                    : "收藏学校"}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
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
                    hover:border-emerald-400
                  "
                >
                  {copied ? (
                    <Check
                      size={18}
                      className="text-emerald-400"
                    />
                  ) : (
                    <Share2 size={18} />
                  )}

                  {copied
                    ? "链接已复制"
                    : "分享学校"}
                </button>
              </div>

              <div
                className="
                  mt-8
                  rounded-2xl
                  bg-emerald-500/10
                  p-4
                "
              >
                <div className="flex items-center gap-2">
                  <BadgeCheck
                    size={18}
                    className="text-emerald-400"
                  />

                  <span className="font-semibold text-emerald-300">
                    AI 推荐
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {aiRecommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}