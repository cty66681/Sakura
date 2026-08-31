import Link from "next/link";

import {
  ArrowLeft,
  GraduationCap,
  Search,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function CollegeNotFound() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute -left-24 top-0 h-[360px] w-[360px] rounded-full bg-orange-500/10 blur-3xl" />

          <div className="absolute right-0 top-20 h-[320px] w-[320px] rounded-full bg-amber-400/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(249,115,22,0.10),transparent_35%)]" />
        </div>

        <Container>
          <div className="relative flex min-h-[520px] flex-col items-center justify-center py-20 text-center">
            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-3xl
                border
                border-orange-400/20
                bg-orange-400/10
                text-orange-300
              "
            >
              <GraduationCap size={38} />
            </div>

            <p className="mt-8 text-sm font-black tracking-[0.25em] text-orange-400">
              404 · COLLEGE NOT FOUND
            </p>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              没有找到这所专门学校
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              这所学校可能已经下架、链接地址有误，
              或者当前还没有收录到 Sakura
              的专门学校数据库中。
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/schools/college"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-orange-500
                  px-6
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-orange-600
                "
              >
                <Search size={18} />

                查找专门学校
              </Link>

              <Link
                href="/schools"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-6
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-white/10
                "
              >
                <ArrowLeft size={18} />

                返回学校中心
              </Link>
            </div>

            <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
              <InfoCard
                number="01"
                title="检查链接"
                description="确认学校详情页地址中的学校 ID 是否正确。"
              />

              <InfoCard
                number="02"
                title="重新搜索"
                description="返回专门学校列表，通过地区、专业或关键词重新查找。"
              />

              <InfoCard
                number="03"
                title="查看其他学校"
                description="也可以继续浏览语言学校或大学・大学院。"
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function InfoCard({
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
        p-5
        text-left
        backdrop-blur
      "
    >
      <p className="text-xs font-black tracking-widest text-orange-400">
        {number}
      </p>

      <h2 className="mt-3 font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 text-xs leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}