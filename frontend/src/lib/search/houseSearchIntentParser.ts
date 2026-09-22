import {
  normalizeHouseSearchText,
} from "@/lib/search/houseSearchDictionary";

export type HouseSearchSortIntent =
  | "rent-asc"
  | "area-desc";

export interface HouseSearchIntent {
  sort?: HouseSearchSortIntent;

  preferredLayouts?: string[];

  preferNearStation?: boolean;
}

const CHEAP_ALIASES = [
  "便宜",
  "便宜点",
  "便宜一点",
  "便宜的",
  "价格低",
  "租金低",
  "房租低",
  "预算低",
  "性价比",
];

const LARGE_AREA_ALIASES = [
  "面积大",
  "面积大点",
  "面积大一点",
  "大一点",
  "宽敞",
  "宽敞一点",
];

const SINGLE_PERSON_ALIASES = [
  "一个人住",
  "一人住",
  "单人住",
  "自己住",
  "独居",
  "单身住",
  "一人暮らし",
];

const NEAR_STATION_PREFERENCE_ALIASES = [
  "离车站近一点",
  "离车站近",
  "车站近一点",
  "离站近一点",
  "交通方便",
  "通勤方便",
];

const HOUSE_SEARCH_INTENT_ALIASES = [
  ...CHEAP_ALIASES,
  ...LARGE_AREA_ALIASES,
  ...SINGLE_PERSON_ALIASES,
  ...NEAR_STATION_PREFERENCE_ALIASES,
];

function includesAny(
  text: string,
  aliases: string[]
) {
  return aliases.some(
    (alias) =>
      text.includes(
        normalizeHouseSearchText(
          alias
        )
      )
  );
}

export function removeHouseSearchIntentText(
  value: string
) {
  let text =
    normalizeHouseSearchText(
      value
    );

  const aliases =
    HOUSE_SEARCH_INTENT_ALIASES
      .map(
        normalizeHouseSearchText
      )
      .sort(
        (a, b) =>
          b.length - a.length
      );

  for (const alias of aliases) {
    text =
      text.replaceAll(
        alias,
        ""
      );
  }

  return text;
}

export function parseHouseSearchIntent(
  search: string
): HouseSearchIntent {
  const text =
    normalizeHouseSearchText(
      search
    );

  const intent: HouseSearchIntent =
    {};

  /* =========================
     PRICE PREFERENCE
  ========================= */

  if (
    includesAny(
      text,
      CHEAP_ALIASES
    )
  ) {
    intent.sort = "rent-asc";
  }

  /* =========================
     AREA PREFERENCE
  ========================= */

  if (
    includesAny(
      text,
      LARGE_AREA_ALIASES
    )
  ) {
    /*
     * 如果用户同时说：
     *
     * 便宜而且面积大
     *
     * 暂时保留 rent-asc。
     *
     * 后端 Ranking V2
     * 再做多目标排序。
     */
    if (!intent.sort) {
      intent.sort = "area-desc";
    }
  }

  /* =========================
     SINGLE PERSON
  ========================= */

  if (
    includesAny(
      text,
      SINGLE_PERSON_ALIASES
    )
  ) {
    /*
     * 注意：
     *
     * 这里只是偏好，不是硬筛选。
     *
     * 不应该因为用户说
     * “一个人住”
     *
     * 就把 1DK 等合理房源删掉。
     */
    intent.preferredLayouts = [
      "1R",
      "1K",
      "1DK",
    ];
  }

  /* =========================
     NEAR STATION PREFERENCE
  ========================= */

  if (
    includesAny(
      text,
      NEAR_STATION_PREFERENCE_ALIASES
    )
  ) {
    intent.preferNearStation =
      true;
  }

  return intent;
}