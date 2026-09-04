"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  FileSearch,
  FileText,
  GraduationCap,
  Languages,
  ShieldAlert,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import Container from "@/components/layout/Container";

type ToolStatus = "available" | "coming";

interface AiTool {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  status: ToolStatus;
  icon:
    | "resume"
    | "job"
    | "school"
    | "document"
    | "safety"
    | "language";
}

const tools: AiTool[] = [
  {
    id: "resume",
    title: "履历书 AI",
    description:
      "根据你的经历整理日文履历书、职务经历书，并帮助优化表达。",
    category: "求职",
    href: "/ai-tools/resume",
    status: "available",
    icon: "resume",
  },
  {
    id: "job",
    title: "工作匹配 AI",
    description:
      "根据技能、日语水平、经验和期望条件，帮助筛选更适合的工作。",
    category: "求职",
    href: "/ai-tools/job-match",
    status: "available",
    icon: "job",
  },
  {
    id: "school",
    title: "学校推荐 AI",
    description:
      "输入学历、成绩、专业方向和地区偏好，整理适合申请的学校。",
    category: "升学",
    href: "/ai-tools/school",
    status: "available",
    icon: "school",
  },
  {
    id: "document",
    title: "日文文件助手",
    description:
      "帮助理解通知书、合同、学校文件等常见日文材料，并整理重点。",
    category: "生活",
    href: "/ai-tools/document",
    status: "available",
    icon: "document",
  },
  {
    id: "safety",
    title: "风险信息助手",
    description:
      "辅助识别招聘、租房、消费信息中的异常点，并提供核实方向。",
    category: "安全",
    href: "/ai-tools/safety",
    status: "available",
    icon: "safety",
  },
  {
    id: "language",
    title: "日语表达助手",
    description:
      "帮助修改邮件、客服回复、面试表达和日常日语，让表达更自然。",
    category: "语言",
    href: "/ai-tools/language",
    status: "available",
    icon: "language",
  },
];

export default function AiToolsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-[-180px]
            h-[460px]
            w-[460px]
            -translate-x-1/2
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
            top-20
            h-[300px]
            w-[300px]
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
              py-16
              sm:py-20
              lg:py-24
            "
          >
            <div className="mx-auto max-w-4xl text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  text-cyan-300
                  shadow-2xl
                  shadow-cyan-950/20
                "
              >
                <Bot size={23} />
              </div>

              <div
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  px-3
                  py-1.5
                  text-[11px]
                  font-black
                  tracking-[0.12em]
                  text-slate-300
                "
              >
                <Sparkles size={13} />
                SAKURA AI
              </div>

              <h1
                className="
                  mt-5
                  text-3xl
                  font-black
                  tracking-tight
                  text-white
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                在日本生活，
                <span className="text-cyan-300">
                  少走一点弯路
                </span>
              </h1>

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-2xl
                  text-sm
                  font-medium
                  leading-7
                  text-slate-400
                  sm:text-base
                  sm:leading-8
                "
              >
                Sakura AI
                会逐步提供求职、升学、日语、文件理解和风险识别等工具。
                不追求堆很多聊天机器人，而是解决在日生活中真正麻烦的事情。
              </p>

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-2
                "
              >
                <HeroTag>求职</HeroTag>
                <HeroTag>升学</HeroTag>
                <HeroTag>日语</HeroTag>
                <HeroTag>生活</HeroTag>
                <HeroTag>安全</HeroTag>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* TOOLS */}

      <section className="py-10 sm:py-14 lg:py-16">
        <Container>
          <div className="px-4">
            <div
              className="
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
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-indigo-600
                  "
                >
                  AI TOOLS
                </p>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-950
                    sm:text-3xl
                  "
                >
                  Sakura AI 工具
                </h2>

                <p
                  className="
                    mt-2
                    max-w-xl
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  每个工具都会围绕一个明确场景设计，
                  后续逐个开放。
                </p>
              </div>

              <div
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-slate-100
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-slate-500
                "
              >
                <WandSparkles size={14} />
                6 个工具规划中
              </div>
            </div>

            <div
              className="
                mt-8
                grid
                gap-4
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* PRINCIPLE */}

      <section className="pb-14 sm:pb-16">
        <Container>
          <div className="px-4">
            <div
              className="
                overflow-hidden
                rounded-[28px]
                bg-slate-950
                p-6
                sm:p-8
                lg:p-10
              "
            >
              <div
                className="
                  grid
                  gap-8
                  lg:grid-cols-[1fr_1.2fr]
                  lg:items-center
                "
              >
                <div>
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
                    <Sparkles size={20} />
                  </div>

                  <h2
                    className="
                      mt-5
                      text-2xl
                      font-black
                      text-white
                    "
                  >
                    AI 是助手，不替你做最终判断
                  </h2>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-slate-400
                    "
                  >
                    学校申请、合同、招聘、消费纠纷等信息可能涉及重要决定。
                    Sakura AI
                    的作用是整理、解释、发现异常和提供下一步方向。
                  </p>
                </div>

                <div
                  className="
                    grid
                    gap-3
                    sm:grid-cols-3
                  "
                >
                  <PrincipleCard
                    number="01"
                    title="解释"
                    description="把复杂信息整理成人能快速理解的内容。"
                  />

                  <PrincipleCard
                    number="02"
                    title="辅助"
                    description="根据条件提供方向，而不是假装替你决定。"
                  />

                  <PrincipleCard
                    number="03"
                    title="核实"
                    description="重要事项继续引导用户确认官方或专业来源。"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function ToolCard({
  tool,
}: {
  tool: AiTool;
}) {
  const available =
    tool.status === "available";

  return (
    <article
      className="
        group
        flex
        min-h-[260px]
        flex-col
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        sm:p-6
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-3">
        <ToolIcon type={tool.icon} />

        <span
          className={`
            rounded-full
            px-2.5
            py-1.5
            text-[10px]
            font-black
            ${
              available
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }
          `}
        >
          {available
            ? "可使用"
            : "即将开放"}
        </span>
      </div>

      <div className="mt-5">
        <span
          className="
            text-[10px]
            font-black
            tracking-[0.12em]
            text-indigo-600
          "
        >
          {tool.category}
        </span>

        <h3
          className="
            mt-2
            text-lg
            font-black
            text-slate-950
          "
        >
          {tool.title}
        </h3>

        <p
          className="
            mt-3
            text-sm
            leading-6
            text-slate-500
          "
        >
          {tool.description}
        </p>
      </div>

      <div className="mt-auto pt-6">
        {available ? (
          <Link
            href={tool.href}
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-between
              rounded-xl
              bg-slate-950
              px-4
              py-3
              text-sm
              font-black
              text-white
              transition
              hover:bg-indigo-600
            "
          >
            开始使用
            <ArrowRight size={16} />
          </Link>
        ) : (
          <div
            className="
              flex
              min-h-11
              w-full
              items-center
              justify-between
              rounded-xl
              bg-slate-50
              px-4
              py-3
              text-sm
              font-black
              text-slate-400
            "
          >
            开发中
            <ArrowRight size={16} />
          </div>
        )}
      </div>
    </article>
  );
}

function ToolIcon({
  type,
}: {
  type: AiTool["icon"];
}) {
  const className =
    "flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-cyan-300";

  if (type === "resume") {
    return (
      <div className={className}>
        <FileText size={20} />
      </div>
    );
  }

  if (type === "job") {
    return (
      <div className={className}>
        <BriefcaseBusiness size={20} />
      </div>
    );
  }

  if (type === "school") {
    return (
      <div className={className}>
        <GraduationCap size={20} />
      </div>
    );
  }

  if (type === "document") {
    return (
      <div className={className}>
        <FileSearch size={20} />
      </div>
    );
  }

  if (type === "safety") {
    return (
      <div className={className}>
        <ShieldAlert size={20} />
      </div>
    );
  }

  return (
    <div className={className}>
      <Languages size={20} />
    </div>
  );
}

function HeroTag({
  children,
}: {
  children: string;
}) {
  return (
    <span
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
      "
    >
      {children}
    </span>
  );
}

function PrincipleCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-4
      "
    >
      <span
        className="
          text-[10px]
          font-black
          tracking-[0.14em]
          text-cyan-300
        "
      >
        {number}
      </span>

      <p
        className="
          mt-2
          text-sm
          font-black
          text-white
        "
      >
        {title}
      </p>

      <p
        className="
          mt-2
          text-xs
          leading-5
          text-slate-400
        "
      >
        {description}
      </p>
    </div>
  );
}