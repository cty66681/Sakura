"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import Container from "@/components/layout/Container";
import HouseCard from "@/components/home/HouseCard";

import {
  houses as mockHouses,
  type HouseFeature,
} from "@/data/houses";

import {
  normalizeHouseSearchText,
  parseHouseSearch,
} from "@/lib/search/houseSearchDictionary";

import { parseHouseNumericFilters } from "@/lib/search/houseSearchNumericParser";

import {
  parseHouseSearchIntent,
  removeHouseSearchIntentText,
} from "@/lib/search/houseSearchIntentParser";


import {
  useRouter,
  useSearchParams,
} from "next/navigation";

const PAGE_SIZE = 6;

type HouseItem =
  (typeof mockHouses)[number] & {
    publisherName?: string;
    publisherCompany?: string;
    publisherVerified?: boolean;
  };

interface ApiHouse {
  id: number;

  publisher: {
    id: string;
    name: string;
    company: string | null;
    verified: boolean;
  };

  title: string;

  rent: number;
  managementFee: number;

  depositMonths: number;
  keyMoneyMonths: number;

  layout: string;
  area: number;

  prefecture: string;
  city: string;

  station: string | null;
  walkMinutes: number | null;

  floor: string | null;
  builtYear: number | null;
  direction: string | null;
  structure: string | null;

  availableFrom: string | null;

  foreignerAllowed: boolean | null;
  studentAllowed: boolean | null;

  description: string;

  features: string[];
  tags: string[];

  listingStatus:
    | "available"
    | "paused"
    | "rented"
    | "expired"
    | "hidden";

  lastVerifiedAt: string | null;
  expiresAt: string | null;

  views: number;

  publishedAt: string | null;
  createdAt: string;

  images: {
    id: string;
    url: string;
    sortOrder: number;
  }[];

  location: string;
}

interface HousesApiResponse {
  success: boolean;
  data: ApiHouse[];
}




const regions = [
  "全部地区",
  "东京",
  "神奈川",
  "千叶",
  "埼玉",
  "大阪",
] as const;

const layouts = [
  "全部",
  "1R",
  "1K",
  "1DK",
  "1LDK",
  "2LDK",
  "3LDK+",
] as const;

const features = [
  {
    key: "near_station",
    label: "近车站",
  },
  {
    key: "pet_allowed",
    label: "可养宠物",
  },
  {
    key: "no_key_money",
    label: "免礼金",
  },
  {
    key: "furnished",
    label: "拎包入住",
  },
] as const satisfies readonly {
  key: HouseFeature;
  label: string;
}[];

const hotKeywords = [
  "池袋",
  "新宿",
  "大阪",
  "1LDK",
  "近车站",
  "可养宠物",
];

type Region = (typeof regions)[number];
type Layout = (typeof layouts)[number];
type Feature = (typeof features)[number]["key"];
const sortValues = [
  "latest",
  "rent-asc",
  "rent-desc",
  "area-desc",
] as const;

type SortValue =
  (typeof sortValues)[number];


/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 房源列表
|
| GET /api/houses
|
| Query:
| {
|   q?: string,
|   region?: string,
|   layout?: string,
|   features?: string[],
|   sort?: "latest" | "rent-asc" | "rent-desc" | "area-desc",
|   page?: number,
|   limit?: number
| }
|
| 当前阶段使用 "@/data/houses" Mock 数据进行前端筛选。
|
|--------------------------------------------------------------------------
*/

  function formatMonths(
  value: number
) {
  if (value === 0) {
    return "0个月";
  }

  return `${value}个月`;
}

function formatYen(
  value: number
) {
  return `¥${value.toLocaleString(
    "ja-JP"
  )}`;
}

function formatArea(
  value: number
) {
  return `${value}㎡`;
}

function mapApiHouseToHouseItem(
  house: ApiHouse
): HouseItem {
  const publishTime =
    house.publishedAt ??
    house.createdAt;

  const features =
    house.features.filter(
      (feature): feature is HouseFeature =>
        [
          "near_station",
          "pet_allowed",
          "no_key_money",
          "no_deposit",
          "move_in_ready",
          "furnished",
          "separate_bath_toilet",
          "auto_lock",
          "delivery_box",
          "free_internet",
          "parking",
          "bicycle_parking",
        ].includes(feature)
    );

  return {

    publisherName: house.publisher.name,

    publisherCompany: house.publisher.company ?? "",

    publisherVerified: house.publisher.verified,

    id: house.id,

    publisherId:
      house.publisher.id,

    title: house.title,

    prefecture:
      house.prefecture,

    city: house.city,

    station:
      house.station ?? "",

    walkMinutes:
      house.walkMinutes,

    rentValue:
      house.rent,

    managementFeeValue:
      house.managementFee,

    depositMonths:
      house.depositMonths,

    keyMoneyMonths:
      house.keyMoneyMonths,

    rent:
      formatYen(
        house.rent
      ),

    managementFee:
      house.managementFee > 0
        ? formatYen(
            house.managementFee
          )
        : "无",

    deposit:
      formatMonths(
        house.depositMonths
      ),

    keyMoney:
      formatMonths(
        house.keyMoneyMonths
      ),

    layout:
      house.layout,

    areaValue:
      house.area,

    area:
      formatArea(
        house.area
      ),

    location:
      house.location,

    floor:
      house.floor ?? "",

    builtYear:
      house.builtYear
        ? String(
            house.builtYear
          )
        : "",

    direction:
      house.direction ?? "",

    structure:
      house.structure ?? "",

    listingStatus:
      house.listingStatus,

    moderationStatus:
      "approved",

    lastVerifiedAt:
      house.lastVerifiedAt,

    expiresAt:
      house.expiresAt,

    availableFrom:
      house.availableFrom,

    availableDate:
      house.availableFrom ?? "",

    foreignerAllowed:
      house.foreignerAllowed,

    studentAllowed:
      house.studentAllowed,

    publishTime,

    views:
      house.views,

    images:
      house.images.map(
        (image) =>
          image.url
      ),

    features,

    tags:
      house.tags,

    description:
      house.description,
  };
}

  function getHouseSearchMatchScore(
     house: HouseItem,
    search: string
  ) {
    if (!search.trim()) {
      return 0;
    }

    const intent =
      parseHouseSearchIntent(
        search
      );

    const semanticSearch =
      removeHouseSearchIntentText(
        search
      );

    const groups =
      parseHouseSearch(
        semanticSearch
      );

    let score = 0;

    const titleText =
      normalizeHouseSearchText(
        house.title
      );

    const locationText =
      normalizeHouseSearchText(
        [
          house.prefecture,
          house.city,
          house.location,
        ].join(" ")
      );

    const stationText =
      normalizeHouseSearchText(
        house.station
      );

    const layoutText =
      normalizeHouseSearchText(
        house.layout
      );

    const tagsText =
      normalizeHouseSearchText(
        house.tags.join(" ")
      );

    const descriptionText =
    normalizeHouseSearchText(
      house.description
    );

    const publisherCompany =
      house.publisherCompany ?? "";

    const companyText =
      normalizeHouseSearchText(
        publisherCompany
      );

  const fullText =
      normalizeHouseSearchText(
        [
          house.title,
          house.prefecture,
          house.city,
          house.station,
          house.location,
          house.layout,
          house.structure,
          house.direction,
          house.availableDate,
          publisherCompany,
          house.description,
          ...house.tags,
        ].join(" ")
      );

    for (const group of groups) {
      if (
        group.type === "feature"
      ) {
        if (
          group.key ===
          "foreigner_friendly"
        ) {
          if (
            house.foreignerAllowed ===
            true
          ) {
            score += 70;
          }

          continue;
        }

        if (
          group.key ===
          "student_allowed"
        ) {
          if (
            house.studentAllowed ===
            true
          ) {
            score += 70;
          }

          continue;
        }

        if (
          house.features.includes(
            group.key as HouseFeature
          )
        ) {
          score += 70;
        }

        continue;
      }

      for (const alias of group.aliases) {
        if (
          group.type === "station" &&
          stationText.includes(alias)
        ) {
          score += 100;
        }

        if (
          group.type === "location" &&
          locationText.includes(alias)
        ) {
          score += 80;
        }

        if (
          group.type === "layout" &&
          layoutText === alias
        ) {
          score += 90;
        }

        if (
          titleText.includes(alias)
        ) {
          score += 60;
        }

        if (
          tagsText.includes(alias)
        ) {
          score += 35;
        }

        if (
          companyText.includes(alias)
        ) {
          score += 10;
        }

        if (
          descriptionText.includes(alias)
        ) {
          score += 15;
        }

        if (
          fullText.includes(alias)
        ) {
          score += 5;
        }
      }
    }

    const normalizedSearch =
      normalizeHouseSearchText(
        search
      );

    if (
      normalizedSearch &&
      titleText.includes(
        normalizedSearch
      )
    ) {
      score += 80;
    }

    if (
      intent.preferredLayouts?.includes(
        house.layout.toUpperCase()
      )
    ) {
      score += 35;
    }

    if (
      intent.preferNearStation
    ) {
      if (
        house.features.includes(
          "near_station"
        )
      ) {
        score += 20;
      }

      if (
        house.walkMinutes !== null
      ) {
        score += Math.max(
          0,
          20 - house.walkMinutes
        );
      }
    }

    return score;
  }

  function sortHousesBySearchRelevance(
    list: HouseItem[],
    search: string
  ) {
    return [...list].sort(
      (a, b) =>
        getHouseSearchMatchScore(
          b,
          search
        ) -
        getHouseSearchMatchScore(
          a,
          search
        )
    );
  }

  function isNumericConstraintLiteral(
    value: string,
    numericFilters: ReturnType<
      typeof parseHouseNumericFilters
    >
  ) {
    const hasNumericFilter =
      numericFilters.rentMin !==
        undefined ||
      numericFilters.rentMax !==
        undefined ||
      numericFilters.areaMin !==
        undefined ||
      numericFilters.areaMax !==
        undefined ||
      numericFilters.walkMinutesMax !==
        undefined;

    if (!hasNumericFilter) {
      return false;
    }

    let text =
      normalizeHouseSearchText(
        value
      );

    text = text
      .replace(
        /(?:房租|租金|月租|预算|价格|面积|大小|距离车站|距车站|离车站|车站|車站|駅|步行|徒步|徒歩)/g,
        ""
      )
      .replace(
        /\d+(?:\.\d+)?/g,
        ""
      )
      .replace(
        /(?:万|円|日元|元|㎡|m2|m²|平米|平方米|平方公尺|分钟|分|以内|以下|以上|起步|起|至少|最低|不超过|不高于|最多|到|至)/g,
        ""
      );

    return text === "";
  }

function HousesPageContent() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [
  houses,
  setHouses,
] = useState<HouseItem[]>([]);

const [
  loading,
  setLoading,
] = useState(true);

const [
  loadError,
  setLoadError,
] = useState("");

useEffect(() => {
  let cancelled = false;

  async function loadHouses() {
    try {
      setLoading(true);
      setLoadError("");

      const response =
        await fetch(
          "/api/houses?limit=50"
        );

      const result:
        HousesApiResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          "房源读取失败"
        );
      }

      if (cancelled) {
        return;
      }

      setHouses(
        result.data.map(
          mapApiHouseToHouseItem
        )
      );
    } catch (error) {
      console.error(
        "[GET /api/houses]",
        error
      );

      if (!cancelled) {
        setLoadError(
          "房源加载失败，请稍后重试。"
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadHouses();

  return () => {
    cancelled = true;
  };
}, []);

  const pageParam = Number(
    searchParams.get("page")
  );

  const page =
    Number.isInteger(pageParam) &&
    pageParam > 0
      ? pageParam
      : 1;

  const keyword =
    searchParams
      .get("q")
      ?.trim() ?? "";

  const regionParam =
    searchParams.get("region");

  const region: Region =
    regionParam &&
    regions.includes(
      regionParam as Region
    )
      ? (regionParam as Region)
      : "全部地区";

  const layoutParam =
    searchParams.get("layout");

  const layout: Layout =
    layoutParam &&
    layouts.includes(
      layoutParam as Layout
    )
      ? (layoutParam as Layout)
      : "全部";

  const featureParam =
    searchParams.get("features") ??
    "";

  const activeFeatures: Feature[] =
    Array.from(
      new Set(
        featureParam
          .split(",")
          .filter(
            (
              value
            ): value is Feature =>
              features.some(
                (feature) =>
                  feature.key ===
                  value
              )
          )
      )
    );

  const sortParam =
    searchParams.get("sort");

  const sort: SortValue =
    sortParam &&
    sortValues.includes(
      sortParam as SortValue
    )
      ? (sortParam as SortValue)
      : "latest";

  const searchRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const searchInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  function pushParams(
  params: URLSearchParams
) {
  const query =
    params.toString();

  router.push(
    query
      ? `/houses?${query}`
      : "/houses",
    {
      scroll: false,
    }
  );
}

function updateFilters(
  update: (
    params: URLSearchParams
  ) => void
) {
  const params =
    new URLSearchParams(
      searchParams.toString()
    );

  update(params);

  /*
   * 任何筛选条件变化，
   * 自动回到第一页。
   */
  params.delete("page");

  pushParams(params);
}

function setPage(
  nextPage:
    | number
    | ((value: number) => number)
) {
  const resolvedPage =
    typeof nextPage === "function"
      ? nextPage(page)
      : nextPage;

  const newPage = Math.max(
    1,
    Math.floor(resolvedPage)
  );

  const params =
    new URLSearchParams(
      searchParams.toString()
    );

  if (newPage === 1) {
    params.delete("page");
  } else {
    params.set(
      "page",
      String(newPage)
    );
  }

  pushParams(params);
}

function handleSearch() {
  const value =
    searchInputRef.current
      ?.value.trim() ?? "";

  const params =
    new URLSearchParams();

  if (value) {
    params.set("q", value);
  }

  pushParams(params);
}

function handleHotKeyword(
  value: string
) {
  if (
    searchInputRef.current
  ) {
    searchInputRef.current.value =
      value;
  }

  const params =
    new URLSearchParams();

  params.set("q", value);

  pushParams(params);
}

function setRegionFilter(
  value: Region
) {
  updateFilters((params) => {
    params.delete("q");

    if (value === "全部地区") {
      params.delete("region");
    } else {
      params.set(
        "region",
        value
      );
    }
  });
}

function setLayoutFilter(
  value: Layout
) {
  updateFilters((params) => {
    params.delete("q");

    if (value === "全部") {
      params.delete("layout");
    } else {
      params.set(
        "layout",
        value
      );
    }
  });
}

function toggleFeature(
  feature: Feature
) {
  const nextFeatures =
    activeFeatures.includes(feature)
      ? activeFeatures.filter(
          (item) =>
            item !== feature
        )
      : [
          ...activeFeatures,
          feature,
        ];

  updateFilters((params) => {

    params.delete("q");
    if (
      nextFeatures.length === 0
    ) {
      params.delete(
        "features"
      );
    } else {
      params.set(
        "features",
        nextFeatures.join(",")
      );
    }
  });
}

function setSortFilter(
  value: SortValue
) {
  updateFilters((params) => {
    if (value === "latest") {
      params.delete("sort");
    } else {
      params.set(
        "sort",
        value
      );
    }
  });
}

function clearFilters() {
  if (
    searchInputRef.current
  ) {
    searchInputRef.current.value =
      "";
  }

  router.push(
    "/houses",
    {
      scroll: false,
    }
  );
}

  const filteredHouses = (() => {
    let result = houses.filter(
      (house) =>
        house.moderationStatus === "approved" &&
        (
          house.listingStatus === "available" ||
          house.listingStatus === "paused"
        )
    );

  const searchIntent =
    keyword
      ? parseHouseSearchIntent(
          keyword
        )
      : {};


    /* Search */

  if (keyword) {
    const semanticSearch =
      removeHouseSearchIntentText(
        keyword
      );

    const parsedSearch =
      parseHouseSearch(
        semanticSearch
      );

    const numericFilters =
      parseHouseNumericFilters(
        keyword
      );

    const conceptGroups =
      parsedSearch.filter(
        (group) =>
          group.type !== "literal"
      );

    const literalGroups =
      parsedSearch.filter(
        (group) =>
          group.type ===
            "literal" &&
          !isNumericConstraintLiteral(
            group.query,
            numericFilters
          )
      );

    result = result.filter(
      (house) => {
        const publisherCompany =
          house.publisherCompany ?? "";

        const houseText =
          normalizeHouseSearchText(
            [
              house.title,
              house.prefecture,
              house.city,
              house.station,
              house.location,
              house.layout,
              house.structure,
              house.direction,
              house.availableDate,
              publisherCompany,
              house.description,
              ...house.tags,
            ].join(" ")
          );
        const conceptsMatched =
          conceptGroups.every(
            (group) => {
              if (
                group.type ===
                "location"
              ) {
                const locationText =
                  normalizeHouseSearchText(
                    [
                      house.prefecture,
                      house.city,
                      house.location,
                    ].join(" ")
                  );

                return group.aliases.some(
                  (alias) =>
                    locationText.includes(
                      alias
                    )
                );
              }

              if (
                group.type ===
                "station"
              ) {
                const stationText =
                  normalizeHouseSearchText(
                    house.station
                  );

                return group.aliases.some(
                  (alias) =>
                    stationText.includes(
                      alias
                    )
                );
              }

              if (
                group.type ===
                "layout"
              ) {
                const layoutText =
                  normalizeHouseSearchText(
                    house.layout
                  );

                return group.aliases.some(
                  (alias) =>
                    layoutText === alias
                );
              }

              if (
                group.type ===
                "feature"
              ) {
                if (
                  group.key ===
                  "foreigner_friendly"
                ) {
                  return (
                    house.foreignerAllowed ===
                    true
                  );
                }

                if (
                  group.key ===
                  "student_allowed"
                ) {
                  return (
                    house.studentAllowed ===
                    true
                  );
                }

                return house.features.includes(
                  group.key as HouseFeature
                );
              }

              return true;
            }
          );

        if (!conceptsMatched) {
          return false;
        }

        const literalsMatched =
          literalGroups.every(
            (group) =>
              group.aliases.some(
                (alias) =>
                  houseText.includes(alias)
              )
          );

        if (!literalsMatched) {
          return false;
        }

        if (
          numericFilters.rentMin !==
            undefined &&
          house.rentValue <
            numericFilters.rentMin
        ) {
          return false;
        }

        if (
          numericFilters.rentMax !==
            undefined &&
          house.rentValue >
            numericFilters.rentMax
        ) {
          return false;
        }

        if (
          numericFilters.areaMin !==
            undefined &&
          house.areaValue <
            numericFilters.areaMin
        ) {
          return false;
        }

        if (
          numericFilters.areaMax !==
            undefined &&
          house.areaValue >
            numericFilters.areaMax
        ) {
          return false;
        }

        if (
          numericFilters.walkMinutesMax !==
          undefined
        ) {
          if (
            house.walkMinutes === null ||
            house.walkMinutes >
              numericFilters.walkMinutesMax
          ) {
            return false;
          }
        }

        return true;
      }
    );
  }

    /* Region */

    if (region !== "全部地区") {
      result = result.filter(
        (house) =>
          house.prefecture === region
      );
    }

    /* Layout */

    if (layout !== "全部") {
      if (layout === "3LDK+") {
        result = result.filter((house) =>
          /[3-9]LDK/i.test(
            house.layout
          )
        );
      } else {
        result = result.filter(
          (house) =>
            house.layout === layout
        );
      }
    }

    /* Sort */

    if (
      sort === "latest" &&
      keyword &&
      searchIntent.sort ===
        "rent-asc"
    ) {
      result.sort(
        (a, b) =>
          a.rentValue -
          b.rentValue
      );
    } else if (
      sort === "latest" &&
      keyword &&
      searchIntent.sort ===
        "area-desc"
    ) {
      result.sort(
        (a, b) =>
          b.areaValue -
          a.areaValue
      );
    } else if (
      sort === "latest" &&
      keyword
    ) {
      result =
        sortHousesBySearchRelevance(
          result,
          keyword
        );
    } else if (
      sort === "latest"
    ) {
      result.sort(
        (a, b) =>
          new Date(
            b.publishTime
          ).getTime() -
          new Date(
            a.publishTime
          ).getTime()
      );
    }

    /* Features */

    activeFeatures.forEach(
    (houseFeature) => {
      result = result.filter(
        (house) =>
          house.features.includes(
            houseFeature
          )
      );
    }
);

    if (sort === "rent-asc") {
      result.sort(
        (a, b) =>
          a.rentValue -
          b.rentValue
      );
    }

    if (sort === "rent-desc") {
      result.sort(
        (a, b) =>
          b.rentValue -
          a.rentValue
      );
    }

    if (sort === "area-desc") {
      result.sort(
        (a, b) =>
          b.areaValue -
          a.areaValue
      );
    }

    return result;
    })();

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredHouses.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const currentHouses =
    filteredHouses.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  const hasFilters =
    keyword !== "" ||
    region !== "全部地区" ||
    layout !== "全部" ||
    activeFeatures.length > 0;

  const searchParamsString =
    searchParams.toString();

  return (
    <main className="min-h-screen bg-slate-950">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-white/5
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-600/15
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-0
            top-0
            h-[480px]
            w-[480px]
            rounded-full
            bg-blue-600/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        <Container>
          <div
            className="
              relative
              px-4
              pb-16
              pt-16
              sm:pb-20
              sm:pt-20
            "
          >
            {/* Badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-400/10
                px-4
                py-2
                text-sm
                font-bold
                text-cyan-300
              "
            >
              <Home size={16} />

              SAKURA HOUSING
            </div>

            {/* Title */}

            <h1
              className="
                mt-6
                max-w-4xl
                text-4xl
                font-black
                tracking-tight
                text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              在日本，找到更适合你的
              <span
                className="
                  ml-2
                  bg-gradient-to-r
                  from-cyan-400
                  via-sky-300
                  to-blue-400
                  bg-clip-text
                  text-transparent
                "
              >
                房子
              </span>
            </h1>

            <p
              className="
                mt-5
                max-w-2xl
                text-base
                leading-8
                text-slate-400
                sm:text-lg
              "
            >
              按地区、户型和房源特点快速筛选，
              找房的同时也能提前了解租房注意事项。
            </p>

            {/* Search */}

            <div ref={searchRef} className="mt-10 max-w-4xl">
              <div
                className="
                  flex
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-white
                  shadow-2xl
                  shadow-black/20
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                  "
                >
                  <Search
                    size={20}
                    className="
                      ml-5
                      shrink-0
                      text-slate-400
                    "
                  />

                  <input
                    ref={searchInputRef}
                    defaultValue={keyword}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter"
                      ) {
                        handleSearch();
                      }
                    }}
                    placeholder="地区、车站、户型、可养宠物..."
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-4
                      py-5
                      text-sm
                      text-slate-900
                      outline-none
                      placeholder:text-slate-400
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="
                    shrink-0
                    bg-blue-600
                    px-7
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-blue-700
                    sm:px-10
                  "
                >
                  搜索房源
                </button>
              </div>
            </div>

            {/* Hot */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <span
                className="
                  mr-1
                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                热门
              </span>

              {hotKeywords.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      handleHotKeyword(
                        item
                      )
                    }
                    className="
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-slate-300
                      transition
                      hover:border-white/20
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            {/* Trust */}

            <div
              className="
                mt-7
                flex
                flex-wrap
                gap-x-6
                gap-y-3
                text-sm
                text-slate-400
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <ShieldCheck
                  size={17}
                  className="text-emerald-400"
                />

                房源信息持续更新
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <MapPin
                  size={17}
                  className="text-blue-400"
                />

                支持地区快速筛选
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section
        className="
          rounded-t-[32px]
          bg-slate-50
          py-10
          sm:py-12
        "
      >
        <Container>
          <div
            className="
              grid
              gap-8
              lg:grid-cols-[250px_minmax(0,1fr)]
            "
          >
            {/* ================================================= */}
            {/* SIDEBAR */}
            {/* ================================================= */}

            <aside
              className="
                h-fit
                rounded-[24px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                lg:sticky
                lg:top-24
              "
            >
              {/* Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-slate-900
                  "
                >
                  <SlidersHorizontal
                    size={18}
                  />

                  <h2 className="font-bold">
                    筛选房源
                  </h2>
                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      text-xs
                      font-bold
                      text-slate-400
                      transition
                      hover:text-blue-600
                    "
                  >
                    清除
                  </button>
                )}
              </div>

              {/* Region */}

              <FilterTitle>
                地区
              </FilterTitle>

              <div className="mt-3 space-y-1">
                {regions.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setRegionFilter(item)
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
                          region === item
                            ? "bg-blue-50 font-bold text-blue-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              {/* Layout */}

              <div
                className="
                  mt-7
                  border-t
                  border-slate-100
                  pt-6
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  户型
                </p>

                <div
                  className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-2
                  "
                >
                  {layouts.map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setLayoutFilter(item)
                        }
                        className={`
                          rounded-xl
                          border
                          px-2
                          py-2.5
                          text-xs
                          font-semibold
                          transition
                          ${
                            layout === item
                              ? "border-blue-200 bg-blue-50 text-blue-600"
                              : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                          }
                        `}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Features */}

              <div
                className="
                  mt-7
                  border-t
                  border-slate-100
                  pt-6
                "
              >
                <p
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  房源特点
                </p>

                <div className="mt-3 space-y-2">
                  {features.map(
                    (feature) => {
                      const active =
                        activeFeatures.includes(
                          feature.key
                        );

                      return (
                        <button
                          key={
                            feature.key
                          }
                          type="button"
                          onClick={() =>
                            toggleFeature(
                              feature.key
                            )
                          }
                          className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-xl
                            border
                            px-3
                            py-2.5
                            text-left
                            text-sm
                            font-medium
                            transition
                            ${
                              active
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-transparent text-slate-600 hover:bg-slate-50"
                            }
                          `}
                        >
                          {feature.label}

                          <span
                            className={`
                              flex
                              h-4
                              w-4
                              items-center
                              justify-center
                              rounded
                              border
                              ${
                                active
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-slate-300 bg-white"
                              }
                            `}
                          >
                            {active && (
                              <span
                                className="
                                  h-1.5
                                  w-1.5
                                  rounded-sm
                                  bg-white
                                "
                              />
                            )}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Safety */}

              <div
                className="
                  mt-7
                  rounded-2xl
                  border
                  border-amber-100
                  bg-amber-50
                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-amber-800
                  "
                >
                  <ShieldCheck
                    size={17}
                  />

                  <span
                    className="
                      text-sm
                      font-bold
                    "
                  >
                    租房提醒
                  </span>
                </div>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-amber-800/70
                  "
                >
                  签约前注意确认初期费用、
                  退房费用、更新费以及保证会社条件。
                </p>
              </div>
            </aside>

            {/* ================================================= */}
            {/* RESULTS */}
            {/* ================================================= */}

            <div id="house-results" className="min-w-0">
              {/* Top */}

              <div
                className="
                  mb-6
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <h2
                      className="
                        text-2xl
                        font-black
                        text-slate-900
                      "
                    >
                      房源一览
                    </h2>

                    <span
                      className="
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1
                        text-xs
                        font-bold
                        text-blue-600
                      "
                    >
                      {
                        filteredHouses.length
                      }{" "}
                      套
                    </span>
                  </div>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    根据你的搜索和筛选条件显示房源
                  </p>
                </div>

                {/* Sort */}

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) =>
                      setSortFilter(
                        e.target.value as SortValue
                      )
                    }
                    className="
                      appearance-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      py-3
                      pl-4
                      pr-10
                      text-sm
                      font-medium
                      text-slate-600
                      outline-none
                      transition
                      focus:border-blue-400
                    "
                  >
                    <option value="latest">
                      最新发布
                    </option>

                    <option value="rent-asc">
                      租金最低
                    </option>

                    <option value="rent-desc">
                      租金最高
                    </option>

                    <option value="area-desc">
                      面积最大
                    </option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />
                </div>
              </div>

              {/* Active filters */}

              {hasFilters && (
                <div
                  className="
                    mb-6
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  {keyword && (
                    <ActiveFilter
                      label={`搜索：${keyword}`}
                      onRemove={() =>
                        updateFilters(
                          (params) =>
                            params.delete("q")
                        )
                      }
                    />
                  )}

                  {region !==
                    "全部地区" && (
                    <ActiveFilter
                      label={region}
                      onRemove={() =>
                        setRegionFilter(
                          "全部地区"
                        )
                      }
                    />
                  )}

                  {layout !==
                    "全部" && (
                    <ActiveFilter
                      label={layout}
                      onRemove={() =>
                        setLayoutFilter("全部")
                      }
                    />
                  )}

                  {activeFeatures.map(
                    (key) => {
                      const feature =
                        features.find(
                          (item) =>
                            item.key ===
                            key
                        );

                      if (!feature) {
                        return null;
                      }

                      return (
                        <ActiveFilter
                          key={key}
                          label={
                            feature.label
                          }
                          onRemove={() =>
                            toggleFeature(
                              key
                            )
                          }
                        />
                      );
                    }
                  )}

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      ml-1
                      text-xs
                      font-bold
                      text-slate-400
                      transition
                      hover:text-blue-600
                    "
                  >
                    清除全部
                  </button>
                </div>
              )}

              {/* Cards */}

              {currentHouses.length >
              0 ? (
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-5
                    xl:grid-cols-2
                  "
                >
                {currentHouses.map(
                  (house) => {
                    const returnTo =
                      `/houses${
                        searchParamsString
                          ? `?${searchParamsString}`
                          : ""
                      }#house-${house.id}`;

                    return (
                      <div
                        key={house.id}
                        id={`house-${house.id}`}
                        className="scroll-mt-24"
                      >
                        <HouseCard
                          {...house}
                          href={`/houses/${house.id}?returnTo=${encodeURIComponent(
                            returnTo
                          )}`}
                        />
                      </div>
                    );
                  }
                )}
                </div>
              ) : (
                <div
                  className="
                    rounded-[24px]
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    px-6
                    py-20
                    text-center
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-slate-100
                      text-slate-500
                    "
                  >
                    <Search size={24} />
                  </div>

                  <h3
                    className="
                      mt-5
                      font-bold
                      text-slate-900
                    "
                  >
                    没有找到符合条件的房源
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    可以换一个地区、户型，
                    或减少一些筛选条件。
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      mt-5
                      text-sm
                      font-bold
                      text-blue-600
                      hover:text-blue-700
                    "
                  >
                    清除所有条件
                  </button>
                </div>
              )}

              {/* Pagination */}

              {totalPages > 1 && (
                <div
                  className="
                    mt-10
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setPage((value) =>
                        Math.max(
                          1,
                          value - 1
                        )
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-slate-600
                      transition
                      hover:border-slate-300
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
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
                  ).map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() =>
                        setPage(number)
                      }
                      className={`
                        h-10
                        w-10
                        rounded-xl
                        text-sm
                        font-bold
                        transition
                        ${
                          currentPage ===
                          number
                            ? "bg-slate-950 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                        }
                      `}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setPage((value) =>
                        Math.min(
                          totalPages,
                          value + 1
                        )
                      )
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-slate-600
                      transition
                      hover:border-slate-300
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    下一页
                  </button>
                </div>
              )}
            </div>
          </div>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  searchRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-600
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:border-slate-300
                  hover:text-slate-900
                  hover:shadow-md
                "
              >
                ↑ 返回顶部搜索
              </button>
            </div>
        </Container>
      </section>
    </main>
  );
}

export default function HousesPage() {
  return (
    <Suspense fallback={null}>
      <HousesPageContent />
    </Suspense>
  );
}

function FilterTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p
      className="
        mt-7
        text-xs
        font-bold
        uppercase
        tracking-wider
        text-slate-400
      "
    >
      {children}
    </p>
  );
}

function ActiveFilter({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div
      className="
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        border-blue-100
        bg-blue-50
        py-1.5
        pl-3
        pr-2
        text-xs
        font-semibold
        text-blue-700
      "
    >
      <span>{label}</span>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`删除筛选条件 ${label}`}
        className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          transition
          hover:bg-blue-100
        "
      >
        <X size={12} />
      </button>
    </div>
  );
}