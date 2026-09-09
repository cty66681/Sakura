export type HouseFeature =
  | "pet_allowed"
  | "foreigner_friendly"
  | "student_allowed"
  | "furnished"
  | "no_deposit"
  | "no_key_money"
  | "no_guarantor"
  | "near_station"
  | "south_facing"
  | "immediate_move_in";

export interface House {
  id: number;
  title: string;

  prefecture: string;
  city: string;
  station: string;
  walkMinutes: number | null;

  rentValue: number;
  managementFeeValue: number;
  depositMonths: number;
  keyMoneyMonths: number;

  areaValue: number;

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

  features: HouseFeature[];
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

    prefecture: "东京",
    city: "丰岛区",
    station: "池袋",
    walkMinutes: 8,

    rentValue: 89000,
    managementFeeValue: 5000,
    depositMonths: 1,
    keyMoneyMonths: 0,

    areaValue: 35,

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

    features: [
      "pet_allowed",
      "no_key_money",
      "near_station",
      "immediate_move_in",
    ],

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

    prefecture: "东京",
    city: "新宿区",
    station: "新宿",
    walkMinutes: 5,

    rentValue: 75000,
    managementFeeValue: 5000,
    depositMonths: 1,
    keyMoneyMonths: 0,

    areaValue: 22,

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

    features: [
      "furnished",
      "no_key_money",
      "near_station",
    ],

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

    prefecture: "东京",
    city: "新宿区",
    station: "高田马场",
    walkMinutes: 6,

    rentValue: 82000,
    managementFeeValue: 6000,
    depositMonths: 1,
    keyMoneyMonths: 0,

    areaValue: 25,

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

    features: [
      "student_allowed",
      "no_key_money",
      "near_station",
      "immediate_move_in",
    ],

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

    prefecture: "东京",
    city: "中野区",
    station: "中野",
    walkMinutes: 7,

    rentValue: 92000,
    managementFeeValue: 5000,
    depositMonths: 1,
    keyMoneyMonths: 1,

    areaValue: 30,

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

    features: [
      "pet_allowed",
      "near_station",
      "south_facing",
    ],

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

    prefecture: "大阪",
    city: "大阪市",
    station: "难波",
    walkMinutes: null,

    rentValue: 68000,
    managementFeeValue: 5000,
    depositMonths: 0,
    keyMoneyMonths: 0,

    areaValue: 24,

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

    features: [
      "furnished",
      "no_deposit",
      "no_key_money",
      "immediate_move_in",
    ],

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

    prefecture: "神奈川",
    city: "横滨市",
    station: "关内",
    walkMinutes: null,

    rentValue: 96000,
    managementFeeValue: 7000,
    depositMonths: 1,
    keyMoneyMonths: 0,

    areaValue: 38,

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

    features: [
      "pet_allowed",
      "no_key_money",
    ],

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

  {
    id: 7,
    title: "赤羽 2LDK",

    prefecture: "东京",
    city: "北区",
    station: "赤羽",
    walkMinutes: 4,

    rentValue: 128000,
    managementFeeValue: 8000,
    depositMonths: 0,
    keyMoneyMonths: 0,

    areaValue: 48,

    rent: "¥128,000",
    managementFee: "¥8,000",

    deposit: "0个月",
    keyMoney: "0个月",

    layout: "2LDK",
    area: "48㎡",

    location: "东京 · 赤羽",

    floor: "7 / 13F",
    builtYear: "2020年",
    direction: "南",
    structure: "RC钢筋混凝土",

    availableDate: "即日入住",
    publishTime: "2026-08-10",

    views: 132,

    images: [],

    features: [
      "pet_allowed",
      "no_deposit",
      "no_key_money",
      "near_station",
      "south_facing",
      "immediate_move_in",
    ],

    tags: [
      "可养宠物",
      "敷金0",
      "免礼金",
      "近车站",
      "南向",
    ],

    description:
      "赤羽站步行4分钟，2LDK户型，南向采光良好。周边超市和商业设施丰富，可咨询宠物入住条件。",

    contactName: "田中 健一",
    company: "Tokyo Living",
    phone: "080-1111-2222",
    email: "akabane@example.com",
  },

  {
    id: 8,
    title: "大塚 1K",

    prefecture: "东京",
    city: "丰岛区",
    station: "大塚",
    walkMinutes: 3,

    rentValue: 79000,
    managementFeeValue: 5000,
    depositMonths: 1,
    keyMoneyMonths: 0,

    areaValue: 24,

    rent: "¥79,000",
    managementFee: "¥5,000",

    deposit: "1个月",
    keyMoney: "0个月",

    layout: "1K",
    area: "24㎡",

    location: "东京 · 大塚",

    floor: "6 / 10F",
    builtYear: "2021年",
    direction: "东",
    structure: "RC钢筋混凝土",

    availableDate: "9月下旬",
    publishTime: "2026-08-11",

    views: 118,

    images: [],

    features: [
      "furnished",
      "no_key_money",
      "near_station",
      "student_allowed",
    ],

    tags: [
      "家具家电",
      "免礼金",
      "近车站",
      "留学生可",
    ],

    description:
      "大塚站步行3分钟，家具家电齐全，适合留学生和刚到东京生活的上班族。",

    contactName: "小林 美咲",
    company: "Sakura Home",
    phone: "090-4444-5555",
    email: "otsuka@example.com",
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