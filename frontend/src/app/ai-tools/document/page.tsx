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
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  Copy,
  FileSearch,
  FileText,
  JapaneseYen,
  Languages,
  ListChecks,
  Loader2,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

type DocumentType =
  | "auto"
  | "government"
  | "company"
  | "housing"
  | "school"
  | "tax"
  | "insurance"
  | "other";

type ExplainLevel =
  | "simple"
  | "normal"
  | "detailed";

interface DocumentResult {
  title: string;
  summary: string;
  importantPoints: string[];
  actions: string[];
  dates: {
    label: string;
    value: string;
  }[];
  amounts: {
    label: string;
    value: string;
  }[];
  difficultTerms: {
    term: string;
    meaning: string;
  }[];
  riskLevel: "low" | "medium" | "high";
  warning: string;
}

const documentTypes: {
  value: DocumentType;
  label: string;
}[] = [
  {
    value: "auto",
    label: "自动判断",
  },
  {
    value: "government",
    label: "政府・役所",
  },
  {
    value: "company",
    label: "公司文件",
  },
  {
    value: "housing",
    label: "租房・不动产",
  },
  {
    value: "school",
    label: "学校",
  },
  {
    value: "tax",
    label: "税金",
  },
  {
    value: "insurance",
    label: "保险・年金",
  },
  {
    value: "other",
    label: "其他",
  },
];

const explainLevels: {
  value: ExplainLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "simple",
    label: "简单说明",
    description: "只告诉我是什么意思",
  },
  {
    value: "normal",
    label: "标准分析",
    description: "重点 + 要做什么",
  },
  {
    value: "detailed",
    label: "详细解释",
    description: "逐项解释重要内容",
  },
];

const examples = [
  {
    label: "役所通知",
    type: "government" as DocumentType,
    text: `住民税納税通知書

令和8年度の住民税について、下記のとおり納付してください。

第1期 納期限：令和8年6月30日
納付額：35,000円

第2期 納期限：令和8年8月31日
納付額：35,000円

納期限までに金融機関、コンビニエンスストア等で納付してください。`,
  },
  {
    label: "租房通知",
    type: "housing" as DocumentType,
    text: `賃貸借契約更新のお知らせ

現在ご契約いただいております賃貸借契約につきまして、
契約期間満了に伴い更新手続きが必要となります。

更新料：賃料1ヶ月分
更新事務手数料：22,000円（税込）

更新を希望される場合は、2026年10月15日までに
必要書類をご提出ください。`,
  },
  {
    label: "公司邮件",
    type: "company" as DocumentType,
    text: `お疲れ様です。

来月より勤務時間の管理方法が変更となります。
10月1日以降は新しい勤怠システムから
出勤・退勤時刻を登録してください。

初回ログイン方法については、
別途送付するマニュアルをご確認ください。

よろしくお願いいたします。`,
  },
];

export default function DocumentAiPage() {
  const [documentType, setDocumentType] =
    useState<DocumentType>("auto");

  const [explainLevel, setExplainLevel] =
    useState<ExplainLevel>("normal");

  const [text, setText] = useState("");

  const [result, setResult] =
    useState<DocumentResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const canGenerate =
    text.trim().length >= 10 &&
    !loading;

  const currentType = useMemo(
    () =>
      documentTypes.find(
        (item) =>
          item.value === documentType
      )?.label ?? "自动判断",
    [documentType]
  );

  const currentLevel = useMemo(
    () =>
      explainLevels.find(
        (item) =>
          item.value === explainLevel
      )?.label ?? "标准分析",
    [explainLevel]
  );

  function loadExample(
    example: (typeof examples)[number]
  ) {
    setText(example.text);
    setDocumentType(example.type);
    setExplainLevel("normal");
    setResult(null);
    setError("");
  }

  function resetAll() {
    setDocumentType("auto");
    setExplainLevel("normal");
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

    if (input.length < 10) {
      setError(
        "请粘贴需要分析的日文文件内容。"
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      // TODO [API - POST]
      // POST /api/ai/document
      // Purpose:
      // Analyze Japanese document text and return a
      // structured Chinese explanation.
      //
      // Request:
      // {
      //   text: input,
      //   documentType,
      //   explainLevel
      // }
      //
      // Backend requirements:
      // - validate input size and schema
      // - rate-limit AI requests
      // - never expose AI provider API keys to browser
      // - minimize storage of document content
      // - redact sensitive information from logs
      // - return structured JSON
      // - AI must distinguish document facts from interpretation

      await new Promise((resolve) => {
        window.setTimeout(resolve, 850);
      });

      setResult(
        createMockResult(
          input,
          documentType
        )
      );
    } catch {
      setError(
        "分析失败，请稍后重新尝试。"
      );
    } finally {
      setLoading(false);
    }
  }

  async function copySummary() {
    if (!result) {
      return;
    }

    const content = [
      result.title,
      "",
      result.summary,
      "",
      "重点：",
      ...result.importantPoints.map(
        (item) => `・${item}`
      ),
      "",
      "需要做的事：",
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
      }, 1600);
    } catch {
      setError(
        "复制失败，请手动选择文字复制。"
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
            bg-indigo-500/10
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
                      bg-cyan-300
                      text-slate-950
                    "
                  >
                    <FileSearch size={21} />
                  </div>

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-black
                        tracking-[0.15em]
                        text-cyan-300
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
                      Document Assistant
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
                  日文文件助手
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
                  看不懂役所、公司、学校、税金或租房文件？
                  粘贴日文内容，帮你整理成容易理解的中文，
                  并告诉你哪些地方最重要。
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
                <Languages
                  size={14}
                  className="text-cyan-300"
                />
                日文 → 中文说明
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
                {/* INPUT */}

                <FormSection
                  icon={<FileText size={18} />}
                  title="粘贴日文文件内容"
                  description="现在先支持文字。PDF、照片和扫描件会在后端文件解析阶段加入。"
                >
                  <textarea
                    value={text}
                    maxLength={12000}
                    rows={14}
                    placeholder={`把日文内容粘贴到这里……

例如：

賃貸借契約更新のお知らせ
現在ご契約いただいております賃貸借契約につきまして…`}
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
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-slate-400
                      "
                    >
                      请尽量删除密码、银行卡号、身份证件号码等敏感信息
                    </span>

                    <span
                      className="
                        shrink-0
                        text-[10px]
                        font-bold
                        text-slate-400
                      "
                    >
                      {text.length}/12000
                    </span>
                  </div>
                </FormSection>

                {/* TYPE */}

                <FormSection
                  icon={<FileSearch size={18} />}
                  title="文件类型"
                  description="不知道是什么文件的话，保持自动判断即可。"
                >
                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-2
                      sm:grid-cols-4
                    "
                  >
                    {documentTypes.map(
                      (item) => (
                        <ChoiceButton
                          key={item.value}
                          active={
                            documentType ===
                            item.value
                          }
                          onClick={() => {
                            setDocumentType(
                              item.value
                            );
                            setResult(null);
                          }}
                        >
                          {item.label}
                        </ChoiceButton>
                      )
                    )}
                  </div>
                </FormSection>

                {/* LEVEL */}

                <FormSection
                  icon={<ListChecks size={18} />}
                  title="怎么解释？"
                  description="根据你的需要选择说明详细程度。"
                >
                  <div
                    className="
                      grid
                      gap-3
                      sm:grid-cols-3
                    "
                  >
                    {explainLevels.map(
                      (item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            setExplainLevel(
                              item.value
                            );
                            setResult(null);
                          }}
                          className={`
                            min-h-[88px]
                            rounded-2xl
                            border
                            p-4
                            text-left
                            transition
                            ${
                              explainLevel ===
                              item.value
                                ? "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-50"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }
                          `}
                        >
                          <p
                            className="
                              text-xs
                              font-black
                              text-slate-900
                            "
                          >
                            {item.label}
                          </p>

                          <p
                            className="
                              mt-1.5
                              text-[10px]
                              leading-4
                              text-slate-400
                            "
                          >
                            {item.description}
                          </p>
                        </button>
                      )
                    )}
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
                  <div className="flex gap-2">
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
                        bg-white
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
                      type="button"
                      onClick={() =>
                        loadExample(
                          examples[0]
                        )
                      }
                      className="
                        inline-flex
                        min-h-11
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        text-sm
                        font-black
                        text-slate-600
                        transition
                        hover:bg-slate-50
                      "
                    >
                      <FileText size={15} />
                      填入示例
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!canGenerate}
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
                      hover:bg-indigo-600
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
                        正在分析...
                      </>
                    ) : (
                      <>
                        <WandSparkles size={17} />
                        AI 分析文件
                      </>
                    )}
                  </button>
                </div>

                {/* RESULT */}

                {result && (
                  <DocumentResultView
                    result={result}
                    copied={copied}
                    onCopy={() =>
                      void copySummary()
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
                      当前设置
                    </h2>
                  </div>

                  <div className="mt-4 space-y-3">
                    <InfoRow
                      label="文件类型"
                      value={currentType}
                    />

                    <InfoRow
                      label="解释方式"
                      value={currentLevel}
                    />

                    <InfoRow
                      label="文字数量"
                      value={`${text.length} 字`}
                    />
                  </div>
                </div>

                {/* EXAMPLES */}

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
                      text-sm
                      font-black
                      text-slate-950
                    "
                  >
                    快速示例
                  </p>

                  <div className="mt-4 space-y-2">
                    {examples.map(
                      (example) => (
                        <button
                          key={example.label}
                          type="button"
                          onClick={() =>
                            loadExample(
                              example
                            )
                          }
                          className="
                            flex
                            min-h-11
                            w-full
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2.5
                            text-left
                            transition
                            hover:border-indigo-200
                            hover:bg-indigo-50/40
                          "
                        >
                          <span
                            className="
                              text-xs
                              font-black
                              text-slate-700
                            "
                          >
                            {example.label}
                          </span>

                          <FileSearch
                            size={14}
                            className="text-slate-300"
                          />
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* PRIVACY */}

                <div
                  className="
                    rounded-[24px]
                    bg-slate-950
                    p-5
                  "
                >
                  <AlertTriangle
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
                    文件隐私很重要
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-slate-400
                    "
                  >
                    正式版本不会把 AI API
                    Key 放在浏览器中。
                    文件解析和 AI 请求必须经过 Sakura
                    后端，并尽量减少敏感文件内容的保存和日志记录。
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
              <FileText size={14} />
              示例
            </button>

            <button
              type="submit"
              disabled={!canGenerate}
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
                  正在分析...
                </>
              ) : (
                <>
                  <WandSparkles size={16} />
                  AI 分析文件
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

function ChoiceButton({
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
        min-h-11
        rounded-xl
        border
        px-3
        py-2.5
        text-xs
        font-black
        transition
        ${
          active
            ? "border-slate-950 bg-slate-950 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }
      `}
    >
      {children}
    </button>
  );
}

function DocumentResultView({
  result,
  copied,
  onCopy,
}: {
  result: DocumentResult;
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
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          border-b
          border-slate-100
          p-5
          sm:p-6
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
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-indigo-50
              text-indigo-600
            "
          >
            <Sparkles size={18} />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-black
                tracking-[0.14em]
                text-indigo-600
              "
            >
              AI DOCUMENT RESULT
            </p>

            <h2
              className="
                mt-1
                text-lg
                font-black
                text-slate-950
              "
            >
              {result.title}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onCopy}
          className="
            inline-flex
            min-h-10
            shrink-0
            items-center
            gap-1.5
            rounded-xl
            border
            border-slate-200
            bg-white
            px-3
            text-xs
            font-black
            text-slate-600
            transition
            hover:bg-slate-50
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
            border-indigo-100
            bg-indigo-50/60
            p-5
          "
        >
          <p
            className="
              text-xs
              font-black
              text-indigo-950
            "
          >
            这份文件是什么意思？
          </p>

          <p
            className="
              mt-3
              text-[15px]
              font-medium
              leading-7
              text-slate-800
            "
          >
            {result.summary}
          </p>
        </div>

        {/* IMPORTANT */}

        <ResultList
          icon={
            <CheckCircle2 size={17} />
          }
          title="最重要的内容"
          items={result.importantPoints}
          variant="emerald"
        />

        {/* ACTIONS */}

        <ResultList
          icon={
            <ClipboardCheck size={17} />
          }
          title="你需要做什么"
          items={result.actions}
          variant="slate"
        />

        {/* DATE + MONEY */}

        {(result.dates.length > 0 ||
          result.amounts.length > 0) && (
          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
            "
          >
            {result.dates.length >
              0 && (
              <InfoBox
                icon={
                  <CalendarDays
                    size={17}
                  />
                }
                title="重要日期"
              >
                {result.dates.map(
                  (item) => (
                    <DataRow
                      key={`${item.label}-${item.value}`}
                      label={item.label}
                      value={item.value}
                    />
                  )
                )}
              </InfoBox>
            )}

            {result.amounts.length >
              0 && (
              <InfoBox
                icon={
                  <JapaneseYen
                    size={17}
                  />
                }
                title="金额"
              >
                {result.amounts.map(
                  (item) => (
                    <DataRow
                      key={`${item.label}-${item.value}`}
                      label={item.label}
                      value={item.value}
                    />
                  )
                )}
              </InfoBox>
            )}
          </div>
        )}

        {/* TERMS */}

        {result.difficultTerms.length >
          0 && (
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              p-4
              sm:p-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Languages
                size={17}
                className="text-indigo-600"
              />

              <p
                className="
                  text-xs
                  font-black
                  text-slate-900
                "
              >
                难懂的日语
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {result.difficultTerms.map(
                (item) => (
                  <div
                    key={item.term}
                    className="
                      border-b
                      border-slate-100
                      pb-3
                      last:border-none
                      last:pb-0
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-black
                        text-slate-800
                      "
                    >
                      {item.term}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-500
                      "
                    >
                      {item.meaning}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* WARNING */}

        <div
          className={`
            rounded-2xl
            border
            p-4
            ${
              result.riskLevel === "high"
                ? "border-rose-200 bg-rose-50 text-rose-900"
                : result.riskLevel ===
                    "medium"
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-slate-50 text-slate-700"
            }
          `}
        >
          <div
            className="
              flex
              items-start
              gap-2
            "
          >
            <AlertTriangle
              size={16}
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
              {result.warning}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultList({
  icon,
  title,
  items,
  variant,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
  variant: "emerald" | "slate";
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
            : "border border-slate-200 bg-white"
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
              ? "text-emerald-900"
              : "text-slate-900"
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
                  : "text-slate-600"
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

function InfoBox({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
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
          items-center
          gap-2
          text-xs
          font-black
          text-slate-900
        "
      >
        {icon}
        {title}
      </div>

      <div className="mt-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

function DataRow({
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
        items-start
        justify-between
        gap-3
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

function InfoRow({
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
          max-w-[170px]
          truncate
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

function createMockResult(
  text: string,
  type: DocumentType
): DocumentResult {
  const normalized =
    text.replace(/\s+/g, "");

  if (
    normalized.includes(
      "賃貸借契約更新"
    ) ||
    normalized.includes("更新料") ||
    type === "housing"
  ) {
    return {
      title: "租房合同更新通知",
      summary:
        "这是一份关于现在租住的房屋合同即将到期、需要办理续约手续的通知。如果你准备继续居住，需要在指定期限之前提交续约资料，并可能需要支付更新费用。",
      importantPoints: [
        "现在的租赁合同即将到期。",
        "继续居住的话需要办理合同更新手续。",
        "更新时除了更新料之外，还可能需要支付更新事务手续费。",
      ],
      actions: [
        "确认自己是否准备继续居住。",
        "如果继续居住，在截止日期前准备并提交更新资料。",
        "确认管理公司指定的付款方法和实际总金额。",
      ],
      dates: [
        {
          label: "手续期限",
          value: "2026年10月15日",
        },
      ],
      amounts: [
        {
          label: "更新料",
          value: "房租 1 个月",
        },
        {
          label: "更新事务手续费",
          value: "22,000日元（税込）",
        },
      ],
      difficultTerms: [
        {
          term: "賃貸借契約",
          meaning:
            "租赁合同，也就是房东和租客之间的租房合同。",
        },
        {
          term: "契約期間満了",
          meaning:
            "现在的合同期限即将结束。",
        },
        {
          term: "更新事務手数料",
          meaning:
            "办理合同更新手续时收取的事务手续费。",
        },
      ],
      riskLevel: "medium",
      warning:
        "AI 的说明不能代替正式合同内容。如果对更新费用、解约期限或违约条款有疑问，应继续确认原合同或向管理公司询问。",
    };
  }

  if (
    normalized.includes("住民税") ||
    normalized.includes("納期限") ||
    type === "tax"
  ) {
    return {
      title: "住民税缴税通知",
      summary:
        "这份文件是在通知你需要缴纳住民税，并列出了每一期的缴费金额和截止日期。",
      importantPoints: [
        "住民税需要按照通知中的各期金额缴纳。",
        "每一期都有自己的缴费截止日期。",
        "超过期限可能产生催缴等后续手续。",
      ],
      actions: [
        "确认通知书上的姓名和年度是否正确。",
        "在每一期截止日期前完成缴费。",
        "保留缴费记录或收据。",
      ],
      dates: [
        {
          label: "第1期",
          value: "令和8年6月30日",
        },
        {
          label: "第2期",
          value: "令和8年8月31日",
        },
      ],
      amounts: [
        {
          label: "第1期",
          value: "35,000日元",
        },
        {
          label: "第2期",
          value: "35,000日元",
        },
      ],
      difficultTerms: [
        {
          term: "住民税",
          meaning:
            "日本地方政府征收的居民税。",
        },
        {
          term: "納期限",
          meaning:
            "必须完成缴费的最后期限。",
        },
        {
          term: "納付",
          meaning:
            "缴纳税金、保险费等款项。",
        },
      ],
      riskLevel: "medium",
      warning:
        "税金金额、缴费状态和减免资格需要以自治体正式记录为准。如果认为金额有误，应向通知书上的负责窗口确认。",
    };
  }

  if (
    normalized.includes(
      "勤怠システム"
    ) ||
    normalized.includes("勤務時間") ||
    type === "company"
  ) {
    return {
      title: "公司考勤系统变更通知",
      summary:
        "公司正在通知员工，从指定日期开始需要使用新的考勤系统登记上班和下班时间。",
      importantPoints: [
        "公司的考勤管理方式将发生变化。",
        "10月1日以后需要使用新的系统。",
        "首次登录方法会通过另外的操作手册说明。",
      ],
      actions: [
        "确认新的考勤系统登录方式。",
        "10月1日开始使用新系统记录上下班时间。",
        "如果没有收到登录手册，向公司负责人确认。",
      ],
      dates: [
        {
          label: "开始使用",
          value: "10月1日",
        },
      ],
      amounts: [],
      difficultTerms: [
        {
          term: "勤怠",
          meaning:
            "公司的出勤、退勤、迟到、休假等考勤管理。",
        },
        {
          term: "別途",
          meaning:
            "另外、单独。",
        },
      ],
      riskLevel: "low",
      warning:
        "这份内容看起来主要是公司内部操作通知。实际规则仍以公司正式制度和操作手册为准。",
    };
  }

  return {
    title: "日文文件分析结果",
    summary:
      "当前页面还是前端演示模式，因此只能展示分析流程。正式接入 AI 后，会根据你实际粘贴的完整文件内容进行中文解释。",
    importantPoints: [
      "AI 会先判断文件大致属于什么类型。",
      "然后提取与用户最相关的日期、金额、要求和注意事项。",
      "原文件内容始终比 AI 的概括具有更高优先级。",
    ],
    actions: [
      "确认文件的发送方。",
      "检查是否存在截止日期。",
      "检查是否要求付款、提交资料或回复。",
    ],
    dates: [],
    amounts: [],
    difficultTerms: [],
    riskLevel: "low",
    warning:
      "当前为模拟分析结果。正式版本接入 AI 后，也应该把结果作为辅助理解，而不是自动替代官方文件、合同或专业意见。",
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
  focus:border-indigo-400
  focus:bg-white
  focus:ring-4
  focus:ring-indigo-50
`;