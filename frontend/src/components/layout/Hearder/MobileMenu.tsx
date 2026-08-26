"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { title: "首页", href: "/" },
  { title: "工作", href: "/jobs" },
  { title: "房源", href: "/houses" },
  { title: "学校", href: "/schools" },
  { title: "经验", href: "/experiences" },
  { title: "避坑", href: "/scams" },
  { title: "AI", href: "/ai-tools" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          transition
          hover:bg-slate-100
          lg:hidden
        "
        onClick={() => setOpen(true)}
      >
        <Menu size={22} />
      </button>

      {open && (
        <>
          {/* Mask */}

          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}

          <div
            className="
              fixed
              right-0
              top-0
              z-50

              h-screen
              w-72

              bg-white

              shadow-2xl
            "
          >
            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between

                border-b

                p-6
              "
            >
              <h2 className="text-lg font-bold">
                Sakura
              </h2>

              <button
                onClick={() => setOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            {/* Menu */}

            <div className="p-6">

              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="
                    block

                    rounded-xl

                    px-4
                    py-4

                    font-medium

                    transition

                    hover:bg-slate-100
                  "
                >
                  {item.title}
                </Link>
              ))}

            </div>

          </div>
        </>
      )}
    </>
  );
}