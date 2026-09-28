
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Flower2,
  GraduationCap,
  House,
  ShieldAlert,
} from "lucide-react";

import HeroSearch from "./HeroSearch";

const quickEntries = [
  {
    title: "找工作",
    description: "招聘、薪资、工作条件",
    href: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    title: "找房源",
    description: "房租、地区、入住条件",
    href: "/houses",
    icon: House,
  },
  {
    title: "查学校",
    description: "大学、语言学校、专门学校",
    href: "/schools",
    icon: GraduationCap,
  },
  {
    title: "查避坑",
    description: "生活风险与防骗提醒",
    href: "/scam",
    icon: ShieldAlert,
  },
];

const hotKeywords = [
  "东京工作",
  "池袋租房",
  "IT专门学校",
  "租房避坑",
];

export default function HeroContent() {
  return (
    <div className="mx-auto w-full max-w-[940px]">
      {/* 平台身份 */}
      <div className="flex justify-center">
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-[#F0DED9]
            bg-white/80
            px-4
            py-2
            text-xs
            font-semibold
            text-[#C14B59]
            sm:text-sm
          "
        >
          <Flower2 size={17} strokeWidth={1.8} />
          在日华人的生活导航
        </div>
      </div>

      {/* 主标题 */}
      <h1
        className="
          mx-auto
          mt-7
          max-w-[860px]
          text-center
          text-[35px]
          font-bold
          leading-[1.35]
          tracking-tight
          text-[#272B32]
          sm:text-[49px]
          lg:text-[58px]
        "
      >
        在日本，想找什么，
        <span className="block text-[#DC5360] sm:inline">
          来这里搜。
        </span>
      </h1>

      <p
        className="
          mx-auto
          mt-5
          max-w-[650px]
          text-center
          text-sm
          leading-7
          text-[#737780]
          sm:text-base
        "
      >
        找工作、查学校、看房源，
        还有在日生活的经验和避坑提醒。
        想了解的事，从这里开始。
      </p>

      {/* 全站搜索 */}
      <div className="mx-auto mt-8 max-w-[790px] sm:mt-10">
        <HeroSearch />
      </div>

      {/* 常见搜索 */}
      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          justify-center
          gap-2
        "
      >
        <span className="mr-1 text-xs text-[#898B91]">
          试试搜索
        </span>

        {hotKeywords.map((keyword) => (
          <Link
            key={keyword}
            href={`/search?q=${encodeURIComponent(keyword)}`}
            className="
              rounded-full
              border
              border-[#EAE4E1]
              bg-white/75
              px-3
              py-1.5
              text-xs
              text-[#696D75]
              transition
              hover:border-[#E6A7AC]
              hover:bg-[#FFF1F0]
              hover:text-[#CA4D59]
            "
          >
            {keyword}
          </Link>
        ))}
      </div>

      {/* 常用分类 */}
      <div className="mt-12 sm:mt-14">
        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-[#30343B]
              sm:text-xl
            "
          >
            你现在想找什么？
          </h2>

          <span className="text-xs text-[#92949A]">
            常用分类
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickEntries.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group
                  relative
                  rounded-2xl
                  border
                  border-[#ECE7E4]
                  bg-white
                  p-4
                  shadow-[0_3px_15px_rgba(50,40,35,0.025)]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#E9B9BA]
                  hover:shadow-[0_8px_26px_rgba(80,50,45,0.065)]
                  sm:p-5
                "
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#FFF0EE]
                      text-[#D45460]
                    "
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="
                      text-[#B9B7B6]
                      transition
                      group-hover:text-[#D45460]
                    "
                  />
                </div>

                <h3
                  className="
                    mt-5
                    text-[15px]
                    font-bold
                    text-[#30343B]
                    sm:text-base
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-1.5
                    text-xs
                    leading-5
                    text-[#898B91]
                  "
                >
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
