"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import UniversityHero from "@/components/schools/university/UniversityHero";
import UniversityCard from "@/components/schools/university/UniversityCard";

interface University {
  id: string;
  name: string;
  image: string;
  location: string;
  type: "国立大学" | "公立大学" | "私立大学";
  degree: "大学" | "大学院";
  qs: number;
  hensachi: number;
  tuition: string;
  tuitionNumber: number;
  eju: boolean;
  rating: number;
  tags: string[];
  categories: string[];
}

const PAGE_SIZE = 6;

const universities: University[] = [
  {
    id: "tokyo",
    name: "东京大学",
    image: "/images/university/university01.jpg",
    location: "东京",
    type: "国立大学",
    degree: "大学",
    qs: 28,
    hensachi: 72,
    tuition: "535,800円/年",
    tuitionNumber: 535800,
    eju: true,
    rating: 4.9,
    tags: ["计算机", "AI", "医学", "奖学金", "英语课程"],
    categories: ["理科", "医学"],
  },
  {
    id: "waseda",
    name: "早稻田大学",
    image: "/images/university/university01.jpg",
    location: "东京",
    type: "私立大学",
    degree: "大学",
    qs: 181,
    hensachi: 70,
    tuition: "1,100,000円/年",
    tuitionNumber: 1100000,
    eju: true,
    rating: 4.8,
    tags: ["商科", "传媒", "法学", "留学生宿舍"],
    categories: ["文科", "艺术"],
  },
  {
    id: "kyoto",
    name: "京都大学",
    image: "/images/university/university01.jpg",
    location: "京都",
    type: "国立大学",
    degree: "大学",
    qs: 46,
    hensachi: 71,
    tuition: "535,800円/年",
    tuitionNumber: 535800,
    eju: true,
    rating: 4.8,
    tags: ["理工", "医学", "研究型", "奖学金"],
    categories: ["理科", "医学"],
  },
  {
    id: "osaka",
    name: "大阪大学",
    image: "/images/university/university01.jpg",
    location: "大阪",
    type: "国立大学",
    degree: "大学",
    qs: 80,
    hensachi: 68,
    tuition: "535,800円/年",
    tuitionNumber: 535800,
    eju: true,
    rating: 4.7,
    tags: ["工学", "医学", "国际交流"],
    categories: ["理科", "医学"],
  },
  {
    id: "yokohama",
    name: "横滨市立大学",
    image: "/images/university/university01.jpg",
    location: "神奈川",
    type: "公立大学",
    degree: "大学",
    qs: 450,
    hensachi: 63,
    tuition: "557,400円/年",
    tuitionNumber: 557400,
    eju: true,
    rating: 4.5,
    tags: ["国际商学", "医学", "数据科学"],
    categories: ["文科", "理科", "医学"],
  },
  {
    id: "nagoya",
    name: "名古屋大学",
    image: "/images/university/university01.jpg",
    location: "爱知",
    type: "国立大学",
    degree: "大学院",
    qs: 118,
    hensachi: 67,
    tuition: "535,800円/年",
    tuitionNumber: 535800,
    eju: false,
    rating: 4.7,
    tags: ["大学院", "研究型", "工学", "奖学金"],
    categories: ["理科"],
  },
  {
    id: "kyushu",
    name: "九州大学",
    image: "/images/university/university01.jpg",
    location: "福冈",
    type: "国立大学",
    degree: "大学院",
    qs: 167,
    hensachi: 66,
    tuition: "535,800円/年",
    tuitionNumber: 535800,
    eju: false,
    rating: 4.6,
    tags: ["大学院", "工学", "国际项目"],
    categories: ["理科"],
  },
];

const regions = [
  "全部",
  "东京",
  "大阪",
  "京都",
  "神奈川",
  "爱知",
  "福冈",
];

const topFilters = [
  "全部",
  "国立大学",
  "公立大学",
  "私立大学",
  "大学院",
  "QS排名",
  "EJU",
  "文科",
  "理科",
  "医学",
  "艺术",
];

export default function UniversityPage() {
  return (
    <Suspense fallback={<UniversityPageLoading />}>
      <UniversityPageContent />
    </Suspense>
  );
}

function UniversityPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* =========================================================
     URL = 筛选状态
  ========================================================= */

  const keyword = searchParams.get("q") ?? "";

  const selectedRegion =
    searchParams.get("region") ?? "全部";

  const selectedType =
    searchParams.get("type") ?? "全部";

  const degree =
    searchParams.get("degree") ?? "全部";

  const category =
    searchParams.get("category") ?? "全部";

  const qsFilter =
    searchParams.get("qs") ?? "全部";

  const ejuFilter =
    searchParams.get("eju") ?? "全部";

  const tuitionFilter =
    searchParams.get("tuition") ?? "全部";

  const sort =
    searchParams.get("sort") ?? "recommended";

  const rawPage = Number(searchParams.get("page") ?? "1");

  const currentPage =
    Number.isFinite(rawPage) && rawPage >= 1
      ? Math.floor(rawPage)
      : 1;

  /* =========================================================
     搜索框输入
  ========================================================= */

  const [keywordInput, setKeywordInput] =
    useState(keyword);

  const searchParamsString = searchParams.toString();

  useEffect(() => {
    setKeywordInput(
      new URLSearchParams(searchParamsString).get("q") ??
        ""
    );
  }, [searchParamsString]);

  /* =========================================================
     修改 URL
  ========================================================= */

  const updateQuery = useCallback(
    (
      updates: Record<
        string,
        string | null | undefined
      >
    ) => {
      const params = new URLSearchParams(
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
            (key === "page" && value === "1");

          if (shouldDelete) {
            params.delete(key);
          } else {
            params.set(key, value);
          }
        }
      );

      const query = params.toString();

      const nextUrl = query
        ? `${pathname}?${query}`
        : pathname;

      router.replace(nextUrl, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  /* =========================================================
     搜索
  ========================================================= */

  const handleSearch = () => {
    updateQuery({
      q: keywordInput.trim() || null,
      page: null,
    });
  };

  const handleClearSearch = () => {
    setKeywordInput("");

    updateQuery({
      q: null,
      page: null,
    });
  };

  /* =========================================================
     顶部快捷筛选
  ========================================================= */

  const handleTopFilter = (value: string) => {
    const updates: Record<
      string,
      string | null
    > = {
      type: null,
      degree: null,
      category: null,
      qs: null,
      eju: null,
      page: null,
    };

    if (
      value === "国立大学" ||
      value === "公立大学" ||
      value === "私立大学"
    ) {
      updates.type = value;
    }

    if (value === "大学院") {
      updates.degree = "大学院";
    }

    if (value === "QS排名") {
      updates.qs = "100";
    }

    if (value === "EJU") {
      updates.eju = "需要";
    }

    if (
      value === "文科" ||
      value === "理科" ||
      value === "医学" ||
      value === "艺术"
    ) {
      updates.category = value;
    }

    updateQuery(updates);
  };

  const activeTopFilter = useMemo(() => {
    if (selectedType !== "全部") {
      return selectedType;
    }

    if (degree === "大学院") {
      return "大学院";
    }

    if (qsFilter === "100") {
      return "QS排名";
    }

    if (ejuFilter === "需要") {
      return "EJU";
    }

    if (category !== "全部") {
      return category;
    }

    return "全部";
  }, [
    selectedType,
    degree,
    qsFilter,
    ejuFilter,
    category,
  ]);

  /* =========================================================
     数据筛选
  ========================================================= */

  const filteredUniversities = useMemo(() => {
    let result = [...universities];

    if (keyword.trim()) {
      const q = keyword
        .trim()
        .toLowerCase();

      result = result.filter((school) =>
        [
          school.name,
          school.location,
          school.type,
          school.degree,
          ...school.tags,
          ...school.categories,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (selectedRegion !== "全部") {
      result = result.filter(
        (school) =>
          school.location === selectedRegion
      );
    }

    if (selectedType !== "全部") {
      result = result.filter(
        (school) =>
          school.type === selectedType
      );
    }

    if (degree !== "全部") {
      result = result.filter(
        (school) =>
          school.degree === degree
      );
    }

    if (category !== "全部") {
      result = result.filter((school) =>
        school.categories.includes(category)
      );
    }

    if (qsFilter === "50") {
      result = result.filter(
        (school) => school.qs <= 50
      );
    }

    if (qsFilter === "100") {
      result = result.filter(
        (school) => school.qs <= 100
      );
    }

    if (qsFilter === "200") {
      result = result.filter(
        (school) => school.qs <= 200
      );
    }

    if (ejuFilter === "需要") {
      result = result.filter(
        (school) => school.eju
      );
    }

    if (ejuFilter === "无需") {
      result = result.filter(
        (school) => !school.eju
      );
    }

    if (tuitionFilter === "60万以下") {
      result = result.filter(
        (school) =>
          school.tuitionNumber <= 600000
      );
    }

    if (tuitionFilter === "60-100万") {
      result = result.filter(
        (school) =>
          school.tuitionNumber > 600000 &&
          school.tuitionNumber <= 1000000
      );
    }

    if (tuitionFilter === "100万以上") {
      result = result.filter(
        (school) =>
          school.tuitionNumber > 1000000
      );
    }

    if (sort === "qs") {
      result.sort(
        (a, b) => a.qs - b.qs
      );
    }

    if (sort === "tuition") {
      result.sort(
        (a, b) =>
          a.tuitionNumber -
          b.tuitionNumber
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          b.rating - a.rating
      );
    }

    return result;
  }, [
    keyword,
    selectedRegion,
    selectedType,
    degree,
    category,
    qsFilter,
    ejuFilter,
    tuitionFilter,
    sort,
  ]);

  /* =========================================================
     分页
  ========================================================= */

  const totalPages = Math.ceil(
    filteredUniversities.length /
      PAGE_SIZE
  );

  const safeCurrentPage =
    totalPages === 0
      ? 1
      : Math.min(
          currentPage,
          totalPages
        );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      updateQuery({
        page:
          totalPages === 1
            ? null
            : String(totalPages),
      });
    }
  }, [
    currentPage,
    totalPages,
    updateQuery,
  ]);

  const paginatedUniversities =
    useMemo(() => {
      const start =
        (safeCurrentPage - 1) *
        PAGE_SIZE;

      return filteredUniversities.slice(
        start,
        start + PAGE_SIZE
      );
    }, [
      filteredUniversities,
      safeCurrentPage,
    ]);

  const startItem =
    filteredUniversities.length === 0
      ? 0
      : (safeCurrentPage - 1) *
          PAGE_SIZE +
        1;

  const endItem = Math.min(
    safeCurrentPage * PAGE_SIZE,
    filteredUniversities.length
  );

  const handlePageChange = (
    page: number
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === safeCurrentPage
    ) {
      return;
    }

    updateQuery({
      page:
        page === 1
          ? null
          : String(page),
    });

    requestAnimationFrame(() => {
      document
        .getElementById(
          "university-results"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  /* =========================================================
     清空全部筛选
  ========================================================= */

  const clearFilters = () => {
    setKeywordInput("");

    router.replace(pathname, {
      scroll: false,
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <UniversityHero
        keywordInput={keywordInput}
        onKeywordChange={
          setKeywordInput
        }
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {/* =====================================================
          顶部快捷筛选
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-5">
          {topFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                handleTopFilter(item)
              }
              className={`
                shrink-0
                rounded-full
                px-5
                py-2.5
                text-sm
                font-medium
                transition-all
                ${
                  activeTopFilter === item
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          内容
      ===================================================== */}

      <section
        id="university-results"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-10"
      >
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* =================================================
              左侧筛选
          ================================================= */}

          <aside
            className="
              h-fit
              rounded-[28px]
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              lg:sticky
              lg:top-24
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                />

                <h2 className="font-bold text-slate-900">
                  筛选大学
                </h2>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  text-xs
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
                "
              >
                重置
              </button>
            </div>

            {/* 地区 */}

            <FilterSection title="地区">
              <div className="space-y-1">
                {regions.map(
                  (region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() =>
                        updateQuery({
                          region:
                            region ===
                            "全部"
                              ? null
                              : region,
                          page: null,
                        })
                      }
                      className={`
                        w-full
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        transition
                        ${
                          selectedRegion ===
                          region
                            ? "bg-blue-50 font-semibold text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      {region}
                    </button>
                  )
                )}
              </div>
            </FilterSection>

            {/* 学校类型 */}

            <FilterSection title="学校类型">
              {[
                "全部",
                "国立大学",
                "公立大学",
                "私立大学",
              ].map((item) => (
                <RadioOption
                  key={item}
                  label={item}
                  checked={
                    selectedType === item
                  }
                  onChange={() =>
                    updateQuery({
                      type:
                        item === "全部"
                          ? null
                          : item,
                      page: null,
                    })
                  }
                />
              ))}
            </FilterSection>

            {/* 学历 */}

            <FilterSection title="学历">
              {[
                "全部",
                "大学",
                "大学院",
              ].map((item) => (
                <RadioOption
                  key={item}
                  label={item}
                  checked={
                    degree === item
                  }
                  onChange={() =>
                    updateQuery({
                      degree:
                        item === "全部"
                          ? null
                          : item,
                      page: null,
                    })
                  }
                />
              ))}
            </FilterSection>

            {/* 专业 */}

            <FilterSection title="专业方向">
              {[
                "全部",
                "文科",
                "理科",
                "医学",
                "艺术",
              ].map((item) => (
                <RadioOption
                  key={item}
                  label={item}
                  checked={
                    category === item
                  }
                  onChange={() =>
                    updateQuery({
                      category:
                        item === "全部"
                          ? null
                          : item,
                      page: null,
                    })
                  }
                />
              ))}
            </FilterSection>

            {/* QS */}

            <FilterSection title="QS 世界排名">
              <RadioOption
                label="全部"
                checked={
                  qsFilter === "全部"
                }
                onChange={() =>
                  updateQuery({
                    qs: null,
                    page: null,
                  })
                }
              />

              <RadioOption
                label="TOP 50"
                checked={
                  qsFilter === "50"
                }
                onChange={() =>
                  updateQuery({
                    qs: "50",
                    page: null,
                  })
                }
              />

              <RadioOption
                label="TOP 100"
                checked={
                  qsFilter === "100"
                }
                onChange={() =>
                  updateQuery({
                    qs: "100",
                    page: null,
                  })
                }
              />

              <RadioOption
                label="TOP 200"
                checked={
                  qsFilter === "200"
                }
                onChange={() =>
                  updateQuery({
                    qs: "200",
                    page: null,
                  })
                }
              />
            </FilterSection>

            {/* EJU */}

            <FilterSection title="EJU">
              {[
                "全部",
                "需要",
                "无需",
              ].map((item) => (
                <RadioOption
                  key={item}
                  label={
                    item === "需要"
                      ? "需要 EJU"
                      : item === "无需"
                        ? "无需 EJU"
                        : "全部"
                  }
                  checked={
                    ejuFilter === item
                  }
                  onChange={() =>
                    updateQuery({
                      eju:
                        item === "全部"
                          ? null
                          : item,
                      page: null,
                    })
                  }
                />
              ))}
            </FilterSection>

            {/* 学费 */}

            <FilterSection title="学费">
              {[
                "全部",
                "60万以下",
                "60-100万",
                "100万以上",
              ].map((item) => (
                <RadioOption
                  key={item}
                  label={item}
                  checked={
                    tuitionFilter ===
                    item
                  }
                  onChange={() =>
                    updateQuery({
                      tuition:
                        item === "全部"
                          ? null
                          : item,
                      page: null,
                    })
                  }
                />
              ))}
            </FilterSection>
          </aside>

          {/* =================================================
              右侧
          ================================================= */}

          <div className="flex min-h-[1100px] flex-col">
            <div
              className="
                mb-8
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  日本大学・大学院
                </h2>

                <p className="mt-2 text-slate-500">
                  共找到{" "}
                  <span className="font-bold text-blue-600">
                    {
                      filteredUniversities.length
                    }
                  </span>{" "}
                  所学校

                  {filteredUniversities.length >
                    0 && (
                    <span className="ml-3 text-sm text-slate-400">
                      当前显示{" "}
                      {startItem}-
                      {endItem}
                    </span>
                  )}
                </p>
              </div>

              {/* 排序 */}

              <select
                value={sort}
                onChange={(e) =>
                  updateQuery({
                    sort:
                      e.target.value ===
                      "recommended"
                        ? null
                        : e.target
                            .value,
                    page: null,
                  })
                }
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
                  focus:border-blue-400
                "
              >
                <option value="recommended">
                  推荐排序
                </option>

                <option value="qs">
                  QS 排名
                </option>

                <option value="tuition">
                  学费最低
                </option>

                <option value="rating">
                  外国人评价
                </option>
              </select>
            </div>

            {/* =================================================
                Card
            ================================================= */}

            {paginatedUniversities.length >
            0 ? (
              <>
                <div className="flex-1 space-y-8">
                  {paginatedUniversities.map(
                    (school) => (
                      <UniversityCard
                        key={school.id}
                        id={school.id}
                        name={
                          school.name
                        }
                        image={
                          school.image
                        }
                        location={
                          school.location
                        }
                        type={
                          school.type
                        }
                        qs={school.qs}
                        hensachi={
                          school.hensachi
                        }
                        tuition={
                          school.tuition
                        }
                        eju={
                          school.eju
                        }
                        rating={
                          school.rating
                        }
                        tags={
                          school.tags
                        }
                      />
                    )
                  )}
                </div>

                {/* =============================================
                    分页
                ============================================= */}

                {totalPages > 1 && (
                  <div
                    className="
                      mt-auto
                      flex
                      flex-wrap
                      items-center
                      justify-center
                      gap-2
                      pt-10
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        safeCurrentPage ===
                        1
                      }
                      onClick={() =>
                        handlePageChange(
                          safeCurrentPage -
                            1
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
                        font-medium
                        text-slate-600
                        transition
                        hover:border-blue-200
                        hover:text-blue-600
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      上一页
                    </button>

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            page
                          )
                        }
                        className={`
                          flex
                          h-10
                          min-w-10
                          items-center
                          justify-center
                          rounded-xl
                          px-3
                          text-sm
                          font-bold
                          transition
                          ${
                            safeCurrentPage ===
                            page
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                          }
                        `}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={
                        safeCurrentPage ===
                        totalPages
                      }
                      onClick={() =>
                        handlePageChange(
                          safeCurrentPage +
                            1
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
                        font-medium
                        text-slate-600
                        transition
                        hover:border-blue-200
                        hover:text-blue-600
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      下一页
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                className="
                  rounded-[28px]
                  border
                  border-dashed
                  border-slate-300
                  bg-white
                  px-8
                  py-24
                  text-center
                "
              >
                <div className="text-5xl">
                  🎓
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  没有找到符合条件的大学
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  可以调整地区、学校类型、专业或其他筛选条件。
                </p>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="
                    mt-6
                    rounded-xl
                    bg-blue-600
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  清除筛选条件
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-7 border-t border-slate-100 pt-6 first:border-0">
      <p
        className="
          mb-4
          text-xs
          font-bold
          uppercase
          tracking-wider
          text-slate-400
        "
      >
        {title}
      </p>

      {children}
    </div>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className="
        mt-3
        flex
        cursor-pointer
        items-center
        gap-3
        text-sm
        text-slate-600
      "
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="accent-blue-600"
      />

      {label}
    </label>
  );
}

function UniversityPageLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-32">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-slate-200" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="h-[700px] animate-pulse rounded-[28px] bg-white" />

          <div className="space-y-8">
            <div className="h-[300px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[300px] animate-pulse rounded-[28px] bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}