import Link from "next/link";
import Container from "@/components/layout/Container";

const schoolTypes = [
  {
    title: "大学",
    subtitle: "大学・大学院",
    description: "本科、大学院以及研究方向",
    icon: "🎓",
    href: "/schools/university",
    color: "blue",
  },
  {
    title: "专门学校",
    subtitle: "IT・设计・护理・商务",
    description: "职业技能与就业导向",
    icon: "🛠️",
    href: "/schools/vocational",
    color: "violet",
  },
  {
    title: "语言学校",
    subtitle: "日语・升学・留学",
    description: "日本语学习与升学准备",
    icon: "🇯🇵",
    href: "/schools/language",
    color: "emerald",
  },
];

const regions = [
  { name: "东京", count: "128+" },
  { name: "大阪", count: "86+" },
  { name: "京都", count: "53+" },
  { name: "北海道", count: "42+" },
  { name: "名古屋", count: "61+" },
  { name: "福冈", count: "47+" },
  { name: "神户", count: "38+" },
  { name: "横滨", count: "45+" },
];

const majors = [
  {
    name: "IT / AI",
    icon: "💻",
    description: "程序开发、人工智能、数据科学",
  },
  {
    name: "护理・医疗",
    icon: "🏥",
    description: "护理、医疗、福祉相关专业",
  },
  {
    name: "设计・动漫",
    icon: "🎨",
    description: "UI/UX、平面、动漫、游戏",
  },
  {
    name: "商务・经营",
    icon: "💼",
    description: "经营、国际商务、市场营销",
  },
  {
    name: "机械・汽车",
    icon: "🔧",
    description: "机械、汽车、制造相关专业",
  },
  {
    name: "餐饮・酒店",
    icon: "🍳",
    description: "料理、烘焙、酒店、餐饮",
  },
];

const warnings = [
  {
    level: "red",
    title: "学校收费与宣传存在差异",
    description: "申请前建议确认全部费用以及退款规则。",
    date: "2026-08-08",
  },
  {
    level: "orange",
    title: "部分学校招生条件发生变化",
    description: "2026年度招生要求已经更新。",
    date: "2026-08-06",
  },
  {
    level: "yellow",
    title: "留学生就业支持需要重点确认",
    description: "部分学校实际就业支持与宣传存在差异。",
    date: "2026-08-03",
  },
];

const topSchools = [
  {
    name: "东京○○大学",
    type: "大学",
    location: "东京",
    rating: "4.7",
    foreigner: "4.8",
    risk: "低风险",
  },
  {
    name: "○○IT专门学校",
    type: "专门学校",
    location: "东京",
    rating: "4.6",
    foreigner: "4.9",
    risk: "低风险",
  },
  {
    name: "○○日本语学校",
    type: "语言学校",
    location: "东京",
    rating: "4.5",
    foreigner: "4.8",
    risk: "低风险",
  },
];

export default function SchoolsPage() {
  return (
    <main className="bg-slate-50 pb-24">

      {/* =========================================================
          Hero
      ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        {/* Background */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_85%_70%,rgba(16,185,129,0.16),transparent_35%)]" />

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <Container>

          <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-24">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              🏫 日本学校中心
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              在日本，
              <span className="text-blue-400">
                找到真正适合你的学校
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              学校搜索、AI 智能推荐、专业匹配、学校评分、
              外国人友好度，以及最重要的真实避坑信息。
            </p>

            {/* Search */}

            <div className="mx-auto mt-10 max-w-3xl">

              <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row">

                <div className="flex min-w-0 flex-1 items-center">

                  <span className="px-4 text-xl">
                    🔍
                  </span>

                  <input
                    type="text"
                    placeholder="搜索学校、专业、地区..."
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-2
                      py-4
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                    "
                  />

                </div>

                <button
                  className="
                    rounded-xl
                    bg-blue-600
                    px-8
                    py-4
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  搜索学校
                </button>

              </div>

            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">

              <span>✓ 官方信息</span>
              <span>✓ 学校评分</span>
              <span>✓ 外国人友好度</span>
              <span>✓ 避坑信息</span>

            </div>

          </div>

        </Container>

      </section>


      {/* =========================================================
          School Types
      ========================================================= */}

      <section className="relative -mt-8 z-10">

        <Container>

          <div className="grid gap-4 px-4 md:grid-cols-3">

            {schoolTypes.map((school) => (

              <Link
                key={school.title}
                href={school.href}
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-lg
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      text-2xl
                      ${
                        school.color === "blue"
                          ? "bg-blue-50"
                          : school.color === "violet"
                            ? "bg-violet-50"
                            : "bg-emerald-50"
                      }
                    `}
                  >
                    {school.icon}
                  </div>

                  <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500">
                    →
                  </span>

                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {school.title}
                </h2>

                <p className="mt-1 text-sm font-medium text-blue-600">
                  {school.subtitle}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {school.description}
                </p>

              </Link>

            ))}

          </div>

        </Container>

      </section>


      {/* =========================================================
          AI Recommendation
      ========================================================= */}

      <section className="py-16">

        <Container>

          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl">

            <div className="relative p-8 sm:p-10 lg:p-14">

              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

                <div>

                  <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-blue-100">
                    AI SCHOOL MATCH
                  </div>

                  <h2 className="text-3xl font-bold sm:text-4xl">
                    不知道自己适合什么学校？
                  </h2>

                  <p className="mt-5 max-w-2xl leading-8 text-blue-100">
                    输入你的成绩、日语水平、想学习的专业以及希望就读的地区，
                    AI 会分析你的情况，并给出学校推荐与推荐理由。
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-blue-100">

                    <span className="rounded-full bg-white/10 px-4 py-2">
                      成绩分析
                    </span>

                    <span className="rounded-full bg-white/10 px-4 py-2">
                      专业匹配
                    </span>

                    <span className="rounded-full bg-white/10 px-4 py-2">
                      学校推荐
                    </span>

                    <span className="rounded-full bg-white/10 px-4 py-2">
                      推荐理由
                    </span>

                  </div>

                </div>

                <Link
                  href="/schools/recommend"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    px-8
                    py-4
                    font-semibold
                    text-blue-700
                    shadow-lg
                    transition
                    hover:bg-blue-50
                  "
                >
                  开始 AI 分析 →
                </Link>

              </div>

            </div>

          </div>

        </Container>

      </section>


      {/* =========================================================
          Regions
      ========================================================= */}

      <section className="pb-16">

        <Container>

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-slate-900">
              🗾 按地区找学校
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              查看日本各地区的大学、专门学校以及语言学校
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

            {regions.map((region) => (

              <Link
                key={region.name}
                href={`/schools/region/${encodeURIComponent(region.name)}`}
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  transition
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:shadow-lg
                "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {region.name}
                    </h3>

                    <p className="mt-2 text-xs text-slate-500">
                      {region.count} 所学校
                    </p>

                  </div>

                  <span className="text-slate-300 transition group-hover:text-blue-500">
                    →
                  </span>

                </div>

              </Link>

            ))}

          </div>

        </Container>

      </section>


      {/* =========================================================
          Majors
      ========================================================= */}

      <section className="bg-white py-16">

        <Container>

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-slate-900">
              🎓 按专业找学校
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              已经知道自己想学什么？直接从专业开始。
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {majors.map((major) => (

              <Link
                key={major.name}
                href={`/schools/major/${encodeURIComponent(major.name)}`}
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  p-6
                  transition
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:shadow-lg
                "
              >

                <div className="flex items-start justify-between">

                  <div className="text-3xl">
                    {major.icon}
                  </div>

                  <span className="text-slate-300 transition group-hover:text-blue-500">
                    →
                  </span>

                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {major.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {major.description}
                </p>

              </Link>

            ))}

          </div>

        </Container>

      </section>


      {/* =========================================================
          Scam
      ========================================================= */}

      <section className="py-16">

        <Container>

          <div className="mb-8 flex items-end justify-between">

            <div>

              <div className="mb-2 text-sm font-semibold text-red-500">
                IMPORTANT
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                🚨 学校避坑
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                申请学校之前，先看看别人踩过什么坑。
              </p>

            </div>

            <Link
              href="/scam"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              查看全部 →
            </Link>

          </div>

          <div className="grid gap-4">

            {warnings.map((warning) => (

              <div
                key={warning.title}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  transition
                  hover:shadow-md
                "
              >

                <div className="flex items-start gap-4">

                  <div
                    className={`
                      mt-1
                      h-3
                      w-3
                      shrink-0
                      rounded-full
                      ${
                        warning.level === "red"
                          ? "bg-red-500"
                          : warning.level === "orange"
                            ? "bg-orange-500"
                            : "bg-yellow-400"
                      }
                    `}
                  />

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <h3 className="font-semibold text-slate-900">
                        {warning.title}
                      </h3>

                      <span className="text-xs text-slate-400">
                        {warning.date}
                      </span>

                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {warning.description}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </Container>

      </section>


      {/* =========================================================
          Top Schools
      ========================================================= */}

      <section className="bg-white py-16">

        <Container>

          <div className="mb-8">

            <h2 className="text-2xl font-bold text-slate-900">
              ⭐ 值得关注的学校
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              综合学校评分、外国人友好度以及信息透明度
            </p>

          </div>

          <div className="grid gap-5 lg:grid-cols-3">

            {topSchools.map((school) => (

              <Link
                key={school.name}
                href="/schools/1"
                className="
                  group
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  transition
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <span className="text-xs font-medium text-blue-600">
                      {school.type}
                    </span>

                    <h3 className="mt-2 text-lg font-bold text-slate-900">
                      {school.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      📍 {school.location}
                    </p>

                  </div>

                  <div className="shrink-0 text-lg font-bold text-amber-500">
                    ⭐ {school.rating}
                  </div>

                </div>

                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      外国人友好度
                    </span>

                    <span className="font-semibold text-slate-800">
                      ⭐ {school.foreigner}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      避坑状态
                    </span>

                    <span className="font-semibold text-emerald-600">
                      🟢 {school.risk}
                    </span>

                  </div>

                </div>

                <div className="mt-5 text-sm font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                  查看学校详情 →
                </div>

              </Link>

            ))}

          </div>

        </Container>

      </section>


      {/* =========================================================
          Bottom CTA
      ========================================================= */}

      <section className="py-16">

        <Container>

          <div className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-12 text-center sm:px-10">

            <div className="text-3xl">
              🏫
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              还不知道从哪里开始？
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              告诉我们你想学习什么、想去哪里以及目前的成绩，
              AI 学校匹配会帮你找到更适合你的方向。
            </p>

            <Link
              href="/schools/recommend"
              className="
                mt-6
                inline-flex
                rounded-xl
                bg-blue-600
                px-7
                py-3.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-blue-700
              "
            >
              开始 AI 学校匹配
            </Link>

          </div>

        </Container>

      </section>

    </main>
  );
}