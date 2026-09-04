"use client";

import Link from "next/link";
import {
  type FormEvent,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Copy,
  Headphones,
  Languages,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

type LanguageScene =
  | "customer_service"
  | "business_email"
  | "interview"
  | "phone"
  | "daily"
  | "general";

type LanguageTone =
  | "natural"
  | "polite"
  | "business"
  | "simple";

type InputLanguage =
  | "auto"
  | "chinese"
  | "japanese";

interface SceneOption {
  value: LanguageScene;
  label: string;
  description: string;
}

interface ToneOption {
  value: LanguageTone;
  label: string;
  description: string;
}

interface LanguageResult {
  japanese: string;
  explanation: string;
  alternatives: string[];
}

const sceneOptions: SceneOption[] = [
  {
    value: "customer_service",
    label: "客服回复",
    description: "电商、店铺、售后等客服场景",
  },
  {
    value: "business_email",
    label: "商务邮件",
    description: "公司内部、客户、合作方邮件",
  },
  {
    value: "interview",
    label: "面试",
    description: "求职面试、自我介绍、工作说明",
  },
  {
    value: "phone",
    label: "电话对应",
    description: "接听电话、确认信息、回电",
  },
  {
    value: "daily",
    label: "日常会话",
    description: "朋友、同事和生活交流",
  },
  {
    value: "general",
    label: "普通表达",
    description: "翻译、润色和自然表达",
  },
];

const toneOptions: ToneOption[] = [
  {
    value: "natural",
    label: "自然",
    description: "自然、不生硬",
  },
  {
    value: "polite",
    label: "礼貌",
    description: "です・ます为主",
  },
  {
    value: "business",
    label: "商务敬语",
    description: "更正式的商务表达",
  },
  {
    value: "simple",
    label: "简单易懂",
    description: "避免复杂词汇",
  },
];

const examples = [
  {
    label: "客服",
    scene: "customer_service" as LanguageScene,
    tone: "polite" as LanguageTone,
    text: "您好，我这里先帮您确认一下订单信息，确认以后会通过乐天的消息功能回复您。",
  },
  {
    label: "电话",
    scene: "phone" as LanguageScene,
    tone: "business" as LanguageTone,
    text: "请问可以告诉我您的购买番号吗？我确认以后再给您回电话。",
  },
  {
    label: "邮件",
    scene: "business_email" as LanguageScene,
    tone: "business" as LanguageTone,
    text: "感谢您的联系。关于您询问的问题，我们正在确认，请稍等一下。",
  },
  {
    label: "面试",
    scene: "interview" as LanguageScene,
    tone: "polite" as LanguageTone,
    text: "我主要负责使用Python进行数据处理和自动化，也有使用AI提高工作效率的经验。",
  },
];

export default function LanguageAiPage() {
  const [scene, setScene] =
    useState<LanguageScene>("customer_service");

  const [tone, setTone] =
    useState<LanguageTone>("polite");

  const [inputLanguage, setInputLanguage] =
    useState<InputLanguage>("auto");

  const [input, setInput] = useState("");

  const [result, setResult] =
    useState<LanguageResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState("");

  const currentScene = useMemo(
    () =>
      sceneOptions.find(
        (item) => item.value === scene
      ),
    [scene]
  );

  const currentTone = useMemo(
    () =>
      toneOptions.find(
        (item) => item.value === tone
      ),
    [tone]
  );

  const canSubmit =
    input.trim().length >= 2 && !loading;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const text = input.trim();

    if (text.length < 2) {
      setError("请输入需要转换或润色的内容。");
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      // TODO [API - POST]
      // POST /api/ai/language
      // Purpose: generate natural Japanese based on the user's text,
      // selected scene and tone.
      //
      // Request example:
      // {
      //   input: text,
      //   inputLanguage,
      //   scene,
      //   tone
      // }
      //
      // Backend requirements:
      // - authenticate / rate-limit when necessary
      // - never expose AI provider API keys to the browser
      // - validate input length and request schema
      // - return structured JSON
      // - do not log sensitive customer information unnecessarily

      await new Promise((resolve) => {
        window.setTimeout(resolve, 700);
      });

      setResult(
        createMockResult(
          text,
          scene,
          tone
        )
      );
    } catch {
      setError(
        "生成失败，请稍后重新尝试。"
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result?.japanese) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        result.japanese
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError(
        "复制失败，请手动选择文字复制。"
      );
    }
  }

  function resetAll() {
    setInput("");
    setResult(null);
    setError("");
    setCopied(false);
    setScene("customer_service");
    setTone("polite");
    setInputLanguage("auto");
  }

  function useExample(
    example: (typeof examples)[number]
  ) {
    setInput(example.text);
    setScene(example.scene);
    setTone(example.tone);
    setResult(null);
    setError("");
  }

  function useAlternative(text: string) {
    setInput(text);
    setResult(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="
            pointer-events-none
            absolute
            left-[-120px]
            top-[-100px]
            h-[360px]
            w-[360px]
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[-100px]
            top-[-120px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-indigo-500/10
            blur-3xl
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              py-9
              sm:py-12
            "
          >
            <Link
              href="/ai-tools"
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
              返回 Sakura AI
            </Link>

            <div
              className="
                mt-6
                flex
                flex-col
                gap-5
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div className="max-w-2xl">
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
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-cyan-300
                      text-slate-950
                    "
                  >
                    <Languages size={21} />
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
                      Language Assistant
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
                  日语表达助手
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
                  输入中文或日文，根据实际使用场景，
                  帮你整理成更自然、更合适的日语表达。
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
                <Sparkles
                  size={14}
                  className="text-cyan-300"
                />
                中文 → 日语 / 日语润色
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* MAIN */}

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
            <div className="min-w-0 space-y-6">
              {/* INPUT */}

              <form
                onSubmit={handleSubmit}
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
                    border-b
                    border-slate-100
                    p-5
                    sm:p-6
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
                    <div>
                      <p
                        className="
                          text-[10px]
                          font-black
                          tracking-[0.14em]
                          text-indigo-600
                        "
                      >
                        YOUR TEXT
                      </p>

                      <h2
                        className="
                          mt-1
                          text-lg
                          font-black
                          text-slate-950
                        "
                      >
                        输入你想表达的内容
                      </h2>
                    </div>

                    <div
                      className="
                        relative
                        w-full
                        sm:w-40
                      "
                    >
                      <select
                        value={inputLanguage}
                        onChange={(event) =>
                          setInputLanguage(
                            event.target
                              .value as InputLanguage
                          )
                        }
                        className="
                          min-h-10
                          w-full
                          appearance-none
                          rounded-xl
                          border
                          border-slate-200
                          bg-slate-50
                          px-3
                          pr-9
                          text-xs
                          font-black
                          text-slate-700
                          outline-none
                          transition
                          focus:border-indigo-400
                          focus:ring-4
                          focus:ring-indigo-50
                        "
                      >
                        <option value="auto">
                          自动识别
                        </option>

                        <option value="chinese">
                          中文
                        </option>

                        <option value="japanese">
                          日文润色
                        </option>
                      </select>

                      <ChevronDown
                        size={14}
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

                  <div className="mt-5">
                    <textarea
                      value={input}
                      maxLength={2000}
                      rows={9}
                      placeholder="例如：您好，我这里先确认一下您的订单信息，确认以后会通过乐天的消息回复您。"
                      onChange={(event) => {
                        setInput(
                          event.target.value
                        );
                        setError("");
                      }}
                      className="
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
                      "
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
                        不建议输入密码、银行卡等敏感信息
                      </span>

                      <span
                        className="
                          shrink-0
                          text-[10px]
                          font-bold
                          text-slate-400
                        "
                      >
                        {input.length}/2000
                      </span>
                    </div>
                  </div>
                </div>

                {/* SCENE */}

                <div
                  className="
                    border-b
                    border-slate-100
                    p-5
                    sm:p-6
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-black
                        text-slate-900
                      "
                    >
                      使用场景
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      场景会影响敬语、措辞和表达方式。
                    </p>
                  </div>

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                      sm:grid-cols-3
                    "
                  >
                    {sceneOptions.map(
                      (option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setScene(
                              option.value
                            );
                            setResult(null);
                          }}
                          className={`
                            min-h-[76px]
                            rounded-2xl
                            border
                            p-3
                            text-left
                            transition
                            ${
                              scene ===
                              option.value
                                ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }
                          `}
                        >
                          <p
                            className="
                              text-xs
                              font-black
                            "
                          >
                            {option.label}
                          </p>

                          <p
                            className={`
                              mt-1
                              text-[10px]
                              leading-4
                              ${
                                scene ===
                                option.value
                                  ? "text-slate-400"
                                  : "text-slate-400"
                              }
                            `}
                          >
                            {
                              option.description
                            }
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* TONE */}

                <div
                  className="
                    border-b
                    border-slate-100
                    p-5
                    sm:p-6
                  "
                >
                  <p
                    className="
                      text-sm
                      font-black
                      text-slate-900
                    "
                  >
                    表达方式
                  </p>

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                      sm:grid-cols-4
                    "
                  >
                    {toneOptions.map(
                      (option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setTone(
                              option.value
                            );
                            setResult(null);
                          }}
                          className={`
                            min-h-[72px]
                            rounded-xl
                            border
                            px-3
                            py-3
                            text-left
                            transition
                            ${
                              tone ===
                              option.value
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
                            {option.label}
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              leading-4
                              text-slate-400
                            "
                          >
                            {
                              option.description
                            }
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {error && (
                  <div
                    className="
                      mx-5
                      mt-5
                      rounded-xl
                      border
                      border-rose-200
                      bg-rose-50
                      px-4
                      py-3
                      text-xs
                      font-bold
                      text-rose-700
                      sm:mx-6
                    "
                  >
                    {error}
                  </div>
                )}

                {/* ACTION */}

                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    p-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:p-6
                  "
                >
                  <button
                    type="button"
                    onClick={resetAll}
                    className="
                      inline-flex
                      min-h-11
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
                    disabled={!canSubmit}
                    className="
                      inline-flex
                      min-h-12
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-slate-950
                      px-6
                      py-3
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
                        正在生成...
                      </>
                    ) : (
                      <>
                        <WandSparkles
                          size={17}
                        />
                        生成自然日语
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* RESULT */}

              {result && (
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
                      items-center
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
                          bg-indigo-50
                          text-indigo-600
                        "
                      >
                        <Sparkles size={18} />
                      </div>

                      <div>
                        <p
                          className="
                            text-[10px]
                            font-black
                            tracking-[0.12em]
                            text-indigo-600
                          "
                        >
                          AI RESULT
                        </p>

                        <h2
                          className="
                            mt-0.5
                            text-base
                            font-black
                            text-slate-950
                          "
                        >
                          推荐表达
                        </h2>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void copyResult()
                      }
                      className="
                        inline-flex
                        min-h-10
                        shrink-0
                        items-center
                        gap-2
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

                  <div className="p-5 sm:p-6">
                    <div
                      className="
                        rounded-2xl
                        border
                        border-indigo-100
                        bg-indigo-50/60
                        p-5
                        sm:p-6
                      "
                    >
                      <p
                        className="
                          whitespace-pre-wrap
                          text-[16px]
                          font-semibold
                          leading-8
                          text-slate-900
                        "
                      >
                        {result.japanese}
                      </p>
                    </div>

                    <div
                      className="
                        mt-5
                        rounded-2xl
                        bg-slate-50
                        p-4
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-black
                          text-slate-900
                        "
                      >
                        为什么这样表达？
                      </p>

                      <p
                        className="
                          mt-2
                          text-xs
                          leading-6
                          text-slate-600
                        "
                      >
                        {result.explanation}
                      </p>
                    </div>

                    {result.alternatives.length >
                      0 && (
                      <div className="mt-6">
                        <p
                          className="
                            text-xs
                            font-black
                            text-slate-900
                          "
                        >
                          其他表达
                        </p>

                        <div className="mt-3 space-y-2">
                          {result.alternatives.map(
                            (alternative) => (
                              <button
                                key={
                                  alternative
                                }
                                type="button"
                                onClick={() =>
                                  useAlternative(
                                    alternative
                                  )
                                }
                                className="
                                  group
                                  flex
                                  w-full
                                  items-start
                                  justify-between
                                  gap-4
                                  rounded-xl
                                  border
                                  border-slate-200
                                  bg-white
                                  p-4
                                  text-left
                                  transition
                                  hover:border-indigo-200
                                  hover:bg-indigo-50/40
                                "
                              >
                                <span
                                  className="
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-slate-700
                                  "
                                >
                                  {
                                    alternative
                                  }
                                </span>

                                <Send
                                  size={14}
                                  className="
                                    mt-1
                                    shrink-0
                                    text-slate-300
                                    transition
                                    group-hover:text-indigo-500
                                  "
                                />
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
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
              {/* CURRENT SETTINGS */}

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
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
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
                  <SettingRow
                    label="场景"
                    value={
                      currentScene?.label ??
                      "-"
                    }
                  />

                  <SettingRow
                    label="语气"
                    value={
                      currentTone?.label ??
                      "-"
                    }
                  />

                  <SettingRow
                    label="目标语言"
                    value="日语"
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
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <MessageCircle
                    size={17}
                    className="text-cyan-600"
                  />

                  <h2
                    className="
                      text-sm
                      font-black
                      text-slate-950
                    "
                  >
                    快速示例
                  </h2>
                </div>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  点一下就能放入输入框。
                </p>

                <div className="mt-4 space-y-2">
                  {examples.map(
                    (example) => (
                      <button
                        key={example.label}
                        type="button"
                        onClick={() =>
                          useExample(example)
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
                          hover:bg-indigo-50/50
                        "
                      >
                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-2.5
                          "
                        >
                          <ExampleIcon
                            label={
                              example.label
                            }
                          />

                          <span
                            className="
                              text-xs
                              font-black
                              text-slate-700
                            "
                          >
                            {example.label}
                          </span>
                        </div>

                        <Send
                          size={13}
                          className="
                            shrink-0
                            text-slate-300
                          "
                        />
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* NOTICE */}

              <div
                className="
                  rounded-[24px]
                  bg-slate-950
                  p-5
                "
              >
                <Sparkles
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
                  以后会接真实 AI
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-6
                    text-slate-400
                  "
                >
                  当前阶段先完成完整产品交互。
                  后端接入模型后，
                  这里只需要把模拟结果替换成 API 返回结果，
                  页面结构不用重做。
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}

function SettingRow({
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

function ExampleIcon({
  label,
}: {
  label: string;
}) {
  const className =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600";

  if (label === "客服") {
    return (
      <div className={className}>
        <Headphones size={14} />
      </div>
    );
  }

  if (label === "电话") {
    return (
      <div className={className}>
        <Phone size={14} />
      </div>
    );
  }

  if (label === "邮件") {
    return (
      <div className={className}>
        <Mail size={14} />
      </div>
    );
  }

  return (
    <div className={className}>
      <BriefcaseBusiness size={14} />
    </div>
  );
}

function createMockResult(
  input: string,
  scene: LanguageScene,
  tone: LanguageTone
): LanguageResult {
  const normalized =
    input.replace(/\s+/g, "");

  if (
    normalized.includes("购买番号") ||
    normalized.includes("订单") ||
    normalized.includes("乐天")
  ) {
    if (scene === "phone") {
      return {
        japanese:
          "恐れ入りますが、ご購入番号をお伺いしてもよろしいでしょうか。\nこちらで内容を確認のうえ、改めてお電話にてご連絡いたします。",
        explanation:
          "电话客服中使用「恐れ入りますが」会比直接询问更柔和。「お伺いしてもよろしいでしょうか」适合向客人确认购买番号。后半使用「確認のうえ、改めてご連絡いたします」表达确认后再次联系。",
        alternatives: [
          "恐れ入りますが、ご注文番号を教えていただけますでしょうか。確認後、こちらから改めてご連絡いたします。",
          "ご購入番号を確認させていただけますでしょうか。内容を確認次第、こちらからお電話いたします。",
        ],
      };
    }

    return {
      japanese:
        "お問い合わせいただきありがとうございます。\nこちらでご注文内容を確認いたします。確認が取れ次第、楽天市場のメッセージ機能より改めてご連絡いたしますので、今しばらくお待ちください。",
      explanation:
        "客服场景中先感谢客人的联系，再说明正在确认，最后明确之后通过什么方式回复。这样比逐句直译中文更符合日本电商客服的表达习惯。",
      alternatives: [
        "ご連絡ありがとうございます。ご注文内容を確認のうえ、楽天市場のメッセージより改めてご案内いたします。",
        "ただいまご注文内容を確認しております。確認でき次第、楽天市場のメッセージ機能よりご連絡いたします。",
      ],
    };
  }

  if (scene === "business_email") {
    return {
      japanese:
        "お問い合わせいただき、ありがとうございます。\nご連絡いただいた内容につきまして、現在確認しております。確認が取れ次第、改めてご連絡いたしますので、恐れ入りますが今しばらくお待ちください。",
      explanation:
        "商务邮件中避免过于口语化，使用「〜につきまして」「確認が取れ次第」「改めてご連絡いたします」会更加自然和正式。",
      alternatives: [
        "ご連絡いただきありがとうございます。内容を確認のうえ、改めてご回答いたします。",
        "お問い合わせの件につきまして、現在確認を進めております。確認でき次第、ご連絡いたします。",
      ],
    };
  }

  if (scene === "interview") {
    return {
      japanese:
        "これまで主にPythonを使用したデータ処理や業務自動化を担当してきました。また、AIを活用して業務効率を改善した経験もあります。",
      explanation:
        "面试中不需要使用过度复杂的敬语，重点是让经历听起来清楚、自然。使用「担当してきました」「経験もあります」比较适合口头自我介绍。",
      alternatives: [
        "主にPythonを用いたデータ処理や自動化業務に携わってきました。AIを活用した業務改善にも取り組んだ経験があります。",
        "Pythonによるデータ処理を中心に、業務の自動化やAIを活用した効率化にも取り組んできました。",
      ],
    };
  }

  if (scene === "phone") {
    return {
      japanese:
        "お問い合わせありがとうございます。内容を確認いたしますので、少々お待ちいただけますでしょうか。確認後、必要に応じてこちらから改めてご連絡いたします。",
      explanation:
        "电话场景要比邮件短，句子也应该更容易听懂。这里使用礼貌但不会过度复杂的表达。",
      alternatives: [
        "ただいま確認いたしますので、少々お待ちください。",
        "こちらで確認のうえ、改めてご連絡させていただきます。",
      ],
    };
  }

  if (scene === "daily") {
    return {
      japanese:
        tone === "simple"
          ? "内容を確認してから、また連絡します。"
          : "内容を確認してから、改めて連絡しますね。",
      explanation:
        "日常会话不需要使用客服或商务邮件级别的敬语，否则会显得距离感太强。",
      alternatives: [
        "ちょっと確認してから、また連絡します。",
        "確認できたら、また連絡しますね。",
      ],
    };
  }

  return {
    japanese:
      "内容を確認のうえ、改めてご連絡いたします。",
    explanation:
      `当前模拟结果按照「${
        sceneOptions.find(
          (item) => item.value === scene
        )?.label ?? "普通表达"
      } / ${
        toneOptions.find(
          (item) => item.value === tone
        )?.label ?? "自然"
      }」生成。正式接入 AI 后，会根据你实际输入的完整内容进行翻译和润色。`,
    alternatives: [
      "内容を確認してから、改めてご連絡いたします。",
      "確認が取れ次第、こちらからご連絡いたします。",
    ],
  };
}