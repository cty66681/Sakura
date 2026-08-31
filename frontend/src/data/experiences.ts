export interface Experience {
  id: number;
  title: string;
  summary: string;
  author: string;
  publishTime: string;
  readTime: string;
  cover?: string;
  tags: string[];
  href: string;
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: "日本 IT 面试全流程分享",
    summary:
      "从投递简历、猎头联系、技术面试到最终拿到 Offer，整理日本 IT 求职过程中值得提前准备的重点。",
    author: "CTY",
    publishTime: "2小时前",
    readTime: "8分钟",
    tags: [
      "IT",
      "求职",
      "面试",
    ],
    href: "/experience/1",
  },

  {
    id: 2,
    title: "第一次在日本租房，我踩过的五个坑",
    summary:
      "礼金、押金、中介费、退房费用到底怎么看？第一次租房前最好先弄清楚这些问题。",
    author: "CTY",
    publishTime: "昨天",
    readTime: "6分钟",
    tags: [
      "租房",
      "生活",
      "避坑",
    ],
    href: "/experience/2",
  },

  {
    id: 3,
    title: "日本生活常见手续怎么准备",
    summary:
      "搬家、住民票、银行、手机等常见生活手续，整理办理顺序和容易忽略的地方。",
    author: "CTY",
    publishTime: "3天前",
    readTime: "10分钟",
    tags: [
      "日本生活",
      "手续",
      "生活指南",
    ],
    href: "/experience/3",
  },

  {
    id: 4,
    title: "刚到日本，第一周应该先做什么",
    summary:
      "从住址登记、手机、银行卡到交通卡，把刚到日本最常见的事情按照优先级整理出来。",
    author: "Sakura",
    publishTime: "4天前",
    readTime: "7分钟",
    tags: [
      "日本生活",
      "新生活",
      "指南",
    ],
    href: "/experience/4",
  },

  {
    id: 5,
    title: "在日本找工作前，我建议先准备这几件事",
    summary:
      "履历书、职务经历书、面试表达和求人筛选，日本求职开始前可以提前准备什么。",
    author: "Sakura",
    publishTime: "5天前",
    readTime: "9分钟",
    tags: [
      "工作",
      "求职",
      "职场",
    ],
    href: "/experience/5",
  },

  {
    id: 6,
    title: "语言学校选东京还是大阪？",
    summary:
      "从生活成本、升学资源、打工机会和城市环境几个方面，整理东京与大阪的主要区别。",
    author: "Sakura",
    publishTime: "1周前",
    readTime: "8分钟",
    tags: [
      "留学",
      "语言学校",
      "东京",
      "大阪",
    ],
    href: "/experience/6",
  },
];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 经验文章列表
|
| GET /api/experiences
|
| Query:
| {
|   page?: number,
|   category?: string,
|   q?: string,
|   sort?: "latest" | "popular"
| }
|
|--------------------------------------------------------------------------
*/