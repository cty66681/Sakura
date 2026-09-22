export interface HouseNumericFilters {
  rentMin?: number;
  rentMax?: number;

  areaMin?: number;
  areaMax?: number;

  walkMinutesMax?: number;
}

/* =========================
   HELPERS
========================= */

function normalizeNumberText(
  value: string
) {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/，/g, ",");
}

function parseJapaneseMoney(
  value: string
) {
  const normalized =
    normalizeNumberText(value)
      .replace(/[,]/g, "")
      .replace(
        /(?:円|日元|元)$/g,
        ""
      );

  if (
    normalized.endsWith("万")
  ) {
    const number = Number(
      normalized.slice(0, -1)
    );

    if (
      Number.isFinite(number)
    ) {
      return Math.round(
        number * 10000
      );
    }

    return null;
  }

  const number = Number(
    normalized
  );

  return Number.isFinite(number)
    ? number
    : null;
}

function hasMoneySignal(
  value: string
) {
  const normalized =
    normalizeNumberText(value);

  return (
    normalized.includes("万") ||
    normalized.includes("円") ||
    normalized.includes("日元") ||
    normalized.includes("元")
  );
}

function isReasonableBareRent(
  value: number
) {
  /*
   * 没有「万 / 円 / 日元」时，
   * 只把较大的数字当作月租。
   *
   * 例如：
   * 80000以下 → 租金
   *
   * 30以下 → 不自动当租金
   */
  return value >= 10000;
}

/* =========================
   RENT
========================= */

function parseRentFilters(
  search: string,
  filters: HouseNumericFilters
) {
  const text =
    normalizeNumberText(search);

  /*
   * 例:
   *
   * 5万到10万
   * 5万-10万
   * 5万～10万
   * 50000-80000
   */
  const rangeMatch =
    text.match(
      /(\d+(?:\.\d+)?万?)(?:円|日元|元)?(?:到|至|~|～|-)(\d+(?:\.\d+)?万?)(?:円|日元|元)?/
    );

  if (rangeMatch) {
    const firstRaw =
      rangeMatch[1];

    const secondRaw =
      rangeMatch[2];

    const first =
      parseJapaneseMoney(
        firstRaw
      );

    const second =
      parseJapaneseMoney(
        secondRaw
      );

    if (
      first !== null &&
      second !== null
    ) {
      const hasExplicitMoney =
        hasMoneySignal(
          rangeMatch[0]
        );

      const looksLikeBareRent =
        isReasonableBareRent(first) &&
        isReasonableBareRent(second);

      /*
       * 防止：
       *
       * 20-40平米
       *
       * 被误识别成租金。
       */
      if (
        hasExplicitMoney ||
        looksLikeBareRent
      ) {
        filters.rentMin =
          Math.min(
            first,
            second
          );

        filters.rentMax =
          Math.max(
            first,
            second
          );
      }
    }
  }

  /*
   * 例:
   *
   * 8万以内
   * 8万以下
   * 8万円以下
   * 85000日元以下
   * 80000以下
   * 房租8万以内
   * 家租8万以下
   */
  const maxMatch =
    text.match(
      /(?:(?:不超过|不高于|最多)(\d+(?:\.\d+)?万?)(?:円|日元|元)?|(\d+(?:\.\d+)?万?)(?:円|日元|元)?(?:以内|以下))/
    );

  if (maxMatch) {
    const rawValue =
      maxMatch[1] ??
      maxMatch[2];

    const value =
      parseJapaneseMoney(
        rawValue
      );

    if (value !== null) {
      const hasExplicitMoney =
        hasMoneySignal(
          maxMatch[0]
        );

      if (
        hasExplicitMoney ||
        isReasonableBareRent(
          value
        )
      ) {
        filters.rentMax =
          value;
      }
    }
  }

  /*
   * 例:
   *
   * 8万以上
   * 8万円以上
   * 80000以上
   * 至少8万
   */
  const minMatch =
    text.match(
      /(?:(?:至少|最低)(\d+(?:\.\d+)?万?)(?:円|日元|元)?|(\d+(?:\.\d+)?万?)(?:円|日元|元)?(?:以上|起|起步))/
    );

  if (minMatch) {
    const rawValue =
      minMatch[1] ??
      minMatch[2];

    const value =
      parseJapaneseMoney(
        rawValue
      );

    if (value !== null) {
      const hasExplicitMoney =
        hasMoneySignal(
          minMatch[0]
        );

      if (
        hasExplicitMoney ||
        isReasonableBareRent(
          value
        )
      ) {
        filters.rentMin =
          value;
      }
    }
  }
}

/* =========================
   AREA
========================= */

function parseAreaFilters(
  search: string,
  filters: HouseNumericFilters
) {
  const text =
    normalizeNumberText(search);

  const AREA_UNIT =
    "(?:㎡|m2|m²|平米|平方米|平方公尺)";

  /*
   * 例:
   *
   * 20㎡到40㎡
   * 20-40平米
   * 20平米～40平米
   */
  const rangeMatch =
    text.match(
      new RegExp(
        `(\\d+(?:\\.\\d+)?)${AREA_UNIT}?(?:到|至|~|～|-)(\\d+(?:\\.\\d+)?)${AREA_UNIT}`
      )
    );

  if (rangeMatch) {
    const first = Number(
      rangeMatch[1]
    );

    const second = Number(
      rangeMatch[2]
    );

    if (
      Number.isFinite(first) &&
      Number.isFinite(second)
    ) {
      filters.areaMin =
        Math.min(
          first,
          second
        );

      filters.areaMax =
        Math.max(
          first,
          second
        );
    }
  }

  /*
   * 例:
   *
   * 30㎡以上
   * 30平米以上
   * 30平方米以上
   * 30㎡起
   * 至少30㎡
   */
  const minMatch =
    text.match(
      new RegExp(
        `(?:至少)?(\\d+(?:\\.\\d+)?)${AREA_UNIT}(?:以上|起|起步)?`
      )
    );

  if (minMatch) {
    const matchedText =
      minMatch[0];

    const hasMinMeaning =
      matchedText.includes(
        "以上"
      ) ||
      matchedText.includes(
        "起"
      ) ||
      matchedText.startsWith(
        "至少"
      );

    if (hasMinMeaning) {
      const value = Number(
        minMatch[1]
      );

      if (
        Number.isFinite(value)
      ) {
        filters.areaMin =
          value;
      }
    }
  }

  /*
   * 例:
   *
   * 40㎡以下
   * 40平米以内
   * 40平方米以下
   * 不超过40㎡
   */
  const maxMatch =
    text.match(
      new RegExp(
        `(?:不超过|不高于)?(\\d+(?:\\.\\d+)?)${AREA_UNIT}(?:以内|以下)?`
      )
    );

  if (maxMatch) {
    const matchedText =
      maxMatch[0];

    const hasMaxMeaning =
      matchedText.includes(
        "以内"
      ) ||
      matchedText.includes(
        "以下"
      ) ||
      matchedText.startsWith(
        "不超过"
      ) ||
      matchedText.startsWith(
        "不高于"
      );

    if (hasMaxMeaning) {
      const value = Number(
        maxMatch[1]
      );

      if (
        Number.isFinite(value)
      ) {
        filters.areaMax =
          value;
      }
    }
  }
}

/* =========================
   WALK MINUTES
========================= */

function parseWalkMinutes(
  search: string,
  filters: HouseNumericFilters
) {
  const text =
    normalizeNumberText(search);

  /*
   * 优先匹配明确的车站 / 步行表达。
   *
   * 例:
   *
   * 步行5分钟以内
   * 徒步5分钟以内
   * 车站步行8分
   * 駅徒歩10分
   * 车站10分钟以内
   * 离车站10分钟以内
   * 距车站8分钟
   */
  const explicitMatch =
    text.match(
      /(?:距离车站|距车站|离车站|车站步行|車站步行|车站徒歩|車站徒歩|駅徒歩|步行|徒步|徒歩|车站|車站|駅)(\d+)(?:分钟|分)(?:以内|以下)?/
    );

  if (explicitMatch) {
    const value = Number(
      explicitMatch[1]
    );

    if (
      Number.isInteger(value) &&
      value >= 0
    ) {
      filters.walkMinutesMax =
        value;

      return;
    }
  }

  /*
   * 房源搜索场景下：
   *
   * 10分钟以内
   * 8分以内
   *
   * 默认解释为「车站步行时间」。
   *
   * 以后后端 Intent Parser
   * 也继续使用相同语义。
   */
  const implicitMatch =
    text.match(
      /(\d+)(?:分钟|分)(?:以内|以下)/
    );

  if (implicitMatch) {
    const value = Number(
      implicitMatch[1]
    );

    if (
      Number.isInteger(value) &&
      value >= 0
    ) {
      filters.walkMinutesMax =
        value;
    }
  }
}

/* =========================
   PUBLIC PARSER
========================= */

export function parseHouseNumericFilters(
  search: string
): HouseNumericFilters {
  const filters: HouseNumericFilters =
    {};

  parseRentFilters(
    search,
    filters
  );

  parseAreaFilters(
    search,
    filters
  );

  parseWalkMinutes(
    search,
    filters
  );

  return filters;
}