"use client";

import Link from "next/link";
import {
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  BriefcaseBusiness,
  Building2,
  Clock3,
  FileText,
  GraduationCap,
  Home,
  MessageCircle,
  Newspaper,
  Plus,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";
import FeedCard, {
  type FeedItem,
} from "@/components/home/FeedSection/FeedCard";

import { feeds } from "@/data/feed";

type FeedType =
  | "all"
  | FeedItem["type"];

type SortType =
  | "latest"
  | "popular"
  | "comments";

interface FeedTab {
  value: FeedType;
  label: string;
}

const PAGE_SIZE = 8;

const tabs: FeedTab[] = [
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
    value: "school",
    label: "学校",
  },
  {
    value: "experience",
    label: "经验",
  },
  {
    value: "scam",
    label: "避坑",
  },
  {
    value: "news",
    label: "资讯",
  },
];

const sortOptions: {
  value: SortType;
  label: string;
}[] = [
  {
    value: "latest",
    label: "最新发布",
  },
  {
    value: "popular",
    label: "热门内容",
  },
  {
    value: "comments",
    label: "讨论最多",
  },
];

const hotKeywords = [
  "东京工作",
  "租房",
  "留学",
  "IT",
  "避坑",
  "永住",
];

export default function FeedPage() {
  const [activeType, setActiveType] =
    useState<FeedType>("all");

  const [keyword, setKeyword] =
    useState("");

  const [sort, setSort] =
    useState<SortType>("latest");

  const [page, setPage] =
    useState(1);

  const filteredFeeds =
    useMemo(() => {
      const query = keyword
        .trim()
        .toLowerCase();

      let result = [...feeds];

      if (activeType !== "all") {
        result = result.filter(
          (item) =>
            item.type === activeType
        );
      }

      if (query) {
        result = result.filter(
          (item) =>
            item.title
              .toLowerCase()
              .includes(query) ||
            item.summary
              .toLowerCase()
              .includes(query) ||
            item.description
              .toLowerCase()
              .includes(query) ||
            item.location
              ?.toLowerCase()
              .includes(query)
        );
      }

      if (sort === "popular") {
        result.sort(
          (a, b) =>
            b.views +
            b.likes * 3 -
            (a.views +
              a.likes * 3)
        );
      }

      if (sort === "comments") {
        result.sort(
          (a, b) =>
            b.comments -
            a.comments
        );
      }

      /*
       * 当前 mock 数据的 publishTime
       * 是展示文本，并不是标准 Date。
       *
       * 后端阶段应该直接按照 createdAt
       * DESC 返回最新内容。
       */

      return result;
    }, [
      activeType,
      keyword,
      sort,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredFeeds.length /
        PAGE_SIZE
    )
  );

  const safePage = Math.min(
    page,
    totalPages
  );

  const visibleFeeds =
    filteredFeeds.slice(
      (safePage - 1) *
        PAGE_SIZE,
      safePage * PAGE_SIZE
    );

  const hasFilter =
    activeType !== "all" ||
    keyword.trim().length > 0 ||
    sort !== "latest";

  function changeType(
    type: FeedType
  ) {
    setActiveType(type);
    setPage(1);
  }

  function changeSort(
    value: SortType
  ) {
    setSort(value);
    setPage(1);
  }

  function clearFilters() {
    setActiveType("all");
    setKeyword("");
    setSort("latest");
    setPage(1);
  }

  function applyKeyword(
    value: string
  ) {
    setKeyword(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section
        className="
          relative
          overflow-hidden
          bg-slate-950
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-[-160px]
            top-[-180px]
            h-[460px]
            w-[460px]
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[-120px]
            top-[-160px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-violet-500/10
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              py-10
              sm:py-14
              lg:py-16
            "
          >
            <div
              className="
                flex
                flex-col
                gap-7
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div className="max-w-2xl">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    px-3
                    py-2
                    text-[11px]
                    font-black
                    text-blue-300
                  "
                >
                  <Sparkles
                    size={14}
                  />
                  SAKURA COMMUNITY
                </div>

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
                  Sakura 动态
                </h1>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-sm
                    font-medium
                    leading-7
                    text-slate-400
                    sm:text-base
                  "
                >
                  看看今天在日华人都在关注什么。
                  工作、房源、学校、经验、避坑和日本生活资讯，
                  都集中在这里。
                </p>
              </div>

              <Link
                href="/account/publish"
                className="
                  inline-flex
                  min-h-12
                  w-fit
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-5
                  text-sm
                  font-black
                  text-slate-950
                  transition
                  hover:bg-blue-50
                "
              >
                <Plus size={17} />
                发布信息
              </Link>
            </div>

            {/* SEARCH */}

            <div
              className="
                mt-8
                max-w-2xl
              "
            >
              <div
                className="
                  flex
                  min-h-14
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  px-4
                  backdrop-blur
                  transition
                  focus-within:border-blue-400/50
                  focus-within:bg-white/[0.13]
                "
              >
                <Search
                  size={19}
                  className="
                    shrink-0
                    text-slate-400
                  "
                />

                <input
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(
                      event.target
                        .value
                    );
                    setPage(1);
                  }}
                  placeholder="搜索工作、房源、学校、经验、避坑..."
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-[16px]
                    font-semibold
                    text-white
                    outline-none
                    placeholder:text-slate-500
                  "
                />

                {keyword && (
                  <button
                    type="button"
                    aria-label="清空搜索"
                    onClick={() => {
                      setKeyword("");
                      setPage(1);
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      text-slate-400
                      transition
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    text-[10px]
                    font-bold
                    text-slate-500
                  "
                >
                  热门
                </span>

                {hotKeywords.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        applyKeyword(
                          item
                        )
                      }
                      className="
                        min-h-8
                        rounded-full
                        border
                        border-white/10
                        px-3
                        text-[10px]
                        font-bold
                        text-slate-400
                        transition
                        hover:border-white/20
                        hover:text-white
                      "
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTENT */}

      <section className="py-7 sm:py-10">
        <Container>
          <div className="px-4">
            {/* CATEGORY */}

            <div
              className="
                -mx-4
                overflow-x-auto
                px-4
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              <div
                className="
                  flex
                  min-w-max
                  gap-2
                  pb-1
                "
              >
                {tabs.map((tab) => {
                  const active =
                    activeType ===
                    tab.value;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() =>
                        changeType(
                          tab.value
                        )
                      }
                      className={`
                        inline-flex
                        min-h-11
                        items-center
                        gap-2
                        rounded-full
                        px-4
                        text-sm
                        font-black
                        transition
                        ${
                          active
                            ? "bg-slate-950 text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }
                      `}
                    >
                      <FeedTypeIcon
                        type={
                          tab.value
                        }
                      />

                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TOOLBAR */}

            <div
              className="
                mt-6
                flex
                flex-col
                gap-4
                border-b
                border-slate-200
                pb-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <TrendingUp
                    size={17}
                    className="text-blue-600"
                  />

                  <h2
                    className="
                      text-lg
                      font-black
                      text-slate-950
                    "
                  >
                    社区最新动态
                  </h2>
                </div>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-400
                  "
                >
                  找到
                  <span
                    className="
                      mx-1
                      font-black
                      text-slate-700
                    "
                  >
                    {
                      filteredFeeds.length
                    }
                  </span>
                  条内容
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <SlidersHorizontal
                  size={15}
                  className="
                    shrink-0
                    text-slate-400
                  "
                />

                <select
                  value={sort}
                  onChange={(
                    event
                  ) =>
                    changeSort(
                      event.target
                        .value as SortType
                    )
                  }
                  className="
                    min-h-11
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    text-[16px]
                    font-bold
                    text-slate-700
                    outline-none
                    transition
                    focus:border-blue-400
                  "
                >
                  {sortOptions.map(
                    (item) => (
                      <option
                        key={
                          item.value
                        }
                        value={
                          item.value
                        }
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* ACTIVE FILTER */}

            {hasFilter && (
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    text-xs
                    font-bold
                    text-slate-400
                  "
                >
                  当前筛选
                </span>

                {activeType !==
                  "all" && (
                  <FilterChip
                    onRemove={() =>
                      changeType(
                        "all"
                      )
                    }
                  >
                    {
                      tabs.find(
                        (item) =>
                          item.value ===
                          activeType
                      )?.label
                    }
                  </FilterChip>
                )}

                {keyword.trim() && (
                  <FilterChip
                    onRemove={() => {
                      setKeyword("");
                      setPage(1);
                    }}
                  >
                    “{keyword.trim()}”
                  </FilterChip>
                )}

                {sort !==
                  "latest" && (
                  <FilterChip
                    onRemove={() =>
                      changeSort(
                        "latest"
                      )
                    }
                  >
                    {
                      sortOptions.find(
                        (item) =>
                          item.value ===
                          sort
                      )?.label
                    }
                  </FilterChip>
                )}

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="
                    min-h-9
                    px-2
                    text-xs
                    font-black
                    text-blue-600
                  "
                >
                  全部清除
                </button>
              </div>
            )}

            {/* FEED */}

            {visibleFeeds.length >
            0 ? (
              <div
                className="
                  mt-7
                  grid
                  grid-cols-1
                  gap-5
                  lg:grid-cols-2
                "
              >
                {visibleFeeds.map(
                  (item) => (
                    <FeedCard
                      key={
                        item.id
                      }
                      item={item}
                    />
                  )
                )}
              </div>
            ) : (
              <EmptyState
                onReset={
                  clearFilters
                }
              />
            )}

            {/* PAGINATION */}

            {filteredFeeds.length >
              PAGE_SIZE && (
              <div
                className="
                  mt-10
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <button
                  type="button"
                  disabled={
                    safePage === 1
                  }
                  onClick={() =>
                    setPage(
                      Math.max(
                        1,
                        safePage - 1
                      )
                    )
                  }
                  className={paginationClass}
                >
                  ←
                </button>

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map(
                  (pageNumber) => (
                    <button
                      key={
                        pageNumber
                      }
                      type="button"
                      onClick={() =>
                        setPage(
                          pageNumber
                        )
                      }
                      className={`
                        flex
                        h-11
                        min-w-11
                        items-center
                        justify-center
                        rounded-xl
                        text-sm
                        font-black
                        transition
                        ${
                          safePage ===
                          pageNumber
                            ? "bg-slate-950 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }
                      `}
                    >
                      {
                        pageNumber
                      }
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={
                    safePage ===
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      Math.min(
                        totalPages,
                        safePage + 1
                      )
                    )
                  }
                  className={paginationClass}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* COMMUNITY CTA */}

      <section className="pb-12 sm:pb-16">
        <Container>
          <div className="px-4">
            <div
              className="
                overflow-hidden
                rounded-[28px]
                bg-slate-950
                p-6
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-6
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-blue-300
                    "
                  >
                    <MessageCircle
                      size={17}
                    />

                    <span
                      className="
                        text-xs
                        font-black
                      "
                    >
                      SAKURA COMMUNITY
                    </span>
                  </div>

                  <h2
                    className="
                      mt-3
                      text-xl
                      font-black
                      text-white
                      sm:text-2xl
                    "
                  >
                    不只是看，也可以分享你的在日经验
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-xl
                      text-sm
                      leading-6
                      text-slate-400
                    "
                  >
                    分享工作、住房、学校和生活经验，
                    也可以在内容下面参与讨论和回复。
                  </p>
                </div>

                <Link
                  href="/account/publish"
                  className="
                    inline-flex
                    min-h-12
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-5
                    text-sm
                    font-black
                    text-slate-950
                    transition
                    hover:bg-blue-50
                  "
                >
                  <Plus
                    size={17}
                  />
                  发布信息
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function FeedTypeIcon({
  type,
}: {
  type: FeedType;
}) {
  if (type === "job") {
    return (
      <BriefcaseBusiness
        size={15}
      />
    );
  }

  if (type === "house") {
    return (
      <Home size={15} />
    );
  }

  if (type === "school") {
    return (
      <GraduationCap
        size={15}
      />
    );
  }

  if (type === "experience") {
    return (
      <FileText size={15} />
    );
  }

  if (type === "scam") {
    return (
      <ShieldAlert
        size={15}
      />
    );
  }

  if (type === "news") {
    return (
      <Newspaper size={15} />
    );
  }

  return (
    <Sparkles size={15} />
  );
}

function FilterChip({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div
      className="
        inline-flex
        min-h-9
        items-center
        gap-1.5
        rounded-full
        border
        border-slate-200
        bg-white
        pl-3
        pr-1.5
        text-xs
        font-bold
        text-slate-600
      "
    >
      {children}

      <button
        type="button"
        onClick={onRemove}
        aria-label="删除筛选条件"
        className="
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          text-slate-400
          transition
          hover:bg-slate-100
          hover:text-slate-700
        "
      >
        <X size={13} />
      </button>
    </div>
  );
}

function EmptyState({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <div
      className="
        mt-7
        flex
        min-h-[360px]
        items-center
        justify-center
        rounded-[28px]
        border
        border-dashed
        border-slate-300
        bg-white
        p-6
        text-center
      "
    >
      <div className="max-w-sm">
        <div
          className="
            mx-auto
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-slate-100
            text-slate-500
          "
        >
          <Search size={20} />
        </div>

        <h3
          className="
            mt-4
            text-base
            font-black
            text-slate-900
          "
        >
          没有找到相关动态
        </h3>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-400
          "
        >
          可以换一个关键词，
          或者清除当前筛选条件再看看。
        </p>

        <button
          type="button"
          onClick={onReset}
          className="
            mt-5
            inline-flex
            min-h-11
            items-center
            justify-center
            rounded-xl
            bg-slate-950
            px-5
            text-sm
            font-black
            text-white
          "
        >
          查看全部动态
        </button>
      </div>
    </div>
  );
}

const paginationClass = `
  flex
  h-11
  min-w-11
  items-center
  justify-center
  rounded-xl
  border
  border-slate-200
  bg-white
  text-sm
  font-black
  text-slate-600
  transition
  hover:bg-slate-100
  disabled:cursor-not-allowed
  disabled:opacity-30
`;