"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleAlert,
  FileText,
  Heart,
  Home,
  Lightbulb,
  LogOut,
  MessageSquareWarning,
  PenLine,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import Container from "@/components/layout/Container";

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 当前登录用户
|
| GET /api/me
|
| 返回：
| {
|   id: string;
|   name: string;
|   email: string;
|   avatar?: string;
|   createdAt: string;
| }
|
| 当前阶段使用 Mock 用户。
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 当前用户发布内容统计
|
| GET /api/me/posts/summary
|
| 返回：
| {
|   total: number;
|   published: number;
|   pending: number;
|   draft: number;
|   rejected: number;
|   houses: number;
|   jobs: number;
|   experiences: number;
|   scams: number;
| }
|
|--------------------------------------------------------------------------
*/

const mockUser = {
  id: "user_001",
  name: "Sakura 用户",
  email: "user@example.com",
  createdAt: "2026-08-01",
};

const publishStats = {
  total: 7,
  published: 4,
  pending: 1,
  draft: 2,
  rejected: 0,

  houses: 3,
  jobs: 1,
  experiences: 2,
  scams: 1,
};

const publishModules = [
  {
    key: "house",
    title: "发布房源",
    description: "出租房、合租、短租等房源信息",
    href: "/account/publish?type=house",
    icon: Home,
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    key: "job",
    title: "发布工作",
    description: "招聘、兼职、正社员等工作信息",
    href: "/account/publish?type=job",
    icon: BriefcaseBusiness,
    iconClass: "bg-violet-50 text-violet-600",
  },
  {
    key: "experience",
    title: "发布经验",
    description: "分享在日本生活、留学、工作经验",
    href: "/account/publish?type=experience",
    icon: Lightbulb,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "scam",
    title: "提交避坑报告",
    description: "提交消费纠纷、风险信息及相关证据",
    href: "/account/publish?type=scam",
    icon: MessageSquareWarning,
    iconClass: "bg-rose-50 text-rose-600",
  },
];

const contentModules = [
  {
    title: "房源",
    count: publishStats.houses,
    href: "/account/posts?type=house",
    icon: Home,
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    title: "工作",
    count: publishStats.jobs,
    href: "/account/posts?type=job",
    icon: BriefcaseBusiness,
    iconClass: "bg-violet-50 text-violet-600",
  },
  {
    title: "经验",
    count: publishStats.experiences,
    href: "/account/posts?type=experience",
    icon: FileText,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "避坑",
    count: publishStats.scams,
    href: "/account/posts?type=scam",
    icon: ShieldCheck,
    iconClass: "bg-rose-50 text-rose-600",
  },
];

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-slate-950">
        <div
          className="
            pointer-events-none
            absolute
            -left-40
            -top-40
            h-[480px]
            w-[480px]
            rounded-full
            bg-blue-600/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
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
          <div className="relative px-4 py-10 sm:py-12">
            <div
              className="
                flex
                flex-col
                gap-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}

                <div
                  className="
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/10
                    text-white
                    shadow-xl
                  "
                >
                  <User size={28} />
                </div>

                <div>
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    <h1
                      className="
                        text-2xl
                        font-black
                        text-white
                        sm:text-3xl
                      "
                    >
                      {mockUser.name}
                    </h1>

                    <span
                      className="
                        rounded-full
                        border
                        border-emerald-400/20
                        bg-emerald-400/10
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        text-emerald-300
                      "
                    >
                      已登录
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {mockUser.email}
                  </p>
                </div>
              </div>

              <Link
                href="/account/settings"
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-slate-300
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <Settings size={17} />

                账号设置
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="py-8 sm:py-10">
        <Container>
          <div
            className="
              grid
              gap-8
              px-4
              lg:grid-cols-[230px_minmax(0,1fr)]
            "
          >
            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside className="h-fit lg:sticky lg:top-24">
              <div
                className="
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-slate-200
                  bg-white
                  p-3
                  shadow-sm
                "
              >
                <AccountNavItem
                  href="/account"
                  icon={User}
                  label="个人中心"
                  active
                />

                <AccountNavItem
                  href="/account/posts"
                  icon={FileText}
                  label="我的发布"
                />

                <AccountNavItem
                  href="/account/favorites"
                  icon={Heart}
                  label="我的收藏"
                />

                <AccountNavItem
                  href="/account/settings"
                  icon={Settings}
                  label="账号设置"
                />

                <div className="my-3 border-t border-slate-100" />

                <button
                  type="button"
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    text-sm
                    font-semibold
                    text-slate-500
                    transition
                    hover:bg-rose-50
                    hover:text-rose-600
                  "
                >
                  <LogOut size={18} />

                  退出登录
                </button>
              </div>

              <div
                className="
                  mt-4
                  rounded-[20px]
                  border
                  border-blue-100
                  bg-blue-50
                  p-4
                "
              >
                <div className="flex items-center gap-2 text-blue-700">
                  <ShieldCheck size={17} />

                  <span className="text-sm font-black">
                    发布规则
                  </span>
                </div>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-blue-700/70
                  "
                >
                  发布的信息需要真实、准确。
                  部分内容提交后需要经过审核才能公开显示。
                </p>
              </div>
            </aside>

            {/* ================================================= */}
            {/* MAIN */}
            {/* ================================================= */}

            <div className="min-w-0">
              {/* Welcome */}

              <div
                className="
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
                      tracking-[0.16em]
                      text-blue-600
                    "
                  >
                    ACCOUNT CENTER
                  </p>

                  <h2
                    className="
                      mt-2
                      text-2xl
                      font-black
                      text-slate-950
                      sm:text-3xl
                    "
                  >
                    个人中心
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-slate-500
                    "
                  >
                    管理你的发布、收藏和账号信息。
                  </p>
                </div>

                <Link
                  href="/account/publish"
                  className="
                    inline-flex
                    w-fit
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    py-3
                    text-sm
                    font-black
                    text-white
                    shadow-lg
                    shadow-blue-600/15
                    transition
                    hover:bg-blue-700
                  "
                >
                  <Plus size={18} />

                  发布新内容
                </Link>
              </div>

              {/* ================================================= */}
              {/* STATUS */}
              {/* ================================================= */}

              <div
                className="
                  mt-7
                  grid
                  grid-cols-2
                  gap-3
                  xl:grid-cols-5
                "
              >
                <StatusCard
                  label="全部发布"
                  value={publishStats.total}
                />

                <StatusCard
                  label="已发布"
                  value={publishStats.published}
                  status="published"
                />

                <StatusCard
                  label="审核中"
                  value={publishStats.pending}
                  status="pending"
                />

                <StatusCard
                  label="草稿"
                  value={publishStats.draft}
                  status="draft"
                />

                <StatusCard
                  label="未通过"
                  value={publishStats.rejected}
                  status="rejected"
                />
              </div>

              {/* ================================================= */}
              {/* MY CONTENT */}
              {/* ================================================= */}

              <section className="mt-10">
                <SectionHeader
                  title="我的发布"
                  description="查看和管理你发布过的内容"
                  href="/account/posts"
                />

                <div
                  className="
                    mt-5
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                  "
                >
                  {contentModules.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="
                          group
                          rounded-[22px]
                          border
                          border-slate-200
                          bg-white
                          p-5
                          shadow-sm
                          transition
                          hover:-translate-y-0.5
                          hover:border-slate-300
                          hover:shadow-md
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-4
                          "
                        >
                          <div
                            className={`
                              flex
                              h-11
                              w-11
                              items-center
                              justify-center
                              rounded-xl
                              ${item.iconClass}
                            `}
                          >
                            <Icon size={20} />
                          </div>

                          <ChevronRight
                            size={18}
                            className="
                              text-slate-300
                              transition
                              group-hover:translate-x-0.5
                              group-hover:text-slate-600
                            "
                          />
                        </div>

                        <div className="mt-6">
                          <div
                            className="
                              text-3xl
                              font-black
                              tracking-tight
                              text-slate-950
                            "
                          >
                            {item.count}
                          </div>

                          <p
                            className="
                              mt-1
                              text-sm
                              font-bold
                              text-slate-600
                            "
                          >
                            {item.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* ================================================= */}
              {/* PUBLISH */}
              {/* ================================================= */}

              <section className="mt-10">
                <SectionHeader
                  title="发布新内容"
                  description="选择你想发布的信息类型"
                />

                <div
                  className="
                    mt-5
                    grid
                    gap-4
                    md:grid-cols-2
                  "
                >
                  {publishModules.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        className="
                          group
                          flex
                          items-center
                          gap-4
                          rounded-[22px]
                          border
                          border-slate-200
                          bg-white
                          p-5
                          shadow-sm
                          transition
                          hover:-translate-y-0.5
                          hover:border-slate-300
                          hover:shadow-md
                        "
                      >
                        <div
                          className={`
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            ${item.iconClass}
                          `}
                        >
                          <Icon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3
                            className="
                              font-black
                              text-slate-900
                              transition
                              group-hover:text-blue-600
                            "
                          >
                            {item.title}
                          </h3>

                          <p
                            className="
                              mt-1
                              text-xs
                              leading-5
                              text-slate-500
                            "
                          >
                            {item.description}
                          </p>
                        </div>

                        <ArrowRight
                          size={18}
                          className="
                            shrink-0
                            text-slate-300
                            transition
                            group-hover:translate-x-1
                            group-hover:text-blue-600
                          "
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* ================================================= */}
              {/* QUICK ACTIONS */}
              {/* ================================================= */}

              <section className="mt-10">
                <SectionHeader
                  title="快捷管理"
                  description="管理账号中的其他内容"
                />

                <div
                  className="
                    mt-5
                    grid
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  <QuickAction
                    href="/account/posts"
                    icon={PenLine}
                    title="管理发布"
                    description="编辑、下架或删除已发布内容"
                  />

                  <QuickAction
                    href="/account/favorites"
                    icon={Bookmark}
                    title="我的收藏"
                    description="查看收藏的工作、房源和其他信息"
                  />

                  <QuickAction
                    href="/account/settings"
                    icon={Settings}
                    title="账号设置"
                    description="修改个人资料和账号设置"
                  />
                </div>
              </section>

              {/* ================================================= */}
              {/* REVIEW NOTICE */}
              {/* ================================================= */}

              <div
                className="
                  mt-10
                  rounded-[24px]
                  border
                  border-amber-200
                  bg-amber-50
                  p-5
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
                      bg-amber-100
                      text-amber-700
                    "
                  >
                    <CircleAlert size={19} />
                  </div>

                  <div>
                    <h3
                      className="
                        font-black
                        text-amber-950
                      "
                    >
                      关于内容审核
                    </h3>

                    <p
                      className="
                        mt-2
                        max-w-3xl
                        text-sm
                        leading-6
                        text-amber-900/70
                      "
                    >
                      房源、工作、经验和避坑内容可能需要经过审核后公开。
                      避坑报告需要提供能够支持事件经过的相关资料，
                      请勿发布无关个人信息、辱骂、威胁或未经证实的犯罪指控。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/* ================================================= */
/* COMPONENTS */
/* ================================================= */

function AccountNavItem({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        font-bold
        transition
        ${
          active
            ? "bg-slate-950 text-white"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
        }
      `}
    >
      <Icon size={18} />

      {label}
    </Link>
  );
}

function StatusCard({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status?:
    | "published"
    | "pending"
    | "draft"
    | "rejected";
}) {
  const styles = {
    published: "text-emerald-600",
    pending: "text-amber-600",
    draft: "text-slate-500",
    rejected: "text-rose-600",
  };

  return (
    <div
      className="
        rounded-[20px]
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div
        className={`
          text-2xl
          font-black
          tracking-tight
          ${
            status
              ? styles[status]
              : "text-slate-950"
          }
        `}
      >
        {value}
      </div>

      <p
        className="
          mt-1
          text-xs
          font-semibold
          text-slate-500
        "
      >
        {label}
      </p>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div
      className="
        flex
        items-end
        justify-between
        gap-4
      "
    >
      <div>
        <h2
          className="
            text-xl
            font-black
            text-slate-950
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          {description}
        </p>
      </div>

      {href && (
        <Link
          href={href}
          className="
            hidden
            items-center
            gap-1
            text-sm
            font-bold
            text-blue-600
            transition
            hover:text-blue-700
            sm:inline-flex
          "
        >
          查看全部

          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        items-start
        gap-4
        rounded-[20px]
        border
        border-slate-200
        bg-white
        p-5
        transition
        hover:border-slate-300
        hover:shadow-sm
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
          text-slate-600
          transition
          group-hover:bg-blue-50
          group-hover:text-blue-600
        "
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <h3
          className="
            text-sm
            font-black
            text-slate-900
          "
        >
          {title}
        </h3>

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
    </Link>
  );
}