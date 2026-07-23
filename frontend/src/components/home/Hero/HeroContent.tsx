import HeroActions from "./HeroActions";
import HeroSearch from "./HeroSearch";

export default function HeroContent() {
  return (
    <div className="max-w-2xl">

      {/* Badge */}

      <div
        className="
          inline-flex
          items-center
          rounded-full
          border
          border-blue-200
          bg-blue-50
          px-4
          py-2
          text-sm
          font-medium
          text-blue-700
        "
      >
        🇯🇵 面向在日华人的一站式生活平台
      </div>

      {/* Title */}

      <h1
        className="
          mt-8
          text-5xl
          font-black
          leading-tight
          tracking-tight
          text-slate-900

          md:text-6xl
          xl:text-7xl
        "
      >
        在日本，
        <br />

        <span
          className="
            bg-gradient-to-r
            from-blue-600
            via-indigo-500
            to-violet-500
            bg-clip-text
            text-transparent
          "
        >
          一切从这里开始。
        </span>
      </h1>

      {/* Description */}

      <p
        className="
          mt-8
          max-w-xl
          text-lg
          leading-8
          text-slate-500
        "
      >
        找工作、找房源、查学校、经验分享、避坑防骗、
        AI 智能助手，一个平台解决在日本生活的大部分问题。
      </p>

      {/* Search */}

      <div className="mt-12">
        <HeroSearch />
      </div>

      {/* Actions */}

      <div className="mt-10">
        <HeroActions />
      </div>

      {/* Bottom Tags */}

      <div className="mt-14 flex flex-wrap gap-3">

        {[
          "💼 工作",
          "🏠 房源",
          "🎓 升学",
          "📖 经验",
          "🛡️ 避坑",
          "🤖 AI",
        ].map((item) => (
          <span
            key={item}
            className="
              rounded-full
              bg-white/80
              px-4
              py-2
              text-sm
              font-medium
              text-slate-600
              shadow-sm
              backdrop-blur
            "
          >
            {item}
          </span>
        ))}

      </div>

    </div>
  );
}