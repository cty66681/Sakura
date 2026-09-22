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
    .replace(
      /[\s・·.,，。!！?？:：;；'"“”‘’()（）\[\]【】{}<>《》_\-\/／｜|\\]/g,
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

  "帮我找",
  "帮我看看",
  "想找",
  "想租",
  "我要找",
  "我要租",
  "有没有",
  "有没有合适的",
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
        "池袋车站",
      ],
    },

    {
      key: "shinjuku",
      type: "station",
      aliases: [
        "新宿",
        "新宿站",
        "新宿駅",
        "新宿车站",
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
        "高田马场车站",
      ],
    },

    {
      key: "nakano",
      type: "station",
      aliases: [
        "中野",
        "中野站",
        "中野駅",
        "中野车站",
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
        "难波车站",
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
        "关内车站",
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

    /* ---------- 宠物 ---------- */

    {
      key: "pet_allowed",
      type: "feature",
      aliases: [
        "宠物可",
        "宠物可以",
        "可养宠物",
        "可以养宠物",
        "能养宠物",
        "允许宠物",
        "宠物入住可",
        "宠物",
        "ペット可",
        "ペット相談",
        "ペット相談可",
      ],
    },

    /* ---------- 外国人 ---------- */

    {
      key: "foreigner_friendly",
      type: "feature",
      aliases: [
        "外国人可",
        "外国人ok",
        "外国人可以",
        "外国人欢迎",

        "外国人可住",
        "外国人可以住",
        "外国人能住",

        "外国人可入住",
        "外国人可以入住",
        "外国人入住可",

        "外国人可租",
        "外国人可以租",
        "外国人能租",

        "外国籍可",
        "外国籍ok",
        "外国籍可以",
        "外国籍歓迎",

        "外国人相談可",
        "外国籍相談可",
      ],
    },

    /* ---------- 学生 / 留学生 ---------- */

    {
      key: "student_allowed",
      type: "feature",
      aliases: [
        "学生可",
        "学生ok",
        "学生可以",
        "学生欢迎",

        "学生可住",
        "学生可以住",
        "学生能住",

        "学生可入住",
        "学生可以入住",

        "学生可租",
        "学生可以租",

        "留学生可",
        "留学生ok",
        "留学生可以",
        "留学生欢迎",

        "留学生可住",
        "留学生可以住",
        "留学生能住",

        "留学生可入住",
        "留学生可以入住",

        "留学生可租",
        "留学生可以租",

        "学生相談可",
        "留学生相談可",
      ],
    },

    /* ---------- 家具家电 ---------- */

    {
      key: "furnished",
      type: "feature",
      aliases: [
        "家具家电",
        "家具家电齐全",
        "家具齐全",
        "家电齐全",

        "带家具",
        "带家电",
        "带家具家电",

        "有家具",
        "有家电",
        "有家具家电",

        "拎包入住",

        "家具付き",
        "家電付き",
        "家具家電付き",
        "家具家電",
      ],
    },

    /* ---------- 无敷金 ---------- */

    {
      key: "no_deposit",
      type: "feature",
      aliases: [
        "敷金0",
        "敷金零",
        "零敷金",

        "免敷金",
        "无敷金",
        "不要敷金",
        "敷金不要",

        "押金0",
        "零押金",
        "免押金",
        "无押金",
        "不要押金",
        "押金不要",

        "敷金なし",
        "敷金無し",
        "敷金ゼロ",
      ],
    },

    /* ---------- 无礼金 ---------- */

    {
      key: "no_key_money",
      type: "feature",
      aliases: [
        "礼金0",
        "礼金零",
        "零礼金",

        "免礼金",
        "无礼金",
        "不要礼金",
        "礼金不要",

        "礼金なし",
        "礼金無し",
        "礼金ゼロ",
      ],
    },

    /* ---------- 无保证人 ---------- */

    {
      key: "no_guarantor",
      type: "feature",
      aliases: [
        "不要保证人",
        "无需保证人",
        "不需要保证人",
        "不用保证人",
        "无保证人",
        "没有保证人",
        "保证人不要",

        "保証人不要",
        "保証人なし",
        "保証人無し",
      ],
    },

    /* ---------- 近车站 ---------- */

    {
      key: "near_station",
      type: "feature",
      aliases: [
        "近车站",
        "车站近",
        "车站附近",
        "离车站近",
        "离站近",

        "近地铁",
        "地铁站附近",

        "駅近",
        "駅から近い",
        "駅徒歩",
      ],
    },

    /* ---------- 南向 ---------- */

    {
      key: "south_facing",
      type: "feature",
      aliases: [
        "南向",
        "朝南",
        "朝南的",
        "南向房",

        "南向き",
      ],
    },

    /* ---------- 立即入住 ---------- */

    {
      key: "immediate_move_in",
      type: "feature",
      aliases: [
        "即日入住",
        "马上入住",
        "立即入住",
        "现在入住",
        "马上可以入住",
        "可以马上入住",
        "随时入住",

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

      aliases: Array.from(
        new Set(
          concept.aliases
            .map(
              normalizeHouseSearchText
            )
            .filter(Boolean)
        )
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

  for (
    const noiseWord of
    HOUSE_SEARCH_NOISE_WORDS
  ) {
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

  for (
    const concept of
    NORMALIZED_HOUSE_SEARCH_CONCEPTS
  ) {
    /*
     * 不直接 concept.aliases.sort()
     *
     * sort() 会修改原数组。
     * 这里复制后再排序，避免解析过程中
     * 修改共享搜索字典。
     */
    const sortedAliases = [
      ...concept.aliases,
    ].sort(
      (a, b) =>
        b.length - a.length
    );

    const matchedAlias =
      sortedAliases.find(
        (alias) =>
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