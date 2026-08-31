"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  GraduationCap,
  Languages,
  MapPin,
  Search,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";

import Container from "@/components/layout/Container";

type SchoolType =
  | "university"
  | "language"
  | "college";

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| GET /api/schools/home
|
| 后续返回：
|
| {
|   statistics,
|   popularPrefectures,
|   prefectures,
|   majors,
|   warnings,
|   featuredSchools
| }
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - POST]
|--------------------------------------------------------------------------
|
| POST /api/schools/search-intent
|
| Body:
|
| {
|   query: "东京 IT 留学生就业"
| }
|
| 当前阶段继续使用前端规则解析。
|
|--------------------------------------------------------------------------
*/

const schoolTypes = [
  {
    id: "university" as const,
    title: "大学・大学院",
    subtitle: "本科 / 修士 / 博士",
    description:
      "查大学排名、专业方向、EJU要求、学费以及留学生招生信息。",
    href: "/schools/university",
    icon: GraduationCap,
    theme:
      "border-blue-200 bg-blue-50 text-blue-600",
    hover:
      "hover:border-blue-300 hover:shadow-blue-100",
    number: "01",
  },

  {
    id: "language" as const,
    title: "语言学校",
    subtitle: "日语 / 升学 / 留学",
    description:
      "比较学费、升学支持、中文服务、签证支持以及学校评价。",
    href: "/schools/language",
    icon: Languages,
    theme:
      "border-emerald-200 bg-emerald-50 text-emerald-600",
    hover:
      "hover:border-emerald-300 hover:shadow-emerald-100",
    number: "02",
  },

  {
    id: "college" as const,
    title: "专门学校",
    subtitle: "技能 / 资格 / 就业",
    description:
      "查看IT、设计、商务、医疗、汽车等专业及毕业就业情况。",
    href: "/schools/college",
    icon: Wrench,
    theme:
      "border-orange-200 bg-orange-50 text-orange-600",
    hover:
      "hover:border-orange-300 hover:shadow-orange-100",
    number: "03",
  },
];

/* ================================================================
   JAPAN REGIONS
================================================================ */

const japanRegions = [
  {
    name: "北海道",
    prefectures: ["北海道"],
  },

  {
    name: "东北",
    prefectures: [
      "青森",
      "岩手",
      "宫城",
      "秋田",
      "山形",
      "福岛",
    ],
  },

  {
    name: "关东",
    prefectures: [
      "茨城",
      "栃木",
      "群马",
      "埼玉",
      "千叶",
      "东京",
      "神奈川",
    ],
  },

  {
    name: "中部",
    prefectures: [
      "新潟",
      "富山",
      "石川",
      "福井",
      "山梨",
      "长野",
      "岐阜",
      "静冈",
      "爱知",
    ],
  },

  {
    name: "近畿",
    prefectures: [
      "三重",
      "滋贺",
      "京都",
      "大阪",
      "兵库",
      "奈良",
      "和歌山",
    ],
  },

  {
    name: "中国",
    prefectures: [
      "鸟取",
      "岛根",
      "冈山",
      "广岛",
      "山口",
    ],
  },

  {
    name: "四国",
    prefectures: [
      "德岛",
      "香川",
      "爱媛",
      "高知",
    ],
  },

  {
    name: "九州・冲绳",
    prefectures: [
      "福冈",
      "佐贺",
      "长崎",
      "熊本",
      "大分",
      "宫崎",
      "鹿儿岛",
      "冲绳",
    ],
  },
];

const popularRegions = [
  {
    name: "东京",
    description:
      "学校数量最多，专业选择丰富",
  },

  {
    name: "大阪",
    description:
      "关西核心地区，教育资源丰富",
  },

  {
    name: "京都",
    description:
      "大学和文化艺术教育资源丰富",
  },

  {
    name: "神奈川",
    description:
      "横滨地区交通方便、学校集中",
  },

  {
    name: "爱知",
    description:
      "名古屋为核心，制造业和技术就业机会较多",
  },

  {
    name: "福冈",
    description:
      "九州核心地区，留学生环境活跃",
  },
];

/* ================================================================
   MAJORS
================================================================ */

const majors = [
  {
    name: "IT・AI",
    icon: "💻",
    description:
      "人工智能、信息科学、程序开发、Web与数据方向",
    universityHref:
      "/schools/university?major=IT・AI",
    collegeHref:
      "/schools/college?category=IT・AI",
  },

  {
    name: "商务・经营",
    icon: "📊",
    description:
      "经济、经营、商学、国际商务、观光与服务方向",
    universityHref:
      "/schools/university?major=经济・经营",
    collegeHref:
      "/schools/college?category=商务・观光",
  },

  {
    name: "艺术・设计",
    icon: "🎨",
    description:
      "艺术、视觉设计、动漫、游戏与创意方向",
    universityHref:
      "/schools/university?major=艺术・设计",
    collegeHref:
      "/schools/college?category=设计・动漫",
  },

  {
    name: "医疗・福祉",
    icon: "🏥",
    description:
      "医学、医疗、护理、介护、福祉与资格方向",
    universityHref:
      "/schools/university?major=医学・医疗",
    collegeHref:
      "/schools/college?category=医疗・福祉",
  },

  {
    name: "理工・技术",
    icon: "⚙️",
    description:
      "工学、机械、制造、电子、汽车与工程技术",
    universityHref:
      "/schools/university?major=理工・机械",
    collegeHref:
      "/schools/college?category=汽车・技术",
  },
];

const warnings = [
  {
    level: "high",

    title:
      "不要只看“就业率”数字",

    description:
      "不同学校统计口径可能不同，建议同时确认就业人数、统计年度和留学生实际就业情况。",
  },

  {
    level: "medium",

    title:
      "确认第一年全部费用",

    description:
      "除了学费之外，还可能包含入学金、设施费、教材费、实习费以及考试费用。",
  },

  {
    level: "normal",

    title:
      "确认毕业后的签证对应关系",

    description:
      "大学和专门学校毕业后都要关注专业内容与未来工作内容之间的关联。",
  },
];

const featuredSchools = [
  {
    name: "东京大学",
    type: "大学・大学院",
    location: "东京 · 文京区",
    rating: 4.9,
    description:
      "日本代表性综合大学之一，研究领域广泛。",
    href:
      "/schools/university/tokyo",
    theme:
      "bg-blue-50 text-blue-700",
  },

  {
    name:
      "东京科技AI专门学校",
    type: "专门学校",
    location:
      "东京 · 新宿区",
    rating: 4.7,
    description:
      "IT、AI与Web开发方向，就业导向明确。",
    href:
      "/schools/college/tokyo-tech-ai",
    theme:
      "bg-orange-50 text-orange-700",
  },

  {
    name:
      "东京中央日本语学院",
    type: "语言学校",
    location:
      "东京 · 新宿区",
    rating: 4.6,
    description:
      "提供升学指导、留学生支持以及中文咨询。",
    href:
      "/schools/language/1",
    theme:
      "bg-emerald-50 text-emerald-700",
  },
];

/* ================================================================
   Search Intelligence
================================================================ */

const REGION_KEYWORDS = [
  {
    keywords: [
      "北海道",
      "札幌",
      "sapporo",
    ],
    value: "北海道",
  },

  {
    keywords: [
      "青森",
      "aomori",
    ],
    value: "青森",
  },

  {
    keywords: [
      "岩手",
      "盛冈",
      "盛岡",
      "iwate",
      "morioka",
    ],
    value: "岩手",
  },

  {
    keywords: [
      "宫城",
      "宮城",
      "仙台",
      "miyagi",
      "sendai",
    ],
    value: "宫城",
  },

  {
    keywords: [
      "秋田",
      "akita",
    ],
    value: "秋田",
  },

  {
    keywords: [
      "山形",
      "yamagata",
    ],
    value: "山形",
  },

  {
    keywords: [
      "福岛",
      "福島",
      "fukushima",
    ],
    value: "福岛",
  },

  {
    keywords: [
      "茨城",
      "水户",
      "水戸",
      "ibaraki",
    ],
    value: "茨城",
  },

  {
    keywords: [
      "栃木",
      "宇都宫",
      "宇都宮",
      "tochigi",
    ],
    value: "栃木",
  },

  {
    keywords: [
      "群马",
      "群馬",
      "gunma",
    ],
    value: "群马",
  },

  {
    keywords: [
      "埼玉",
      "大宫",
      "大宮",
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

  {
    keywords: [
      "东京",
      "東京",
      "tokyo",
    ],
    value: "东京",
  },

  {
    keywords: [
      "神奈川",
      "横滨",
      "横浜",
      "kanagawa",
      "yokohama",
    ],
    value: "神奈川",
  },

  {
    keywords: [
      "新潟",
      "niigata",
    ],
    value: "新潟",
  },

  {
    keywords: [
      "富山",
      "toyama",
    ],
    value: "富山",
  },

  {
    keywords: [
      "石川",
      "金泽",
      "金沢",
      "ishikawa",
      "kanazawa",
    ],
    value: "石川",
  },

  {
    keywords: [
      "福井",
      "fukui",
    ],
    value: "福井",
  },

  {
    keywords: [
      "山梨",
      "甲府",
      "yamanashi",
    ],
    value: "山梨",
  },

  {
    keywords: [
      "长野",
      "長野",
      "nagano",
    ],
    value: "长野",
  },

  {
    keywords: [
      "岐阜",
      "gifu",
    ],
    value: "岐阜",
  },

  {
    keywords: [
      "静冈",
      "静岡",
      "shizuoka",
    ],
    value: "静冈",
  },

  {
    keywords: [
      "爱知",
      "愛知",
      "名古屋",
      "aichi",
      "nagoya",
    ],
    value: "爱知",
  },

  {
    keywords: [
      "三重",
      "mie",
    ],
    value: "三重",
  },

  {
    keywords: [
      "滋贺",
      "滋賀",
      "大津",
      "shiga",
    ],
    value: "滋贺",
  },

  {
    keywords: [
      "京都",
      "kyoto",
    ],
    value: "京都",
  },

  {
    keywords: [
      "大阪",
      "osaka",
    ],
    value: "大阪",
  },

  {
    keywords: [
      "兵库",
      "兵庫",
      "神户",
      "神戸",
      "hyogo",
      "kobe",
    ],
    value: "兵库",
  },

  {
    keywords: [
      "奈良",
      "nara",
    ],
    value: "奈良",
  },

  {
    keywords: [
      "和歌山",
      "wakayama",
    ],
    value: "和歌山",
  },

  {
    keywords: [
      "鸟取",
      "鳥取",
      "tottori",
    ],
    value: "鸟取",
  },

  {
    keywords: [
      "岛根",
      "島根",
      "松江",
      "shimane",
    ],
    value: "岛根",
  },

  {
    keywords: [
      "冈山",
      "岡山",
      "okayama",
    ],
    value: "冈山",
  },

  {
    keywords: [
      "广岛",
      "広島",
      "hiroshima",
    ],
    value: "广岛",
  },

  {
    keywords: [
      "山口",
      "yamaguchi",
    ],
    value: "山口",
  },

  {
    keywords: [
      "德岛",
      "徳島",
      "tokushima",
    ],
    value: "德岛",
  },

  {
    keywords: [
      "香川",
      "高松",
      "kagawa",
      "takamatsu",
    ],
    value: "香川",
  },

  {
    keywords: [
      "爱媛",
      "愛媛",
      "松山",
      "ehime",
    ],
    value: "爱媛",
  },

  {
    keywords: [
      "高知",
      "kochi",
    ],
    value: "高知",
  },

  {
    keywords: [
      "福冈",
      "福岡",
      "博多",
      "fukuoka",
    ],
    value: "福冈",
  },

  {
    keywords: [
      "佐贺",
      "佐賀",
      "saga",
    ],
    value: "佐贺",
  },

  {
    keywords: [
      "长崎",
      "長崎",
      "nagasaki",
    ],
    value: "长崎",
  },

  {
    keywords: [
      "熊本",
      "kumamoto",
    ],
    value: "熊本",
  },

  {
    keywords: [
      "大分",
      "oita",
    ],
    value: "大分",
  },

  {
    keywords: [
      "宫崎",
      "宮崎",
      "miyazaki",
    ],
    value: "宫崎",
  },

  {
    keywords: [
      "鹿儿岛",
      "鹿児島",
      "kagoshima",
    ],
    value: "鹿儿岛",
  },

  {
    keywords: [
      "冲绳",
      "沖縄",
      "naha",
      "那霸",
      "okinawa",
    ],
    value: "冲绳",
  },
];

const COLLEGE_CATEGORY_KEYWORDS = [
  {
    value: "IT・AI",

    keywords: [
      "it",
      "ai",
      "人工智能",
      "程序",
      "编程",
      "开发",
      "软件",
      "web",
      "网络",
      "云计算",
      "计算机",
    ],
  },

  {
    value: "设计・动漫",

    keywords: [
      "设计",
      "动漫",
      "动画",
      "游戏",
      "插画",
      "美术",
    ],
  },

  {
    value: "商务・观光",

    keywords: [
      "商务",
      "经营",
      "经济",
      "观光",
      "旅游",
      "酒店",
      "航空",
    ],
  },

  {
    value: "美容・时尚",

    keywords: [
      "美容",
      "美发",
      "时尚",
      "造型",
    ],
  },

  {
    value: "医疗・福祉",

    keywords: [
      "医疗",
      "福祉",
      "介护",
      "护理",
    ],
  },

  {
    value: "汽车・技术",

    keywords: [
      "汽车",
      "机械",
      "制造",
      "整备",
      "技术",
      "工学",
      "工程",
    ],
  },
];

const UNIVERSITY_MAJOR_KEYWORDS = [
  {
    value: "IT・AI",

    keywords: [
      "it",
      "ai",
      "人工智能",
      "计算机",
      "信息",
      "数据",
      "程序",
      "软件",
    ],
  },

  {
    value: "经济・经营",

    keywords: [
      "经济",
      "经营",
      "商学",
      "商业",
      "business",
    ],
  },

  {
    value: "文学・语言",

    keywords: [
      "文学",
      "语言",
      "外语",
      "人文",
    ],
  },

  {
    value: "法学・政治",

    keywords: [
      "法学",
      "法律",
      "政治",
    ],
  },

  {
    value: "理工・机械",

    keywords: [
      "理工",
      "工学",
      "机械",
      "工程",
      "制造",
      "电子",
    ],
  },

  {
    value: "医学・医疗",

    keywords: [
      "医学",
      "医疗",
      "护理",
      "药学",
    ],
  },

  {
    value: "艺术・设计",

    keywords: [
      "艺术",
      "设计",
      "美术",
      "动漫",
    ],
  },

  {
    value: "教育・社会",

    keywords: [
      "教育",
      "社会",
      "心理",
    ],
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

function detectSchoolType(
  query: string,
  fallback: SchoolType
): SchoolType {
  const value =
    query.toLowerCase();

  if (
    includesAny(value, [
      "语言学校",
      "日本语学校",
      "日语学校",
      "日本語学校",
    ])
  ) {
    return "language";
  }

  if (
    includesAny(value, [
      "专门学校",
      "専門学校",
      "职业学校",
    ])
  ) {
    return "college";
  }

  if (
    includesAny(value, [
      "大学院",
      "大学",
      "本科",
      "修士",
      "硕士",
      "博士",
      "eju",
      "qs",
      "国立",
      "私立",
      "公立",
    ])
  ) {
    return "university";
  }

  return fallback;
}

function detectRegion(
  query: string
) {
  return REGION_KEYWORDS.find(
    (region) =>
      includesAny(
        query,
        region.keywords
      )
  )?.value;
}

function detectCollegeCategory(
  query: string
) {
  return COLLEGE_CATEGORY_KEYWORDS.find(
    (category) =>
      includesAny(
        query,
        category.keywords
      )
  )?.value;
}

function detectUniversityMajor(
  query: string
) {
  return UNIVERSITY_MAJOR_KEYWORDS.find(
    (major) =>
      includesAny(
        query,
        major.keywords
      )
  )?.value;
}

function escapeRegExp(
  value: string
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function cleanKeyword(
  query: string
) {
  let result = query;

  for (
    const region
    of REGION_KEYWORDS
  ) {
    for (
      const keyword
      of region.keywords
    ) {
      result =
        result.replace(
          new RegExp(
            escapeRegExp(
              keyword
            ),
            "gi"
          ),
          " "
        );
    }
  }

  const schoolWords = [
    "语言学校",
    "日本语学校",
    "日语学校",
    "日本語学校",
    "专门学校",
    "専門学校",
    "职业学校",
    "大学院",
    "大学",
  ];

  for (
    const word
    of schoolWords
  ) {
    result =
      result.replace(
        new RegExp(
          escapeRegExp(word),
          "gi"
        ),
        " "
      );
  }

  return result
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchUrl(
  rawQuery: string,
  selectedType: SchoolType
) {
  const query =
    rawQuery.trim();

  const type =
    detectSchoolType(
      query,
      selectedType
    );

  const region =
    detectRegion(query);

  const params =
    new URLSearchParams();

  /* =========================================================
     UNIVERSITY
  ========================================================= */

  if (
    type === "university"
  ) {
    if (region) {
      params.set(
        "region",
        region
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

    if (
      includesAny(query, [
        "本科",
      ])
    ) {
      params.set(
        "degree",
        "大学"
      );
    }

    const major =
      detectUniversityMajor(
        query
      );

    if (major) {
      params.set(
        "major",
        major
      );
    }

    if (
      includesAny(query, [
        "文科",
      ])
    ) {
      params.set(
        "category",
        "文科"
      );
    }

    if (
      includesAny(query, [
        "理科",
      ])
    ) {
      params.set(
        "category",
        "理科"
      );
    }

    if (
      includesAny(query, [
        "医学",
      ])
    ) {
      params.set(
        "category",
        "医学"
      );
    }

    if (
      includesAny(query, [
        "艺术",
      ])
    ) {
      params.set(
        "category",
        "艺术"
      );
    }

    if (
      includesAny(query, [
        "eju",
      ])
    ) {
      params.set(
        "eju",
        "需要"
      );
    }

    let remaining =
      cleanKeyword(query);

    if (major) {
      const majorConfig =
        UNIVERSITY_MAJOR_KEYWORDS.find(
          (item) =>
            item.value ===
            major
        );

      if (majorConfig) {
        for (
          const keyword
          of majorConfig.keywords
        ) {
          remaining =
            remaining.replace(
              new RegExp(
                escapeRegExp(
                  keyword
                ),
                "gi"
              ),
              " "
            );
        }
      }
    }

    remaining =
      remaining
        .replace(
          /国立大学|国立|私立大学|私立|公立大学|公立|本科|修士|硕士|博士|eju|qs/gi,
          " "
        )
        .replace(
          /文科|理科|医学|艺术/gi,
          " "
        )
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    if (remaining) {
      params.set(
        "q",
        remaining
      );
    }

    const search =
      params.toString();

    return search
      ? `/schools/university?${search}`
      : "/schools/university";
  }

  /* =========================================================
     LANGUAGE
  ========================================================= */

  if (
    type === "language"
  ) {
    if (region) {
      params.set(
        "region",
        region
      );
    }

    if (
      includesAny(query, [
        "中文",
        "中文支持",
      ])
    ) {
      params.set(
        "quick",
        "chinese"
      );
    }

    if (
      includesAny(query, [
        "便宜",
        "学费低",
        "低学费",
      ])
    ) {
      params.set(
        "quick",
        "cheap"
      );
    }

    if (
      includesAny(query, [
        "避坑",
        "安全",
        "低风险",
      ])
    ) {
      params.set(
        "quick",
        "safe"
      );
    }

    if (
      includesAny(query, [
        "大学升学",
      ])
    ) {
      params.set(
        "quick",
        "university"
      );
    }

    let remaining =
      cleanKeyword(query);

    remaining =
      remaining
        .replace(
          /中文支持|中文|大学升学|便宜|低学费|学费低|避坑|安全|低风险/gi,
          " "
        )
        .replace(
          /\s+/g,
          " "
        )
        .trim();

    if (remaining) {
      params.set(
        "q",
        remaining
      );
    }

    const search =
      params.toString();

    return search
      ? `/schools/language?${search}`
      : "/schools/language";
  }

  /* =========================================================
     COLLEGE
  ========================================================= */

  if (region) {
    params.set(
      "region",
      region
    );
  }

  const category =
    detectCollegeCategory(
      query
    );

  if (category) {
    params.set(
      "category",
      category
    );
  }

  let remaining =
    cleanKeyword(query);

  if (category) {
    const categoryData =
      COLLEGE_CATEGORY_KEYWORDS.find(
        (item) =>
          item.value ===
          category
      );

    if (categoryData) {
      for (
        const keyword
        of categoryData.keywords
      ) {
        remaining =
          remaining.replace(
            new RegExp(
              escapeRegExp(
                keyword
              ),
              "gi"
            ),
            " "
          );
      }
    }
  }

  remaining =
    remaining
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  if (remaining) {
    params.set(
      "q",
      remaining
    );
  }

  const search =
    params.toString();

  return search
    ? `/schools/college?${search}`
    : "/schools/college";
}

export default function SchoolsPage() {
  const router =
    useRouter();

  const [
    keyword,
    setKeyword,
  ] =
    useState("");

  const [
    selectedType,
    setSelectedType,
  ] =
    useState<SchoolType>(
      "university"
    );

  const [
    showAllRegions,
    setShowAllRegions,
  ] =
    useState(false);

  const handleSearch = (
    event?: FormEvent
  ) => {
    event?.preventDefault();

    const query =
      keyword.trim();

    if (!query) {
      if (
        selectedType ===
        "university"
      ) {
        router.push(
          "/schools/university"
        );

        return;
      }

      if (
        selectedType ===
        "language"
      ) {
        router.push(
          "/schools/language"
        );

        return;
      }

      router.push(
        "/schools/college"
      );

      return;
    }

    router.push(
      buildSearchUrl(
        query,
        selectedType
      )
    );
  };

  return (
    <main className="bg-slate-50 pb-24">
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.26),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(249,115,22,0.14),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.12),transparent_30%)]" />

        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <Container>
          <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:py-24 lg:py-28">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <Building2
                size={16}
              />

              Sakura 日本学校中心
            </div>

            <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              在日本找到

              <span className="block bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                真正适合你的学校
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              大学・大学院、语言学校、专门学校。
              从学校信息、专业、学费到就业和真实评价，
              尽量让找学校这件事变得简单一点。
            </p>

            <form
              onSubmit={
                handleSearch
              }
              className="mx-auto mt-10 max-w-3xl"
            >
              <div className="rounded-3xl border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-xl">
                <div className="mb-2 grid grid-cols-3 gap-1 rounded-2xl bg-slate-950/40 p-1">
                  <SearchTypeButton
                    active={
                      selectedType ===
                      "university"
                    }
                    onClick={() =>
                      setSelectedType(
                        "university"
                      )
                    }
                  >
                    大学・大学院
                  </SearchTypeButton>

                  <SearchTypeButton
                    active={
                      selectedType ===
                      "language"
                    }
                    onClick={() =>
                      setSelectedType(
                        "language"
                      )
                    }
                  >
                    语言学校
                  </SearchTypeButton>

                  <SearchTypeButton
                    active={
                      selectedType ===
                      "college"
                    }
                    onClick={() =>
                      setSelectedType(
                        "college"
                      )
                    }
                  >
                    专门学校
                  </SearchTypeButton>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row">
                  <div className="flex min-w-0 flex-1 items-center">
                    <Search
                      size={20}
                      className="ml-4 shrink-0 text-slate-400"
                    />

                    <input
                      value={
                        keyword
                      }
                      onChange={(
                        event
                      ) =>
                        setKeyword(
                          event
                            .target
                            .value
                        )
                      }
                      placeholder="试试：东京 IT、名古屋语言学校、大阪动漫..."
                      className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    搜索学校

                    <ArrowRight
                      size={17}
                    />
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                "东京 IT",
                "名古屋语言学校",
                "大阪 动漫",
                "国立大学",
              ].map(
                (item) => (
                  <button
                    key={
                      item
                    }
                    type="button"
                    onClick={() => {
                      setKeyword(
                        item
                      );

                      router.push(
                        buildSearchUrl(
                          item,
                          selectedType
                        )
                      );
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <HeroPoint>
                学校信息
              </HeroPoint>

              <HeroPoint>
                留学生支持
              </HeroPoint>

              <HeroPoint>
                学费・就业
              </HeroPoint>

              <HeroPoint>
                评价・避坑
              </HeroPoint>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================
          THREE MODULES
      ========================================================= */}

      <section className="relative z-10 -mt-8">
        <Container>
          <div className="grid gap-5 px-4 lg:grid-cols-3">
            {schoolTypes.map(
              (school) => {
                const Icon =
                  school.icon;

                return (
                  <Link
                    key={
                      school.id
                    }
                    href={
                      school.href
                    }
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-3xl
                      border
                      border-slate-200
                      bg-white
                      p-7
                      shadow-lg
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      ${school.hover}
                    `}
                  >
                    <div className="absolute right-5 top-4 text-6xl font-black text-slate-100">
                      {
                        school.number
                      }
                    </div>

                    <div
                      className={`
                        relative
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        ${school.theme}
                      `}
                    >
                      <Icon
                        size={26}
                      />
                    </div>

                    <div className="relative mt-6">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {
                          school.subtitle
                        }
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-slate-950">
                        {
                          school.title
                        }
                      </h2>

                      <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-500">
                        {
                          school.description
                        }
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="text-sm font-bold text-slate-700">
                          进入学校库
                        </span>

                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            transition
                            group-hover:translate-x-1
                            ${school.theme}
                          `}
                        >
                          <ArrowRight
                            size={17}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </Container>
      </section>

      {/* =========================================================
          QUICK START
      ========================================================= */}

      <section className="py-20">
        <Container>
          <SectionHeader
            badge="START HERE"
            title="你想从哪里开始？"
            description="已经知道地区或者专业的话，可以直接进入对应学校类型继续筛选。"
          />

          <div className="mt-9 grid gap-8 lg:grid-cols-2">
            {/* REGION */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPin
                      size={21}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      按地区找
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      大学・大学院 / 语言学校 / 专门学校
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowAllRegions(
                      (value) =>
                        !value
                    )
                  }
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                >
                  {showAllRegions
                    ? "收起"
                    : "全国47地区"}

                  {showAllRegions ? (
                    <ChevronUp
                      size={14}
                    />
                  ) : (
                    <ChevronDown
                      size={14}
                    />
                  )}
                </button>
              </div>

              {/* Popular */}

              <div className="mt-6 space-y-3">
                {popularRegions.map(
                  (region) => (
                    <RegionItem
                      key={
                        region.name
                      }
                      prefecture={
                        region.name
                      }
                      description={
                        region.description
                      }
                    />
                  )
                )}
              </div>

              {/* All Japan */}

              {showAllRegions && (
                <div className="mt-7 border-t border-slate-100 pt-7">
                  <div className="mb-6">
                    <p className="text-sm font-black text-slate-900">
                      日本全国 47 都道府县
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      点击地区后直接选择学校类型
                    </p>
                  </div>

                  <div className="space-y-7">
                    {japanRegions.map(
                      (group) => (
                        <div
                          key={
                            group.name
                          }
                        >
                          <p className="mb-3 text-xs font-black tracking-wider text-slate-400">
                            {
                              group.name
                            }
                          </p>

                          <div className="grid gap-2 sm:grid-cols-2">
                            {group.prefectures.map(
                              (
                                prefecture
                              ) => (
                                <PrefectureItem
                                  key={
                                    prefecture
                                  }
                                  prefecture={
                                    prefecture
                                  }
                                />
                              )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MAJOR */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <BriefcaseBusiness
                    size={21}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    按专业找
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    大学・大学院 / 专门学校
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {majors.map(
                  (major) => (
                    <div
                      key={
                        major.name
                      }
                      className="rounded-2xl border border-slate-200 p-4 transition hover:border-orange-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl">
                          {
                            major.icon
                          }
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-black text-slate-900">
                            {
                              major.name
                            }
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {
                              major.description
                            }
                          </p>

                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            <SchoolRouteButton
                              href={
                                major.universityHref
                              }
                              theme="blue"
                            >
                              大学・大学院
                            </SchoolRouteButton>

                            <SchoolRouteButton
                              href={
                                major.collegeHref
                              }
                              theme="orange"
                            >
                              专门学校
                            </SchoolRouteButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================
          AI
      ========================================================= */}

      <section className="pb-20">
        <Container>
          <div className="relative overflow-hidden rounded-[32px] bg-slate-950 px-7 py-10 text-white shadow-xl sm:px-10 lg:px-14 lg:py-14">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_320px] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-300">
                  <Sparkles
                    size={15}
                  />

                  SAKURA AI SCHOOL MATCH
                </div>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  不知道该选哪类学校？
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">
                  后续根据日语水平、成绩、预算、
                  想学的专业和未来就业目标，
                  自动推荐大学、语言学校或者专门学校。
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    "日语水平",
                    "预算",
                    "专业方向",
                    "地区",
                    "就业目标",
                  ].map(
                    (item) => (
                      <span
                        key={
                          item
                        }
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-blue-400" />

                  <p className="font-bold">
                    AI 推荐功能
                  </p>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  等真实学校数据和后端接入后，
                  这里直接接 Sakura AI 推荐系统。
                </p>

                {/*
                TODO [API - POST]

                POST /api/schools/recommend

                Body:
                {
                  japaneseLevel,
                  budget,
                  region,
                  major,
                  goal
                }
                */}

                <button
                  type="button"
                  disabled
                  className="mt-5 flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-slate-400"
                >
                  即将开放
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================
          WARNING
      ========================================================= */}

      <section className="bg-white py-20">
        <Container>
          <SectionHeader
            badge="SAFETY"
            title="申请学校前，先把这些问题确认清楚"
            description="比起单纯告诉用户哪所学校好，更重要的是告诉他该看什么。"
          />

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {warnings.map(
              (warning) => (
                <div
                  key={
                    warning.title
                  }
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-xl
                      ${
                        warning.level ===
                        "high"
                          ? "bg-red-50 text-red-600"
                          : warning.level ===
                              "medium"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-amber-50 text-amber-600"
                      }
                    `}
                  >
                    <CircleAlert
                      size={21}
                    />
                  </div>

                  <h3 className="mt-5 font-black text-slate-900">
                    {
                      warning.title
                    }
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {
                      warning.description
                    }
                  </p>
                </div>
              )
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/scam"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-600 transition hover:text-red-700"
            >
              查看更多避坑信息

              <ArrowRight
                size={16}
              />
            </Link>
          </div>
        </Container>
      </section>

      {/* =========================================================
          FEATURED
      ========================================================= */}

      <section className="py-20">
        <Container>
          <SectionHeader
            badge="FEATURED"
            title="值得先看看的学校"
            description="这里以后根据真实评分、收藏量、信息完整度和留学生反馈自动生成。"
          />

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {featuredSchools.map(
              (school) => (
                <Link
                  key={
                    school.href
                  }
                  href={
                    school.href
                  }
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${school.theme}`}
                    >
                      {
                        school.type
                      }
                    </span>

                    <div className="flex items-center gap-1 text-sm font-black text-amber-500">
                      <Star
                        size={15}
                        className="fill-current"
                      />

                      {
                        school.rating
                      }
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-900">
                    {
                      school.name
                    }
                  </h3>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin
                      size={14}
                    />

                    {
                      school.location
                    }
                  </p>

                  <p className="mt-4 min-h-[56px] text-sm leading-7 text-slate-500">
                    {
                      school.description
                    }
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-sm font-bold text-slate-700">
                      查看学校详情
                    </span>

                    <ArrowRight
                      size={17}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </div>
                </Link>
              )
            )}
          </div>
        </Container>
      </section>

      {/* =========================================================
          BOTTOM
      ========================================================= */}

      <section>
        <Container>
          <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <BookOpen
                size={26}
              />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              三种学校，先选你现在最需要的
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              想读大学就看大学・大学院，
              需要日语和升学准备就看语言学校，
              想学职业技能并尽快就业就看专门学校。
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <BottomButton
                href="/schools/university"
                className="bg-blue-600 hover:bg-blue-700"
              >
                大学・大学院
              </BottomButton>

              <BottomButton
                href="/schools/language"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                语言学校
              </BottomButton>

              <BottomButton
                href="/schools/college"
                className="bg-orange-500 hover:bg-orange-600"
              >
                专门学校
              </BottomButton>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/* ================================================================
   Region Components
================================================================ */

function RegionItem({
  prefecture,
  description,
}: {
  prefecture: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-slate-900">
            {prefecture}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {description}
          </p>
        </div>

        <MapPin
          size={17}
          className="mt-1 shrink-0 text-slate-300"
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <SchoolRouteButton
          href={`/schools/university?region=${encodeURIComponent(
            prefecture
          )}`}
          theme="blue"
        >
          大学・大学院
        </SchoolRouteButton>

        <SchoolRouteButton
          href={`/schools/language?region=${encodeURIComponent(
            prefecture
          )}`}
          theme="emerald"
        >
          语言学校
        </SchoolRouteButton>

        <SchoolRouteButton
          href={`/schools/college?region=${encodeURIComponent(
            prefecture
          )}`}
          theme="orange"
        >
          专门学校
        </SchoolRouteButton>
      </div>
    </div>
  );
}

function PrefectureItem({
  prefecture,
}: {
  prefecture: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-slate-800">
          {prefecture}
        </span>

        <MapPin
          size={14}
          className="text-slate-300"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <MiniSchoolLink
          href={`/schools/university?region=${encodeURIComponent(
            prefecture
          )}`}
          theme="blue"
        >
          大学
        </MiniSchoolLink>

        <MiniSchoolLink
          href={`/schools/language?region=${encodeURIComponent(
            prefecture
          )}`}
          theme="emerald"
        >
          语言
        </MiniSchoolLink>

        <MiniSchoolLink
          href={`/schools/college?region=${encodeURIComponent(
            prefecture
          )}`}
          theme="orange"
        >
          专门
        </MiniSchoolLink>
      </div>
    </div>
  );
}

/* ================================================================
   Small Components
================================================================ */

function SearchTypeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-xl
        px-3
        py-2.5
        text-xs
        font-bold
        transition
        sm:text-sm
        ${
          active
            ? "bg-white text-slate-950 shadow"
            : "text-slate-400 hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}

function HeroPoint({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <BadgeCheck
        size={15}
        className="text-emerald-400"
      />

      {children}
    </span>
  );
}

function SectionHeader({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-black tracking-[0.2em] text-blue-600">
        {badge}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function SchoolRouteButton({
  href,
  theme,
  children,
}: {
  href: string;
  theme:
    | "blue"
    | "emerald"
    | "orange";
  children: ReactNode;
}) {
  const style =
    theme === "blue"
      ? "border-blue-100 bg-blue-50 text-blue-700 hover:border-blue-200 hover:bg-blue-100"
      : theme ===
          "emerald"
        ? "border-emerald-100 bg-emerald-50 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-100"
        : "border-orange-100 bg-orange-50 text-orange-700 hover:border-orange-200 hover:bg-orange-100";

  return (
    <Link
      href={href}
      className={`
        group
        flex
        items-center
        justify-between
        gap-2
        rounded-xl
        border
        px-3
        py-2.5
        text-xs
        font-bold
        transition
        ${style}
      `}
    >
      {children}

      <ChevronRight
        size={14}
        className="transition group-hover:translate-x-0.5"
      />
    </Link>
  );
}

function MiniSchoolLink({
  href,
  theme,
  children,
}: {
  href: string;
  theme:
    | "blue"
    | "emerald"
    | "orange";
  children: ReactNode;
}) {
  const style =
    theme === "blue"
      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
      : theme ===
          "emerald"
        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        : "bg-orange-50 text-orange-700 hover:bg-orange-100";

  return (
    <Link
      href={href}
      className={`rounded-lg px-2 py-1.5 text-center text-[11px] font-bold transition ${style}`}
    >
      {children}
    </Link>
  );
}

function BottomButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        inline-flex
        h-11
        items-center
        justify-center
        gap-2
        rounded-xl
        px-5
        text-sm
        font-bold
        text-white
        transition
        ${className}
      `}
    >
      {children}

      <ArrowRight
        size={16}
      />
    </Link>
  );
}