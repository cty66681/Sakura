
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 500);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="回到页面顶部"
      title="回到顶部"
      className="
        fixed
        bottom-20
        right-4
        z-40
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        border
        border-[#F1DDDA]
        bg-white
        text-[#C64B58]
        shadow-[0_5px_20px_rgba(0,0,0,0.10)]
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-[#D9515E]
        hover:bg-[#D9515E]
        hover:text-white
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#D9515E]
        sm:bottom-8
        sm:right-8
      "
    >
      <ArrowUp size={22} strokeWidth={2.2} />
    </button>
  );
}
