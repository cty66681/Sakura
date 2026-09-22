"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { SlidersHorizontal } from "lucide-react";

import UniversityHero from "@/components/schools/university/UniversityHero";
import UniversityCard from "@/components/schools/university/UniversityCard";
import {
  normalizeUniversitySearchText,
  parseUniversitySearch,
} from "@/lib/search/universitySearchDictionary";

interface University {
  id: string;
  name: string;
  image: string;

  prefecture: string;
  city: string;

  type: "国立大学" | "公立大学" | "私立大学";
  degree: "大学" | "大学院";

  qs: number;
  hensachi: number;

  tuition: string;
  tuitionNumber: number;

  eju: boolean;
  rating: number;

  tags: string[];
  categories: string[];
  majors: string[];
}

const PAGE_SIZE = 6;

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| GET /api/universities
|
| Query:
|
| q
| region          // 都道府县
| type
| degree
| category
| major
| qs
| eju
| tuition
| sort
| page
|
| 后端地区数据统一：
|
| {
|   prefecture: "爱知",
|   city: "名古屋市"
| }
|
|--------------------------------------------------------------------------
*/

const universities: University[] = [
  {
    id: "tokyo",
    name: "东京大学",
    image: "/images/university/university01.jpg",

    prefecture: "东京",
    city: "文京区",

    type: "国立大学",
    degree: "大学",

    qs: 28,
    hensachi: 72,

    tuition: "535,800円/年",
    tuitionNumber: 535800,

    eju: true,
    rating: 4.9,

    tags: [
      "计算机",
      "AI",
      "医学",
      "奖学金",
      "英语课程",
    ],

    categories: [
      "文科",
      "理科",
      "医学",
    ],

    majors: [
      "IT・AI",
      "经济・经营",
      "文学・语言",
      "法学・政治",
      "理工・机械",
      "医学・医疗",
      "教育・社会",
    ],
  },

  {
    id: "waseda",
    name: "早稻田大学",
    image: "/images/university/university01.jpg",

    prefecture: "东京",
    city: "新宿区",

    type: "私立大学",
    degree: "大学",

    qs: 181,
    hensachi: 70,

    tuition: "1,100,000円/年",
    tuitionNumber: 1100000,

    eju: true,
    rating: 4.8,

    tags: [
      "商科",
      "传媒",
      "法学",
      "留学生宿舍",
      "计算机",
    ],

    categories: [
      "文科",
      "理科",
      "艺术",
    ],

    majors: [
      "IT・AI",
      "经济・经营",
      "文学・语言",
      "法学・政治",
      "理工・机械",
      "艺术・设计",
      "教育・社会",
    ],
  },

  {
    id: "kyoto",
    name: "京都大学",
    image: "/images/university/university01.jpg",

    prefecture: "京都",
    city: "京都市",

    type: "国立大学",
    degree: "大学",

    qs: 46,
    hensachi: 71,

    tuition: "535,800円/年",
    tuitionNumber: 535800,

    eju: true,
    rating: 4.8,

    tags: [
      "理工",
      "医学",
      "研究型",
      "奖学金",
    ],

    categories: [
      "文科",
      "理科",
      "医学",
    ],

    majors: [
      "IT・AI",
      "经济・经营",
      "文学・语言",
      "法学・政治",
      "理工・机械",
      "医学・医疗",
      "教育・社会",
    ],
  },

  {
    id: "osaka",
    name: "大阪大学",
    image: "/images/university/university01.jpg",

    prefecture: "大阪",
    city: "吹田市",

    type: "国立大学",
    degree: "大学",

    qs: 80,
    hensachi: 68,

    tuition: "535,800円/年",
    tuitionNumber: 535800,

    eju: true,
    rating: 4.7,

    tags: [
      "工学",
      "医学",
      "国际交流",
      "信息科学",
    ],

    categories: [
      "文科",
      "理科",
      "医学",
    ],

    majors: [
      "IT・AI",
      "经济・经营",
      "文学・语言",
      "法学・政治",
      "理工・机械",
      "医学・医疗",
      "教育・社会",
    ],
  },

  {
    id: "yokohama",
    name: "横滨市立大学",
    image: "/images/university/university01.jpg",

    prefecture: "神奈川",
    city: "横滨市",

    type: "公立大学",
    degree: "大学",

    qs: 450,
    hensachi: 63,

    tuition: "557,400円/年",
    tuitionNumber: 557400,

    eju: true,
    rating: 4.5,

    tags: [
      "国际商学",
      "医学",
      "数据科学",
    ],

    categories: [
      "文科",
      "理科",
      "医学",
    ],

    majors: [
      "IT・AI",
      "经济・经营",
      "医学・医疗",
      "教育・社会",
    ],
  },

  {
    id: "nagoya",
    name: "名古屋大学",
    image: "/images/university/university01.jpg",

    prefecture: "爱知",
    city: "名古屋市",

    type: "国立大学",
    degree: "大学院",

    qs: 118,
    hensachi: 67,

    tuition: "535,800円/年",
    tuitionNumber: 535800,

    eju: false,
    rating: 4.7,

    tags: [
      "大学院",
      "研究型",
      "工学",
      "奖学金",
      "信息学",
    ],

    categories: [
      "文科",
      "理科",
      "医学",
    ],

    majors: [
      "IT・AI",
      "经济・经营",
      "文学・语言",
      "法学・政治",
      "理工・机械",
      "医学・医疗",
      "教育・社会",
    ],
  },

  {
    id: "kyushu",
    name: "九州大学",
    image: "/images/university/university01.jpg",

    prefecture: "福冈",
    city: "福冈市",

    type: "国立大学",
    degree: "大学院",

    qs: 167,
    hensachi: 66,

    tuition: "535,800円/年",
    tuitionNumber: 535800,

    eju: false,
    rating: 4.6,

    tags: [
      "大学院",
      "工学",
      "国际项目",
      "信息科学",
    ],

    categories: [
      "文科",
      "理科",
      "医学",
      "艺术",
    ],

    majors: [
      "IT・AI",
      "经济・经营",
      "文学・语言",
      "法学・政治",
      "理工・机械",
      "医学・医疗",
      "艺术・设计",
      "教育・社会",
    ],
  },
];

/* =========================================================
   日本 47 都道府县
========================================================= */

const prefectureGroups = [
  {
    region: "北海道",
    prefectures: ["北海道"],
  },

  {
    region: "东北",
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
    region: "关东",
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
    region: "中部",
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
    region: "近畿",
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
    region: "中国",
    prefectures: [
      "鸟取",
      "岛根",
      "冈山",
      "广岛",
      "山口",
    ],
  },

  {
    region: "四国",
    prefectures: [
      "德岛",
      "香川",
      "爱媛",
      "高知",
    ],
  },

  {
    region: "九州・冲绳",
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

const popularPrefectures = [
  "全部",
  "东京",
  "大阪",
  "京都",
  "神奈川",
  "爱知",
  "福冈",
];

const categories = [
  "全部",
  "文科",
  "理科",
  "医学",
  "艺术",
];

const majors = [
  "全部",
  "IT・AI",
  "经济・经营",
  "文学・语言",
  "法学・政治",
  "理工・机械",
  "医学・医疗",
  "艺术・设计",
  "教育・社会",
];

const topFilters = [
  "全部",
  "国立大学",
  "公立大学",
  "私立大学",
  "大学院",
  "QS排名",
  "EJU",
  "文科",
  "理科",
  "医学",
  "艺术",
];

function getUniversitySearchScore(
  school: (typeof universities)[number],
  search: string
) {
  if (!search.trim()) {
    return 0;
  }

  const groups =
    parseUniversitySearch(search);

  const nameText =
    normalizeUniversitySearchText(
      school.name
    );

  const locationText =
    normalizeUniversitySearchText(
      [
        school.prefecture,
        school.city,
      ].join(" ")
    );

  const tagText =
    normalizeUniversitySearchText(
      school.tags.join(" ")
    );

  const categoryText =
    normalizeUniversitySearchText(
      school.categories.join(" ")
    );

  const majorText =
    normalizeUniversitySearchText(
      school.majors.join(" ")
    );

  const fullText =
    normalizeUniversitySearchText(
      [
        school.name,
        school.prefecture,
        school.city,
        school.type,
        school.degree,
        ...school.tags,
        ...school.categories,
        ...school.majors,
      ].join(" ")
    );

  let score = 0;

  for (const group of groups) {
    if (group.type === "location") {
      if (
        group.aliases.some((alias) =>
          locationText.includes(alias)
        )
      ) {
        score += 70;
      }

      continue;
    }

    if (group.type === "type") {
      score += 60;
      continue;
    }

    if (group.type === "degree") {
      score += 65;
      continue;
    }

    if (group.type === "category") {
      if (
        group.aliases.some((alias) =>
          categoryText.includes(alias)
        )
      ) {
        score += 55;
      }

      continue;
    }

    if (group.type === "major") {
      if (
        group.aliases.some((alias) =>
          majorText.includes(alias)
        )
      ) {
        score += 80;
      }

      continue;
    }

    if (group.type === "condition") {
      score += 40;
      continue;
    }

    if (group.type === "literal") {
      for (const alias of group.aliases) {
        if (nameText.includes(alias)) {
          score += 120;
        } else if (
          tagText.includes(alias)
        ) {
          score += 35;
        } else if (
          fullText.includes(alias)
        ) {
          score += 15;
        }
      }
    }
  }

  const normalizedSearch =
    normalizeUniversitySearchText(
      search
    );

  if (
    normalizedSearch &&
    nameText.includes(
      normalizedSearch
    )
  ) {
    score += 150;
  }

  return score;
}

function sortUniversitiesBySearchRelevance(
  list: typeof universities,
  search: string
) {
  return [...list].sort(
    (a, b) =>
      getUniversitySearchScore(
        b,
        search
      ) -
      getUniversitySearchScore(
        a,
        search
      )
  );
}

export default function UniversityPage() {
  return (
    <Suspense fallback={<UniversityPageLoading />}>
      <UniversityPageContent />
    </Suspense>
  );
}

function UniversityPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* =========================================================
     URL
  ========================================================= */

  const keyword =
    searchParams.get("q") ?? "";

  const selectedRegion =
    searchParams.get("region") ?? "全部";

  const selectedType =
    searchParams.get("type") ?? "全部";

  const degree =
    searchParams.get("degree") ?? "全部";

  const category =
    searchParams.get("category") ?? "全部";

  const major =
    searchParams.get("major") ?? "全部";

  const qsFilter =
    searchParams.get("qs") ?? "全部";

  const ejuFilter =
    searchParams.get("eju") ?? "全部";

  const tuitionFilter =
    searchParams.get("tuition") ?? "全部";

  const sort =
    searchParams.get("sort") ?? "recommended";

  const rawPage = Number(
    searchParams.get("page") ?? "1"
  );

  const currentPage =
    Number.isFinite(rawPage) &&
    rawPage >= 1
      ? Math.floor(rawPage)
      : 1;

  /* =========================================================
     URL UPDATE
  ========================================================= */

  const updateQuery = useCallback(
    (
      updates: Record<
        string,
        string | null | undefined
      >
    ) => {
      const params =
        new URLSearchParams(
          searchParams.toString()
        );

      Object.entries(
        updates
      ).forEach(
        ([key, value]) => {
          const shouldDelete =
            value === null ||
            value === undefined ||
            value === "" ||
            value === "全部" ||
            (key === "sort" &&
              value ===
                "recommended") ||
            (key === "page" &&
              value === "1");

          if (shouldDelete) {
            params.delete(key);
          } else {
            params.set(
              key,
              value
            );
          }
        }
      );

      const query =
        params.toString();

      const nextUrl = query
        ? `${pathname}?${query}`
        : pathname;

      router.replace(
        nextUrl,
        {
          scroll: false,
        }
      );
    },
    [
      pathname,
      router,
      searchParams,
    ]
  );

  const handleSearch = (
    value: string
  ) => {
    updateQuery({
      q:
        value.trim() || null,
      page: null,
    });
  };

  const handleClearSearch = () => {
    updateQuery({
      q: null,
      page: null,
    });
  };

  /* =========================================================
     TOP FILTER
  ========================================================= */

  const handleTopFilter = (
    value: string
  ) => {
    const updates: Record<
      string,
      string | null
    > = {
      type: null,
      degree: null,
      category: null,
      qs: null,
      eju: null,
      page: null,
    };

    if (
      value === "国立大学" ||
      value === "公立大学" ||
      value === "私立大学"
    ) {
      updates.type = value;
    }

    if (value === "大学院") {
      updates.degree =
        "大学院";
    }

    if (value === "QS排名") {
      updates.qs = "100";
    }

    if (value === "EJU") {
      updates.eju = "需要";
    }

    if (
      value === "文科" ||
      value === "理科" ||
      value === "医学" ||
      value === "艺术"
    ) {
      updates.category =
        value;
    }

    updateQuery(updates);
  };

  const activeTopFilter =
    useMemo(() => {
      if (
        selectedType !==
        "全部"
      ) {
        return selectedType;
      }

      if (
        degree === "大学院"
      ) {
        return "大学院";
      }

      if (
        qsFilter === "100"
      ) {
        return "QS排名";
      }

      if (
        ejuFilter === "需要"
      ) {
        return "EJU";
      }

      if (
        category !== "全部"
      ) {
        return category;
      }

      return "全部";
    }, [
      selectedType,
      degree,
      qsFilter,
      ejuFilter,
      category,
    ]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredUniversities =
    useMemo(() => {
      let result = [
        ...universities,
      ];

      if (keyword.trim()) {
  const searchGroups =
    parseUniversitySearch(
      keyword
    );

  result = result.filter(
    (school) => {
      const schoolText =
        normalizeUniversitySearchText(
          [
            school.name,
            school.prefecture,
            school.city,
            school.type,
            school.degree,
            ...school.tags,
            ...school.categories,
            ...school.majors,
          ].join(" ")
        );

      return searchGroups.every(
        (group) => {
          /* 地区 */

          if (
            group.type ===
            "location"
          ) {
            const locationText =
              normalizeUniversitySearchText(
                [
                  school.prefecture,
                  school.city,
                ].join(" ")
              );

            return group.aliases.some(
              (alias) =>
                locationText.includes(
                  alias
                )
            );
          }

          /* 国立 / 公立 / 私立 */

          if (
            group.type === "type"
          ) {
            if (
              group.key ===
              "national"
            ) {
              return (
                school.type ===
                "国立大学"
              );
            }

            if (
              group.key ===
              "public"
            ) {
              return (
                school.type ===
                "公立大学"
              );
            }

            if (
              group.key ===
              "private"
            ) {
              return (
                school.type ===
                "私立大学"
              );
            }

            return false;
          }

          /* 大学 / 大学院 */

          if (
            group.type ===
            "degree"
          ) {
            if (
              group.key ===
              "undergraduate"
            ) {
              return (
                school.degree ===
                "大学"
              );
            }

            if (
              group.key ===
              "graduate"
            ) {
              return (
                school.degree ===
                "大学院"
              );
            }

            return false;
          }

          /* 学科类别 */

          if (
            group.type ===
            "category"
          ) {
            const categoryMap: Record<
              string,
              string
            > = {
              humanities: "文科",
              science: "理科",
              medical: "医学",
              art: "艺术",
            };

            const value =
              categoryMap[
                group.key
              ];

            return value
              ? school.categories.includes(
                  value
                )
              : false;
          }

          /* 专业 */

          if (
            group.type ===
            "major"
          ) {
            const majorMap: Record<
              string,
              string
            > = {
              "it-ai": "IT・AI",
              "economics-business":
                "经济・经营",
              "literature-language":
                "文学・语言",
              "law-politics":
                "法学・政治",
              engineering:
                "理工・机械",
              "medicine-health":
                "医学・医疗",
              "art-design":
                "艺术・设计",
              "education-social":
                "教育・社会",
            };

            const value =
              majorMap[group.key];

            return value
              ? school.majors.includes(
                  value
                )
              : false;
          }

          /* EJU / QS / 奖学金等 */

          if (
            group.type ===
            "condition"
          ) {
            if (
              group.key === "eju"
            ) {
              return school.eju;
            }

            if (
              group.key ===
              "no-eju"
            ) {
              return !school.eju;
            }

            if (
              group.key ===
              "scholarship"
            ) {
              return school.tags.some(
                (tag) =>
                  tag.includes(
                    "奖学金"
                  )
              );
            }

            if (
              group.key ===
              "english"
            ) {
              return school.tags.some(
                (tag) =>
                  tag.includes(
                    "英语"
                  ) ||
                  tag.includes(
                    "英文"
                  )
              );
            }

            if (
              group.key ===
              "top50"
            ) {
              return (
                school.qs <= 50
              );
            }

            if (
              group.key ===
              "top100"
            ) {
              return (
                school.qs <= 100
              );
            }

            if (
              group.key ===
              "top200"
            ) {
              return (
                school.qs <= 200
              );
            }

            return false;
          }

          /* 学校名称 / 城市 / 其他自由词 */

          if (
            group.type ===
            "literal"
          ) {
            return group.aliases.some(
              (alias) =>
                schoolText.includes(
                  alias
                )
            );
          }

          return true;
        }
      );
    }
  );
}

      /*
       * region = prefecture
       *
       * ?region=东京
       * ?region=爱知
       * ?region=福冈
       */
      if (
        selectedRegion !==
        "全部"
      ) {
        result =
          result.filter(
            (school) =>
              school.prefecture ===
              selectedRegion
          );
      }

      if (
        selectedType !==
        "全部"
      ) {
        result =
          result.filter(
            (school) =>
              school.type ===
              selectedType
          );
      }

      if (
        degree !== "全部"
      ) {
        result =
          result.filter(
            (school) =>
              school.degree ===
              degree
          );
      }

      if (
        category !==
        "全部"
      ) {
        result =
          result.filter(
            (school) =>
              school.categories.includes(
                category
              )
          );
      }

      if (
        major !== "全部"
      ) {
        result =
          result.filter(
            (school) =>
              school.majors.includes(
                major
              )
          );
      }

      if (
        qsFilter === "50"
      ) {
        result =
          result.filter(
            (school) =>
              school.qs <= 50
          );
      }

      if (
        qsFilter === "100"
      ) {
        result =
          result.filter(
            (school) =>
              school.qs <= 100
          );
      }

      if (
        qsFilter === "200"
      ) {
        result =
          result.filter(
            (school) =>
              school.qs <= 200
          );
      }

      if (
        ejuFilter === "需要"
      ) {
        result =
          result.filter(
            (school) =>
              school.eju
          );
      }

      if (
        ejuFilter === "无需"
      ) {
        result =
          result.filter(
            (school) =>
              !school.eju
          );
      }

      if (
        tuitionFilter ===
        "60万以下"
      ) {
        result =
          result.filter(
            (school) =>
              school.tuitionNumber <=
              600000
          );
      }

      if (
        tuitionFilter ===
        "60-100万"
      ) {
        result =
          result.filter(
            (school) =>
              school.tuitionNumber >
                600000 &&
              school.tuitionNumber <=
                1000000
          );
      }

      if (
        tuitionFilter ===
        "100万以上"
      ) {
        result =
          result.filter(
            (school) =>
              school.tuitionNumber >
              1000000
          );
      }

      if (
        sort === "recommended" &&
        keyword.trim()
      ) {
        result =
          sortUniversitiesBySearchRelevance(
            result,
            keyword
          );
      }

      if (sort === "qs") {
        result.sort(
          (a, b) =>
            a.qs - b.qs
        );
      }

      if (
        sort === "tuition"
      ) {
        result.sort(
          (a, b) =>
            a.tuitionNumber -
            b.tuitionNumber
        );
      }

      if (
        sort === "rating"
      ) {
        result.sort(
          (a, b) =>
            b.rating -
            a.rating
        );
      }

      return result;
    }, [
      keyword,
      selectedRegion,
      selectedType,
      degree,
      category,
      major,
      qsFilter,
      ejuFilter,
      tuitionFilter,
      sort,
    ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages =
    Math.ceil(
      filteredUniversities.length /
        PAGE_SIZE
    );

  const safeCurrentPage =
    totalPages === 0
      ? 1
      : Math.min(
          currentPage,
          totalPages
        );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage >
        totalPages
    ) {
      updateQuery({
        page:
          totalPages === 1
            ? null
            : String(
                totalPages
              ),
      });
    }
  }, [
    currentPage,
    totalPages,
    updateQuery,
  ]);

  const paginatedUniversities =
    useMemo(() => {
      const start =
        (safeCurrentPage -
          1) *
        PAGE_SIZE;

      return filteredUniversities.slice(
        start,
        start +
          PAGE_SIZE
      );
    }, [
      filteredUniversities,
      safeCurrentPage,
    ]);

  const startItem =
    filteredUniversities.length ===
    0
      ? 0
      : (safeCurrentPage -
            1) *
          PAGE_SIZE +
        1;

  const endItem =
    Math.min(
      safeCurrentPage *
        PAGE_SIZE,
      filteredUniversities.length
    );

  const handlePageChange = (
    page: number
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page ===
        safeCurrentPage
    ) {
      return;
    }

    updateQuery({
      page:
        page === 1
          ? null
          : String(page),
    });

    requestAnimationFrame(
      () => {
        document
          .getElementById(
            "university-results"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",
            block: "start",
          });
      }
    );
  };

  const clearFilters = () => {
    router.replace(
      pathname,
      {
        scroll: false,
      }
    );
  };

  const searchParamsString =
  searchParams.toString();

  const currentListUrl =
    `${pathname}${
      searchParamsString
        ? `?${searchParamsString}`
        : ""
    }#university-results`;

  return (
    <main className="min-h-screen bg-slate-50">
      <UniversityHeroSearch
        key={keyword}
        initialValue={keyword}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {/* =====================================================
          TOP FILTER
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-5">
          {topFilters.map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  handleTopFilter(
                    item
                  )
                }
                className={`
                  shrink-0
                  rounded-full
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  ${
                    activeTopFilter ===
                    item
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  }
                `}
              >
                {item}
              </button>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section
        id="university-results"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-10"
      >
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="h-fit rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                />

                <h2 className="font-bold text-slate-900">
                  筛选大学
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                重置
              </button>
            </div>

            {/* 都道府县 */}

            <FilterSection title="都道府县">
              <select
                value={
                  selectedRegion
                }
                onChange={(event) =>
                  updateQuery({
                    region:
                      event.target
                        .value,
                    page: null,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              >
                <option value="全部">
                  全国
                </option>

                {prefectureGroups.map(
                  (group) => (
                    <optgroup
                      key={
                        group.region
                      }
                      label={
                        group.region
                      }
                    >
                      {group.prefectures.map(
                        (
                          prefecture
                        ) => (
                          <option
                            key={
                              prefecture
                            }
                            value={
                              prefecture
                            }
                          >
                            {
                              prefecture
                            }
                          </option>
                        )
                      )}
                    </optgroup>
                  )
                )}
              </select>

              {selectedRegion !==
                "全部" && (
                <div className="mt-3 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-bold text-blue-700">
                  📍{" "}
                  {
                    selectedRegion
                  }
                </div>
              )}
            </FilterSection>

            {/* 学校类型 */}

            <FilterSection title="学校类型">
              {[
                "全部",
                "国立大学",
                "公立大学",
                "私立大学",
              ].map(
                (item) => (
                  <RadioOption
                    key={item}
                    label={item}
                    checked={
                      selectedType ===
                      item
                    }
                    onChange={() =>
                      updateQuery(
                        {
                          type:
                            item ===
                            "全部"
                              ? null
                              : item,
                          page: null,
                        }
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* 学历 */}

            <FilterSection title="学历">
              {[
                "全部",
                "大学",
                "大学院",
              ].map(
                (item) => (
                  <RadioOption
                    key={item}
                    label={item}
                    checked={
                      degree ===
                      item
                    }
                    onChange={() =>
                      updateQuery(
                        {
                          degree:
                            item ===
                            "全部"
                              ? null
                              : item,
                          page: null,
                        }
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* 学科类别 */}

            <FilterSection title="学科类别">
              {categories.map(
                (item) => (
                  <RadioOption
                    key={item}
                    label={item}
                    checked={
                      category ===
                      item
                    }
                    onChange={() =>
                      updateQuery(
                        {
                          category:
                            item ===
                            "全部"
                              ? null
                              : item,
                          page: null,
                        }
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* 专业领域 */}

            <FilterSection title="专业领域">
              <div className="space-y-1.5">
                {majors.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        updateQuery(
                          {
                            major:
                              item ===
                              "全部"
                                ? null
                                : item,
                            page: null,
                          }
                        )
                      }
                      className={`
                        w-full
                        rounded-xl
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        transition
                        ${
                          major ===
                          item
                            ? "bg-blue-50 font-semibold text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </FilterSection>

            {/* QS */}

            <FilterSection title="QS 世界排名">
              <RadioOption
                label="全部"
                checked={
                  qsFilter ===
                  "全部"
                }
                onChange={() =>
                  updateQuery({
                    qs: null,
                    page: null,
                  })
                }
              />

              <RadioOption
                label="TOP 50"
                checked={
                  qsFilter ===
                  "50"
                }
                onChange={() =>
                  updateQuery({
                    qs: "50",
                    page: null,
                  })
                }
              />

              <RadioOption
                label="TOP 100"
                checked={
                  qsFilter ===
                  "100"
                }
                onChange={() =>
                  updateQuery({
                    qs: "100",
                    page: null,
                  })
                }
              />

              <RadioOption
                label="TOP 200"
                checked={
                  qsFilter ===
                  "200"
                }
                onChange={() =>
                  updateQuery({
                    qs: "200",
                    page: null,
                  })
                }
              />
            </FilterSection>

            {/* EJU */}

            <FilterSection title="EJU">
              {[
                "全部",
                "需要",
                "无需",
              ].map(
                (item) => (
                  <RadioOption
                    key={item}
                    label={
                      item ===
                      "需要"
                        ? "需要 EJU"
                        : item ===
                            "无需"
                          ? "无需 EJU"
                          : "全部"
                    }
                    checked={
                      ejuFilter ===
                      item
                    }
                    onChange={() =>
                      updateQuery(
                        {
                          eju:
                            item ===
                            "全部"
                              ? null
                              : item,
                          page: null,
                        }
                      )
                    }
                  />
                )
              )}
            </FilterSection>

            {/* 学费 */}

            <FilterSection title="学费">
              {[
                "全部",
                "60万以下",
                "60-100万",
                "100万以上",
              ].map(
                (item) => (
                  <RadioOption
                    key={item}
                    label={item}
                    checked={
                      tuitionFilter ===
                      item
                    }
                    onChange={() =>
                      updateQuery(
                        {
                          tuition:
                            item ===
                            "全部"
                              ? null
                              : item,
                          page: null,
                        }
                      )
                    }
                  />
                )
              )}
            </FilterSection>
          </aside>

          {/* =================================================
              RESULTS
          ================================================= */}

          <div className="flex min-h-[1100px] flex-col">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  {selectedRegion ===
                  "全部"
                    ? "日本大学・大学院"
                    : `${selectedRegion}大学・大学院`}
                </h2>

                <p className="mt-2 text-slate-500">
                  共找到{" "}
                  <span className="font-bold text-blue-600">
                    {
                      filteredUniversities.length
                    }
                  </span>{" "}
                  所学校

                  {filteredUniversities.length >
                    0 && (
                    <span className="ml-3 text-sm text-slate-400">
                      当前显示{" "}
                      {startItem}-
                      {endItem}
                    </span>
                  )}
                </p>

                {major !==
                  "全部" && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                    专业领域：
                    {major}

                    <button
                      type="button"
                      onClick={() =>
                        updateQuery(
                          {
                            major:
                              null,
                            page: null,
                          }
                        )
                      }
                      className="ml-1 text-blue-400 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <select
                value={sort}
                onChange={(event) =>
                  updateQuery({
                    sort:
                      event.target
                        .value ===
                      "recommended"
                        ? null
                        : event.target
                            .value,
                    page: null,
                  })
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="recommended">
                  推荐排序
                </option>

                <option value="qs">
                  QS 排名
                </option>

                <option value="tuition">
                  学费最低
                </option>

                <option value="rating">
                  外国人评价
                </option>
              </select>
            </div>

            {/* Cards */}

            {paginatedUniversities.length >
            0 ? (
              <>
                <div className="flex-1 space-y-8">
                  {paginatedUniversities.map(
                    (school) => (
                      <UniversityCard
                        key={
                          school.id
                        }
                        id={
                          school.id
                        }
                        href={`/schools/university/${school.id}?returnTo=${encodeURIComponent(
                          currentListUrl
                        )}`}
                        name={
                          school.name
                        }
                        image={
                          school.image
                        }
                        location={`${school.prefecture} · ${school.city}`}
                        type={
                          school.type
                        }
                        qs={
                          school.qs
                        }
                        hensachi={
                          school.hensachi
                        }
                        tuition={
                          school.tuition
                        }
                        eju={
                          school.eju
                        }
                        rating={
                          school.rating
                        }
                        tags={
                          school.tags
                        }
                      />
                    )
                  )}
                </div>

                {/* Pagination */}

                {totalPages >
                  1 && (
                  <div className="mt-auto flex flex-wrap items-center justify-center gap-2 pt-10">
                    <button
                      type="button"
                      disabled={
                        safeCurrentPage ===
                        1
                      }
                      onClick={() =>
                        handlePageChange(
                          safeCurrentPage -
                            1
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      上一页
                    </button>

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map(
                      (page) => (
                        <button
                          key={
                            page
                          }
                          type="button"
                          onClick={() =>
                            handlePageChange(
                              page
                            )
                          }
                          className={`
                            flex
                            h-10
                            min-w-10
                            items-center
                            justify-center
                            rounded-xl
                            px-3
                            text-sm
                            font-bold
                            transition
                            ${
                              safeCurrentPage ===
                              page
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"
                            }
                          `}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      disabled={
                        safeCurrentPage ===
                        totalPages
                      }
                      onClick={() =>
                        handlePageChange(
                          safeCurrentPage +
                            1
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      下一页
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-8 py-24 text-center">
                <div className="text-5xl">
                  🎓
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  暂时没有找到符合条件的大学
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  当前 Mock 数据还没有覆盖日本全部地区。
                  <br />
                  全国 47 都道府县筛选结构已经准备完成，
                  后续接入真实大学数据库即可直接使用。
                </p>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  清除筛选条件
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-7 border-t border-slate-100 pt-6 first:border-0">
      <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      {children}
    </div>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="accent-blue-600"
      />

      {label}
    </label>
  );
}

  function UniversityHeroSearch({
    initialValue,
    onSearch,
    onClear,
  }: {
    initialValue: string;
    onSearch: (value: string) => void;
    onClear: () => void;
  }) {
    const [value, setValue] =
      useState(initialValue);

    return (
      <UniversityHero
        keywordInput={value}
        onKeywordChange={setValue}
        onSearch={() =>
          onSearch(value)
        }
        onClear={() => {
          setValue("");
          onClear();
        }}
      />
    );
  }

function UniversityPageLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-32">
        <div className="h-8 w-56 animate-pulse rounded-xl bg-slate-200" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="h-[900px] animate-pulse rounded-[28px] bg-white" />

          <div className="space-y-8">
            <div className="h-[300px] animate-pulse rounded-[28px] bg-white" />

            <div className="h-[300px] animate-pulse rounded-[28px] bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}