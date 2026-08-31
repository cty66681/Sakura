"use client";

import { useMemo, useState } from "react";
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

import { houses } from "@/data/houses";

const PAGE_SIZE = 6;

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
    key: "nearStation",
    label: "近车站",
  },
  {
    key: "pet",
    label: "可养宠物",
  },
  {
    key: "noKeyMoney",
    label: "免礼金",
  },
  {
    key: "furnished",
    label: "拎包入住",
  },
] as const;

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

function getRentNumber(rent: string) {
  return (
    Number(
      rent.replace(/[^\d]/g, "")
    ) || 0
  );
}

function getAreaNumber(area: string) {
  return (
    Number(
      area.replace(/[^\d.]/g, "")
    ) || 0
  );
}

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

export default function HousesPage() {
  const [searchInput, setSearchInput] =
    useState("");

  const [keyword, setKeyword] =
    useState("");

  const [region, setRegion] =
    useState<Region>("全部地区");

  const [layout, setLayout] =
    useState<Layout>("全部");

  const [activeFeatures, setActiveFeatures] =
    useState<Feature[]>([]);

  const [sort, setSort] =
    useState("latest");

  const [page, setPage] =
    useState(1);

  function resetPage() {
    setPage(1);
  }

  function handleSearch() {
    setKeyword(searchInput.trim());
    resetPage();
  }

  function handleHotKeyword(value: string) {
    setSearchInput(value);
    setKeyword(value);
    resetPage();
  }

  function toggleFeature(feature: Feature) {
    setActiveFeatures((current) =>
      current.includes(feature)
        ? current.filter(
            (item) => item !== feature
          )
        : [...current, feature]
    );

    resetPage();
  }

  function clearFilters() {
    setSearchInput("");
    setKeyword("");
    setRegion("全部地区");
    setLayout("全部");
    setActiveFeatures([]);
    setSort("latest");
    setPage(1);
  }

  const filteredHouses = useMemo(() => {
    let result = [...houses];

    /* Search */

    if (keyword) {
      const searchKeyword =
        keyword.toLowerCase();

      result = result.filter((house) =>
        [
          house.title,
          house.location,
          house.rent,
          house.layout,
          house.area,
          ...house.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchKeyword)
      );
    }

    /* Region */

    if (region !== "全部地区") {
      result = result.filter((house) =>
        house.location.includes(region)
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

    /* Near station */

    if (
      activeFeatures.includes(
        "nearStation"
      )
    ) {
      result = result.filter((house) =>
        house.tags.some(
          (tag) =>
            tag.includes("近车站") ||
            tag.includes("车站") ||
            tag.includes("駅")
        )
      );
    }

    /* Pet */

    if (
      activeFeatures.includes("pet")
    ) {
      result = result.filter((house) =>
        house.tags.some(
          (tag) =>
            tag.includes("宠物") ||
            tag.includes("ペット")
        )
      );
    }

    /* No key money */

    if (
      activeFeatures.includes(
        "noKeyMoney"
      )
    ) {
      result = result.filter(
        (house) =>
          house.keyMoney === "0个月" ||
          house.tags.some((tag) =>
            tag.includes("免礼金")
          )
      );
    }

    /* Furnished */

    if (
      activeFeatures.includes(
        "furnished"
      )
    ) {
      result = result.filter((house) =>
        house.tags.some(
          (tag) =>
            tag.includes("拎包入住") ||
            tag.includes("家具家电") ||
            tag.includes("家具")
        )
      );
    }

    /* Sort */

    if (sort === "latest") {
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

    if (sort === "rentAsc") {
      result.sort(
        (a, b) =>
          getRentNumber(a.rent) -
          getRentNumber(b.rent)
      );
    }

    if (sort === "rentDesc") {
      result.sort(
        (a, b) =>
          getRentNumber(b.rent) -
          getRentNumber(a.rent)
      );
    }

    if (sort === "areaDesc") {
      result.sort(
        (a, b) =>
          getAreaNumber(b.area) -
          getAreaNumber(a.area)
      );
    }

    return result;
  }, [
    keyword,
    region,
    layout,
    activeFeatures,
    sort,
  ]);

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

            <div className="mt-10 max-w-4xl">
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
                    value={searchInput}
                    onChange={(e) =>
                      setSearchInput(
                        e.target.value
                      )
                    }
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
                      onClick={() => {
                        setRegion(item);
                        resetPage();
                      }}
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
                        onClick={() => {
                          setLayout(item);
                          resetPage();
                        }}
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

            <div className="min-w-0">
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
                    onChange={(e) => {
                      setSort(
                        e.target.value
                      );
                      resetPage();
                    }}
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

                    <option value="rentAsc">
                      租金最低
                    </option>

                    <option value="rentDesc">
                      租金最高
                    </option>

                    <option value="areaDesc">
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
                      onRemove={() => {
                        setKeyword("");
                        setSearchInput("");
                        resetPage();
                      }}
                    />
                  )}

                  {region !==
                    "全部地区" && (
                    <ActiveFilter
                      label={region}
                      onRemove={() => {
                        setRegion(
                          "全部地区"
                        );
                        resetPage();
                      }}
                    />
                  )}

                  {layout !==
                    "全部" && (
                    <ActiveFilter
                      label={layout}
                      onRemove={() => {
                        setLayout("全部");
                        resetPage();
                      }}
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
                    (house) => (
                      <HouseCard
                        key={house.id}
                        {...house}
                      />
                    )
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
        </Container>
      </section>
    </main>
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