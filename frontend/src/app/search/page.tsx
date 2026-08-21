"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Container from "@/components/layout/Container";

import SearchBar from "@/components/search/SearchBar";
import SearchHot from "@/components/search/SearchHot";
import SearchHistory from "@/components/search/SearchHistory";
import SearchLayout from "@/components/search/SearchLayout";
import SearchFilter from "@/components/search/SearchFilter";
import SearchResult from "@/components/search/SearchResult";
import Pagination from "@/components/search/Pagination";

import FilterSection from "@/components/search/filters/FilterSection";
import CheckboxFilter from "@/components/search/filters/CheckboxFilter";
import SelectFilter from "@/components/search/filters/SelectFilter";
import RangeFilter from "@/components/search/filters/RangeFilter";

import JobCard from "@/components/home/JobCard";
import HouseCard from "@/components/home/HouseCard";

import { jobs } from "@/data/jobs";
import { houses } from "@/data/houses";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [keyword, setKeyword] = useState(
    searchParams.get("q") ?? ""
  );

  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("q") ?? ""
  );

  const handleSearch = () => {
    const q = keyword.trim();

    setSearchKeyword(q);

    if (!q) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const [areas, setAreas] = useState<string[]>([]);
  const [sort, setSort] = useState("");
  const [salary, setSalary] = useState("");
  const [page, setPage] = useState(1);

  // 工作搜索
  const keywordLower = searchKeyword.trim().toLowerCase();

  const filteredJobs = jobs
    .map((job) => {
      if (!keywordLower) {
        return {
          job,
          score: 0,
        };
      }

      let score = 0;

      if (job.title.toLowerCase().includes(keywordLower)) {
        score += 100;
      }

      if (job.company.toLowerCase().includes(keywordLower)) {
        score += 80;
      }

      if (
        job.tags.some((tag) =>
          tag.toLowerCase().includes(keywordLower)
        )
      ) {
        score += 60;
      }

      if (job.location.toLowerCase().includes(keywordLower)) {
        score += 30;
      }

      if (job.salary.toLowerCase().includes(keywordLower)) {
        score += 10;
      }

      return {
        job,
        score,
      };
    })
    .filter((item) => !keywordLower || item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.job);

  // 房源搜索
  const filteredHouses = houses
  .map((house) => {
    if (!keywordLower) {
      return {
        house,
        score: 0,
      };
    }

    let score = 0;

    if (house.title.toLowerCase().includes(keywordLower)) {
      score += 100;
    }

    if (house.location.toLowerCase().includes(keywordLower)) {
      score += 80;
    }

    if (
      house.tags.some((tag) =>
        tag.toLowerCase().includes(keywordLower)
      )
    ) {
      score += 50;
    }

    if (house.rent.toLowerCase().includes(keywordLower)) {
      score += 20;
    }

    return {
      house,
      score,
    };
  })
  .filter((item) => !keywordLower || item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map((item) => item.house);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setKeyword(q);
    setSearchKeyword(q);
  }, [searchParams]);

  const hotKeywords = [
    "Java",
    "React",
    "AWS",
    "Spring Boot",
    "东京",
    "IT",
  ];

  return (
    <main className="py-10">
      <Container>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSearch={() => handleSearch()}
        />

        <SearchHot
          keywords={hotKeywords}
          onClick={(value) => {
            setKeyword(value);
            setSearchKeyword(value);
            router.push(`/search?q=${encodeURIComponent(value)}`);
          }}
        />

        <SearchHistory />

        <SearchLayout
          sidebar={
            <SearchFilter
              onReset={() => {
                setKeyword("");

                setAreas([]);
                setSort("");
                setSalary("");
                router.push("/search");
              }}
            >
              <FilterSection title="地区">
                <CheckboxFilter
                  value={areas}
                  onChange={setAreas}
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

              <FilterSection title="排序">
                <SelectFilter
                  value={sort}
                  onChange={setSort}
                  placeholder="请选择排序"
                  options={[
                    {
                      label: "最新发布",
                      value: "latest",
                    },
                    {
                      label: "最热门",
                      value: "popular",
                    },
                    {
                      label: "薪资最高",
                      value: "salary_desc",
                    },
                    {
                      label: "薪资最低",
                      value: "salary_asc",
                    },
                  ]}
                />
              </FilterSection>

              <FilterSection title="薪资">
                <SelectFilter
                  value={salary}
                  onChange={setSalary}
                  placeholder="不限薪资"
                  options={[
                    {
                      label: "100万以下",
                      value: "0-100",
                    },
                    {
                      label: "100万 ~ 300万",
                      value: "100-300",
                    },
                    {
                      label: "300万 ~ 500万",
                      value: "300-500",
                    },
                    {
                      label: "500万 ~ 700万",
                      value: "500-700",
                    },
                    {
                      label: "700万 ~ 1000万",
                      value: "700-1000",
                    },
                    {
                      label: "1000万以上",
                      value: "1000+",
                    },
                  ]}
                />
              </FilterSection>
            </SearchFilter>
          }
        >
          <SearchResult>
            <div className="space-y-8">

              {/* 工作 */}
              <div>
                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  工作
                </h2>

                <div className="space-y-6">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      {...job}
                    />
                  ))}
                </div>
              </div>

              {/* 房源 */}
              <div>
                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  房源
                </h2>

                <div className="space-y-6">
                  {filteredHouses.map((house) => (
                    <HouseCard
                      key={house.id}
                      {...house}
                    />
                  ))}
                </div>
              </div>

              <Pagination
                page={page}
                totalPages={8}
                onChange={setPage}
              />
            </div>
          </SearchResult>
        </SearchLayout>
      </Container>
    </main>
  );
}