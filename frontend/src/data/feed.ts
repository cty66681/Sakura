import type { FeedItem } from "@/components/home/FeedSection/FeedCard";

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 首页动态数据
|
| GET /api/feed
|
| 后续数据库返回的数据结构建议保持与 FeedItem 一致。
|
|--------------------------------------------------------------------------
*/

export const feeds: FeedItem[] = [
  {
    id: 1,
    type: "job",
    title: "Mercari 招聘 Java Backend Engineer",
    summary:
      "Mercari 正在招聘 Java Backend Engineer，支持远程办公。",
    description:
      "适合有 Java / Spring Boot 后端开发经验的工程师。",
    location: "东京 · 涩谷",
    publishTime: "2小时前",
    cover: "/images/demo/job.jpg",
    likes: 128,
    comments: 36,
    views: 2150,
  },

  {
    id: 2,
    type: "school",
    title: "东京地区语言学校最新招生信息",
    summary:
      "整理东京热门语言学校近期招生、学费和升学支持信息。",
    description:
      "适合准备赴日留学或正在比较语言学校的用户。",
    location: "东京",
    publishTime: "3小时前",
    cover: "/images/university/university01.jpg",
    likes: 96,
    comments: 18,
    views: 1680,
  },

  {
    id: 3,
    type: "scam",
    title: "日本租房时需要注意的几个常见坑",
    summary:
      "签合同前需要确认初期费用、退房费用、违约金等重要内容。",
    description:
      "租房前建议确认合同细节，避免后续产生不必要的费用纠纷。",
    location: "日本全国",
    publishTime: "4小时前",
    cover: "",
    likes: 214,
    comments: 52,
    views: 3620,
  },

  {
    id: 4,
    type: "news",
    title: "日本生活资讯今日更新",
    summary:
      "整理近期与在日生活相关的政策、交通和生活信息。",
    description:
      "快速了解今天值得关注的日本本地信息。",
    location: "日本",
    publishTime: "5小时前",
    cover: "",
    likes: 67,
    comments: 12,
    views: 1260,
  },

  {
    id: 5,
    type: "house",
    title: "东京新宿 1LDK 房源更新",
    summary:
      "距离车站步行约 6 分钟，适合单人或两人居住。",
    description:
      "房源信息仅作为 Sakura 平台测试数据使用。",
    location: "东京 · 新宿",
    publishTime: "6小时前",
    cover: "",
    likes: 74,
    comments: 15,
    views: 1430,
  },

  {
    id: 6,
    type: "school",
    title: "IT・AI 专门学校怎么选",
    summary:
      "从课程方向、就业支持、学费和地区几个方面比较日本 IT 专门学校。",
    description:
      "适合准备学习编程、AI、Web 开发方向的学生。",
    location: "日本全国",
    publishTime: "7小时前",
    cover: "/images/university/university01.jpg",
    likes: 133,
    comments: 27,
    views: 2410,
  },

  {
    id: 7,
    type: "scam",
    title: "求职时遇到这些情况需要提高警惕",
    summary:
      "高额培训费、提前收费、工作内容不明确等情况需要特别注意。",
    description:
      "通过真实场景整理在日求职中容易遇到的问题。",
    location: "日本全国",
    publishTime: "8小时前",
    cover: "",
    likes: 189,
    comments: 43,
    views: 3290,
  },

  {
    id: 8,
    type: "job",
    title: "东京 Frontend Engineer 招聘",
    summary:
      "React / Next.js 前端开发职位，支持部分远程办公。",
    description:
      "需要具备现代前端开发和 TypeScript 使用经验。",
    location: "东京",
    publishTime: "9小时前",
    cover: "",
    likes: 81,
    comments: 21,
    views: 1580,
  },

  {
    id: 9,
    type: "house",
    title: "大阪市中心单身公寓房源",
    summary:
      "交通便利，适合留学生和刚开始在大阪工作的用户。",
    description:
      "房源信息目前为 Sakura mock 测试数据。",
    location: "大阪 · 大阪市",
    publishTime: "10小时前",
    cover: "",
    likes: 59,
    comments: 11,
    views: 1120,
  },

  {
    id: 10,
    type: "news",
    title: "在日生活手续与实用信息整理",
    summary:
      "银行卡、手机、搬家和日常手续相关信息持续更新。",
    description:
      "帮助刚到日本以及正在办理各种手续的用户快速查找资料。",
    location: "日本全国",
    publishTime: "11小时前",
    cover: "",
    likes: 102,
    comments: 24,
    views: 1970,
  },
];