
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
} from "lucide-react";

type QuickEntry = {
  label: string;
  href: string;
};

function getQuickEntry(
  rawQuery: string
): QuickEntry | null {
  const query = rawQuery
    .normalize("NFKC")
    .trim()
    .toLowerCase();

  if (!query) return null;

  if (
    /避坑|诈骗|詐欺|被骗|骗子|黑中介|防骗/.test(query)
  ) {
    return {
      label: "避坑信息",
      href: "/scam",
    };
  }

  if (
    /经验|攻略|心得|怎么办|怎么弄|办理手续/.test(query)
  ) {
    return {
      label: "生活经验",
      href: "/experience",
    };
  }

  if (
    /专门学校|専門学校|职业学校/.test(query)
  ) {
    const isIt =
      /(^|[^a-z])(?:it|ai)(?=[^a-z]|$)|人工智能|编程|计算机|软件|web/.test(
        query
      );

    return {
      label: isIt ? "IT・AI 专门学校" : "专门学校",
      href: isIt
        ? "/schools/college?category=IT%E3%83%BBAI"
        : "/schools/college",
    };
  }

  if (
    /语言学校|日本语学校|日本語学校|日语学校/.test(query)
  ) {
    return {
      label: "语言学校",
      href: "/schools/language",
    };
  }

  if (
    /大学|大学院|本科|修士|硕士|博士/.test(query)
  ) {
    return {
      label: "大学与大学院",
      href: "/schools/university",
    };
  }

  if (
    /租房|房源|公寓|住宅|マンション|賃貸|1ldk|1dk/.test(
      query
    )
  ) {
    return {
      label: "房源",
      href: "/houses",
    };
  }

  if (
    /工作|职位|招聘|求职|兼职|派遣|正社员|正社員|开发|工程师|java|python|按摩|整体|リラクゼーション/.test(
      query
    )
  ) {
    return {
      label: "工作招聘",
      href: "/jobs",
    };
  }

  if (/学校|留学|升学/.test(query)) {
    return {
      label: "学校",
      href: "/schools",
    };
  }

  return null;
}

export default function HeroSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const quickEntry = getQuickEntry(keyword);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query = keyword.trim();

    if (!query) return;

    const params = new URLSearchParams({
      q: query,
    });

    // 主搜索统一进入全站搜索结果页。
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="
          flex
          min-h-[66px]
          w-full
          items-center
          gap-2
          rounded-2xl
          border
          border-[#E8D8D3]
          bg-[#FFFDFC]
          p-2
          shadow-[0_8px_28px_rgba(106,65,55,0.065)]
          transition
          focus-within:border-[#DE9BA2]
          focus-within:ring-4
          focus-within:ring-[#E9ADB1]/15
        "
      >
        <Search
          size={22}
          className="
            ml-3
            shrink-0
            text-[#99949A]
          "
        />

        <input
          type="search"
          aria-label="搜索 Sakura 全站内容"
          value={keyword}
          onChange={(event) =>
            setKeyword(event.target.value)
          }
          placeholder="东京工作、池袋租房、语言学校…"
          className="
            min-w-0
            flex-1
            bg-transparent
            px-2
            py-3
            text-sm
            text-[#30343B]
            outline-none
            placeholder:text-[#A3A0A3]
            sm:text-base
          "
        />

        <button
          type="submit"
          disabled={!keyword.trim()}
          className="
            flex
            h-12
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#DB5360]
            px-4
            text-sm
            font-bold
            text-white
            transition
            hover:bg-[#C64855]
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-[#DB5360]
            disabled:cursor-not-allowed
            disabled:bg-[#E7D5D3]
            disabled:text-[#A99597]
            sm:px-6
          "
        >
          <span className="hidden sm:inline">
            搜索
          </span>
          <ArrowRight size={18} />
        </button>
      </form>

      <div
        className="
          mt-2
          min-h-5
          text-center
        "
        aria-live="polite"
      >
        {quickEntry ? (
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-2
              text-xs
              sm:text-sm
            "
          >
            <span className="text-[#929198]">
              你可能在找
            </span>

            <Link
              href={quickEntry.href}
              className="
                inline-flex
                items-center
                gap-1
                font-semibold
                text-[#CB4A58]
                underline
                decoration-[#EAC3C3]
                underline-offset-4
                transition
                hover:text-[#AA3443]
              "
            >
              {quickEntry.label}
              <ArrowUpRight size={14} />
            </Link>

            <span className="text-[#AAAAAF]">
              或按回车搜索全站
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
