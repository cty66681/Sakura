"use client";

import {
  Suspense,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";

import {
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MapPin,
  Search,
  Star,
  WalletCards,
  X,
} from "lucide-react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import Container from "@/components/layout/Container";

import {
  normalizeCollegeSearchText,
  parseCollegeSearch,
} from "@/lib/search/collegeSearchDictionary";
/*
|--------------------------------------------------------------------------
| 专门学校数据类型
|--------------------------------------------------------------------------
*/

type College = {
  id: string;

  name: string;
  englishName: string;

  prefecture: string;
  city: string;

  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";

  tuition: number;

  rating: number;

  employmentRate: number;

  internationalSupport: boolean;
  chineseSupport: boolean;
  visaSupport: boolean;

  recommended: boolean;

  tags: string[];
};

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| GET /api/colleges
|
| Query Params:
|
| q
| region          // 都道府县
| category
| support
| tuition
| sort
| page
|
| 示例：
|
| GET /api/colleges?region=爱知&category=IT・AI&page=1
|
| 后端地址结构：
|
| {
|   prefecture: "爱知",
|   city: "名古屋市"
| }
|
|--------------------------------------------------------------------------
*/

const colleges: College[] = [
  {
    id: "tokyo-tech-ai",
    name: "东京科技AI专门学校",
    englishName:
      "Tokyo Technology & AI College",

    prefecture: "东京",
    city: "新宿区",

    category: "IT・AI",

    tuition: 1180000,
    rating: 4.7,
    employmentRate: 96,

    internationalSupport: true,
    chineseSupport: true,
    visaSupport: true,

    recommended: true,

    tags: [
      "AI开发",
      "Web开发",
      "外国人就业支持",
    ],
  },

  {
    id: "tokyo-design",
    name: "东京设计动漫专门学校",
    englishName:
      "Tokyo Design & Anime College",

    prefecture: "东京",
    city: "涩谷区",

    category: "设计・动漫",

    tuition: 1250000,
    rating: 4.6,
    employmentRate: 93,

    internationalSupport: true,
    chineseSupport: true,
    visaSupport: true,

    recommended: true,

    tags: [
      "动漫",
      "游戏设计",
      "平面设计",
    ],
  },

  {
    id: "osaka-computer",
    name: "大阪计算机专门学校",
    englishName:
      "Osaka Computer College",

    prefecture: "大阪",
    city: "大阪市",

    category: "IT・AI",

    tuition: 1050000,
    rating: 4.5,
    employmentRate: 95,

    internationalSupport: true,
    chineseSupport: true,
    visaSupport: true,

    recommended: true,

    tags: [
      "程序开发",
      "网络工程",
      "就业率高",
    ],
  },

  {
    id: "kyoto-design",
    name: "京都艺术设计专门学校",
    englishName:
      "Kyoto Art & Design College",

    prefecture: "京都",
    city: "京都市",

    category: "设计・动漫",

    tuition: 1190000,
    rating: 4.6,
    employmentRate: 91,

    internationalSupport: true,
    chineseSupport: false,
    visaSupport: true,

    recommended: false,

    tags: [
      "艺术设计",
      "插画",
      "视觉设计",
    ],
  },

  {
    id: "nagoya-business",
    name: "名古屋国际商务专门学校",
    englishName:
      "Nagoya International Business College",

    prefecture: "爱知",
    city: "名古屋市",

    category: "商务・观光",

    tuition: 980000,
    rating: 4.3,
    employmentRate: 92,

    internationalSupport: true,
    chineseSupport: true,
    visaSupport: true,

    recommended: false,

    tags: [
      "商务日语",
      "酒店观光",
      "就业指导",
    ],
  },

  {
    id: "fukuoka-tourism",
    name: "福冈观光商务专门学校",
    englishName:
      "Fukuoka Tourism & Business College",

    prefecture: "福冈",
    city: "福冈市",

    category: "商务・观光",

    tuition: 920000,
    rating: 4.4,
    employmentRate: 94,

    internationalSupport: true,
    chineseSupport: true,
    visaSupport: true,

    recommended: true,

    tags: [
      "酒店",
      "旅游",
      "航空服务",
    ],
  },

  {
    id: "tokyo-beauty",
    name: "东京美容时尚专门学校",
    englishName:
      "Tokyo Beauty & Fashion College",

    prefecture: "东京",
    city: "丰岛区",

    category: "美容・时尚",

    tuition: 1320000,
    rating: 4.5,
    employmentRate: 94,

    internationalSupport: true,
    chineseSupport: true,
    visaSupport: true,

    recommended: false,

    tags: [
      "美容",
      "时尚",
      "造型设计",
    ],
  },

  {
    id: "osaka-medical",
    name: "大阪医疗福祉专门学校",
    englishName:
      "Osaka Medical Welfare College",

    prefecture: "大阪",
    city: "大阪市",

    category: "医疗・福祉",

    tuition: 1280000,
    rating: 4.4,
    employmentRate: 97,

    internationalSupport: true,
    chineseSupport: false,
    visaSupport: true,

    recommended: true,

    tags: [
      "介护",
      "医疗事务",
      "资格考试",
    ],
  },

  {
    id: "yokohama-auto",
    name: "横滨汽车技术专门学校",
    englishName:
      "Yokohama Automotive Technology College",

    prefecture: "神奈川",
    city: "横滨市",

    category: "汽车・技术",

    tuition: 1150000,
    rating: 4.5,
    employmentRate: 98,

    internationalSupport: true,
    chineseSupport: true,
    visaSupport: true,

    recommended: true,

    tags: [
      "汽车整备",
      "国家资格",
      "企业合作",
    ],
  },

  {
    id: "saitama-it",
    name: "埼玉IT商务专门学校",
    englishName:
      "Saitama IT & Business College",

    prefecture: "埼玉",
    city: "埼玉市",

    category: "IT・AI",

    tuition: 950000,
    rating: 4.2,
    employmentRate: 93,

    internationalSupport: true,
    chineseSupport: true,
    visaSupport: true,

    recommended: false,

    tags: [
      "IT基础",
      "商务",
      "学费较低",
    ],
  },
];

/* =========================================================
   日本 47 都道府县
========================================================= */

const prefectureGroups = [
  {
    region: "北海道",
    prefectures: ["北海道"],
  },

  {
    region: "东北",
    prefectures: [
      "青森",
      "岩手",
      "宫城",
      "秋田",
      "山形",
      "福岛",
    ],
  },

  {
    region: "关东",
    prefectures: [
      "茨城",
      "栃木",
      "群马",
      "埼玉",
      "千叶",
      "东京",
      "神奈川",
    ],
  },

  {
    region: "中部",
    prefectures: [
      "新潟",
      "富山",
      "石川",
      "福井",
      "山梨",
      "长野",
      "岐阜",
      "静冈",
      "爱知",
    ],
  },

  {
    region: "近畿",
    prefectures: [
      "三重",
      "滋贺",
      "京都",
      "大阪",
      "兵库",
      "奈良",
      "和歌山",
    ],
  },

  {
    region: "中国",
    prefectures: [
      "鸟取",
      "岛根",
      "冈山",
      "广岛",
      "山口",
    ],
  },

  {
    region: "四国",
    prefectures: [
      "德岛",
      "香川",
      "爱媛",
      "高知",
    ],
  },

  {
    region: "九州・冲绳",
    prefectures: [
      "福冈",
      "佐贺",
      "长崎",
      "熊本",
      "大分",
      "宫崎",
      "鹿儿岛",
      "冲绳",
    ],
  },
];

const popularPrefectures = [
  "全部",
  "东京",
  "大阪",
  "京都",
  "神奈川",
  "爱知",
  "福冈",
  "埼玉",
];

const categories: College["category"][] = [
  "IT・AI",
  "设计・动漫",
  "商务・观光",
  "美容・时尚",
  "医疗・福祉",
  "汽车・技术",
];

const PAGE_SIZE = 6;

function getCollegeSearchScore(
  college: (typeof colleges)[number],
  search: string
) {
  if (!search.trim()) {
    return 0;
  }

  const groups =
    parseCollegeSearch(search);

  const nameText =
    normalizeCollegeSearchText(
      college.name
    );

  const englishNameText =
    normalizeCollegeSearchText(
      college.englishName
    );

  const locationText =
    normalizeCollegeSearchText(
      [
        college.prefecture,
        college.city,
      ].join(" ")
    );

  const categoryText =
    normalizeCollegeSearchText(
      college.category
    );

  const tagText =
    normalizeCollegeSearchText(
      college.tags.join(" ")
    );

  const fullText =
    normalizeCollegeSearchText(
      [
        college.name,
        college.englishName,
        college.prefecture,
        college.city,
        college.category,
        ...college.tags,
      ].join(" ")
    );

  let score = 0;

  for (const group of groups) {
    if (
      group.type ===
      "location"
    ) {
      if (
        group.aliases.some(
          (alias) =>
            locationText.includes(
              alias
            )
        )
      ) {
        score += 70;
      }

      continue;
    }

    if (
      group.type ===
      "category"
    ) {
      if (
        group.aliases.some(
          (alias) =>
            categoryText.includes(
              alias
            ) ||
            tagText.includes(
              alias
            )
        )
      ) {
        score += 80;
      }

      continue;
    }

    if (
      group.type ===
      "support"
    ) {
      score += 60;
      continue;
    }

    if (
      group.type ===
      "condition"
    ) {
      score += 45;
      continue;
    }

    if (
      group.type ===
      "literal"
    ) {
      for (
        const alias of group.aliases
      ) {
        if (
          nameText.includes(alias)
        ) {
          score += 120;
        } else if (
          englishNameText.includes(
            alias
          )
        ) {
          score += 90;
        } else if (
          categoryText.includes(
            alias
          )
        ) {
          score += 70;
        } else if (
          tagText.includes(alias)
        ) {
          score += 40;
        } else if (
          fullText.includes(alias)
        ) {
          score += 15;
        }
      }
    }
  }

  const normalizedSearch =
    normalizeCollegeSearchText(
      search
    );

  if (
    normalizedSearch &&
    nameText.includes(
      normalizedSearch
    )
  ) {
    score += 150;
  }

  return score;
}

function sortCollegesBySearchRelevance(
  list: typeof colleges,
  search: string
) {
  return [...list].sort(
    (a, b) =>
      getCollegeSearchScore(
        b,
        search
      ) -
      getCollegeSearchScore(
        a,
        search
      )
  );
}

export default function CollegePage() {
  return (
    <Suspense fallback={<CollegeLoading />}>
      <CollegePageContent />
    </Suspense>
  );
}

function CollegePageContent() {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  /* =========================================================
     URL STATE
  ========================================================= */

  const keyword =
    searchParams.get("q") ?? "";

  const region =
    searchParams.get("region") ?? "全部";

  const category =
    searchParams.get("category") ?? "全部";

  const support =
    searchParams.get("support") ?? "全部";

  const tuition =
    searchParams.get("tuition") ?? "全部";

  const sort =
    searchParams.get("sort") ??
    "recommended";

  const page = Math.max(
    1,
    Number(
      searchParams.get("page") ??
        "1"
    ) || 1
  );

  const updateQuery = (
    changes: Record<
      string,
      string | null
    >
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    Object.entries(
      changes
    ).forEach(
      ([key, value]) => {
        if (
          value === null ||
          value === "" ||
          value === "全部" ||
          (key === "sort" &&
            value ===
              "recommended") ||
          (key === "page" &&
            value === "1")
        ) {
          params.delete(key);
        } else {
          params.set(
            key,
            value
          );
        }
      }
    );

    const query =
      params.toString();

    router.replace(
      query
        ? `${pathname}?${query}`
        : pathname,
      {
        scroll: false,
      }
    );
  };

  const handleSearch = (
      value: string
    ) => {
      updateQuery({
        q:
          value.trim() || null,
        page: null,
      });
    };

  const clearSearch = () => {
    updateQuery({
      q: null,
      page: null,
    });
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredColleges =
    useMemo(() => {
      let result =
        [...colleges];

      if (keyword.trim()) {
  const searchGroups =
    parseCollegeSearch(
      keyword
    );

  result = result.filter(
    (college) => {
      const fullText =
        normalizeCollegeSearchText(
          [
            college.name,
            college.englishName,
            college.prefecture,
            college.city,
            college.category,
            ...college.tags,
          ].join(" ")
        );

      const locationText =
        normalizeCollegeSearchText(
          [
            college.prefecture,
            college.city,
          ].join(" ")
        );

      return searchGroups.every(
        (group) => {
          /* 地区 */

          if (
            group.type ===
            "location"
          ) {
            return group.aliases.some(
              (alias) =>
                locationText.includes(
                  alias
                )
            );
          }

          /* 专业方向 */

          if (
            group.type ===
            "category"
          ) {
            const categoryMap: Record<
              string,
              College["category"]
            > = {
              "it-ai": "IT・AI",
              "design-anime":
                "设计・动漫",
              "business-tourism":
                "商务・观光",
              "beauty-fashion":
                "美容・时尚",
              "medical-welfare":
                "医疗・福祉",
              "auto-tech":
                "汽车・技术",
            };

            const value =
              categoryMap[
                group.key
              ];

            return value
              ? college.category ===
                  value
              : false;
          }

          /* 留学生支持 */

          if (
            group.type ===
            "support"
          ) {
            if (
              group.key ===
              "chinese"
            ) {
              return college.chineseSupport;
            }

            if (
              group.key ===
              "international"
            ) {
              return college.internationalSupport;
            }

            if (
              group.key ===
              "visa"
            ) {
              return college.visaSupport;
            }

            return false;
          }

          /* 条件 */

          if (
            group.type ===
            "condition"
          ) {
            if (
              group.key ===
              "tuition-under-100"
            ) {
              return (
                college.tuition <=
                1000000
              );
            }

            if (
              group.key ===
              "tuition-under-120"
            ) {
              return (
                college.tuition <=
                1200000
              );
            }

            if (
              group.key ===
              "cheap"
            ) {
              return (
                college.tuition <=
                1000000
              );
            }

            if (
              group.key ===
              "employment"
            ) {
              return (
                college.employmentRate >
                  0 ||
                college.tags.some(
                  (tag) =>
                    tag.includes(
                      "就业"
                    )
                )
              );
            }

            if (
              group.key ===
              "high-employment"
            ) {
              return (
                college.employmentRate >=
                95
              );
            }

            if (
              group.key ===
              "qualification"
            ) {
              return college.tags.some(
                (tag) =>
                  tag.includes(
                    "资格"
                  )
              );
            }

            if (
              group.key ===
              "recommended"
            ) {
              return college.recommended;
            }

            return false;
          }

          /* 普通自由词 */

          if (
            group.type ===
            "literal"
          ) {
            return group.aliases.some(
              (alias) =>
                fullText.includes(
                  alias
                )
            );
          }

          return true;
        }
      );
    }
  );
}

      /*
       * region 统一对应 prefecture
       *
       * ?region=东京
       * ?region=爱知
       * ?region=神奈川
       */
      if (
        region !== "全部"
      ) {
        result =
          result.filter(
            (college) =>
              college.prefecture ===
              region
          );
      }

      if (
        category !== "全部"
      ) {
        result =
          result.filter(
            (college) =>
              college.category ===
              category
          );
      }

      if (
        support ===
        "中文支持"
      ) {
        result =
          result.filter(
            (college) =>
              college.chineseSupport
          );
      }

      if (
        support ===
        "留学生支持"
      ) {
        result =
          result.filter(
            (college) =>
              college.internationalSupport
          );
      }

      if (
        support ===
        "签证支持"
      ) {
        result =
          result.filter(
            (college) =>
              college.visaSupport
          );
      }

      if (
        tuition ===
        "100万以下"
      ) {
        result =
          result.filter(
            (college) =>
              college.tuition <
              1000000
          );
      }

      if (
        tuition ===
        "120万以下"
      ) {
        result =
          result.filter(
            (college) =>
              college.tuition <
              1200000
          );
      }

      switch (sort) {
        case "rating":
          result.sort(
            (a, b) =>
              b.rating -
              a.rating
          );
          break;

        case "employment":
          result.sort(
            (a, b) =>
              b.employmentRate -
              a.employmentRate
          );
          break;

        case "tuition":
          result.sort(
            (a, b) =>
              a.tuition -
              b.tuition
          );
          break;

        default:
          if (keyword.trim()) {
            result =
              sortCollegesBySearchRelevance(
                result,
                keyword
              );
          } else {
            result.sort(
              (a, b) =>
                Number(
                  b.recommended
                ) -
                  Number(
                    a.recommended
                  ) ||
                b.rating -
                  a.rating
            );
          }

          break;
      }

      return result;
    }, [
      keyword,
      region,
      category,
      support,
      tuition,
      sort,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredColleges.length /
          PAGE_SIZE
      )
    );

  const currentPage =
    Math.min(
      page,
      totalPages
    );

  const visibleColleges =
    filteredColleges.slice(
      (currentPage - 1) *
        PAGE_SIZE,
      currentPage *
        PAGE_SIZE
    );

  const resetFilters = () => {
    router.replace(
      pathname,
      {
        scroll: false,
      }
    );
  };

  const searchParamsString =
  searchParams.toString();

  const currentListUrl =
    `${pathname}${
      searchParamsString
        ? `?${searchParamsString}`
        : ""
    }#college-results`;

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.12),transparent_35%)]" />

        <Container>
          <div className="relative py-20 lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300">
                <BriefcaseBusiness
                  size={16}
                />

                专门学校数据库
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
                找到适合你的
                <span className="text-orange-400">
                  {" "}
                  专门学校
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
                从专业方向、学费、就业率、
                都道府县和留学生支持等条件，
                快速筛选适合自己的日本专门学校。
              </p>

              {/* Search */}

              <CollegeSearchBox
                key={keyword}
                initialValue={keyword}
                onSearch={handleSearch}
                onClear={clearSearch}
              />

              {/* Quick tags */}

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "IT・AI",
                  "设计・动漫",
                  "商务・观光",
                  "美容・时尚",
                ].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        updateQuery({
                          category:
                            item,
                          page: null,
                        })
                      }
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-orange-400/40 hover:bg-orange-400/10 hover:text-orange-300"
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

      {/* =====================================================
          POPULAR PREFECTURES
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <Container>
          <div className="py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex gap-2 overflow-x-auto">
                {popularPrefectures.map(
                  (item) => {
                    const active =
                      region ===
                      item;

                    return (
                      <button
                        key={
                          item
                        }
                        type="button"
                        onClick={() =>
                          updateQuery(
                            {
                              region:
                                item,
                              page: null,
                            }
                          )
                        }
                        className={`
                          whitespace-nowrap
                          rounded-xl
                          px-4
                          py-2.5
                          text-sm
                          font-semibold
                          transition
                          ${
                            active
                              ? "bg-orange-500 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-700"
                          }
                        `}
                      >
                        {item ===
                        "全部"
                          ? "全国"
                          : item}
                      </button>
                    );
                  }
                )}
              </div>

              <select
                value={
                  region
                }
                onChange={(event) =>
                  updateQuery({
                    region:
                      event.target
                        .value,
                    page: null,
                  })
                }
                className="h-11 min-w-[210px] rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-400"
              >
                <option value="全部">
                  全国 47 都道府县
                </option>

                {prefectureGroups.map(
                  (group) => (
                    <optgroup
                      key={
                        group.region
                      }
                      label={
                        group.region
                      }
                    >
                      {group.prefectures.map(
                        (
                          prefecture
                        ) => (
                          <option
                            key={
                              prefecture
                            }
                            value={
                              prefecture
                            }
                          >
                            {
                              prefecture
                            }
                          </option>
                        )
                      )}
                    </optgroup>
                  )
                )}
              </select>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside>
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900">
                  筛选条件
                </h2>

                <button
                  type="button"
                  onClick={
                    resetFilters
                  }
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  重置
                </button>
              </div>

              {/* Prefecture */}

              <FilterGroup title="都道府县">
                <select
                  value={
                    region
                  }
                  onChange={(
                    event
                  ) =>
                    updateQuery({
                      region:
                        event.target
                          .value,
                      page: null,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-400"
                >
                  <option value="全部">
                    全国
                  </option>

                  {prefectureGroups.map(
                    (group) => (
                      <optgroup
                        key={
                          group.region
                        }
                        label={
                          group.region
                        }
                      >
                        {group.prefectures.map(
                          (
                            prefecture
                          ) => (
                            <option
                              key={
                                prefecture
                              }
                              value={
                                prefecture
                              }
                            >
                              {
                                prefecture
                              }
                            </option>
                          )
                        )}
                      </optgroup>
                    )
                  )}
                </select>

                {region !==
                  "全部" && (
                  <div className="mt-3 rounded-xl bg-orange-50 px-3 py-2.5 text-sm font-bold text-orange-700">
                    📍 {region}
                  </div>
                )}
              </FilterGroup>

              {/* Category */}

              <FilterGroup title="专业方向">
                <FilterButton
                  active={
                    category ===
                    "全部"
                  }
                  onClick={() =>
                    updateQuery({
                      category:
                        "全部",
                      page: null,
                    })
                  }
                >
                  全部专业
                </FilterButton>

                {categories.map(
                  (item) => (
                    <FilterButton
                      key={item}
                      active={
                        category ===
                        item
                      }
                      onClick={() =>
                        updateQuery({
                          category:
                            item,
                          page: null,
                        })
                      }
                    >
                      {item}
                    </FilterButton>
                  )
                )}
              </FilterGroup>

              {/* Support */}

              <FilterGroup title="留学生支持">
                {[
                  "全部",
                  "中文支持",
                  "留学生支持",
                  "签证支持",
                ].map(
                  (item) => (
                    <FilterButton
                      key={item}
                      active={
                        support ===
                        item
                      }
                      onClick={() =>
                        updateQuery({
                          support:
                            item,
                          page: null,
                        })
                      }
                    >
                      {item}
                    </FilterButton>
                  )
                )}
              </FilterGroup>

              {/* Tuition */}

              <FilterGroup title="学费">
                {[
                  "全部",
                  "100万以下",
                  "120万以下",
                ].map(
                  (item) => (
                    <FilterButton
                      key={item}
                      active={
                        tuition ===
                        item
                      }
                      onClick={() =>
                        updateQuery({
                          tuition:
                            item,
                          page: null,
                        })
                      }
                    >
                      {item}
                    </FilterButton>
                  )
                )}
              </FilterGroup>
            </div>
          </aside>

          {/* =================================================
              RESULTS
          ================================================= */}

          <div id="college-results" className="flex min-h-[1100px] flex-col">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {region ===
                  "全部"
                    ? "日本专门学校"
                    : `${region}专门学校`}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  找到{" "}
                  <span className="font-bold text-orange-600">
                    {
                      filteredColleges.length
                    }
                  </span>{" "}
                  所学校
                </p>
              </div>

              <select
                value={sort}
                onChange={(
                  event
                ) =>
                  updateQuery({
                    sort:
                      event.target
                        .value,
                    page: null,
                  })
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-orange-400"
              >
                <option value="recommended">
                  推荐排序
                </option>

                <option value="rating">
                  评分最高
                </option>

                <option value="employment">
                  就业率最高
                </option>

                <option value="tuition">
                  学费从低到高
                </option>
              </select>
            </div>

            {/* Cards */}

            {visibleColleges.length >
            0 ? (
              <div className="grid gap-5">
                {visibleColleges.map(
                  (college) => (
                    <CollegeCard
                      key={
                        college.id
                      }
                      college={
                        college
                      }
                      href={`/schools/college/${college.id}?returnTo=${encodeURIComponent(
                        currentListUrl
                      )}`}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
                <div className="max-w-md px-6 text-center">
                  <Search
                    size={36}
                    className="mx-auto text-slate-300"
                  />

                  <h3 className="mt-4 font-bold text-slate-800">
                    暂时没有找到符合条件的专门学校
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    当前 Mock 数据还没有覆盖日本全部地区。
                    全国 47 都道府县的筛选结构已经准备好，
                    后续接入真实学校数据即可直接使用。
                  </p>

                  <button
                    type="button"
                    onClick={
                      resetFilters
                    }
                    className="mt-5 text-sm font-bold text-orange-600"
                  >
                    清除筛选
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}

            {filteredColleges.length >
              PAGE_SIZE && (
              <div className="mt-auto flex items-center justify-center gap-2 pt-12">
                <button
                  type="button"
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    updateQuery({
                      page: String(
                        currentPage -
                          1
                      ),
                    })
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft
                    size={18}
                  />
                </button>

                {Array.from({
                  length:
                    totalPages,
                }).map(
                  (_, index) => {
                    const value =
                      index + 1;

                    return (
                      <button
                        key={
                          value
                        }
                        type="button"
                        onClick={() =>
                          updateQuery(
                            {
                              page: String(
                                value
                              ),
                            }
                          )
                        }
                        className={`
                          h-10
                          min-w-10
                          rounded-xl
                          px-3
                          text-sm
                          font-bold
                          transition
                          ${
                            currentPage ===
                            value
                              ? "bg-orange-500 text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:text-orange-600"
                          }
                        `}
                      >
                        {value}
                      </button>
                    );
                  }
                )}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    updateQuery({
                      page: String(
                        currentPage +
                          1
                      ),
                    })
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight
                    size={18}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

function CollegeSearchBox({
    initialValue,
    onSearch,
    onClear,
  }: {
    initialValue: string;
    onSearch: (value: string) => void;
    onClear: () => void;
  }) {
    const [value, setValue] =
      useState(initialValue);

    const submitSearch = () => {
      onSearch(value);
    };

    return (
      <div className="mt-9 flex max-w-2xl items-center rounded-2xl border border-white/10 bg-white p-2 shadow-2xl">
        <Search
          size={20}
          className="ml-3 shrink-0 text-slate-400"
        />

        <input
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter"
            ) {
              submitSearch();
            }
          }}
          placeholder="搜索学校、专业、都道府县、城市..."
          className="h-11 min-w-0 flex-1 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              onClear();
            }}
            className="mr-2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        )}

        <button
          type="button"
          onClick={
            submitSearch
          }
          className="h-11 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-600"
        >
          搜索
        </button>
      </div>
    );
  }



/*
|--------------------------------------------------------------------------
| College Card
|--------------------------------------------------------------------------
*/

function CollegeCard({
  college,
  href,
}: {
  college: College;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-slate-200/60"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600">
          <GraduationCap
            size={34}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-orange-600">
                  {college.name}
                </h3>

                {college.recommended && (
                  <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                    推荐
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-400">
                {
                  college.englishName
                }
              </p>
            </div>

            <div className="flex items-center gap-1 font-bold text-slate-900">
              <Star
                className="fill-amber-400 text-amber-400"
                size={17}
              />

              {college.rating}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin
                size={15}
              />

              {
                college.prefecture
              }{" "}
              ·{" "}
              {
                college.city
              }
            </span>

            <span className="flex items-center gap-1.5">
              <Building2
                size={15}
              />

              {
                college.category
              }
            </span>

            <span className="flex items-center gap-1.5">
              <WalletCards
                size={15}
              />

              约 ¥
              {college.tuition.toLocaleString()}
              /年
            </span>

            <span className="flex items-center gap-1.5">
              <BriefcaseBusiness
                size={15}
              />

              就业率{" "}
              {
                college.employmentRate
              }
              %
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {college.tags.map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {college.chineseSupport && (
              <SupportBadge>
                中文支持
              </SupportBadge>
            )}

            {college.internationalSupport && (
              <SupportBadge>
                留学生支持
              </SupportBadge>
            )}

            {college.visaSupport && (
              <SupportBadge>
                签证支持
              </SupportBadge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-7 border-t border-slate-100 pt-6 first:mt-5 first:border-t-0 first:pt-0">
      <p className="mb-3 text-sm font-bold text-slate-800">
        {title}
      </p>

      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        block
        w-full
        rounded-xl
        px-3
        py-2.5
        text-left
        text-sm
        transition
        ${
          active
            ? "bg-orange-50 font-bold text-orange-700"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }
      `}
    >
      {children}
    </button>
  );
}

function SupportBadge({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      {children}
    </span>
  );
}

function CollegeLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="h-[380px] animate-pulse bg-slate-950" />

      <Container>
        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="h-[600px] animate-pulse rounded-3xl bg-slate-200" />

          <div className="space-y-5">
            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-56 animate-pulse rounded-3xl bg-slate-200"
                />
              )
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}