"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";

interface LanguageSchool {
  id: number;
  name: string;
  location: string;
  area: string;
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

const schools: LanguageSchool[] = [
  {
    id: 1,
    name: "东京中央日本语学院",
    location: "东京 · 新宿",
    area: "东京",
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
    location: "东京 · 新宿",
    area: "东京",
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
    location: "大阪 · 大阪市",
    area: "大阪",
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
    location: "京都 · 京都市",
    area: "京都",
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
    location: "名古屋 · 中区",
    area: "名古屋",
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
    location: "福冈 · 博多",
    area: "福冈",
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
    location: "北海道 · 札幌",
    area: "北海道",
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
    location: "东京 · 新宿",
    area: "东京",
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

const regions = [
  "全部",
  "东京",
  "大阪",
  "京都",
  "名古屋",
  "福冈",
  "北海道",
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

const PAGE_SIZE = 6;

export default function LanguageSchoolPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("全部");
  const [sort, setSort] = useState("recommended");
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filteredSchools = useMemo(() => {
    let result = [...schools];

    // 搜索
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();

      result = result.filter((school) =>
        [
          school.name,
          school.location,
          school.area,
          school.type,
          ...school.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      );
    }

    // 地区
    if (region !== "全部") {
      result = result.filter(
        (school) => school.area === region
      );
    }

    // 快速筛选
    if (quickFilter === "cheap") {
      result = result.filter(
        (school) => school.tuition <= 700000
      );
    }

    if (quickFilter === "university") {
      result = result.filter(
        (school) => school.universitySupport
      );
    }

    if (quickFilter === "chinese") {
      result = result.filter(
        (school) => school.chineseSupport
      );
    }

    if (quickFilter === "foreigner") {
      result = result.filter(
        (school) => school.foreignerRating >= 4.7
      );
    }

    if (quickFilter === "safe") {
      result = result.filter(
        (school) => school.risk === "低风险"
      );
    }

    // 排序
    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sort === "foreigner") {
      result.sort(
        (a, b) =>
          b.foreignerRating - a.foreignerRating
      );
    }

    if (sort === "tuition") {
      result.sort(
        (a, b) => a.tuition - b.tuition
      );
    }

    return result;
  }, [search, region, quickFilter, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSchools.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const currentSchools = filteredSchools.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function changeRegion(value: string) {
    setRegion(value);
    setPage(1);
  }

  function changeQuickFilter(key: string) {
    setQuickFilter(
      quickFilter === key ? null : key
    );
    setPage(1);
  }

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">

      {/* Hero */}

      <section className="bg-slate-950 text-white">

        <Container>

          <div className="px-4 py-16">

            <div className="max-w-3xl">

              <div className="mb-4 text-sm font-semibold text-emerald-400">
                🇯🇵 LANGUAGE SCHOOL
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                找到适合你的
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
                    value={search}
                    onChange={(e) =>
                      changeSearch(e.target.value)
                    }
                    placeholder="搜索学校、地区、升学方向..."
                    className="
                      w-full
                      bg-transparent
                      py-4
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                    "
                  />

                </div>

                <button
                  onClick={() => setPage(1)}
                  className="
                    bg-emerald-500
                    px-7
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-emerald-600
                  "
                >
                  搜索
                </button>

              </div>

            </div>

          </div>

        </Container>

      </section>


      {/* Quick Match */}

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

              {quickFilters.map((filter) => {

                const active =
                  quickFilter === filter.key;

                return (
                  <button
                    key={filter.key}
                    onClick={() =>
                      changeQuickFilter(filter.key)
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
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                      }
                    `}
                  >
                    {filter.label}
                  </button>
                );
              })}

            </div>

          </div>

        </Container>

      </section>


      {/* Main */}

      <section className="py-10">

        <Container>

          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

            {/* Sidebar */}

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex items-center justify-between">

                <h2 className="font-semibold text-slate-900">
                  地区
                </h2>

                {region !== "全部" && (
                  <button
                    onClick={() => changeRegion("全部")}
                    className="text-xs text-blue-600"
                  >
                    重置
                  </button>
                )}

              </div>

              <div className="mt-5 space-y-1">

                {regions.map((item) => (

                  <button
                    key={item}
                    onClick={() => changeRegion(item)}
                    className={`
                      w-full
                      rounded-xl
                      px-4
                      py-3
                      text-left
                      text-sm
                      transition
                      ${
                        region === item
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }
                    `}
                  >
                    {item}
                  </button>

                ))}

              </div>

              <div className="my-6 border-t border-slate-100" />

              <h2 className="font-semibold text-slate-900">
                学校方向
              </h2>

              <div className="mt-4 space-y-3 text-sm text-slate-600">

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  升学型
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  综合型
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  就业型
                </label>

              </div>

              <div className="my-6 border-t border-slate-100" />

              <h2 className="font-semibold text-slate-900">
                留学生支持
              </h2>

              <div className="mt-4 space-y-3 text-sm text-slate-600">

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  中文支持
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  升学指导
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  签证支持
                </label>

              </div>

            </aside>


            {/* Results */}

            <div>

              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    日本语言学校
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    找到 {filteredSchools.length} 所学校
                  </p>

                </div>

                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-slate-600
                    outline-none
                  "
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

              {currentSchools.length > 0 ? (

                <div className="space-y-5">

                  {currentSchools.map((school) => (

                    <Link
                      key={school.id}
                      href={`/schools/language/${school.id}`}
                      className="
                        group
                        block
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-6
                        transition
                        hover:-translate-y-1
                        hover:border-blue-200
                        hover:shadow-xl
                      "
                    >

                      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-3">

                            <h3 className="text-xl font-bold text-slate-900">
                              {school.name}
                            </h3>

                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                              {school.type}
                            </span>

                          </div>

                          <p className="mt-3 text-sm text-slate-500">
                            📍 {school.location}
                          </p>

                          <p className="mt-2 text-sm font-medium text-slate-700">
                            💰 {school.tuitionText}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-2">

                            {school.tags.map((tag) => (

                              <span
                                key={tag}
                                className="
                                  rounded-lg
                                  bg-slate-100
                                  px-3
                                  py-1.5
                                  text-xs
                                  text-slate-600
                                "
                              >
                                {tag}
                              </span>

                            ))}

                          </div>

                        </div>


                        {/* Score */}

                        <div className="shrink-0 md:text-right">

                          <div className="text-xl font-bold text-amber-500">
                            ⭐ {school.rating}
                          </div>

                          <div className="mt-2 text-sm text-slate-500">
                            外国人友好度
                          </div>

                          <div className="font-semibold text-slate-800">
                            ⭐ {school.foreignerRating}
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
                                  school.risk === "低风险"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-orange-50 text-orange-600"
                                }
                              `}
                            >
                              {school.risk === "低风险"
                                ? "🟢"
                                : "🟡"}{" "}
                              {school.risk}
                            </span>

                          </div>

                        </div>

                      </div>

                    </Link>

                  ))}

                </div>

              ) : (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

                  <div className="text-4xl">
                    🔍
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-900">
                    没有找到符合条件的学校
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    可以尝试更换地区或搜索关键词。
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setRegion("全部");
                      setQuickFilter(null);
                      setPage(1);
                    }}
                    className="mt-5 text-sm font-semibold text-blue-600"
                  >
                    清除所有条件
                  </button>

                </div>

              )}


              {/* Pagination */}

              {totalPages > 1 && (

                <div className="mt-8 flex items-center justify-center gap-2">

                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setPage((value) =>
                        Math.max(1, value - 1)
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      text-slate-600
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    ← 上一页
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((number) => (

                    <button
                      key={number}
                      onClick={() => setPage(number)}
                      className={`
                        h-10
                        w-10
                        rounded-xl
                        text-sm
                        font-medium
                        transition
                        ${
                          currentPage === number
                            ? "bg-blue-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                        }
                      `}
                    >
                      {number}
                    </button>

                  ))}

                  <button
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setPage((value) =>
                        Math.min(
                          totalPages,
                          value + 1
                        )
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      text-slate-600
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    下一页 →
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