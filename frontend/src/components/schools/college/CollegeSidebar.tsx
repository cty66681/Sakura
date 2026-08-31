"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  ExternalLink,
  GraduationCap,
  Heart,
  ImageIcon,
  Languages,
  MessageSquare,
  ReceiptText,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type CollegeSidebarData = {
  id: string;
  name: string;
  website: string;

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
};

interface Props {
  school: CollegeSidebarData;
}

const FAVORITE_KEY =
  "sakura-college-favorites";

const FAVORITE_EVENT =
  "sakura-college-favorite-change";

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 登录用户收藏状态：
|
| GET /api/users/me/favorites/colleges
|
| 当前使用 localStorage。
|
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| TODO [API - POST]
|--------------------------------------------------------------------------
|
| 提交入学咨询 / 申请：
|
| POST /api/colleges/:id/applications
|
| 当前先跳转：
|
| /schools/apply
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - POST]
|--------------------------------------------------------------------------
|
| 在线咨询：
|
| POST /api/colleges/:id/inquiries
|
| Body 示例：
|
| {
|   type: "online-consultation";
| }
|
| 当前只使用本地状态模拟。
|
|--------------------------------------------------------------------------
*/

export default function CollegeSidebar({
  school,
}: Props) {
  const [favorite, setFavorite] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [consulting, setConsulting] =
    useState(false);

  const syncFavorite =
    useCallback(() => {
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
          favorites.includes(
            school.id
          )
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
        event.key ===
        FAVORITE_KEY
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
        (current) => !current
      );
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
      // 用户取消分享时无需处理
    }
  };

  const handleConsult = () => {
    setConsulting(true);

    window.setTimeout(() => {
      setConsulting(false);
    }, 2500);
  };

  const aiScore =
    getAiScore(school);

  const applyHref =
    `/schools/apply?schoolId=${encodeURIComponent(
      school.id
    )}` +
    `&schoolName=${encodeURIComponent(
      school.name
    )}` +
    `&type=college`;

  return (
    <aside className="self-start lg:sticky lg:top-24">
      <div className="space-y-5">
        {/* Main CTA */}

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-300">
              <GraduationCap
                size={17}
              />

              专门学校
            </div>

            <h2 className="mt-3 text-xl font-black leading-8">
              {school.name}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {school.category}
            </p>

            {/* AI Score */}

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Sparkles
                    size={17}
                    className="text-orange-400"
                  />

                  Sakura AI 参考评分
                </div>

                <span className="text-xl font-black text-orange-300">
                  {aiScore}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{
                    width: `${aiScore}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                根据评分、就业率及留学生支持生成的开发阶段参考值。
              </p>
            </div>
          </div>

          <div className="p-5">
            {/* Apply */}

            <Link
              href={applyHref}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-orange-500
                px-5
                text-sm
                font-bold
                text-white
                transition
                hover:bg-orange-600
              "
            >
              <GraduationCap
                size={18}
              />

              申请 / 咨询学校
            </Link>

            {/* Consult */}

            <button
              type="button"
              onClick={
                handleConsult
              }
              disabled={
                consulting
              }
              className="
                mt-3
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-orange-200
                bg-orange-50
                px-5
                text-sm
                font-bold
                text-orange-700
                transition
                hover:bg-orange-100
                disabled:cursor-not-allowed
              "
            >
              <MessageSquare
                size={18}
              />

              {consulting
                ? "咨询请求已记录"
                : "在线咨询"}
            </button>

            {/* Favorite / Share */}

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={
                  toggleFavorite
                }
                className={`
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  text-sm
                  font-semibold
                  transition
                  ${
                    favorite
                      ? "border-rose-200 bg-rose-50 text-rose-600"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                <Heart
                  size={17}
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
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  font-semibold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                "
              >
                <Share2
                  size={17}
                />

                {copied
                  ? "已复制"
                  : "分享"}
              </button>
            </div>

            {/* Website */}

            <a
              href={
                school.website
              }
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-3
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                font-semibold
                text-slate-600
                transition
                hover:border-orange-200
                hover:text-orange-600
              "
            >
              <ExternalLink
                size={17}
              />

              查看官方网站
            </a>
          </div>
        </div>

        {/* Quick Info */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">
            学校参考
          </h3>

          <div className="mt-4 space-y-4">
            <InfoRow
              label="学生评分"
              value={`${school.rating.toFixed(
                1
              )} / 5.0`}
            />

            <InfoRow
              label="就业率"
              value={`${school.employmentRate}%`}
            />

            <InfoRow
              label="专业领域"
              value={
                school.category
              }
            />

            <InfoRow
              label="Sakura 推荐"
              value={
                school.recommended
                  ? "推荐"
                  : "普通"
              }
            />
          </div>
        </div>

        {/* International Support */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Languages
              size={18}
              className="text-orange-500"
            />

            <h3 className="font-bold text-slate-900">
              留学生支持
            </h3>
          </div>

          <div className="mt-4 space-y-3">
            <SupportRow
              active={
                school.internationalSupport
              }
              label="留学生支持"
            />

            <SupportRow
              active={
                school.chineseSupport
              }
              label="中文咨询"
            />

            <SupportRow
              active={
                school.visaSupport
              }
              label="签证相关支持"
            />
          </div>
        </div>

        {/* Navigation */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            页面导航
          </p>

          <nav className="mt-3 space-y-1">
            <SidebarAnchor
              href="#info"
              icon={
                <BookOpen
                  size={17}
                />
              }
              label="学校介绍"
            />

            <SidebarAnchor
              href="#course"
              icon={
                <GraduationCap
                  size={17}
                />
              }
              label="专业学科"
            />

            <SidebarAnchor
              href="#tuition"
              icon={
                <ReceiptText
                  size={17}
                />
              }
              label="学费信息"
            />

            <SidebarAnchor
              href="#employment"
              icon={
                <BriefcaseBusiness
                  size={17}
                />
              }
              label="就业情况"
            />

            <SidebarAnchor
              href="#gallery"
              icon={
                <ImageIcon
                  size={17}
                />
              }
              label="学校环境"
            />

            <SidebarAnchor
              href="#review"
              icon={
                <MessageSquare
                  size={17}
                />
              }
              label="学生评价"
            />
          </nav>
        </div>

        {/* Safety Notice */}

        <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-orange-600"
            />

            <div>
              <p className="font-bold text-orange-900">
                报名前建议确认
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-600">
                请重点确认具体学科、
                年度总费用、招生条件、
                留学生就业实绩以及毕业后工作签证对应情况。
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}

function SupportRow({
  active,
  label,
}: {
  active: boolean;
  label: string;
}) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        gap-3
        rounded-xl
        px-3
        py-3
        ${
          active
            ? "bg-emerald-50"
            : "bg-slate-50"
        }
      `}
    >
      <span
        className={
          active
            ? "text-sm font-semibold text-emerald-800"
            : "text-sm font-medium text-slate-500"
        }
      >
        {label}
      </span>

      <BadgeCheck
        size={17}
        className={
          active
            ? "text-emerald-600"
            : "text-slate-300"
        }
      />
    </div>
  );
}

function SidebarAnchor({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        font-medium
        text-slate-600
        transition
        hover:bg-orange-50
        hover:text-orange-700
      "
    >
      <span className="text-orange-500">
        {icon}
      </span>

      {label}
    </a>
  );
}

/*
|--------------------------------------------------------------------------
| MOCK AI Score
|--------------------------------------------------------------------------
|
| 后续如果 Sakura AI 推荐系统独立成服务：
|
| TODO [API - GET]
|
| GET /api/colleges/:id/ai-score
|
|--------------------------------------------------------------------------
*/

function getAiScore(
  school: CollegeSidebarData
) {
  let score = 70;

  score +=
    school.rating * 3;

  score +=
    (school.employmentRate -
      90) *
    0.8;

  if (
    school.internationalSupport
  ) {
    score += 3;
  }

  if (
    school.chineseSupport
  ) {
    score += 2;
  }

  if (school.visaSupport) {
    score += 2;
  }

  if (school.recommended) {
    score += 3;
  }

  return Math.min(
    98,
    Math.max(
      70,
      Math.round(score)
    )
  );
}