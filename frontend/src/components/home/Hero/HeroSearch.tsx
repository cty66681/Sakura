"use client";

import {
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import {
  Search,
  ArrowRight,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| TODO [API - POST]
|--------------------------------------------------------------------------
|
| Sakura 首页统一搜索意图识别
|
| POST /api/search/intent
|
| Body:
| {
|   query: "东京 IT 工作"
| }
|
| 后续 AI / 后端返回：
|
| {
|   type: "school" | "job" | "house" | "experience" | "scam" | "general",
|   schoolType?: "university" | "language" | "college",
|   region?: "东京",
|   keyword?: "IT"
| }
|
| 当前阶段：
| 使用前端规则完成基础意图识别。
|
|--------------------------------------------------------------------------
*/

const regionKeywords = [
  {
    keywords: ["东京", "東京", "tokyo"],
    value: "东京",
  },
  {
    keywords: ["大阪", "osaka"],
    value: "大阪",
  },
  {
    keywords: ["京都", "kyoto"],
    value: "京都",
  },
  {
    keywords: [
      "爱知",
      "愛知",
      "名古屋",
      "nagoya",
      "aichi",
    ],
    value: "爱知",
  },
  {
    keywords: [
      "神奈川",
      "横滨",
      "横浜",
      "yokohama",
      "kanagawa",
    ],
    value: "神奈川",
  },
  {
    keywords: [
      "福冈",
      "福岡",
      "fukuoka",
    ],
    value: "福冈",
  },
  {
    keywords: [
      "北海道",
      "札幌",
      "hokkaido",
      "sapporo",
    ],
    value: "北海道",
  },
  {
    keywords: [
      "埼玉",
      "saitama",
    ],
    value: "埼玉",
  },
  {
    keywords: [
      "千叶",
      "千葉",
      "chiba",
    ],
    value: "千叶",
  },
];

function includesAny(
  value: string,
  keywords: string[]
) {
  const normalized =
    value.toLowerCase();

  return keywords.some(
    (keyword) =>
      normalized.includes(
        keyword.toLowerCase()
      )
  );
}

function detectRegion(
  query: string
) {
  return regionKeywords.find(
    (region) =>
      includesAny(
        query,
        region.keywords
      )
  )?.value;
}

function cleanRegionKeyword(
  query: string
) {
  let result = query;

  for (
    const region
    of regionKeywords
  ) {
    for (
      const keyword
      of region.keywords
    ) {
      result = result.replace(
        new RegExp(
          escapeRegExp(keyword),
          "gi"
        ),
        " "
      );
    }
  }

  return result
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(
  value: string
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function buildSearchUrl(
  rawQuery: string
) {
  const query =
    rawQuery.trim();

  const region =
    detectRegion(query);

  /*
  |--------------------------------------------------------------------------
  | LANGUAGE SCHOOL
  |--------------------------------------------------------------------------
  */

  if (
    includesAny(query, [
      "语言学校",
      "日本语学校",
      "日语学校",
      "日本語学校",
    ])
  ) {
    const params =
      new URLSearchParams();

    if (region) {
      params.set(
        "region",
        region
      );
    }

    let keyword =
      cleanRegionKeyword(query);

    keyword = keyword
      .replace(
        /语言学校|日本语学校|日语学校|日本語学校/gi,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();

    if (keyword) {
      params.set(
        "q",
        keyword
      );
    }

    const search =
      params.toString();

    return search
      ? `/schools/language?${search}`
      : "/schools/language";
  }

  /*
  |--------------------------------------------------------------------------
  | COLLEGE
  |--------------------------------------------------------------------------
  */

  if (
    includesAny(query, [
      "专门学校",
      "専門学校",
      "职业学校",
    ])
  ) {
    const params =
      new URLSearchParams();

    if (region) {
      params.set(
        "region",
        region
      );
    }

    if (
      includesAny(query, [
        "it",
        "ai",
        "人工智能",
        "编程",
        "程序",
        "软件",
        "web",
      ])
    ) {
      params.set(
        "category",
        "IT・AI"
      );
    }

    if (
      includesAny(query, [
        "动漫",
        "动画",
        "设计",
        "游戏",
        "美术",
      ])
    ) {
      params.set(
        "category",
        "设计・动漫"
      );
    }

    if (
      includesAny(query, [
        "商务",
        "经营",
        "观光",
        "旅游",
        "酒店",
      ])
    ) {
      params.set(
        "category",
        "商务・观光"
      );
    }

    if (
      includesAny(query, [
        "医疗",
        "福祉",
        "护理",
        "介护",
      ])
    ) {
      params.set(
        "category",
        "医疗・福祉"
      );
    }

    if (
      includesAny(query, [
        "汽车",
        "机械",
        "技术",
        "制造",
      ])
    ) {
      params.set(
        "category",
        "汽车・技术"
      );
    }

    const search =
      params.toString();

    return search
      ? `/schools/college?${search}`
      : "/schools/college";
  }

  /*
  |--------------------------------------------------------------------------
  | UNIVERSITY
  |--------------------------------------------------------------------------
  */

  if (
    includesAny(query, [
      "大学",
      "大学院",
      "本科",
      "修士",
      "硕士",
      "博士",
      "国立",
      "私立",
      "公立",
      "eju",
    ])
  ) {
    const params =
      new URLSearchParams();

    if (region) {
      params.set(
        "region",
        region
      );
    }

    if (
      includesAny(query, [
        "it",
        "ai",
        "人工智能",
        "计算机",
        "信息",
        "软件",
      ])
    ) {
      params.set(
        "major",
        "IT・AI"
      );
    }

    if (
      includesAny(query, [
        "经济",
        "经营",
        "商学",
      ])
    ) {
      params.set(
        "major",
        "经济・经营"
      );
    }

    if (
      includesAny(query, [
        "理工",
        "机械",
        "工程",
        "制造",
      ])
    ) {
      params.set(
        "major",
        "理工・机械"
      );
    }

    if (
      includesAny(query, [
        "医学",
        "医疗",
        "护理",
      ])
    ) {
      params.set(
        "major",
        "医学・医疗"
      );
    }

    if (
      includesAny(query, [
        "艺术",
        "设计",
        "美术",
      ])
    ) {
      params.set(
        "major",
        "艺术・设计"
      );
    }

    if (
      includesAny(query, [
        "国立",
      ])
    ) {
      params.set(
        "type",
        "国立大学"
      );
    }

    if (
      includesAny(query, [
        "私立",
      ])
    ) {
      params.set(
        "type",
        "私立大学"
      );
    }

    if (
      includesAny(query, [
        "公立",
      ])
    ) {
      params.set(
        "type",
        "公立大学"
      );
    }

    if (
      includesAny(query, [
        "大学院",
        "修士",
        "硕士",
        "博士",
      ])
    ) {
      params.set(
        "degree",
        "大学院"
      );
    }

    const search =
      params.toString();

    return search
      ? `/schools/university?${search}`
      : "/schools/university";
  }

  /*
  |--------------------------------------------------------------------------
  | SCAM / SAFETY
  |--------------------------------------------------------------------------
  */

  if (
    includesAny(query, [
      "诈骗",
      "被骗",
      "骗子",
      "避坑",
      "防骗",
      "黑中介",
      "坑",
    ])
  ) {
    const params =
      new URLSearchParams();

    params.set(
      "q",
      query
    );

    return `/scam?${params.toString()}`;
  }

  /*
  |--------------------------------------------------------------------------
  | EXPERIENCE
  |--------------------------------------------------------------------------
  */

  if (
    includesAny(query, [
      "经验",
      "攻略",
      "怎么办",
      "怎么弄",
      "手续",
      "签证",
      "银行卡",
      "手机卡",
      "驾照",
      "搬家",
      "生活",
    ])
  ) {
    const params =
      new URLSearchParams();

    params.set(
      "q",
      query
    );

    return `/experience?${params.toString()}`;
  }

  /*
  |--------------------------------------------------------------------------
  | HOUSE
  |--------------------------------------------------------------------------
  */

  if (
    includesAny(query, [
      "租房",
      "房子",
      "房源",
      "公寓",
      "住宅",
      "マンション",
      "賃貸",
    ])
  ) {
    const params =
      new URLSearchParams();

    if (region) {
      params.set(
        "region",
        region
      );
    }

    let keyword =
      cleanRegionKeyword(query);

    keyword = keyword
      .replace(
        /租房|房子|房源|公寓|住宅|マンション|賃貸/gi,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();

    if (keyword) {
      params.set(
        "q",
        keyword
      );
    }

    const search =
      params.toString();

    return search
      ? `/houses?${search}`
      : "/houses";
  }

  /*
  |--------------------------------------------------------------------------
  | JOB
  |--------------------------------------------------------------------------
  */

  if (
    includesAny(query, [
      "工作",
      "招聘",
      "职位",
      "求职",
      "兼职",
      "正社员",
      "派遣",
      "开发",
      "工程师",
      "java",
      "python",
    ])
  ) {
    const params =
      new URLSearchParams();

    if (region) {
      params.set(
        "region",
        region
      );
    }

    let keyword =
      cleanRegionKeyword(query);

    keyword = keyword
      .replace(
        /工作|招聘|职位|求职/gi,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();

    if (keyword) {
      params.set(
        "q",
        keyword
      );
    }

    const search =
      params.toString();

    return search
      ? `/jobs?${search}`
      : "/jobs";
  }

  /*
  |--------------------------------------------------------------------------
  | GENERAL SEARCH
  |--------------------------------------------------------------------------
  |
  | TODO [API - GET]
  |
  | GET /api/search?q=xxx
  |
  | 后续这里会变成 Sakura 全站搜索结果页。
  |
  |--------------------------------------------------------------------------
  */

  const params =
    new URLSearchParams();

  params.set(
    "q",
    query
  );

  return `/search?${params.toString()}`;
}

export default function HeroSearch() {
  const router =
    useRouter();

  const [
    keyword,
    setKeyword,
  ] =
    useState("");

  const handleSubmit = (
    event: FormEvent
  ) => {
    event.preventDefault();

    const query =
      keyword.trim();

    if (!query) {
      return;
    }

    router.push(
      buildSearchUrl(query)
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        group
        flex
        min-h-[68px]
        w-full
        items-center
        rounded-[22px]
        border
        border-white/10
        bg-white/[0.055]
        p-2
        backdrop-blur-xl
        transition
        duration-300
        hover:border-white/20
        hover:bg-white/[0.07]
        focus-within:border-blue-400/60
        focus-within:bg-white/[0.075]
        focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.10)]
      "
    >
      <Search
        size={21}
        className="
          ml-3
          shrink-0
          text-slate-500
          transition
          group-focus-within:text-blue-400
        "
      />

      <input
        type="text"
        value={keyword}
        onChange={(event) =>
          setKeyword(
            event.target.value
          )
        }
        placeholder="搜索学校、经验、避坑、房源、工作..."
        className="
          min-w-0
          flex-1
          bg-transparent
          px-4
          py-3
          text-[15px]
          text-white
          outline-none
          placeholder:text-slate-500
          sm:text-base
        "
      />

      <button
        type="submit"
        disabled={
          !keyword.trim()
        }
        className="
          flex
          h-12
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-blue-600
          px-5
          text-sm
          font-bold
          text-white
          shadow-lg
          shadow-blue-950/20
          transition
          hover:bg-blue-500
          disabled:cursor-default
          disabled:bg-slate-700
          disabled:text-slate-400
          disabled:shadow-none
          sm:px-6
        "
      >
        <span className="hidden sm:inline">
          搜索
        </span>

        <ArrowRight
          size={17}
        />
      </button>
    </form>
  );
}