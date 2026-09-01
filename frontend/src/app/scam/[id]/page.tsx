"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Copy,
  ExternalLink,
  Eye,
  FileCheck2,
  FileWarning,
  Flag,
  Landmark,
  Link2,
  Loader2,
  LockKeyhole,
  MessageSquareReply,
  MessageSquareWarning,
  Scale,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Siren,
  UserRoundSearch,
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

type TimelineType =
  | "event"
  | "payment"
  | "contact"
  | "platform"
  | "official";

type EvidenceVisibility =
  | "admin_only"
  | "public_redacted";

type EvidenceReviewStatus =
  | "submitted"
  | "reviewed"
  | "matched"
  | "official";

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  type: TimelineType;
}

interface EvidenceItem {
  id: string;
  title: string;
  type:
    | "chat"
    | "payment"
    | "contract"
    | "official"
    | "other";
  reviewStatus: EvidenceReviewStatus;
  visibility: EvidenceVisibility;
  publicNote: string;
}

interface ResponseItem {
  id: string;
  responderName: string;
  responderType:
    | "reported_party"
    | "business"
    | "platform";
  date: string;
  content: string;
  verified: boolean;
}

interface OfficialReference {
  id: string;
  organization: string;
  title: string;
  note: string;
  sourceUrl?: string;
}

interface ScamDetail {
  id: number;
  title: string;
  summary: string;
  type: RiskType;
  category: string;
  prefecture: string;
  verification: VerificationLevel;
  riskLevel: RiskLevel;
  publishTime: string;
  updatedTime?: string;
  views: number;
  evidenceCount: number;
  tags: string[];
  reporterLabel: string;
  incidentPeriod: string;
  incidentDescription: string;
  safetyAdvice: string[];
  timeline: TimelineItem[];
  evidence: EvidenceItem[];
  responses: ResponseItem[];
  officialReferences: OfficialReference[];
}

interface RelatedReport {
  id: number;
  title: string;
  summary: string;
  category: string;
  riskLevel: RiskLevel;
  verification: VerificationLevel;
  prefecture: string;
}

const reports: ScamDetail[] = [
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
    updatedTime: "2026-08-31",
    views: 5832,
    evidenceCount: 3,
    tags: [
      "高额日结",
      "取快递",
      "闇バイト",
      "招聘风险",
    ],
    reporterLabel: "平台安全整理",
    incidentPeriod:
      "2026 年 8 月",
    incidentDescription:
      "平台收到多条关于高额日结、代取包裹、只负责跑腿等招聘内容的用户线索。部分信息没有明确说明雇主、劳动条件或真实工作内容，却要求应聘者转移到私人聊天工具继续沟通，并承诺明显高于一般兼职的即时收入。此类特征本身并不能单独证明具体发布者实施犯罪，但属于需要高度警惕的危险招聘模式。",
    safetyAdvice: [
      "不要因为“只是取东西”“只是跑腿”就默认工作合法。",
      "不要把银行卡、账户、手机卡、身份证件或认证信息交给陌生人。",
      "遇到要求取现金、提款、代收包裹、购买大量高价值商品等内容时，应立即停止参与。",
      "保留招聘页面、聊天记录、账号名称、电话号码和转账要求等信息。",
      "如果已经受到威胁或正在发生现实危险，应优先联系警方或适当的官方机构。",
    ],
    timeline: [
      {
        id: "t1",
        date: "2026-08-21",
        title: "用户首次提交线索",
        description:
          "用户报告看到“当天结算、工作简单、只需取包裹”的招聘信息，并提交脱敏截图。",
        type: "contact",
      },
      {
        id: "t2",
        date: "2026-08-22",
        title: "平台进入高风险审核",
        description:
          "由于内容包含高额即时收入、工作内容模糊和转移私人联系方式等特征，信息被列入安全审核。",
        type: "platform",
      },
      {
        id: "t3",
        date: "2026-08-25",
        title: "补充相关材料",
        description:
          "第二名用户提交相似招募截图。平台仅比较公开可核实特征，不公开原始私人聊天内容。",
        type: "event",
      },
      {
        id: "t4",
        date: "2026-08-30",
        title: "发布风险提醒",
        description:
          "平台以风险教育形式发布提醒，不公开认定任何未经官方确认的个人构成犯罪。",
        type: "official",
      },
    ],
    evidence: [
      {
        id: "e1",
        title:
          "招聘页面截图",
        type: "chat",
        reviewStatus: "reviewed",
        visibility:
          "public_redacted",
        publicNote:
          "平台已查看。公开版本已隐藏账号、电话号码及其他可识别个人的信息。",
      },
      {
        id: "e2",
        title:
          "私人聊天截图",
        type: "chat",
        reviewStatus: "reviewed",
        visibility: "admin_only",
        publicNote:
          "包含私人联系方式和聊天对象信息，仅供授权审核人员查看。",
      },
      {
        id: "e3",
        title:
          "官方风险提醒材料",
        type: "official",
        reviewStatus: "official",
        visibility:
          "public_redacted",
        publicNote:
          "用于说明此类招聘模式的公共风险特征，不代表官方确认本报告中的具体账号实施犯罪。",
      },
    ],
    responses: [
      {
        id: "r1",
        responderName:
          "Sakura 内容安全团队",
        responderType: "platform",
        date: "2026-08-30",
        content:
          "本页面用于说明危险招聘模式。平台不会仅依据匿名用户陈述，将任何个人或企业公开定性为诈骗或犯罪主体。若相关方认为公开信息存在事实错误，可以提交纠错申请和反证材料。",
        verified: true,
      },
    ],
    officialReferences: [
      {
        id: "o1",
        organization:
          "日本警方相关公开提醒",
        title:
          "关于高额报酬、取现金、代收物品等危险招聘模式的安全提醒",
        note:
          "正式上线后，这里应连接经过平台审核的官方来源页面，并保存来源标题、机构、发布日期和链接。",
      },
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
    verification:
      "evidence_reviewed",
    riskLevel: "medium",
    publishTime: "2026-08-28",
    views: 2364,
    evidenceCount: 4,
    tags: [
      "租房",
      "预付款",
      "合同",
    ],
    reporterLabel: "匿名用户报告",
    incidentPeriod:
      "2026 年 7 月 ～ 8 月",
    incidentDescription:
      "报告用户称，在正式确认部分合同条件以前，被要求支付多项费用。平台已查看部分支付记录及沟通记录，但目前材料不足以认定任何一方存在违法行为，因此本页面仅以消费纠纷报告形式展示。",
    safetyAdvice: [
      "付款以前确认收款对象、费用名目以及合同条件。",
      "保留报价单、合同、支付记录和聊天记录。",
      "对无法说明用途的大额费用保持谨慎。",
      "发生争议时优先通过书面方式确认双方主张。",
    ],
    timeline: [
      {
        id: "t1",
        date: "2026-07-25",
        title: "咨询房源",
        description:
          "用户开始与相关方沟通租房条件。",
        type: "contact",
      },
      {
        id: "t2",
        date: "2026-07-29",
        title: "发生付款",
        description:
          "用户提交记录显示发生一笔预付款。",
        type: "payment",
      },
      {
        id: "t3",
        date: "2026-08-18",
        title: "提交平台报告",
        description:
          "用户向平台提供付款记录及部分聊天材料。",
        type: "platform",
      },
    ],
    evidence: [
      {
        id: "e1",
        title: "付款记录",
        type: "payment",
        reviewStatus: "reviewed",
        visibility: "admin_only",
        publicNote:
          "平台已查看，银行账号、姓名及金额细节不直接公开。",
      },
      {
        id: "e2",
        title: "聊天记录",
        type: "chat",
        reviewStatus: "reviewed",
        visibility: "admin_only",
        publicNote:
          "平台已查看，仅公开与事件时间线相关的事实摘要。",
      },
    ],
    responses: [],
    officialReferences: [],
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
    tags: [
      "取现金",
      "高额兼职",
      "诈骗",
    ],
    reporterLabel: "平台安全整理",
    incidentPeriod: "持续风险",
    incidentDescription:
      "以代收现金、提款、转移资金等为实际工作内容，同时使用高额即时收入吸引参与者，属于需要立即远离的高风险模式。本页面用于安全教育，不指向未经确认的特定个人。",
    safetyAdvice: [
      "不要替陌生人取现金、提款或转移资金。",
      "不要提供自己的银行账户供他人使用。",
      "不要因为对方称“只是代收”就忽略法律风险。",
      "已经参与时不要继续扩大行为，应尽快寻求适当的法律或警方帮助。",
    ],
    timeline: [],
    evidence: [
      {
        id: "e1",
        title:
          "风险模式整理",
        type: "official",
        reviewStatus: "official",
        visibility:
          "public_redacted",
        publicNote:
          "根据公开安全提醒整理。",
      },
    ],
    responses: [],
    officialReferences: [],
  },
];

export default function ScamDetailPage() {
  const params =
    useParams<{ id: string }>();

  const reportId = Number(
    params.id
  );

  const [loading, setLoading] =
    useState(true);

  const [report, setReport] =
    useState<ScamDetail | null>(
      null
    );

  const [copied, setCopied] =
    useState(false);

  const [notice, setNotice] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadReport() {
      setLoading(true);

      try {
        // TODO [API - GET]
        // GET /api/scams/:id
        // Purpose: load one published public safety report.

        await new Promise(
          (resolve) => {
            window.setTimeout(
              resolve,
              250
            );
          }
        );

        const data =
          reports.find(
            (item) =>
              item.id === reportId
          ) ?? null;

        if (active) {
          setReport(data);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadReport();

    return () => {
      active = false;
    };
  }, [reportId]);

  const relatedReports =
    useMemo(() => {
      if (!report) {
        return [];
      }

      return reports
        .filter(
          (item) =>
            item.id !== report.id
        )
        .map((item) => {
          let score = 0;

          if (
            item.type ===
            report.type
          ) {
            score += 4;
          }

          if (
            item.riskLevel ===
            report.riskLevel
          ) {
            score += 2;
          }

          if (
            item.prefecture ===
            report.prefecture
          ) {
            score += 1;
          }

          return {
            item,
            score,
          };
        })
        .sort(
          (a, b) =>
            b.score - a.score
        )
        .slice(0, 3)
        .map(
          (entry) => entry.item
        );
    }, [report]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);
      setNotice("链接已复制");

      window.setTimeout(() => {
        setCopied(false);
        setNotice("");
      }, 1600);
    } catch {
      setNotice(
        "复制失败，请手动复制浏览器地址。"
      );
    }
  }

  async function shareReport() {
    if (!report) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: report.title,
          text: report.summary,
          url:
            window.location.href,
        });

        return;
      } catch {
        return;
      }
    }

    await copyLink();
  }

  if (loading) {
    return <LoadingPage />;
  }

  if (!report) {
    return <NotFoundPage />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* BREADCRUMB */}

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
              flex
              items-center
              gap-2
              overflow-hidden
              px-4
              py-4
              text-xs
              font-bold
              text-slate-400
            "
          >
            <Link
              href="/"
              className="
                shrink-0
                transition
                hover:text-slate-900
              "
            >
              首页
            </Link>

            <ChevronRight
              size={13}
              className="shrink-0"
            />

            <Link
              href="/scam"
              className="
                shrink-0
                transition
                hover:text-slate-900
              "
            >
              避坑・风险信息
            </Link>

            <ChevronRight
              size={13}
              className="shrink-0"
            />

            <span
              className="
                truncate
                text-slate-600
              "
            >
              {report.title}
            </span>
          </div>
        </Container>
      </section>

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
            -left-44
            -top-44
            h-[520px]
            w-[520px]
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
            h-[520px]
            w-[520px]
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
              py-12
              sm:py-16
            "
          >
            <Link
              href="/scam"
              className="
                inline-flex
                min-h-10
                items-center
                gap-2
                text-xs
                font-black
                text-slate-400
                transition
                hover:text-white
              "
            >
              <ArrowLeft size={15} />
              返回风险信息
            </Link>

            <div
              className="
                mt-7
                max-w-4xl
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
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    px-3
                    py-1.5
                    text-[11px]
                    font-black
                    text-slate-300
                  "
                >
                  {report.category}
                </span>
              </div>

              <h1
                className="
                  mt-6
                  text-3xl
                  font-black
                  leading-tight
                  tracking-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {report.title}
              </h1>

              <p
                className="
                  mt-5
                  max-w-3xl
                  text-sm
                  leading-7
                  text-slate-400
                  sm:text-base
                  sm:leading-8
                "
              >
                {report.summary}
              </p>

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  gap-x-5
                  gap-y-3
                  text-xs
                  font-semibold
                  text-slate-400
                "
              >
                <span>
                  {report.prefecture}
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >
                  <Clock3 size={14} />
                  {formatDate(
                    report.publishTime
                  )}
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >
                  <Eye size={14} />
                  {formatViews(
                    report.views
                  )}{" "}
                  浏览
                </span>

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                  "
                >
                  <FileCheck2
                    size={14}
                  />
                  {
                    report.evidenceCount
                  }{" "}
                  项材料
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* IMPORTANT NOTICE */}

      <section
        className="
          border-b
          border-amber-200
          bg-amber-50
        "
      >
        <Container>
          <div
            className="
              flex
              items-start
              gap-3
              px-4
              py-4
            "
          >
            <Scale
              size={18}
              className="
                mt-0.5
                shrink-0
                text-amber-700
              "
            />

            <p
              className="
                text-xs
                leading-6
                text-amber-900
                sm:text-sm
              "
            >
              本页面会明确区分
              <strong>
                用户报告、平台已查看材料和官方来源
              </strong>
              。除非存在明确官方结论，
              Sakura
              不会仅凭用户投诉将个人或企业认定为诈骗犯、犯罪者或违法主体。
            </p>
          </div>
        </Container>
      </section>

      {/* MAIN */}

      <section className="py-8 sm:py-10">
        <Container>
          <div
            className="
              grid
              gap-7
              px-4
              xl:grid-cols-[minmax(0,760px)_320px]
              xl:justify-center
            "
          >
            <div className="min-w-0 space-y-6">
              {/* INCIDENT */}

              <SectionCard
                icon={
                  <MessageSquareWarning
                    size={19}
                  />
                }
                eyebrow="REPORT"
                title="事件说明"
              >
                <div
                  className="
                    grid
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  <InfoBox
                    label="信息来源"
                    value={
                      report.reporterLabel
                    }
                  />

                  <InfoBox
                    label="事件时期"
                    value={
                      report.incidentPeriod
                    }
                  />
                </div>

                <p
                  className="
                    mt-5
                    whitespace-pre-wrap
                    text-sm
                    leading-8
                    text-slate-700
                    sm:text-[15px]
                  "
                >
                  {
                    report.incidentDescription
                  }
                </p>
              </SectionCard>

              {/* SAFETY ADVICE */}

              <SectionCard
                icon={
                  <ShieldAlert
                    size={19}
                  />
                }
                eyebrow="SAFETY"
                title="安全建议"
              >
                <div className="space-y-3">
                  {report.safetyAdvice.map(
                    (
                      advice,
                      index
                    ) => (
                      <div
                        key={advice}
                        className="
                          flex
                          items-start
                          gap-3
                          rounded-2xl
                          bg-rose-50
                          p-4
                        "
                      >
                        <div
                          className="
                            flex
                            h-6
                            w-6
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-rose-600
                            text-[10px]
                            font-black
                            text-white
                          "
                        >
                          {index + 1}
                        </div>

                        <p
                          className="
                            text-sm
                            leading-7
                            text-rose-950
                          "
                        >
                          {advice}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </SectionCard>

              {/* TIMELINE */}

              {report.timeline.length >
                0 && (
                <SectionCard
                  icon={
                    <Clock3
                      size={19}
                    />
                  }
                  eyebrow="TIMELINE"
                  title="事件时间线"
                >
                  <div className="relative">
                    <div
                      className="
                        absolute
                        bottom-3
                        left-[15px]
                        top-3
                        w-px
                        bg-slate-200
                      "
                    />

                    <div className="space-y-5">
                      {report.timeline.map(
                        (item) => (
                          <TimelineRow
                            key={
                              item.id
                            }
                            item={item}
                          />
                        )
                      )}
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* EVIDENCE */}

              <SectionCard
                icon={
                  <FileCheck2
                    size={19}
                  />
                }
                eyebrow="EVIDENCE"
                title="证据与材料状态"
              >
                <div
                  className="
                    rounded-2xl
                    border
                    border-blue-100
                    bg-blue-50
                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <LockKeyhole
                      size={17}
                      className="
                        mt-0.5
                        shrink-0
                        text-blue-700
                      "
                    />

                    <p
                      className="
                        text-xs
                        leading-6
                        text-blue-900
                      "
                    >
                      原始合同、聊天记录、
                      银行信息、电话号码和身份资料等敏感证据不会因为提交举报就自动公开。
                      公开页面只展示允许公开的脱敏摘要。
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {report.evidence.map(
                    (evidence) => (
                      <EvidenceRow
                        key={
                          evidence.id
                        }
                        evidence={
                          evidence
                        }
                      />
                    )
                  )}
                </div>
              </SectionCard>

              {/* RESPONSES */}

              <SectionCard
                icon={
                  <MessageSquareReply
                    size={19}
                  />
                }
                eyebrow="RESPONSE"
                title="相关方回应"
              >
                {report.responses.length >
                0 ? (
                  <div className="space-y-4">
                    {report.responses.map(
                      (response) => (
                        <ResponseCard
                          key={
                            response.id
                          }
                          response={
                            response
                          }
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      border-slate-300
                      bg-slate-50
                      p-5
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-black
                        text-slate-800
                      "
                    >
                      暂无公开回应
                    </p>

                    <p
                      className="
                        mt-2
                        text-xs
                        leading-6
                        text-slate-500
                      "
                    >
                      被报告方或相关企业以后可以通过身份验证后提交说明、反证材料或纠错申请。
                      提交回应不会自动删除原报告。
                    </p>
                  </div>
                )}
              </SectionCard>

              {/* OFFICIAL REFERENCES */}

              {report.officialReferences
                .length > 0 && (
                <SectionCard
                  icon={
                    <Landmark
                      size={19}
                    />
                  }
                  eyebrow="OFFICIAL"
                  title="官方参考信息"
                >
                  <div className="space-y-3">
                    {report.officialReferences.map(
                      (reference) => (
                        <div
                          key={
                            reference.id
                          }
                          className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            p-4
                          "
                        >
                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-3
                            "
                          >
                            <div>
                              <p
                                className="
                                  text-[11px]
                                  font-black
                                  text-blue-700
                                "
                              >
                                {
                                  reference.organization
                                }
                              </p>

                              <h3
                                className="
                                  mt-1
                                  text-sm
                                  font-black
                                  leading-6
                                  text-slate-950
                                "
                              >
                                {
                                  reference.title
                                }
                              </h3>
                            </div>

                            {reference.sourceUrl && (
                              <a
                                href={
                                  reference.sourceUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="
                                  flex
                                  h-9
                                  w-9
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-slate-200
                                  bg-white
                                  text-slate-500
                                  transition
                                  hover:text-blue-700
                                "
                                aria-label="打开官方来源"
                              >
                                <ExternalLink
                                  size={15}
                                />
                              </a>
                            )}
                          </div>

                          <p
                            className="
                              mt-2
                              text-xs
                              leading-6
                              text-slate-500
                            "
                          >
                            {reference.note}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </SectionCard>
              )}

              {/* TAGS */}

              <SectionCard
                icon={
                  <BookOpenCheck
                    size={19}
                  />
                }
                eyebrow="TAGS"
                title="相关标签"
              >
                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {report.tags.map(
                    (tag) => (
                      <Link
                        key={tag}
                        href={`/scam?q=${encodeURIComponent(
                          tag
                        )}`}
                        className="
                          rounded-full
                          border
                          border-slate-200
                          bg-slate-50
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          text-slate-600
                          transition
                          hover:border-rose-200
                          hover:bg-rose-50
                          hover:text-rose-700
                        "
                      >
                        #{tag}
                      </Link>
                    )
                  )}
                </div>
              </SectionCard>
            </div>

            {/* SIDEBAR */}

            <aside
              className="
                h-fit
                space-y-4
                xl:sticky
                xl:top-24
              "
            >
              <div
                className="
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <p
                  className="
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-rose-600
                  "
                >
                  STATUS
                </p>

                <h2
                  className="
                    mt-2
                    text-lg
                    font-black
                    text-slate-950
                  "
                >
                  信息状态
                </h2>

                <div className="mt-4 space-y-3">
                  <SidebarRow
                    label="风险等级"
                    value={
                      getRiskLabel(
                        report.riskLevel
                      )
                    }
                  />

                  <SidebarRow
                    label="信息类型"
                    value={
                      report.category
                    }
                  />

                  <SidebarRow
                    label="核实状态"
                    value={
                      getVerificationLabel(
                        report.verification
                      )
                    }
                  />

                  <SidebarRow
                    label="公开材料"
                    value={`${report.evidenceCount} 项`}
                  />
                </div>
              </div>

              {/* ACTIONS */}

              <div
                className="
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                "
              >
                <h2
                  className="
                    text-base
                    font-black
                    text-slate-950
                  "
                >
                  页面操作
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    void shareReport()
                  }
                  className="
                    mt-4
                    inline-flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    font-black
                    text-slate-700
                    transition
                    hover:border-rose-200
                    hover:text-rose-700
                  "
                >
                  <Share2 size={16} />
                  分享提醒
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void copyLink()
                  }
                  className="
                    mt-2
                    inline-flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-950
                    px-4
                    py-3
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-slate-800
                  "
                >
                  {copied ? (
                    <Check size={16} />
                  ) : (
                    <Link2 size={16} />
                  )}

                  {copied
                    ? "链接已复制"
                    : "复制页面链接"}
                </button>

                {notice && (
                  <p
                    className="
                      mt-3
                      text-center
                      text-xs
                      font-bold
                      text-emerald-600
                    "
                  >
                    {notice}
                  </p>
                )}
              </div>

              {/* REPORT */}

              <div
                className="
                  overflow-hidden
                  rounded-[24px]
                  bg-slate-950
                  p-5
                  text-white
                "
              >
                <Flag
                  size={20}
                  className="text-rose-400"
                />

                <h2
                  className="
                    mt-4
                    text-lg
                    font-black
                  "
                >
                  你有相关线索？
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-400
                  "
                >
                  可以提交新的证据、补充事实或类似风险信息。
                  敏感材料默认不会直接公开。
                </p>

                <Link
                  href="/scam/report"
                  className="
                    mt-5
                    inline-flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-rose-500
                    px-4
                    py-3
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-rose-400
                  "
                >
                  提交线索
                  <ArrowRight
                    size={15}
                  />
                </Link>
              </div>

              {/* CORRECTION */}

              <div
                className="
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-5
                "
              >
                <Building2
                  size={19}
                  className="text-slate-500"
                />

                <h2
                  className="
                    mt-3
                    text-sm
                    font-black
                    text-slate-950
                  "
                >
                  被报告方 / 企业
                </h2>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-500
                  "
                >
                  如果本页面涉及你本人或你的企业，
                  可以提交身份验证、事实纠错、公开回应或反证材料。
                </p>

                <Link
                  href={`/scam/${report.id}/correction`}
                  className="
                    mt-4
                    inline-flex
                    min-h-10
                    items-center
                    gap-2
                    text-xs
                    font-black
                    text-slate-700
                    transition
                    hover:text-rose-700
                  "
                >
                  申请纠错 / 回应
                  <ArrowRight
                    size={13}
                  />
                </Link>
              </div>

              <div
                className="
                  rounded-[22px]
                  border
                  border-amber-200
                  bg-amber-50
                  p-5
                "
              >
                <CircleAlert
                  size={18}
                  className="text-amber-700"
                />

                <h3
                  className="
                    mt-3
                    text-sm
                    font-black
                    text-amber-950
                  "
                >
                  紧急情况
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-amber-900/80
                  "
                >
                  如果当前正在遭受威胁、
                  被要求参与违法行为，
                  或现实中存在即时危险，
                  不要等待平台审核，
                  应优先联系适当的官方机构。
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* RELATED */}

      {relatedReports.length > 0 && (
        <section
          className="
            border-t
            border-slate-200
            bg-white
            py-12
          "
        >
          <Container>
            <div className="px-4">
              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-4
                "
              >
                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.14em]
                      text-rose-600
                    "
                  >
                    RELATED
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      font-black
                      text-slate-950
                    "
                  >
                    相关风险信息
                  </h2>
                </div>

                <Link
                  href="/scam"
                  className="
                    hidden
                    items-center
                    gap-1.5
                    text-xs
                    font-black
                    text-slate-500
                    sm:inline-flex
                  "
                >
                  查看全部
                  <ArrowRight
                    size={14}
                  />
                </Link>
              </div>

              <div
                className="
                  mt-6
                  grid
                  gap-4
                  md:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {relatedReports.map(
                  (item) => (
                    <RelatedCard
                      key={item.id}
                      report={item}
                    />
                  )
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* MOBILE BOTTOM ACTION */}

      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-40
          border-t
          border-slate-200
          bg-white/95
          px-3
          py-2.5
          backdrop-blur
          xl:hidden
          [padding-bottom:max(0.625rem,env(safe-area-inset-bottom))]
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-lg
            grid-cols-3
            gap-2
          "
        >
          <button
            type="button"
            onClick={() =>
              void shareReport()
            }
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              border-slate-200
              bg-white
              text-xs
              font-black
              text-slate-700
            "
          >
            <Share2 size={15} />
            分享
          </button>

          <Link
            href={`/scam/${report.id}/correction`}
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-1.5
              rounded-xl
              border
              border-slate-200
              bg-white
              text-xs
              font-black
              text-slate-700
            "
          >
            <Scale size={15} />
            纠错
          </Link>

          <Link
            href="/scam/report"
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-1.5
              rounded-xl
              bg-rose-600
              text-xs
              font-black
              text-white
            "
          >
            <Flag size={15} />
            举报
          </Link>
        </div>
      </div>

      <div className="h-20 xl:hidden" />
    </main>
  );
}

function SectionCard({
  icon,
  eyebrow,
  title,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="
        rounded-[26px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        sm:p-7
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-slate-700
          "
        >
          {icon}
        </div>

        <div>
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.15em]
              text-rose-600
            "
          >
            {eyebrow}
          </p>

          <h2
            className="
              mt-0.5
              text-lg
              font-black
              text-slate-950
            "
          >
            {title}
          </h2>
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        bg-slate-50
        p-4
      "
    >
      <p
        className="
          text-[10px]
          font-black
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1.5
          text-sm
          font-black
          text-slate-900
        "
      >
        {value}
      </p>
    </div>
  );
}

function TimelineRow({
  item,
}: {
  item: TimelineItem;
}) {
  return (
    <div
      className="
        relative
        flex
        gap-4
      "
    >
      <div
        className="
          relative
          z-10
          mt-1
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          bg-white
        "
      >
        <div
          className={`
            h-2.5
            w-2.5
            rounded-full
            ${getTimelineDotClass(
              item.type
            )}
          `}
        />
      </div>

      <div
        className="
          min-w-0
          flex-1
          pb-2
        "
      >
        <p
          className="
            text-[11px]
            font-bold
            text-slate-400
          "
        >
          {formatDate(item.date)}
        </p>

        <h3
          className="
            mt-1
            text-sm
            font-black
            text-slate-950
          "
        >
          {item.title}
        </h3>

        <p
          className="
            mt-1.5
            text-xs
            leading-6
            text-slate-500
          "
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

function EvidenceRow({
  evidence,
}: {
  evidence: EvidenceItem;
}) {
  const isPrivate =
    evidence.visibility ===
    "admin_only";

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-3
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
              bg-slate-100
              text-slate-600
            "
          >
            {isPrivate ? (
              <LockKeyhole
                size={16}
              />
            ) : (
              <FileCheck2
                size={16}
              />
            )}
          </div>

          <div className="min-w-0">
            <h3
              className="
                text-sm
                font-black
                text-slate-950
              "
            >
              {evidence.title}
            </h3>

            <p
              className="
                mt-1.5
                text-xs
                leading-6
                text-slate-500
              "
            >
              {evidence.publicNote}
            </p>
          </div>
        </div>

        <div
          className="
            flex
            shrink-0
            flex-wrap
            gap-2
          "
        >
          <EvidenceStatusBadge
            status={
              evidence.reviewStatus
            }
          />

          <span
            className={`
              rounded-full
              border
              px-2.5
              py-1
              text-[10px]
              font-black
              ${
                isPrivate
                  ? "border-slate-200 bg-slate-50 text-slate-600"
                  : "border-blue-200 bg-blue-50 text-blue-700"
              }
            `}
          >
            {isPrivate
              ? "仅审核员可见"
              : "公开脱敏摘要"}
          </span>
        </div>
      </div>
    </div>
  );
}

function EvidenceStatusBadge({
  status,
}: {
  status: EvidenceReviewStatus;
}) {
  const config = {
    submitted: {
      label: "已提交",
      className:
        "border-slate-200 bg-slate-50 text-slate-600",
    },
    reviewed: {
      label: "已查看材料",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    matched: {
      label: "信息吻合",
      className:
        "border-violet-200 bg-violet-50 text-violet-700",
    },
    official: {
      label: "官方来源",
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },
  } as const;

  const item = config[status];

  return (
    <span
      className={`
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        font-black
        ${item.className}
      `}
    >
      {item.label}
    </span>
  );
}

function ResponseCard({
  response,
}: {
  response: ResponseItem;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        p-4
      "
    >
      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-2
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              text-sm
              font-black
              text-slate-950
            "
          >
            {response.responderName}
          </span>

          {response.verified && (
            <BadgeCheck
              size={15}
              className="text-blue-600"
            />
          )}
        </div>

        <span
          className="
            text-[10px]
            font-bold
            text-slate-400
          "
        >
          {formatDate(
            response.date
          )}
        </span>
      </div>

      <p
        className="
          mt-3
          text-xs
          leading-6
          text-slate-600
        "
      >
        {response.content}
      </p>
    </div>
  );
}

function SidebarRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-slate-100
        pb-3
        last:border-none
        last:pb-0
      "
    >
      <span
        className="
          text-xs
          font-semibold
          text-slate-400
        "
      >
        {label}
      </span>

      <span
        className="
          text-right
          text-xs
          font-black
          text-slate-800
        "
      >
        {value}
      </span>
    </div>
  );
}

function RelatedCard({
  report,
}: {
  report: RelatedReport;
}) {
  return (
    <article
      className="
        group
        rounded-[22px]
        border
        border-slate-200
        bg-white
        p-5
        transition
        hover:-translate-y-1
        hover:border-rose-200
        hover:shadow-lg
      "
    >
      <div
        className="
          flex
          flex-wrap
          gap-2
        "
      >
        <RiskBadge
          level={report.riskLevel}
        />

        <VerificationBadge
          level={
            report.verification
          }
        />
      </div>

      <Link
        href={`/scam/${report.id}`}
        className="mt-4 block"
      >
        <h3
          className="
            line-clamp-2
            text-base
            font-black
            leading-6
            text-slate-950
            transition
            group-hover:text-rose-700
          "
        >
          {report.title}
        </h3>
      </Link>

      <p
        className="
          mt-3
          line-clamp-3
          text-xs
          leading-6
          text-slate-500
        "
      >
        {report.summary}
      </p>

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-3
          border-t
          border-slate-100
          pt-4
        "
      >
        <span
          className="
            text-[10px]
            font-bold
            text-slate-400
          "
        >
          {report.prefecture}
        </span>

        <Link
          href={`/scam/${report.id}`}
          className="
            inline-flex
            items-center
            gap-1
            text-[11px]
            font-black
            text-rose-700
          "
        >
          查看
          <ArrowRight
            size={12}
          />
        </Link>
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
        "border-slate-500/30 bg-slate-400/10 text-slate-300",
    },
    medium: {
      label: "注意",
      className:
        "border-amber-400/30 bg-amber-400/10 text-amber-300",
    },
    high: {
      label: "高风险",
      className:
        "border-orange-400/30 bg-orange-400/10 text-orange-300",
    },
    critical: {
      label: "高度危险",
      className:
        "border-rose-400/30 bg-rose-400/10 text-rose-300",
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
        px-3
        py-1.5
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
          border-blue-400/30
          bg-blue-400/10
          px-3
          py-1.5
          text-[10px]
          font-black
          text-blue-300
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
          border-emerald-400/30
          bg-emerald-400/10
          px-3
          py-1.5
          text-[10px]
          font-black
          text-emerald-300
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
        border-slate-400/30
        bg-slate-400/10
        px-3
        py-1.5
        text-[10px]
        font-black
        text-slate-300
      "
    >
      <UserRoundSearch
        size={11}
      />
      用户报告
    </span>
  );
}

function LoadingPage() {
  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-slate-50
      "
    >
      <div className="text-center">
        <Loader2
          size={28}
          className="
            mx-auto
            animate-spin
            text-rose-600
          "
        />

        <p
          className="
            mt-3
            text-sm
            font-bold
            text-slate-500
          "
        >
          正在读取风险信息...
        </p>
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Container>
        <div
          className="
            flex
            min-h-[70vh]
            items-center
            justify-center
            px-4
            py-16
          "
        >
          <div
            className="
              w-full
              max-w-lg
              rounded-[26px]
              border
              border-slate-200
              bg-white
              p-8
              text-center
              shadow-sm
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
                bg-rose-50
                text-rose-500
              "
            >
              <FileWarning
                size={23}
              />
            </div>

            <h1
              className="
                mt-5
                text-xl
                font-black
                text-slate-950
              "
            >
              找不到这条风险信息
            </h1>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-slate-500
              "
            >
              信息可能不存在、
              尚未公开，
              或已经停止展示。
            </p>

            <Link
              href="/scam"
              className="
                mt-6
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-slate-950
                px-5
                py-3
                text-sm
                font-black
                text-white
              "
            >
              <ArrowLeft
                size={15}
              />
              返回风险信息
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}

function getRiskLabel(
  level: RiskLevel
) {
  switch (level) {
    case "critical":
      return "高度危险";
    case "high":
      return "高风险";
    case "medium":
      return "需要注意";
    case "low":
      return "低风险";
  }
}

function getVerificationLabel(
  level: VerificationLevel
) {
  switch (level) {
    case "official_source":
      return "官方来源";
    case "evidence_reviewed":
      return "已查看材料";
    case "user_report":
      return "用户报告";
  }
}

function getTimelineDotClass(
  type: TimelineType
) {
  switch (type) {
    case "payment":
      return "bg-amber-500";
    case "contact":
      return "bg-blue-500";
    case "platform":
      return "bg-violet-500";
    case "official":
      return "bg-rose-500";
    case "event":
      return "bg-slate-500";
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