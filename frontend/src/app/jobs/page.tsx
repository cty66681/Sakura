"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";
import JobCard from "@/components/home/JobCard/JobCard";

import { jobs } from "@/data/jobs";

const regions = [
  "全部地区",
  "东京",
  "神奈川",
  "大阪",
  "京都",
  "爱知",
  "福冈",
] as const;

const jobTypes = [
  "全部",
  "全职",
  "兼职",
  "实习",
] as const;

const workStyles = [
  "全部",
  "远程",
  "混合",
  "现场",
] as const;

const quickFilters = [
  {
    key: "verified",
    label: "企业认证",
  },
  {
    key: "highSalary",
    label: "高薪职位",
  },
  {
    key: "tech",
    label: "IT 技术",
  },
  {
    key: "tokyo",
    label: "东京",
  },
] as const;

type Region = (typeof regions)[number];
type JobType = (typeof jobTypes)[number];
type WorkStyle = (typeof workStyles)[number];
type QuickFilter =
  (typeof quickFilters)[number]["key"];

const PAGE_SIZE = 6;

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 工作列表
|
| GET /api/jobs
|
| Query:
| {
|   q?: string,
|   region?: string,
|   employmentType?: string,
|   remote?: string,
|   verified?: boolean,
|   category?: string,
|   salary?: string,
|   sort?: "latest" | "salary-desc",
|   page?: number,
|   limit?: number
| }
|
| 当前阶段使用 "@/data/jobs" Mock 数据进行前端筛选。
|
|--------------------------------------------------------------------------
*/

function getMaxSalary(salary: string) {
  const numbers =
    salary.match(/[\d,]+/g)?.map((value) =>
      Number(value.replace(/,/g, ""))
    ) ?? [];

  return numbers.length
    ? Math.max(...numbers)
    : 0;
}

export default function JobsPage() {
  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [region, setRegion] =
    useState<Region>("全部地区");

  const [jobType, setJobType] =
    useState<JobType>("全部");

  const [workStyle, setWorkStyle] =
    useState<WorkStyle>("全部");

  const [sort, setSort] =
    useState("recommended");

  const [quickFiltersActive, setQuickFiltersActive] =
    useState<QuickFilter[]>([]);

  const [page, setPage] =
    useState(1);

  function resetPage() {
    setPage(1);
  }

  function handleSearch() {
    setSearch(searchInput.trim());
    resetPage();
  }

  function toggleQuickFilter(
    key: QuickFilter
  ) {
    setQuickFiltersActive((current) =>
      current.includes(key)
        ? current.filter(
            (item) => item !== key
          )
        : [...current, key]
    );

    resetPage();
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");

    setRegion("全部地区");
    setJobType("全部");
    setWorkStyle("全部");

    setQuickFiltersActive([]);

    setSort("recommended");
    setPage(1);
  }

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    /* Search */

    if (search) {
      const keyword =
        search.toLowerCase();

      result = result.filter((job) =>
        [
          job.company,
          job.title,
          job.location,
          job.salary,
          job.employmentType,
          job.remote,
          job.experience,
          job.language,
          ...job.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      );
    }

    /* Region */

    if (region !== "全部地区") {
      result = result.filter((job) =>
        job.location.includes(region)
      );
    }

    /* Employment */

    if (jobType !== "全部") {
      result = result.filter(
        (job) =>
          job.employmentType === jobType
      );
    }

    /* Work style */

    if (workStyle !== "全部") {
      result = result.filter(
        (job) =>
          job.remote === workStyle
      );
    }

    /* Verified */

    if (
      quickFiltersActive.includes(
        "verified"
      )
    ) {
      result = result.filter(
        (job) => job.verified
      );
    }

    /* High salary */

    if (
      quickFiltersActive.includes(
        "highSalary"
      )
    ) {
      result = result.filter(
        (job) =>
          getMaxSalary(job.salary) >=
          800000
      );
    }

    /* IT */

    if (
      quickFiltersActive.includes("tech")
    ) {
      const techKeywords = [
        "it",
        "java",
        "python",
        "react",
        "typescript",
        "next.js",
        "aws",
        "spring",
        "backend",
        "frontend",
        "engineer",
        "ai",
        "go",
      ];

      result = result.filter((job) => {
        const text = [
          job.title,
          ...job.tags,
        ]
          .join(" ")
          .toLowerCase();

        return techKeywords.some(
          (keyword) =>
            text.includes(keyword)
        );
      });
    }

    /* Tokyo */

    if (
      quickFiltersActive.includes("tokyo")
    ) {
      result = result.filter((job) =>
        job.location.includes("东京")
      );
    }

    /* Sort */

    if (sort === "salary") {
      result.sort(
        (a, b) =>
          getMaxSalary(b.salary) -
          getMaxSalary(a.salary)
      );
    }

    if (sort === "latest") {
      result.sort(
        (a, b) =>
          new Date(
            b.publishTime
          ).getTime() -
          new Date(
            a.publishTime
          ).getTime()
      );
    }

    return result;
  }, [
    search,
    region,
    jobType,
    workStyle,
    sort,
    quickFiltersActive,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredJobs.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const currentJobs =
    filteredJobs.slice(
      (currentPage - 1) *
        PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  const hasFilters =
    search !== "" ||
    region !== "全部地区" ||
    jobType !== "全部" ||
    workStyle !== "全部" ||
    quickFiltersActive.length > 0;

  return (
    <main className="min-h-screen bg-slate-950">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-white/5
        "
      >
        {/* Glow */}

        <div
          className="
            pointer-events-none
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-600/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            h-[480px]
            w-[480px]
            rounded-full
            bg-violet-600/15
            blur-3xl
          "
        />

        {/* Grid */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              pb-16
              pt-16
              sm:pb-20
              sm:pt-20
            "
          >
            {/* Badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-400/20
                bg-blue-400/10
                px-4
                py-2
                text-sm
                font-bold
                text-blue-300
              "
            >
              <BriefcaseBusiness
                size={16}
              />

              SAKURA JOBS
            </div>

            {/* Title */}

            <h1
              className="
                mt-6
                max-w-4xl
                text-4xl
                font-black
                tracking-tight
                text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              在日本，找到更适合你的
              <span
                className="
                  ml-2
                  bg-gradient-to-r
                  from-blue-400
                  via-sky-300
                  to-violet-400
                  bg-clip-text
                  text-transparent
                "
              >
                工作机会
              </span>
            </h1>

            <p
              className="
                mt-5
                max-w-2xl
                text-base
                leading-8
                text-slate-400
                sm:text-lg
              "
            >
              搜索职位、公司和技术栈，
              根据地区、雇佣方式和工作方式快速筛选。
            </p>

            {/* Search */}

            <div className="mt-10 max-w-4xl">
              <div
                className="
                  flex
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-white
                  shadow-2xl
                  shadow-black/20
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                  "
                >
                  <Search
                    size={20}
                    className="
                      ml-5
                      shrink-0
                      text-slate-400
                    "
                  />

                  <input
                    value={searchInput}
                    onChange={(e) =>
                      setSearchInput(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter"
                      ) {
                        handleSearch();
                      }
                    }}
                    placeholder="职位、公司、Python、Java、React..."
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-4
                      py-5
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="
                    shrink-0
                    bg-blue-600
                    px-7
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-blue-700
                    sm:px-10
                  "
                >
                  搜索工作
                </button>
              </div>
            </div>

            {/* Quick filters */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-2.5
              "
            >
              {quickFilters.map(
                (filter) => {
                  const active =
                    quickFiltersActive.includes(
                      filter.key
                    );

                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() =>
                        toggleQuickFilter(
                          filter.key
                        )
                      }
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        transition
                        ${
                          active
                            ? "border-blue-400 bg-blue-500 text-white"
                            : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      {filter.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section
        className="
          rounded-t-[32px]
          bg-slate-50
          py-10
          sm:py-12
        "
      >
        <Container>
          <div
            className="
              grid
              gap-8
              lg:grid-cols-[250px_minmax(0,1fr)]
            "
          >
            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside
              className="
                h-fit
                rounded-[24px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                lg:sticky
                lg:top-24
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-slate-900
                  "
                >
                  <SlidersHorizontal
                    size={18}
                  />

                  <h2 className="font-bold">
                    筛选职位
                  </h2>
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      text-xs
                      font-bold
                      text-slate-400
                      transition
                      hover:text-blue-600
                    "
                  >
                    清除
                  </button>
                )}
              </div>

              {/* Region */}

              <div className="mt-7">
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  工作地区
                </p>

                <div className="mt-3 space-y-1">
                  {regions.map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setRegion(item);
                          resetPage();
                        }}
                        className={`
                          w-full
                          rounded-xl
                          px-3
                          py-2.5
                          text-left
                          text-sm
                          transition
                          ${
                            region ===
                            item
                              ? "bg-blue-50 font-bold text-blue-600"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }
                        `}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Employment */}

              <div
                className="
                  mt-7
                  border-t
                  border-slate-100
                  pt-6
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  雇佣类型
                </p>

                <div className="mt-3 space-y-3">
                  {jobTypes.map(
                    (type) => (
                      <label
                        key={type}
                        className="
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
                          name="jobType"
                          checked={
                            jobType === type
                          }
                          onChange={() => {
                            setJobType(type);
                            resetPage();
                          }}
                          className="accent-blue-600"
                        />

                        {type}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Work style */}

              <div
                className="
                  mt-7
                  border-t
                  border-slate-100
                  pt-6
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  工作方式
                </p>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-2
                  "
                >
                  {workStyles.map(
                    (style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => {
                          setWorkStyle(
                            style
                          );
                          resetPage();
                        }}
                        className={`
                          rounded-xl
                          border
                          px-2
                          py-2.5
                          text-xs
                          font-semibold
                          transition
                          ${
                            workStyle ===
                            style
                              ? "border-blue-200 bg-blue-50 text-blue-600"
                              : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                          }
                        `}
                      >
                        {style}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Trust */}

              <div
                className="
                  mt-7
                  rounded-2xl
                  border
                  border-emerald-100
                  bg-emerald-50
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-emerald-700
                  "
                >
                  <ShieldCheck
                    size={17}
                  />

                  <span
                    className="
                      text-sm
                      font-bold
                    "
                  >
                    职位真实性
                  </span>
                </div>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-emerald-700/70
                  "
                >
                  Sakura 后续将加入企业认证、
                  举报记录和职位风险提示。
                </p>
              </div>
            </aside>

            {/* ================================================= */}
            {/* RESULTS */}
            {/* ================================================= */}

            <div className="min-w-0">
              {/* Result header */}

              <div
                className="
                  mb-6
                  flex
                  flex-col
                  gap-4
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
                      gap-3
                    "
                  >
                    <h2
                      className="
                        text-2xl
                        font-black
                        text-slate-900
                      "
                    >
                      工作机会
                    </h2>

                    <span
                      className="
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1
                        text-xs
                        font-bold
                        text-blue-600
                      "
                    >
                      {
                        filteredJobs.length
                      }
                    </span>
                  </div>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    根据你的搜索和筛选条件显示职位
                  </p>
                </div>

                {/* Sort */}

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(
                        e.target.value
                      );
                      resetPage();
                    }}
                    className="
                      appearance-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      py-3
                      pl-4
                      pr-10
                      text-sm
                      font-medium
                      text-slate-600
                      outline-none
                      transition
                      focus:border-blue-400
                    "
                  >
                    <option value="recommended">
                      推荐排序
                    </option>

                    <option value="latest">
                      最新发布
                    </option>

                    <option value="salary">
                      薪资最高
                    </option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />
                </div>
              </div>

              {/* Active filters */}

              {hasFilters && (
                <div
                  className="
                    mb-6
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  {search && (
                    <FilterTag
                      label={`搜索：${search}`}
                      onRemove={() => {
                        setSearch("");
                        setSearchInput("");
                        resetPage();
                      }}
                    />
                  )}

                  {region !==
                    "全部地区" && (
                    <FilterTag
                      label={region}
                      onRemove={() => {
                        setRegion(
                          "全部地区"
                        );
                        resetPage();
                      }}
                    />
                  )}

                  {jobType !==
                    "全部" && (
                    <FilterTag
                      label={jobType}
                      onRemove={() => {
                        setJobType("全部");
                        resetPage();
                      }}
                    />
                  )}

                  {workStyle !==
                    "全部" && (
                    <FilterTag
                      label={workStyle}
                      onRemove={() => {
                        setWorkStyle(
                          "全部"
                        );
                        resetPage();
                      }}
                    />
                  )}

                  {quickFiltersActive.map(
                    (key) => {
                      const item =
                        quickFilters.find(
                          (filter) =>
                            filter.key ===
                            key
                        );

                      if (!item) {
                        return null;
                      }

                      return (
                        <FilterTag
                          key={key}
                          label={
                            item.label
                          }
                          onRemove={() =>
                            toggleQuickFilter(
                              key
                            )
                          }
                        />
                      );
                    }
                  )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      ml-1
                      text-xs
                      font-bold
                      text-slate-400
                      transition
                      hover:text-blue-600
                    "
                  >
                    清除全部
                  </button>
                </div>
              )}

              {/* Cards */}

              {currentJobs.length >
              0 ? (
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-2
                  "
                >
                  {currentJobs.map(
                    (job) => (
                      <JobCard
                        key={job.id}
                        {...job}
                      />
                    )
                  )}
                </div>
              ) : (
                <div
                  className="
                    rounded-[24px]
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    px-6
                    py-20
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
                      text-slate-500
                    "
                  >
                    <Search size={24} />
                  </div>

                  <h3
                    className="
                      mt-5
                      font-bold
                      text-slate-900
                    "
                  >
                    没有找到符合条件的职位
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    可以换一个关键词，
                    或减少一些筛选条件。
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      mt-5
                      text-sm
                      font-bold
                      text-blue-600
                      hover:text-blue-700
                    "
                  >
                    清除所有条件
                  </button>
                </div>
              )}

              {/* Pagination */}

              {totalPages > 1 && (
                <div
                  className="
                    mt-10
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setPage((value) =>
                        Math.max(
                          1,
                          value - 1
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
                      font-medium
                      text-slate-600
                      transition
                      hover:border-slate-300
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
                  ).map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() =>
                        setPage(number)
                      }
                      className={`
                        h-10
                        w-10
                        rounded-xl
                        text-sm
                        font-bold
                        transition
                        ${
                          currentPage ===
                          number
                            ? "bg-slate-950 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                        }
                      `}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
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
                      font-medium
                      text-slate-600
                      transition
                      hover:border-slate-300
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    下一页
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

function FilterTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-blue-100
        bg-blue-50
        py-1.5
        pl-3
        pr-2
        text-xs
        font-semibold
        text-blue-700
      "
    >
      <span>{label}</span>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`删除筛选条件 ${label}`}
        className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          transition
          hover:bg-blue-100
        "
      >
        <X size={12} />
      </button>
    </div>
  );
}