import { japanPrefectures } from "@/data/japanLocations";

export type CollegeSearchConceptType =
  | "location"
  | "category"
  | "support"
  | "condition";

export interface CollegeSearchConcept {
  key: string;
  type: CollegeSearchConceptType;
  aliases: string[];
}

export interface ParsedCollegeSearchGroup {
  key: string;
  type:
    | CollegeSearchConceptType
    | "literal";
  query: string;
  aliases: string[];
}

/* =========================================================
   NORMALIZE
========================================================= */

export function normalizeCollegeSearchText(
  value: string
) {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(
      /[・·.,，。!！?？:：;；'"“”‘’()（）[\]【】{}<>《》\-_/／｜|]/g,
      ""
    );
}

/* =========================================================
   NOISE WORDS

   注意：
   不把「学校」「专门学校」单独当噪音词。
   因为真实学校名称本身就包含这些词。
========================================================= */

const COLLEGE_SEARCH_NOISE_WORDS = [
  "找专门学校",
  "找学校",
  "帮我找",
  "想找",
];

/* =========================================================
   47 都道府县
========================================================= */

const PREFECTURE_CONCEPTS: CollegeSearchConcept[] =
  japanPrefectures.map(
    (prefecture) => ({
      key: prefecture.key,
      type: "location",
      aliases: prefecture.aliases,
    })
  );

/* =========================================================
   SEARCH DICTIONARY
========================================================= */

export const COLLEGE_SEARCH_CONCEPTS: CollegeSearchConcept[] =
  [
    ...PREFECTURE_CONCEPTS,

    /* =====================================================
       专业方向
       对应当前 College["category"] 的真实 6 类
    ===================================================== */

    {
      key: "it-ai",
      type: "category",
      aliases: [
        "it・ai",
        "itai",
        "it",
        "ai",
        "人工智能",
        "计算机",
        "电脑",
        "程序开发",
        "编程",
        "程序员",
        "web开发",
        "网络工程",
        "信息技术",
        "情報",
      ],
    },

    {
      key: "design-anime",
      type: "category",
      aliases: [
        "设计・动漫",
        "设计动漫",
        "设计",
        "动漫",
        "动画",
        "游戏设计",
        "平面设计",
        "视觉设计",
        "插画",
        "艺术设计",
        "デザイン",
        "アニメ",
      ],
    },

    {
      key: "business-tourism",
      type: "category",
      aliases: [
        "商务・观光",
        "商务观光",
        "商务",
        "商业",
        "观光",
        "旅游",
        "酒店",
        "酒店观光",
        "航空",
        "航空服务",
        "商务日语",
        "ビジネス",
        "観光",
      ],
    },

    {
      key: "beauty-fashion",
      type: "category",
      aliases: [
        "美容・时尚",
        "美容时尚",
        "美容",
        "美发",
        "化妆",
        "时尚",
        "服装",
        "造型",
        "造型设计",
        "ファッション",
        "美容師",
      ],
    },

    {
      key: "medical-welfare",
      type: "category",
      aliases: [
        "医疗・福祉",
        "医疗福祉",
        "医疗",
        "医学",
        "福祉",
        "介护",
        "护理",
        "医疗事务",
        "医疗事務",
        "医療",
        "介護",
      ],
    },

    {
      key: "auto-tech",
      type: "category",
      aliases: [
        "汽车・技术",
        "汽车技术",
        "汽车",
        "汽修",
        "汽车维修",
        "汽车整备",
        "自动车",
        "自動車",
        "整备士",
        "整備士",
        "机械技术",
      ],
    },

    /* =====================================================
       留学生支持
       对应真实 boolean 字段
    ===================================================== */

    {
      key: "chinese",
      type: "support",
      aliases: [
        "中文支持",
        "中文",
        "中国语支持",
        "中国語対応",
        "中国語サポート",
      ],
    },

    {
      key: "international",
      type: "support",
      aliases: [
        "留学生支持",
        "留学生",
        "外国人支持",
        "外国人友好",
        "外国人歓迎",
        "留学生サポート",
      ],
    },

    {
      key: "visa",
      type: "support",
      aliases: [
        "签证支持",
        "签证",
        "签证支援",
        "留学签证",
        "ビザ",
        "ビザサポート",
      ],
    },

    /* =====================================================
       学费
       对应真实 tuition 数值
    ===================================================== */

    {
      key: "tuition-under-100",
      type: "condition",
      aliases: [
        "100万以下",
        "100万以内",
        "学费100万以下",
        "学费100万以内",
        "100万円以下",
      ],
    },

    {
      key: "tuition-under-120",
      type: "condition",
      aliases: [
        "120万以下",
        "120万以内",
        "学费120万以下",
        "学费120万以内",
        "120万円以下",
      ],
    },

    {
      key: "cheap",
      type: "condition",
      aliases: [
        "学费便宜",
        "学费低",
        "低学费",
        "便宜",
        "学費安い",
      ],
    },

    /* =====================================================
       就业
       对应真实 employmentRate / tags
    ===================================================== */

    {
      key: "employment",
      type: "condition",
      aliases: [
        "就业",
        "就业支持",
        "就业指导",
        "就业率",
        "就职",
        "就職",
        "就职支持",
      ],
    },

    {
      key: "high-employment",
      type: "condition",
      aliases: [
        "就业率高",
        "高就业率",
        "就职率高",
        "就職率高い",
      ],
    },

    /* =====================================================
       资格证
       当前没有单独 boolean，
       但真实 tags 有「资格考试」「国家资格」
    ===================================================== */

    {
      key: "qualification",
      type: "condition",
      aliases: [
        "资格证",
        "资格考试",
        "国家资格",
        "考证",
        "資格",
        "国家資格",
      ],
    },

    /* =====================================================
       推荐
       对应真实 recommended
    ===================================================== */

    {
      key: "recommended",
      type: "condition",
      aliases: [
        "推荐",
        "推荐学校",
        "おすすめ",
      ],
    },
  ];

/* =========================================================
   NORMALIZED CONCEPTS

   alias 长词优先，避免：
   「就业率高」先被「就业」吃掉
   「留学生支持」先被较短词拆掉
========================================================= */

const NORMALIZED_CONCEPTS =
  COLLEGE_SEARCH_CONCEPTS.map(
    (concept) => ({
      ...concept,
      aliases: concept.aliases
        .map(
          normalizeCollegeSearchText
        )
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.length - a.length
        ),
    })
  ).sort((a, b) => {
    const aLength =
      a.aliases[0]?.length ?? 0;

    const bLength =
      b.aliases[0]?.length ?? 0;

    return bLength - aLength;
  });

/* =========================================================
   PARSER
========================================================= */

export function parseCollegeSearch(
  search: string
): ParsedCollegeSearchGroup[] {
  let remainingText =
    normalizeCollegeSearchText(
      search
    );

  for (const noiseWord of COLLEGE_SEARCH_NOISE_WORDS) {
    remainingText =
      remainingText.replaceAll(
        normalizeCollegeSearchText(
          noiseWord
        ),
        ""
      );
  }

  const groups: ParsedCollegeSearchGroup[] =
    [];

  const matchedKeys =
    new Set<string>();

  for (const concept of NORMALIZED_CONCEPTS) {
    if (
      matchedKeys.has(concept.key)
    ) {
      continue;
    }

    const matchedAlias =
      concept.aliases.find(
        (alias) =>
          remainingText.includes(
            alias
          )
      );

    if (!matchedAlias) {
      continue;
    }

    groups.push({
      key: concept.key,
      type: concept.type,
      query: matchedAlias,
      aliases: concept.aliases,
    });

    matchedKeys.add(
      concept.key
    );

    remainingText =
      remainingText.replace(
        matchedAlias,
        ""
      );
  }

  if (remainingText) {
    groups.push({
      key: `literal:${remainingText}`,
      type: "literal",
      query: remainingText,
      aliases: [remainingText],
    });
  }

  return groups;
}