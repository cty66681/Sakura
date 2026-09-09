export type JobCategory =
  | "it"
  | "construction"
  | "logistics"
  | "ecommerce-office"
  | "service"
  | "manufacturing"
  | "beauty-massage"
  | "care-professional"
  | "other"
  | "real-estate";

export type EmploymentType =
  | "正社員"
  | "契約社員"
  | "派遣"
  | "業務委託"
  | "兼职"
  | "实习";

export type WorkStyle =
  | "远程"
  | "混合"
  | "现场";

export type SalaryType =
  | "hourly"
  | "daily"
  | "monthly"
  | "annual"
  | "project";

export type JapaneseLevel =
  | "none"
  | "n3"
  | "n2"
  | "n1"
  | "native";

export type CompanyType =
  | "company"
  | "sole_proprietor"
  | "shop"
  | "individual";

export type ModerationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "review_required";

export interface Job {
  id: number;

  /* ===================================================== */
  /* 分类 */
  /* ===================================================== */

  category: JobCategory;

  /**
   * 具体职业。
   *
   * Example:
   * 后端开发 / 施工管理 / 配送 / 网店运营 / 餐饮 / 美容师
   */
  occupation: string;

  /* ===================================================== */
  /* 招聘主体 */
  /* ===================================================== */

  company: string;

  companyLogo?: string;

  companyType: CompanyType;

  verified?: boolean;

  /* ===================================================== */
  /* 基本职位 */
  /* ===================================================== */

  title: string;

  location: string;

  employmentType: EmploymentType;

  remote: WorkStyle;

  /* ===================================================== */
  /* 薪资 */
  /* ===================================================== */

  /**
   * 暂时保留字符串，
   * 兼容当前 JobCard / JobDetail。
   */
  salary: string;

  salaryType: SalaryType;

  /**
   * 后端正式接入以后主要依赖这两个字段筛选。
   */
  salaryMin?: number;

  salaryMax?: number;

  /* ===================================================== */
  /* 外国人 / 语言 */
  /* ===================================================== */

  japaneseLevel: JapaneseLevel;

  /**
   * 保留当前详情页使用的文字显示字段。
   */
  language: string;

  foreignerFriendly: boolean;

  visaSupport: boolean;

  beginnerFriendly: boolean;

  chineseAvailable: boolean;

  /* ===================================================== */
  /* 工作要求 */
  /* ===================================================== */

  experience: string;

  education: string;

  workingHours: string;

  holiday: string;

  benefits: string[];

  /**
   * 用于住宿、日払い、交通费、包餐等
   * 工作特色。
   */
  workConditions: string[];

  description: string;

  /* ===================================================== */
  /* 联系方式 */
  /* ===================================================== */

  contactName: string;

  phone: string;

  email: string;

  /* ===================================================== */
  /* 平台数据 */
  /* ===================================================== */

  publishTime: string;

  views: number;

  favorite?: boolean;

  tags: string[];

  /* ===================================================== */
  /* 审核 / 风险
     当前 Mock 使用，未来主要由后台控制
  ===================================================== */

  moderationStatus: ModerationStatus;

  /**
   * 0 - 100
   *
   * 越高代表需要越严格审核。
   * 不直接展示给普通用户。
   */
  riskScore: number;

  /**
   * 后端重复招聘检测使用。
   */
  duplicateGroupId?: string;
}

/* =========================================================
   MOCK JOBS
========================================================= */

export const jobs: Job[] = [
  /* ===================================================== */
  /* IT・技术 */
  /* ===================================================== */

  {
    id: 1,

    category: "it",
    occupation: "后端开发",

    company: "Mercari",
    companyType: "company",

    title: "Java Backend Engineer",

    location: "东京 · 涩谷",

    salary: "¥700,000 ~ ¥900,000 / 月",
    salaryType: "monthly",
    salaryMin: 700000,
    salaryMax: 900000,

    verified: true,

    publishTime: "2026-08-05",
    views: 568,

    employmentType: "正社員",

    remote: "混合",

    experience: "2年以上",
    education: "本科",

    japaneseLevel: "n2",
    language: "N2以上",

    foreignerFriendly: true,
    visaSupport: true,
    beginnerFriendly: false,
    chineseAvailable: false,

    workingHours: "09:00 ~ 18:00",
    holiday: "周末双休",

    benefits: [
      "交通费",
      "奖金",
      "年假",
      "社会保险",
    ],

    workConditions: [
      "交通费",
      "混合办公",
      "社会保险",
    ],

    description:
      "负责 Java 后端系统开发，参与 Spring Boot 微服务架构设计，负责 AWS 云平台部署及维护，并与前端团队协作完成业务开发。",

    contactName: "张先生",

    phone: "090-8888-9999",

    email: "hr@example.com",

    tags: [
      "IT",
      "Java",
      "Spring Boot",
      "AWS",
      "正社員",
      "签证支援",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },

  {
    id: 2,

    category: "it",
    occupation: "前端开发",

    company: "PayPay",
    companyType: "company",

    title: "Frontend Engineer",

    location: "东京 · 港区",

    salary: "¥650,000 ~ ¥850,000 / 月",
    salaryType: "monthly",
    salaryMin: 650000,
    salaryMax: 850000,

    verified: true,

    publishTime: "2026-08-04",
    views: 421,

    employmentType: "正社員",

    remote: "混合",

    experience: "1年以上",
    education: "本科",

    japaneseLevel: "n2",
    language: "N2以上",

    foreignerFriendly: true,
    visaSupport: true,
    beginnerFriendly: false,
    chineseAvailable: false,

    workingHours: "10:00 ~ 19:00",
    holiday: "双休",

    benefits: [
      "交通费",
      "奖金",
      "社会保险",
      "年度体检",
    ],

    workConditions: [
      "交通费",
      "混合办公",
      "社会保险",
    ],

    description:
      "负责 React / Next.js 项目开发，参与产品设计与组件开发，优化网站性能与用户体验，并与后端共同完成接口联调。",

    contactName: "李小姐",

    phone: "080-9999-6666",

    email: "career@example.com",

    tags: [
      "IT",
      "React",
      "TypeScript",
      "Next.js",
      "正社員",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },

  {
    id: 3,

    category: "it",
    occupation: "AI・数据",

    company: "Sakura Systems",
    companyType: "company",

    title: "Python / AI Engineer",

    location: "东京 · 新宿",

    salary: "¥700,000 ~ ¥950,000 / 月",
    salaryType: "monthly",
    salaryMin: 700000,
    salaryMax: 950000,

    verified: true,

    publishTime: "2026-08-08",
    views: 386,

    employmentType: "正社員",

    remote: "混合",

    experience: "3年以上",
    education: "本科",

    japaneseLevel: "n2",
    language: "N2以上",

    foreignerFriendly: true,
    visaSupport: true,
    beginnerFriendly: false,
    chineseAvailable: true,

    workingHours: "09:30 ~ 18:30",
    holiday: "周末双休",

    benefits: [
      "交通费",
      "远程办公",
      "社会保险",
      "技术培训",
    ],

    workConditions: [
      "中文可",
      "混合办公",
      "技术培训",
    ],

    description:
      "负责 Python 后端及 AI 相关功能开发，包括数据处理、API 开发、AI 服务接入以及内部业务自动化。",

    contactName: "田中",

    phone: "090-1111-2222",

    email: "python@example.com",

    tags: [
      "IT",
      "Python",
      "AI",
      "FastAPI",
      "AWS",
      "中文可",
    ],

    moderationStatus: "approved",
    riskScore: 4,
  },

  {
    id: 4,

    category: "it",
    occupation: "前端开发",

    company: "Tokyo Web Lab",
    companyType: "company",

    title: "React Frontend Developer",

    location: "东京 · 池袋",

    salary: "¥550,000 ~ ¥700,000 / 月",
    salaryType: "monthly",
    salaryMin: 550000,
    salaryMax: 700000,

    verified: true,

    publishTime: "2026-08-07",
    views: 294,

    employmentType: "正社員",

    remote: "现场",

    experience: "2年以上",
    education: "专门学校以上",

    japaneseLevel: "n2",
    language: "N2以上",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: false,
    chineseAvailable: false,

    workingHours: "10:00 ~ 19:00",
    holiday: "周末双休",

    benefits: [
      "交通费",
      "社会保险",
      "年假",
    ],

    workConditions: [
      "交通费",
      "社会保险",
    ],

    description:
      "负责企业 Web 系统前端开发，使用 React、TypeScript 进行页面及组件开发，并参与 UI 改进。",

    contactName: "佐藤",

    phone: "080-2222-3333",

    email: "frontend@example.com",

    tags: [
      "IT",
      "React",
      "TypeScript",
      "Frontend",
      "正社員",
    ],

    moderationStatus: "approved",
    riskScore: 3,
  },

  {
    id: 5,

    category: "it",
    occupation: "后端开发",

    company: "Osaka Tech",
    companyType: "company",

    title: "Backend Engineer",

    location: "大阪 · 梅田",

    salary: "¥500,000 ~ ¥650,000 / 月",
    salaryType: "monthly",
    salaryMin: 500000,
    salaryMax: 650000,

    verified: false,

    publishTime: "2026-08-06",
    views: 245,

    employmentType: "正社員",

    remote: "混合",

    experience: "1年以上",
    education: "不限",

    japaneseLevel: "n2",
    language: "N2以上",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: false,
    chineseAvailable: false,

    workingHours: "09:00 ~ 18:00",
    holiday: "周末双休",

    benefits: [
      "交通费",
      "社会保险",
      "远程办公",
    ],

    workConditions: [
      "交通费",
      "混合办公",
    ],

    description:
      "负责后端 API 和业务系统开发，根据项目情况使用 Java 或 Python，并参与数据库设计及系统维护。",

    contactName: "山本",

    phone: "090-3333-4444",

    email: "backend@example.com",

    tags: [
      "IT",
      "Java",
      "Python",
      "Backend",
      "正社員",
    ],

    moderationStatus: "approved",
    riskScore: 8,
  },

  /* ===================================================== */
  /* 电商・贸易・办公室 */
  /* ===================================================== */

  {
    id: 6,

    category: "ecommerce-office",
    occupation: "客服",

    company: "Global Support Japan",
    companyType: "company",

    title: "中文客服 / 运营支持",

    location: "东京 · 上野",

    salary: "¥280,000 ~ ¥350,000 / 月",
    salaryType: "monthly",
    salaryMin: 280000,
    salaryMax: 350000,

    verified: true,

    publishTime: "2026-08-03",
    views: 612,

    employmentType: "正社員",

    remote: "现场",

    experience: "经验不限",
    education: "不限",

    japaneseLevel: "n2",
    language: "N2以上 / 中文",

    foreignerFriendly: true,
    visaSupport: true,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "09:00 ~ 18:00",
    holiday: "轮休",

    benefits: [
      "交通费",
      "社会保险",
      "带薪休假",
    ],

    workConditions: [
      "中文可",
      "未经验可",
      "交通费",
    ],

    description:
      "负责中文客户咨询、电话及在线客服对应，同时协助日本团队处理订单和日常运营工作。",

    contactName: "小林",

    phone: "080-5555-6666",

    email: "support@example.com",

    tags: [
      "中文",
      "客服",
      "运营",
      "正社員",
      "未经验可",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },

  {
    id: 7,

    category: "ecommerce-office",
    occupation: "网店运营",

    company: "Tokyo EC Trading",
    companyType: "company",

    title: "楽天 / Amazon 中文电商运营",

    location: "东京 · 秋叶原",

    salary: "¥300,000 ~ ¥420,000 / 月",
    salaryType: "monthly",
    salaryMin: 300000,
    salaryMax: 420000,

    verified: true,

    publishTime: "2026-08-12",
    views: 328,

    employmentType: "正社員",

    remote: "现场",

    experience: "1年以上优先",
    education: "不限",

    japaneseLevel: "n2",
    language: "N2程度 / 中文",

    foreignerFriendly: true,
    visaSupport: true,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "09:30 ~ 18:30",
    holiday: "周末双休",

    benefits: [
      "交通费",
      "社会保险",
      "员工折扣",
    ],

    workConditions: [
      "中文可",
      "未经验可",
      "交通费",
    ],

    description:
      "负责楽天、Amazon等日本电商平台的商品登记、订单管理、客服对应、促销活动以及基础数据分析。",

    contactName: "王女士",

    phone: "080-1111-7788",

    email: "ec@example.com",

    tags: [
      "电商",
      "楽天",
      "Amazon",
      "中文可",
      "运营",
    ],

    moderationStatus: "approved",
    riskScore: 6,
  },

  /* ===================================================== */
  /* 建筑・现场 */
  /* ===================================================== */

  {
    id: 8,

    category: "construction",
    occupation: "内装",

    company: "东京建设株式会社",
    companyType: "company",

    title: "室内装修施工人员",

    location: "东京 · 足立区",

    salary: "¥15,000 ~ ¥22,000 / 日",
    salaryType: "daily",
    salaryMin: 15000,
    salaryMax: 22000,

    verified: true,

    publishTime: "2026-08-15",
    views: 483,

    employmentType: "正社員",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "n3",
    language: "简单日语即可 / N3程度",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "08:00 ~ 17:00",
    holiday: "周日 / 排班",

    benefits: [
      "交通费",
      "社会保险",
      "工具提供",
    ],

    workConditions: [
      "未经验可",
      "中文可",
      "工具提供",
      "交通费",
    ],

    description:
      "主要负责东京及周边住宅和商业设施的内装施工辅助工作。未经验者可从基础作业开始学习。",

    contactName: "陈先生",

    phone: "090-5555-1122",

    email: "construction@example.com",

    tags: [
      "建筑",
      "内装",
      "未经验可",
      "中文可",
    ],

    moderationStatus: "approved",
    riskScore: 10,
  },

  {
    id: 9,

    category: "construction",
    occupation: "施工管理",

    company: "Kanto Build",
    companyType: "company",

    title: "建筑施工管理",

    location: "神奈川 · 横滨",

    salary: "¥380,000 ~ ¥520,000 / 月",
    salaryType: "monthly",
    salaryMin: 380000,
    salaryMax: 520000,

    verified: true,

    publishTime: "2026-08-16",
    views: 216,

    employmentType: "正社員",

    remote: "现场",

    experience: "施工管理经验2年以上",
    education: "不限",

    japaneseLevel: "n2",
    language: "N2程度",

    foreignerFriendly: true,
    visaSupport: true,
    beginnerFriendly: false,
    chineseAvailable: false,

    workingHours: "08:00 ~ 17:00",
    holiday: "周末 / 公司日历",

    benefits: [
      "交通费",
      "资格补贴",
      "社会保险",
    ],

    workConditions: [
      "资格补贴",
      "交通费",
    ],

    description:
      "负责施工现场进度、安全、质量管理以及协力会社协调。持施工管理相关资格者优先。",

    contactName: "高桥",

    phone: "080-3333-5511",

    email: "build@example.com",

    tags: [
      "建筑",
      "施工管理",
      "正社員",
      "签证支援",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },

  /* ===================================================== */
  /* 物流・运输 */
  /* ===================================================== */

  {
    id: 10,

    category: "logistics",
    occupation: "配送",

    company: "Tokyo Delivery Service",
    companyType: "company",

    title: "轻货配送司机",

    location: "东京 · 江户川区",

    salary: "¥16,000 ~ ¥24,000 / 日",
    salaryType: "daily",
    salaryMin: 16000,
    salaryMax: 24000,

    verified: true,

    publishTime: "2026-08-18",
    views: 731,

    employmentType: "業務委託",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "n3",
    language: "日常会话程度",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "08:00 ~ 配送结束",
    holiday: "可协商",

    benefits: [
      "车辆租赁可",
      "培训",
    ],

    workConditions: [
      "未经验可",
      "中文可",
      "车辆租赁可",
    ],

    description:
      "负责东京23区内轻型货物配送。需要持有日本普通汽车驾照，未经验者提供基础培训。",

    contactName: "刘先生",

    phone: "090-2222-7788",

    email: "delivery@example.com",

    tags: [
      "物流",
      "配送",
      "司机",
      "未经验可",
      "中文可",
    ],

    moderationStatus: "approved",
    riskScore: 12,
  },

  {
    id: 11,

    category: "logistics",
    occupation: "仓库",

    company: "Chiba Logistics Center",
    companyType: "company",

    title: "仓库分拣 / 商品打包",

    location: "千叶 · 船桥",

    salary: "¥1,350 ~ ¥1,600 / 小时",
    salaryType: "hourly",
    salaryMin: 1350,
    salaryMax: 1600,

    verified: true,

    publishTime: "2026-08-20",
    views: 544,

    employmentType: "兼职",

    remote: "现场",

    experience: "经验不限",
    education: "不限",

    japaneseLevel: "n3",
    language: "简单日语即可",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: false,

    workingHours: "09:00 ~ 18:00 / 可协商",
    holiday: "排班制",

    benefits: [
      "交通费",
      "制服提供",
    ],

    workConditions: [
      "未经验可",
      "交通费",
      "周3日起",
    ],

    description:
      "负责物流中心商品分拣、检品和包装。工作流程简单，未经验者可参加入职培训。",

    contactName: "伊藤",

    phone: "080-4477-1199",

    email: "warehouse@example.com",

    tags: [
      "物流",
      "仓库",
      "兼职",
      "未经验可",
    ],

    moderationStatus: "approved",
    riskScore: 7,
  },

  /* ===================================================== */
  /* 餐饮・零售・服务 */
  /* ===================================================== */

  {
    id: 12,

    category: "service",
    occupation: "餐饮",

    company: "上野中华料理",
    companyType: "shop",

    title: "中华料理店服务员",

    location: "东京 · 上野",

    salary: "¥1,300 ~ ¥1,550 / 小时",
    salaryType: "hourly",
    salaryMin: 1300,
    salaryMax: 1550,

    verified: false,

    publishTime: "2026-08-21",
    views: 812,

    employmentType: "兼职",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "n3",
    language: "简单日语 / 中文可",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "11:00 ~ 23:00 内排班",
    holiday: "排班制",

    benefits: [
      "交通费",
      "员工餐",
    ],

    workConditions: [
      "中文可",
      "未经验可",
      "包餐",
      "周2日起",
    ],

    description:
      "负责店内接客、点单、上菜及简单清洁工作。可根据学校和其他工作时间协商排班。",

    contactName: "赵女士",

    phone: "080-5566-9900",

    email: "restaurant@example.com",

    tags: [
      "餐饮",
      "兼职",
      "中文可",
      "包餐",
    ],

    moderationStatus: "approved",
    riskScore: 9,
  },

  /* ===================================================== */
  /* 工厂・制造 */
  /* ===================================================== */

  {
    id: 13,

    category: "manufacturing",
    occupation: "食品制造",

    company: "Saitama Food Factory",
    companyType: "company",

    title: "食品工厂包装 / 检品",

    location: "埼玉 · 川口",

    salary: "¥1,300 ~ ¥1,500 / 小时",
    salaryType: "hourly",
    salaryMin: 1300,
    salaryMax: 1500,

    verified: true,

    publishTime: "2026-08-22",
    views: 466,

    employmentType: "兼职",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "none",
    language: "日语要求较低",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "08:00 ~ 17:00",
    holiday: "排班制",

    benefits: [
      "交通费",
      "制服提供",
    ],

    workConditions: [
      "日语要求低",
      "未经验可",
      "中文可",
    ],

    description:
      "负责食品生产线包装、检品和简单整理工作。工作内容有标准流程，未经验者可培训。",

    contactName: "林先生",

    phone: "090-6611-2288",

    email: "factory@example.com",

    tags: [
      "工厂",
      "食品",
      "未经验可",
      "中文可",
    ],

    moderationStatus: "approved",
    riskScore: 8,
  },

  /* ===================================================== */
  /* 美容・按摩 */
  /* ===================================================== */

  {
    id: 14,

    category: "beauty-massage",
    occupation: "正规按摩",

    company: "Sakura Relaxation",
    companyType: "shop",

    title: "正规リラクゼーション店按摩师",

    location: "东京 · 池袋",

    salary: "¥1,500 ~ ¥2,000 / 小时",
    salaryType: "hourly",
    salaryMin: 1500,
    salaryMax: 2000,

    verified: true,

    publishTime: "2026-08-23",
    views: 529,

    employmentType: "兼职",

    remote: "现场",

    experience: "经验者优先 / 未经验可培训",
    education: "不限",

    japaneseLevel: "n3",
    language: "简单日语即可 / 中文可",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "10:00 ~ 22:00 内排班",
    holiday: "排班制",

    benefits: [
      "交通费",
      "技术培训",
      "制服提供",
    ],

    workConditions: [
      "正规按摩",
      "中文可",
      "未经验可",
      "技术培训",
    ],

    description:
      "正规リラクゼーション店招聘工作人员，主要提供一般身体放松服务及店内接客。禁止任何成人服务或违法业务。",

    contactName: "店铺招聘担当",

    phone: "080-7788-5511",

    email: "relax@example.com",

    tags: [
      "美容按摩",
      "リラクゼーション",
      "正规店铺",
      "中文可",
    ],

    moderationStatus: "approved",

    /*
     * 美容 / 按摩属于加强审核类别，
     * 即使内容正常，基础 riskScore 也高于普通职位。
     */
    riskScore: 25,
  },

  /* ===================================================== */
  /* 介护・专业 */
  /* ===================================================== */

  {
    id: 15,

    category: "care-professional",
    occupation: "介护",

    company: "Tokyo Care Support",
    companyType: "company",

    title: "介护工作人员",

    location: "东京 · 板桥区",

    salary: "¥260,000 ~ ¥330,000 / 月",
    salaryType: "monthly",
    salaryMin: 260000,
    salaryMax: 330000,

    verified: true,

    publishTime: "2026-08-24",
    views: 307,

    employmentType: "正社員",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "n3",
    language: "N3程度以上",

    foreignerFriendly: true,
    visaSupport: true,
    beginnerFriendly: true,
    chineseAvailable: false,

    workingHours: "排班制",
    holiday: "月8~9日",

    benefits: [
      "交通费",
      "社会保险",
      "资格取得支援",
    ],

    workConditions: [
      "未经验可",
      "签证支援",
      "资格取得支援",
    ],

    description:
      "负责介护设施内日常生活支援。未经验者可接受培训，并提供介护相关资格取得支援。",

    contactName: "採用担当",

    phone: "080-8899-2200",

    email: "care@example.com",

    tags: [
      "介护",
      "正社員",
      "未经验可",
      "签证支援",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },
  /* ===================================================== */
  /* 物流・运输 - 搜索测试数据 */
  /* ===================================================== */

  {
    id: 16,

    category: "logistics",
    occupation: "配送",

    company: "Tokyo Food Delivery",
    companyType: "company",

    title: "外卖配送员",

    location: "东京 · 新宿区",

    salary: "¥1,300 ~ ¥1,800 / 时",
    salaryType: "hourly",
    salaryMin: 1300,
    salaryMax: 1800,

    verified: true,

    publishTime: "2026-09-01",
    views: 286,

    employmentType: "兼职",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "none",
    language: "不会日语也可",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "自由排班",
    holiday: "自由安排",

    benefits: [
      "时间自由",
      "未经验可",
    ],

    workConditions: [
      "外卖配送",
      "送餐",
      "中文可",
      "未经验可",
    ],

    description:
      "负责东京23区餐饮外卖配送，可使用自行车或电动自行车接单。未经验可，中文对应可。",

    contactName: "採用担当",

    phone: "080-2200-1600",

    email: "food-delivery@example.com",

    tags: [
      "外卖",
      "送餐",
      "フードデリバリー",
      "配送",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },

  {
    id: 17,

    category: "logistics",
    occupation: "配送",

    company: "Ikebukuro Delivery Service",
    companyType: "company",

    title: "池袋送餐配送员",

    location: "东京 · 池袋",

    salary: "¥1,250 ~ ¥1,700 / 时",
    salaryType: "hourly",
    salaryMin: 1250,
    salaryMax: 1700,

    verified: true,

    publishTime: "2026-09-02",
    views: 194,

    employmentType: "兼职",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "n3",
    language: "简单日语即可 / 中文可",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "10:00 ~ 23:00 内自由排班",
    holiday: "自由安排",

    benefits: [
      "交通费",
      "排班自由",
    ],

    workConditions: [
      "送餐",
      "外卖",
      "池袋",
      "中文可",
    ],

    description:
      "主要负责池袋及周边地区的餐饮送餐工作。留学生及未经验者可应聘。",

    contactName: "採用担当",

    phone: "080-2200-1700",

    email: "ikebukuro-delivery@example.com",

    tags: [
      "外卖",
      "送餐",
      "池袋",
      "配送",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },

  {
    id: 18,

    category: "logistics",
    occupation: "配送",

    company: "Tokyo Logistics Service",
    companyType: "company",

    title: "普通货物配送司机",

    location: "东京 · 江东区",

    salary: "¥300,000 ~ ¥420,000 / 月",
    salaryType: "monthly",
    salaryMin: 300000,
    salaryMax: 420000,

    verified: true,

    publishTime: "2026-09-03",
    views: 351,

    employmentType: "正社員",

    remote: "现场",

    experience: "配送经验优先",
    education: "不限",

    japaneseLevel: "n3",
    language: "N3程度以上",

    foreignerFriendly: true,
    visaSupport: true,
    beginnerFriendly: false,
    chineseAvailable: false,

    workingHours: "8:00 ~ 17:00",
    holiday: "周休2日",

    benefits: [
      "交通费",
      "社会保险",
      "加班费",
    ],

    workConditions: [
      "普通配送",
      "货物配送",
      "驾驶工作",
    ],

    description:
      "负责东京23区企业及店铺的普通货物配送工作，需要普通汽车驾驶证。",

    contactName: "採用担当",

    phone: "080-2200-1800",

    email: "logistics@example.com",

    tags: [
      "配送",
      "配達",
      "司机",
      "物流",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },

  {
    id: 19,

    category: "logistics",
    occupation: "配送",

    company: "Kanto Light Cargo",
    companyType: "company",

    title: "轻货配送司机",

    location: "东京 · 足立区",

    salary: "¥350,000 ~ ¥550,000 / 月",
    salaryType: "monthly",
    salaryMin: 350000,
    salaryMax: 550000,

    verified: true,

    publishTime: "2026-09-04",
    views: 427,

    employmentType: "業務委託",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "n3",
    language: "简单日语即可",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "案件安排",
    holiday: "自由安排",

    benefits: [
      "车辆租赁可",
      "未经验培训",
    ],

    workConditions: [
      "轻货",
      "軽貨物",
      "配送",
      "未经验可",
    ],

    description:
      "负责轻型货车宅配及企业配送工作。未经验者可接受同行培训，可商谈车辆租赁。",

    contactName: "採用担当",

    phone: "080-2200-1900",

    email: "light-cargo@example.com",

    tags: [
      "轻货",
      "軽貨物",
      "配送",
      "宅配",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },

  {
    id: 20,

    category: "logistics",
    occupation: "仓库",

    company: "Chiba Logistics Center",
    companyType: "company",

    title: "物流仓库分拣工作人员",

    location: "千叶 · 船桥市",

    salary: "¥1,250 ~ ¥1,500 / 时",
    salaryType: "hourly",
    salaryMin: 1250,
    salaryMax: 1500,

    verified: true,

    publishTime: "2026-09-05",
    views: 219,

    employmentType: "兼职",

    remote: "现场",

    experience: "未经验可",
    education: "不限",

    japaneseLevel: "none",
    language: "不会日语也可 / 中文可",

    foreignerFriendly: true,
    visaSupport: false,
    beginnerFriendly: true,
    chineseAvailable: true,

    workingHours: "9:00 ~ 18:00 / 夜班可选",
    holiday: "排班制",

    benefits: [
      "交通费",
      "加班费",
    ],

    workConditions: [
      "仓库",
      "分拣",
      "未经验可",
      "中文可",
    ],

    description:
      "负责物流仓库内商品分拣、包装及出货准备工作。不会日语及未经验者也可应聘。",

    contactName: "採用担当",

    phone: "080-2200-2000",

    email: "warehouse@example.com",

    tags: [
      "仓库",
      "分拣",
      "物流",
      "中文可",
    ],

    moderationStatus: "approved",
    riskScore: 5,
  },
  
];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| 工作列表
|
| GET /api/jobs
|
| Query:
| {
|   page?: number,
|   q?: string,
|
|   category?: JobCategory,
|   occupation?: string,
|
|   region?: string,
|   employmentType?: EmploymentType,
|   workStyle?: WorkStyle,
|
|   salaryType?: SalaryType,
|   salaryMin?: number,
|
|   japaneseLevel?: JapaneseLevel,
|
|   foreignerFriendly?: boolean,
|   visaSupport?: boolean,
|   beginnerFriendly?: boolean,
|   chineseAvailable?: boolean,
|
|   verified?: boolean,
|
|   sort?:
|     | "recommended"
|     | "latest"
|     | "salary-desc",
|
|   limit?: number
| }
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TODO [API - MODERATION]
|--------------------------------------------------------------------------
|
| 发布招聘时后端必须进行：
|
| 1. category / occupation 合法性检查
| 2. 分类与正文内容一致性检查
| 3. 重复招聘检测
| 4. 跨分类刷屏检测
| 5. 标题 / 正文 / 标签中的站外联系方式检测
| 6. 微信、VX、+V 等变形导流检测
| 7. 高风险招聘内容检测
| 8. 美容・按摩类别加强审核
| 9. 发布频率限制
| 10. 招聘主体 / 企业认证检查
|
| 前端检查只能改善体验。
| 最终安全判断必须由后端完成。
|
|--------------------------------------------------------------------------
*/