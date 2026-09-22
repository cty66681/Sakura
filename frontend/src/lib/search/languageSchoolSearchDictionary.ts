import { japanPrefectures } from "@/data/japanLocations";

export type LanguageSchoolSearchConceptType =
  | "location"
  | "type"
  | "support"
  | "condition";

export interface LanguageSchoolSearchConcept {
  key: string;
  type: LanguageSchoolSearchConceptType;
  aliases: string[];
}

export interface ParsedLanguageSchoolSearchGroup {
  key: string;
  type:
    | LanguageSchoolSearchConceptType
    | "literal";
  query: string;
  aliases: string[];
}

/* =========================
   NORMALIZE
========================= */

export function normalizeLanguageSchoolSearchText(
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

const LANGUAGE_SCHOOL_NOISE_WORDS = [
  "找学校",
  "学校",
  "语言学校",
  "日本语言学校",
  "日语学校",
  "日本语学校",
  "日本語学校",
  "語学学校",
];

/* =========================
   PREFECTURES
========================= */

const PREFECTURE_CONCEPTS: LanguageSchoolSearchConcept[] =
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

export const LANGUAGE_SCHOOL_SEARCH_CONCEPTS: LanguageSchoolSearchConcept[] =
  [
    ...PREFECTURE_CONCEPTS,

    /* ---------- 学校方向 ---------- */

    {
      key: "advancement",
      type: "type",
      aliases: [
        "升学",
        "升学型",
        "進学",
        "進学型",
      ],
    },

    {
      key: "general",
      type: "type",
      aliases: [
        "综合",
        "综合型",
        "総合",
        "総合型",
      ],
    },

    {
      key: "employment",
      type: "type",
      aliases: [
        "就业",
        "就业型",
        "就職",
        "就職型",
      ],
    },

    /* ---------- 支持 ---------- */

    {
      key: "chinese",
      type: "support",
      aliases: [
        "中文",
        "中文支持",
        "中文可",
        "中国语",
        "中国語",
        "中国語対応",
      ],
    },

    {
      key: "university",
      type: "support",
      aliases: [
        "大学升学",
        "大学指导",
        "大学升学指导",
        "大学進学",
        "大学進学指導",
      ],
    },

    {
      key: "graduate",
      type: "support",
      aliases: [
        "大学院",
        "大学院升学",
        "大学院指导",
        "大学院升学指导",
        "大学院進学",
        "大学院進学指導",
        "研究生",
      ],
    },

    {
      key: "visa",
      type: "support",
      aliases: [
        "签证",
        "签证支持",
        "签证支援",
        "留学签证",
        "ビザ",
        "ビザサポート",
        "ビザ支援",
      ],
    },

    {
      key: "international-student",
      type: "support",
      aliases: [
        "留学生",
        "留学生支持",
        "外国人",
        "外国人友好",
        "外国人歓迎",
      ],
    },

    /* ---------- 条件 ---------- */

    {
      key: "cheap",
      type: "condition",
      aliases: [
        "学费低",
        "学费便宜",
        "便宜",
        "低学费",
        "学費安い",
      ],
    },

    {
      key: "safe",
      type: "condition",
      aliases: [
        "避坑",
        "安全",
        "低风险",
        "风险低",
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
  ];

/* =========================
   NORMALIZED
========================= */

const NORMALIZED_CONCEPTS =
  LANGUAGE_SCHOOL_SEARCH_CONCEPTS.map(
    (concept) => ({
      ...concept,
      aliases: concept.aliases.map(
        normalizeLanguageSchoolSearchText
      ),
    })
  );

/* =========================
   PARSER
========================= */

export function parseLanguageSchoolSearch(
  search: string
): ParsedLanguageSchoolSearchGroup[] {
  let remainingText =
    normalizeLanguageSchoolSearchText(
      search
    );

  for (const noiseWord of LANGUAGE_SCHOOL_NOISE_WORDS) {
    remainingText =
      remainingText.replaceAll(
        normalizeLanguageSchoolSearchText(
          noiseWord
        ),
        ""
      );
  }

  const groups: ParsedLanguageSchoolSearchGroup[] =
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