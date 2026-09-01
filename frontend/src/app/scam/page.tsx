"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  Flag,
  Landmark,
  MessageSquareWarning,
  Search,
  ShieldAlert,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Sparkles,
  UserRoundSearch,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";

type RiskType =
  | "consumer"
  | "job"
  | "fraud"
  | "dispute"
  | "official";

type VerificationLevel =
  | "user_report"
  | "evidence_reviewed"
  | "official_source";

type RiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

type SortType =
  | "latest"
  | "popular"
  | "risk";

interface ScamReport {
  id: number;
  title: string;
  summary: string;
  type: RiskType;
  category: string;
  prefecture: string;
  verification: VerificationLevel;
  riskLevel: RiskLevel;
  publishTime: string;
  views: number;
  evidenceCount: number;
  officialSource?: boolean;
  tags: string[];
}

const PAGE_SIZE = 6;

const reports: ScamReport[] = [
  {
    id: 1,
    title:
      "高额日结、只负责取快递：这类招聘信息需要特别警惕",
    summary:
      "近期出现以高额日结、简单跑腿、代取包裹等方式吸引求职者的招聘信息。部分内容可能涉及违法犯罪活动，请不要因为“只是帮忙取东西”而放松警惕。",
    type: "job",
    category: "危险招聘",
    prefecture: "东京",
    verification: "official_source",
    riskLevel: "critical",
    publishTime: "2026-08-30",
    views: 5832,
    evidenceCount: 3,
    officialSource: true,
    tags: [
      "高额日结",
      "取快递",
      "闇バイト",
      "招聘风险",
    ],
  },
  {
    id: 2,
    title:
      "租房签约前被要求支付高额预付款，用户提交交易记录",
    summary:
      "用户反映在正式确认合同条件以前，被要求提前支付多项费用。平台已收到部分付款记录与聊天记录，目前公开内容仅展示脱敏后的事实经过。",
    type: "dispute",
    category: "租房纠纷",
    prefecture: "神奈川",
    verification: "evidence_reviewed",
    riskLevel: "medium",
    publishTime: "2026-08-28",
    views: 2364,
    evidenceCount: 4,
    tags: [
      "租房",
      "预付款",
      "合同",
    ],
  },
  {
    id: 3,
    title:
      "“帮忙取现金就能当天结算”——请勿参与此类所谓兼职",
    summary:
      "以取现金、代收现金、提款等为工作内容，同时承诺高额即时收入的信息属于高度危险信号。发现类似内容时，请停止联系并保留相关记录。",
    type: "fraud",
    category: "诈骗风险",
    prefecture: "不限地区",
    verification: "official_source",
    riskLevel: "critical",
    publishTime: "2026-08-27",
    views: 7241,
    evidenceCount: 2,
    officialSource: true,
    tags: [
      "取现金",
      "高额兼职",
      "诈骗",
    ],
  },
  {
    id: 4,
    title:
      "二手交易付款后长期未发货，卖家多次改变说明",
    summary:
      "用户提交订单记录和部分沟通记录，反映付款后长时间没有收到商品。目前该信息作为用户纠纷报告公开，不代表平台认定任何一方构成犯罪。",
    type: "consumer",
    category: "消费纠纷",
    prefecture: "大阪",
    verification: "evidence_reviewed",
    riskLevel: "medium",
    publishTime: "2026-08-25",
    views: 1825,
    evidenceCount: 5,
    tags: [
      "二手交易",
      "未发货",
      "消费纠纷",
    ],
  },
  {
    id: 5,
    title:
      "求职时被要求先购买商品或垫付大额费用",
    summary:
      "有用户反馈在应聘过程中被要求先购买指定商品或代为垫付费用。正常招聘通常不应通过模糊工作内容诱导求职者承担异常资金风险。",
    type: "job",
    category: "危险招聘",
    prefecture: "东京",
    verification: "user_report",
    riskLevel: "high",
    publishTime: "2026-08-23",
    views: 3156,
    evidenceCount: 1,
    tags: [
      "求职",
      "买货",
      "垫付",
    ],
  },
  {
    id: 6,
    title:
      "网络交易中要求脱离原平台，通过私人方式直接转账",
    summary:
      "用户分享自己在网络交易中遇到的风险经历。对方要求绕过原交易平台并直接转账，用户最终停止交易，没有产生资金损失。",
    type: "consumer",
    category: "交易风险",
    prefecture: "不限地区",
    verification: "user_report",
    riskLevel: "medium",
    publishTime: "2026-08-20",
    views: 1432,
    evidenceCount: 0,
    tags: [
      "转账",
      "网络交易",
      "避坑",
    ],
  },
  {
    id: 7,
    title:
      "以“手机代购”为名要求大量购买设备并交给陌生人",
    summary:
      "如果所谓工作要求使用自己的身份、信用卡或账户大量购买手机等高价值商品，再交给不熟悉的人，需要特别谨慎。",
    type: "job",
    category: "危险招聘",
    prefecture: "埼玉",
    verification: "evidence_reviewed",
    riskLevel: "high",
    publishTime: "2026-08-18",
    views: 2718,
    evidenceCount: 3,
    tags: [
      "手机",
      "代购",
      "买货",
      "兼职",
    ],
  },
  {
    id: 8,
    title:
      "关于近期冒充客服要求转账的风险提醒",
    summary:
      "此类信息通常以账户异常、退款、订单问题等理由要求用户进行转账或提供账户信息。涉及资金操作时，应通过官方渠道重新确认。",
    type: "official",
    category: "官方提醒",
    prefecture: "不限地区",
    verification: "official_source",
    riskLevel: "high",
    publishTime: "2026-08-16",
    views: 4017,
    evidenceCount: 1,
    officialSource: true,
    tags: [
      "客服",
      "转账",
      "官方提醒",
    ],
  },
];

const typeFilters: {
  value: "all" | RiskType;
  label: string;
}[] = [
  {
    value: "all",
    label: "全部",
  },
  {
    value: "job",
    label: "危险招聘",
  },
  {
    value: "fraud",
    label: "诈骗风险",
  },
  {
    value: "consumer",
    label: "消费避坑",
  },
  {
    value: "dispute",
    label: "纠纷报告",
  },
  {
    value: "official",
    label: "官方提醒",
  },
];

const prefectures = [
  "全部地区",
  "不限地区",
  "北海道",
  "青森",
  "岩手",
  "宫城",
  "秋田",
  "山形",
  "福岛",
  "茨城",
  "栃木",
  "群马",
  "埼玉",
  "千叶",
  "东京",
  "神奈川",
  "新潟",
  "富山",
  "石川",
  "福井",
  "山梨",
  "长野",
  "岐阜",
  "静冈",
  "爱知",
  "三重",
  "滋贺",
  "京都",
  "大阪",
  "兵库",
  "奈良",
  "和歌山",
  "鸟取",
  "岛根",
  "冈山",
  "广岛",
  "山口",
  "德岛",
  "香川",
  "爱媛",
  "高知",
  "福冈",
  "佐贺",
  "长崎",
  "熊本",
  "大分",
  "宫崎",
  "鹿儿岛",
  "冲绳",
];

const hotKeywords = [
  "高额日结",
  "取快递",
  "取现金",
  "买货",
  "转账",
  "闇バイト",
];

export default function ScamPage() {
  const [keyword, setKeyword] =
    useState("");

  const [activeType, setActiveType] =
    useState<"all" | RiskType>(
      "all"
    );

  const [prefecture, setPrefecture] =
    useState("全部地区");

  const [sort, setSort] =
    useState<SortType>("latest");

  const [page, setPage] =
    useState(1);

  const filteredReports =
    useMemo(() => {
      const q = keyword
        .trim()
        .toLowerCase();

      let result =
        reports.filter(
          (report) => {
            if (
              activeType !== "all" &&
              report.type !== activeType
            ) {
              return false;
            }

            if (
              prefecture !==
                "全部地区" &&
              report.prefecture !==
                prefecture
            ) {
              return false;
            }

            if (!q) {
              return true;
            }

            const searchable = [
              report.title,
              report.summary,
              report.category,
              report.prefecture,
              ...report.tags,
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

          if (sort === "risk") {
            return (
              getRiskScore(
                b.riskLevel
              ) -
              getRiskScore(
                a.riskLevel
              )
            );
          }

          return (
            new Date(
              b.publishTime
            ).getTime() -
            new Date(
              a.publishTime
            ).getTime()
          );
        }
      );

      return result;
    }, [
      keyword,
      activeType,
      prefecture,
      sort,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReports.length /
        PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const visibleReports =
    filteredReports.slice(
      (currentPage - 1) *
        PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  const hasFilters =
    keyword.trim() !== "" ||
    activeType !== "all" ||
    prefecture !==
      "全部地区";

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
    setActiveType("all");
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
            -left-48
            -top-48
            h-[560px]
            w-[560px]
            rounded-full
            bg-rose-500/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-56
            right-0
            h-[540px]
            w-[540px]
            rounded-full
            bg-amber-500/10
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
              lg:py-20
            "
          >
            <div
              className="
                grid
                gap-10
                lg:grid-cols-[minmax(0,1fr)_360px]
                lg:items-center
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
                  <ShieldAlert
                    size={14}
                  />
                  Sakura Safety
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
                  避坑・风险信息
                </h1>

                <p
                  className="
                    mt-4
                    max-w-2xl
                    text-sm
                    leading-7
                    text-slate-400
                    sm:text-base
                    sm:leading-8
                  "
                >
                  收集在日生活中的消费纠纷、
                  危险招聘、诈骗风险和官方提醒。
                  重点展示可核实的事实和证据状态，
                  而不是未经确认的网络“曝光”。
                </p>

                {/* SEARCH */}

                <div
                  className="
                    mt-8
                    max-w-2xl
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/10
                    p-2
                    backdrop-blur
                  "
                >
                  <div className="relative">
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
                      placeholder="搜索风险关键词、事件类型..."
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
                        focus:border-rose-400
                      "
                    />
                  </div>
                </div>

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
                    高风险关键词：
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
                          hover:border-rose-400/30
                          hover:bg-rose-400/10
                          hover:text-rose-300
                        "
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* HERO SAFETY CARD */}

              <div
                className="
                  rounded-[26px]
                  border
                  border-white/10
                  bg-white/[0.06]
                  p-5
                  backdrop-blur
                  sm:p-6
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-rose-400/10
                    text-rose-300
                  "
                >
                  <Siren size={20} />
                </div>

                <h2
                  className="
                    mt-4
                    text-lg
                    font-black
                    text-white
                  "
                >
                  遇到危险招聘？
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-400
                  "
                >
                  如果工作要求你取现金、
                  代收包裹、提款、购买大量商品、
                  提供银行卡或隐藏真实工作内容，
                  请先停止参与并保留相关信息。
                </p>

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-2
                    gap-2
                  "
                >
                  <Link
                    href="/scam/report"
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-rose-500
                      px-3
                      py-3
                      text-xs
                      font-black
                      text-white
                      transition
                      hover:bg-rose-400
                    "
                  >
                    <Flag size={15} />
                    提交线索
                  </Link>

                  <Link
                    href="/scam?type=official"
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      bg-white/5
                      px-3
                      py-3
                      text-xs
                      font-black
                      text-slate-200
                      transition
                      hover:bg-white/10
                    "
                  >
                    <Landmark
                      size={15}
                    />
                    官方提醒
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SAFETY PRINCIPLES */}

      <section
        className="
          border-b
          border-slate-200
          bg-white
        "
      >
        <Container>
          <div
            className="
              grid
              gap-3
              px-4
              py-5
              sm:grid-cols-3
            "
          >
            <PrincipleItem
              icon={
                <FileCheck2
                  size={18}
                />
              }
              title="证据优先"
              text="用户提交 ≠ 平台认定"
            />

            <PrincipleItem
              icon={
                <ShieldCheck
                  size={18}
                />
              }
              title="隐私脱敏"
              text="敏感证据不直接公开"
            />

            <PrincipleItem
              icon={
                <BadgeCheck
                  size={18}
                />
              }
              title="区分信息来源"
              text="用户报告 / 已核材料 / 官方来源"
            />
          </div>
        </Container>
      </section>

      {/* CONTENT */}

      <section className="py-9 sm:py-11">
        <Container>
          <div className="px-4">
            {/* CATEGORY */}

            <div
              className="
                overflow-x-auto
                pb-2
                [-ms-overflow-style:none]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              <div
                className="
                  flex
                  min-w-max
                  items-center
                  gap-2
                "
              >
                {typeFilters.map(
                  (item) => {
                    const active =
                      activeType ===
                      item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setActiveType(
                            item.value
                          );
                          setPage(1);
                        }}
                        className={`
                          min-h-10
                          rounded-xl
                          border
                          px-4
                          py-2.5
                          text-xs
                          font-black
                          transition
                          ${
                            active
                              ? "border-slate-950 bg-slate-950 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100"
                          }
                        `}
                      >
                        {item.label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* FILTER */}

            <div
              className="
                mt-4
                rounded-[22px]
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
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
                    size={16}
                  />
                  筛选信息
                </div>

                <div
                  className="
                    grid
                    gap-2
                    sm:grid-cols-2
                  "
                >
                  <select
                    value={prefecture}
                    onChange={(
                      event
                    ) => {
                      setPrefecture(
                        event.target
                          .value
                      );
                      setPage(1);
                    }}
                    className={
                      selectClass
                    }
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
                    onChange={(
                      event
                    ) => {
                      setSort(
                        event.target
                          .value as SortType
                      );
                      setPage(1);
                    }}
                    className={
                      selectClass
                    }
                  >
                    <option value="latest">
                      最新发布
                    </option>

                    <option value="risk">
                      风险优先
                    </option>

                    <option value="popular">
                      浏览最多
                    </option>
                  </select>
                </div>
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
                  <span
                    className="
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
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

                  {activeType !==
                    "all" && (
                    <FilterChip
                      label={
                        typeFilters.find(
                          (item) =>
                            item.value ===
                            activeType
                        )?.label ??
                        activeType
                      }
                      onRemove={() => {
                        setActiveType(
                          "all"
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
                    onClick={
                      clearFilters
                    }
                    className="
                      ml-auto
                      text-xs
                      font-black
                      text-slate-400
                      transition
                      hover:text-rose-600
                    "
                  >
                    清除全部
                  </button>
                </div>
              )}
            </div>

            {/* HEADER */}

            <div
              className="
                mt-8
                flex
                flex-col
                gap-4
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
                    text-rose-600
                  "
                >
                  SAFETY DATABASE
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
                  风险信息
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  共{" "}
                  {
                    filteredReports.length
                  }{" "}
                  条公开信息
                </p>
              </div>

              <Link
                href="/scam/report"
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-rose-600
                  px-4
                  py-3
                  text-xs
                  font-black
                  text-white
                  transition
                  hover:bg-rose-700
                "
              >
                <Flag size={15} />
                举报 / 提交线索
              </Link>
            </div>

            {/* LIST */}

            {visibleReports.length >
            0 ? (
              <div
                className="
                  mt-6
                  grid
                  gap-5
                  lg:grid-cols-2
                "
              >
                {visibleReports.map(
                  (report) => (
                    <RiskCard
                      key={report.id}
                      report={report}
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

            {filteredReports.length >
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
                  className={
                    pageButtonClass
                  }
                  aria-label="上一页"
                >
                  <ChevronLeft
                    size={17}
                  />
                </button>

                {Array.from({
                  length:
                    totalPages,
                }).map(
                  (_, index) => {
                    const pageNumber =
                      index + 1;

                    const active =
                      pageNumber ===
                      currentPage;

                    return (
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
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }
                        `}
                      >
                        {pageNumber}
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
                    setPage(
                      Math.min(
                        totalPages,
                        currentPage + 1
                      )
                    )
                  }
                  className={
                    pageButtonClass
                  }
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

      {/* FOOTER SAFETY */}

      <section
        className="
          border-t
          border-slate-200
          bg-white
          py-10
        "
      >
        <Container>
          <div className="px-4">
            <div
              className="
                grid
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200
                bg-slate-50
                lg:grid-cols-[1fr_360px]
              "
            >
              <div
                className="
                  p-6
                  sm:p-8
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-amber-100
                    text-amber-700
                  "
                >
                  <CircleAlert
                    size={20}
                  />
                </div>

                <h2
                  className="
                    mt-4
                    text-xl
                    font-black
                    text-slate-950
                  "
                >
                  Sakura
                  不做未经核实的“曝光墙”
                </h2>

                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-7
                    text-slate-600
                  "
                >
                  用户可以报告自己的实际经历，
                  但公开内容会区分用户陈述、
                  平台已查看材料和官方来源。
                  涉及个人隐私、付款资料、
                  身份信息等证据默认不会直接公开。
                </p>
              </div>

              <div
                className="
                  border-t
                  border-slate-200
                  bg-slate-950
                  p-6
                  text-white
                  lg:border-l
                  lg:border-t-0
                "
              >
                <ShieldCheck
                  size={23}
                  className="text-emerald-400"
                />

                <h3
                  className="
                    mt-4
                    text-base
                    font-black
                  "
                >
                  如果正在发生紧急危险
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-400
                  "
                >
                  Sakura
                  是信息与举报平台，
                  不能替代警方、消费者保护机构、
                  医疗机构或其他紧急服务。
                  遇到现实中的即时危险时，
                  应优先联系适当的官方机构。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MOBILE REPORT BAR */}

      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-40
          border-t
          border-slate-200
          bg-white/95
          px-4
          py-3
          backdrop-blur
          lg:hidden
          [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-lg
            items-center
            gap-2
          "
        >
          <Link
            href="/scam/report"
            className="
              inline-flex
              min-h-11
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-rose-600
              px-4
              py-3
              text-sm
              font-black
              text-white
            "
          >
            <Flag size={16} />
            举报 / 提交线索
          </Link>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </main>
  );
}

function RiskCard({
  report,
}: {
  report: ScamReport;
}) {
  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200
        bg-white
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-slate-200/50
      "
    >
      <div
        className={`
          h-1.5
          w-full
          ${getRiskBarClass(
            report.riskLevel
          )}
        `}
      />

      <div
        className="
          flex
          flex-1
          flex-col
          p-5
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
          <RiskBadge
            level={
              report.riskLevel
            }
          />

          <VerificationBadge
            level={
              report.verification
            }
          />

          <span
            className="
              text-[11px]
              font-bold
              text-slate-400
            "
          >
            {report.prefecture}
          </span>
        </div>

        <Link
          href={`/scam/${report.id}`}
          className="mt-4 block"
        >
          <h3
            className="
              text-lg
              font-black
              leading-7
              tracking-tight
              text-slate-950
              transition
              group-hover:text-rose-700
              sm:text-xl
            "
          >
            {report.title}
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
          {report.summary}
        </p>

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-1.5
          "
        >
          {report.tags.map(
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
            <span>
              {formatDate(
                report.publishTime
              )}
            </span>

            <span>
              {formatViews(
                report.views
              )}{" "}
              浏览
            </span>

            {report.evidenceCount >
              0 && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                "
              >
                <FileCheck2
                  size={12}
                />
                {
                  report.evidenceCount
                }{" "}
                项材料
              </span>
            )}
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
                font-black
                text-slate-500
              "
            >
              {report.category}
            </span>

            <Link
              href={`/scam/${report.id}`}
              className="
                inline-flex
                min-h-9
                items-center
                gap-1.5
                text-xs
                font-black
                text-rose-700
                transition
                group-hover:gap-2.5
              "
            >
              查看详情
              <ArrowRight
                size={14}
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function RiskBadge({
  level,
}: {
  level: RiskLevel;
}) {
  const config = {
    low: {
      label: "低风险",
      className:
        "border-slate-200 bg-slate-50 text-slate-600",
    },
    medium: {
      label: "注意",
      className:
        "border-amber-200 bg-amber-50 text-amber-700",
    },
    high: {
      label: "高风险",
      className:
        "border-orange-200 bg-orange-50 text-orange-700",
    },
    critical: {
      label: "高度危险",
      className:
        "border-rose-200 bg-rose-50 text-rose-700",
    },
  } as const;

  const item = config[level];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        font-black
        ${item.className}
      `}
    >
      <AlertTriangle
        size={11}
      />
      {item.label}
    </span>
  );
}

function VerificationBadge({
  level,
}: {
  level: VerificationLevel;
}) {
  if (
    level === "official_source"
  ) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          border
          border-blue-200
          bg-blue-50
          px-2.5
          py-1
          text-[10px]
          font-black
          text-blue-700
        "
      >
        <Landmark size={11} />
        官方来源
      </span>
    );
  }

  if (
    level ===
    "evidence_reviewed"
  ) {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          rounded-full
          border
          border-emerald-200
          bg-emerald-50
          px-2.5
          py-1
          text-[10px]
          font-black
          text-emerald-700
        "
      >
        <FileCheck2
          size={11}
        />
        已查看材料
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-slate-200
        bg-slate-50
        px-2.5
        py-1
        text-[10px]
        font-black
        text-slate-600
      "
    >
      <UserRoundSearch
        size={11}
      />
      用户报告
    </span>
  );
}

function PrincipleItem({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-100
        bg-slate-50
        p-4
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white
          text-slate-700
          shadow-sm
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p
          className="
            text-xs
            font-black
            text-slate-900
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[11px]
            font-semibold
            text-slate-400
          "
        >
          {text}
        </p>
      </div>
    </div>
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
        min-h-8
        items-center
        gap-1.5
        rounded-full
        border
        border-rose-100
        bg-rose-50
        px-3
        py-1.5
        text-xs
        font-bold
        text-rose-700
        transition
        hover:border-rose-200
        hover:bg-rose-100
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
        <MessageSquareWarning
          size={23}
        />
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-black
          text-slate-950
        "
      >
        暂时没有找到相关信息
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
          min-h-11
          rounded-xl
          bg-slate-950
          px-5
          py-2.5
          text-sm
          font-black
          text-white
        "
      >
        清除筛选
      </button>
    </div>
  );
}

const selectClass = `
  min-h-11
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-2.5
  text-sm
  font-bold
  text-slate-700
  outline-none
  transition
  focus:border-rose-400
  focus:ring-4
  focus:ring-rose-50
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
  hover:bg-slate-50
  disabled:cursor-not-allowed
  disabled:opacity-30
`;

function getRiskScore(
  level: RiskLevel
) {
  switch (level) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}

function getRiskBarClass(
  level: RiskLevel
) {
  switch (level) {
    case "critical":
      return "bg-rose-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-amber-400";
    case "low":
      return "bg-slate-300";
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