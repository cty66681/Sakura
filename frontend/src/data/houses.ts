export interface House {
  id: number;
  title: string;

  rent: string;
  managementFee: string;
  deposit: string;
  keyMoney: string;

  layout: string;
  area: string;
  location: string;

  floor: string;
  builtYear: string;
  direction: string;
  structure: string;

  availableDate: string;
  publishTime: string;

  views: number;

  images: string[];
  tags: string[];

  description: string;

  contactName: string;
  company: string;
  phone: string;
  email: string;
}

export const houses: House[] = [
  {
    id: 1,

    title: "池袋 1LDK",

    rent: "¥89,000",
    managementFee: "¥5,000",

    deposit: "1个月",
    keyMoney: "0个月",

    layout: "1LDK",
    area: "35㎡",

    location: "东京 · 池袋",

    floor: "5 / 12F",
    builtYear: "2019年",
    direction: "南",
    structure: "RC钢筋混凝土",

    availableDate: "即日入住",
    publishTime: "2026-08-01",

    views: 356,

    images: [],

    tags: [
      "可养宠物",
      "免礼金",
      "近车站",
    ],

    description:
      "池袋站步行8分钟。周边超市、便利店、药妆店齐全。房间采光良好，带独立卫浴、浴室烘干机。可养宠物，欢迎留学生及上班族入住。",

    contactName: "山田 太郎",
    company: "Sakura Home",
    phone: "090-1234-5678",
    email: "info@example.com",
  },

  {
    id: 2,

    title: "新宿 Studio",

    rent: "¥75,000",
    managementFee: "¥5,000",

    deposit: "1个月",
    keyMoney: "0个月",

    layout: "1R",
    area: "22㎡",

    location: "东京 · 新宿",

    floor: "8 / 15F",
    builtYear: "2021年",
    direction: "东",
    structure: "RC钢筋混凝土",

    availableDate: "9月上旬",
    publishTime: "2026-08-01",

    views: 284,

    images: [],

    tags: [
      "拎包入住",
      "近车站",
      "家具家电",
    ],

    description:
      "新宿核心区域，步行5分钟可达地铁站。家具家电齐全，可拎包入住。附近商业设施完善，生活便利。",

    contactName: "佐藤 花子",
    company: "Tokyo House",
    phone: "080-8888-9999",
    email: "contact@example.com",
  },

  {
    id: 3,

    title: "高田马场 1K",

    rent: "¥82,000",
    managementFee: "¥6,000",

    deposit: "1个月",
    keyMoney: "0个月",

    layout: "1K",
    area: "25㎡",

    location: "东京 · 高田马场",

    floor: "4 / 10F",
    builtYear: "2020年",
    direction: "南东",
    structure: "RC钢筋混凝土",

    availableDate: "即日入住",
    publishTime: "2026-08-03",

    views: 198,

    images: [],

    tags: [
      "近车站",
      "留学生可",
      "免礼金",
    ],

    description:
      "高田马场站步行6分钟，交通便利。适合学生和上班族，周边餐饮、超市和便利店较多。",

    contactName: "铃木 健",
    company: "Sakura Home",
    phone: "090-2222-3333",
    email: "takadanobaba@example.com",
  },

  {
    id: 4,

    title: "中野 1DK",

    rent: "¥92,000",
    managementFee: "¥5,000",

    deposit: "1个月",
    keyMoney: "1个月",

    layout: "1DK",
    area: "30㎡",

    location: "东京 · 中野",

    floor: "3 / 8F",
    builtYear: "2018年",
    direction: "南",
    structure: "RC钢筋混凝土",

    availableDate: "9月中旬",
    publishTime: "2026-08-05",

    views: 173,

    images: [],

    tags: [
      "可养宠物",
      "近车站",
      "南向",
    ],

    description:
      "中野站步行7分钟。房间面积30㎡，南向采光良好，可咨询宠物入住条件。",

    contactName: "高桥 美咲",
    company: "Tokyo Living",
    phone: "080-3333-4444",
    email: "nakano@example.com",
  },

  {
    id: 5,

    title: "大阪难波 1K",

    rent: "¥68,000",
    managementFee: "¥5,000",

    deposit: "0个月",
    keyMoney: "0个月",

    layout: "1K",
    area: "24㎡",

    location: "大阪 · 难波",

    floor: "7 / 12F",
    builtYear: "2022年",
    direction: "东",
    structure: "RC钢筋混凝土",

    availableDate: "即日入住",
    publishTime: "2026-08-06",

    views: 241,

    images: [],

    tags: [
      "拎包入住",
      "家具家电",
      "免礼金",
    ],

    description:
      "难波生活圈，家具家电齐全，适合刚到大阪生活的学生和上班族。",

    contactName: "松本 翔",
    company: "Osaka Home",
    phone: "080-5555-6666",
    email: "namba@example.com",
  },

  {
    id: 6,

    title: "横滨关内 1LDK",

    rent: "¥96,000",
    managementFee: "¥7,000",

    deposit: "1个月",
    keyMoney: "0个月",

    layout: "1LDK",
    area: "38㎡",

    location: "神奈川 · 横滨",

    floor: "6 / 11F",
    builtYear: "2020年",
    direction: "南西",
    structure: "RC钢筋混凝土",

    availableDate: "10月上旬",
    publishTime: "2026-08-08",

    views: 165,

    images: [],

    tags: [
      "可养宠物",
      "近车站",
      "免礼金",
    ],

    description:
      "关内站附近，适合希望住在横滨市中心的人群。周边交通和商业设施完善。",

    contactName: "伊藤 直树",
    company: "Yokohama Living",
    phone: "090-7777-8888",
    email: "yokohama@example.com",
  },
];

/*
TODO [API - GET]

房源列表
GET /api/houses

Query:
{
  q?: string;
  region?: string;
  layout?: string;
  features?: string[];
  sort?: "latest" | "rentAsc" | "rentDesc" | "areaDesc";
  page?: number;
  limit?: number;
}

用途：
- 房源搜索
- 地区筛选
- 户型筛选
- 房源特点筛选
- 排序
- 分页

--------------------------------------------------

TODO [API - GET]

房源详情
GET /api/houses/:id

用途：
根据房源 ID 获取完整房源信息。
*/