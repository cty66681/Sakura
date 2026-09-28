"use client";

import {
  Suspense,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Container from "@/components/layout/Container";

import { houses } from "@/data/houses";
import { jobs } from "@/data/jobs";
import { getPublisherById } from "@/data/publishers";

import {
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  MapPin,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

type SearchType =
  | "all"
  | "job"
  | "house"
  | "school"
  | "experience"
  | "scam";

type SortType =
  | "relevance"
  | "latest"
  | "popular";

interface SearchItem {
  id: string;
  type: Exclude<SearchType, "all">;
  title: string;
  summary: string;
  location?: string;
  meta?: string;
  publishTime: string;
  publishedAt?: string;
  views: number;
  tags: string[];
  searchTerms?: string;
  href: string;
}

const PAGE_SIZE = 8;

const mockSearchItems: SearchItem[] = [
  {
    id: "job-1",
    type: "job",
    title: "Java Backend Engineer",
    summary:
      "东京涩谷后端开发岗位，主要负责大型互联网服务的 API 与业务系统开发。",
    location: "东京 · 涩谷",
    meta: "¥700,000 ～ ¥900,000",
    publishTime: "今天",
    views: 1280,
    tags: ["Java", "后端", "正社员"],
    href: "/jobs/1",
  },
  {
    id: "job-2",
    type: "job",
    title: "Frontend Engineer",
    summary:
      "面向日本市场的前端开发职位，使用 React / TypeScript 参与产品开发。",
    location: "东京 · 港区",
    meta: "¥650,000 ～ ¥850,000",
    publishTime: "昨天",
    views: 940,
    tags: ["React", "TypeScript", "前端"],
    href: "/jobs/2",
  },
  {
    id: "house-1",
    type: "house",
    title: "池袋站步行8分钟 1LDK",
    summary:
      "交通方便，适合单身或两人居住。附近生活设施完善，可快速前往市中心。",
    location: "东京 · 丰岛区",
    meta: "¥128,000 / 月",
    publishTime: "今天",
    views: 820,
    tags: ["1LDK", "池袋", "交通便利"],
    href: "/houses/1",
  },
  {
    id: "house-2",
    type: "house",
    title: "高田马场 1K 公寓",
    summary:
      "距离车站较近，周边餐饮与购物方便，适合学生和刚来日本工作的用户。",
    location: "东京 · 新宿区",
    meta: "¥89,000 / 月",
    publishTime: "2天前",
    views: 720,
    tags: ["1K", "高田马场", "学生"],
    href: "/houses/2",
  },
  {
    id: "school-1",
    type: "school",
    title: "东京地区大学 / 大学院",
    summary:
      "查找东京地区大学及大学院信息，包括专业方向、留学生招生与报考信息。",
    location: "东京",
    meta: "大学 / 大学院",
    publishTime: "最近更新",
    views: 1520,
    tags: ["大学", "大学院", "东京"],
    href: "/schools/university",
  },
  {
    id: "school-2",
    type: "school",
    title: "日本语言学校",
    summary:
      "按地区查找语言学校，了解课程、升学方向以及面向留学生的基本信息。",
    location: "日本全国",
    meta: "语言学校",
    publishTime: "最近更新",
    views: 1310,
    tags: ["语言学校", "留学", "升学"],
    href: "/schools/language",
  },
  {
    id: "school-3",
    type: "school",
    title: "日本专门学校",
    summary:
      "查找 IT、商务、设计、医疗等方向的日本专门学校。",
    location: "日本全国",
    meta: "专门学校",
    publishTime: "最近更新",
    views: 1160,
    tags: ["专门学校", "IT", "就业"],
    href: "/schools/college",
  },
  {
    id: "experience-1",
    type: "experience",
    title: "第一次在日本租房，我踩过的几个坑",
    summary:
      "从看房、初期费用到入住前检查，整理第一次租房时容易忽略的问题。",
    location: "东京",
    meta: "生活经验",
    publishTime: "今天",
    views: 1860,
    tags: ["租房", "生活", "经验"],
    href: "/experience/1",
  },
  {
    id: "experience-2",
    type: "experience",
    title: "日本求职面试前应该准备什么",
    summary:
      "整理履历书、职务经历书、面试回答与企业研究中比较重要的准备事项。",
    location: "日本全国",
    meta: "工作经验",
    publishTime: "昨天",
    views: 1490,
    tags: ["求职", "面试", "工作"],
    href: "/experience/2",
  },
  {
    id: "experience-3",
    type: "experience",
    title: "来日本以后办理手机和银行卡的经验",
    summary:
      "分享刚到日本时办理手机号码、银行账户和基础生活手续的实际体验。",
    location: "东京",
    meta: "生活经验",
    publishTime: "3天前",
    views: 1080,
    tags: ["银行卡", "手机", "生活"],
    href: "/experience/3",
  },
  {
    id: "scam-1",
    type: "scam",
    title: "高额日结工作需要特别注意哪些风险",
    summary:
      "遇到高额现金、代取现金、提供银行卡或要求使用匿名通讯软件时需要提高警惕。",
    location: "日本全国",
    meta: "危险招聘",
    publishTime: "今天",
    views: 2310,
    tags: ["招聘", "风险", "安全"],
    href: "/scam/1",
  },
  {
    id: "scam-2",
    type: "scam",
    title: "租房转账前需要确认的事项",
    summary:
      "整理房源真实性、合同主体、付款方式以及转账前应该确认的信息。",
    location: "日本全国",
    meta: "住房风险",
    publishTime: "昨天",
    views: 1780,
    tags: ["租房", "转账", "避坑"],
    href: "/scam/2",
  },
];

// TODO [API - GET]
// 后台接入后，由搜索 API 返回经过权限和审核过滤的结果。
// 前台不能作为审核权限的最终判断依据。

const houseSearchItems: SearchItem[] = houses
  .filter(
    (house) =>
      house.moderationStatus === "approved" &&
      (
        house.listingStatus === "available" ||
        house.listingStatus === "paused"
      )
  )
  .map((house) => {
    const publisher = getPublisherById(
      house.publisherId
    );

    return {
      id: `house-${house.id}`,
      type: "house",
      title: house.title,
      summary: house.description,
      location: house.location,
      meta: house.rent,
      publishTime: house.publishTime,
      publishedAt: house.publishTime,
      views: house.views,
      tags: house.tags,
      searchTerms: [
        house.prefecture,
        house.city,
        house.station,
        publisher?.name ?? "",
        publisher?.company ?? "",
      ].filter(Boolean).join(" "),
      href: `/houses/${house.id}`,
    };
  });

  const jobSearchItems: SearchItem[] = jobs
    .filter(
      (job) =>
        job.moderationStatus === "approved"
    )
    .map((job) => ({
      id: `job-${job.id}`,
      type: "job",
      title: job.title,
      summary: job.description,
      location: job.location,
      meta: job.salary,
      publishTime: job.publishTime,
      publishedAt: job.publishTime,
      views: job.views,
      tags: job.tags,
      searchTerms: [
        job.company,
        job.occupation,
        job.category,
        job.employmentType,
        job.remote,
        job.language,
        ...job.workConditions,
      ].join(" "),
      href: `/jobs/${job.id}`,
    }));

const searchItems: SearchItem[] = [
  ...mockSearchItems.filter(
    (item) =>
      item.type !== "house" &&
      item.type !== "job"
  ),
  ...jobSearchItems,
  ...houseSearchItems,
];

const typeTabs: {
  value: SearchType;
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
];

const hotKeywords = [
  "东京工作",
  "池袋租房",
  "语言学校",
  "IT 专门学校",
  "日本求职",
  "租房避坑",
];

const searchCategoryTerms: Record<
  Exclude<SearchType, "all">,
  string
> = {
  job: "工作 招聘 职位",
  house: "房源 租房 公寓",
  school: "学校 留学",
  experience: "经验 分享",
  scam: "避坑 诈骗 风险",
};


/**
 * 全站搜索的同义词。
 * 后续接入后台时，可迁移为搜索词典。
 */
const searchSynonymGroups: string[][] = [
  ["整体", "按摩", "マッサージ", "リラクゼーション"],
  ["专门学校", "専門学校", "职业学校"],
  ["语言学校", "日本语学校", "日本語学校", "日语学校"],
  ["东京", "東京", "tokyo"],
  ["租房", "房源", "賃貸"],
  ["工作", "招聘", "职位", "求职"],
  ["避坑", "防骗", "诈骗", "詐欺"],
];

/**
 * 用已知词汇切分没有空格的组合关键词。
 * 较长的词优先，例如先识别「专门学校」，
 * 避免提前拆成「专门」和「学校」。
 */
const querySplitTerms = [
  ...new Set([
    ...searchSynonymGroups.flat(),
    "日本",
    "在日",
    "池袋",
    "大学院",
    "大学",
    "学校",
    "it",
    "ai",
    "java",
    "python",
  ]),
]
  .map((term) => term.normalize("NFKC").toLowerCase())
  .sort((a, b) => b.length - a.length);

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .trim();
}

function splitSearchQuery(query: string): string[] {
  const pieces = normalizeSearchText(query)
    .split(/[\s,，、/]+/)
    .filter(Boolean);

  const tokens = pieces.flatMap((piece) => {
    const result: string[] = [];
    let remaining = "";

    for (let index = 0; index < piece.length;) {
      const matched = querySplitTerms.find((term) =>
        piece.startsWith(term, index)
      );

      if (matched) {
        if (remaining) {
          result.push(remaining);
          remaining = "";
        }

        result.push(matched);
        index += matched.length;
      } else {
        remaining += piece[index];
        index += 1;
      }
    }

    if (remaining) {
      result.push(remaining);
    }

    return result;
  });

  // 所有内容都属于日本生活平台。
  // 搜索「日本求职」时，「日本」无需成为额外的匹配条件。
  if (tokens.length > 1) {
    return tokens.filter(
      (token) => token !== "日本" && token !== "在日"
    );
  }

  return tokens;
}

function matchesSearchTerm(
  searchableText: string,
  term: string
): boolean {
  const synonymGroup = searchSynonymGroups.find(
    (group) =>
      group.some(
        (synonym) =>
          normalizeSearchText(synonym) === term
      )
  );

  const alternatives = synonymGroup ?? [term];

  return alternatives.some((alternative) =>
    searchableText.includes(
      normalizeSearchText(alternative)
    )
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageRoute />
    </Suspense>
  );
}

function SearchPageRoute() {
  const searchParams = useSearchParams();

  return (
    <SearchPageContent
      key={searchParams.get("q") ?? ""}
    />
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryFromUrl =
    searchParams.get("q") ?? "";

  const typeFromUrl =
    parseSearchType(
      searchParams.get("type")
    );

  const [keyword, setKeyword] =
    useState(queryFromUrl);

  const activeType = typeFromUrl;

  const [sort, setSort] =
    useState<SortType>("relevance");

  const [page, setPage] =
    useState(1);

  const normalizedKeyword =
    queryFromUrl
      .trim()
      .toLowerCase();

  const filteredItems =
    useMemo(() => {
      let result =
        [...searchItems];

      if (
        activeType !== "all"
      ) {
        result =
          result.filter(
            (item) =>
              item.type ===
              activeType
          );
      }
      
    if (normalizedKeyword) {
      const keywords = splitSearchQuery(
        normalizedKeyword
      );

      result = result.filter((item) => {
        const searchableText = normalizeSearchText(
          [
            item.title,
            item.summary,
            item.location ?? "",
            item.meta ?? "",
            item.searchTerms ?? "",
            searchCategoryTerms[item.type],
            ...item.tags,
          ].join(" ")
        );

        return keywords.every((keyword) =>
          matchesSearchTerm(searchableText, keyword)
        );
      });
    }

      if (sort === "latest") {
        result.sort((a, b) => {
          const aTime = a.publishedAt
            ? Date.parse(a.publishedAt)
            : NaN;

          const bTime = b.publishedAt
            ? Date.parse(b.publishedAt)
            : NaN;

          const aValid = Number.isFinite(aTime);
          const bValid = Number.isFinite(bTime);

          if (!aValid && !bValid) return 0;
          if (!aValid) return 1;
          if (!bValid) return -1;

          return bTime - aTime;
        });
      } else if (sort === "popular") {
        result.sort(
          (a, b) =>
            b.views - a.views
        );
      }

      return result;
    }, [
      activeType,
      normalizedKeyword,
      sort,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredItems.length /
          PAGE_SIZE
      )
    );

  const safePage =
    Math.min(
      page,
      totalPages
    );

  const visibleItems =
    filteredItems.slice(
      (safePage - 1) *
        PAGE_SIZE,
      safePage *
        PAGE_SIZE
    );

  function submitSearch() {
    const value =
      keyword.trim();

    const params =
      new URLSearchParams();

    if (value) {
      params.set(
        "q",
        value
      );
    }

    if (
      activeType !== "all"
    ) {
      params.set(
        "type",
        activeType
      );
    }

    const query =
      params.toString();

    router.push(
      query
        ? `/search?${query}`
        : "/search"
    );

    setPage(1);

    // TODO [API - POST]
    // POST /api/search/intent
    // Purpose:
    // Record anonymized search intent
    // for improving Sakura search quality.
  }

  function applyKeyword(
    value: string
  ) {
    setKeyword(value);
    setPage(1);

    const params =
      new URLSearchParams();

    params.set("q", value);

    if (
      activeType !== "all"
    ) {
      params.set(
        "type",
        activeType
      );
    }

    router.push(
      `/search?${params.toString()}`
    );
  }

  function changeType(
  value: SearchType
) {
  setPage(1);

    const params =
      new URLSearchParams();

    const currentKeyword = keyword.trim();

    if (currentKeyword) {
      params.set("q", currentKeyword);
    }

    if (value !== "all") {
      params.set(
        "type",
        value
      );
    }

    const query =
      params.toString();

    router.push(
      query
        ? `/search?${query}`
        : "/search"
    );
  }

  function clearSearch() {
    setKeyword("");
    setPage(1);
    setSort("relevance");

    router.push("/search");
  }

  return (
    <main
      className="
        min-h-screen
        bg-slate-50
        pb-20
      "
    >
      {/* Hero */}

      <section
        className="
          overflow-hidden
          border-b
          border-slate-800
          bg-slate-950
        "
      >
        <Container>
          <div
            className="
              relative
              py-12
              sm:py-16
              lg:py-20
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-32
                h-80
                w-80
                rounded-full
                bg-blue-600/20
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-40
                left-1/3
                h-80
                w-80
                rounded-full
                bg-violet-600/15
                blur-3xl
              "
            />

            <div
              className="
                relative
                mx-auto
                max-w-4xl
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-black
                  text-blue-300
                "
              >
                <Sparkles
                  size={16}
                />

                SAKURA SEARCH
              </div>

              <h1
                className="
                  mt-4
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                想找什么，直接搜
              </h1>

              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-7
                  text-slate-400
                  sm:text-base
                "
              >
                工作、房源、学校、经验和避坑信息，
                在 Sakura 一个地方查找。
              </p>

              {/* Search */}

              <form
                onSubmit={(
                  event
                ) => {
                  event.preventDefault();
                  submitSearch();
                }}
                className="
                  mt-8
                  flex
                  min-h-16
                  items-center
                  gap-2
                  rounded-2xl
                  bg-white
                  p-2
                  shadow-2xl
                  shadow-black/20
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    text-slate-400
                  "
                >
                  <Search
                    size={21}
                  />
                </div>

                <input
                  value={keyword}
                  onChange={(
                    event
                  ) =>
                    setKeyword(
                      event.target
                        .value
                    )
                  }
                  placeholder="例如：东京 Java 工作、池袋 1LDK、语言学校..."
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-sm
                    font-semibold
                    text-slate-900
                    outline-none
                    placeholder:font-medium
                    placeholder:text-slate-400
                    sm:text-base
                  "
                />

                {keyword && (
                  <button
                    type="button"
                    aria-label="清空关键词"
                    onClick={() =>
                      setKeyword("")
                    }
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
                      hover:bg-slate-100
                      hover:text-slate-800
                    "
                  >
                    <X
                      size={17}
                    />
                  </button>
                )}

                <button
                  type="submit"
                  className="
                    flex
                    min-h-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    px-5
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-blue-700
                    active:scale-[0.98]
                    sm:px-7
                  "
                >
                  搜索
                </button>
              </form>

              {/* Hot Keywords */}

              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <div
                  className="
                    mr-1
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    font-bold
                    text-slate-500
                  "
                >
                  <TrendingUp
                    size={14}
                  />
                  热门
                </div>

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
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-slate-300
                        transition
                        hover:border-white/20
                        hover:bg-white/10
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

      <Container>
        <div
          className="
            py-8
            sm:py-10
          "
        >
          {/* Tabs */}

          <div
            className="
              -mx-4
              overflow-x-auto
              px-4
              scrollbar-none
              sm:mx-0
              sm:px-0
            "
          >
            <div
              className="
                flex
                min-w-max
                gap-2
              "
            >
              {typeTabs.map(
                (tab) => {
                  const active =
                    activeType ===
                    tab.value;

                  return (
                    <button
                      key={
                        tab.value
                      }
                      type="button"
                      onClick={() =>
                        changeType(
                          tab.value
                        )
                      }
                      className={`
                        min-h-11
                        rounded-xl
                        px-4
                        text-sm
                        font-black
                        transition
                        ${
                          active
                            ? "bg-slate-950 text-white shadow-md"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
                        }
                      `}
                    >
                      {
                        tab.label
                      }
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Header */}

          <div
            className="
              mt-7
              flex
              flex-col
              gap-4
              border-b
              border-slate-200
              pb-5
              sm:flex-row
              sm:items-end
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
                <h2
                  className="
                    text-xl
                    font-black
                    text-slate-950
                    sm:text-2xl
                  "
                >
                  {queryFromUrl
                    ? `“${queryFromUrl}” 的搜索结果`
                    : "全站内容"}
                </h2>
              </div>

              <p
                className="
                  mt-1.5
                  text-sm
                  text-slate-500
                "
              >
                找到{" "}
                <strong className="text-slate-900">
                  {
                    filteredItems.length
                  }
                </strong>{" "}
                条相关内容
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
                size={16}
                className="text-slate-400"
              />

              <select
                value={sort}
                onChange={(
                  event
                ) => {
                  setSort(
                    event.target
                      .value as SortType
                  );

                  setPage(1);
                }}
                className="
                  min-h-10
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  font-bold
                  text-slate-700
                  outline-none
                  transition
                  focus:border-blue-400
                  focus:ring-4
                  focus:ring-blue-100
                "
              >
                <option value="relevance">
                  综合排序
                </option>

                <option value="latest">
                  最新发布
                </option>

                <option value="popular">
                  最多人看
                </option>
              </select>
            </div>
          </div>

          {/* Active Filters */}

          {(queryFromUrl ||
            activeType !==
              "all") && (
            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              {queryFromUrl && (
                <FilterChip>
                  关键词：
                  {queryFromUrl}
                </FilterChip>
              )}

              {activeType !==
                "all" && (
                <FilterChip>
                  分类：
                  {
                    typeTabs.find(
                      (item) =>
                        item.value ===
                        activeType
                    )?.label
                  }
                </FilterChip>
              )}

              <button
                type="button"
                onClick={
                  clearSearch
                }
                className="
                  min-h-9
                  rounded-lg
                  px-2
                  text-xs
                  font-black
                  text-slate-400
                  transition
                  hover:bg-slate-100
                  hover:text-slate-700
                "
              >
                清除筛选
              </button>
            </div>
          )}

          {/* Results */}

          {visibleItems.length >
          0 ? (
            <>
              <div
                className="
                  mt-6
                  grid
                  gap-4
                "
              >
                {visibleItems.map(
                  (item) => (
                    <SearchResultCard
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                    />
                  )
                )}
              </div>

              {totalPages > 1 && (
                <Pagination
                  page={
                    safePage
                  }
                  totalPages={
                    totalPages
                  }
                  onChange={
                    setPage
                  }
                />
              )}
            </>
          ) : (
            <EmptyState
              query={
                queryFromUrl
              }
              onClear={
                clearSearch
              }
            />
          )}
        </div>
      </Container>
    </main>
  );
}

function SearchResultCard({
  item,
}: {
  item: SearchItem;
}) {
  return (
    <Link
      href={item.href}
      className="
        group
        block
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        transition-all
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-xl
        hover:shadow-slate-900/5
        sm:p-6
      "
    >
      <div
        className="
          flex
          gap-4
          sm:gap-5
        "
      >
        <SearchTypeIcon
          type={item.type}
        />

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <TypeBadge
                  type={
                    item.type
                  }
                />

                {item.meta && (
                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-500
                    "
                  >
                    {item.meta}
                  </span>
                )}
              </div>

              <h3
                className="
                  mt-2
                  text-base
                  font-black
                  leading-6
                  text-slate-950
                  transition
                  group-hover:text-blue-600
                  sm:text-lg
                "
              >
                {item.title}
              </h3>
            </div>

            <span
              className="
                shrink-0
                text-[11px]
                font-semibold
                text-slate-400
              "
            >
              {item.publishTime}
            </span>
          </div>

          <p
            className="
              mt-2
              line-clamp-2
              text-sm
              leading-6
              text-slate-500
            "
          >
            {item.summary}
          </p>

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
            "
          >
            {item.location && (
              <span
                className="
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                <MapPin
                  size={13}
                />

                {
                  item.location
                }
              </span>
            )}

            <span
              className="
                text-xs
                font-semibold
                text-slate-400
              "
            >
              {
                item.views
              }{" "}
              次浏览
            </span>
          </div>

          <div
            className="
              mt-4
              flex
              flex-wrap
              gap-1.5
            "
          >
            {item.tags.map(
              (tag) => (
                <span
                  key={tag}
                  className="
                    rounded-lg
                    bg-slate-100
                    px-2
                    py-1
                    text-[10px]
                    font-bold
                    text-slate-500
                  "
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SearchTypeIcon({
  type,
}: {
  type: SearchItem["type"];
}) {
  if (type === "job") {
    return (
      <IconBox className="bg-blue-50 text-blue-600">
        <BriefcaseBusiness
          size={21}
        />
      </IconBox>
    );
  }

  if (type === "house") {
    return (
      <IconBox className="bg-amber-50 text-amber-600">
        <Building2
          size={21}
        />
      </IconBox>
    );
  }

  if (type === "school") {
    return (
      <IconBox className="bg-indigo-50 text-indigo-600">
        <GraduationCap
          size={21}
        />
      </IconBox>
    );
  }

  if (
    type === "experience"
  ) {
    return (
      <IconBox className="bg-emerald-50 text-emerald-600">
        <FileText
          size={21}
        />
      </IconBox>
    );
  }

  return (
    <IconBox className="bg-rose-50 text-rose-600">
      <ShieldAlert
        size={21}
      />
    </IconBox>
  );
}

function IconBox({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-xl
        sm:h-12
        sm:w-12
        ${className}
      `}
    >
      {children}
    </div>
  );
}

function TypeBadge({
  type,
}: {
  type: SearchItem["type"];
}) {
  let label = "避坑";
  let className =
    "bg-rose-50 text-rose-600";

  if (type === "job") {
    label = "工作";
    className =
      "bg-blue-50 text-blue-600";
  }

  if (type === "house") {
    label = "房源";
    className =
      "bg-amber-50 text-amber-600";
  }

  if (type === "school") {
    label = "学校";
    className =
      "bg-indigo-50 text-indigo-600";
  }

  if (
    type === "experience"
  ) {
    label = "经验";
    className =
      "bg-emerald-50 text-emerald-600";
  }

  return (
    <span
      className={`
        rounded-md
        px-2
        py-1
        text-[10px]
        font-black
        ${className}
      `}
    >
      {label}
    </span>
  );
}

function FilterChip({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span
      className="
        inline-flex
        min-h-8
        items-center
        rounded-lg
        border
        border-slate-200
        bg-white
        px-2.5
        text-xs
        font-bold
        text-slate-600
      "
    >
      {children}
    </span>
  );
}

function EmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div
      className="
        mt-8
        rounded-3xl
        border
        border-dashed
        border-slate-300
        bg-white
        px-6
        py-16
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-slate-100
          text-slate-400
        "
      >
        <Search size={24} />
      </div>

      <h3
        className="
          mt-5
          text-lg
          font-black
          text-slate-900
        "
      >
        没找到相关内容
      </h3>

      <p
        className="
          mx-auto
          mt-2
          max-w-md
          text-sm
          leading-6
          text-slate-500
        "
      >
        {query
          ? `暂时没有找到与“${query}”匹配的内容，可以换一个关键词试试。`
          : "当前筛选条件下暂时没有内容。"}
      </p>

      <button
        type="button"
        onClick={onClear}
        className="
          mt-6
          min-h-11
          rounded-xl
          bg-slate-950
          px-5
          text-sm
          font-black
          text-white
          transition
          hover:bg-blue-600
        "
      >
        查看全部内容
      </button>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (
    page: number
  ) => void;
}) {
  return (
    <div
      className="
        mt-8
        flex
        items-center
        justify-center
        gap-2
      "
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() =>
          onChange(page - 1)
        }
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          text-slate-600
          transition
          hover:border-slate-300
          hover:text-slate-950
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronLeft
          size={18}
        />
      </button>

      {Array.from(
        {
          length:
            totalPages,
        },
        (_, index) =>
          index + 1
      ).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() =>
            onChange(item)
          }
          className={`
            h-11
            min-w-11
            rounded-xl
            px-3
            text-sm
            font-black
            transition
            ${
              item === page
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
            }
          `}
        >
          {item}
        </button>
      ))}

      <button
        type="button"
        disabled={
          page >= totalPages
        }
        onClick={() =>
          onChange(page + 1)
        }
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          text-slate-600
          transition
          hover:border-slate-300
          hover:text-slate-950
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <ChevronRight
          size={18}
        />
      </button>
    </div>
  );
}

function SearchPageFallback() {
  return (
    <main
      className="
        min-h-screen
        bg-slate-50
      "
    >
      <div
        className="
          h-[330px]
          animate-pulse
          bg-slate-950
        "
      />

      <Container>
        <div className="py-10">
          <div
            className="
              h-12
              animate-pulse
              rounded-xl
              bg-slate-200
            "
          />

          <div
            className="
              mt-6
              space-y-4
            "
          >
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-40
                    animate-pulse
                    rounded-2xl
                    bg-white
                  "
                />
              )
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

function parseSearchType(
  value: string | null
): SearchType {
  if (value === "job") {
    return "job";
  }

  if (value === "house") {
    return "house";
  }

  if (value === "school") {
    return "school";
  }

  if (
    value === "experience"
  ) {
    return "experience";
  }

  if (value === "scam") {
    return "scam";
  }

  return "all";
}