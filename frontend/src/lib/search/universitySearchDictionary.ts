import { japanPrefectures } from "@/data/japanLocations";

export type UniversitySearchConceptType =
  | "location"
  | "type"
  | "degree"
  | "category"
  | "major"
  | "condition";

export interface UniversitySearchConcept {
  key: string;
  type: UniversitySearchConceptType;
  aliases: string[];
}

export interface ParsedUniversitySearchGroup {
  key: string;
  type:
    | UniversitySearchConceptType
    | "literal";
  query: string;
  aliases: string[];
}

/* =========================
   NORMALIZE
========================= */

export function normalizeUniversitySearchText(
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

/* =========================
   NOISE WORDS
========================= */

const UNIVERSITY_SEARCH_NOISE_WORDS = [
  "找大学",
  "找学校",
  "学校",
];

/* =========================
   PREFECTURES
========================= */

const PREFECTURE_CONCEPTS: UniversitySearchConcept[] =
  japanPrefectures.map(
    (prefecture) => ({
      key: prefecture.key,
      type: "location",
      aliases: prefecture.aliases,
    })
  );

/* =========================
   SEARCH DICTIONARY
========================= */

export const UNIVERSITY_SEARCH_CONCEPTS: UniversitySearchConcept[] =
  [
    ...PREFECTURE_CONCEPTS,

    /* ---------- 学校类型 ---------- */

    {
      key: "national",
      type: "type",
      aliases: [
        "国立",
        "国立大学",
        "国立大",
      ],
    },

    {
      key: "public",
      type: "type",
      aliases: [
        "公立",
        "公立大学",
        "公立大",
      ],
    },

    {
      key: "private",
      type: "type",
      aliases: [
        "私立",
        "私立大学",
        "私立大",
      ],
    },

    /* ---------- 学历 ---------- */

    {
      key: "undergraduate",
      type: "degree",
      aliases: [
        "本科",
        "学部",
        "大学本科",
      ],
    },

    {
      key: "graduate",
      type: "degree",
      aliases: [
        "大学院",
        "研究生院",
        "硕士",
        "博士",
        "修士",
      ],
    },

    /* ---------- 学科类别 ---------- */

    {
      key: "humanities",
      type: "category",
      aliases: [
        "文科",
        "人文",
      ],
    },

    {
      key: "science",
      type: "category",
      aliases: [
        "理科",
        "理系",
      ],
    },

    {
      key: "medical",
      type: "category",
      aliases: [
        "医学",
        "医疗",
        "医療",
      ],
    },

    {
      key: "art",
      type: "category",
      aliases: [
        "艺术",
        "艺术类",
        "芸術",
      ],
    },

    /* ---------- 专业领域 ---------- */

    {
      key: "it-ai",
      type: "major",
      aliases: [
        "it",
        "ai",
        "人工智能",
        "计算机",
        "计算机科学",
        "信息",
        "信息学",
        "情報",
        "情報科学",
      ],
    },

    {
      key: "economics-business",
      type: "major",
      aliases: [
        "经济",
        "经济学",
        "经营",
        "经营学",
        "商科",
        "商学",
        "経済",
        "経営",
      ],
    },

    {
      key: "literature-language",
      type: "major",
      aliases: [
        "文学",
        "语言",
        "语言学",
        "日语",
        "文学语言",
      ],
    },

    {
      key: "law-politics",
      type: "major",
      aliases: [
        "法学",
        "法律",
        "政治",
        "政治学",
      ],
    },

    {
      key: "engineering",
      type: "major",
      aliases: [
        "理工",
        "工学",
        "机械",
        "机械工程",
        "工程",
      ],
    },

    {
      key: "medicine-health",
      type: "major",
      aliases: [
        "医学",
        "医疗",
        "医療",
        "医学医疗",
      ],
    },

    {
      key: "art-design",
      type: "major",
      aliases: [
        "艺术设计",
        "设计",
        "美术",
        "デザイン",
      ],
    },

    {
      key: "education-social",
      type: "major",
      aliases: [
        "教育",
        "社会",
        "社会学",
        "教育学",
      ],
    },

    /* ---------- 条件 ---------- */
    
    {
      key: "no-eju",
      type: "condition",
      aliases: [
        "不要eju",
        "无需eju",
        "免eju",
        "不用留考",
        "无需留考",
      ],
    },

    {
      key: "eju",
      type: "condition",
      aliases: [
        "eju",
        "留考",
        "日本留学试验",
        "日本留学試験",
      ],
    },

    {
      key: "scholarship",
      type: "condition",
      aliases: [
        "奖学金",
        "奨学金",
      ],
    },

    {
      key: "english",
      type: "condition",
      aliases: [
        "英语",
        "英文课程",
        "英语课程",
        "english",
        "英語",
      ],
    },

    {
      key: "top50",
      type: "condition",
      aliases: [
        "qs50",
        "qs前50",
        "世界前50",
        "top50",
      ],
    },

    {
      key: "top100",
      type: "condition",
      aliases: [
        "qs100",
        "qs前100",
        "世界前100",
        "top100",
      ],
    },

    {
      key: "top200",
      type: "condition",
      aliases: [
        "qs200",
        "qs前200",
        "世界前200",
        "top200",
      ],
    },
  ];

/* =========================
   NORMALIZED
========================= */

const NORMALIZED_CONCEPTS =
  UNIVERSITY_SEARCH_CONCEPTS.map(
    (concept) => ({
      ...concept,
      aliases: concept.aliases.map(
        normalizeUniversitySearchText
      ),
    })
  );

/* =========================
   PARSER
========================= */

export function parseUniversitySearch(
  search: string
): ParsedUniversitySearchGroup[] {
  let remainingText =
    normalizeUniversitySearchText(
      search
    );

  for (const noiseWord of UNIVERSITY_SEARCH_NOISE_WORDS) {
    remainingText =
      remainingText.replaceAll(
        normalizeUniversitySearchText(
          noiseWord
        ),
        ""
      );
  }

  const groups: ParsedUniversitySearchGroup[] =
    [];

  const matchedKeys =
    new Set<string>();

  for (const concept of NORMALIZED_CONCEPTS) {
    const matchedAlias =
      [...concept.aliases]
        .sort(
          (a, b) =>
            b.length - a.length
        )
        .find((alias) =>
          remainingText.includes(alias)
        );

    if (!matchedAlias) {
      continue;
    }

    if (
      matchedKeys.has(concept.key)
    ) {
      continue;
    }

    groups.push({
      key: concept.key,
      type: concept.type,
      query: matchedAlias,
      aliases: concept.aliases,
    });

    matchedKeys.add(concept.key);

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