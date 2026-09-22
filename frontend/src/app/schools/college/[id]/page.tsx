import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";

import CollegeHeader from "@/components/schools/college/CollegeHeader";
import CollegeInfo from "@/components/schools/college/CollegeInfo";
import CollegeCourse from "@/components/schools/college/CollegeCourse";
import CollegeTuition from "@/components/schools/college/CollegeTuition";
import CollegeEmployment from "@/components/schools/college/CollegeEmployment";
import CollegeGallery from "@/components/schools/college/CollegeGallery";
import CollegeReview from "@/components/schools/college/CollegeReview";
import CollegeSidebar from "@/components/schools/college/CollegeSidebar";

export type CollegeDetail = {
  id: string;

  name: string;
  englishName: string;

  location: string;
  area: string;
  address: string;

  category:
    | "IT・AI"
    | "设计・动漫"
    | "商务・观光"
    | "美容・时尚"
    | "医疗・福祉"
    | "汽车・技术";

  tuition: number;

  rating: number;
  employmentRate: number;

  internationalSupport: boolean;
  chineseSupport: boolean;
  visaSupport: boolean;

  recommended: boolean;

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
| 后端完成后删除这里的 MOCK DATA。
|
| GET /api/colleges/:id
|
| 示例：
|
| GET /api/colleges/tokyo-tech-ai
|
| 返回：
|
| CollegeDetail
|
|--------------------------------------------------------------------------
*/

const colleges: CollegeDetail[] = [
  {
    id: "tokyo-tech-ai",

    name: "东京科技AI专门学校",

    englishName:
      "Tokyo Technology & AI College",

    location: "东京 · 新宿",

    area: "东京",

    address: "东京都新宿区",

    category: "IT・AI",

    tuition: 1180000,

    rating: 4.7,

    employmentRate: 96,

    internationalSupport: true,

    chineseSupport: true,

    visaSupport: true,

    recommended: true,

    website: "https://example.com",

    description:
      "位于东京新宿地区的IT与AI方向专门学校。课程覆盖人工智能、Web开发、程序设计、云计算等领域，同时提供面向留学生的日语学习、求职指导以及签证相关支持。适合希望毕业后进入日本IT行业工作的学生。",

    tags: [
      "AI开发",
      "Web开发",
      "外国人就业支持",
    ],
  },

  {
    id: "tokyo-design",

    name: "东京设计动漫专门学校",

    englishName:
      "Tokyo Design & Anime College",

    location: "东京 · 涩谷",

    area: "东京",

    address: "东京都涩谷区",

    category: "设计・动漫",

    tuition: 1250000,

    rating: 4.6,

    employmentRate: 93,

    internationalSupport: true,

    chineseSupport: true,

    visaSupport: true,

    recommended: true,

    website: "https://example.com",

    description:
      "位于东京涩谷的设计与动漫方向专门学校。主要课程包括动漫制作、角色设计、游戏设计、插画和平面设计，并提供作品集指导以及面向创意行业的就业支持。",

    tags: [
      "动漫",
      "游戏设计",
      "平面设计",
    ],
  },

  {
    id: "osaka-computer",

    name: "大阪计算机专门学校",

    englishName:
      "Osaka Computer College",

    location: "大阪 · 大阪市",

    area: "大阪",

    address: "大阪府大阪市",

    category: "IT・AI",

    tuition: 1050000,

    rating: 4.5,

    employmentRate: 95,

    internationalSupport: true,

    chineseSupport: true,

    visaSupport: true,

    recommended: true,

    website: "https://example.com",

    description:
      "大阪地区以计算机和IT技术教育为核心的专门学校。课程包含程序开发、网络工程、系统开发和IT基础，并提供企业说明会、实习以及就业指导。",

    tags: [
      "程序开发",
      "网络工程",
      "就业率高",
    ],
  },

  {
    id: "kyoto-design",

    name: "京都艺术设计专门学校",

    englishName:
      "Kyoto Art & Design College",

    location: "京都 · 京都市",

    area: "京都",

    address: "京都府京都市",

    category: "设计・动漫",

    tuition: 1190000,

    rating: 4.6,

    employmentRate: 91,

    internationalSupport: true,

    chineseSupport: false,

    visaSupport: true,

    recommended: false,

    website: "https://example.com",

    description:
      "位于京都的艺术与设计类专门学校。课程覆盖视觉设计、插画、数字内容以及创意制作，并通过作品集制作和企业合作项目帮助学生积累实际经验。",

    tags: [
      "艺术设计",
      "插画",
      "视觉设计",
    ],
  },

  {
    id: "nagoya-business",

    name: "名古屋国际商务专门学校",

    englishName:
      "Nagoya International Business College",

    location: "名古屋 · 中区",

    area: "名古屋",

    address: "爱知县名古屋市中区",

    category: "商务・观光",

    tuition: 980000,

    rating: 4.3,

    employmentRate: 92,

    internationalSupport: true,

    chineseSupport: true,

    visaSupport: true,

    recommended: false,

    website: "https://example.com",

    description:
      "面向国际学生提供商务、酒店、观光以及商务日语教育的专门学校。课程强调实际职场能力，并提供面试训练、履历书指导和企业就业介绍。",

    tags: [
      "商务日语",
      "酒店观光",
      "就业指导",
    ],
  },

  {
    id: "fukuoka-tourism",

    name: "福冈观光商务专门学校",

    englishName:
      "Fukuoka Tourism & Business College",

    location: "福冈 · 博多",

    area: "福冈",

    address: "福冈县福冈市博多区",

    category: "商务・观光",

    tuition: 920000,

    rating: 4.4,

    employmentRate: 94,

    internationalSupport: true,

    chineseSupport: true,

    visaSupport: true,

    recommended: true,

    website: "https://example.com",

    description:
      "位于福冈博多地区的观光商务类专门学校。主要培养酒店、旅游、航空服务和国际商务领域人才，适合希望进入日本服务行业工作的留学生。",

    tags: [
      "酒店",
      "旅游",
      "航空服务",
    ],
  },

  {
    id: "tokyo-beauty",

    name: "东京美容时尚专门学校",

    englishName:
      "Tokyo Beauty & Fashion College",

    location: "东京 · 池袋",

    area: "东京",

    address: "东京都丰岛区",

    category: "美容・时尚",

    tuition: 1320000,

    rating: 4.5,

    employmentRate: 94,

    internationalSupport: true,

    chineseSupport: true,

    visaSupport: true,

    recommended: false,

    website: "https://example.com",

    description:
      "位于东京池袋的美容与时尚类专门学校。课程包括美容、美发、造型、时尚设计等方向，并提供资格考试以及相关行业就业支持。",

    tags: [
      "美容",
      "时尚",
      "造型设计",
    ],
  },

  {
    id: "osaka-medical",

    name: "大阪医疗福祉专门学校",

    englishName:
      "Osaka Medical Welfare College",

    location: "大阪 · 梅田",

    area: "大阪",

    address: "大阪府大阪市北区",

    category: "医疗・福祉",

    tuition: 1280000,

    rating: 4.4,

    employmentRate: 97,

    internationalSupport: true,

    chineseSupport: false,

    visaSupport: true,

    recommended: true,

    website: "https://example.com",

    description:
      "大阪地区的医疗与福祉类专门学校。课程涉及介护、医疗事务以及相关资格考试培训，并提供实习、国家资格考试和就业方面的支持。",

    tags: [
      "介护",
      "医疗事务",
      "资格考试",
    ],
  },

  {
    id: "yokohama-auto",

    name: "横滨汽车技术专门学校",

    englishName:
      "Yokohama Automotive Technology College",

    location: "神奈川 · 横滨",

    area: "神奈川",

    address: "神奈川县横滨市",

    category: "汽车・技术",

    tuition: 1150000,

    rating: 4.5,

    employmentRate: 98,

    internationalSupport: true,

    chineseSupport: true,

    visaSupport: true,

    recommended: true,

    website: "https://example.com",

    description:
      "以汽车整备和汽车技术教育为核心的专门学校。拥有实践型课程和企业合作项目，并以取得汽车整备相关国家资格以及毕业后的就业为主要培养目标。",

    tags: [
      "汽车整备",
      "国家资格",
      "企业合作",
    ],
  },

  {
    id: "saitama-it",

    name: "埼玉IT商务专门学校",

    englishName:
      "Saitama IT & Business College",

    location: "埼玉 · 大宫",

    area: "埼玉",

    address: "埼玉县埼玉市大宫区",

    category: "IT・AI",

    tuition: 950000,

    rating: 4.2,

    employmentRate: 93,

    internationalSupport: true,

    chineseSupport: true,

    visaSupport: true,

    recommended: false,

    website: "https://example.com",

    description:
      "位于埼玉大宫地区的IT与商务类专门学校。课程覆盖IT基础、程序开发和商务技能，整体学费相对东京较低，适合希望控制留学成本并在日本就业的学生。",

    tags: [
      "IT基础",
      "商务",
      "学费较低",
    ],
  },
];

export default async function CollegeDetailPage({
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
      "/schools/college"
    )
      ? returnTo
      : "/schools/college";

  /*
  |--------------------------------------------------------------------------
  | TODO [API - GET]
  |--------------------------------------------------------------------------
  |
  | 正式接后端：
  |
  | const response = await fetch(
  |   `${API_URL}/api/colleges/${id}`
  | );
  |
  | if (response.status === 404) {
  |   notFound();
  | }
  |
  | if (!response.ok) {
  |   throw new Error("Failed to load college");
  | }
  |
  | const school: CollegeDetail =
  |   await response.json();
  |
  | 当前使用 MOCK DATA。
  |
  |--------------------------------------------------------------------------
  */

  const school = colleges.find(
    (item) => item.id === id
  );

  if (!school) {
    notFound();
  }

  return (
    <main className="bg-slate-50 pb-20">
      {/* Header */}

      <CollegeHeader school={school} returnHref={returnHref} />

      <Container>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left */}

          <div className="space-y-8">
            <CollegeInfo
              school={school}
            />

            <CollegeCourse
              school={school}
            />

            <CollegeTuition
              school={school}
            />

            <CollegeEmployment
              school={school}
            />

            <CollegeGallery
              school={school}
            />

            <CollegeReview
              school={school}
            />
          </div>

          {/* Right */}

          <CollegeSidebar
            school={school}
          />
        </div>
      </Container>
    </main>
  );
}