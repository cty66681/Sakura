"use client";

import { Search, X } from "lucide-react";

import Container from "@/components/layout/Container";

type Props = {
  keywordInput: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export default function UniversityHero({
  keywordInput,
  onKeywordChange,
  onSearch,
  onClear,
}: Props) {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-blue-950
        via-slate-950
        to-slate-900
      "
    >
      {/* Background */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_right,#2563eb30,transparent_45%)]
        "
      />

      <Container>
        <div
          className="
            relative
            z-10
            py-24
            text-center
          "
        >
          {/* Badge */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-blue-400/30
              bg-blue-500/10
              px-5
              py-2
              text-sm
              font-semibold
              text-blue-300
            "
          >
            🎓 日本大学
          </div>

          {/* Title */}

          <h1
            className="
              mt-8
              text-5xl
              font-black
              tracking-tight
              text-white
              md:text-6xl
            "
          >
            找到真正适合你的

            <span className="block text-blue-400">
              日本大学
            </span>
          </h1>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-8
              max-w-4xl
              text-lg
              leading-9
              text-slate-300
            "
          >
            国立、私立、大学院、QS排名、EJU要求、学费、
            专业介绍，一站式查询。
          </p>

          {/* Search */}

          <div className="mx-auto mt-10 max-w-4xl">
            <div
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white
                p-2
                shadow-2xl
                shadow-black/20
                transition
                focus-within:ring-4
                focus-within:ring-blue-500/20
              "
            >
              <Search
                size={21}
                className="
                  ml-4
                  shrink-0
                  text-slate-400
                "
              />

              <input
                type="text"
                value={keywordInput}
                onChange={(e) =>
                  onKeywordChange(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="搜索大学、大学院、地区、专业..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-2
                  py-3
                  text-left
                  text-[15px]
                  text-slate-900
                  outline-none
                  placeholder:text-slate-400
                "
              />

              {keywordInput && (
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="清空搜索"
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  <X size={18} />
                </button>
              )}

              <button
                type="button"
                onClick={onSearch}
                className="
                  flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-7
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  transition
                  hover:bg-blue-700
                  active:scale-[0.98]
                "
              >
                <Search size={17} />

                检索
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              支持学校名称、地区、专业、大学院、标签等关键词
            </p>
          </div>

          {/* Tags */}

          <div
            className="
              mt-8
              flex
              flex-wrap
              justify-center
              gap-3
            "
          >
            {[
              "国立大学",
              "私立大学",
              "大学院",
              "QS排名",
              "EJU",
            ].map((item) => (
              <span
                key={item}
                className="
                  rounded-full
                  border
                  border-blue-400/20
                  bg-white/5
                  px-5
                  py-2
                  text-sm
                  text-slate-300
                "
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}