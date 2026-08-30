import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  Search,
} from "lucide-react";

export default function UniversityNotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-50">
      <div
        className="
          mx-auto
          flex
          max-w-3xl
          flex-col
          items-center
          justify-center
          px-6
          py-32
          text-center
        "
      >
        {/* Icon */}

        <div
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-3xl
            bg-blue-50
            text-blue-600
          "
        >
          <GraduationCap size={38} />
        </div>

        {/* Title */}

        <div
          className="
            mt-8
            text-sm
            font-bold
            tracking-[0.2em]
            text-blue-600
          "
        >
          404 · UNIVERSITY NOT FOUND
        </div>

        <h1
          className="
            mt-4
            text-3xl
            font-black
            tracking-tight
            text-slate-900
            md:text-4xl
          "
        >
          没有找到这所大学
        </h1>

        <p
          className="
            mt-5
            max-w-xl
            text-sm
            leading-7
            text-slate-500
            md:text-base
          "
        >
          这所学校可能已经下架、链接发生变化，
          或者当前学校 ID 不存在。
        </p>

        {/* Actions */}

        <div
          className="
            mt-9
            flex
            flex-wrap
            items-center
            justify-center
            gap-3
          "
        >
          <Link
            href="/schools/university"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-6
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-blue-700
              active:scale-[0.98]
            "
          >
            <Search size={17} />

            重新查找大学
          </Link>

          <Link
            href="/schools"
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-6
              py-3
              text-sm
              font-bold
              text-slate-600
              transition
              hover:border-blue-200
              hover:text-blue-600
            "
          >
            <ArrowLeft size={17} />

            返回学校中心
          </Link>
        </div>
      </div>
    </main>
  );
}