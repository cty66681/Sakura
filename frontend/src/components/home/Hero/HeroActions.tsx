"use client";

import Link from "next/link";
import {
  BriefcaseBusiness,
  House,
  GraduationCap,
  ShieldAlert,
} from "lucide-react";

const actions = [
  {
    title: "找工作",
    desc: "日本高薪职位",
    href: "/jobs",
    icon: BriefcaseBusiness,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "找房源",
    desc: "东京热门房源",
    href: "/houses",
    icon: House,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "找学校",
    desc: "大学・语言学校",
    href: "/schools",
    icon: GraduationCap,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "避坑专区",
    desc: "骗子曝光",
    href: "/scams",
    icon: ShieldAlert,
    color: "from-orange-500 to-red-500",
  },
];

export default function HeroActions() {
  return (
    <div className="mt-2 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            href={item.href}
            className="
              group
              rounded-2xl
              border
              border-white/10
              bg-white/5
              p-5
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-blue-400/40
              hover:bg-white/10
              hover:shadow-2xl
              hover:shadow-blue-500/10
            "
          >
            <div
              className={`
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                ${item.color}
                transition-transform
                duration-300
                group-hover:scale-110
              `}
            >
              <Icon
                size={22}
                className="text-white"
              />
            </div>

            <h3 className="mt-4 text-lg font-bold text-white">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {item.desc}
            </p>
          </Link>
        );
      })}
    </div>
  );
}