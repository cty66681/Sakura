"use client";

import Logo from "./Logo";
import Navigation from "./Navigation";
import HeaderActions from "./HeaderActions";

import useScroll from "@/hooks/useScroll";

export default function Header() {
  const scrolled = useScroll();

  return (
    <header
      className={`
        sticky
        top-0
        z-50

        transition-all
        duration-300

        ${
          scrolled
            ? `
              border-b
              border-slate-200/60

              bg-white/80

              shadow-lg

              backdrop-blur-xl

              supports-[backdrop-filter]:bg-white/60
            `
            : `
              bg-transparent
            `
        }
      `}
    >
      <div
        className={`
          mx-auto

          flex

          max-w-7xl

          items-center

          justify-between

          px-6

          transition-all

          duration-300

          ${scrolled ? "h-16" : "h-20"}
        `}
      >
        <Logo />

        <Navigation />

        <HeaderActions />
      </div>
    </header>
  );
}