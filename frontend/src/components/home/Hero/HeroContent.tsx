import HeroActions from "./HeroActions";
import HeroSearch from "./HeroSearch";

const hotKeywords = [
  "Java",
  "东京工作",
  "语言学校",
  "东京租房",
  "防骗",
];

const trustData = [
  {
    value: "2458+",
    label: "工作职位",
  },
  {
    value: "918+",
    label: "房源信息",
  },
  {
    value: "327+",
    label: "学校资料",
  },
];

export default function HeroContent() {
  return (
    <div className="max-w-[760px]">

      {/* Badge */}

      <div
        className="
          inline-flex
          items-center
          gap-3

          rounded-full

          border
          border-blue-500/30

          bg-blue-500/10

          px-5
          py-2.5

          text-sm
          font-semibold

          text-blue-300
        "
      >
        🇯🇵 日本华人生活平台

        <span className="text-blue-500">
          /
        </span>

        Sakura Beta
      </div>

      {/* Title */}

      <h1
        className="
          mt-8

          font-black

          leading-[0.95]

          tracking-tight

          text-[74px]

          md:text-[90px]

          xl:text-[106px]
        "
      >

        <span className="text-white">

          在日本，

        </span>

        <br />

        <span
          className="
            bg-gradient-to-r

            from-sky-400

            via-blue-400

            to-violet-400

            bg-clip-text

            text-transparent
          "
        >
          生活，从这里开始。
        </span>

      </h1>

      {/* Description */}

      <p
        className="
          mt-10

          max-w-[680px]

          text-xl

          leading-10

          text-slate-300
        "
      >
        工作、房源、学校、经验、防骗、AI 助手。

        <br />

        为在日华人打造真正现代化的一站式生活平台。
      </p>

      {/* Search */}

      <div className="mt-14">

        <HeroSearch />

      </div>

      {/* Hot */}

      <div className="mt-8 flex flex-wrap items-center gap-3">

        <span
          className="
            text-sm

            font-semibold

            text-slate-400
          "
        >
          🔥 今日热门
        </span>

        {hotKeywords.map((item) => (

          <button
            key={item}
            className="
              rounded-full

              border

              border-white/10

              bg-white/5

              px-4
              py-2

              text-sm

              text-slate-300

              transition-all
              duration-300

              hover:border-blue-500

              hover:bg-blue-500/15

              hover:text-white
            "
          >
            {item}
          </button>

        ))}

      </div>

      {/* Actions */}

      <div className="mt-14">

        <HeroActions />

      </div>

      {/* Divider */}

      <div
        className="
          mt-16

          h-px

          w-full

          bg-gradient-to-r

          from-transparent

          via-white/10

          to-transparent
        "
      />

      {/* Trust */}

      <div
        className="
          mt-10

          grid

          grid-cols-3

          gap-10
        "
      >

        {trustData.map((item) => (

          <div key={item.label}>

            <h3
              className="
                text-5xl

                font-black

                tracking-tight

                text-white
              "
            >
              {item.value}
            </h3>

            <p
              className="
                mt-3

                text-base

                text-slate-400
              "
            >
              {item.label}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}