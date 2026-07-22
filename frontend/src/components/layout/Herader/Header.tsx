"use client";

import Link from "next/link";
import Container from "../Container";

const navs = [
  {
    title: "首页",
    href: "/",
  },
  {
    title: "工作",
    href: "/jobs",
  },
  {
    title: "租房",
    href: "/housing",
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
    title: "日本升学",
    href: "/schools",
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-[72px] items-center justify-between">

          {/* Logo */}

          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-blue-600"
          >
            Sakura
          </Link>

          {/* Navigation */}

          <nav className="hidden items-center gap-8 md:flex">
            {navs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-gray-700 transition hover:text-blue-600"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right */}

          <div className="flex items-center gap-3">

            <button
              className="rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              登录
            </button>

            <button
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              注册
            </button>

          </div>
        </div>
      </Container>
    </header>
  );
}