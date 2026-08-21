"use client";

import { Search } from "lucide-react";

export default function HeroSearch() {
  return (
    <div
      className="
        group

        flex

        h-[72px]

        w-full

        items-center

        rounded-[24px]

        border

        border-white/10

        bg-white/5

        px-4

        backdrop-blur-xl

        transition-all
        duration-300

        hover:border-blue-500/40

        hover:bg-white/[0.07]

        focus-within:border-blue-500

        focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]
      "
    >

      {/* Icon */}

      <Search
        size={24}
        className="
          ml-2

          text-slate-400

          transition

          group-focus-within:text-blue-400
        "
      />

      {/* Input */}

      <input
        type="text"
        placeholder="搜索工作、房源、学校..."
        className="
          h-full

          flex-1

          bg-transparent

          px-5

          text-lg

          text-white

          placeholder:text-slate-500

          outline-none
        "
      />

      {/* Button */}

      <button
        className="
          rounded-2xl

          bg-gradient-to-r

          from-sky-500

          to-blue-600

          px-8

          py-3

          font-semibold

          text-white

          shadow-lg

          transition-all
          duration-300

          hover:scale-[1.03]

          hover:shadow-blue-500/30

          active:scale-95
        "
      >
        搜索
      </button>

    </div>
  );
}