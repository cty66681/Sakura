import { Search } from "lucide-react";

export default function HeroSearch() {
  return (
    <div className="relative">

      <Search
        size={22}
        className="
          absolute
          left-6
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        type="text"
        placeholder="搜索工作、房源、学校、经验..."
        className="
          h-16
          w-full

          rounded-full

          border
          border-slate-200

          bg-white/80

          pl-16
          pr-40

          text-base

          shadow-lg

          backdrop-blur-xl

          outline-none

          transition-all
          duration-300

          placeholder:text-slate-400

          focus:border-blue-500
          focus:bg-white
          focus:shadow-xl
        "
      />

      <button
        className="
          absolute
          right-2
          top-1/2

          h-12
          -translate-y-1/2

          rounded-full

          bg-blue-600

          px-6

          font-semibold
          text-white

          transition-all
          duration-300

          hover:bg-blue-700
          hover:shadow-xl

          active:scale-95
        "
      >
        搜索
      </button>

    </div>
  );
}