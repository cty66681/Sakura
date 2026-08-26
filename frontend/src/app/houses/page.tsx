"use client";

import { useMemo, useState } from "react";

import Container from "@/components/layout/Container";

import SearchBar from "@/components/search/SearchBar";
import SearchHot from "@/components/search/SearchHot";
import SearchLayout from "@/components/search/SearchLayout";
import SearchFilter from "@/components/search/SearchFilter";
import SearchResult from "@/components/search/SearchResult";
import Pagination from "@/components/search/Pagination";

import FilterSection from "@/components/search/filters/FilterSection";
import CheckboxFilter from "@/components/search/filters/CheckboxFilter";
import SelectFilter from "@/components/search/filters/SelectFilter";

import HouseCard from "@/components/home/HouseCard";

import { houses } from "@/data/houses";

import {
  Search,
  Home,
  ShieldCheck,
  MapPin,
} from "lucide-react";

const PAGE_SIZE = 6;

export default function HousesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const handleKeywordChange = (value: string) => {
  setKeyword(value);
};

  const [page, setPage] = useState(1);

  const [areas, setAreas] = useState<string[]>([]);

  const [layout, setLayout] = useState<string[]>([]);

  const [features, setFeatures] = useState<string[]>([]);

  const [sort, setSort] = useState("");

  const hotKeywords = [
    "池袋",
    "新宿",
    "涩谷",
    "1LDK",
    "近车站",
    "可养宠物",
  ];

  // 检索用
  const handleSearch = () => {
    setKeyword(searchInput.trim());
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | 筛选
  |--------------------------------------------------------------------------
  */

  const filteredHouses = useMemo(() => {
    let result = [...houses];

    /*
    |--------------------------------------------------------------------------
    | 关键词搜索
    |--------------------------------------------------------------------------
    */

    if (keyword.trim()) {
      const searchKeyword = keyword
        .trim()
        .toLowerCase();

      result = result.filter((house) => {
        const searchableText = [
          house.title,
          house.location,
          house.rent,
          house.layout,
          house.area,
          ...(house.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchKeyword);
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 地区
    |--------------------------------------------------------------------------
    */

    if (areas.length > 0) {
      result = result.filter((house) => {
        return areas.some((area) => {
          switch (area) {
            case "tokyo":
              return (
                house.location.includes("东京") ||
                house.location.includes("東京")
              );

            case "kanagawa":
              return (
                house.location.includes("神奈川")
              );

            case "chiba":
              return (
                house.location.includes("千叶") ||
                house.location.includes("千葉")
              );

            case "saitama":
              return (
                house.location.includes("埼玉")
              );

            default:
              return true;
          }
        });
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 户型
    |--------------------------------------------------------------------------
    */

    if (layout.length > 0) {
      result = result.filter((house) =>
        layout.some((item) =>
          house.layout.includes(item)
        )
      );
    }

    /*
    |--------------------------------------------------------------------------
    | 房源特点
    |--------------------------------------------------------------------------
    */

    if (features.length > 0) {
      result = result.filter((house) => {
        const tags = house.tags ?? [];

        return features.every((feature) => {
          switch (feature) {
            case "near_station":
              return tags.some(
                (tag) =>
                  tag.includes("近车站") ||
                  tag.includes("车站") ||
                  tag.includes("駅")
              );

            case "pet":
              return tags.some(
                (tag) =>
                  tag.includes("宠物") ||
                  tag.includes("ペット")
              );

            case "no_key_money":
              return (
                tags.some(
                  (tag) =>
                    tag.includes("免礼金") ||
                    tag.includes("礼金")
                ) ||
                house.keyMoney === "0円"
              );

            case "furnished":
              return tags.some(
                (tag) =>
                  tag.includes("拎包") ||
                  tag.includes("家具") ||
                  tag.includes("即入住")
              );

            default:
              return true;
          }
        });
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 排序
    |--------------------------------------------------------------------------
    */

    if (sort === "rent_asc") {
      result.sort((a, b) => {
        const rentA =
          Number(
            a.rent
              .replace(/[^\d]/g, "")
          ) || 0;

        const rentB =
          Number(
            b.rent
              .replace(/[^\d]/g, "")
          ) || 0;

        return rentA - rentB;
      });
    }

    if (sort === "rent_desc") {
      result.sort((a, b) => {
        const rentA =
          Number(
            a.rent
              .replace(/[^\d]/g, "")
          ) || 0;

        const rentB =
          Number(
            b.rent
              .replace(/[^\d]/g, "")
          ) || 0;

        return rentB - rentA;
      });
    }

    if (sort === "area_desc") {
      result.sort((a, b) => {
        const areaA =
          Number(
            a.area
              .replace(/[^\d.]/g, "")
          ) || 0;

        const areaB =
          Number(
            b.area
              .replace(/[^\d.]/g, "")
          ) || 0;

        return areaB - areaA;
      });
    }

    return result;
  }, [
    keyword,
    areas,
    layout,
    features,
    sort,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

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

  const currentHouses = filteredHouses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  /*
  |--------------------------------------------------------------------------
  | 搜索 / 筛选变化
  |--------------------------------------------------------------------------
  */

  // const handleKeywordChange = (
  //   value: string
  // ) => {
  //   setKeyword(value);
  //   setPage(1);
  // };

  const handleAreasChange = (
    value: string[]
  ) => {
    setAreas(value);
    setPage(1);
  };

  const handleLayoutChange = (
    value: string[]
  ) => {
    setLayout(value);
    setPage(1);
  };

  const handleFeaturesChange = (
    value: string[]
  ) => {
    setFeatures(value);
    setPage(1);
  };

  const handleSortChange = (
    value: string
  ) => {
    setSort(value);
    setPage(1);
  };

  const handleReset = () => {
    setKeyword("");
    setSearchInput("");
    setAreas([]);
    setLayout([]);
    setFeatures([]);
    setSort("");
    setPage(1);
  };

  return (
    <>
      <main className="min-h-screen bg-slate-950">

        {/* =========================================================
            Hero
        ========================================================= */}

        <section className="
          relative
          overflow-hidden
          border-b
          border-white/10
        ">

          {/* Background Glow */}

          <div className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-blue-600/20
            blur-3xl
          " />

          <div className="
            absolute
            right-[-100px]
            top-20
            h-[450px]
            w-[450px]
            rounded-full
            bg-cyan-500/10
            blur-3xl
          " />

          <div className="
            absolute
            bottom-[-200px]
            left-1/2
            h-[400px]
            w-[400px]
            -translate-x-1/2
            rounded-full
            bg-violet-600/10
            blur-3xl
          " />

          <Container>

            <div className="
              relative
              px-4
              pb-16
              pt-14
              sm:pt-20
            ">

              {/* Label */}

              <div className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-blue-400/20
                bg-blue-400/10
                px-4
                py-2
                text-sm
                font-medium
                text-blue-300
              ">

                <Home size={16} />

                JAPAN HOUSING

              </div>

              {/* Title */}

              <h1 className="
                mt-6
                max-w-4xl
                text-4xl
                font-bold
                tracking-tight
                text-white
                sm:text-5xl
                lg:text-6xl
              ">

                找到真正适合你的

                <span className="
                  ml-2
                  bg-gradient-to-r
                  from-blue-400
                  via-cyan-400
                  to-violet-400
                  bg-clip-text
                  text-transparent
                ">
                  日本房源
                </span>

              </h1>

              {/* Description */}

              <p className="
                mt-5
                max-w-2xl
                text-base
                leading-8
                text-slate-400
                sm:text-lg
              ">
                东京、大阪、神奈川、千叶、埼玉，
                找房、租房、避坑，一站解决。
              </p>

              {/* Search */}

              <div className="
                mt-10
                max-w-4xl
              ">

                <div className="
                  flex
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-white
                  shadow-2xl
                ">

                  <div className="
                    flex
                    flex-1
                    items-center
                  ">

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
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      placeholder="搜索地区、小区、户型、房源特点..."
                      className="
                        w-full
                        bg-transparent
                        px-4
                        py-5
                        text-sm
                        text-slate-900
                        outline-none
                      "
                    />

                  </div>

                  <button
                    onClick={handleSearch}
                    className="
                      hidden
                      bg-blue-600
                      px-8
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:bg-blue-700
                      sm:block
                    "
                  >
                    搜索
                  </button>

                </div>

              </div>

              {/* Trust */}

              <div className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
                text-sm
                text-slate-500
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                ">

                  <ShieldCheck
                    size={17}
                    className="text-emerald-400"
                  />

                  房源信息持续更新

                </div>

                <div className="
                  flex
                  items-center
                  gap-2
                ">

                  <MapPin
                    size={17}
                    className="text-blue-400"
                  />

                  日本主要地区

                </div>

              </div>

            </div>

          </Container>

        </section>


        {/* =========================================================
            Content
        ========================================================= */}

        <section className="
          rounded-t-[2rem]
          bg-slate-50
          py-10
          sm:py-12
        ">

          <Container>

            {/* Page Header */}

            <div className="
              mb-7
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            ">

              <div>

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <h2 className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    sm:text-3xl
                  ">
                    房源一览
                  </h2>

                  <span className="
                    rounded-full
                    bg-blue-50
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-blue-600
                  ">
                    {filteredHouses.length} 套
                  </span>

                </div>

                <p className="
                  mt-2
                  text-sm
                  text-slate-500
                ">
                  从真实需求出发，快速找到适合你的房子
                </p>

              </div>

              <div className="
                text-sm
                text-slate-400
              ">
                第 {currentPage} / {totalPages} 页
              </div>

            </div>


            {/* Hot Keywords */}

            <div className="mb-8">

              <SearchHot
                keywords={hotKeywords}
                onClick={(value) => {
                  handleKeywordChange(value);
                }}
              />

            </div>


            {/* Search Layout */}

            <SearchLayout
              sidebar={
                <SearchFilter
                  onReset={handleReset}
                >

                  {/* 地区 */}

                  <FilterSection title="地区">

                    <CheckboxFilter
                      value={areas}
                      onChange={handleAreasChange}
                      options={[
                        {
                          label: "东京",
                          value: "tokyo",
                        },
                        {
                          label: "神奈川",
                          value: "kanagawa",
                        },
                        {
                          label: "千叶",
                          value: "chiba",
                        },
                        {
                          label: "埼玉",
                          value: "saitama",
                        },
                      ]}
                    />

                  </FilterSection>


                  {/* 户型 */}

                  <FilterSection title="户型">

                    <CheckboxFilter
                      value={layout}
                      onChange={handleLayoutChange}
                      options={[
                        {
                          label: "1R",
                          value: "1R",
                        },
                        {
                          label: "1K",
                          value: "1K",
                        },
                        {
                          label: "1DK",
                          value: "1DK",
                        },
                        {
                          label: "1LDK",
                          value: "1LDK",
                        },
                        {
                          label: "2LDK",
                          value: "2LDK",
                        },
                        {
                          label: "3LDK+",
                          value: "3LDK",
                        },
                      ]}
                    />

                  </FilterSection>


                  {/* 房源特点 */}

                  <FilterSection title="房源特点">

                    <CheckboxFilter
                      value={features}
                      onChange={handleFeaturesChange}
                      options={[
                        {
                          label: "近车站",
                          value: "near_station",
                        },
                        {
                          label: "可养宠物",
                          value: "pet",
                        },
                        {
                          label: "免礼金",
                          value: "no_key_money",
                        },
                        {
                          label: "拎包入住",
                          value: "furnished",
                        },
                      ]}
                    />

                  </FilterSection>


                  {/* 排序 */}

                  <FilterSection title="排序">

                    <SelectFilter
                      value={sort}
                      onChange={handleSortChange}
                      placeholder="请选择排序"
                      options={[
                        {
                          label: "最新发布",
                          value: "latest",
                        },
                        {
                          label: "租金最低",
                          value: "rent_asc",
                        },
                        {
                          label: "租金最高",
                          value: "rent_desc",
                        },
                        {
                          label: "面积最大",
                          value: "area_desc",
                        },
                      ]}
                    />

                  </FilterSection>

                </SearchFilter>
              }
            >

              <SearchResult>

                {/* 房源列表 */}

                {currentHouses.length > 0 ? (

                  <div className="
                    space-y-6
                  ">

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

                  /* Empty State */

                  <div className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    bg-white
                    px-6
                    py-24
                    text-center
                  ">

                    <div className="
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-blue-50
                      text-blue-500
                    ">

                      <Search size={28} />

                    </div>

                    <h3 className="
                      mt-5
                      text-lg
                      font-semibold
                      text-slate-900
                    ">
                      没有找到符合条件的房源
                    </h3>

                    <p className="
                      mx-auto
                      mt-2
                      max-w-md
                      text-sm
                      leading-6
                      text-slate-500
                    ">
                      可以尝试更换地区、户型，
                      或减少筛选条件。
                    </p>

                    <button
                      onClick={handleReset}
                      className="
                        mt-6
                        rounded-xl
                        bg-blue-600
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      清除筛选
                    </button>

                  </div>

                )}


                {/* Pagination */}

                {totalPages > 1 && (

                  <div className="
                    mt-10
                  ">

                    <Pagination
                      page={currentPage}
                      totalPages={totalPages}
                      onChange={(nextPage) => {
                        setPage(nextPage);

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    />

                  </div>

                )}

              </SearchResult>

            </SearchLayout>

          </Container>

        </section>

      </main>
    </>
  );
}