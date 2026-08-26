"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  ShieldCheck,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

import Container from "@/components/layout/Container";
import JobCard from "@/components/home/JobCard/JobCard";
import Header from "@/components/layout/Hearder";


interface Job {
  id: number;
  company: string;
  title: string;
  location: string;
  salary: string;
  tags: string[];
  publishTime: string;
  verified?: boolean;
}

const jobs: Job[] = [
  {
    id: 1,
    company: "Mercari",
    title: "Java Backend Engineer",
    location: "东京 · 涩谷",
    salary: "¥700,000 ~ ¥900,000",
    publishTime: "2小时前",
    verified: true,
    tags: ["Java", "Spring Boot", "AWS", "React"],
  },

  {
    id: 2,
    company: "PayPay",
    title: "Frontend Engineer",
    location: "东京 · 港区",
    salary: "¥650,000 ~ ¥850,000",
    publishTime: "5小时前",
    verified: true,
    tags: ["React", "TypeScript", "Next.js"],
  },

  {
    id: 3,
    company: "Rakuten",
    title: "Full Stack Engineer",
    location: "东京 · 世田谷",
    salary: "¥650,000 ~ ¥950,000",
    publishTime: "今天",
    verified: true,
    tags: ["Java", "React", "AWS"],
  },

  {
    id: 4,
    company: "LINEヤフー",
    title: "Frontend Developer",
    location: "东京 · 千代田",
    salary: "¥600,000 ~ ¥850,000",
    publishTime: "今天",
    verified: true,
    tags: ["Vue", "TypeScript", "JavaScript"],
  },

  {
    id: 5,
    company: "CyberAgent",
    title: "Backend Engineer",
    location: "东京 · 涩谷",
    salary: "¥700,000 ~ ¥1,000,000",
    publishTime: "昨天",
    verified: true,
    tags: ["Go", "Python", "AWS"],
  },

  {
    id: 6,
    company: "Indeed Japan",
    title: "Software Engineer",
    location: "东京 · 港区",
    salary: "¥750,000 ~ ¥1,050,000",
    publishTime: "昨天",
    verified: true,
    tags: ["Python", "React", "AWS"],
  },
  {
    id: 7,
    company: "Indeed Japan",
    title: "Software Engineer",
    location: "东京 · 港区",
    salary: "¥750,000 ~ ¥1,050,000",
    publishTime: "昨天",
    verified: true,
    tags: ["Python", "React", "AWS"],
  },
];

const regions = [
  "全部地区",
  "东京",
  "大阪",
  "京都",
  "名古屋",
  "福冈",
];

const jobTypes = [
  "全部",
  "正社員",
  "契約社員",
  "兼职",
  "实习",
];

const quickFilters = [
  {
    key: "verified",
    label: "✓ 企业认证",
  },
  {
    key: "highSalary",
    label: "¥ 高薪职位",
  },
  {
    key: "tech",
    label: "⌘ IT 技术",
  },
  {
    key: "tokyo",
    label: "📍 东京",
  },
];

const PAGE_SIZE = 6;

export default function JobsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("全部地区");
  const [jobType, setJobType] = useState("全部");
  const [sort, setSort] = useState("recommended");
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // 搜索
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();

      result = result.filter((job) =>
        [
          job.company,
          job.title,
          job.location,
          job.salary,
          ...job.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      );
    }

    // 地区
    if (region !== "全部地区") {
      result = result.filter((job) =>
        job.location.includes(region)
      );
    }

    // 企业类型
    // 目前 mock 数据没有 employmentType，
    // 所以正式接数据后再启用。
    if (jobType !== "全部") {
      // 暂时不筛选
    }

    // 快速筛选
    if (quickFilter === "verified") {
      result = result.filter((job) => job.verified);
    }

    if (quickFilter === "highSalary") {
      result = result.filter((job) =>
        job.salary.includes("900,000") ||
        job.salary.includes("950,000") ||
        job.salary.includes("1,000,000") ||
        job.salary.includes("1,050,000")
      );
    }

    if (quickFilter === "tech") {
      result = result.filter((job) =>
        job.tags.some((tag) =>
          [
            "Java",
            "Spring Boot",
            "AWS",
            "React",
            "TypeScript",
            "Next.js",
            "Python",
            "Go",
            "Vue",
          ].includes(tag)
        )
      );
    }

    if (quickFilter === "tokyo") {
      result = result.filter((job) =>
        job.location.includes("东京")
      );
    }

    // 排序
    if (sort === "salary") {
      result.sort((a, b) => {
        const aSalary =
          parseInt(
            a.salary.replace(/[^0-9]/g, "")
          ) || 0;

        const bSalary =
          parseInt(
            b.salary.replace(/[^0-9]/g, "")
          ) || 0;

        return bSalary - aSalary;
      });
    }

    return result;
  }, [
    search,
    region,
    jobType,
    sort,
    quickFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredJobs.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function resetPage() {
    setPage(1);
  }

  function changeQuickFilter(key: string) {
    setQuickFilter(
      quickFilter === key ? null : key
    );

    resetPage();
  }

  return (
    <main className="min-h-screen bg-slate-950">

      {/* ================================================= */}
      {/* Hero */}
      {/* ================================================= */}

      <section className="relative overflow-hidden">

        {/* Background glow */}

        <div className="absolute inset-0">

          <div className="
            absolute
            -left-40
            -top-40
            h-96
            w-96
            rounded-full
            bg-blue-600/20
            blur-3xl
          " />

          <div className="
            absolute
            right-0
            top-20
            h-96
            w-96
            rounded-full
            bg-violet-600/20
            blur-3xl
          " />

        </div>

        <Container>

          <div className="relative px-4 pb-14 pt-16">

            {/* Label */}

            <div className="
              mb-5
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
              font-medium
              text-blue-300
            ">
              <BriefcaseBusiness size={16} />

              JAPAN JOBS
            </div>

            {/* Title */}

            <h1 className="
              max-w-3xl
              text-4xl
              font-bold
              tracking-tight
              text-white
              sm:text-5xl
            ">
              找到真正适合你的
              <span className="
                ml-2
                bg-gradient-to-r
                from-blue-400
                to-violet-400
                bg-clip-text
                text-transparent
              ">
                日本工作
              </span>
            </h1>

            <p className="
              mt-5
              max-w-2xl
              text-base
              leading-8
              text-slate-400
            ">
              正社員、兼职、IT、留学生就业，
              从找工作到就职，一站解决。
            </p>

            {/* Search */}

            <div className="mt-10 max-w-4xl">

              <div className="
                flex
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white
                shadow-2xl
              ">

                <div
                  className="
                    flex
                    flex-1
                    items-center
                  "
                >

                  <Search
                    size={20}
                    className="ml-5 text-slate-400"
                  />

                  <input
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder="搜索职位、公司、技术栈..."
                    className="
                      w-full
                      bg-transparent
                      px-4
                      py-5
                      text-sm
                      text-slate-900
                      outline-none
                    "
                  />

                </div>

                <button
                  onClick={handleSearch}
                  className="
                    bg-blue-600
                    px-8
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  搜索
                </button>

              </div>

            </div>

            {/* Quick filters */}

            <div className="mt-7 flex flex-wrap gap-3">

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
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-blue-400/40 hover:bg-white/10"
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


      {/* ================================================= */}
      {/* Content */}
      {/* ================================================= */}

      <section className="
        rounded-t-[2rem]
        bg-slate-50
        py-10
      ">

        <Container>

          <div className="
            grid
            gap-8
            lg:grid-cols-[240px_1fr]
          ">

            {/* ================================================= */}
            {/* Sidebar */}
            {/* ================================================= */}

            <aside className="
              h-fit
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            ">

              <div className="
                flex
                items-center
                gap-2
                text-slate-900
              ">

                <SlidersHorizontal size={18} />

                <h2 className="font-semibold">
                  筛选职位
                </h2>

              </div>


              {/* Region */}

              <div className="mt-7">

                <p className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                ">
                  工作地区
                </p>

                <div className="mt-3 space-y-1">

                  {regions.map((item) => (

                    <button
                      key={item}
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

              </div>


              {/* Job Type */}

              <div className="mt-7">

                <p className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                ">
                  工作类型
                </p>

                <div className="mt-3 space-y-3">

                  {jobTypes.map((type) => (

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
                        checked={jobType === type}
                        onChange={() => {
                          setJobType(type);
                          resetPage();
                        }}
                        className="
                          accent-blue-600
                        "
                      />

                      {type}

                    </label>

                  ))}

                </div>

              </div>


              {/* Trust */}

              <div className="
                mt-7
                rounded-xl
                bg-emerald-50
                p-4
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                  text-emerald-700
                ">

                  <ShieldCheck size={17} />

                  <span className="
                    text-sm
                    font-semibold
                  ">
                    我们更重视真实职位
                  </span>

                </div>

                <p className="
                  mt-2
                  text-xs
                  leading-5
                  text-emerald-700/70
                ">
                  后期将加入企业认证、
                  职位真实性以及避坑信息。
                </p>

              </div>

            </aside>


            {/* ================================================= */}
            {/* Job Results */}
            {/* ================================================= */}

            <div>

              {/* Top */}

              <div className="
                mb-6
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
              ">

                <div>

                  <div className="
                    flex
                    items-center
                    gap-3
                  ">

                    <h2 className="
                      text-2xl
                      font-bold
                      text-slate-900
                    ">
                      推荐职位
                    </h2>

                    <span className="
                      rounded-full
                      bg-blue-50
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-blue-600
                    ">
                      {filteredJobs.length}
                    </span>

                  </div>

                  <p className="
                    mt-2
                    text-sm
                    text-slate-500
                  ">
                    工作、兼职、就职机会持续更新
                  </p>

                </div>


                {/* Sort */}

                <div className="relative">

                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
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
                      text-slate-600
                      outline-none
                      transition
                      focus:border-blue-400
                    "
                  >

                    <option value="recommended">
                      推荐排序
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


              {/* Cards */}

              {currentJobs.length > 0 ? (

                <div className="space-y-5">

                  {currentJobs.map((job) => (

                    <JobCard
                      key={job.id}
                      id={job.id}
                      company={job.company}
                      title={job.title}
                      location={job.location}
                      salary={job.salary}
                      tags={job.tags}
                      publishTime={job.publishTime}
                      verified={job.verified}
                    />

                  ))}

                </div>

              ) : (

                <div className="
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-300
                  bg-white
                  px-6
                  py-20
                  text-center
                ">

                  <div className="text-4xl">
                    🔍
                  </div>

                  <h3 className="
                    mt-4
                    font-semibold
                    text-slate-900
                  ">
                    没有找到符合条件的职位
                  </h3>

                  <p className="
                    mt-2
                    text-sm
                    text-slate-500
                  ">
                    可以尝试更换关键词或筛选条件。
                  </p>

                  <button
                    onClick={() => {
                    setSearch("");
                    setSearchInput("");
                    setRegion("全部地区");
                    setJobType("全部");
                    setQuickFilter(null);
                    setPage(1);
                  }}
                    className="
                      mt-5
                      text-sm
                      font-semibold
                      text-blue-600
                    "
                  >
                    清除所有条件
                  </button>

                </div>

              )}


              {/* Pagination */}

              {totalPages > 1 && (

                <div className="
                  mt-8
                  flex
                  items-center
                  justify-center
                  gap-2
                ">

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
                      transition
                      hover:border-blue-300
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    ←
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
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
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
                      transition
                      hover:border-blue-300
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    →
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