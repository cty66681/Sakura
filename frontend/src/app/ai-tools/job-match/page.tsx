"use client";

import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Code2,
  GraduationCap,
  JapaneseYen,
  Languages,
  Loader2,
  MapPin,
  Monitor,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

type JapaneseLevel =
  | "none"
  | "n3"
  | "n2"
  | "n1"
  | "business";

type EmploymentType =
  | "any"
  | "fulltime"
  | "contract"
  | "dispatch";

type WorkStyle =
  | "any"
  | "onsite"
  | "hybrid"
  | "remote";

type ExperienceLevel =
  | "0"
  | "1"
  | "3"
  | "5"
  | "8";

interface MatchForm {
  keyword: string;
  skills: string;
  experience: ExperienceLevel;
  japaneseLevel: JapaneseLevel;
  prefecture: string;
  salary: string;
  employmentType: EmploymentType;
  workStyle: WorkStyle;
  education: string;
  preference: string;
}

interface JobMatchResult {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  employmentType: string;
  workStyle: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasons: string[];
  caution: string;
}

const initialForm: MatchForm = {
  keyword: "",
  skills: "",
  experience: "3",
  japaneseLevel: "n2",
  prefecture: "不限",
  salary: "",
  employmentType: "any",
  workStyle: "any",
  education: "",
  preference: "",
};

const prefectures = [
  "不限",
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

const japaneseLevels: {
  value: JapaneseLevel;
  label: string;
}[] = [
  {
    value: "none",
    label: "不限制 / 未填写",
  },
  {
    value: "n3",
    label: "JLPT N3",
  },
  {
    value: "n2",
    label: "JLPT N2",
  },
  {
    value: "n1",
    label: "JLPT N1",
  },
  {
    value: "business",
    label: "商务日语",
  },
];

const experienceOptions: {
  value: ExperienceLevel;
  label: string;
}[] = [
  {
    value: "0",
    label: "未经验 / 应届",
  },
  {
    value: "1",
    label: "1年以上",
  },
  {
    value: "3",
    label: "3年以上",
  },
  {
    value: "5",
    label: "5年以上",
  },
  {
    value: "8",
    label: "8年以上",
  },
];

const employmentOptions: {
  value: EmploymentType;
  label: string;
}[] = [
  {
    value: "any",
    label: "不限",
  },
  {
    value: "fulltime",
    label: "正社员",
  },
  {
    value: "contract",
    label: "契约",
  },
  {
    value: "dispatch",
    label: "派遣",
  },
];

const workStyleOptions: {
  value: WorkStyle;
  label: string;
}[] = [
  {
    value: "any",
    label: "不限",
  },
  {
    value: "onsite",
    label: "出社",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
  {
    value: "remote",
    label: "Remote",
  },
];

export default function JobMatchAiPage() {
  const [form, setForm] =
    useState<MatchForm>(initialForm);

  const [results, setResults] =
    useState<JobMatchResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hasGenerated, setHasGenerated] =
    useState(false);

  const skillCount = useMemo(
    () => parseSkills(form.skills).length,
    [form.skills]
  );

  const canGenerate =
    form.skills.trim().length >= 2 ||
    form.keyword.trim().length >= 2;

  function updateForm<K extends keyof MatchForm>(
    key: K,
    value: MatchForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
  }

  function loadExample() {
    setForm({
      keyword: "Python 后端开发",
      skills:
        "Python, FastAPI, SQL, ETL, AWS, Git, AI",
      experience: "3",
      japaneseLevel: "n2",
      prefecture: "东京",
      salary: "600000",
      employmentType: "fulltime",
      workStyle: "hybrid",
      education: "IT专门学校毕业",
      preference:
        "希望主要做Python开发和数据处理，可以使用AI，不希望长期加班。",
    });

    setResults([]);
    setHasGenerated(false);
    setError("");
  }

  function resetAll() {
    setForm(initialForm);
    setResults([]);
    setHasGenerated(false);
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!canGenerate) {
      setError(
        "请至少填写希望职位或你的技能。"
      );
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setHasGenerated(false);

    try {
      // TODO [API - POST]
      // POST /api/ai/job-match
      // Purpose:
      // Match the current user's skills, experience and preferences
      // against published Sakura job records.
      //
      // Request:
      // {
      //   keyword,
      //   skills,
      //   experience,
      //   japaneseLevel,
      //   prefecture,
      //   salary,
      //   employmentType,
      //   workStyle,
      //   education,
      //   preference
      // }
      //
      // Backend requirements:
      // - only search published / valid job records
      // - calculate hard-condition matches before AI semantic ranking
      // - AI must not invent jobs that do not exist in Sakura database
      // - rate-limit AI requests
      // - never expose AI provider keys to browser
      // - return job IDs so frontend can link to real detail pages

      await new Promise((resolve) => {
        window.setTimeout(resolve, 850);
      });

      setResults(
        createMockMatches(form)
      );

      setHasGenerated(true);
    } catch {
      setError(
        "匹配失败，请稍后重新尝试。"
      );
    } finally {
      setLoading(false);
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
                    <BriefcaseBusiness
                      size={21}
                    />
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
                      Job Match Assistant
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
                  工作匹配 AI
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
                  根据你的技能、工作经验、日语水平和求职条件，
                  从 Sakura 的真实招聘信息中找到更适合你的工作。
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
                <Target
                  size={14}
                  className="text-cyan-300"
                />
                条件匹配 + AI 分析
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
                {/* TARGET */}

                <FormSection
                  icon={<Target size={18} />}
                  title="想找什么工作？"
                  description="职位名称不用特别准确，输入大概方向即可。"
                >
                  <Field
                    label="希望职位 / 关键词"
                    optional
                  >
                    <input
                      value={form.keyword}
                      placeholder="例如：Python 后端开发 / 数据工程师 / IT"
                      onChange={(event) =>
                        updateForm(
                          "keyword",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>
                </FormSection>

                {/* SKILLS */}

                <FormSection
                  icon={<Code2 size={18} />}
                  title="技能与工作经验"
                  description="这里是工作匹配最重要的部分，可以直接使用中文填写。"
                >
                  <div className="space-y-5">
                    <Field
                      label="你的技能"
                      hint={
                        skillCount > 0
                          ? `${skillCount} 项`
                          : "使用逗号分隔"
                      }
                    >
                      <textarea
                        value={form.skills}
                        rows={5}
                        placeholder="例如：Python, Java, React, SQL, AWS, ETL, AI"
                        onChange={(event) =>
                          updateForm(
                            "skills",
                            event.target.value
                          )
                        }
                        className={
                          textareaClass
                        }
                      />
                    </Field>

                    <div
                      className="
                        grid
                        gap-4
                        sm:grid-cols-2
                      "
                    >
                      <Field label="工作经验">
                        <SelectWrap>
                          <select
                            value={
                              form.experience
                            }
                            onChange={(event) =>
                              updateForm(
                                "experience",
                                event.target
                                  .value as ExperienceLevel
                              )
                            }
                            className={
                              selectClass
                            }
                          >
                            {experienceOptions.map(
                              (item) => (
                                <option
                                  key={
                                    item.value
                                  }
                                  value={
                                    item.value
                                  }
                                >
                                  {
                                    item.label
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </SelectWrap>
                      </Field>

                      <Field label="日语水平">
                        <SelectWrap>
                          <select
                            value={
                              form.japaneseLevel
                            }
                            onChange={(event) =>
                              updateForm(
                                "japaneseLevel",
                                event.target
                                  .value as JapaneseLevel
                              )
                            }
                            className={
                              selectClass
                            }
                          >
                            {japaneseLevels.map(
                              (item) => (
                                <option
                                  key={
                                    item.value
                                  }
                                  value={
                                    item.value
                                  }
                                >
                                  {
                                    item.label
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </SelectWrap>
                      </Field>
                    </div>

                    <Field
                      label="学历"
                      optional
                    >
                      <input
                        value={form.education}
                        placeholder="例如：日本IT专门学校毕业"
                        onChange={(event) =>
                          updateForm(
                            "education",
                            event.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* CONDITIONS */}

                <FormSection
                  icon={<Search size={18} />}
                  title="希望条件"
                  description="这些条件会影响推荐工作的排序。"
                >
                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    <Field label="希望地区">
                      <SelectWrap>
                        <select
                          value={
                            form.prefecture
                          }
                          onChange={(event) =>
                            updateForm(
                              "prefecture",
                              event.target.value
                            )
                          }
                          className={
                            selectClass
                          }
                        >
                          {prefectures.map(
                            (prefecture) => (
                              <option
                                key={
                                  prefecture
                                }
                                value={
                                  prefecture
                                }
                              >
                                {prefecture}
                              </option>
                            )
                          )}
                        </select>
                      </SelectWrap>
                    </Field>

                    <Field
                      label="希望最低月薪"
                      optional
                    >
                      <div className="relative">
                        <span
                          className="
                            pointer-events-none
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-sm
                            font-black
                            text-slate-400
                          "
                        >
                          ¥
                        </span>

                        <input
                          value={form.salary}
                          inputMode="numeric"
                          placeholder="500000"
                          onChange={(event) =>
                            updateForm(
                              "salary",
                              event.target.value.replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          className={`
                            ${inputClass}
                            pl-8
                          `}
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="mt-6">
                    <p
                      className="
                        text-sm
                        font-black
                        text-slate-800
                      "
                    >
                      雇用形式
                    </p>

                    <div
                      className="
                        mt-3
                        grid
                        grid-cols-2
                        gap-2
                        sm:grid-cols-4
                      "
                    >
                      {employmentOptions.map(
                        (item) => (
                          <ChoiceButton
                            key={item.value}
                            active={
                              form.employmentType ===
                              item.value
                            }
                            onClick={() =>
                              updateForm(
                                "employmentType",
                                item.value
                              )
                            }
                          >
                            {item.label}
                          </ChoiceButton>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p
                      className="
                        text-sm
                        font-black
                        text-slate-800
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
                        sm:grid-cols-4
                      "
                    >
                      {workStyleOptions.map(
                        (item) => (
                          <ChoiceButton
                            key={item.value}
                            active={
                              form.workStyle ===
                              item.value
                            }
                            onClick={() =>
                              updateForm(
                                "workStyle",
                                item.value
                              )
                            }
                          >
                            {item.label}
                          </ChoiceButton>
                        )
                      )}
                    </div>
                  </div>
                </FormSection>

                {/* OTHER PREFERENCE */}

                <FormSection
                  icon={<Sparkles size={18} />}
                  title="还有什么要求？"
                  description="可以用普通中文告诉 AI，比如不想加班、希望外国人友好、想做AI相关项目等。"
                >
                  <Field
                    label="补充条件"
                    optional
                    hint={`${form.preference.length}/800`}
                  >
                    <textarea
                      value={form.preference}
                      maxLength={800}
                      rows={5}
                      placeholder="例如：希望可以部分远程，不希望长期加班，最好是外国人也比较容易融入的团队。"
                      onChange={(event) =>
                        updateForm(
                          "preference",
                          event.target.value
                        )
                      }
                      className={
                        textareaClass
                      }
                    />
                  </Field>
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
                      onClick={loadExample}
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
                      <BriefcaseBusiness
                        size={15}
                      />
                      填入示例
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      !canGenerate ||
                      loading
                    }
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
                        正在匹配...
                      </>
                    ) : (
                      <>
                        <WandSparkles
                          size={17}
                        />
                        AI 匹配工作
                      </>
                    )}
                  </button>
                </div>

                {/* RESULTS */}

                {hasGenerated && (
                  <MatchResults
                    results={results}
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
                      当前匹配条件
                    </h2>
                  </div>

                  <div className="mt-4 space-y-3">
                    <InfoRow
                      label="职位"
                      value={
                        form.keyword ||
                        "不限"
                      }
                    />

                    <InfoRow
                      label="技能"
                      value={
                        skillCount
                          ? `${skillCount} 项`
                          : "未填写"
                      }
                    />

                    <InfoRow
                      label="地区"
                      value={
                        form.prefecture
                      }
                    />

                    <InfoRow
                      label="经验"
                      value={
                        experienceOptions.find(
                          (item) =>
                            item.value ===
                            form.experience
                        )?.label ?? "-"
                      }
                    />

                    <InfoRow
                      label="日语"
                      value={
                        japaneseLevels.find(
                          (item) =>
                            item.value ===
                            form.japaneseLevel
                        )?.label ?? "-"
                      }
                    />
                  </div>
                </div>

                <div
                  className="
                    rounded-[24px]
                    border
                    border-indigo-100
                    bg-indigo-50
                    p-5
                  "
                >
                  <Target
                    size={19}
                    className="text-indigo-600"
                  />

                  <h3
                    className="
                      mt-3
                      text-sm
                      font-black
                      text-indigo-950
                    "
                  >
                    不是只看关键词
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-indigo-900/75
                    "
                  >
                    正式版本会先检查地区、薪资、
                    雇用形式等硬条件，再结合技能、
                    经历和职位内容做语义匹配。
                  </p>
                </div>

                <div
                  className="
                    rounded-[24px]
                    bg-slate-950
                    p-5
                  "
                >
                  <CheckCircle2
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
                    只推荐真实职位
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-slate-400
                    "
                  >
                    后端接入后，AI
                    只负责分析和排序 Sakura
                    数据库中已经发布的招聘信息，
                    不允许自己编造不存在的工作。
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
              onClick={loadExample}
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
              <BriefcaseBusiness
                size={14}
              />
              示例
            </button>

            <button
              type="submit"
              disabled={
                !canGenerate ||
                loading
              }
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
                  正在匹配...
                </>
              ) : (
                <>
                  <WandSparkles
                    size={16}
                  />
                  AI 匹配工作
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
      <div
        className="
          flex
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

function Field({
  label,
  optional,
  hint,
  children,
}: {
  label: string;
  optional?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div
        className="
          mb-2
          flex
          min-h-5
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-1.5
          "
        >
          <span
            className="
              text-sm
              font-black
              text-slate-800
            "
          >
            {label}
          </span>

          {optional && (
            <span
              className="
                text-[10px]
                font-bold
                text-slate-400
              "
            >
              可选
            </span>
          )}
        </div>

        {hint && (
          <span
            className="
              shrink-0
              text-[10px]
              font-bold
              text-slate-400
            "
          >
            {hint}
          </span>
        )}
      </div>

      {children}
    </label>
  );
}

function SelectWrap({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {children}

      <ChevronDown
        size={15}
        className="
          pointer-events-none
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />
    </div>
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

function MatchResults({
  results,
}: {
  results: JobMatchResult[];
}) {
  if (results.length === 0) {
    return (
      <section
        className="
          rounded-[26px]
          border
          border-slate-200
          bg-white
          p-8
          text-center
          shadow-sm
        "
      >
        <Search
          size={28}
          className="
            mx-auto
            text-slate-300
          "
        />

        <h2
          className="
            mt-4
            text-lg
            font-black
            text-slate-950
          "
        >
          暂时没有合适的工作
        </h2>

        <p
          className="
            mx-auto
            mt-2
            max-w-md
            text-xs
            leading-6
            text-slate-500
          "
        >
          可以尝试放宽地区、薪资或工作方式等条件。
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
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
              text-[10px]
              font-black
              tracking-[0.14em]
              text-indigo-600
            "
          >
            AI MATCH RESULT
          </p>

          <h2
            className="
              mt-1
              text-xl
              font-black
              text-slate-950
            "
          >
            推荐工作
          </h2>
        </div>

        <span
          className="
            text-xs
            font-bold
            text-slate-400
          "
        >
          {results.length} 个结果
        </span>
      </div>

      {results.map((job, index) => (
        <JobMatchCard
          key={job.id}
          job={job}
          index={index}
        />
      ))}
    </section>
  );
}

function JobMatchCard({
  job,
  index,
}: {
  job: JobMatchResult;
  index: number;
}) {
  return (
    <article
      className="
        overflow-hidden
        rounded-[26px]
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div className="p-5 sm:p-6">
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
          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              {index === 0 && (
                <span
                  className="
                    rounded-full
                    bg-indigo-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-black
                    text-indigo-700
                  "
                >
                  最推荐
                </span>
              )}

              <span
                className="
                  text-xs
                  font-bold
                  text-slate-400
                "
              >
                {job.company}
              </span>
            </div>

            <h3
              className="
                mt-2
                text-lg
                font-black
                text-slate-950
                sm:text-xl
              "
            >
              {job.title}
            </h3>

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-x-4
                gap-y-2
                text-xs
                font-bold
                text-slate-500
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <MapPin size={13} />
                {job.location}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <JapaneseYen
                  size={13}
                />
                {job.salary}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <Clock3 size={13} />
                {job.employmentType}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <Monitor size={13} />
                {job.workStyle}
              </span>
            </div>
          </div>

          <div
            className="
              flex
              shrink-0
              items-center
              gap-3
              rounded-2xl
              bg-slate-950
              px-4
              py-3
              text-white
            "
          >
            <div>
              <p
                className="
                  text-[9px]
                  font-black
                  tracking-wider
                  text-slate-400
                "
              >
                MATCH
              </p>

              <p
                className="
                  mt-0.5
                  text-2xl
                  font-black
                "
              >
                {job.matchScore}
                <span
                  className="
                    ml-0.5
                    text-xs
                    text-slate-400
                  "
                >
                  %
                </span>
              </p>
            </div>

            <Target
              size={20}
              className="text-cyan-300"
            />
          </div>
        </div>

        <div
          className="
            mt-5
            grid
            gap-4
            lg:grid-cols-2
          "
        >
          <div
            className="
              rounded-2xl
              bg-emerald-50
              p-4
            "
          >
            <p
              className="
                flex
                items-center
                gap-2
                text-xs
                font-black
                text-emerald-900
              "
            >
              <CheckCircle2
                size={15}
              />
              为什么适合你
            </p>

            <div className="mt-3 space-y-2">
              {job.reasons.map(
                (reason) => (
                  <p
                    key={reason}
                    className="
                      text-xs
                      leading-5
                      text-emerald-900/80
                    "
                  >
                    · {reason}
                  </p>
                )
              )}
            </div>
          </div>

          <div
            className="
              rounded-2xl
              bg-amber-50
              p-4
            "
          >
            <p
              className="
                flex
                items-center
                gap-2
                text-xs
                font-black
                text-amber-900
              "
            >
              <CircleAlert size={15} />
              需要确认
            </p>

            <p
              className="
                mt-3
                text-xs
                leading-5
                text-amber-900/80
              "
            >
              {job.caution}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p
            className="
              text-[10px]
              font-black
              text-slate-400
            "
          >
            已匹配技能
          </p>

          <div
            className="
              mt-2
              flex
              flex-wrap
              gap-2
            "
          >
            {job.matchedSkills.map(
              (skill) => (
                <span
                  key={skill}
                  className="
                    rounded-full
                    bg-slate-100
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-slate-700
                  "
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        {job.missingSkills.length >
          0 && (
          <div className="mt-4">
            <p
              className="
                text-[10px]
                font-black
                text-slate-400
              "
            >
              建议补充
            </p>

            <div
              className="
                mt-2
                flex
                flex-wrap
                gap-2
              "
            >
              {job.missingSkills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="
                      rounded-full
                      border
                      border-amber-200
                      bg-amber-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-amber-800
                    "
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <div
        className="
          border-t
          border-slate-100
          bg-slate-50/70
          p-4
          sm:px-6
        "
      >
        <Link
          href={`/jobs/${job.id}`}
          className="
            inline-flex
            min-h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-950
            px-4
            text-sm
            font-black
            text-white
            transition
            hover:bg-indigo-600
            sm:w-auto
          "
        >
          查看工作详情
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
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

function parseSkills(
  value: string
) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createMockMatches(
  form: MatchForm
): JobMatchResult[] {
  const userSkills =
    parseSkills(form.skills);

  const lowerSkills =
    userSkills.map((item) =>
      item.toLowerCase()
    );

  function hasSkill(
    skill: string
  ) {
    return lowerSkills.some(
      (item) =>
        item.includes(
          skill.toLowerCase()
        ) ||
        skill
          .toLowerCase()
          .includes(item)
    );
  }

  const pythonMatched =
    hasSkill("python");

  const sqlMatched =
    hasSkill("sql");

  const awsMatched =
    hasSkill("aws");

  const aiMatched =
    hasSkill("ai");

  const reactMatched =
    hasSkill("react");

  const firstSkills = [
    pythonMatched && "Python",
    sqlMatched && "SQL",
    awsMatched && "AWS",
    aiMatched && "AI",
  ].filter(
    (item): item is string =>
      Boolean(item)
  );

  const secondSkills = [
    pythonMatched && "Python",
    sqlMatched && "SQL",
    aiMatched && "AI",
  ].filter(
    (item): item is string =>
      Boolean(item)
  );

  const thirdSkills = [
    reactMatched && "React",
    hasSkill("typescript") &&
      "TypeScript",
    awsMatched && "AWS",
  ].filter(
    (item): item is string =>
      Boolean(item)
  );

  return [
    {
      id: 1,
      title:
        form.keyword.trim() ||
        "Python Backend Engineer",
      company: "Sakura Tech株式会社",
      location:
        form.prefecture === "不限"
          ? "东京 / 涩谷"
          : `${form.prefecture} / Hybrid`,
      salary:
        form.salary
          ? `¥${Number(
              form.salary
            ).toLocaleString()}～ / 月`
          : "¥600,000～¥800,000 / 月",
      employmentType:
        employmentLabel(
          form.employmentType
        ),
      workStyle:
        workStyleLabel(
          form.workStyle
        ),
      matchScore:
        Math.min(
          96,
          78 +
            firstSkills.length * 4
        ),
      matchedSkills:
        firstSkills.length
          ? firstSkills
          : ["开发经验", "IT基础"],
      missingSkills: [
        !awsMatched && "AWS",
        !hasSkill("docker") &&
          "Docker",
      ].filter(
        (item): item is string =>
          Boolean(item)
      ),
      reasons: [
        "你的主要技术方向与职位要求接近。",
        form.japaneseLevel ===
          "n2" ||
        form.japaneseLevel ===
          "n1" ||
        form.japaneseLevel ===
          "business"
          ? "日语水平基本满足团队沟通要求。"
          : "技术条件匹配度较高。",
        form.workStyle ===
          "hybrid"
          ? "工作方式与你希望的 Hybrid 条件一致。"
          : "工作方式与当前筛选条件基本一致。",
      ],
      caution:
        "正式应聘前建议再次确认实际项目内容、加班情况、远程比例以及具体薪资条件。",
    },
    {
      id: 2,
      title:
        "Data / ETL Engineer",
      company:
        "Next Data株式会社",
      location:
        form.prefecture === "不限"
          ? "东京 / 品川"
          : form.prefecture,
      salary:
        "¥550,000～¥750,000 / 月",
      employmentType: "正社员",
      workStyle: "Hybrid",
      matchScore:
        Math.min(
          92,
          72 +
            secondSkills.length * 5
        ),
      matchedSkills:
        secondSkills.length
          ? secondSkills
          : ["数据处理"],
      missingSkills: [
        !hasSkill("spark") &&
          "Apache Spark",
        !awsMatched && "AWS",
      ].filter(
        (item): item is string =>
          Boolean(item)
      ),
      reasons: [
        "职位重点是数据加工和ETL，与Python/SQL经验关联度较高。",
        "有自动化或AI使用经验会成为加分项。",
        "适合希望继续往数据工程方向发展的求职者。",
      ],
      caution:
        "部分项目可能需要较多SQL和云平台经验，需要确认实际技术栈。",
    },
    {
      id: 3,
      title:
        "Web Application Engineer",
      company:
        "Mirai Systems株式会社",
      location: "神奈川 / 横滨",
      salary:
        "¥500,000～¥700,000 / 月",
      employmentType: "契约",
      workStyle: "Remote 可商谈",
      matchScore:
        Math.min(
          86,
          68 +
            thirdSkills.length * 5
        ),
      matchedSkills:
        thirdSkills.length
          ? thirdSkills
          : ["Web开发"],
      missingSkills: [
        !reactMatched && "React",
        !hasSkill("typescript") &&
          "TypeScript",
      ].filter(
        (item): item is string =>
          Boolean(item)
      ),
      reasons: [
        "你的开发经验可以迁移到Web应用开发。",
        "如果具备前端经验，匹配度会进一步提高。",
        "工作方式相对灵活。",
      ],
      caution:
        "与前两个职位相比，这个职位更偏Web全栈，需要确认前端开发比例。",
    },
  ];
}

function employmentLabel(
  value: EmploymentType
) {
  if (value === "fulltime") {
    return "正社员";
  }

  if (value === "contract") {
    return "契约";
  }

  if (value === "dispatch") {
    return "派遣";
  }

  return "雇用形式不限";
}

function workStyleLabel(
  value: WorkStyle
) {
  if (value === "onsite") {
    return "出社";
  }

  if (value === "hybrid") {
    return "Hybrid";
  }

  if (value === "remote") {
    return "Remote";
  }

  return "工作方式可商谈";
}

const inputClass = `
  min-h-12
  w-full
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-[16px]
  font-semibold
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-indigo-400
  focus:ring-4
  focus:ring-indigo-50
`;

const textareaClass = `
  w-full
  resize-y
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  text-[16px]
  font-medium
  leading-7
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  focus:border-indigo-400
  focus:ring-4
  focus:ring-indigo-50
`;

const selectClass = `
  min-h-12
  w-full
  appearance-none
  rounded-xl
  border
  border-slate-200
  bg-white
  px-4
  py-3
  pr-10
  text-[16px]
  font-bold
  text-slate-800
  outline-none
  transition
  focus:border-indigo-400
  focus:ring-4
  focus:ring-indigo-50
`;