"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  useMemo,
  useState,
} from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  User,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";

type SortType =
  | "latest"
  | "popular"
  | "oldest";

interface Experience {
  id: number;
  title: string;
  summary: string;
  category: string;
  prefecture: string;
  authorName: string;
  publishTime: string;
  views: number;
  readingMinutes: number;
  tags: string[];
}

const PAGE_SIZE = 6;

const experiences: Experience[] = [
  {
    id: 1,
    title:
      "第一次在日本租房，我后来才知道的 8 件事",
    summary:
      "第一次在日本租房时，我对礼金、保证会社、退房费用都不太了解。这篇记录一下我实际租房后才知道的几个问题。",
    category: "租房搬家",
    prefecture: "东京",
    authorName: "东京生活第6年",
    publishTime: "2026-08-28",
    views: 2358,
    readingMinutes: 6,
    tags: [
      "日本租房",
      "东京生活",
      "初期费用",
    ],
  },
  {
    id: 2,
    title:
      "日本 IT 求职，从投简历到拿到 Offer 的完整过程",
    summary:
      "整理一下我在日本找 IT 工作时实际经历过的流程，包括简历、面试、薪资沟通以及入职前需要确认的问题。",
    category: "工作求职",
    prefecture: "东京",
    authorName: "在日程序员",
    publishTime: "2026-08-26",
    views: 3241,
    readingMinutes: 8,
    tags: [
      "日本IT",
      "求职",
      "面试",
    ],
  },
  {
    id: 3,
    title:
      "搬到大阪以后，我才发现生活成本和东京差这么多",
    summary:
      "从东京搬到大阪生活半年以后，整理房租、交通、吃饭以及日常生活成本方面比较明显的区别。",
    category: "日本生活",
    prefecture: "大阪",
    authorName: "关西生活中",
    publishTime: "2026-08-24",
    views: 1786,
    readingMinutes: 5,
    tags: [
      "大阪生活",
      "生活成本",
      "搬家",
    ],
  },
  {
    id: 4,
    title:
      "日本银行卡怎么选？我实际用过的几个账户",
    summary:
      "不是做银行排名，而是从工资收取、转账、ATM、信用卡绑定这些实际使用场景讲一下自己的经验。",
    category: "银行金融",
    prefecture: "不限地区",
    authorName: "普通上班族",
    publishTime: "2026-08-20",
    views: 2864,
    readingMinutes: 7,
    tags: [
      "日本银行",
      "银行卡",
      "生活经验",
    ],
  },
  {
    id: 5,
    title:
      "专门学校毕业后在日本找工作的几个现实问题",
    summary:
      "学校推荐求人不一定适合所有人。分享一下毕业前准备、企业选择以及第一份工作时我比较后悔没有提前确认的事情。",
    category: "留学升学",
    prefecture: "东京",
    authorName: "毕业第4年",
    publishTime: "2026-08-18",
    views: 1560,
    readingMinutes: 6,
    tags: [
      "专门学校",
      "毕业求职",
      "留学生",
    ],
  },
  {
    id: 6,
    title:
      "在日本搬家之后，这些地址变更别忘了做",
    summary:
      "搬家不只是去区役所迁出迁入。银行卡、手机、驾照、公司、邮局等地址也最好一次整理清楚。",
    category: "日本生活",
    prefecture: "神奈川",
    authorName: "横滨居住中",
    publishTime: "2026-08-15",
    views: 1988,
    readingMinutes: 4,
    tags: [
      "搬家",
      "地址变更",
      "日本生活",
    ],
  },
  {
    id: 7,
    title:
      "第一次自己去区役所办手续，其实没有想象中那么难",
    summary:
      "分享第一次独自办理住民票、印鉴登记等手续的过程，以及日语不太熟时可以提前准备的东西。",
    category: "签证手续",
    prefecture: "埼玉",
    authorName: "生活慢慢来",
    publishTime: "2026-08-12",
    views: 947,
    readingMinutes: 5,
    tags: [
      "区役所",
      "住民票",
      "手续",
    ],
  },
  {
    id: 8,
    title:
      "在日本看病前最好先知道的几个小细节",
    summary:
      "预约、保险证、初诊费、处方药局这些事情第一次接触会有点乱，记录一下自己的实际经验。",
    category: "医疗健康",
    prefecture: "爱知",
    authorName: "名古屋生活",
    publishTime: "2026-08-10",
    views: 1315,
    readingMinutes: 5,
    tags: [
      "日本看病",
      "医疗",
      "生活经验",
    ],
  },
  {
    id: 9,
    title:
      "日本公司入职第一周，我建议提前准备这些东西",
    summary:
      "从服装、交通路线、印章，到公司常用的沟通方式，整理第一次进入日本公司时容易忽略的细节。",
    category: "工作求职",
    prefecture: "东京",
    authorName: "会社员日记",
    publishTime: "2026-08-08",
    views: 2267,
    readingMinutes: 6,
    tags: [
      "日本公司",
      "入职",
      "职场",
    ],
  },
];

const categories = [
  "全部分类",
  "日本生活",
  "工作求职",
  "租房搬家",
  "留学升学",
  "签证手续",
  "税金年金",
  "银行金融",
  "医疗健康",
  "交通出行",
  "购物消费",
  "育儿家庭",
  "其他经验",
];

const prefectures = [
  "全部地区",
  "东京",
  "神奈川",
  "千叶",
  "埼玉",
  "大阪",
  "京都",
  "爱知",
  "福冈",
  "北海道",
  "不限地区",
];

const hotKeywords = [
  "日本租房",
  "日本IT",
  "求职",
  "搬家",
  "留学生",
  "日本生活",
];

export default function ExperiencePage() {
  const [keyword, setKeyword] =
    useState("");

  const [category, setCategory] =
    useState("全部分类");

  const [prefecture, setPrefecture] =
    useState("全部地区");

  const [sort, setSort] =
    useState<SortType>("latest");

  const [page, setPage] =
    useState(1);

  /*
  TODO [API - GET]
  GET /api/experiences

  Purpose:
  获取已经审核通过并公开的经验文章。

  Query example:
  ?q=日本租房
  &category=租房搬家
  &prefecture=东京
  &sort=latest
  &page=1
  &limit=6

  后端只返回：
  status === "published"
  的公开文章。
  */

  const filteredExperiences =
    useMemo(() => {
      const q =
        keyword
          .trim()
          .toLowerCase();

      let result =
        experiences.filter(
          (experience) => {
            if (
              category !==
                "全部分类" &&
              experience.category !==
                category
            ) {
              return false;
            }

            if (
              prefecture !==
                "全部地区" &&
              experience.prefecture !==
                prefecture
            ) {
              return false;
            }

            if (!q) {
              return true;
            }

            const searchable = [
              experience.title,
              experience.summary,
              experience.category,
              experience.prefecture,
              experience.authorName,
              ...experience.tags,
            ]
              .join(" ")
              .toLowerCase();

            return searchable.includes(
              q
            );
          }
        );

      result = [...result].sort(
        (a, b) => {
          if (
            sort === "popular"
          ) {
            return (
              b.views - a.views
            );
          }

          const aTime =
            new Date(
              a.publishTime
            ).getTime();

          const bTime =
            new Date(
              b.publishTime
            ).getTime();

          if (
            sort === "oldest"
          ) {
            return aTime - bTime;
          }

          return bTime - aTime;
        }
      );

      return result;
    }, [
      keyword,
      category,
      prefecture,
      sort,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredExperiences.length /
        PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const visibleExperiences =
    filteredExperiences.slice(
      (currentPage - 1) *
        PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  const hasFilters =
    keyword.trim() !== "" ||
    category !== "全部分类" ||
    prefecture !== "全部地区";

  function handleKeywordChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setKeyword(
      event.target.value
    );

    setPage(1);
  }

  function clearFilters() {
    setKeyword("");
    setCategory("全部分类");
    setPrefecture(
      "全部地区"
    );
    setSort("latest");
    setPage(1);
  }

  function selectHotKeyword(
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
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-emerald-500/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-52
            right-0
            h-[520px]
            w-[520px]
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              py-14
              sm:py-16
            "
          >
            <div
              className="
                max-w-3xl
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-emerald-400/20
                  bg-emerald-400/10
                  px-3
                  py-1.5
                  text-xs
                  font-black
                  text-emerald-300
                "
              >
                <Sparkles size={14} />
                Sakura Experience
              </div>

              <h1
                className="
                  mt-5
                  text-4xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-5xl
                "
              >
                在日经验
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
                看看别人真正经历过什么。
                租房、工作、升学、手续和生活，
                少走一点弯路。
              </p>

              {/* SEARCH */}

              <div
                className="
                  mt-8
                  flex
                  max-w-2xl
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/10
                  p-2
                  backdrop-blur
                "
              >
                <div
                  className="
                    relative
                    flex-1
                  "
                >
                  <Search
                    size={18}
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
                    value={keyword}
                    onChange={
                      handleKeywordChange
                    }
                    placeholder="搜索经验、问题、关键词..."
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white
                      py-3.5
                      pl-11
                      pr-4
                      text-sm
                      font-semibold
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:border-emerald-400
                    "
                  />
                </div>
              </div>

              {/* HOT */}

              <div
                className="
                  mt-4
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
                    text-slate-500
                  "
                >
                  热门：
                </span>

                {hotKeywords.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        selectHotKeyword(
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
                        font-bold
                        text-slate-300
                        transition
                        hover:border-emerald-400/30
                        hover:bg-emerald-400/10
                        hover:text-emerald-300
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

      {/* MAIN */}

      <section className="py-9 sm:py-11">
        <Container>
          <div className="px-4">
            {/* FILTER */}

            <div
              className="
                rounded-[24px]
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
                  gap-2
                  text-sm
                  font-black
                  text-slate-950
                "
              >
                <SlidersHorizontal
                  size={17}
                />
                筛选经验
              </div>

              <div
                className="
                  mt-4
                  grid
                  gap-3
                  md:grid-cols-3
                "
              >
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(
                      event.target.value
                    );

                    setPage(1);
                  }}
                  className={selectClass}
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={prefecture}
                  onChange={(event) => {
                    setPrefecture(
                      event.target.value
                    );

                    setPage(1);
                  }}
                  className={selectClass}
                >
                  {prefectures.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(
                      event.target
                        .value as SortType
                    );

                    setPage(1);
                  }}
                  className={selectClass}
                >
                  <option value="latest">
                    最新发布
                  </option>

                  <option value="popular">
                    浏览最多
                  </option>

                  <option value="oldest">
                    最早发布
                  </option>
                </select>
              </div>

              {hasFilters && (
                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    border-t
                    border-slate-100
                    pt-4
                  "
                >
                  <span className="text-xs font-bold text-slate-400">
                    当前条件：
                  </span>

                  {keyword.trim() && (
                    <FilterChip
                      label={`关键词：${keyword}`}
                      onRemove={() => {
                        setKeyword("");
                        setPage(1);
                      }}
                    />
                  )}

                  {category !==
                    "全部分类" && (
                    <FilterChip
                      label={category}
                      onRemove={() => {
                        setCategory(
                          "全部分类"
                        );
                        setPage(1);
                      }}
                    />
                  )}

                  {prefecture !==
                    "全部地区" && (
                    <FilterChip
                      label={prefecture}
                      onRemove={() => {
                        setPrefecture(
                          "全部地区"
                        );
                        setPage(1);
                      }}
                    />
                  )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      ml-auto
                      text-xs
                      font-black
                      text-slate-400
                      transition
                      hover:text-rose-500
                    "
                  >
                    清除全部
                  </button>
                </div>
              )}
            </div>

            {/* TITLE */}

            <div
              className="
                mt-8
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.15em]
                    text-emerald-600
                  "
                >
                  EXPERIENCE
                </p>

                <h2
                  className="
                    mt-1
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-950
                  "
                >
                  大家的真实经验
                </h2>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    text-slate-400
                  "
                >
                  共{" "}
                  {
                    filteredExperiences.length
                  }{" "}
                  篇
                </p>

                <Link
                  href="/experience/new"
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    bg-emerald-600
                    px-4
                    py-2.5
                    text-xs
                    font-black
                    text-white
                    transition
                    hover:bg-emerald-700
                  "
                >
                  <BookOpen
                    size={14}
                  />
                  分享经验
                </Link>
              </div>
            </div>

            {/* RESULT */}

            {visibleExperiences.length >
            0 ? (
              <div
                className="
                  mt-6
                  grid
                  gap-5
                  lg:grid-cols-2
                "
              >
                {visibleExperiences.map(
                  (experience) => (
                    <ExperienceCard
                      key={
                        experience.id
                      }
                      experience={
                        experience
                      }
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

            {filteredExperiences.length >
              PAGE_SIZE && (
              <div
                className="
                  mt-9
                  flex
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
                    setPage(
                      Math.max(
                        1,
                        currentPage - 1
                      )
                    )
                  }
                  className={pageButtonClass}
                  aria-label="上一页"
                >
                  <ChevronLeft
                    size={17}
                  />
                </button>

                {Array.from({
                  length: totalPages,
                }).map((_, index) => {
                  const pageNumber =
                    index + 1;

                  const active =
                    pageNumber ===
                    currentPage;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() =>
                        setPage(
                          pageNumber
                        )
                      }
                      className={`
                        flex
                        h-10
                        min-w-10
                        items-center
                        justify-center
                        rounded-xl
                        border
                        px-3
                        text-sm
                        font-black
                        transition
                        ${
                          active
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }
                      `}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      Math.min(
                        totalPages,
                        currentPage + 1
                      )
                    )
                  }
                  className={pageButtonClass}
                  aria-label="下一页"
                >
                  <ChevronRight
                    size={17}
                  />
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}

function ExperienceCard({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:border-emerald-200
        hover:shadow-xl
        hover:shadow-slate-200/50
        sm:p-6
      "
    >
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        <span
          className="
            rounded-full
            bg-emerald-50
            px-2.5
            py-1
            text-[11px]
            font-black
            text-emerald-700
          "
        >
          {experience.category}
        </span>

        {experience.prefecture !==
          "不限地区" && (
          <span
            className="
              inline-flex
              items-center
              gap-1
              text-[11px]
              font-bold
              text-slate-400
            "
          >
            <MapPin size={12} />
            {experience.prefecture}
          </span>
        )}
      </div>

      <Link
        href={`/experience/${experience.id}`}
        className="mt-4 block"
      >
        <h3
          className="
            text-xl
            font-black
            leading-8
            tracking-tight
            text-slate-950
            transition
            group-hover:text-emerald-700
          "
        >
          {experience.title}
        </h3>
      </Link>

      <p
        className="
          mt-3
          line-clamp-3
          text-sm
          leading-7
          text-slate-500
        "
      >
        {experience.summary}
      </p>

      <div
        className="
          mt-4
          flex
          flex-wrap
          gap-1.5
        "
      >
        {experience.tags.map(
          (tag) => (
            <span
              key={tag}
              className="
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-[10px]
                font-bold
                text-slate-500
              "
            >
              #{tag}
            </span>
          )
        )}
      </div>

      <div
        className="
          mt-auto
          pt-6
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-4
            gap-y-2
            border-t
            border-slate-100
            pt-4
            text-[11px]
            font-semibold
            text-slate-400
          "
        >
          <span
            className="
              inline-flex
              items-center
              gap-1.5
            "
          >
            <User size={13} />
            {experience.authorName}
          </span>

          <span
            className="
              inline-flex
              items-center
              gap-1.5
            "
          >
            <Clock3 size={13} />
            {experience.readingMinutes}
            分钟
          </span>

          <span
            className="
              inline-flex
              items-center
              gap-1.5
            "
          >
            <Eye size={13} />
            {formatViews(
              experience.views
            )}
          </span>
        </div>

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <span
            className="
              text-[11px]
              font-semibold
              text-slate-400
            "
          >
            {formatDate(
              experience.publishTime
            )}
          </span>

          <Link
            href={`/experience/${experience.id}`}
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-black
              text-emerald-700
              transition
              group-hover:gap-2.5
            "
          >
            阅读全文
            <ArrowRight
              size={14}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-emerald-100
        bg-emerald-50
        px-3
        py-1.5
        text-xs
        font-bold
        text-emerald-700
        transition
        hover:border-rose-200
        hover:bg-rose-50
        hover:text-rose-600
      "
    >
      {label}

      <X size={12} />
    </button>
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
        mt-6
        rounded-[26px]
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
        <FileText size={23} />
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-black
          text-slate-950
        "
      >
        暂时没有找到相关经验
      </h3>

      <p
        className="
          mt-2
          text-sm
          text-slate-500
        "
      >
        换一个关键词或筛选条件试试。
      </p>

      <button
        type="button"
        onClick={onReset}
        className="
          mt-5
          rounded-xl
          bg-slate-950
          px-5
          py-2.5
          text-sm
          font-black
          text-white
          transition
          hover:bg-slate-800
        "
      >
        清除筛选
      </button>
    </div>
  );
}

const selectClass = `
  w-full
  appearance-none
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-sm
  font-bold
  text-slate-700
  outline-none
  transition
  focus:border-emerald-400
  focus:ring-4
  focus:ring-emerald-50
`;

const pageButtonClass = `
  flex
  h-10
  w-10
  items-center
  justify-center
  rounded-xl
  border
  border-slate-200
  bg-white
  text-slate-600
  transition
  hover:border-slate-300
  hover:bg-slate-50
  disabled:cursor-not-allowed
  disabled:opacity-30
`;

function formatDate(
  value: string
) {
  return value.replaceAll(
    "-",
    "."
  );
}

function formatViews(
  value: number
) {
  if (value >= 10000) {
    return `${(
      value / 10000
    ).toFixed(1)}万`;
  }

  if (value >= 1000) {
    return `${(
      value / 1000
    ).toFixed(1)}k`;
  }

  return value.toString();
}