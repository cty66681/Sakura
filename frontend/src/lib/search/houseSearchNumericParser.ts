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
    .replace(/\s+/g, "");
}

function parseJapaneseMoney(
  value: string
) {
  const normalized =
    normalizeNumberText(value);

  if (
    normalized.endsWith("万")
  ) {
    const number = Number(
      normalized.slice(0, -1)
    );

    if (
      Number.isFinite(number)
    ) {
      return number * 10000;
    }
  }

  const number = Number(
    normalized.replace(
      /[,，]/g,
      ""
    )
  );

  return Number.isFinite(number)
    ? number
    : null;
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
   * 10万以内
   * 10万以下
   * 80000以下
   */
  const maxMatch =
    text.match(
      /(\d+(?:\.\d+)?万?)(?:円|日元|元)?(?:以内|以下)/
    );

  if (maxMatch) {
    const value =
      parseJapaneseMoney(
        maxMatch[1]
      );

    if (value !== null) {
      filters.rentMax = value;
    }
  }

  /*
   * 例:
   * 8万以上
   * 80000以上
   */
  const minMatch =
    text.match(
      /(\d+(?:\.\d+)?万?)(?:円|日元|元)?以上/
    );

  if (minMatch) {
    const value =
      parseJapaneseMoney(
        minMatch[1]
      );

    if (value !== null) {
      filters.rentMin = value;
    }
  }

  /*
   * 例:
   * 5万到10万
   * 5万-10万
   * 5万～10万
   * 5万~10万
   */
  const rangeMatch =
    text.match(
      /(\d+(?:\.\d+)?万?)(?:円|日元|元)?(?:到|至|~|～|-)(\d+(?:\.\d+)?万?)(?:円|日元|元)?/
    );

  if (rangeMatch) {
    const first =
      parseJapaneseMoney(
        rangeMatch[1]
      );

    const second =
      parseJapaneseMoney(
        rangeMatch[2]
      );

    if (
      first !== null &&
      second !== null
    ) {
      filters.rentMin =
        Math.min(first, second);

      filters.rentMax =
        Math.max(first, second);
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

  /*
   * 例:
   * 30㎡以上
   * 30平米以上
   * 30平方米以上
   */
  const minMatch =
    text.match(
      /(\d+(?:\.\d+)?)(?:㎡|m2|m²|平米|平方米)(?:以上|起)/
    );

  if (minMatch) {
    const value = Number(
      minMatch[1]
    );

    if (
      Number.isFinite(value)
    ) {
      filters.areaMin = value;
    }
  }

  /*
   * 例:
   * 40㎡以下
   * 40平米以内
   */
  const maxMatch =
    text.match(
      /(\d+(?:\.\d+)?)(?:㎡|m2|m²|平米|平方米)(?:以内|以下)/
    );

  if (maxMatch) {
    const value = Number(
      maxMatch[1]
    );

    if (
      Number.isFinite(value)
    ) {
      filters.areaMax = value;
    }
  }

  /*
   * 例:
   * 20㎡到40㎡
   * 20-40平米
   */
  const rangeMatch =
    text.match(
      /(\d+(?:\.\d+)?)(?:㎡|m2|m²|平米|平方米)?(?:到|至|~|～|-)(\d+(?:\.\d+)?)(?:㎡|m2|m²|平米|平方米)/
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
        Math.min(first, second);

      filters.areaMax =
        Math.max(first, second);
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
   * 例:
   * 步行5分钟以内
   * 徒步5分钟以内
   * 车站步行8分
   * 駅徒歩10分
   */
  const match =
    text.match(
      /(?:步行|徒步|徒歩|駅徒歩)(\d+)(?:分钟|分)(?:以内|以下)?/
    );

  if (match) {
    const value = Number(
      match[1]
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