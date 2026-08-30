import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Globe, MapPin, Star } from "lucide-react";
import { notFound } from "next/navigation";

import UniversityInfo from "@/components/schools/university/UniversityInfo";
import UniversityCourse from "@/components/schools/university/UniversityCourse";
import UniversityTuition from "@/components/schools/university/UniversityTuition";
import UniversityGallery from "@/components/schools/university/UniversityGallery";
import UniversityReview from "@/components/schools/university/UniversityReview";
import UniversitySidebar from "@/components/schools/university/UniversitySidebar";

/* =========================================================
   类型
   以后接后台时，可以直接把这里移动到 types/university.ts
========================================================= */

export type UniversityDetail = {
  id: string;

  name: string;
  englishName: string;

  image: string;

  location: string;
  address: string;

  type: "国立大学" | "公立大学" | "私立大学";

  degree: "大学" | "大学院";

  qs: number | null;
  hensachi: number | null;

  tuition: number;

  eju: boolean;

  rating: number;

  website: string;

  description: string;

  tags: string[];
};

/* =========================================================
   MOCK DATA

   以后后台完成后：
   const university = await getUniversity(id)

   把这里删掉即可。
========================================================= */

const universities: UniversityDetail[] = [
  {
    id: "tokyo",

    name: "东京大学",
    englishName: "The University of Tokyo",

    image: "/images/university/university01.jpg",

    location: "东京 · 文京区",
    address: "东京都文京区本乡7-3-1",

    type: "国立大学",

    degree: "大学",

    qs: 28,
    hensachi: 72,

    tuition: 535800,

    eju: true,

    rating: 4.9,

    website: "https://www.u-tokyo.ac.jp/",

    description:
      "东京大学是日本顶尖的国立综合大学之一，在科研、教育以及国际学术领域具有很高影响力。",

    tags: [
      "计算机",
      "AI",
      "医学",
      "奖学金",
      "英语课程",
    ],
  },

  {
    id: "waseda",

    name: "早稻田大学",
    englishName: "Waseda University",

    image: "/images/university/university02.jpg",

    location: "东京 · 新宿区",
    address: "东京都新宿区户塚町1-104",

    type: "私立大学",

    degree: "大学",

    qs: 181,
    hensachi: 70,

    tuition: 1100000,

    eju: true,

    rating: 4.8,

    website: "https://www.waseda.jp/",

    description:
      "早稻田大学是日本具有代表性的私立综合大学之一，国际化程度较高，并拥有大量留学生。",

    tags: [
      "商科",
      "传媒",
      "法学",
      "留学生宿舍",
      "国际交流",
    ],
  },

  {
    id: "kyoto",

    name: "京都大学",
    englishName: "Kyoto University",

    image: "/images/university/university03.jpg",

    location: "京都 · 左京区",
    address: "京都府京都市左京区吉田本町",

    type: "国立大学",

    degree: "大学",

    qs: 46,
    hensachi: 71,

    tuition: 535800,

    eju: true,

    rating: 4.8,

    website: "https://www.kyoto-u.ac.jp/",

    description:
      "京都大学是日本著名的研究型国立大学，在理工、医学和基础科学等领域拥有很强的研究实力。",

    tags: [
      "理工",
      "医学",
      "研究型",
      "奖学金",
    ],
  },

  {
    id: "osaka",

    name: "大阪大学",
    englishName: "The University of Osaka",

    image: "/images/university/university04.jpg",

    location: "大阪 · 吹田市",
    address: "大阪府吹田市山田丘1-1",

    type: "国立大学",

    degree: "大学",

    qs: 80,
    hensachi: 68,

    tuition: 535800,

    eju: true,

    rating: 4.7,

    website: "https://www.osaka-u.ac.jp/",

    description:
      "大阪大学是日本重要的研究型国立大学，在工学、医学、理学和国际研究领域具有较强实力。",

    tags: [
      "工学",
      "医学",
      "国际交流",
      "研究型",
    ],
  },

  {
    id: "yokohama",

    name: "横滨市立大学",
    englishName: "Yokohama City University",

    image: "/images/university/university05.jpg",

    location: "神奈川 · 横滨市",
    address: "神奈川县横滨市金泽区濑户22-2",

    type: "公立大学",

    degree: "大学",

    qs: 450,
    hensachi: 63,

    tuition: 557400,

    eju: true,

    rating: 4.5,

    website: "https://www.yokohama-cu.ac.jp/",

    description:
      "横滨市立大学是一所公立综合大学，在国际商学、数据科学以及医学领域拥有特色教育项目。",

    tags: [
      "国际商学",
      "医学",
      "数据科学",
    ],
  },

  {
    id: "nagoya",

    name: "名古屋大学大学院",
    englishName: "Nagoya University Graduate School",

    image: "/images/university/university06.jpg",

    location: "爱知 · 名古屋市",
    address: "爱知县名古屋市千种区不老町",

    type: "国立大学",

    degree: "大学院",

    qs: 118,
    hensachi: null,

    tuition: 535800,

    eju: false,

    rating: 4.7,

    website: "https://www.nagoya-u.ac.jp/",

    description:
      "名古屋大学大学院拥有多个研究科，在工学、理学、信息学以及基础研究领域拥有较强实力。",

    tags: [
      "大学院",
      "研究型",
      "工学",
      "奖学金",
    ],
  },

  {
    id: "kyushu",

    name: "九州大学大学院",
    englishName: "Kyushu University Graduate School",

    image: "/images/university/university07.jpg",

    location: "福冈 · 福冈市",
    address: "福冈县福冈市西区元冈744",

    type: "国立大学",

    degree: "大学院",

    qs: 167,
    hensachi: null,

    tuition: 535800,

    eju: false,

    rating: 4.6,

    website: "https://www.kyushu-u.ac.jp/",

    description:
      "九州大学大学院拥有完善的研究教育体系，在工学、信息科学、理学以及国际研究项目方面具有优势。",

    tags: [
      "大学院",
      "工学",
      "国际项目",
      "研究型",
    ],
  },
];

/* =========================================================
   Page
========================================================= */

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* =======================================================
     现在：Mock 数据

     以后后台 API：

     const university = await fetch(
       `${process.env.API_URL}/universities/${id}`
     ).then(res => res.json());

  ======================================================= */

  const university = universities.find(
    (item) => item.id === id
  );

  /* =======================================================
     找不到学校
  ======================================================= */

  if (!university) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative h-[460px] overflow-hidden">

        <Image
          src={university.image}
          alt={university.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-slate-950
            via-slate-900/60
            to-transparent
          "
        />

        <div className="absolute bottom-0 left-0 right-0">

          <div className="mx-auto max-w-7xl px-6 pb-12">

            <Link
              href="/schools/university"
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                text-white/80
                transition
                hover:text-white
              "
            >
              <ArrowLeft size={18} />

              返回大学列表
            </Link>

            <div
              className="
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >

              {/* 左 */}

              <div>

                <div className="flex flex-wrap gap-2">

                  <span
                    className="
                      rounded-full
                      bg-blue-600
                      px-4
                      py-1.5
                      text-sm
                      font-bold
                      text-white
                    "
                  >
                    {university.type}
                  </span>

                  <span
                    className="
                      rounded-full
                      bg-white/15
                      px-4
                      py-1.5
                      text-sm
                      font-bold
                      text-white
                      backdrop-blur
                    "
                  >
                    {university.degree}
                  </span>

                  {university.eju && (
                    <span
                      className="
                        rounded-full
                        bg-white/15
                        px-4
                        py-1.5
                        text-sm
                        font-bold
                        text-white
                        backdrop-blur
                      "
                    >
                      EJU
                    </span>
                  )}

                </div>

                <h1
                  className="
                    mt-5
                    text-4xl
                    font-black
                    text-white
                    md:text-6xl
                  "
                >
                  {university.name}
                </h1>

                <p className="mt-3 text-lg text-white/70">
                  {university.englishName}
                </p>

                <div
                  className="
                    mt-6
                    flex
                    flex-wrap
                    gap-x-6
                    gap-y-3
                    text-white/90
                  "
                >

                  <div className="flex items-center gap-2">
                    <MapPin size={18} />

                    {university.location}
                  </div>

                  {university.qs !== null && (
                    <div className="flex items-center gap-2">
                      <Globe size={18} />

                      QS {university.qs}
                    </div>
                  )}

                  {university.hensachi !== null && (
                    <div className="flex items-center gap-2">
                      <Star size={18} />

                      偏差值 {university.hensachi}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Star
                      size={18}
                      className="fill-current"
                    />

                    {university.rating}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===================================================
          内容
      =================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* 左侧 */}

          <div className="space-y-8">

            <UniversityInfo university={university} />

            <UniversityCourse university={university} />

            <UniversityTuition university={university} />

            <UniversityGallery university={university} />

            <UniversityReview university={university} />

          </div>

          {/* 右侧 */}

          <div className="space-y-6">

            <UniversitySidebar university={university} />

          </div>

        </div>

      </section>

    </main>
  );
}