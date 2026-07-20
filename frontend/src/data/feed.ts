import type { FeedItem } from "@/components/home/FeedSection/FeedCard";

export const feeds: FeedItem[] = [
  {
    id: 1,
    type: "job",
    title: "Mercari 招聘 Java Backend Engineer",
    summary: "月薪 ¥70万 ~ ¥90万",
    description: "Mercari 正在招聘 Java Backend Engineer，支持签证。",
    location: "东京 · 涩谷",
    publishTime: "2小时前",
    cover: "",
  },
  {
    id: 2,
    type: "house",
    title: "池袋 1LDK 房源",
    summary: "步行5分钟，免礼金",
    description: "适合情侣、留学生入住。",
    location: "东京 · 池袋",
    publishTime: "4小时前",
    cover: "",
  },
  {
    id: 3,
    type: "scam",
    title: "近期出现冒充警察诈骗",
    summary: "已有多人被骗",
    description: "接到电话请不要转账。",
    publishTime: "今天",
    cover: "",
  },
  {
    id: 4,
    type: "experience",
    title: "日本找工作经验分享",
    summary: "半年拿到 Offer",
    description: "分享求职过程和经验。",
    publishTime: "昨天",
    cover: "",
  },
];