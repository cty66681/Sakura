"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import Container from "@/components/layout/Container";

interface LanguageSchool {
  id: number;
  name: string;

  // =========================================================
  // 地区数据统一
  // =========================================================
  prefecture: string;
  city: string;

  tuition: number;
  tuitionText: string;
  type: string;
  rating: number;
  foreignerRating: number;
  risk: "低风险" | "需要注意";
  chineseSupport: boolean;
  universitySupport: boolean;
  graduateSupport: boolean;
  visaSupport: boolean;
  tags: string[];
}

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| GET /api/language-schools
|
| Query:
| q
| region          // 都道府县，例如：东京 / 爱知 / 大阪
| sort
| quick
| type
| support
| page
|
| 后端学校地址建议：
|
| {
|   prefecture: "爱知",
|   city: "名古屋市"
| }
|
| 不再使用：
| area: "名古屋"
|
|--------------------------------------------------------------------------
*/

const schools: LanguageSchool[] = [
  {
    id: 1,
    name: "东京中央日本语学院",
    prefecture: "东京",
    city: "新宿区",
    tuition: 780000,
    tuitionText: "约 ¥780,000 / 年",
    type: "升学型",
    rating: 4.6,
    foreignerRating: 4.8,
    risk: "低风险",
    chineseSupport: true,
    universitySupport: true,
    graduateSupport: true,
    visaSupport: true,
    tags: [
      "升学指导",
      "留学生支持",
      "交通方便",
    ],
  },

  {
    id: 2,
    name: "东京国际日本语学院",
    prefecture: "东京",
    city: "新宿区",
    tuition: 820000,
    tuitionText: "约 ¥820,000 / 年",
    type: "升学型",
    rating: 4.5,
    foreignerRating: 4.7,
    risk: "低风险",
    chineseSupport: true,
    universitySupport: true,
    graduateSupport: true,
    visaSupport: true,
    tags: [
      "大学升学",
      "大学院升学",
      "奖学金",
    ],
  },

  {
    id: 3,
    name: "大阪国际日本语学校",
    prefecture: "大阪",
    city: "大阪市",
    tuition: 720000,
    tuitionText: "约 ¥720,000 / 年",
    type: "综合型",
    rating: 4.4,
    foreignerRating: 4.6,
    risk: "需要注意",
    chineseSupport: true,
    universitySupport: true,
    graduateSupport: false,
    visaSupport: true,
    tags: [
      "学费较低",
      "升学指导",
      "留学生支持",
    ],
  },

  {
    id: 4,
    name: "京都日本语学院",
    prefecture: "京都",
    city: "京都市",
    tuition: 760000,
    tuitionText: "约 ¥760,000 / 年",
    type: "升学型",
    rating: 4.7,
    foreignerRating: 4.7,
    risk: "低风险",
    chineseSupport: true,
    universitySupport: true,
    graduateSupport: true,
    visaSupport: true,
    tags: [
      "大学升学",
      "京都生活",
      "国际交流",
    ],
  },

  {
    id: 5,
    name: "名古屋国际日本语学校",
    prefecture: "爱知",
    city: "名古屋市",
    tuition: 690000,
    tuitionText: "约 ¥690,000 / 年",
    type: "综合型",
    rating: 4.3,
    foreignerRating: 4.5,
    risk: "低风险",
    chineseSupport: true,
    universitySupport: true,
    graduateSupport: false,
    visaSupport: true,
    tags: [
      "学费较低",
      "就业支持",
      "生活成本低",
    ],
  },

  {
    id: 6,
    name: "福冈国际日本语学校",
    prefecture: "福冈",
    city: "福冈市",
    tuition: 650000,
    tuitionText: "约 ¥650,000 / 年",
    type: "综合型",
    rating: 4.4,
    foreignerRating: 4.6,
    risk: "低风险",
    chineseSupport: true,
    universitySupport: true,
    graduateSupport: false,
    visaSupport: true,
    tags: [
      "生活成本低",
      "就业支持",
      "留学生支持",
    ],
  },

  {
    id: 7,
    name: "北海道日本语教育中心",
    prefecture: "北海道",
    city: "札幌市",
    tuition: 680000,
    tuitionText: "约 ¥680,000 / 年",
    type: "综合型",
    rating: 4.2,
    foreignerRating: 4.5,
    risk: "低风险",
    chineseSupport: true,
    universitySupport: true,
    graduateSupport: false,
    visaSupport: true,
    tags: [
      "生活成本低",
      "留学生支持",
      "国际交流",
    ],
  },

  {
    id: 8,
    name: "东京新宿日本语学院",
    prefecture: "东京",
    city: "新宿区",
    tuition: 750000,
    tuitionText: "约 ¥750,000 / 年",
    type: "就业型",
    rating: 4.1,
    foreignerRating: 4.4,
    risk: "需要注意",
    chineseSupport: true,
    universitySupport: false,
    graduateSupport: false,
    visaSupport: true,
    tags: [
      "就业指导",
      "兼职支持",
      "交通方便",
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

const quickFilters = [
  {
    key: "cheap",
    label: "💰 学费较低",
  },
  {
    key: "university",
    label: "🎓 大学升学",
  },
  {
    key: "chinese",
    label: "🇨🇳 中文支持",
  },
  {
    key: "foreigner",
    label: "🌏 外国人友好",
  },
  {
    key: "safe",
    label: "🟢 避坑优先",
  },
];

const schoolTypes = [
  "升学型",
  "综合型",
  "就业型",
];

const supportOptions = [
  {
    key: "chinese",
    label: "中文支持",
  },
  {
    key: "university",
    label: "大学升学指导",
  },
  {
    key: "graduate",
    label: "大学院升学指导",
  },
  {
    key: "visa",
    label: "签证支持",
  },
];

const PAGE_SIZE = 6;

export default function LanguageSchoolPage() {
  return (
    <Suspense fallback={<LanguageSchoolLoading />}>
      <LanguageSchoolPageContent />
    </Suspense>
  );
}

function LanguageSchoolPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keyword =
    searchParams.get("q") ?? "";

  const region =
    searchParams.get("region") ?? "全部";

  const sort =
    searchParams.get("sort") ?? "recommended";

  const quickFilter =
    searchParams.get("quick") ?? null;

  const selectedTypes = useMemo(() => {
    const value =
      searchParams.get("type");

    if (!value) {
      return [];
    }

    return value
      .split(",")
      .filter((item) =>
        schoolTypes.includes(item)
      );
  }, [searchParams]);

  const selectedSupports = useMemo(() => {
    const value =
      searchParams.get("support");

    if (!value) {
      return [];
    }

    return value
      .split(",")
      .filter((item) =>
        supportOptions.some(
          (option) =>
            option.key === item
        )
      );
  }, [searchParams]);

  const rawPage = Number(
    searchParams.get("page") ?? "1"
  );

  const page =
    Number.isFinite(rawPage) &&
    rawPage >= 1
      ? Math.floor(rawPage)
      : 1;

  const [
    searchInput,
    setSearchInput,
  ] = useState(keyword);

  const searchParamsString =
    searchParams.toString();

  useEffect(() => {
    const params =
      new URLSearchParams(
        searchParamsString
      );

    setSearchInput(
      params.get("q") ?? ""
    );
  }, [searchParamsString]);

  const updateQuery = useCallback(
    (
      updates: Record<
        string,
        string | null | undefined
      >
    ) => {
      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      Object.entries(updates).forEach(
        ([key, value]) => {
          const shouldDelete =
            value === null ||
            value === undefined ||
            value === "" ||
            value === "全部" ||
            (key === "sort" &&
              value === "recommended") ||
            (key === "page" &&
              value === "1");

          if (shouldDelete) {
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
    },
    [
      pathname,
      router,
      searchParams,
    ]
  );

  /* =========================================================
     搜索
  ========================================================= */

  const handleSearch = () => {
    updateQuery({
      q:
        searchInput.trim() ||
        null,
      page: null,
    });
  };

  const handleSearchKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");

    updateQuery({
      q: null,
      page: null,
    });
  };

  /* =========================================================
     地区
  ========================================================= */

  const changeRegion = (
    value: string
  ) => {
    updateQuery({
      region:
        value === "全部"
          ? null
          : value,
      page: null,
    });
  };

  /* =========================================================
     QUICK FILTER
  ========================================================= */

  const changeQuickFilter = (
    key: string
  ) => {
    updateQuery({
      quick:
        quickFilter === key
          ? null
          : key,
      page: null,
    });
  };

  /* =========================================================
     TYPE
  ========================================================= */

  const toggleType = (
    type: string
  ) => {
    const nextTypes =
      selectedTypes.includes(type)
        ? selectedTypes.filter(
            (item) =>
              item !== type
          )
        : [
            ...selectedTypes,
            type,
          ];

    updateQuery({
      type:
        nextTypes.length > 0
          ? nextTypes.join(",")
          : null,
      page: null,
    });
  };

  /* =========================================================
     SUPPORT
  ========================================================= */

  const toggleSupport = (
    key: string
  ) => {
    const nextSupports =
      selectedSupports.includes(key)
        ? selectedSupports.filter(
            (item) =>
              item !== key
          )
        : [
            ...selectedSupports,
            key,
          ];

    updateQuery({
      support:
        nextSupports.length > 0
          ? nextSupports.join(",")
          : null,
      page: null,
    });
  };

  const clearAllFilters = () => {
    setSearchInput("");

    router.replace(
      pathname,
      {
        scroll: false,
      }
    );
  };

  /* =========================================================
     FILTER DATA
  ========================================================= */

  const filteredSchools = useMemo(() => {
    let result = [...schools];

    if (keyword.trim()) {
      const normalizedKeyword =
        keyword
          .trim()
          .toLowerCase();

      result = result.filter(
        (school) =>
          [
            school.name,
            school.prefecture,
            school.city,
            school.type,
            ...school.tags,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              normalizedKeyword
            )
      );
    }

    /*
     * region 现在严格对应 prefecture。
     *
     * 例如：
     * ?region=东京
     * ?region=爱知
     * ?region=北海道
     */
    if (region !== "全部") {
      result = result.filter(
        (school) =>
          school.prefecture ===
          region
      );
    }

    if (
      selectedTypes.length > 0
    ) {
      result = result.filter(
        (school) =>
          selectedTypes.includes(
            school.type
          )
      );
    }

    if (
      selectedSupports.length > 0
    ) {
      result = result.filter(
        (school) =>
          selectedSupports.every(
            (support) => {
              if (
                support ===
                "chinese"
              ) {
                return school.chineseSupport;
              }

              if (
                support ===
                "university"
              ) {
                return school.universitySupport;
              }

              if (
                support ===
                "graduate"
              ) {
                return school.graduateSupport;
              }

              if (
                support ===
                "visa"
              ) {
                return school.visaSupport;
              }

              return true;
            }
          )
      );
    }

    if (
      quickFilter === "cheap"
    ) {
      result = result.filter(
        (school) =>
          school.tuition <=
          700000
      );
    }

    if (
      quickFilter ===
      "university"
    ) {
      result = result.filter(
        (school) =>
          school.universitySupport
      );
    }

    if (
      quickFilter === "chinese"
    ) {
      result = result.filter(
        (school) =>
          school.chineseSupport
      );
    }

    if (
      quickFilter ===
      "foreigner"
    ) {
      result = result.filter(
        (school) =>
          school.foreignerRating >=
          4.7
      );
    }

    if (
      quickFilter === "safe"
    ) {
      result = result.filter(
        (school) =>
          school.risk ===
          "低风险"
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          b.rating - a.rating
      );
    }

    if (
      sort === "foreigner"
    ) {
      result.sort(
        (a, b) =>
          b.foreignerRating -
          a.foreignerRating
      );
    }

    if (
      sort === "tuition"
    ) {
      result.sort(
        (a, b) =>
          a.tuition -
          b.tuition
      );
    }

    return result;
  }, [
    keyword,
    region,
    selectedTypes,
    selectedSupports,
    quickFilter,
    sort,
  ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(
    filteredSchools.length /
      PAGE_SIZE
  );

  const currentPage =
    totalPages === 0
      ? 1
      : Math.min(
          page,
          totalPages
        );

  useEffect(() => {
    if (
      totalPages > 0 &&
      page > totalPages
    ) {
      updateQuery({
        page:
          totalPages === 1
            ? null
            : String(
                totalPages
              ),
      });
    }
  }, [
    page,
    totalPages,
    updateQuery,
  ]);

  const currentSchools =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        PAGE_SIZE;

      return filteredSchools.slice(
        start,
        start + PAGE_SIZE
      );
    }, [
      currentPage,
      filteredSchools,
    ]);

  const startItem =
    filteredSchools.length === 0
      ? 0
      : (currentPage - 1) *
          PAGE_SIZE +
        1;

  const endItem =
    Math.min(
      currentPage *
        PAGE_SIZE,
      filteredSchools.length
    );

  const changePage = (
    nextPage: number
  ) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === currentPage
    ) {
      return;
    }

    updateQuery({
      page:
        nextPage === 1
          ? null
          : String(nextPage),
    });

    requestAnimationFrame(() => {
      document
        .getElementById(
          "language-results"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-slate-950 text-white">
        <Container>
          <div className="px-4 py-16">
            <div className="max-w-3xl">
              <div className="mb-4 text-sm font-semibold text-emerald-400">
                🇯🇵 LANGUAGE SCHOOL
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                找到适合你的{" "}
                <span className="text-emerald-400">
                  日本语言学校
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                学费、升学方向、留学生支持、外国人友好度，
                以及最重要的学校避坑信息，一站查看。
              </p>
            </div>

            {/* Search */}

            <div className="mt-10 max-w-3xl">
              <div className="flex overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex flex-1 items-center">
                  <span className="px-4 text-xl">
                    🔍
                  </span>

                  <input
                    value={
                      searchInput
                    }
                    onChange={(e) =>
                      setSearchInput(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleSearchKeyDown
                    }
                    placeholder="搜索学校、都道府县、城市、升学方向..."
                    className="w-full bg-transparent py-4 pr-4 text-sm text-slate-900 outline-none"
                  />

                  {searchInput && (
                    <button
                      type="button"
                      onClick={
                        clearSearch
                      }
                      className="mr-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={
                    handleSearch
                  }
                  className="bg-emerald-500 px-7 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  搜索
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          QUICK MATCH
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <Container>
          <div className="px-4 py-6">
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-semibold text-slate-900">
                快速匹配
              </h2>

              <span className="text-xs text-slate-400">
                选择你最在意的条件
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {quickFilters.map(
                (filter) => {
                  const active =
                    quickFilter ===
                    filter.key;

                  return (
                    <button
                      key={
                        filter.key
                      }
                      type="button"
                      onClick={() =>
                        changeQuickFilter(
                          filter.key
                        )
                      }
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        transition
                        ${
                          active
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                        }
                      `}
                    >
                      {
                        filter.label
                      }
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section
        id="language-results"
        className="scroll-mt-24 py-10"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
              {/* 都道府县 */}

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    都道府县
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    日本全国 47 都道府县
                  </p>
                </div>

                {region !==
                  "全部" && (
                  <button
                    type="button"
                    onClick={() =>
                      changeRegion(
                        "全部"
                      )
                    }
                    className="text-xs font-semibold text-emerald-600"
                  >
                    重置
                  </button>
                )}
              </div>

              <select
                value={
                  region
                }
                onChange={(e) =>
                  changeRegion(
                    e.target.value
                  )
                }
                className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
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
                <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-3">
                  <p className="text-xs text-emerald-600">
                    当前地区
                  </p>

                  <p className="mt-1 text-sm font-bold text-emerald-700">
                    📍 {region}
                  </p>
                </div>
              )}

              <div className="my-6 border-t border-slate-100" />

              {/* 学校方向 */}

              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                  学校方向
                </h2>

                {selectedTypes.length >
                  0 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateQuery({
                        type: null,
                        page: null,
                      })
                    }
                    className="text-xs text-emerald-600"
                  >
                    重置
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {schoolTypes.map(
                  (type) => (
                    <label
                      key={type}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(
                          type
                        )}
                        onChange={() =>
                          toggleType(
                            type
                          )
                        }
                        className="rounded accent-emerald-600"
                      />

                      {type}
                    </label>
                  )
                )}
              </div>

              <div className="my-6 border-t border-slate-100" />

              {/* 留学生支持 */}

              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                  留学生支持
                </h2>

                {selectedSupports.length >
                  0 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateQuery({
                        support:
                          null,
                        page: null,
                      })
                    }
                    className="text-xs text-emerald-600"
                  >
                    重置
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                {supportOptions.map(
                  (option) => (
                    <label
                      key={
                        option.key
                      }
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSupports.includes(
                          option.key
                        )}
                        onChange={() =>
                          toggleSupport(
                            option.key
                          )
                        }
                        className="rounded accent-emerald-600"
                      />

                      {
                        option.label
                      }
                    </label>
                  )
                )}
              </div>

              <div className="my-6 border-t border-slate-100" />

              <button
                type="button"
                onClick={
                  clearAllFilters
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600"
              >
                清除全部筛选
              </button>
            </aside>

            {/* =================================================
                RESULTS
            ================================================= */}

            <div className="flex min-h-[1050px] flex-col">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {region ===
                    "全部"
                      ? "日本语言学校"
                      : `${region}语言学校`}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    找到{" "}
                    <span className="font-semibold text-emerald-600">
                      {
                        filteredSchools.length
                      }
                    </span>{" "}
                    所学校

                    {filteredSchools.length >
                      0 && (
                      <span className="ml-3 text-xs text-slate-400">
                        当前显示{" "}
                        {startItem}-
                        {endItem}
                      </span>
                    )}
                  </p>
                </div>

                <select
                  value={sort}
                  onChange={(e) =>
                    updateQuery({
                      sort:
                        e.target
                          .value ===
                        "recommended"
                          ? null
                          : e.target
                              .value,
                      page: null,
                    })
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-emerald-400"
                >
                  <option value="recommended">
                    推荐排序
                  </option>

                  <option value="rating">
                    评分最高
                  </option>

                  <option value="foreigner">
                    外国人友好度
                  </option>

                  <option value="tuition">
                    学费最低
                  </option>
                </select>
              </div>

              {/* School Cards */}

              {currentSchools.length >
              0 ? (
                <>
                  <div className="flex-1 space-y-5">
                    {currentSchools.map(
                      (school) => (
                        <Link
                          key={
                            school.id
                          }
                          href={`/schools/language/${school.id}`}
                          className="group block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                        >
                          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-xl font-bold text-slate-900 transition group-hover:text-emerald-600">
                                  {
                                    school.name
                                  }
                                </h3>

                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                  {
                                    school.type
                                  }
                                </span>
                              </div>

                              <p className="mt-3 text-sm text-slate-500">
                                📍{" "}
                                {
                                  school.prefecture
                                }{" "}
                                ·{" "}
                                {
                                  school.city
                                }
                              </p>

                              <p className="mt-2 text-sm font-medium text-slate-700">
                                💰{" "}
                                {
                                  school.tuitionText
                                }
                              </p>

                              <div className="mt-5 flex flex-wrap gap-2">
                                {school.tags.map(
                                  (
                                    tag
                                  ) => (
                                    <span
                                      key={
                                        tag
                                      }
                                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                                    >
                                      {
                                        tag
                                      }
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="shrink-0 md:text-right">
                              <div className="text-xl font-bold text-amber-500">
                                ⭐{" "}
                                {
                                  school.rating
                                }
                              </div>

                              <div className="mt-2 text-sm text-slate-500">
                                外国人友好度
                              </div>

                              <div className="font-semibold text-slate-800">
                                ⭐{" "}
                                {
                                  school.foreignerRating
                                }
                              </div>

                              <div className="mt-4">
                                <span
                                  className={`
                                    rounded-full
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    ${
                                      school.risk ===
                                      "低风险"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "bg-orange-50 text-orange-600"
                                    }
                                  `}
                                >
                                  {school.risk ===
                                  "低风险"
                                    ? "🟢"
                                    : "🟡"}{" "}
                                  {
                                    school.risk
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    )}
                  </div>

                  {/* Pagination */}

                  {totalPages >
                    1 && (
                    <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-10">
                      <button
                        type="button"
                        disabled={
                          currentPage ===
                          1
                        }
                        onClick={() =>
                          changePage(
                            currentPage -
                              1
                          )
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ← 上一页
                      </button>

                      {Array.from(
                        {
                          length:
                            totalPages,
                        },
                        (
                          _,
                          index
                        ) =>
                          index + 1
                      ).map(
                        (number) => (
                          <button
                            key={
                              number
                            }
                            type="button"
                            onClick={() =>
                              changePage(
                                number
                              )
                            }
                            className={`
                              h-10
                              w-10
                              rounded-xl
                              text-sm
                              font-medium
                              transition
                              ${
                                currentPage ===
                                number
                                  ? "bg-emerald-600 text-white"
                                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-600"
                              }
                            `}
                          >
                            {
                              number
                            }
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        onClick={() =>
                          changePage(
                            currentPage +
                              1
                          )
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        下一页 →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                  <div className="text-4xl">
                    🔍
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    暂时没有找到符合条件的语言学校
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    当前 Mock 数据还没有覆盖日本全部地区。
                    <br />
                    地区筛选结构已经支持全国 47 都道府县，
                    后续接入真实学校数据库后会自动显示对应学校。
                  </p>

                  <button
                    type="button"
                    onClick={
                      clearAllFilters
                    }
                    className="mt-5 text-sm font-semibold text-emerald-600"
                  >
                    清除所有条件
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function LanguageSchoolLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="h-[360px] animate-pulse bg-slate-950" />

      <Container>
        <div className="grid gap-8 px-4 py-10 lg:grid-cols-[260px_1fr]">
          <div className="h-[650px] animate-pulse rounded-2xl bg-white" />

          <div className="space-y-5">
            <div className="h-[230px] animate-pulse rounded-2xl bg-white" />

            <div className="h-[230px] animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </Container>
    </main>
  );
}