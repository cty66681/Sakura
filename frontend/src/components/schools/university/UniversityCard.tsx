"use client";

import {
  useCallback,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Star,
  Globe2,
  GraduationCap,
} from "lucide-react";

type Props = {
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
  href?: string;
};

const FAVORITE_KEY = "sakura-university-favorites";

const FAVORITE_EVENT =
  "sakura-university-favorite-change";

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
  href,
}: Props) {

  const detailHref =
  href ??
  `/schools/university/${id}`;
  
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

      return favorites.includes(id);
    } catch {
      return false;
    }
  }, [id]);

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

  /* =========================================================
     收藏 / 取消收藏
  ========================================================= */

  const handleFavorite = () => {
    try {
      const saved =
        localStorage.getItem(FAVORITE_KEY);

      let favorites: string[] = saved
        ? JSON.parse(saved)
        : [];

      if (favorites.includes(id)) {
        favorites = favorites.filter(
          (schoolId) =>
            schoolId !== id
        );
      } else {
        favorites = [
          ...favorites,
          id,
        ];
      }

      localStorage.setItem(
        FAVORITE_KEY,
        JSON.stringify(favorites)
      );

      /*
        localStorage 在当前标签页不会触发 storage，
        所以主动发送自定义事件。
      */

      window.dispatchEvent(
        new CustomEvent(
          FAVORITE_EVENT,
          {
            detail: {
              id,
              favorite:
                favorites.includes(id),
            },
          }
        )
      );
    } catch {
      return;
    }
  };

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-xl
        hover:shadow-slate-200/60
      "
    >
      <div className="grid md:grid-cols-[300px_1fr]">

        {/* 图片 */}

        <Link
          href={detailHref}
          className="
            relative
            block
            min-h-[280px]
            overflow-hidden
            bg-slate-100
          "
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/35
              via-transparent
              to-transparent
            "
          />

          <div className="absolute left-5 top-5">
            <span
              className="
                rounded-full
                border
                border-white/20
                bg-black/40
                px-3
                py-1.5
                text-xs
                font-bold
                text-white
                backdrop-blur-md
              "
            >
              {type}
            </span>
          </div>
        </Link>

        {/* 内容 */}

        <div className="relative flex min-w-0 flex-col p-7">

          {/* 收藏 */}

          <button
            type="button"
            onClick={handleFavorite}
            aria-label={
              favorite
                ? `取消收藏 ${name}`
                : `收藏 ${name}`
            }
            title={
              favorite
                ? "取消收藏"
                : "收藏学校"
            }
            className={`
              absolute
              right-6
              top-6
              z-10
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              transition-all
              active:scale-90
              ${
                favorite
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-slate-200 bg-white text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
              }
            `}
          >
            <Heart
              size={19}
              className={
                favorite
                  ? "fill-current"
                  : ""
              }
            />
          </button>

          {/* 标题 */}

          <div className="pr-14">
            <Link
              href={detailHref}
              className="
                inline-block
                text-2xl
                font-black
                text-slate-900
                transition
                hover:text-blue-600
              "
            >
              {name}
            </Link>

            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-2
                text-sm
                text-slate-500
              "
            >
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {location}
              </span>

              <span className="flex items-center gap-1.5">
                <Star
                  size={16}
                  className="fill-amber-400 text-amber-400"
                />
                {rating}
              </span>
            </div>
          </div>

          {/* 数据 */}

          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-3
              lg:grid-cols-4
            "
          >
            <InfoBox
              icon={
                <Globe2 size={16} />
              }
              label="QS"
              value={`#${qs}`}
            />

            <InfoBox
              icon={
                <GraduationCap
                  size={16}
                />
              }
              label="偏差值"
              value={String(hensachi)}
            />

            <InfoBox
              label="EJU"
              value={
                eju
                  ? "需要"
                  : "无需"
              }
            />

            <InfoBox
              label="学费"
              value={tuition}
              small
            />
          </div>

          {/* 标签 */}

          <div className="mt-6 flex flex-wrap gap-2">
            {tags
              .slice(0, 5)
              .map((tag) => (
                <span
                  key={tag}
                  className="
                    rounded-lg
                    bg-slate-100
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-slate-600
                  "
                >
                  {tag}
                </span>
              ))}

            {tags.length > 5 && (
              <span
                className="
                  rounded-lg
                  bg-slate-100
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                +{tags.length - 5}
              </span>
            )}
          </div>

          {/* 底部 */}

          <div
            className="
              mt-auto
              flex
              items-center
              justify-between
              gap-4
              border-t
              border-slate-100
              pt-6
            "
          >
            <div className="text-xs text-slate-400">
              点击查看学校详细信息
            </div>

            <Link
              href={detailHref}
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-bold
                text-white
                transition
                hover:bg-blue-700
                active:scale-[0.98]
              "
            >
              查看详情
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoBox({
  icon,
  label,
  value,
  small = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-100
        bg-slate-50
        px-3
        py-3
      "
    >
      <div
        className="
          flex
          items-center
          gap-1.5
          text-[11px]
          font-medium
          text-slate-400
        "
      >
        {icon}
        {label}
      </div>

      <div
        className={`
          mt-1.5
          font-black
          text-slate-900
          ${
            small
              ? "text-xs"
              : "text-sm"
          }
        `}
      >
        {value}
      </div>
    </div>
  );
}