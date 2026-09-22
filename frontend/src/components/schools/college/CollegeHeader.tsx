"use client";

import {
  useCallback,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  ExternalLink,
  Heart,
  MapPin,
  Share2,
  Star,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export type CollegeHeaderData = {
  id: string;

  name: string;
  englishName: string;

  location: string;

  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";

  rating: number;
  employmentRate: number;

  internationalSupport: boolean;
  chineseSupport: boolean;
  visaSupport: boolean;

  recommended: boolean;

  website: string;

  tags: string[];
};

interface Props {
  school: CollegeHeaderData;
  returnHref?: string;
}

const FAVORITE_KEY =
  "sakura-college-favorites";

const FAVORITE_EVENT =
  "sakura-college-favorite-change";

export default function CollegeHeader({
  school,
  returnHref = "/schools/college",
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

  const toggleFavorite = () => {
    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST / DELETE]
    |--------------------------------------------------------------------------
    |
    | 收藏：
    |
    | POST /api/colleges/:id/favorite
    |
    | 取消收藏：
    |
    | DELETE /api/colleges/:id/favorite
    |
    | 当前使用 localStorage。
    |
    |--------------------------------------------------------------------------
    */

    try {
      const saved =
        localStorage.getItem(
          FAVORITE_KEY
        );

      let favorites: string[] =
        saved
          ? JSON.parse(saved)
          : [];

      if (
        favorites.includes(
          school.id
        )
      ) {
        favorites =
          favorites.filter(
            (id) =>
              id !== school.id
          );
      } else {
        favorites.push(
          school.id
        );
      }

      localStorage.setItem(
        FAVORITE_KEY,
        JSON.stringify(
          favorites
        )
      );

      const nextFavorite =
        favorites.includes(
          school.id
        );


      window.dispatchEvent(
        new CustomEvent(
          FAVORITE_EVENT,
          {
            detail: {
              id: school.id,
              favorite:
                nextFavorite,
            },
          }
        )
      );
    } catch {
      return;
    }
  };

  const handleShare = async () => {
    const url =
      window.location.href;

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title: school.name,
          text: `${school.name}｜Sakura 专门学校`,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // 用户主动取消分享时无需处理
    }
  };

  const openWebsite = () => {
    if (!school.website) {
      return;
    }

    window.open(
      school.website,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background */}

      <div className="absolute inset-0">
        <div
          className="
            absolute
            -left-32
            top-0
            h-[420px]
            w-[420px]
            rounded-full
            bg-orange-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-0
            top-20
            h-[380px]
            w-[380px]
            rounded-full
            bg-amber-400/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_70%_20%,rgba(249,115,22,0.10),transparent_35%)]
          "
        />
      </div>

      <Container>
        <div className="relative py-10 lg:py-14">
          {/* Back */}

          <Link
            href={returnHref}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-400
              transition
              hover:text-white
            "
          >
            <ArrowLeft
              size={17}
            />

            返回专门学校
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            {/* Left */}

            <div className="min-w-0">
              {/* Badges */}

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-orange-400/20
                    bg-orange-400/10
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-orange-300
                  "
                >
                  <BriefcaseBusiness
                    size={14}
                  />

                  {school.category}
                </span>

                {school.recommended && (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-emerald-400/20
                      bg-emerald-400/10
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-emerald-300
                    "
                  >
                    <BadgeCheck
                      size={14}
                    />

                    Sakura 推荐
                  </span>
                )}

                {school.visaSupport && (
                  <span
                    className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-slate-300
                    "
                  >
                    留学签证支持
                  </span>
                )}
              </div>

              {/* Name */}

              <h1
                className="
                  mt-5
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {school.name}
              </h1>

              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                {school.englishName}
              </p>

              {/* Meta */}

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={17}
                    className="text-orange-400"
                  />

                  {school.location}
                </div>

                <div className="flex items-center gap-2">
                  <Star
                    size={17}
                    className="fill-amber-400 text-amber-400"
                  />

                  <span className="font-bold text-white">
                    {school.rating.toFixed(
                      1
                    )}
                  </span>

                  <span className="text-slate-500">
                    学生评分
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BriefcaseBusiness
                    size={17}
                    className="text-emerald-400"
                  />

                  <span className="font-bold text-white">
                    {
                      school.employmentRate
                    }
                    %
                  </span>

                  <span className="text-slate-500">
                    就业率
                  </span>
                </div>
              </div>

              {/* Tags */}

              <div className="mt-6 flex flex-wrap gap-2">
                {school.tags.map(
                  (tag) => (
                    <span
                      key={tag}
                      className="
                        rounded-lg
                        border
                        border-white/10
                        bg-white/5
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-slate-300
                      "
                    >
                      {tag}
                    </span>
                  )
                )}

                {school.chineseSupport && (
                  <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    中文支持
                  </span>
                )}

                {school.internationalSupport && (
                  <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                    留学生支持
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button
                type="button"
                onClick={
                  toggleFavorite
                }
                className={`
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  px-5
                  text-sm
                  font-semibold
                  transition
                  ${
                    favorite
                      ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
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
                  : "收藏"}
              </button>

              <button
                type="button"
                onClick={
                  handleShare
                }
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-white/10
                "
              >
                <Share2
                  size={18}
                />

                {copied
                  ? "链接已复制"
                  : "分享"}
              </button>

              <Button
                onClick={
                  openWebsite
                }
                className="
                  h-12
                  bg-orange-500
                  px-5
                  text-white
                  hover:bg-orange-600
                "
              >
                <ExternalLink
                  size={18}
                  className="mr-2"
                />

                官方网站
              </Button>
            </div>
          </div>

          {/* Bottom navigation */}

          <div
            className="
              mt-10
              flex
              gap-1
              overflow-x-auto
              border-t
              border-white/10
              pt-5
            "
          >
            <HeaderAnchor
              href="#info"
              label="学校介绍"
            />

            <HeaderAnchor
              href="#course"
              label="专业学科"
            />

            <HeaderAnchor
              href="#tuition"
              label="学费"
            />

            <HeaderAnchor
              href="#employment"
              label="就业情况"
            />

            <HeaderAnchor
              href="#gallery"
              label="学校环境"
            />

            <HeaderAnchor
              href="#review"
              label="学生评价"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function HeaderAnchor({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="
        whitespace-nowrap
        rounded-lg
        px-4
        py-2
        text-sm
        font-medium
        text-slate-400
        transition
        hover:bg-white/5
        hover:text-orange-300
      "
    >
      {label}
    </a>
  );
}