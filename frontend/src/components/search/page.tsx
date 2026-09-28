"use client";

import { useState } from "react";

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
  const [keyword, setKeyword] = useState("");

  const [areas, setAreas] = useState<string[]>([]);

  const [sort, setSort] = useState("");

  const [salaryMin, setSalaryMin] = useState("");

  const [salaryMax, setSalaryMax] = useState("");

  const [page, setPage] = useState(1);

  const filteredJobs = jobs.filter((job) => {
  if (!keyword.trim()) {
    return true;
  }

  const text = [
    job.company,
    job.title,
    job.location,
    job.salary,
    ...job.tags,
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(keyword.toLowerCase());
});

const filteredHouses = houses.filter((house) => {
  if (!keyword.trim()) {
    return true;
  }

  const text = [
    house.title,
    house.location,
    house.rent,
    ...house.tags,
  ]
    .join(" ")
    .toLowerCase();

  return text.includes(keyword.toLowerCase());
});

  return (
    <main className="py-10">
      <Container>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
        />

        <SearchHot
          keywords={[
            "池袋",
            "新宿",
            "大阪",
            "1LDK",
            "近车站",
            "可养宠物",
          ]}
        />
        <SearchHistory />

        <SearchLayout
          sidebar={
            <SearchFilter
              onReset={() => {
                setKeyword("");
                setAreas([]);
                setSort("");
                setSalaryMin("");
                setSalaryMax("");
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
                  ]}
                />
              </FilterSection>

              <FilterSection title="薪资">
                <RangeFilter
                  min={salaryMin}
                  max={salaryMax}
                  unit="万円"
                  minPlaceholder="最低薪资"
                  maxPlaceholder="最高薪资"
                  onMinChange={setSalaryMin}
                  onMaxChange={setSalaryMax}
                />
              </FilterSection>
            </SearchFilter>
          }
        >
          <SearchResult>
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  {...job}
                />
              ))}

              {filteredHouses.map((house) => (
                <HouseCard
                  key={house.id}
                  {...house}
                />
              ))}

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