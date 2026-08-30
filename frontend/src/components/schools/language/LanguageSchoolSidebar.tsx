"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ExternalLink,
  Globe,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card/Card";

export type LanguageSchoolSidebarData = {
  id: string;
  name: string;
  type: "升学型" | "综合型" | "就业型";

  website: string;

  rating: number;
  foreignerRating: number;

  risk: "低风险" | "需要注意";

  chineseSupport: boolean;
  universitySupport: boolean;
  graduateSupport: boolean;
  visaSupport: boolean;
};

interface Props {
  school: LanguageSchoolSidebarData;
}

const FAVORITE_KEY =
  "sakura-language-school-favorites";

const FAVORITE_EVENT =
  "sakura-language-school-favorite-change";

export default function LanguageSchoolSidebar({
  school,
}: Props) {
  const [favorite, setFavorite] =
    useState(false);

  const [consulting, setConsulting] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | TODO [API - GET]
  |--------------------------------------------------------------------------
  |
  | 用户系统完成后：
  |
  | GET /api/users/me/favorites/language-schools
  |
  | 用于读取当前用户是否已经收藏该学校。
  |
  | 当前使用 localStorage。
  |
  |--------------------------------------------------------------------------
  */

  const syncFavorite = useCallback(() => {
    try {
      const saved =
        localStorage.getItem(
          FAVORITE_KEY
        );

      if (!saved) {
        setFavorite(false);
        return;
      }

      const favorites: string[] =
        JSON.parse(saved);

      setFavorite(
        favorites.includes(school.id)
      );
    } catch {
      setFavorite(false);
    }
  }, [school.id]);

  useEffect(() => {
    syncFavorite();

    const handleFavoriteChange =
      () => {
        syncFavorite();
      };

    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key === FAVORITE_KEY
      ) {
        syncFavorite();
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
  }, [syncFavorite]);

  const toggleFavorite = () => {
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

      setFavorite(
        nextFavorite
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
      setFavorite(
        (value) => !value
      );
    }
  };

  const handleConsult = () => {
    /*
    |--------------------------------------------------------------------------
    | TODO [API - POST]
    |--------------------------------------------------------------------------
    |
    | 在线咨询功能：
    |
    | POST /api/language-schools/:id/inquiries
    |
    | 请求示例：
    |
    | {
    |   schoolId,
    |   userId,
    |   category,
    |   message
    | }
    |
    | 后期可以接：
    |
    | Sakura 站内咨询
    | 学校后台
    | 合作机构后台
    | 邮件通知
    |
    |--------------------------------------------------------------------------
    */

    setConsulting(true);

    window.setTimeout(() => {
      setConsulting(false);
    }, 2000);
  };

  const aiScore =
    calculateAiScore(
      school
    );

  const aiLabel =
    aiScore >= 90
      ? "非常推荐"
      : aiScore >= 80
        ? "推荐"
        : aiScore >= 70
          ? "可以考虑"
          : "建议详细比较";

  const recommendations =
    getRecommendations(
      school
    );

  return (
    <aside className="sticky top-24 h-fit space-y-6">
      {/* 页面导航 */}

      <Card className="rounded-3xl p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          页面导航
        </p>

        <nav className="mt-4 space-y-1">
          <SidebarAnchor
            href="#info"
            label="学校介绍"
          />

          <SidebarAnchor
            href="#course"
            label="课程设置"
          />

          <SidebarAnchor
            href="#tuition"
            label="学费信息"
          />

          <SidebarAnchor
            href="#dormitory"
            label="学生宿舍"
          />

          <SidebarAnchor
            href="#gallery"
            label="学校环境"
          />

          <SidebarAnchor
            href="#review"
            label="学生评价"
          />
        </nav>
      </Card>

      {/* 报名 */}

      <Card className="rounded-3xl p-6">
        <h3 className="text-xl font-bold text-slate-900">
          快速申请
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-500">
          对{" "}
          <span className="font-semibold text-slate-700">
            {school.name}
          </span>{" "}
          感兴趣？可以先提交申请意向，
          后期接入学校或合作机构后直接处理。
        </p>

        {/*
        |--------------------------------------------------------------------------
        | TODO [API - POST]
        |--------------------------------------------------------------------------
        |
        | 正式报名：
        |
        | POST /api/language-schools/:id/applications
        |
        | body 示例：
        |
        | {
        |   userId,
        |   intake,
        |   courseId,
        |   japaneseLevel,
        |   message
        | }
        |
        |--------------------------------------------------------------------------
        */}

        <Link
          href={`/schools/apply?schoolId=${encodeURIComponent(
            school.id
          )}&schoolName=${encodeURIComponent(
            school.name
          )}&type=language`}
          className="mt-6 block"
        >
          <Button className="h-12 w-full">
            我要报名
          </Button>
        </Link>

        <Button
          variant="outline"
          className="mt-3 h-12 w-full"
          onClick={() => {
            if (
              school.website
            ) {
              window.open(
                school.website,
                "_blank",
                "noopener,noreferrer"
              );
            }
          }}
        >
          <ExternalLink
            size={18}
            className="mr-2"
          />

          官网查看
        </Button>
      </Card>

      {/* AI */}

      <Card className="rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <Sparkles
            size={18}
            className="text-emerald-600"
          />

          <h3 className="font-bold text-slate-900">
            Sakura AI 推荐
          </h3>
        </div>

        <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
          {recommendations.map(
            (item) => (
              <p key={item}>
                ✓ {item}
              </p>
            )
          )}
        </div>

        <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
          <div className="flex items-center gap-2">
            <BadgeCheck
              size={18}
              className="text-emerald-600"
            />

            <span className="font-semibold text-emerald-700">
              AI 推荐指数
            </span>
          </div>

          <div className="mt-3 text-4xl font-black text-emerald-600">
            {aiScore}
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {aiLabel}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${aiScore}%`,
              }}
            />
          </div>
        </div>

        {/*
        |--------------------------------------------------------------------------
        | TODO [API - GET / POST]
        |--------------------------------------------------------------------------
        |
        | 后期真正的 AI 学校推荐：
        |
        | GET /api/language-schools/:id/ai-score
        |
        | 或根据当前用户条件实时计算：
        |
        | POST /api/ai/school-match
        |
        | body 示例：
        |
        | {
        |   schoolId,
        |   japaneseLevel,
        |   budget,
        |   target,
        |   preferredRegion,
        |   desiredIntake
        | }
        |
        | 返回：
        |
        | {
        |   score,
        |   reasons,
        |   warnings,
        |   matchedConditions
        | }
        |
        |--------------------------------------------------------------------------
        */}
      </Card>

      {/* 联系 */}

      <Card className="rounded-3xl p-6">
        <h3 className="font-bold text-slate-900">
          联系学校
        </h3>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={
              handleConsult
            }
            disabled={
              consulting
            }
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              text-slate-700
              transition
              hover:border-emerald-300
              hover:bg-emerald-50
              disabled:cursor-wait
              disabled:opacity-60
            "
          >
            <MessageCircle
              size={18}
            />

            {consulting
              ? "正在提交..."
              : "在线咨询"}
          </button>

          <button
            type="button"
            onClick={
              toggleFavorite
            }
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
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
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
            onClick={() => {
              if (
                school.website
              ) {
                window.open(
                  school.website,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              px-4
              py-3
              text-slate-700
              transition
              hover:border-emerald-300
              hover:bg-emerald-50
            "
          >
            <Globe
              size={18}
            />

            官方网站
          </button>
        </div>
      </Card>
    </aside>
  );
}

function SidebarAnchor({
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
        block
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-medium
        text-slate-600
        transition
        hover:bg-emerald-50
        hover:text-emerald-700
      "
    >
      {label}
    </a>
  );
}

function calculateAiScore(
  school: LanguageSchoolSidebarData
) {
  let score = 68;

  score += Math.round(
    school.rating * 3
  );

  score += Math.round(
    school.foreignerRating * 2
  );

  if (
    school.risk === "低风险"
  ) {
    score += 5;
  }

  if (
    school.chineseSupport
  ) {
    score += 2;
  }

  if (
    school.universitySupport
  ) {
    score += 2;
  }

  if (
    school.graduateSupport
  ) {
    score += 2;
  }

  if (
    school.visaSupport
  ) {
    score += 2;
  }

  return Math.min(
    99,
    score
  );
}

function getRecommendations(
  school: LanguageSchoolSidebarData
) {
  const items: string[] = [];

  if (
    school.type ===
    "就业型"
  ) {
    items.push(
      "在日就业"
    );
  } else {
    items.push(
      "长期留学"
    );
  }

  if (
    school.universitySupport
  ) {
    items.push(
      "大学升学"
    );
  }

  if (
    school.graduateSupport
  ) {
    items.push(
      "大学院升学"
    );
  }

  if (
    school.chineseSupport
  ) {
    items.push(
      "中文支持"
    );
  }

  if (
    school.visaSupport
  ) {
    items.push(
      "签证支持"
    );
  }

  return items.slice(0, 5);
}