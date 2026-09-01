"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  FileText,
  Home,
  Info,
  MessageSquareWarning,
  ShieldCheck,
} from "lucide-react";

import Container from "@/components/layout/Container";

type PublishType = "house" | "job" | "experience" | "scam";

interface PublishOption {
  type: PublishType;
  title: string;
  description: string;
  detail: string;
  href: string;
  iconClass: string;
  borderClass: string;
  hoverClass: string;
}

/*
|--------------------------------------------------------------------------
| 通用发布入口
|--------------------------------------------------------------------------
|
| 这个页面本身不发送发布请求。
|
| 用户选择发布类型后进入对应发布表单：
|
| /houses/new
| /jobs/new
| /experience/new
| /scam/new
|
| 真正的 POST API 会放在各自的发布表单中：
|
| TODO [API - POST] POST /api/houses
| TODO [API - POST] POST /api/jobs
| TODO [API - POST] POST /api/experiences
| TODO [API - POST] POST /api/scams
|
|--------------------------------------------------------------------------
*/

const publishOptions: PublishOption[] = [
  {
    type: "house",
    title: "发布房源",
    description: "发布出租、合租、短租等日本房源信息。",
    detail:
      "填写租金、户型、地区、房屋条件、图片以及联系方式。",
    href: "/houses/new",
    iconClass: "bg-blue-50 text-blue-600",
    borderClass: "border-blue-100",
    hoverClass:
      "hover:border-blue-300 hover:shadow-blue-100/60",
  },
  {
    type: "job",
    title: "发布工作",
    description: "发布正社员、契约、派遣、兼职等招聘信息。",
    detail:
      "填写公司、职位、薪资、工作地点、招聘条件以及联系方式。",
    href: "/jobs/new",
    iconClass: "bg-violet-50 text-violet-600",
    borderClass: "border-violet-100",
    hoverClass:
      "hover:border-violet-300 hover:shadow-violet-100/60",
  },
  {
    type: "experience",
    title: "分享经验",
    description: "分享在日本生活、留学、工作等真实经验。",
    detail:
      "可以发布生活攻略、办事经验、求职经验、留学经验等内容。",
    href: "/experience/new",
    iconClass: "bg-emerald-50 text-emerald-600",
    borderClass: "border-emerald-100",
    hoverClass:
      "hover:border-emerald-300 hover:shadow-emerald-100/60",
  },
  {
    type: "scam",
    title: "提交避坑报告",
    description: "提交消费纠纷、风险事件以及相关证据资料。",
    detail:
      "避坑内容不会直接公开，需要经过事实描述和证据资料审核。",
    href: "/scam/new",
    iconClass: "bg-rose-50 text-rose-600",
    borderClass: "border-rose-100",
    hoverClass:
      "hover:border-rose-300 hover:shadow-rose-100/60",
  },
];

export default function PublishPage() {
  const searchParams = useSearchParams();

  const requestedType = getPublishType(
    searchParams.get("type")
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* TOP */}
      {/* ================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <Container>
          <div className="px-4 py-5">
            <Link
              href="/account"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-bold
                text-slate-500
                transition
                hover:text-slate-900
              "
            >
              <ArrowLeft size={16} />
              返回个人中心
            </Link>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="
            pointer-events-none
            absolute
            -left-32
            -top-32
            h-[420px]
            w-[420px]
            rounded-full
            bg-blue-600/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            right-0
            h-[420px]
            w-[420px]
            rounded-full
            bg-violet-600/10
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        <Container>
          <div className="relative px-4 py-12 sm:py-16">
            <div className="max-w-3xl">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
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
                <FileText size={14} />
                PUBLISH CENTER
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
                你想发布什么？
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
                选择内容类型后填写详细信息。
                发布的信息需要真实、准确，
                部分内容经过审核后才会公开显示。
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="py-8 sm:py-10">
        <Container>
          <div className="px-4">
            {/* Requested type notice */}

            {requestedType && (
              <div
                className="
                  mb-6
                  flex
                  items-start
                  gap-3
                  rounded-[20px]
                  border
                  border-blue-100
                  bg-blue-50
                  p-4
                "
              >
                <Info
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-blue-600
                  "
                />

                <div>
                  <p
                    className="
                      text-sm
                      font-black
                      text-blue-900
                    "
                  >
                    已为你选择：
                    {getPublishTypeLabel(requestedType)}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-blue-700/70
                    "
                  >
                    点击下方高亮的发布类型即可进入填写页面。
                  </p>
                </div>
              </div>
            )}

            {/* Header */}

            <div>
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-blue-600
                "
              >
                SELECT TYPE
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-black
                  text-slate-950
                "
              >
                选择发布类型
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                房源、工作、经验和避坑使用不同的发布表单。
              </p>
            </div>

            {/* ================================================= */}
            {/* OPTIONS */}
            {/* ================================================= */}

            <div
              className="
                mt-6
                grid
                gap-5
                md:grid-cols-2
              "
            >
              {publishOptions.map((option) => {
                const selected =
                  requestedType === option.type;

                return (
                  <PublishCard
                    key={option.type}
                    option={option}
                    selected={selected}
                  />
                );
              })}
            </div>

            {/* ================================================= */}
            {/* RULES */}
            {/* ================================================= */}

            <div
              className="
                mt-10
                grid
                gap-5
                lg:grid-cols-2
              "
            >
              {/* General rules */}

              <div
                className="
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-slate-100
                      text-slate-700
                    "
                  >
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <h3
                      className="
                        font-black
                        text-slate-950
                      "
                    >
                      发布基本规则
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-slate-500
                      "
                    >
                      所有用户发布内容都需要遵守
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    space-y-3
                    text-sm
                    leading-6
                    text-slate-600
                  "
                >
                  <RuleItem>
                    发布的信息应尽量真实、准确、完整。
                  </RuleItem>

                  <RuleItem>
                    不得冒充他人、伪造资料或故意发布虚假信息。
                  </RuleItem>

                  <RuleItem>
                    不得公开与事件无关的身份证、住址、
                    银行账户等个人隐私信息。
                  </RuleItem>

                  <RuleItem>
                    用户只能编辑和管理自己发布的内容。
                  </RuleItem>
                </div>
              </div>

              {/* Scam rules */}

              <div
                className="
                  rounded-[24px]
                  border
                  border-rose-100
                  bg-rose-50
                  p-6
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-rose-600
                      shadow-sm
                    "
                  >
                    <MessageSquareWarning size={19} />
                  </div>

                  <div>
                    <h3
                      className="
                        font-black
                        text-rose-950
                      "
                    >
                      避坑报告特别规则
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-rose-700/70
                      "
                    >
                      避坑内容采用更严格的审核方式
                    </p>
                  </div>
                </div>

                <div
                  className="
                    mt-5
                    space-y-3
                    text-sm
                    leading-6
                    text-rose-900/75
                  "
                >
                  <RuleItem>
                    尽量描述能够验证的事件经过，
                    不使用辱骂或情绪化定性。
                  </RuleItem>

                  <RuleItem>
                    涉及公司、中介或个人争议时，
                    需要提供能够支持描述的相关资料。
                  </RuleItem>

                  <RuleItem>
                    上传的原始证据默认用于管理员审核，
                    不代表会原样向公众展示。
                  </RuleItem>

                  <RuleItem>
                    未经核实的内容不会直接公开。
                  </RuleItem>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* STATUS FLOW */}
            {/* ================================================= */}

            <div
              className="
                mt-10
                rounded-[24px]
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <Building2 size={19} />
                </div>

                <div>
                  <h3 className="font-black text-slate-950">
                    内容发布流程
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    后续可以在「我的发布」中查看状态
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-6
                  grid
                  gap-3
                  md:grid-cols-4
                "
              >
                <FlowStep
                  number="01"
                  title="填写内容"
                  description="填写发布信息"
                />

                <FlowStep
                  number="02"
                  title="提交审核"
                  description="进入审核队列"
                />

                <FlowStep
                  number="03"
                  title="审核结果"
                  description="通过或要求修改"
                />

                <FlowStep
                  number="04"
                  title="公开显示"
                  description="发布到 Sakura"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/* ================================================= */
/* PUBLISH CARD */
/* ================================================= */

function PublishCard({
  option,
  selected,
}: {
  option: PublishOption;
  selected: boolean;
}) {
  return (
    <Link
      href={option.href}
      className={`
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        bg-white
        p-6
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-lg
        ${option.borderClass}
        ${option.hoverClass}
        ${
          selected
            ? "ring-2 ring-blue-500 ring-offset-2"
            : ""
        }
      `}
    >
      {selected && (
        <div
          className="
            absolute
            right-4
            top-4
            rounded-full
            bg-blue-600
            px-3
            py-1
            text-[11px]
            font-black
            text-white
          "
        >
          已选择
        </div>
      )}

      <div
        className={`
          flex
          h-13
          w-13
          items-center
          justify-center
          rounded-2xl
          ${option.iconClass}
        `}
      >
        {option.type === "house" && (
          <Home size={22} />
        )}

        {option.type === "job" && (
          <BriefcaseBusiness size={22} />
        )}

        {option.type === "experience" && (
          <FileText size={22} />
        )}

        {option.type === "scam" && (
          <MessageSquareWarning size={22} />
        )}
      </div>

      <h3
        className="
          mt-6
          text-xl
          font-black
          text-slate-950
        "
      >
        {option.title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          font-semibold
          leading-6
          text-slate-600
        "
      >
        {option.description}
      </p>

      <p
        className="
          mt-3
          max-w-xl
          text-xs
          leading-5
          text-slate-400
        "
      >
        {option.detail}
      </p>

      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          pt-5
        "
      >
        <span
          className="
            text-sm
            font-black
            text-slate-700
            transition
            group-hover:text-blue-600
          "
        >
          开始填写
        </span>

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-slate-100
            text-slate-500
            transition
            group-hover:translate-x-1
            group-hover:bg-blue-600
            group-hover:text-white
          "
        >
          <ArrowRight size={17} />
        </div>
      </div>
    </Link>
  );
}

/* ================================================= */
/* RULE ITEM */
/* ================================================= */

function RuleItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="
          mt-[9px]
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-current
          opacity-50
        "
      />

      <p>{children}</p>
    </div>
  );
}

/* ================================================= */
/* FLOW */
/* ================================================= */

function FlowStep({
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
        rounded-[18px]
        border
        border-slate-100
        bg-slate-50
        p-4
      "
    >
      <div
        className="
          text-xs
          font-black
          tracking-[0.12em]
          text-blue-600
        "
      >
        {number}
      </div>

      <h4
        className="
          mt-3
          text-sm
          font-black
          text-slate-900
        "
      >
        {title}
      </h4>

      <p
        className="
          mt-1
          text-xs
          text-slate-500
        "
      >
        {description}
      </p>
    </div>
  );
}

/* ================================================= */
/* HELPERS */
/* ================================================= */

function getPublishType(
  value: string | null
): PublishType | null {
  if (
    value === "house" ||
    value === "job" ||
    value === "experience" ||
    value === "scam"
  ) {
    return value;
  }

  return null;
}

function getPublishTypeLabel(
  type: PublishType
) {
  if (type === "house") {
    return "发布房源";
  }

  if (type === "job") {
    return "发布工作";
  }

  if (type === "experience") {
    return "分享经验";
  }

  return "提交避坑报告";
}