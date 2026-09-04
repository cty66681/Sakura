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
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  GraduationCap,
  JapaneseYen,
  Languages,
  Loader2,
  MapPin,
  RotateCcw,
  School,
  Sparkles,
  Target,
  WandSparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

type SchoolType =
  | "all"
  | "language"
  | "university"
  | "college";

type JapaneseLevel =
  | "beginner"
  | "n4"
  | "n3"
  | "n2"
  | "n1";

type BudgetLevel =
  | "any"
  | "80"
  | "120"
  | "160"
  | "200";

type StudyGoal =
  | "employment"
  | "university"
  | "graduate"
  | "qualification"
  | "language";

interface RecommendForm {
  schoolType: SchoolType;
  prefecture: string;
  japaneseLevel: JapaneseLevel;
  budget: BudgetLevel;
  major: string;
  goal: StudyGoal;
  ejuScore: string;
  jlptScore: string;
  preference: string;
}

interface SchoolRecommendation {
  id: string;
  type: Exclude<SchoolType, "all">;
  name: string;
  location: string;
  category: string;
  tuition: string;
  matchScore: number;
  reasons: string[];
  requirements: string[];
  caution: string;
}

const initialForm: RecommendForm = {
  schoolType: "all",
  prefecture: "不限",
  japaneseLevel: "n2",
  budget: "any",
  major: "",
  goal: "employment",
  ejuScore: "",
  jlptScore: "",
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

const schoolTypes: {
  value: SchoolType;
  label: string;
  description: string;
}[] = [
  {
    value: "all",
    label: "全部",
    description: "让 AI 综合推荐",
  },
  {
    value: "language",
    label: "语言学校",
    description: "日语学习、升学准备",
  },
  {
    value: "university",
    label: "大学 / 大学院",
    description: "本科、修士、博士",
  },
  {
    value: "college",
    label: "专门学校",
    description: "IT、设计、商务等",
  },
];

const japaneseLevels: {
  value: JapaneseLevel;
  label: string;
}[] = [
  {
    value: "beginner",
    label: "初学 / 无等级",
  },
  {
    value: "n4",
    label: "JLPT N4",
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
];

const budgetOptions: {
  value: BudgetLevel;
  label: string;
}[] = [
  {
    value: "any",
    label: "不限",
  },
  {
    value: "80",
    label: "80万日元以内 / 年",
  },
  {
    value: "120",
    label: "120万日元以内 / 年",
  },
  {
    value: "160",
    label: "160万日元以内 / 年",
  },
  {
    value: "200",
    label: "200万日元以内 / 年",
  },
];

const goals: {
  value: StudyGoal;
  label: string;
}[] = [
  {
    value: "employment",
    label: "日本就业",
  },
  {
    value: "university",
    label: "考大学",
  },
  {
    value: "graduate",
    label: "考大学院",
  },
  {
    value: "qualification",
    label: "学习专业技能",
  },
  {
    value: "language",
    label: "提高日语",
  },
];

const popularMajors = [
  "IT・AI",
  "商务・经营",
  "艺术・设计",
  "医疗・福祉",
  "理工・技术",
];

export default function SchoolAiPage() {
  const [form, setForm] =
    useState<RecommendForm>(initialForm);

  const [results, setResults] =
    useState<SchoolRecommendation[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hasGenerated, setHasGenerated] =
    useState(false);

  const canGenerate = useMemo(
    () =>
      form.major.trim().length >= 2 ||
      form.goal === "language",
    [form.goal, form.major]
  );

  function updateForm<K extends keyof RecommendForm>(
    key: K,
    value: RecommendForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
  }

  function loadExample() {
    setForm({
      schoolType: "all",
      prefecture: "东京",
      japaneseLevel: "n2",
      budget: "160",
      major: "IT・AI",
      goal: "employment",
      ejuScore: "520",
      jlptScore: "",
      preference:
        "希望毕业后在日本找IT工作，最好有就业支援，交通方便，不希望学费太贵。",
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
        "请填写希望学习的专业方向，或选择「提高日语」作为目标。"
      );
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setHasGenerated(false);

    try {
      // TODO [API - POST]
      // POST /api/ai/school
      // Purpose:
      // Recommend suitable Sakura school records based on
      // study goals, Japanese level, region, budget and scores.
      //
      // Backend requirements:
      // - only recommend schools existing in Sakura database
      // - use current admission-year requirements
      // - filter hard requirements before AI semantic ranking
      // - AI must not invent admission requirements or tuition
      // - return real school ID + type for detail-page routing
      // - never expose AI provider API keys to browser
      // - rate-limit recommendation requests

      await new Promise((resolve) => {
        window.setTimeout(resolve, 900);
      });

      setResults(
        createMockRecommendations(form)
      );

      setHasGenerated(true);
    } catch {
      setError(
        "推荐失败，请稍后重新尝试。"
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
                    <GraduationCap size={21} />
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
                      School Recommendation
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
                  学校推荐 AI
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
                  根据你的日语水平、专业方向、预算、
                  地区和升学目标，从 Sakura
                  收录的日本学校中寻找更适合你的选择。
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
                条件筛选 + AI 推荐
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
                {/* SCHOOL TYPE */}

                <FormSection
                  icon={<School size={18} />}
                  title="想找哪一类学校？"
                  description="不确定的话选择全部，让 AI 综合判断。"
                >
                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-3
                      md:grid-cols-4
                    "
                  >
                    {schoolTypes.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() =>
                          updateForm(
                            "schoolType",
                            item.value
                          )
                        }
                        className={`
                          min-h-[100px]
                          rounded-2xl
                          border
                          p-3
                          text-left
                          transition
                          ${
                            form.schoolType ===
                            item.value
                              ? "border-slate-950 bg-slate-950 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }
                        `}
                      >
                        <p className="text-xs font-black">
                          {item.label}
                        </p>

                        <p
                          className={`
                            mt-2
                            text-[10px]
                            leading-4
                            ${
                              form.schoolType ===
                              item.value
                                ? "text-slate-400"
                                : "text-slate-400"
                            }
                          `}
                        >
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </FormSection>

                {/* TARGET */}

                <FormSection
                  icon={<Target size={18} />}
                  title="学习目标"
                  description="告诉 AI 你去学校最主要想达到什么目标。"
                >
                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-2
                      sm:grid-cols-3
                    "
                  >
                    {goals.map((item) => (
                      <ChoiceButton
                        key={item.value}
                        active={
                          form.goal === item.value
                        }
                        onClick={() =>
                          updateForm(
                            "goal",
                            item.value
                          )
                        }
                      >
                        {item.label}
                      </ChoiceButton>
                    ))}
                  </div>
                </FormSection>

                {/* MAJOR */}

                <FormSection
                  icon={<BookOpen size={18} />}
                  title="专业方向"
                  description="可以自己输入，也可以直接选择常见方向。"
                >
                  <Field
                    label="希望学习的专业"
                    optional={
                      form.goal === "language"
                    }
                  >
                    <input
                      value={form.major}
                      placeholder="例如：IT・AI / 经营 / 设计 / 护理"
                      onChange={(event) =>
                        updateForm(
                          "major",
                          event.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    {popularMajors.map((major) => (
                      <button
                        key={major}
                        type="button"
                        onClick={() =>
                          updateForm(
                            "major",
                            major
                          )
                        }
                        className={`
                          min-h-10
                          rounded-full
                          border
                          px-3
                          text-xs
                          font-black
                          transition
                          ${
                            form.major === major
                              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }
                        `}
                      >
                        {major}
                      </button>
                    ))}
                  </div>
                </FormSection>

                {/* BASIC CONDITIONS */}

                <FormSection
                  icon={<GraduationCap size={18} />}
                  title="你的目前条件"
                  description="推荐时会结合日语水平、地区和预算。"
                >
                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    <Field label="目前日语水平">
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
                          className={selectClass}
                        >
                          {japaneseLevels.map(
                            (item) => (
                              <option
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </option>
                            )
                          )}
                        </select>
                      </SelectWrap>
                    </Field>

                    <Field label="希望地区">
                      <SelectWrap>
                        <select
                          value={form.prefecture}
                          onChange={(event) =>
                            updateForm(
                              "prefecture",
                              event.target.value
                            )
                          }
                          className={selectClass}
                        >
                          {prefectures.map(
                            (prefecture) => (
                              <option
                                key={prefecture}
                                value={prefecture}
                              >
                                {prefecture}
                              </option>
                            )
                          )}
                        </select>
                      </SelectWrap>
                    </Field>

                    <Field label="每年学费预算">
                      <SelectWrap>
                        <select
                          value={form.budget}
                          onChange={(event) =>
                            updateForm(
                              "budget",
                              event.target
                                .value as BudgetLevel
                            )
                          }
                          className={selectClass}
                        >
                          {budgetOptions.map(
                            (item) => (
                              <option
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </option>
                            )
                          )}
                        </select>
                      </SelectWrap>
                    </Field>

                    <Field
                      label="EJU 总分"
                      optional
                    >
                      <input
                        value={form.ejuScore}
                        inputMode="numeric"
                        placeholder="例如：520"
                        onChange={(event) =>
                          updateForm(
                            "ejuScore",
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field
                      label="JLPT 分数"
                      optional
                    >
                      <input
                        value={form.jlptScore}
                        inputMode="numeric"
                        placeholder="例如：130"
                        onChange={(event) =>
                          updateForm(
                            "jlptScore",
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* PREFERENCE */}

                <FormSection
                  icon={<Sparkles size={18} />}
                  title="还有什么要求？"
                  description="可以直接用中文说明，例如就业率、学校位置、升学指导、外国人支援等。"
                >
                  <Field
                    label="补充条件"
                    optional
                    hint={`${form.preference.length}/800`}
                  >
                    <textarea
                      value={form.preference}
                      maxLength={800}
                      rows={6}
                      placeholder="例如：毕业后想在日本做IT，希望学校有就业支援，外国人比较多，交通方便。"
                      onChange={(event) =>
                        updateForm(
                          "preference",
                          event.target.value
                        )
                      }
                      className={textareaClass}
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
                      <GraduationCap size={15} />
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
                        正在推荐...
                      </>
                    ) : (
                      <>
                        <WandSparkles size={17} />
                        AI 推荐学校
                      </>
                    )}
                  </button>
                </div>

                {hasGenerated && (
                  <RecommendationResults
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
                      当前推荐条件
                    </h2>
                  </div>

                  <div className="mt-4 space-y-3">
                    <InfoRow
                      label="学校类型"
                      value={
                        schoolTypes.find(
                          (item) =>
                            item.value ===
                            form.schoolType
                        )?.label ?? "-"
                      }
                    />

                    <InfoRow
                      label="目标"
                      value={
                        goals.find(
                          (item) =>
                            item.value ===
                            form.goal
                        )?.label ?? "-"
                      }
                    />

                    <InfoRow
                      label="专业"
                      value={
                        form.major ||
                        "未填写"
                      }
                    />

                    <InfoRow
                      label="地区"
                      value={form.prefecture}
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
                  <GraduationCap
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
                    招生条件会每年变化
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-indigo-900/75
                    "
                  >
                    正式版本会根据 Sakura
                    数据库中当前年度招生信息进行筛选。
                    最终申请前仍应确认学校最新募集要项。
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
                    AI 不编造学校
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
                    只负责分析 Sakura
                    已收录学校、招生要求和学费信息，
                    不生成不存在的学校或虚构入学条件。
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
              <GraduationCap size={14} />
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
                  正在推荐...
                </>
              ) : (
                <>
                  <WandSparkles size={16} />
                  AI 推荐学校
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
        <div className="flex items-center gap-1.5">
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

function RecommendationResults({
  results,
}: {
  results: SchoolRecommendation[];
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
        <School
          size={30}
          className="mx-auto text-slate-300"
        />

        <h2
          className="
            mt-4
            text-lg
            font-black
            text-slate-950
          "
        >
          暂时没有找到合适学校
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
          可以尝试放宽地区、预算或学校类型。
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
            AI RECOMMENDATION
          </p>

          <h2
            className="
              mt-1
              text-xl
              font-black
              text-slate-950
            "
          >
            推荐学校
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

      {results.map((school, index) => (
        <RecommendationCard
          key={`${school.type}-${school.id}`}
          school={school}
          index={index}
        />
      ))}
    </section>
  );
}

function RecommendationCard({
  school,
  index,
}: {
  school: SchoolRecommendation;
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

              <SchoolTypeBadge
                type={school.type}
              />
            </div>

            <h3
              className="
                mt-3
                text-lg
                font-black
                text-slate-950
                sm:text-xl
              "
            >
              {school.name}
            </h3>

            <p
              className="
                mt-1
                text-xs
                font-bold
                text-slate-400
              "
            >
              {school.category}
            </p>

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
                {school.location}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                "
              >
                <JapaneseYen size={13} />
                {school.tuition}
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
                {school.matchScore}
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
              <CheckCircle2 size={15} />
              推荐理由
            </p>

            <div className="mt-3 space-y-2">
              {school.reasons.map(
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
              bg-slate-50
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
                text-slate-900
              "
            >
              <GraduationCap size={15} />
              需要确认的条件
            </p>

            <div className="mt-3 space-y-2">
              {school.requirements.map(
                (requirement) => (
                  <p
                    key={requirement}
                    className="
                      text-xs
                      leading-5
                      text-slate-600
                    "
                  >
                    · {requirement}
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        <div
          className="
            mt-4
            rounded-2xl
            bg-amber-50
            p-4
          "
        >
          <p
            className="
              flex
              items-start
              gap-2
              text-xs
              leading-5
              text-amber-900
            "
          >
            <CircleAlert
              size={15}
              className="
                mt-0.5
                shrink-0
              "
            />

            {school.caution}
          </p>
        </div>
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
          href={getSchoolHref(
            school.type,
            school.id
          )}
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
          查看学校详情
          <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

function SchoolTypeBadge({
  type,
}: {
  type: Exclude<
    SchoolType,
    "all"
  >;
}) {
  if (type === "language") {
    return (
      <span
        className="
          rounded-full
          bg-emerald-50
          px-2.5
          py-1
          text-[10px]
          font-black
          text-emerald-700
        "
      >
        语言学校
      </span>
    );
  }

  if (type === "university") {
    return (
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
        大学 / 大学院
      </span>
    );
  }

  return (
    <span
      className="
        rounded-full
        bg-amber-50
        px-2.5
        py-1
        text-[10px]
        font-black
        text-amber-700
      "
    >
      专门学校
    </span>
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

function getSchoolHref(
  type: Exclude<SchoolType, "all">,
  id: string
) {
  if (type === "language") {
    return `/schools/language/${id}`;
  }

  if (type === "university") {
    return `/schools/university/${id}`;
  }

  return `/schools/college/${id}`;
}

function createMockRecommendations(
  form: RecommendForm
): SchoolRecommendation[] {
  const allResults: SchoolRecommendation[] = [
    {
      id: "tokyo",
      type: "university",
      name: "东京大学",
      location: "东京 / 文京区",
      category: "综合大学",
      tuition: "约 ¥535,800 / 年",
      matchScore:
        form.japaneseLevel === "n1"
          ? 91
          : 82,
      reasons: [
        "你的学习方向与大学理工・信息相关专业存在较高关联。",
        "适合希望继续进行高水平学术学习的申请者。",
        form.goal === "graduate"
          ? "与你希望进入大学院深造的目标一致。"
          : "学校教育资源和研究环境较强。",
      ],
      requirements: [
        "需要确认目标学部或研究科当年度募集要项。",
        "部分项目需要EJU、英语成绩或校内考试。",
        "大学院申请通常还需要研究计划和教授联系。",
      ],
      caution:
        "这是演示推荐。实际录取条件必须以学校当年度官方募集要项为准。",
    },
    {
      id: "waseda",
      type: "university",
      name: "早稻田大学",
      location: "东京 / 新宿区",
      category: "私立综合大学",
      tuition: "根据学部不同",
      matchScore: 86,
      reasons: [
        "位于东京，符合希望在首都圈学习和就业的方向。",
        "拥有较多专业选择和国际学生支援资源。",
        "毕业后在日本求职的选择范围较广。",
      ],
      requirements: [
        "不同学部的日语、EJU和英语要求差异较大。",
        "需要确认外国留学生入试方式。",
      ],
      caution:
        "学费和考试要求会因学部不同而变化，正式版会按具体专业继续筛选。",
    },
    {
      id: "tokyo-it",
      type: "college",
      name: "东京IT专门学校",
      location: "东京",
      category: "IT・AI・信息处理",
      tuition: "约 ¥1,200,000 / 年",
      matchScore: 94,
      reasons: [
        "专业方向与IT・AI高度匹配。",
        "适合以日本就业和实际技能学习为主要目标。",
        "相较大学路线，更强调职业技能和就业准备。",
      ],
      requirements: [
        "通常需要满足学校规定的日语能力要求。",
        "需要确认出席率、学历和留学生申请条件。",
      ],
      caution:
        "学校名称和招生数据当前为前端演示数据，后端接入后必须使用 Sakura 的真实学校记录。",
    },
    {
      id: "tokyo-language",
      type: "language",
      name: "东京国际日本语学院",
      location: "东京",
      category: "升学・日语强化",
      tuition: "约 ¥800,000 / 年",
      matchScore: 88,
      reasons: [
        "适合希望先提高日语能力再升学或就业的人。",
        "东京地区升学和求职资源较集中。",
        "可以作为进入大学或专门学校前的准备阶段。",
      ],
      requirements: [
        "需要确认当前招生期和签证相关条件。",
        "部分课程可能有最低日语水平要求。",
      ],
      caution:
        "语言学校选择应同时考虑出席管理、升学指导和课程内容，不能只看所在地。",
    },
  ];

  let filtered =
    form.schoolType === "all"
      ? allResults
      : allResults.filter(
          (item) =>
            item.type === form.schoolType
        );

  if (form.goal === "language") {
    filtered = [
      ...filtered.filter(
        (item) =>
          item.type === "language"
      ),
      ...filtered.filter(
        (item) =>
          item.type !== "language"
      ),
    ];
  }

  if (
    form.goal === "employment" &&
    form.major.includes("IT")
  ) {
    filtered = [
      ...filtered.filter(
        (item) =>
          item.type === "college"
      ),
      ...filtered.filter(
        (item) =>
          item.type !== "college"
      ),
    ];
  }

  return filtered.slice(0, 4);
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