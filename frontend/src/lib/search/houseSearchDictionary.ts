import { japanPrefectures } from "@/data/japanLocations";

export type HouseSearchConceptType =
  | "location"
  | "station"
  | "layout"
  | "feature"
  | "condition";

export interface HouseSearchConcept {
  key: string;
  type: HouseSearchConceptType;
  aliases: string[];
}

export interface ParsedHouseSearchGroup {
  key: string;
  type: HouseSearchConceptType | "literal";
  query: string;
  aliases: string[];
}

/* =========================
   NORMALIZE
========================= */

export function normalizeHouseSearchText(
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

const HOUSE_SEARCH_NOISE_WORDS = [
  "找房",
  "找房子",
  "租房",
  "租房子",
  "房子",
  "房源",
  "出租",
  "租赁",
  "賃貸",
  "物件",
  "公寓",
  "マンション",
  "アパート",
];

/* =========================
   SEARCH DICTIONARY
========================= */

const PREFECTURE_SEARCH_CONCEPTS: HouseSearchConcept[] =
  japanPrefectures.map((prefecture) => ({
    key: prefecture.key,
    type: "location",
    aliases: prefecture.aliases,
  }));

export const HOUSE_SEARCH_CONCEPTS: HouseSearchConcept[] =
  [
    ...PREFECTURE_SEARCH_CONCEPTS,

  /* ---------- 城市 / 车站 ---------- */

    {
      key: "yokohama",
      type: "location",
      aliases: [
        "横滨",
        "横浜",
        "横滨市",
        "横浜市",
      ],
    },

    {
      key: "ikebukuro",
      type: "station",
      aliases: [
        "池袋",
        "池袋站",
        "池袋駅",
      ],
    },

    {
      key: "shinjuku",
      type: "station",
      aliases: [
        "新宿",
        "新宿站",
        "新宿駅",
      ],
    },

    {
      key: "takadanobaba",
      type: "station",
      aliases: [
        "高田马场",
        "高田馬場",
        "高田马场站",
        "高田馬場駅",
      ],
    },

    {
      key: "nakano",
      type: "station",
      aliases: [
        "中野",
        "中野站",
        "中野駅",
      ],
    },

    {
      key: "namba",
      type: "station",
      aliases: [
        "难波",
        "難波",
        "なんば",
        "难波站",
        "難波駅",
      ],
    },

    {
      key: "kannai",
      type: "station",
      aliases: [
        "关内",
        "関内",
        "关内站",
        "関内駅",
      ],
    },

    /* ---------- 户型 ---------- */

    {
      key: "1r",
      type: "layout",
      aliases: [
        "1r",
        "studio",
        "单间",
        "开间",
        "ワンルーム",
      ],
    },

    {
      key: "1k",
      type: "layout",
      aliases: [
        "1k",
      ],
    },

    {
      key: "1dk",
      type: "layout",
      aliases: [
        "1dk",
      ],
    },

    {
      key: "1ldk",
      type: "layout",
      aliases: [
        "1ldk",
      ],
    },

    {
      key: "2k",
      type: "layout",
      aliases: [
        "2k",
      ],
    },

    {
      key: "2dk",
      type: "layout",
      aliases: [
        "2dk",
      ],
    },

    {
      key: "2ldk",
      type: "layout",
      aliases: [
        "2ldk",
      ],
    },

    {
      key: "3ldk",
      type: "layout",
      aliases: [
        "3ldk",
      ],
    },

    /* ---------- 房源特点 ---------- */

    {
      key: "pet_allowed",
      type: "feature",
      aliases: [
        "宠物可",
        "可养宠物",
        "可以养宠物",
        "宠物",
        "ペット可",
        "ペット相談",
      ],
    },

    {
      key: "foreigner_friendly",
      type: "feature",
      aliases: [
        "外国人可",
        "外国人欢迎",
        "外国人入住可",
        "外国人相談可",
        "外国籍可",
        "外国人ok",
      ],
    },

    {
      key: "student_allowed",
      type: "feature",
      aliases: [
        "留学生可",
        "学生可",
        "学生欢迎",
        "留学生欢迎",
      ],
    },

    {
      key: "furnished",
      type: "feature",
      aliases: [
        "家具家电",
        "家具家电齐全",
        "带家具",
        "带家电",
        "拎包入住",
        "家具付き",
        "家電付き",
      ],
    },

    {
      key: "no_deposit",
      type: "feature",
      aliases: [
        "敷金0",
        "敷金零",
        "免敷金",
        "无敷金",
        "敷金なし",
        "敷金ゼロ",
      ],
    },

    {
      key: "no_key_money",
      type: "feature",
      aliases: [
        "礼金0",
        "礼金零",
        "免礼金",
        "无礼金",
        "礼金なし",
        "礼金ゼロ",
      ],
    },

    {
      key: "no_guarantor",
      type: "feature",
      aliases: [
        "不要保证人",
        "无需保证人",
        "无保证人",
        "保证人不要",
        "保証人不要",
      ],
    },

    {
      key: "near_station",
      type: "feature",
      aliases: [
        "近车站",
        "车站近",
        "駅近",
      ],
    },

    {
      key: "south_facing",
      type: "feature",
      aliases: [
        "南向",
        "朝南",
        "南向き",
      ],
    },

    {
      key: "immediate_move_in",
      type: "feature",
      aliases: [
        "即日入住",
        "马上入住",
        "立即入住",
        "即入居可",
        "即入居",
      ],
    },
  ];

/* =========================
   NORMALIZED DICTIONARY
========================= */

const NORMALIZED_HOUSE_SEARCH_CONCEPTS =
  HOUSE_SEARCH_CONCEPTS.map(
    (concept) => ({
      ...concept,
      aliases: concept.aliases.map(
        normalizeHouseSearchText
      ),
    })
  );

/* =========================
   PARSER
========================= */

export function parseHouseSearch(
  search: string
): ParsedHouseSearchGroup[] {
  let remainingText =
    normalizeHouseSearchText(search);

  for (const noiseWord of HOUSE_SEARCH_NOISE_WORDS) {
    remainingText =
      remainingText.replaceAll(
        normalizeHouseSearchText(
          noiseWord
        ),
        ""
      );
  }

  const groups: ParsedHouseSearchGroup[] =
    [];

  const matchedConceptKeys =
    new Set<string>();

  for (const concept of NORMALIZED_HOUSE_SEARCH_CONCEPTS) {
    const matchedAlias =
      concept.aliases
        .sort(
          (a, b) =>
            b.length - a.length
        )
        .find((alias) =>
          remainingText.includes(
            alias
          )
        );

    if (!matchedAlias) {
      continue;
    }

    if (
      matchedConceptKeys.has(
        concept.key
      )
    ) {
      continue;
    }

    groups.push({
      key: concept.key,
      type: concept.type,
      query: matchedAlias,
      aliases: concept.aliases,
    });

    matchedConceptKeys.add(
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

/* =========================
   SEARCH GROUPS
========================= */

export function getHouseSearchGroups(
  search: string
): string[][] {
  return parseHouseSearch(
    search
  ).map(
    (group) =>
      Array.from(
        new Set(group.aliases)
      )
  );
}