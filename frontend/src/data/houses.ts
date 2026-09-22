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

/*
|--------------------------------------------------------------------------
| 房源业务状态
|--------------------------------------------------------------------------
|
| available  可申请
| paused     暂停受理
| rented     已租出
| expired    信息已过期
| hidden     平台隐藏
|
|--------------------------------------------------------------------------
*/

export type HouseListingStatus =
  | "available"
  | "paused"
  | "rented"
  | "expired"
  | "hidden";

/*
|--------------------------------------------------------------------------
| 内容审核状态
|--------------------------------------------------------------------------
|
| approved   已审核，可正常公开
| pending    待审核
| rejected   审核拒绝
| hidden     因举报 / 风险 / 管理原因隐藏
|
|--------------------------------------------------------------------------
*/

export type HouseModerationStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "hidden";

export interface House {
  id: number;

  /*
   * 房源所属的发布账号。
   *
   * 以后聊天关系使用：
   * 当前用户 ↔ publisherId
   *
   * 同一个发布账号下面的多套房源，
   * 共用同一个长期 conversation。
   *
   * 正式后端必须从数据库读取，
   * 不能相信前端提交的 publisherId。
   */
  publisherId: string;

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

  /*
  |--------------------------------------------------------------------------
  | 房源有效性
  |--------------------------------------------------------------------------
  */

  listingStatus: HouseListingStatus;

  moderationStatus: HouseModerationStatus;

  /*
   * 最后一次确认房源仍然有效的时间。
   *
   * 后续页面可以显示：
   *
   * 今天确认
   * 1天前确认
   * 3天前确认
   * 信息可能需要重新确认
   */
  lastVerifiedAt: string | null;

  /*
   * 房源自动过期时间。
   *
   * 后端定时任务以后可以根据该字段
   * 自动将 listingStatus 改为 expired。
   */
  expiresAt: string | null;

  /*
   * 结构化入住日期。
   *
   * 用于 AI 搜索 / 筛选 / 排序。
   *
   * availableDate 继续用于页面显示。
   */
  availableFrom: string | null;

  availableDate: string;

  /*
  |--------------------------------------------------------------------------
  | 入住资格
  |--------------------------------------------------------------------------
  |
  | true  = 明确可以
  | false = 明确不可以
  | null  = 尚未确认
  |
  |--------------------------------------------------------------------------
  */

  foreignerAllowed: boolean | null;

  studentAllowed: boolean | null;

  publishTime: string;

  views: number;

  images: string[];

  features: HouseFeature[];

  tags: string[];

  description: string;
}

/*
|--------------------------------------------------------------------------
| STATUS LABEL
|--------------------------------------------------------------------------
*/

export const HOUSE_LISTING_STATUS_LABELS: Record<
  HouseListingStatus,
  string
> = {
  available: "可申请",
  paused: "暂停受理",
  rented: "已租出",
  expired: "已过期",
  hidden: "已隐藏",
};

/*
|--------------------------------------------------------------------------
| MOCK DATA
|--------------------------------------------------------------------------
|
| TODO [API - GET]
|
| 正式接后端以后：
|
| GET /api/houses
|
| 当前 houses MOCK DATA 删除，
| 改为数据库中的真实房源。
|
|--------------------------------------------------------------------------
*/

export const houses: House[] = [
  {
    id: 1,

    publisherId: "publisher_ikebukuro_owner",

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

    listingStatus: "available",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-18T15:30:00+09:00",

    expiresAt: "2026-10-01T23:59:59+09:00",

    availableFrom: "2026-09-19",

    availableDate: "即日入住",

    foreignerAllowed: true,

    studentAllowed: true,

    publishTime: "2026-08-01",

    views: 356,

    images: [],

    features: [
      "pet_allowed",
      "foreigner_friendly",
      "student_allowed",
      "no_key_money",
      "near_station",
      "immediate_move_in",
    ],

    tags: [
      "可养宠物",
      "外国人可",
      "留学生可",
      "免礼金",
      "近车站",
    ],

    description:
      "池袋站步行8分钟。周边超市、便利店、药妆店齐全。房间采光良好，带独立卫浴、浴室烘干机。可养宠物，欢迎留学生及上班族入住。",
  },

  {
    id: 2,
    publisherId: "publisher_tokyo_house",

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

    listingStatus: "paused",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-19T10:00:00+09:00",

    expiresAt: "2026-09-25T23:59:59+09:00",

    availableFrom: "2026-09-25",

    availableDate: "9月下旬",

    foreignerAllowed: true,

    studentAllowed: true,

    publishTime: "2026-08-01",

    views: 284,

    images: [],

    features: [
      "foreigner_friendly",
      "student_allowed",
      "furnished",
      "no_key_money",
      "near_station",
    ],

    tags: [
      "外国人可",
      "留学生可",
      "拎包入住",
      "近车站",
      "家具家电",
    ],

    description:
      "新宿核心区域，步行5分钟可达地铁站。家具家电齐全，可拎包入住。附近商业设施完善，生活便利。发布者目前暂时停止接受新的申请。",
  },

  {
    id: 3,
    publisherId: "publisher_takadanobaba_owner",

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

    listingStatus: "available",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-18T18:20:00+09:00",

    expiresAt: "2026-10-05T23:59:59+09:00",

    availableFrom: "2026-09-19",

    availableDate: "即日入住",

    foreignerAllowed: true,

    studentAllowed: true,

    publishTime: "2026-08-03",

    views: 198,

    images: [],

    features: [
      "foreigner_friendly",
      "student_allowed",
      "no_key_money",
      "near_station",
      "immediate_move_in",
    ],

    tags: [
      "外国人可",
      "留学生可",
      "近车站",
      "免礼金",
    ],

    description:
      "高田马场站步行6分钟，交通便利。适合留学生和上班族，周边餐饮、超市和便利店较多。",
  },

  {
    id: 4,
    publisherId: "publisher_takahashi_misaki",

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

    listingStatus: "rented",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-15T14:00:00+09:00",

    expiresAt: null,

    availableFrom: null,

    availableDate: "已租出",

    foreignerAllowed: null,

    studentAllowed: true,

    publishTime: "2026-08-05",

    views: 173,

    images: [],

    features: [
      "pet_allowed",
      "student_allowed",
      "near_station",
      "south_facing",
    ],

    tags: [
      "可养宠物",
      "学生可",
      "近车站",
      "南向",
    ],

    description:
      "中野站步行7分钟。房间面积30㎡，南向采光良好，可咨询宠物入住条件。该房源目前已经租出。",
  },

  {
    id: 5,
    publisherId: "publisher_yamada_taro",

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

    listingStatus: "available",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-19T09:10:00+09:00",

    expiresAt: "2026-10-10T23:59:59+09:00",

    availableFrom: "2026-09-19",

    availableDate: "即日入住",

    foreignerAllowed: true,

    studentAllowed: true,

    publishTime: "2026-08-06",

    views: 241,

    images: [],

    features: [
      "foreigner_friendly",
      "student_allowed",
      "furnished",
      "no_deposit",
      "no_key_money",
      "immediate_move_in",
    ],

    tags: [
      "外国人可",
      "留学生可",
      "拎包入住",
      "家具家电",
      "敷金0",
      "免礼金",
    ],

    description:
      "难波生活圈，家具家电齐全，适合刚到大阪生活的留学生和上班族。",
  },

  {
    id: 6,
    publisherId: "publisher_yokohama_living",

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

    listingStatus: "expired",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-08T17:00:00+09:00",

    expiresAt: "2026-09-15T23:59:59+09:00",

    availableFrom: null,

    availableDate: "需要重新确认",

    foreignerAllowed: true,

    studentAllowed: null,

    publishTime: "2026-08-08",

    views: 165,

    images: [],

    features: [
      "pet_allowed",
      "foreigner_friendly",
      "no_key_money",
    ],

    tags: [
      "外国人可",
      "可养宠物",
      "免礼金",
    ],

    description:
      "关内站附近，适合希望住在横滨市中心的人群。周边交通和商业设施完善。该房源较长时间没有重新确认，目前标记为过期。",

  },

  {
    id: 7,
    publisherId: "publisher_tanaka_kenichi",

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

    listingStatus: "available",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-17T12:40:00+09:00",

    expiresAt: "2026-10-08T23:59:59+09:00",

    availableFrom: "2026-09-19",

    availableDate: "即日入住",

    foreignerAllowed: null,

    studentAllowed: false,

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
      "赤羽站步行4分钟，2LDK户型，南向采光良好。周边超市和商业设施丰富，可咨询宠物入住条件。外国人入住条件需要进一步确认。",
  },

  {
    id: 8,
    publisherId: "publisher_otsuka_owner",

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

    listingStatus: "available",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-18T16:10:00+09:00",

    expiresAt: "2026-10-06T23:59:59+09:00",

    availableFrom: "2026-09-25",

    availableDate: "9月下旬",

    foreignerAllowed: true,

    studentAllowed: true,

    publishTime: "2026-08-11",

    views: 118,

    images: [],

    features: [
      "foreigner_friendly",
      "student_allowed",
      "furnished",
      "no_key_money",
      "near_station",
    ],

    tags: [
      "外国人可",
      "留学生可",
      "家具家电",
      "免礼金",
      "近车站",
    ],

    description:
      "大塚站步行3分钟，家具家电齐全，适合留学生和刚到东京生活的上班族。",

  },

  {
    id: 9,

    publisherId: "publisher_ikebukuro_owner",

    title: "涩谷 1K",

    prefecture: "东京",
    city: "涩谷区",
    station: "涩谷",
    walkMinutes: 7,

    rentValue: 98000,
    managementFeeValue: 6000,

    depositMonths: 1,
    keyMoneyMonths: 1,

    areaValue: 25,

    rent: "¥98,000",
    managementFee: "¥6,000",

    deposit: "1个月",
    keyMoney: "1个月",

    layout: "1K",
    area: "25㎡",

    location: "东京 · 涩谷",

    floor: "6 / 10F",
    builtYear: "2020年",
    direction: "东南",
    structure: "RC钢筋混凝土",

    listingStatus: "available",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-20T14:20:00+09:00",

    expiresAt: "2026-10-03T23:59:59+09:00",

    availableFrom: "2026-09-25",

    availableDate: "9月下旬入住",

    foreignerAllowed: true,

    studentAllowed: true,

    publishTime: "2026-09-05",

    views: 214,

    images: [],

    features: [
      "foreigner_friendly",
      "student_allowed",
      "near_station",
      "furnished",
    ],

    tags: [
      "外国人可",
      "留学生可",
      "近车站",
      "家具家电",
    ],

    description:
      "涩谷站步行7分钟。交通便利，周边便利店、超市、餐饮店齐全。室内配有基础家具家电，适合留学生及上班族入住。",
  },

  {
    id: 10,

    publisherId: "publisher_ikebukuro_owner",

    title: "吉祥寺 1LDK",

    prefecture: "东京",
    city: "武藏野市",
    station: "吉祥寺",
    walkMinutes: 6,

    rentValue: 112000,
    managementFeeValue: 7000,

    depositMonths: 1,
    keyMoneyMonths: 0,

    areaValue: 36,

    rent: "¥112,000",
    managementFee: "¥7,000",

    deposit: "1个月",
    keyMoney: "0个月",

    layout: "1LDK",
    area: "36㎡",

    location: "东京 · 吉祥寺",

    floor: "3 / 8F",
    builtYear: "2018年",
    direction: "南",
    structure: "RC钢筋混凝土",

    listingStatus: "available",

    moderationStatus: "approved",

    lastVerifiedAt: "2026-09-21T11:10:00+09:00",

    expiresAt: "2026-10-04T23:59:59+09:00",

    availableFrom: "2026-09-22",

    availableDate: "即日入住",

    foreignerAllowed: true,

    studentAllowed: true,

    publishTime: "2026-09-08",

    views: 187,

    images: [],

    features: [
      "pet_allowed",
      "foreigner_friendly",
      "student_allowed",
      "no_key_money",
      "near_station",
      "immediate_move_in",
    ],

    tags: [
      "可养宠物",
      "外国人可",
      "留学生可",
      "免礼金",
      "近车站",
    ],

    description:
      "吉祥寺站步行6分钟。周边生活配套完善，附近有超市、商场、公园和餐饮店。房间南向采光良好，可养宠物，适合情侣、留学生及上班族入住。", 
  },
];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
| 房源列表
|--------------------------------------------------------------------------
|
| GET /api/houses
|
| Query:
|
| {
|   q?: string;
|
|   prefecture?: string;
|   city?: string;
|   station?: string;
|
|   rentMin?: number;
|   rentMax?: number;
|
|   areaMin?: number;
|   areaMax?: number;
|
|   walkMax?: number;
|
|   layout?: string;
|
|   features?: HouseFeature[];
|
|   foreignerAllowed?: boolean;
|   studentAllowed?: boolean;
|
|   listingStatus?: HouseListingStatus;
|
|   sort?:
|     | "recommended"
|     | "latest"
|     | "rentAsc"
|     | "rentDesc"
|     | "areaDesc";
|
|   page?: number;
|   limit?: number;
| }
|
| 普通用户列表默认只返回：
|
| moderationStatus = approved
|
| listingStatus:
|
| available
| paused
|
| rented / expired 默认不进入普通搜索结果，
| 但详情页面仍然允许访问。
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
| 房源详情
|--------------------------------------------------------------------------
|
| GET /api/houses/:id
|
| 用途：
|
| - 获取完整房源
| - 即使已经 rented / expired，
|   详情页仍然保留
| - 页面明确显示当前状态
| - 推荐其他仍然 available 的房源
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - PATCH]
| 更新房源状态
|--------------------------------------------------------------------------
|
| PATCH /api/houses/:id/status
|
| Body:
|
| {
|   listingStatus:
|     | "available"
|     | "paused"
|     | "rented"
|     | "expired"
|     | "hidden";
| }
|
| 房东 / 发布者 / 管理员根据权限更新。
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - PATCH]
| 重新确认房源
|--------------------------------------------------------------------------
|
| PATCH /api/houses/:id/verify
|
| 用途：
|
| - 确认房源仍可申请
| - 更新 lastVerifiedAt
| - 必要时重新设置 expiresAt
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - PATCH]
| 房源审核 / 风控
|--------------------------------------------------------------------------
|
| PATCH /api/admin/houses/:id/moderation
|
| Body:
|
| {
|   moderationStatus:
|     | "approved"
|     | "pending"
|     | "rejected"
|     | "hidden";
| }
|
| 用途：
|
| - 垃圾信息
| - 重复房源
| - 虚假信息
| - 举报处理
| - 风险内容隐藏
|
|--------------------------------------------------------------------------
*/