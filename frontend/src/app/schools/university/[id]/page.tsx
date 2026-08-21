import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  GraduationCap,
  Globe,
  Star,
  Landmark,
  Coins,
  ArrowLeft,
} from "lucide-react";

export default function UniversityDetailPage() {
  return (
    <main className="bg-slate-50 min-h-screen">

      {/* Hero */}

      <section className="relative h-[460px] overflow-hidden">

        <Image
          src="/images/university/university01.jpg"
          alt="东京大学"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <div className="absolute left-0 right-0 bottom-0">

          <div className="mx-auto max-w-7xl px-6 pb-12">

            <Link
              href="/schools/university"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6"
            >
              <ArrowLeft size={18} />
              返回大学列表
            </Link>

            <div className="flex items-end justify-between">

              <div>

                <span className="rounded-full bg-blue-600 px-4 py-1 text-white text-sm">
                  国立大学
                </span>

                <h1 className="mt-5 text-6xl font-black text-white">
                  东京大学
                </h1>

                <div className="mt-6 flex flex-wrap gap-6 text-white/90">

                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    东京 · 文京区
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe size={18} />
                    QS 28
                  </div>

                  <div className="flex items-center gap-2">
                    <Star size={18} />
                    偏差值 72
                  </div>

                </div>

              </div>

              <button
                className="
                  rounded-2xl
                  bg-blue-600
                  px-8
                  py-4
                  text-lg
                  font-bold
                  text-white
                  hover:bg-blue-700
                "
              >
                收藏学校
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* 内容 */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid grid-cols-[1fr_360px] gap-8">

          {/* 左侧 */}

          <div className="space-y-8">

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-bold">
                学校介绍
              </h2>

              <p className="mt-6 leading-9 text-slate-600">
                东京大学（The University of Tokyo）是日本最高学府，
                创立于1877年，也是亚洲最具影响力的大学之一。
                在科研、医学、工程、理学等领域拥有世界领先水平。
              </p>

            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-bold">
                热门专业
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">

                {[
                  "计算机",
                  "人工智能",
                  "经济学",
                  "医学",
                  "建筑",
                  "法学",
                  "机械工程",
                ].map((item) => (
                  <span
                    key={item}
                    className="
                      rounded-full
                      bg-blue-50
                      px-4
                      py-2
                      text-blue-600
                    "
                  >
                    {item}
                  </span>
                ))}

              </div>

            </div>

          </div>

          {/* 右侧 */}

          <div className="space-y-6">

            <div className="rounded-3xl bg-white p-8 shadow-sm">

              <h3 className="text-xl font-bold">
                基本信息
              </h3>

              <div className="mt-6 space-y-5">

                <Info
                  icon={<GraduationCap size={18} />}
                  title="学校性质"
                  value="国立大学"
                />

                <Info
                  icon={<Landmark size={18} />}
                  title="大学院"
                  value="支持"
                />

                <Info
                  icon={<Coins size={18} />}
                  title="学费"
                  value="535,800円 / 年"
                />

                <Info
                  icon={<Globe size={18} />}
                  title="EJU"
                  value="需要"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function Info({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        {icon}

        <span>{title}</span>

      </div>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  );
}