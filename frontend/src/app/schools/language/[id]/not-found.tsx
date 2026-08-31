import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Search,
} from "lucide-react";

import Container from "@/components/layout/Container";

export default function LanguageSchoolNotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-50 py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-emerald-100
              text-emerald-600
            "
          >
            <GraduationCap size={38} />
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            School Not Found
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            没有找到这所语言学校
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-8 text-slate-500">
            这所学校可能已经下架、链接发生变化，
            或者当前学校编号不存在。
            你可以返回语言学校列表重新查找。
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/schools/language"
              className="
                inline-flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-600
                px-6
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-emerald-700
              "
            >
              <Search size={17} />

              查找语言学校
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
                border-slate-200
                bg-white
                px-6
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:border-emerald-300
                hover:text-emerald-700
              "
            >
              <ArrowLeft size={17} />

              返回学校中心
            </Link>
          </div>

          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 text-left">
            <p className="text-sm font-bold text-slate-900">
              找不到学校？
            </p>

            <p className="mt-2 text-sm leading-7 text-slate-500">
              可以尝试使用学校名称、所在地区或学校类型重新搜索。
              Sakura 后续接入正式学校数据库后，
              学校新增、下架和资料变更也会统一由后台管理。
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}