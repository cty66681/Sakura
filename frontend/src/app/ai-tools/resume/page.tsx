"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  FileText,
  GraduationCap,
  Languages,
  Loader2,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  UserRound,
  WandSparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

type ResumeType =
  | "resume"
  | "career"
  | "both";

type JapaneseLevel =
  | "none"
  | "n5"
  | "n4"
  | "n3"
  | "n2"
  | "n1"
  | "business";

type Tone =
  | "standard"
  | "professional"
  | "simple";

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ResumeForm {
  name: string;
  age: string;
  location: string;
  education: string;
  major: string;
  japaneseLevel: JapaneseLevel;
  targetPosition: string;
  skills: string;
  selfIntroduction: string;
  resumeType: ResumeType;
  tone: Tone;
}

interface ResumeResult {
  headline: string;
  profile: string;
  careerSummary: string;
  skills: string[];
  selfPr: string;
  motivation: string;
}

const initialForm: ResumeForm = {
  name: "",
  age: "",
  location: "",
  education: "",
  major: "",
  japaneseLevel: "n2",
  targetPosition: "",
  skills: "",
  selfIntroduction: "",
  resumeType: "both",
  tone: "standard",
};

const japaneseLevels: {
  value: JapaneseLevel;
  label: string;
}[] = [
  {
    value: "none",
    label: "未填写",
  },
  {
    value: "n5",
    label: "JLPT N5",
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
  {
    value: "business",
    label: "商务日语",
  },
];

const resumeTypes: {
  value: ResumeType;
  label: string;
  description: string;
}[] = [
  {
    value: "resume",
    label: "履历书",
    description:
      "整理个人资料、志望动机和自我介绍",
  },
  {
    value: "career",
    label: "职务经历书",
    description:
      "重点整理工作经历、技能和项目经验",
  },
  {
    value: "both",
    label: "两者都要",
    description:
      "同时生成履历书和职务经历书所需内容",
  },
];

const toneOptions: {
  value: Tone;
  label: string;
}[] = [
  {
    value: "standard",
    label: "标准",
  },
  {
    value: "professional",
    label: "专业",
  },
  {
    value: "simple",
    label: "简洁",
  },
];

function createWorkExperience(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export default function ResumeAiPage() {
  const [form, setForm] =
    useState<ResumeForm>(initialForm);

  const [experiences, setExperiences] =
    useState<WorkExperience[]>([
      createWorkExperience(),
    ]);

  const [result, setResult] =
    useState<ResumeResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [copiedSection, setCopiedSection] =
    useState("");

  const canGenerate = useMemo(() => {
    const hasExperience =
      experiences.some(
        (item) =>
          item.company.trim() ||
          item.position.trim() ||
          item.description.trim()
      );

    return (
      form.targetPosition.trim().length >= 2 &&
      (form.skills.trim().length >= 2 ||
        hasExperience)
    );
  }, [
    experiences,
    form.skills,
    form.targetPosition,
  ]);

  function updateForm<K extends keyof ResumeForm>(
    key: K,
    value: ResumeForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError("");
  }

  function updateExperience<K extends keyof WorkExperience>(
    id: string,
    key: K,
    value: WorkExperience[K]
  ) {
    setExperiences((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );

    setError("");
  }

  function addExperience() {
    setExperiences((current) => [
      ...current,
      createWorkExperience(),
    ]);
  }

  function removeExperience(id: string) {
    setExperiences((current) => {
      if (current.length === 1) {
        return [
          createWorkExperience(),
        ];
      }

      return current.filter(
        (item) => item.id !== id
      );
    });
  }

  function loadExample() {
    setForm({
      name: "王小明",
      age: "30",
      location: "东京",
      education: "IT专门学校毕业",
      major: "信息处理",
      japaneseLevel: "n2",
      targetPosition:
        "Python 后端开发工程师",
      skills:
        "Python, FastAPI, SQL, ETL, AWS, Git, AI, 数据处理",
      selfIntroduction:
        "希望突出在日本工作的经验，以及使用Python和AI进行业务自动化、数据处理和效率改善的能力。",
      resumeType: "both",
      tone: "professional",
    });

    setExperiences([
      {
        id: crypto.randomUUID(),
        company: "ABC株式会社",
        position: "系统工程师",
        startDate: "2022-04",
        endDate: "",
        current: true,
        description:
          "负责不动产相关系统的数据处理和ETL开发。主要使用Python进行数据加工、自动化处理，并使用AI辅助业务效率改善。也负责SQL数据确认、错误调查和相关测试工作。",
      },
      {
        id: crypto.randomUUID(),
        company: "XYZ株式会社",
        position: "程序开发",
        startDate: "2020-04",
        endDate: "2022-03",
        current: false,
        description:
          "参与公司内部系统开发和维护，负责Python程序修改、数据处理、测试以及问题调查。",
      },
    ]);

    setResult(null);
    setError("");
  }

  function resetAll() {
    setForm(initialForm);
    setExperiences([
      createWorkExperience(),
    ]);
    setResult(null);
    setError("");
    setCopiedSection("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!canGenerate) {
      setError(
        "请至少填写希望职位，以及技能或一段工作经历。"
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      // TODO [API - POST]
      // POST /api/ai/resume
      // Purpose: generate Japanese resume / career-history content.
      //
      // Request:
      // {
      //   profile: form,
      //   experiences
      // }
      //
      // Backend requirements:
      // - validate request schema and input length
      // - rate-limit AI requests
      // - never expose AI provider keys to browser
      // - avoid unnecessary storage of personal information
      // - return structured JSON

      await new Promise((resolve) => {
        window.setTimeout(
          resolve,
          850
        );
      });

      setResult(
        createMockResult(
          form,
          experiences
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

  async function copyText(
    key: string,
    text: string
  ) {
    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopiedSection(key);

      window.setTimeout(() => {
        setCopiedSection("");
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
            left-[-120px]
            top-[-140px]
            h-[400px]
            w-[400px]
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
            top-[-80px]
            h-[340px]
            w-[340px]
            rounded-full
            bg-cyan-400/10
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
                    <FileText size={21} />
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
                      Resume Assistant
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
                  履历书 AI
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
                  把你的经历和技能告诉 Sakura AI，
                  帮你整理成更适合日本求职使用的日文履历书、
                  职务经历书内容。
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
                中文输入也可以
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
                {/* DOCUMENT TYPE */}

                <FormSection
                  icon={
                    <FileText size={18} />
                  }
                  title="想生成什么？"
                  description="选择这次需要整理的求职材料。"
                >
                  <div
                    className="
                      grid
                      gap-3
                      md:grid-cols-3
                    "
                  >
                    {resumeTypes.map(
                      (item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() =>
                            updateForm(
                              "resumeType",
                              item.value
                            )
                          }
                          className={`
                            min-h-[112px]
                            rounded-2xl
                            border
                            p-4
                            text-left
                            transition
                            ${
                              form.resumeType ===
                              item.value
                                ? "border-indigo-300 bg-indigo-50 ring-4 ring-indigo-50"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                            }
                          `}
                        >
                          <p
                            className="
                              text-sm
                              font-black
                              text-slate-950
                            "
                          >
                            {item.label}
                          </p>

                          <p
                            className="
                              mt-2
                              text-xs
                              leading-5
                              text-slate-500
                            "
                          >
                            {
                              item.description
                            }
                          </p>
                        </button>
                      )
                    )}
                  </div>
                </FormSection>

                {/* BASIC INFO */}

                <FormSection
                  icon={
                    <UserRound size={18} />
                  }
                  title="基本资料"
                  description="这里只填写生成内容需要的信息，不需要输入住址、身份证件等敏感资料。"
                >
                  <div
                    className="
                      grid
                      gap-4
                      sm:grid-cols-2
                    "
                  >
                    <Field
                      label="姓名"
                      optional
                    >
                      <input
                        value={form.name}
                        autoComplete="name"
                        placeholder="例如：王小明"
                        onChange={(event) =>
                          updateForm(
                            "name",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field
                      label="年龄"
                      optional
                    >
                      <input
                        value={form.age}
                        inputMode="numeric"
                        placeholder="例如：30"
                        onChange={(event) =>
                          updateForm(
                            "age",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field
                      label="目前所在地区"
                      optional
                    >
                      <input
                        value={
                          form.location
                        }
                        placeholder="例如：东京"
                        onChange={(event) =>
                          updateForm(
                            "location",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
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

                    <Field
                      label="最终学历"
                      optional
                    >
                      <input
                        value={
                          form.education
                        }
                        placeholder="例如：IT专门学校毕业"
                        onChange={(event) =>
                          updateForm(
                            "education",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field
                      label="专业"
                      optional
                    >
                      <input
                        value={form.major}
                        placeholder="例如：信息处理"
                        onChange={(event) =>
                          updateForm(
                            "major",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>
                  </div>
                </FormSection>

                {/* TARGET */}

                <FormSection
                  icon={
                    <BriefcaseBusiness
                      size={18}
                    />
                  }
                  title="求职方向"
                  description="告诉 AI 你准备应聘什么工作。"
                >
                  <div className="space-y-5">
                    <Field
                      label="希望职位"
                      required
                    >
                      <input
                        value={
                          form.targetPosition
                        }
                        placeholder="例如：Python 后端开发工程师"
                        onChange={(event) =>
                          updateForm(
                            "targetPosition",
                            event.target.value
                          )
                        }
                        className={
                          inputClass
                        }
                      />
                    </Field>

                    <Field
                      label="技能"
                      hint="使用逗号分隔即可"
                    >
                      <textarea
                        value={form.skills}
                        rows={4}
                        placeholder="例如：Python, SQL, FastAPI, AWS, Git, ETL, AI"
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
                  </div>
                </FormSection>

                {/* WORK EXPERIENCE */}

                <FormSection
                  icon={
                    <BriefcaseBusiness
                      size={18}
                    />
                  }
                  title="工作经历"
                  description="可以直接用中文写做过什么，后面由 AI 帮你整理成日文。"
                  action={
                    <button
                      type="button"
                      onClick={addExperience}
                      className="
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-xs
                        font-black
                        text-slate-700
                        transition
                        hover:bg-slate-50
                      "
                    >
                      <Plus size={14} />
                      添加经历
                    </button>
                  }
                >
                  <div className="space-y-4">
                    {experiences.map(
                      (experience, index) => (
                        <ExperienceEditor
                          key={
                            experience.id
                          }
                          index={index}
                          experience={
                            experience
                          }
                          onChange={
                            updateExperience
                          }
                          onRemove={() =>
                            removeExperience(
                              experience.id
                            )
                          }
                        />
                      )
                    )}
                  </div>
                </FormSection>

                {/* SELF PR */}

                <FormSection
                  icon={
                    <Sparkles size={18} />
                  }
                  title="希望 AI 强调的内容"
                  description="不用写成完整日语，只需要告诉 AI 你想突出什么。"
                >
                  <Field
                    label="补充说明"
                    optional
                    hint={`${form.selfIntroduction.length}/1000`}
                  >
                    <textarea
                      value={
                        form.selfIntroduction
                      }
                      maxLength={1000}
                      rows={6}
                      placeholder="例如：希望突出我在日本长期工作的经验、沟通能力，以及使用Python和AI改善工作效率的经验。"
                      onChange={(event) =>
                        updateForm(
                          "selfIntroduction",
                          event.target.value
                        )
                      }
                      className={
                        textareaClass
                      }
                    />
                  </Field>
                </FormSection>

                {/* TONE */}

                <FormSection
                  icon={
                    <Languages size={18} />
                  }
                  title="日文风格"
                  description="根据应聘职位选择输出风格。"
                >
                  <div
                    className="
                      grid
                      grid-cols-3
                      gap-2
                    "
                  >
                    {toneOptions.map(
                      (item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() =>
                            updateForm(
                              "tone",
                              item.value
                            )
                          }
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
                              form.tone ===
                              item.value
                                ? "border-slate-950 bg-slate-950 text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }
                          `}
                        >
                          {item.label}
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
                        正在整理...
                      </>
                    ) : (
                      <>
                        <WandSparkles
                          size={17}
                        />
                        AI 整理履历书
                      </>
                    )}
                  </button>
                </div>

                {/* RESULT */}

                {result && (
                  <ResumeResultView
                    result={result}
                    copiedSection={
                      copiedSection
                    }
                    onCopy={copyText}
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
                      当前内容
                    </h2>
                  </div>

                  <div className="mt-4 space-y-3">
                    <InfoRow
                      label="目标"
                      value={
                        form.targetPosition ||
                        "未填写"
                      }
                    />

                    <InfoRow
                      label="工作经历"
                      value={`${experiences.length} 段`}
                    />

                    <InfoRow
                      label="技能"
                      value={
                        parseSkills(
                          form.skills
                        ).length
                          ? `${parseSkills(form.skills).length} 项`
                          : "未填写"
                      }
                    />

                    <InfoRow
                      label="输出"
                      value={
                        resumeTypes.find(
                          (item) =>
                            item.value ===
                            form.resumeType
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
                    不需要先会写日文履历书
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-indigo-900/75
                    "
                  >
                    工作内容可以直接用中文描述。
                    正式接入 AI 后，会根据日本求职材料常用结构重新整理，
                    而不是简单逐句翻译。
                  </p>
                </div>

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
                    AI 不应该编造经历
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      leading-6
                      text-slate-400
                    "
                  >
                    后端接入模型时，我们会要求 AI
                    只优化用户提供的事实，不虚构公司、项目、技能、
                    工作年限或资格证书。
                  </p>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {/* MOBILE ACTION BAR */}

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
              <FileText size={14} />
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
                  正在整理...
                </>
              ) : (
                <>
                  <WandSparkles
                    size={16}
                  />
                  AI 整理履历书
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
  action,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
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

        {action}
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  optional,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
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

          {required && (
            <span
              className="
                text-[10px]
                font-black
                text-rose-500
              "
            >
              必填
            </span>
          )}

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

function ExperienceEditor({
  index,
  experience,
  onChange,
  onRemove,
}: {
  index: number;
  experience: WorkExperience;
  onChange: <
    K extends keyof WorkExperience,
  >(
    id: string,
    key: K,
    value: WorkExperience[K]
  ) => void;
  onRemove: () => void;
}) {
  function handleCurrent(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const checked =
      event.target.checked;

    onChange(
      experience.id,
      "current",
      checked
    );

    if (checked) {
      onChange(
        experience.id,
        "endDate",
        ""
      );
    }
  }

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50/60
        p-4
        sm:p-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              bg-slate-950
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
              font-black
              text-slate-900
            "
          >
            工作经历
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-slate-400
            transition
            hover:bg-rose-50
            hover:text-rose-600
          "
          aria-label="删除工作经历"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div
        className="
          mt-5
          grid
          gap-4
          sm:grid-cols-2
        "
      >
        <Field
          label="公司名称"
          optional
        >
          <input
            value={
              experience.company
            }
            placeholder="例如：ABC株式会社"
            onChange={(event) =>
              onChange(
                experience.id,
                "company",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field
          label="职位"
          optional
        >
          <input
            value={
              experience.position
            }
            placeholder="例如：系统工程师"
            onChange={(event) =>
              onChange(
                experience.id,
                "position",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field
          label="开始时间"
          optional
        >
          <input
            type="month"
            value={
              experience.startDate
            }
            onChange={(event) =>
              onChange(
                experience.id,
                "startDate",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field
          label="结束时间"
          optional
        >
          <input
            type="month"
            value={
              experience.endDate
            }
            disabled={
              experience.current
            }
            onChange={(event) =>
              onChange(
                experience.id,
                "endDate",
                event.target.value
              )
            }
            className={`
              ${inputClass}
              disabled:cursor-not-allowed
              disabled:bg-slate-100
              disabled:text-slate-400
            `}
          />
        </Field>
      </div>

      <label
        className="
          mt-4
          flex
          min-h-11
          cursor-pointer
          items-center
          gap-2
          text-xs
          font-bold
          text-slate-600
        "
      >
        <input
          type="checkbox"
          checked={
            experience.current
          }
          onChange={handleCurrent}
          className="
            h-4
            w-4
            rounded
            border-slate-300
          "
        />

        目前仍在这家公司工作
      </label>

      <div className="mt-4">
        <Field
          label="主要工作内容"
          hint={`${experience.description.length}/1500`}
        >
          <textarea
            value={
              experience.description
            }
            maxLength={1500}
            rows={6}
            placeholder="直接用中文写即可。例如：负责Python数据处理、ETL开发、SQL数据确认、测试和AI自动化改善。"
            onChange={(event) =>
              onChange(
                experience.id,
                "description",
                event.target.value
              )
            }
            className={
              textareaClass
            }
          />
        </Field>
      </div>
    </div>
  );
}

function ResumeResultView({
  result,
  copiedSection,
  onCopy,
}: {
  result: ResumeResult;
  copiedSection: string;
  onCopy: (
    key: string,
    text: string
  ) => Promise<void>;
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
                tracking-[0.14em]
                text-indigo-600
              "
            >
              AI RESULT
            </p>

            <h2
              className="
                mt-0.5
                text-lg
                font-black
                text-slate-950
              "
            >
              履历内容整理结果
            </h2>
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
        <ResultBlock
          title="职业标题"
          text={result.headline}
          copied={
            copiedSection ===
            "headline"
          }
          onCopy={() =>
            void onCopy(
              "headline",
              result.headline
            )
          }
        />

        <ResultBlock
          title="个人概要"
          text={result.profile}
          copied={
            copiedSection ===
            "profile"
          }
          onCopy={() =>
            void onCopy(
              "profile",
              result.profile
            )
          }
        />

        <ResultBlock
          title="職務要約"
          text={
            result.careerSummary
          }
          copied={
            copiedSection ===
            "career"
          }
          onCopy={() =>
            void onCopy(
              "career",
              result.careerSummary
            )
          }
        />

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            p-4
            sm:p-5
          "
        >
          <p
            className="
              text-xs
              font-black
              text-slate-900
            "
          >
            活かせる経験・スキル
          </p>

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >
            {result.skills.map(
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

        <ResultBlock
          title="自己PR"
          text={result.selfPr}
          copied={
            copiedSection ===
            "selfPr"
          }
          onCopy={() =>
            void onCopy(
              "selfPr",
              result.selfPr
            )
          }
        />

        <ResultBlock
          title="志望動機"
          text={
            result.motivation
          }
          copied={
            copiedSection ===
            "motivation"
          }
          onCopy={() =>
            void onCopy(
              "motivation",
              result.motivation
            )
          }
        />

        <div
          className="
            rounded-2xl
            bg-amber-50
            p-4
          "
        >
          <p
            className="
              text-xs
              leading-6
              text-amber-900
            "
          >
            AI
            生成内容提交给企业前，请再次确认公司名称、
            工作时间、技能、项目经验等事实是否准确。
          </p>
        </div>
      </div>
    </section>
  );
}

function ResultBlock({
  title,
  text,
  copied,
  onCopy,
}: {
  title: string;
  text: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
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
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-xs
            font-black
            text-slate-900
          "
        >
          {title}
        </p>

        <button
          type="button"
          onClick={onCopy}
          className="
            inline-flex
            min-h-10
            items-center
            gap-1.5
            rounded-xl
            px-3
            text-xs
            font-black
            text-slate-500
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

      <p
        className="
          mt-3
          whitespace-pre-wrap
          text-[15px]
          font-medium
          leading-7
          text-slate-700
        "
      >
        {text}
      </p>
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

function parseSkills(
  value: string
) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createMockResult(
  form: ResumeForm,
  experiences: WorkExperience[]
): ResumeResult {
  const skills =
    parseSkills(form.skills);

  const usefulSkills =
    skills.length > 0
      ? skills
      : [
          "業務改善",
          "コミュニケーション",
        ];

  const activeExperience =
    experiences.find(
      (item) =>
        item.description.trim() ||
        item.position.trim()
    );

  const experienceText =
    activeExperience?.description
      ? "Pythonを用いたデータ処理や業務自動化、システム開発などの実務経験があります。"
      : "これまでの業務経験を活かし、継続的にスキル向上に取り組んできました。";

  const japanese =
    japaneseLevels.find(
      (item) =>
        item.value ===
        form.japaneseLevel
    )?.label;

  return {
    headline:
      form.targetPosition
        ? `${form.targetPosition}を志望するITエンジニア`
        : "ITエンジニア",

    profile:
      `${experienceText}${
        japanese &&
        form.japaneseLevel !==
          "none"
          ? ` 日本語レベルは${japanese}です。`
          : ""
      } ${
        form.location
          ? `現在は${form.location}を拠点としています。`
          : ""
      }`.trim(),

    careerSummary:
      "これまでシステム開発およびデータ処理関連の業務に携わってきました。特にPythonを活用したデータ加工、ETL処理、業務自動化などを経験しています。また、AIを活用した業務効率化にも取り組み、既存業務の改善を意識しながら開発を進めてきました。",

    skills: usefulSkills,

    selfPr:
      "私の強みは、業務内容を理解したうえで、技術を使って効率化につなげられる点です。Pythonによるデータ処理や自動化だけでなく、必要に応じてAIも活用しながら、作業時間の短縮や品質向上に取り組んできました。また、日本での業務経験を通じて、周囲と確認・共有しながら仕事を進めることを大切にしています。",

    motivation:
      `${form.targetPosition || "ITエンジニア"}として、これまで培ってきた開発経験やデータ処理の知識を活かし、より幅広い業務に貢献したいと考えています。これまでの経験を活かすだけでなく、新しい技術についても継続的に学び、業務改善やサービス品質の向上に貢献していきたいと考えております。`,
  };
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