"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "首页",
    href: "/",
  },
  {
    title: "工作",
    href: "/jobs",
  },
  {
    title: "房源",
    href: "/houses",
  },
  {
    title: "学校",
    href: "/schools",
  },
  {
    title: "经验",
    href: "/experience",
  },
  {
    title: "避坑",
    href: "/scam",
  },
  {
    title: "AI",
    href: "/ai-tools",
  },
] as const;

export default function Navigation() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <nav
      className="
        hidden
        items-center
        gap-1
        lg:flex
      "
    >
      {navItems.map((item) => {
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative
              flex
              min-h-11
              items-center
              justify-center
              rounded-xl
              px-3.5
              text-sm
              font-bold
              transition-all
              ${
                active
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }
            `}
          >
            {item.title}

            {active && (
              <span
                className="
                  absolute
                  bottom-1
                  left-1/2
                  h-1
                  w-1
                  -translate-x-1/2
                  rounded-full
                  bg-blue-600
                "
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}