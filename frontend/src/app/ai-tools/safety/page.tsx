"use client";

import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Bot,
  Check,
  CheckCircle2,
  CircleAlert,
  Copy,
  FileWarning,
  Flag,
  Loader2,
  MessageSquareWarning,
  Phone,
  RotateCcw,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

type RiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

type RiskCategory =
  | "job"
  | "fraud"
  | "money"
  | "account"
  | "contact"
  | "privacy";

interface RiskSignal {
  id: string;
  category: RiskCategory;
  title: string;
  description: string;
  matched: string[];
  weight: number;
}

interface SafetyResult {
  level: RiskLevel;
  score: number;
  title: string;
  summary: string;
  signals: RiskSignal[];
  actions: string[];
  avoid: string[];
}

const MAX_LENGTH = 5000;

const examples = [
  {
    label: "高额日结招聘",
    text: `东京高薪兼职，当天结算现金。
工作非常简单，只需要帮忙取一下东西。
一天5万到10万日元。
不需要经验，也不用面试。

详情加Telegram，工作内容之后再告诉你。`,
  },
  {
    label: "银行卡请求",
    text: `因为公司收款账户暂时不能使用，
需要借你的银行卡收一下客户的钱。
只是暂时使用，不会有任何风险。
每天可以给你2万日元报酬。`,
  },
  {
    label: "普通招聘",
    text: `東京都内のWebエンジニア募集です。
業務内容は自社サービスの開発・保守です。
Python、SQLの経験がある方を歓迎します。
勤務時間は9:00〜18:00、土日祝休み。
面接はオンラインで2回実施します。`,
  },
];

export default function SafetyAiPage() {
  const [text, setText] = useState("");
  const [result, setResult] =
    useState<SafetyResult | null>(null);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [copied, setCopied] =
    useState(false);

  const canAnalyze =
    text.trim().length >= 5 && !loading;

  const characterStatus = useMemo(() => {
    if (text.length >= MAX_LENGTH) {
      return "已达到上限";
    }

    return `${text.length}/${MAX_LENGTH}`;
  }, [text.length]);

  function loadExample(
    example: (typeof examples)[number]
  ) {
    setText(example.text);
    setResult(null);
    setError("");
    setCopied(false);
  }

  function resetAll() {
    setText("");
    setResult(null);
    setError("");
    setCopied(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const input = text.trim();

    if (input.length < 5) {
      setError(
        "请粘贴需要检查的招聘信息、聊天记录或可疑内容。"
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      // TODO [API - POST]
      // POST /api/ai/safety
      // Purpose:
      // Analyze user-provided text for risk signals and return
      // structured safety guidance.
      //
      // Request:
      // {
      //   text: input
      // }
      //
      // Backend requirements:
      // - run deterministic high-risk rules before AI analysis
      // - AI may explain signals but must not make criminal/legal verdicts
      // - rate-limit requests
      // - redact sensitive information from logs
      // - never expose AI provider API keys to browser
      // - preserve only necessary security/audit data
      // - return structured JSON

      await new Promise((resolve) => {
        window.setTimeout(resolve, 700);
      });

      setResult(analyzeSafetyText(input));
    } catch {
      setError(
        "分析失败，请稍后重新尝试。"
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) {
      return;
    }

    const content = [
      `风险等级：${getRiskLabel(
        result.level
      )}`,
      `风险分数：${result.score}/100`,
      "",
      result.summary,
      "",
      "发现的风险信号：",
      ...result.signals.map(
        (item) => `・${item.title}`
      ),
      "",
      "建议：",
      ...result.actions.map(
        (item) => `・${item}`
      ),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(
        content
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError(
        "复制失败，请手动选择内容复制。"
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="
            pointer-events-none
            absolute
            left-[-140px]
            top-[-150px]
            h-[420px]
            w-[420px]
            rounded-full
            bg-rose-500/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-100px]
            h-[360px]
            w-[360px]
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />

        <Container>
          <div className="relative px-4 py-9 sm:py-12">
            <Link
              href="/ai-tools"
              className="
                inline-flex
                min-h-11
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
              返回 Sakura AI
            </Link>

            <div
              className="
                mt-5
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-rose-300
                      text-slate-950
                    "
                  >
                    <ShieldAlert size={21} />
                  </div>

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-black
                        tracking-[0.15em]
                        text-rose-300
                      "
                    >
                      SAKURA AI
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        font-bold
                        text-slate-500
                      "
                    >
                      Safety Assistant
                    </p>
                  </div>
                </div>

                <h1
                  className="
                    mt-5
                    text-3xl
                    font-black
                    tracking-tight
                    text-white
                    sm:text-4xl
                  "
                >
                  风险信息助手
                </h1>

                <p
                  className="
                    mt-3
                    max-w-xl
                    text-sm
                    font-medium
                    leading-7
                    text-slate-400
                  "
                >
                  把可疑招聘、兼职、聊天内容或付款要求粘贴进来，
                  检查是否存在危险招聘、账户滥用、
                  高额报酬诱导等风险信号。
                </p>
              </div>

              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-slate-300
                "
              >
                <SearchCheck
                  size={14}
                  className="text-cyan-300"
                />
                规则检测 + 风险分析
              </div>
            </div>
          </div>
        </Container>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="py-7 sm:py-10">
          <Container>
            <div
              className="
                grid
                gap-6
                px-4
                xl:grid-cols-[minmax(0,760px)_320px]
                xl:justify-center
              "
            >
              {/* LEFT */}

              <div className="min-w-0 space-y-6">
                <FormSection
                  icon={
                    <MessageSquareWarning
                      size={18}
                    />
                  }
                  title="检查可疑内容"
                  description="可以粘贴招聘广告、聊天记录、短信或对方发来的工作说明。"
                >
                  <textarea
                    value={text}
                    maxLength={MAX_LENGTH}
                    rows={14}
                    placeholder={`把内容粘贴到这里……

例如：

高薪兼职，一天5万日元。
只需要帮忙取现金。
详细工作内容加Telegram后说明。`}
                    onChange={(event) => {
                      setText(
                        event.target.value
                      );
                      setError("");
                    }}
                    className={textareaClass}
                  />

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        leading-5
                        text-slate-400
                      "
                    >
                      不要粘贴银行卡完整号码、
                      身份证件号码、密码等敏感信息
                    </p>

                    <span
                      className="
                        shrink-0
                        text-[10px]
                        font-black
                        text-slate-400
                      "
                    >
                      {characterStatus}
                    </span>
                  </div>
                </FormSection>

                {/* EXAMPLES */}

                <FormSection
                  icon={<FileWarning size={18} />}
                  title="不知道怎么用？"
                  description="可以先加载一个示例看看风险分析结果。"
                >
                  <div
                    className="
                      grid
                      gap-3
                      sm:grid-cols-3
                    "
                  >
                    {examples.map((example) => (
                      <button
                        key={example.label}
                        type="button"
                        onClick={() =>
                          loadExample(example)
                        }
                        className="
                          min-h-[80px]
                          rounded-2xl
                          border
                          border-slate-200
                          bg-white
                          p-4
                          text-left
                          transition
                          hover:border-rose-200
                          hover:bg-rose-50/40
                        "
                      >
                        <p
                          className="
                            text-xs
                            font-black
                            text-slate-900
                          "
                        >
                          {example.label}
                        </p>

                        <p
                          className="
                            mt-2
                            text-[10px]
                            leading-4
                            text-slate-400
                          "
                        >
                          点击自动填入示例
                        </p>
                      </button>
                    ))}
                  </div>
                </FormSection>

                {error && (
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      border
                      border-rose-200
                      bg-rose-50
                      p-4
                      text-rose-800
                    "
                  >
                    <CircleAlert
                      size={18}
                      className="
                        mt-0.5
                        shrink-0
                      "
                    />

                    <p
                      className="
                        text-xs
                        font-bold
                        leading-6
                      "
                    >
                      {error}
                    </p>
                  </div>
                )}

                {/* DESKTOP ACTION */}

                <div
                  className="
                    hidden
                    items-center
                    justify-between
                    gap-3
                    rounded-[24px]
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                    sm:flex
                  "
                >
                  <button
                    type="button"
                    onClick={resetAll}
                    className="
                      inline-flex
                      min-h-11
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      px-4
                      text-sm
                      font-black
                      text-slate-600
                      transition
                      hover:bg-slate-50
                    "
                  >
                    <RotateCcw size={15} />
                    清空
                  </button>

                  <button
                    type="submit"
                    disabled={!canAnalyze}
                    className="
                      inline-flex
                      min-h-12
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-slate-950
                      px-6
                      text-sm
                      font-black
                      text-white
                      transition
                      hover:bg-rose-600
                      disabled:cursor-not-allowed
                      disabled:bg-slate-300
                    "
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        正在检查...
                      </>
                    ) : (
                      <>
                        <WandSparkles size={17} />
                        检查风险
                      </>
                    )}
                  </button>
                </div>

                {/* RESULT */}

                {result && (
                  <SafetyResultView
                    result={result}
                    copied={copied}
                    onCopy={() =>
                      void copyResult()
                    }
                  />
                )}
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
                  <div className="flex items-center gap-2">
                    <Bot
                      size={17}
                      className="text-indigo-600"
                    />

                    <h2
                      className="
                        text-sm
                        font-black
                        text-slate-950
                      "
                    >
                      重点检查什么？
                    </h2>
                  </div>

                  <div className="mt-4 space-y-3">
                    <CheckItem>
                      高额日结、即日现金
                    </CheckItem>

                    <CheckItem>
                      取钱、取快递、收现金
                    </CheckItem>

                    <CheckItem>
                      银行卡、账户、手机、SIM
                    </CheckItem>

                    <CheckItem>
                      Telegram 等私下联系
                    </CheckItem>

                    <CheckItem>
                      工作内容故意说不清楚
                    </CheckItem>
                  </div>
                </div>

                <div
                  className="
                    rounded-[24px]
                    border
                    border-rose-100
                    bg-rose-50
                    p-5
                  "
                >
                  <TriangleAlert
                    size={19}
                    className="text-rose-600"
                  />

                  <h3
                    className="
                      mt-3
                      text-sm
                      font-black
                      text-rose-950
                    "
                  >
                    高风险时先停止联系
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-rose-900/75
                    "
                  >
                    如果对方要求你取现金、
                    提供银行卡、转账、交出手机或 SIM，
                    不要因为“已经答应了”而继续。
                  </p>
                </div>

                <div
                  className="
                    rounded-[24px]
                    bg-slate-950
                    p-5
                  "
                >
                  <ShieldCheck
                    size={18}
                    className="text-cyan-300"
                  />

                  <h3
                    className="
                      mt-3
                      text-sm
                      font-black
                      text-white
                    "
                  >
                    不是犯罪认定工具
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-slate-400
                    "
                  >
                    Sakura 只提示风险信号，
                    不会因为几个关键词就公开认定某个人、
                    公司或招聘信息属于犯罪。
                  </p>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {/* MOBILE ACTION */}

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
            sm:hidden
            [padding-bottom:max(0.625rem,env(safe-area-inset-bottom))]
          "
        >
          <div
            className="
              mx-auto
              grid
              max-w-lg
              grid-cols-[92px_1fr]
              gap-2
            "
          >
            <button
              type="button"
              onClick={() =>
                loadExample(examples[0])
              }
              disabled={loading}
              className="
                inline-flex
                min-h-12
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
                disabled:opacity-50
              "
            >
              <FileWarning size={14} />
              示例
            </button>

            <button
              type="submit"
              disabled={!canAnalyze}
              className="
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-slate-950
                px-4
                text-sm
                font-black
                text-white
                disabled:bg-slate-300
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  正在检查...
                </>
              ) : (
                <>
                  <ShieldAlert size={16} />
                  检查风险
                </>
              )}
            </button>
          </div>
        </div>

        <div className="h-20 sm:hidden" />
      </form>
    </main>
  );
}

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
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
        sm:p-6
      "
    >
      <div className="flex items-start gap-3">
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
          <h2
            className="
              text-base
              font-black
              text-slate-950
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
            "
          >
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function CheckItem({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-2
      "
    >
      <CheckCircle2
        size={14}
        className="
          mt-0.5
          shrink-0
          text-indigo-500
        "
      />

      <span
        className="
          text-xs
          font-bold
          leading-5
          text-slate-600
        "
      >
        {children}
      </span>
    </div>
  );
}

function SafetyResultView({
  result,
  copied,
  onCopy,
}: {
  result: SafetyResult;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[26px]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* RESULT HEADER */}

      <div
        className={`
          border-b
          p-5
          sm:p-6
          ${getRiskHeaderClass(
            result.level
          )}
        `}
      >
        <div
          className="
            flex
            flex-col
            gap-4
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
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-sm
              "
            >
              <RiskIcon
                level={result.level}
              />
            </div>

            <div>
              <p
                className="
                  text-[10px]
                  font-black
                  tracking-[0.14em]
                  opacity-60
                "
              >
                SAFETY RESULT
              </p>

              <h2
                className="
                  mt-1
                  text-xl
                  font-black
                "
              >
                {result.title}
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  font-bold
                  opacity-70
                "
              >
                风险等级：
                {getRiskLabel(
                  result.level
                )}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                rounded-xl
                bg-white
                px-4
                py-2
                text-center
                shadow-sm
              "
            >
              <p
                className="
                  text-[9px]
                  font-black
                  text-slate-400
                "
              >
                RISK SCORE
              </p>

              <p
                className="
                  mt-0.5
                  text-2xl
                  font-black
                  text-slate-950
                "
              >
                {result.score}
              </p>
            </div>

            <button
              type="button"
              onClick={onCopy}
              className="
                inline-flex
                min-h-11
                items-center
                gap-1.5
                rounded-xl
                bg-white
                px-3
                text-xs
                font-black
                text-slate-700
                shadow-sm
              "
            >
              {copied ? (
                <>
                  <Check
                    size={14}
                    className="text-emerald-600"
                  />
                  已复制
                </>
              ) : (
                <>
                  <Copy size={14} />
                  复制
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className="
          space-y-5
          p-5
          sm:p-6
        "
      >
        {/* SUMMARY */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-5
          "
        >
          <p
            className="
              text-xs
              font-black
              text-slate-900
            "
          >
            分析结果
          </p>

          <p
            className="
              mt-3
              text-[15px]
              font-medium
              leading-7
              text-slate-700
            "
          >
            {result.summary}
          </p>
        </div>

        {/* SIGNALS */}

        <div>
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <h3
              className="
                text-sm
                font-black
                text-slate-950
              "
            >
              检测到的风险信号
            </h3>

            <span
              className="
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-[10px]
                font-black
                text-slate-500
              "
            >
              {result.signals.length} 项
            </span>
          </div>

          {result.signals.length >
          0 ? (
            <div className="mt-3 space-y-3">
              {result.signals.map(
                (signal) => (
                  <RiskSignalCard
                    key={signal.id}
                    signal={signal}
                  />
                )
              )}
            </div>
          ) : (
            <div
              className="
                mt-3
                rounded-2xl
                border
                border-emerald-200
                bg-emerald-50
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
                <CheckCircle2
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-emerald-600
                  "
                />

                <div>
                  <p
                    className="
                      text-xs
                      font-black
                      text-emerald-900
                    "
                  >
                    没有发现明显的高风险关键词
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-emerald-800/80
                    "
                  >
                    这并不代表信息一定安全，
                    仍需要确认招聘主体、
                    实际工作内容和合同条件。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACTION */}

        <div
          className="
            grid
            gap-4
            lg:grid-cols-2
          "
        >
          <ActionBox
            icon={
              <ShieldCheck size={17} />
            }
            title="建议你现在这样做"
            items={result.actions}
            variant="emerald"
          />

          <ActionBox
            icon={<Ban size={17} />}
            title="不要做这些事"
            items={result.avoid}
            variant="rose"
          />
        </div>

        {/* EMERGENCY */}

        {(result.level === "high" ||
          result.level ===
            "critical") && (
          <div
            className="
              rounded-2xl
              border
              border-rose-200
              bg-rose-50
              p-5
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              <Phone
                size={19}
                className="
                  mt-0.5
                  shrink-0
                  text-rose-600
                "
              />

              <div>
                <h3
                  className="
                    text-sm
                    font-black
                    text-rose-950
                  "
                >
                  如果已经涉及转账、
                  银行卡或危险工作
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-rose-900/80
                  "
                >
                  先停止继续操作并保存聊天记录、
                  招聘页面、转账记录等证据。
                  在日本需要警方咨询时可使用
                  #9110；一般消费纠纷也可以通过
                  消费者热线 188 咨询。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DISCLAIMER */}

        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            bg-slate-950
            p-5
            text-white
          "
        >
          <AlertTriangle
            size={18}
            className="
              mt-0.5
              shrink-0
              text-amber-300
            "
          />

          <div>
            <p
              className="
                text-xs
                font-black
              "
            >
              风险提示 ≠ 犯罪认定
            </p>

            <p
              className="
                mt-2
                text-xs
                leading-6
                text-slate-400
              "
            >
              当前结果只根据文字中出现的风险模式进行辅助判断，
              不能代替警方、律师或其他官方机构的调查和法律判断。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskSignalCard({
  signal,
}: {
  signal: RiskSignal;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-amber-200
        bg-amber-50
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
        <TriangleAlert
          size={17}
          className="
            mt-0.5
            shrink-0
            text-amber-600
          "
        />

        <div className="min-w-0">
          <p
            className="
              text-xs
              font-black
              text-amber-950
            "
          >
            {signal.title}
          </p>

          <p
            className="
              mt-1.5
              text-xs
              leading-5
              text-amber-900/80
            "
          >
            {signal.description}
          </p>

          {signal.matched.length >
            0 && (
            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-1.5
              "
            >
              {signal.matched.map(
                (keyword) => (
                  <span
                    key={keyword}
                    className="
                      rounded-full
                      border
                      border-amber-200
                      bg-white/70
                      px-2.5
                      py-1
                      text-[10px]
                      font-black
                      text-amber-800
                    "
                  >
                    {keyword}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBox({
  icon,
  title,
  items,
  variant,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
  variant: "emerald" | "rose";
}) {
  return (
    <div
      className={`
        rounded-2xl
        p-4
        sm:p-5
        ${
          variant === "emerald"
            ? "bg-emerald-50"
            : "bg-rose-50"
        }
      `}
    >
      <div
        className={`
          flex
          items-center
          gap-2
          text-xs
          font-black
          ${
            variant === "emerald"
              ? "text-emerald-950"
              : "text-rose-950"
          }
        `}
      >
        {icon}
        {title}
      </div>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p
            key={item}
            className={`
              text-xs
              leading-6
              ${
                variant === "emerald"
                  ? "text-emerald-900/80"
                  : "text-rose-900/80"
              }
            `}
          >
            · {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function RiskIcon({
  level,
}: {
  level: RiskLevel;
}) {
  if (level === "critical") {
    return (
      <ShieldAlert
        size={21}
        className="text-rose-700"
      />
    );
  }

  if (level === "high") {
    return (
      <AlertTriangle
        size={21}
        className="text-orange-600"
      />
    );
  }

  if (level === "medium") {
    return (
      <CircleAlert
        size={21}
        className="text-amber-600"
      />
    );
  }

  return (
    <ShieldCheck
      size={21}
      className="text-emerald-600"
    />
  );
}

function getRiskLabel(
  level: RiskLevel
) {
  if (level === "critical") {
    return "极高风险";
  }

  if (level === "high") {
    return "高风险";
  }

  if (level === "medium") {
    return "需要注意";
  }

  return "暂未发现明显高风险";
}

function getRiskHeaderClass(
  level: RiskLevel
) {
  if (level === "critical") {
    return "border-rose-200 bg-rose-100 text-rose-950";
  }

  if (level === "high") {
    return "border-orange-200 bg-orange-50 text-orange-950";
  }

  if (level === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-950";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-950";
}

function analyzeSafetyText(
  text: string
): SafetyResult {
  const normalized =
    text.toLowerCase();

  const rules: {
    id: string;
    category: RiskCategory;
    title: string;
    description: string;
    keywords: string[];
    weight: number;
  }[] = [
    {
      id: "illegal-job",
      category: "job",
      title: "疑似危险招聘用语",
      description:
        "出现了常见于高风险或违法招聘中的表达，需要特别谨慎。",
      keywords: [
        "闇バイト",
        "ホワイト案件",
        "受け子",
        "出し子",
        "叩き",
        "運び",
        "ハンドキャリー",
      ],
      weight: 45,
    },
    {
      id: "cash-pickup",
      category: "money",
      title: "要求取钱或代收现金",
      description:
        "单纯要求去某处取现金、提款或代收款项，属于非常重要的危险信号。",
      keywords: [
        "取钱",
        "取現金",
        "现金",
        "收现金",
        "代收",
        "提款",
        "引き出し",
        "現金を受け取",
        "お金を受け取",
      ],
      weight: 35,
    },
    {
      id: "account",
      category: "account",
      title: "要求提供金融账户或通信工具",
      description:
        "借用或交出银行卡、银行账户、手机、SIM 等可能导致账户被滥用。",
      keywords: [
        "银行卡",
        "銀行口座",
        "账户",
        "口座",
        "キャッシュカード",
        "手机",
        "携帯",
        "sim",
        "スマホを貸",
      ],
      weight: 40,
    },
    {
      id: "private-contact",
      category: "contact",
      title: "要求转移到匿名或私下通信",
      description:
        "招聘方过早要求通过匿名通信工具继续联系，会增加身份和工作内容无法核验的风险。",
      keywords: [
        "telegram",
        "テレグラム",
        "signal",
        "シグナル",
      ],
      weight: 18,
    },
    {
      id: "high-pay",
      category: "job",
      title: "异常高报酬或即时现金诱导",
      description:
        "工作要求很低，却承诺明显异常的高额报酬或立即支付现金，需要确认报酬是否合理。",
      keywords: [
        "高薪",
        "高额",
        "高額",
        "日结",
        "日払い",
        "即日现金",
        "即日現金",
        "当天结算",
        "即金",
        "1日5万",
        "一日5万",
        "一天5万",
        "10万日元",
      ],
      weight: 20,
    },
    {
      id: "unclear-job",
      category: "job",
      title: "工作内容不透明",
      description:
        "招聘方没有明确说明工作内容，却先要求联系或提交个人信息。",
      keywords: [
        "工作内容之后",
        "工作内容以后",
        "詳しくはtelegram",
        "詳細はtelegram",
        "仕事内容は後",
        "詳しい仕事内容は後",
        "简单工作",
        "簡単な仕事",
      ],
      weight: 18,
    },
    {
      id: "delivery",
      category: "job",
      title: "仅负责取件或搬运",
      description:
        "仅被告知取快递、拿文件、运输物品等，但不知道物品具体内容，需要高度警惕。",
      keywords: [
        "取快递",
        "拿快递",
        "取东西",
        "拿东西",
        "荷物を受け取",
        "書類を受け取るだけ",
        "運ぶだけ",
      ],
      weight: 25,
    },
    {
      id: "personal-data",
      category: "privacy",
      title: "可能涉及过度个人信息收集",
      description:
        "正规招聘也会收集必要信息，但如果在工作内容尚未确认前就索取大量敏感资料，需要谨慎。",
      keywords: [
        "身份证",
        "身分証",
        "免許証の写真",
        "マイナンバー",
        "银行卡照片",
        "キャッシュカードの写真",
      ],
      weight: 25,
    },
  ];

  const signals: RiskSignal[] =
    [];

  for (const rule of rules) {
    const matched =
      rule.keywords.filter(
        (keyword) =>
          normalized.includes(
            keyword.toLowerCase()
          )
      );

    if (matched.length > 0) {
      signals.push({
        id: rule.id,
        category: rule.category,
        title: rule.title,
        description:
          rule.description,
        matched,
        weight: rule.weight,
      });
    }
  }

  let score = signals.reduce(
    (sum, signal) =>
      sum + signal.weight,
    0
  );

  const hasAccount =
    signals.some(
      (item) =>
        item.id === "account"
    );

  const hasCash =
    signals.some(
      (item) =>
        item.id === "cash-pickup"
    );

  const hasIllegalKeyword =
    signals.some(
      (item) =>
        item.id === "illegal-job"
    );

  const hasPrivateContact =
    signals.some(
      (item) =>
        item.id ===
        "private-contact"
    );

  if (
    hasAccount &&
    hasCash
  ) {
    score += 20;
  }

  if (
    hasIllegalKeyword &&
    hasPrivateContact
  ) {
    score += 15;
  }

  score = Math.min(
    100,
    score
  );

  let level: RiskLevel =
    "low";

  if (score >= 75) {
    level = "critical";
  } else if (score >= 45) {
    level = "high";
  } else if (score >= 18) {
    level = "medium";
  }

  if (level === "critical") {
    return {
      level,
      score,
      title: "检测到多个高危风险信号",
      summary:
        "这段内容同时出现了多个高风险特征。不要继续按照对方要求进行取款、转账、交出账户、手机或其他敏感操作。建议先停止联系，并保存相关证据。",
      signals,
      actions: [
        "立即停止进一步付款、取款、代收或交付账户。",
        "保存招聘页面、聊天记录、电话号码、账号和转账记录。",
        "不要删除现有证据。",
        "通过企业官网、正式招聘页面等独立渠道核实招聘主体。",
        "如果已经参与转账、取款或交付银行卡等行为，尽快向警方等正式渠道咨询。",
      ],
      avoid: [
        "不要因为对方催促或威胁就继续操作。",
        "不要把银行卡、账户、密码、手机或SIM交给他人。",
        "不要按照陌生人的指示代收、代取或转移现金。",
        "不要继续发送身份证件等敏感资料。",
      ],
    };
  }

  if (level === "high") {
    return {
      level,
      score,
      title: "存在明显高风险信号",
      summary:
        "这段内容包含明显异常的招聘或资金操作特征。在确认招聘方身份和真实工作内容之前，不建议继续参与。",
      signals,
      actions: [
        "暂停与对方进行下一步操作。",
        "保存聊天和招聘信息截图。",
        "确认公司名称、法人信息、正式招聘页面和工作地点。",
        "要求对方明确说明实际工作内容和合同条件。",
      ],
      avoid: [
        "不要提前支付任何费用。",
        "不要代收或代取来历不明的现金、快递或物品。",
        "不要提供银行账户、银行卡或登录密码。",
      ],
    };
  }

  if (level === "medium") {
    return {
      level,
      score,
      title: "发现需要进一步确认的信号",
      summary:
        "目前没有足够信息判断一定存在严重危险，但出现了一些需要核验的异常点。建议在确认公司、工作内容和联系方式后再继续。",
      signals,
      actions: [
        "确认招聘公司的正式名称和官网。",
        "确认具体工作内容、工作地点和报酬计算方式。",
        "尽量通过正式招聘平台或公司联系方式核实。",
      ],
      avoid: [
        "不要只因为高报酬就立即接受。",
        "不要在工作内容不清楚时提交大量敏感个人信息。",
      ],
    };
  }

  return {
    level,
    score,
    title: "暂未发现明显高风险信号",
    summary:
      "当前文字中没有检测到明显的高风险模式。不过自动检查不能证明招聘或交易一定安全，正式参与前仍应核实招聘主体和合同内容。",
    signals,
    actions: [
      "确认公司名称和联系方式是否真实。",
      "确认工作内容、工资、工作地点和合同条件。",
      "重要条件尽量保留书面记录。",
    ],
    avoid: [
      "不要因为检测结果较低就完全放弃核验。",
      "不要向无法确认身份的人提供密码、银行账户或证件信息。",
    ],
  };
}

const textareaClass = `
  w-full
  resize-y
  rounded-2xl
  border
  border-slate-200
  bg-slate-50
  px-4
  py-4
  text-[16px]
  font-medium
  leading-7
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-rose-400
  focus:bg-white
  focus:ring-4
  focus:ring-rose-50
`;