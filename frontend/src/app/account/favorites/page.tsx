"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Languages,
  Search,
  School,
  Trash2,
} from "lucide-react";
import {
  type ReactNode,
  useMemo,
  useState,
} from "react";

import Container from "@/components/layout/Container";

type FavoriteType =
  | "job"
  | "house"
  | "experience"
  | "language"
  | "university"
  | "college";

type FilterType =
  | "all"
  | "job"
  | "house"
  | "experience"
  | "school";

interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  description: string;
  meta: string;
  extra?: string;
  href: string;
  savedAt: string;
}

const LANGUAGE_FAVORITE_KEY =
  "sakura-language-school-favorites";

const UNIVERSITY_FAVORITE_KEY =
  "sakura-university-favorites";

const COLLEGE_FAVORITE_KEY =
  "sakura-college-favorites";

const LANGUAGE_FAVORITE_EVENT =
  "sakura-language-school-favorite-change";

const UNIVERSITY_FAVORITE_EVENT =
  "sakura-university-favorite-change";

const COLLEGE_FAVORITE_EVENT =
  "sakura-college-favorite-change";

/*
 * 当前工作 / 房源 / 经验收藏暂时使用页面级 Mock。
 *
 * TODO [API - GET]
 * GET /api/me/favorites
 * Purpose:
 * Load current user's favorites across jobs,
 * houses, experiences and schools.
 *
 * Backend should derive current user from session.
 */
const mockFavorites: FavoriteItem[] = [
  {
    id: "job-mercari-backend",
    type: "job",
    title: "Java Backend Engineer",
    description:
      "Mercari · 后端开发 / 正社员",
    meta: "东京 · 涩谷",
    extra: "¥700,000～¥900,000 / 月",
    href: "/jobs/1",
    savedAt: "2026-08-31",
  },
  {
    id: "house-tokyo-001",
    type: "house",
    title: "新宿区 1LDK 公寓",
    description:
      "交通便利，距离车站步行约 6 分钟。",
    meta: "东京 · 新宿",
    extra: "¥128,000 / 月",
    href: "/houses/1",
    savedAt: "2026-08-29",
  },
  {
    id: "experience-001",
    type: "experience",
    title: "第一次在日本租房，我踩过的几个坑",
    description:
      "从看房、初期费用到退房，整理一些实际经历。",
    meta: "生活经验",
    extra: "东京",
    href: "/experience/1",
    savedAt: "2026-08-27",
  },
];

const schoolCatalog: FavoriteItem[] = [
  /*
   * 这里暂时作为收藏页的学校展示目录。
   *
   * 后续学校真实数据接入 API 后，
   * 应根据收藏 ID 请求对应学校信息，
   * 不应长期在收藏页重复维护学校数据。
   *
   * TODO [API - GET]
   * GET /api/me/favorites?type=school
   * Purpose:
   * Return favorited school records
   * for current logged-in user.
   */
];

const filters: {
  value: FilterType;
  label: string;
}[] = [
  {
    value: "all",
    label: "全部",
  },
  {
    value: "job",
    label: "工作",
  },
  {
    value: "house",
    label: "房源",
  },
  {
    value: "experience",
    label: "经验",
  },
  {
    value: "school",
    label: "学校",
  },
];

export default function FavoritesPage() {
  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");

  const [keyword, setKeyword] =
    useState("");

  const [removedIds, setRemovedIds] =
    useState<Set<string>>(
      () => new Set()
    );

  /*
   * 学校收藏目前继续兼容现有三个学校模块的
   * localStorage 收藏结构。
   *
   * 使用 useState initializer，
   * 不使用 useEffect 同步复制派生状态。
   */
  const [schoolFavoriteIds, setSchoolFavoriteIds] =
    useState<{
      language: string[];
      university: string[];
      college: string[];
    }>(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return {
          language: [],
          university: [],
          college: [],
        };
      }

      return {
        language:
          readFavoriteIds(
            LANGUAGE_FAVORITE_KEY
          ),
        university:
          readFavoriteIds(
            UNIVERSITY_FAVORITE_KEY
          ),
        college:
          readFavoriteIds(
            COLLEGE_FAVORITE_KEY
          ),
      };
    });

  const schoolFavorites =
    useMemo(() => {
      const favoriteSets = {
        language: new Set(
          schoolFavoriteIds.language
        ),
        university: new Set(
          schoolFavoriteIds.university
        ),
        college: new Set(
          schoolFavoriteIds.college
        ),
      };

      return schoolCatalog.filter(
        (item) => {
          if (
            item.type === "language"
          ) {
            return favoriteSets.language.has(
              getOriginalId(item.id)
            );
          }

          if (
            item.type ===
            "university"
          ) {
            return favoriteSets.university.has(
              getOriginalId(item.id)
            );
          }

          if (
            item.type === "college"
          ) {
            return favoriteSets.college.has(
              getOriginalId(item.id)
            );
          }

          return false;
        }
      );
    }, [schoolFavoriteIds]);

  const allFavorites =
    useMemo(() => {
      return [
        ...mockFavorites.filter(
          (item) =>
            !removedIds.has(
              item.id
            )
        ),
        ...schoolFavorites,
      ];
    }, [
      removedIds,
      schoolFavorites,
    ]);

  const counts =
    useMemo(() => {
      return {
        all: allFavorites.length,
        job: allFavorites.filter(
          (item) =>
            item.type === "job"
        ).length,
        house: allFavorites.filter(
          (item) =>
            item.type === "house"
        ).length,
        experience:
          allFavorites.filter(
            (item) =>
              item.type ===
              "experience"
          ).length,
        school: allFavorites.filter(
          (item) =>
            isSchoolType(
              item.type
            )
        ).length,
      };
    }, [allFavorites]);

  const filteredFavorites =
    useMemo(() => {
      const normalizedKeyword =
        keyword.trim().toLowerCase();

      return allFavorites.filter(
        (item) => {
          const matchesType =
            activeFilter === "all" ||
            item.type ===
              activeFilter ||
            (activeFilter ===
              "school" &&
              isSchoolType(
                item.type
              ));

          if (!matchesType) {
            return false;
          }

          if (
            !normalizedKeyword
          ) {
            return true;
          }

          const searchable =
            [
              item.title,
              item.description,
              item.meta,
              item.extra ?? "",
              getTypeLabel(
                item.type
              ),
            ]
              .join(" ")
              .toLowerCase();

          return searchable.includes(
            normalizedKeyword
          );
        }
      );
    }, [
      activeFilter,
      allFavorites,
      keyword,
    ]);

  function removeFavorite(
    item: FavoriteItem
  ) {
    if (
      item.type === "language"
    ) {
      removeSchoolFavorite(
        item,
        LANGUAGE_FAVORITE_KEY,
        LANGUAGE_FAVORITE_EVENT,
        "language"
      );
      return;
    }

    if (
      item.type ===
      "university"
    ) {
      removeSchoolFavorite(
        item,
        UNIVERSITY_FAVORITE_KEY,
        UNIVERSITY_FAVORITE_EVENT,
        "university"
      );
      return;
    }

    if (
      item.type === "college"
    ) {
      removeSchoolFavorite(
        item,
        COLLEGE_FAVORITE_KEY,
        COLLEGE_FAVORITE_EVENT,
        "college"
      );
      return;
    }

    setRemovedIds(
      (current) => {
        const next =
          new Set(current);

        next.add(item.id);

        return next;
      }
    );

    // TODO [API - DELETE]
    // DELETE /api/me/favorites/:favoriteId
    // Purpose:
    // Permanently remove current user's favorite.
    // Backend must verify current authenticated user.
  }

  function removeSchoolFavorite(
    item: FavoriteItem,
    storageKey: string,
    eventName: string,
    type:
      | "language"
      | "university"
      | "college"
  ) {
    const originalId =
      getOriginalId(item.id);

    const current =
      readFavoriteIds(
        storageKey
      );

    const next =
      current.filter(
        (id) =>
          id !== originalId
      );

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(next)
    );

    window.dispatchEvent(
      new Event(eventName)
    );

    setSchoolFavoriteIds(
      (currentState) => ({
        ...currentState,
        [type]: next,
      })
    );

    // TODO [API - DELETE]
    // DELETE /api/me/favorites/:favoriteId
    // Purpose:
    // Remove school favorite after account-based
    // favorites replace localStorage.
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section
        className="
          border-b
          border-slate-800
          bg-slate-950
        "
      >
        <Container>
          <div
            className="
              px-4
              py-9
              sm:py-11
            "
          >
            <Link
              href="/account"
              className="
                inline-flex
                min-h-10
                items-center
                gap-2
                text-xs
                font-black
                text-slate-400
                transition
                hover:text-white
              "
            >
              ← 返回账户中心
            </Link>

            <div
              className="
                mt-5
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div>
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-rose-400/20
                    bg-rose-400/10
                    px-3
                    py-1.5
                    text-xs
                    font-black
                    text-rose-300
                  "
                >
                  <Heart
                    size={14}
                    fill="currentColor"
                  />
                  FAVORITES
                </div>

                <h1
                  className="
                    mt-4
                    text-2xl
                    font-black
                    tracking-tight
                    text-white
                    sm:text-3xl
                  "
                >
                  我的收藏
                </h1>

                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-slate-400
                  "
                >
                  集中查看你收藏的工作、房源、
                  经验和学校信息。
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-white/10
                    text-rose-300
                  "
                >
                  <Heart
                    size={18}
                    fill="currentColor"
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-slate-500
                    "
                  >
                    SAVED
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    {counts.all}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTENT */}

      <section className="py-7 sm:py-9">
        <Container>
          <div className="px-4">
            {/* SUMMARY */}

            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-4
              "
            >
              <SummaryCard
                icon={
                  <BriefcaseBusiness
                    size={18}
                  />
                }
                label="工作"
                value={counts.job}
              />

              <SummaryCard
                icon={
                  <Home size={18} />
                }
                label="房源"
                value={counts.house}
              />

              <SummaryCard
                icon={
                  <FileText
                    size={18}
                  />
                }
                label="经验"
                value={
                  counts.experience
                }
              />

              <SummaryCard
                icon={
                  <GraduationCap
                    size={18}
                  />
                }
                label="学校"
                value={counts.school}
              />
            </div>

            {/* FILTERS */}

            <div
              className="
                mt-6
                rounded-[24px]
                border
                border-slate-200
                bg-white
                p-3
                shadow-sm
                sm:p-4
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >
                <div
                  className="
                    -mx-1
                    flex
                    gap-2
                    overflow-x-auto
                    px-1
                    pb-1
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {filters.map(
                    (filter) => {
                      const active =
                        activeFilter ===
                        filter.value;

                      return (
                        <button
                          key={
                            filter.value
                          }
                          type="button"
                          onClick={() =>
                            setActiveFilter(
                              filter.value
                            )
                          }
                          className={`
                            inline-flex
                            min-h-11
                            shrink-0
                            items-center
                            gap-2
                            rounded-xl
                            px-4
                            py-2.5
                            text-xs
                            font-black
                            transition
                            ${
                              active
                                ? "bg-slate-950 text-white"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }
                          `}
                        >
                          {
                            filter.label
                          }

                          <span
                            className={`
                              rounded-full
                              px-2
                              py-0.5
                              text-[10px]
                              ${
                                active
                                  ? "bg-white/10 text-white"
                                  : "bg-white text-slate-400"
                              }
                            `}
                          >
                            {
                              counts[
                                filter.value
                              ]
                            }
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>

                <div
                  className="
                    relative
                    w-full
                    lg:max-w-xs
                  "
                >
                  <Search
                    size={16}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="search"
                    value={keyword}
                    maxLength={80}
                    onChange={(
                      event
                    ) =>
                      setKeyword(
                        event.target
                          .value
                      )
                    }
                    placeholder="搜索我的收藏"
                    className="
                      min-h-11
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      py-2.5
                      pl-11
                      pr-4
                      text-sm
                      font-semibold
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-slate-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-slate-100
                    "
                  />
                </div>
              </div>
            </div>

            {/* LIST */}

            <div className="mt-6">
              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-4
                "
              >
                <div>
                  <h2
                    className="
                      text-lg
                      font-black
                      text-slate-950
                    "
                  >
                    {getFilterTitle(
                      activeFilter
                    )}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      font-semibold
                      text-slate-400
                    "
                  >
                    找到{" "}
                    {
                      filteredFavorites.length
                    }{" "}
                    条收藏
                  </p>
                </div>
              </div>

              {filteredFavorites.length >
              0 ? (
                <div
                  className="
                    mt-4
                    grid
                    gap-4
                    lg:grid-cols-2
                  "
                >
                  {filteredFavorites.map(
                    (item) => (
                      <FavoriteCard
                        key={
                          item.id
                        }
                        item={item}
                        onRemove={() =>
                          removeFavorite(
                            item
                          )
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <EmptyState
                  hasKeyword={
                    keyword.trim()
                      .length > 0
                  }
                  activeFilter={
                    activeFilter
                  }
                  onClear={() => {
                    setKeyword("");
                    setActiveFilter(
                      "all"
                    );
                  }}
                />
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function FavoriteCard({
  item,
  onRemove,
}: {
  item: FavoriteItem;
  onRemove: () => void;
}) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
      "
    >
      <div className="p-5 sm:p-6">
        <div
          className="
            flex
            items-start
            gap-4
          "
        >
          <div
            className={`
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${getIconClass(
                item.type
              )}
            `}
          >
            {item.type ===
              "job" && (
              <BriefcaseBusiness
                size={19}
              />
            )}

            {item.type ===
              "house" && (
              <Building2
                size={19}
              />
            )}

            {item.type ===
              "experience" && (
              <FileText
                size={19}
              />
            )}

            {item.type ===
              "language" && (
              <Languages
                size={19}
              />
            )}

            {item.type ===
              "university" && (
              <GraduationCap
                size={19}
              />
            )}

            {item.type ===
              "college" && (
              <School
                size={19}
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <div className="min-w-0">
                <span
                  className={`
                    inline-flex
                    rounded-full
                    px-2.5
                    py-1
                    text-[10px]
                    font-black
                    ${getBadgeClass(
                      item.type
                    )}
                  `}
                >
                  {getTypeLabel(
                    item.type
                  )}
                </span>

                <Link
                  href={item.href}
                  className="
                    mt-3
                    block
                    text-base
                    font-black
                    leading-6
                    text-slate-950
                    transition
                    group-hover:text-blue-700
                    sm:text-lg
                  "
                >
                  {item.title}
                </Link>
              </div>

              <button
                type="button"
                onClick={onRemove}
                aria-label={`取消收藏 ${item.title}`}
                title="取消收藏"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-rose-50
                  text-rose-600
                  transition
                  hover:bg-rose-100
                "
              >
                <Heart
                  size={17}
                  fill="currentColor"
                />
              </button>
            </div>

            <p
              className="
                mt-3
                line-clamp-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              {item.description}
            </p>

            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
                text-xs
                font-bold
                text-slate-500
              "
            >
              <span>
                {item.meta}
              </span>

              {item.extra && (
                <span className="text-slate-800">
                  {item.extra}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-slate-100
          bg-slate-50/70
          px-5
          py-3
          sm:px-6
        "
      >
        <span
          className="
            text-[10px]
            font-bold
            text-slate-400
          "
        >
          收藏于{" "}
          {formatDate(
            item.savedAt
          )}
        </span>

        <Link
          href={item.href}
          className="
            inline-flex
            min-h-10
            items-center
            gap-1
            rounded-lg
            px-2
            text-xs
            font-black
            text-slate-700
            transition
            hover:bg-white
            hover:text-slate-950
          "
        >
          查看详情
          <ChevronRight
            size={14}
          />
        </Link>
      </div>
    </article>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        sm:p-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-600
          "
        >
          {icon}
        </div>

        <span
          className="
            text-xl
            font-black
            text-slate-950
          "
        >
          {value}
        </span>
      </div>

      <p
        className="
          mt-3
          text-xs
          font-black
          text-slate-500
        "
      >
        {label}
      </p>
    </div>
  );
}

function EmptyState({
  hasKeyword,
  activeFilter,
  onClear,
}: {
  hasKeyword: boolean;
  activeFilter: FilterType;
  onClear: () => void;
}) {
  return (
    <div
      className="
        mt-4
        flex
        min-h-[320px]
        flex-col
        items-center
        justify-center
        rounded-[26px]
        border
        border-dashed
        border-slate-300
        bg-white
        px-6
        py-12
        text-center
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-rose-50
          text-rose-500
        "
      >
        <Heart size={23} />
      </div>

      <h3
        className="
          mt-4
          text-base
          font-black
          text-slate-950
        "
      >
        {hasKeyword
          ? "没有找到匹配的收藏"
          : activeFilter ===
              "all"
            ? "还没有收藏内容"
            : `还没有收藏的${getFilterTitle(
                activeFilter
              )}`}
      </h3>

      <p
        className="
          mt-2
          max-w-sm
          text-xs
          leading-6
          text-slate-500
        "
      >
        {hasKeyword
          ? "换一个关键词试试看，或者清除当前筛选条件。"
          : "看到有用的信息时点击爱心，之后就可以在这里快速找到。"}
      </p>

      {(hasKeyword ||
        activeFilter !==
          "all") && (
        <button
          type="button"
          onClick={onClear}
          className="
            mt-5
            inline-flex
            min-h-11
            items-center
            justify-center
            rounded-xl
            bg-slate-950
            px-5
            py-3
            text-sm
            font-black
            text-white
            transition
            hover:bg-slate-800
          "
        >
          清除筛选
        </button>
      )}

      {!hasKeyword &&
        activeFilter ===
          "all" && (
          <Link
            href="/"
            className="
              mt-5
              inline-flex
              min-h-11
              items-center
              justify-center
              rounded-xl
              bg-slate-950
              px-5
              py-3
              text-sm
              font-black
              text-white
              transition
              hover:bg-slate-800
            "
          >
            去首页看看
          </Link>
        )}
    </div>
  );
}

function isSchoolType(
  type: FavoriteType
) {
  return (
    type === "language" ||
    type === "university" ||
    type === "college"
  );
}

function getOriginalId(
  id: string
) {
  const separatorIndex =
    id.indexOf(":");

  if (separatorIndex === -1) {
    return id;
  }

  return id.slice(
    separatorIndex + 1
  );
}

function readFavoriteIds(
  key: string
): string[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        key
      );

    if (!stored) {
      return [];
    }

    const parsed: unknown =
      JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (
        item
      ): item is string =>
        typeof item ===
        "string"
    );
  } catch {
    return [];
  }
}

function getTypeLabel(
  type: FavoriteType
) {
  switch (type) {
    case "job":
      return "工作";

    case "house":
      return "房源";

    case "experience":
      return "经验";

    case "language":
      return "语言学校";

    case "university":
      return "大学 / 大学院";

    case "college":
      return "专门学校";
  }
}

function getFilterTitle(
  type: FilterType
) {
  switch (type) {
    case "all":
      return "全部收藏";

    case "job":
      return "工作";

    case "house":
      return "房源";

    case "experience":
      return "经验";

    case "school":
      return "学校";
  }
}

function getIconClass(
  type: FavoriteType
) {
  switch (type) {
    case "job":
      return "bg-blue-50 text-blue-600";

    case "house":
      return "bg-amber-50 text-amber-600";

    case "experience":
      return "bg-violet-50 text-violet-600";

    case "language":
      return "bg-emerald-50 text-emerald-600";

    case "university":
      return "bg-indigo-50 text-indigo-600";

    case "college":
      return "bg-orange-50 text-orange-600";
  }
}

function getBadgeClass(
  type: FavoriteType
) {
  switch (type) {
    case "job":
      return "bg-blue-50 text-blue-700";

    case "house":
      return "bg-amber-50 text-amber-700";

    case "experience":
      return "bg-violet-50 text-violet-700";

    case "language":
      return "bg-emerald-50 text-emerald-700";

    case "university":
      return "bg-indigo-50 text-indigo-700";

    case "college":
      return "bg-orange-50 text-orange-700";
  }
}

function formatDate(
  value: string
) {
  return value.replaceAll(
    "-",
    "."
  );
}