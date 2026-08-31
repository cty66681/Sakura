export type HomeSchoolType =
  | "大学"
  | "大学院"
  | "专门学校"
  | "语言学校";

export interface HomeSchool {
  id: number;
  name: string;
  type: HomeSchoolType;
  location: string;
  deadline: string;
  tags: string[];
  href: string;
}

export const schools: HomeSchool[] = [
  {
    id: 1,
    name: "HAL东京",
    type: "专门学校",
    location: "东京 · 新宿",
    deadline: "2026-09-15",
    tags: [
      "IT",
      "CG",
      "AI",
    ],
    href: "/schools/college",
  },

  {
    id: 2,
    name: "东京工科大学",
    type: "大学",
    location: "东京",
    deadline: "2026-10-01",
    tags: [
      "计算机",
      "AI",
    ],
    href: "/schools/university",
  },

  {
    id: 3,
    name: "ECC国际外语专门学校",
    type: "专门学校",
    location: "大阪",
    deadline: "2026-09-30",
    tags: [
      "日本语",
      "商务",
    ],
    href: "/schools/college",
  },

  {
    id: 4,
    name: "东京大学大学院",
    type: "大学院",
    location: "东京 · 文京区",
    deadline: "2026-10-20",
    tags: [
      "理工",
      "研究",
      "AI",
    ],
    href: "/schools/university?degree=大学院",
  },

  {
    id: 5,
    name: "东京国际日本语学院",
    type: "语言学校",
    location: "东京 · 新宿",
    deadline: "2026-11-15",
    tags: [
      "升学",
      "EJU",
      "中文支持",
    ],
    href: "/schools/language",
  },

  {
    id: 6,
    name: "大阪国际日本语学校",
    type: "语言学校",
    location: "大阪 · 大阪市",
    deadline: "2026-11-30",
    tags: [
      "升学",
      "生活支持",
      "日本语",
    ],
    href: "/schools/language?region=大阪",
  },

  {
    id: 7,
    name: "早稻田大学",
    type: "大学",
    location: "东京 · 新宿区",
    deadline: "2026-10-15",
    tags: [
      "私立",
      "商学",
      "国际",
    ],
    href: "/schools/university",
  },

  {
    id: 8,
    name: "大阪计算机专门学校",
    type: "专门学校",
    location: "大阪 · 大阪市",
    deadline: "2026-10-30",
    tags: [
      "IT",
      "Web",
      "AI",
    ],
    href: "/schools/college?region=大阪&category=IT・AI",
  },
];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页推荐学校最终不再使用这个静态数组。
|
| GET /api/schools/home
|
| Response:
| {
|   schools: [...]
| }
|
|--------------------------------------------------------------------------
*/