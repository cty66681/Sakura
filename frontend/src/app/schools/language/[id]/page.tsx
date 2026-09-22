import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";

import LanguageSchoolHeader from "@/components/schools/language/LanguageSchoolHeader";
import LanguageSchoolInfo from "@/components/schools/language/LanguageSchoolInfo";
import LanguageSchoolCourse from "@/components/schools/language/LanguageSchoolCourse";
import LanguageSchoolTuition from "@/components/schools/language/LanguageSchoolTuition";
import LanguageSchoolDormitory from "@/components/schools/language/LanguageSchoolDormitory";
import LanguageSchoolGallery from "@/components/schools/language/LanguageSchoolGallery";
import LanguageSchoolReview from "@/components/schools/language/LanguageSchoolReview";
import LanguageSchoolSidebar from "@/components/schools/language/LanguageSchoolSidebar";

export type LanguageSchoolDetail = {
  id: string;
  name: string;
  englishName: string;

  location: string;
  area: string;
  address: string;

  type: "升学型" | "综合型" | "就业型";

  tuition: number;
  tuitionText: string;

  rating: number;
  foreignerRating: number;

  risk: "低风险" | "需要注意";

  chineseSupport: boolean;
  universitySupport: boolean;
  graduateSupport: boolean;
  visaSupport: boolean;

  website: string;

  description: string;

  tags: string[];
};

/*
|--------------------------------------------------------------------------
| MOCK DATA
|--------------------------------------------------------------------------
|
| TODO [API - GET]
|
| 后端完成后，这里的 schools MOCK 数据删除。
|
| 未来：
|
| GET /api/language-schools/:id
|
| 例如：
| GET /api/language-schools/1
|
| 返回：
| LanguageSchoolDetail
|
|--------------------------------------------------------------------------
*/

const schools: LanguageSchoolDetail[] = [
  {
    id: "1",

    name: "东京中央日本语学院",

    englishName:
      "Tokyo Central Japanese Language School",

    location: "东京 · 新宿",

    area: "东京",

    address:
      "东京都新宿区",

    type: "升学型",

    tuition: 780000,

    tuitionText:
      "约 ¥780,000 / 年",

    rating: 4.6,

    foreignerRating: 4.8,

    risk: "低风险",

    chineseSupport: true,

    universitySupport: true,

    graduateSupport: true,

    visaSupport: true,

    website:
      "https://example.com",

    description:
      "位于东京新宿地区的升学型日本语学校。学校提供大学、大学院升学指导，并为留学生提供生活与签证方面的支持。交通便利，适合希望在东京继续升学的学生。",

    tags: [
      "升学指导",
      "留学生支持",
      "交通方便",
    ],
  },

  {
    id: "2",

    name: "东京国际日本语学院",

    englishName:
      "Tokyo International Japanese Language Institute",

    location: "东京 · 新宿",

    area: "东京",

    address:
      "东京都新宿区",

    type: "升学型",

    tuition: 820000,

    tuitionText:
      "约 ¥820,000 / 年",

    rating: 4.5,

    foreignerRating: 4.7,

    risk: "低风险",

    chineseSupport: true,

    universitySupport: true,

    graduateSupport: true,

    visaSupport: true,

    website:
      "https://example.com",

    description:
      "以大学及大学院升学为主要方向的日本语学校。提供升学咨询、奖学金信息以及留学生生活支持，适合计划进入日本高等教育机构继续学习的学生。",

    tags: [
      "大学升学",
      "大学院升学",
      "奖学金",
    ],
  },

  {
    id: "3",

    name: "大阪国际日本语学校",

    englishName:
      "Osaka International Japanese Language School",

    location: "大阪 · 大阪市",

    area: "大阪",

    address:
      "大阪府大阪市",

    type: "综合型",

    tuition: 720000,

    tuitionText:
      "约 ¥720,000 / 年",

    rating: 4.4,

    foreignerRating: 4.6,

    risk: "需要注意",

    chineseSupport: true,

    universitySupport: true,

    graduateSupport: false,

    visaSupport: true,

    website:
      "https://example.com",

    description:
      "位于大阪市的综合型日本语学校。课程兼顾日语学习与升学准备，整体学费相对较低，同时提供留学生生活和签证相关支持。",

    tags: [
      "学费较低",
      "升学指导",
      "留学生支持",
    ],
  },

  {
    id: "4",

    name: "京都日本语学院",

    englishName:
      "Kyoto Japanese Language Institute",

    location: "京都 · 京都市",

    area: "京都",

    address:
      "京都府京都市",

    type: "升学型",

    tuition: 760000,

    tuitionText:
      "约 ¥760,000 / 年",

    rating: 4.7,

    foreignerRating: 4.7,

    risk: "低风险",

    chineseSupport: true,

    universitySupport: true,

    graduateSupport: true,

    visaSupport: true,

    website:
      "https://example.com",

    description:
      "位于京都市的升学型日本语学校。面向计划进入大学或大学院的留学生提供日语课程和升学指导，同时拥有较丰富的国际交流环境。",

    tags: [
      "大学升学",
      "京都生活",
      "国际交流",
    ],
  },

  {
    id: "5",

    name: "名古屋国际日本语学校",

    englishName:
      "Nagoya International Japanese Language School",

    location: "名古屋 · 中区",

    area: "名古屋",

    address:
      "爱知县名古屋市中区",

    type: "综合型",

    tuition: 690000,

    tuitionText:
      "约 ¥690,000 / 年",

    rating: 4.3,

    foreignerRating: 4.5,

    risk: "低风险",

    chineseSupport: true,

    universitySupport: true,

    graduateSupport: false,

    visaSupport: true,

    website:
      "https://example.com",

    description:
      "位于名古屋市中心地区的综合型日本语学校。学费和生活成本相对东京较低，同时提供升学以及就业相关支持。",

    tags: [
      "学费较低",
      "就业支持",
      "生活成本低",
    ],
  },

  {
    id: "6",

    name: "福冈国际日本语学校",

    englishName:
      "Fukuoka International Japanese Language School",

    location: "福冈 · 博多",

    area: "福冈",

    address:
      "福冈县福冈市博多区",

    type: "综合型",

    tuition: 650000,

    tuitionText:
      "约 ¥650,000 / 年",

    rating: 4.4,

    foreignerRating: 4.6,

    risk: "低风险",

    chineseSupport: true,

    universitySupport: true,

    graduateSupport: false,

    visaSupport: true,

    website:
      "https://example.com",

    description:
      "位于福冈博多地区的综合型日本语学校。生活成本较低，适合希望控制留学预算，同时考虑升学或就业发展的学生。",

    tags: [
      "生活成本低",
      "就业支持",
      "留学生支持",
    ],
  },

  {
    id: "7",

    name: "北海道日本语教育中心",

    englishName:
      "Hokkaido Japanese Language Education Center",

    location: "北海道 · 札幌",

    area: "北海道",

    address:
      "北海道札幌市",

    type: "综合型",

    tuition: 680000,

    tuitionText:
      "约 ¥680,000 / 年",

    rating: 4.2,

    foreignerRating: 4.5,

    risk: "低风险",

    chineseSupport: true,

    universitySupport: true,

    graduateSupport: false,

    visaSupport: true,

    website:
      "https://example.com",

    description:
      "位于札幌的日本语教育机构。相比东京和大阪，生活成本相对较低，并提供留学生生活支持及国际交流机会。",

    tags: [
      "生活成本低",
      "留学生支持",
      "国际交流",
    ],
  },

  {
    id: "8",

    name: "东京新宿日本语学院",

    englishName:
      "Tokyo Shinjuku Japanese Language Institute",

    location: "东京 · 新宿",

    area: "东京",

    address:
      "东京都新宿区",

    type: "就业型",

    tuition: 750000,

    tuitionText:
      "约 ¥750,000 / 年",

    rating: 4.1,

    foreignerRating: 4.4,

    risk: "需要注意",

    chineseSupport: true,

    universitySupport: false,

    graduateSupport: false,

    visaSupport: true,

    website:
      "https://example.com",

    description:
      "位于东京新宿的就业方向日本语学校。除日语课程外，也提供就业指导和兼职相关支持，适合以在日就业为主要目标的学生。",

    tags: [
      "就业指导",
      "兼职支持",
      "交通方便",
    ],
  },
];

export default async function LanguageSchoolDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    returnTo?: string;
  }>;
}) {
  const { id } = await params;

  const {
    returnTo,
  } = await searchParams;

  const returnHref =
    returnTo &&
    returnTo.startsWith(
      "/schools/language"
    )
      ? returnTo
      : "/schools/language";

  /*
  |--------------------------------------------------------------------------
  | TODO [API - GET]
  |--------------------------------------------------------------------------
  |
  | 正式接后端以后：
  |
  | const response = await fetch(
  |   `${API_URL}/api/language-schools/${id}`
  | );
  |
  | if (response.status === 404) {
  |   notFound();
  | }
  |
  | const school = await response.json();
  |
  | 现在暂时从 MOCK DATA 查找。
  |
  |--------------------------------------------------------------------------
  */

  const school = schools.find(
    (item) => item.id === id
  );

  if (!school) {
    notFound();
  }

  return (
    <main className="bg-slate-50 pb-20">
      {/* Header */}

      <LanguageSchoolHeader
        school={school}
        returnHref={returnHref}
      />

      <Container>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left */}

          <div className="space-y-8"> 
            <LanguageSchoolInfo
              school={school}
            />

            <LanguageSchoolCourse
              school={school}
            />

            <LanguageSchoolTuition
              school={school}
            />

            <LanguageSchoolDormitory
              school={school}
            />

            <LanguageSchoolGallery
              school={school}
            />

            <LanguageSchoolReview
              school={school}
            />
          </div>

          {/* Right */}

          <LanguageSchoolSidebar
            school={school}
          />
        </div>
      </Container>
    </main>
  );
}