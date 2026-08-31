export interface Job {
  id: number;

  company: string;
  companyLogo?: string;

  title: string;

  location: string;

  salary: string;

  verified?: boolean;

  publishTime: string;

  views: number;

  employmentType: "全职" | "兼职" | "实习";

  remote: "远程" | "混合" | "现场";

  experience: string;

  education: string;

  language: string;

  workingHours: string;

  holiday: string;

  benefits: string[];

  description: string;

  contactName: string;

  phone: string;

  email: string;

  favorite?: boolean;

  tags: string[];
}

export const jobs: Job[] = [
  {
    id: 1,

    company: "Mercari",

    title: "Java Backend Engineer",

    location: "东京 · 涩谷",

    salary: "¥700,000 ~ ¥900,000",

    verified: true,

    publishTime: "2026-08-05",

    views: 568,

    employmentType: "全职",

    remote: "混合",

    experience: "2年以上",

    education: "本科",

    language: "N2以上",

    workingHours: "09:00 ~ 18:00",

    holiday: "周末双休",

    benefits: [
      "交通费",
      "奖金",
      "年假",
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
      "高薪",
    ],
  },

  {
    id: 2,

    company: "PayPay",

    title: "Frontend Engineer",

    location: "东京 · 港区",

    salary: "¥650,000 ~ ¥850,000",

    verified: true,

    publishTime: "2026-08-04",

    views: 421,

    employmentType: "全职",

    remote: "混合",

    experience: "1年以上",

    education: "本科",

    language: "N2以上",

    workingHours: "10:00 ~ 19:00",

    holiday: "双休",

    benefits: [
      "交通费",
      "奖金",
      "社会保险",
      "年度体检",
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
      "高薪",
    ],
  },

  {
    id: 3,

    company: "Sakura Systems",

    title: "Python / AI Engineer",

    location: "东京 · 新宿",

    salary: "¥700,000 ~ ¥950,000",

    verified: true,

    publishTime: "2026-08-08",

    views: 386,

    employmentType: "全职",

    remote: "混合",

    experience: "3年以上",

    education: "本科",

    language: "N2以上",

    workingHours: "09:30 ~ 18:30",

    holiday: "周末双休",

    benefits: [
      "交通费",
      "远程办公",
      "社会保险",
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
      "正社員",
      "高薪",
    ],
  },

  {
    id: 4,

    company: "Tokyo Web Lab",

    title: "React Frontend Developer",

    location: "东京 · 池袋",

    salary: "¥550,000 ~ ¥700,000",

    verified: true,

    publishTime: "2026-08-07",

    views: 294,

    employmentType: "全职",

    remote: "现场",

    experience: "2年以上",

    education: "专门学校以上",

    language: "N2以上",

    workingHours: "10:00 ~ 19:00",

    holiday: "周末双休",

    benefits: [
      "交通费",
      "社会保险",
      "年假",
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
  },

  {
    id: 5,

    company: "Osaka Tech",

    title: "Backend Engineer",

    location: "大阪 · 梅田",

    salary: "¥500,000 ~ ¥650,000",

    verified: false,

    publishTime: "2026-08-06",

    views: 245,

    employmentType: "全职",

    remote: "混合",

    experience: "1年以上",

    education: "不限",

    language: "N2以上",

    workingHours: "09:00 ~ 18:00",

    holiday: "周末双休",

    benefits: [
      "交通费",
      "社会保险",
      "远程办公",
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
  },

  {
    id: 6,

    company: "Global Support Japan",

    title: "中文客服 / 运营支持",

    location: "东京 · 上野",

    salary: "¥280,000 ~ ¥350,000",

    verified: true,

    publishTime: "2026-08-03",

    views: 612,

    employmentType: "全职",

    remote: "现场",

    experience: "经验不限",

    education: "不限",

    language: "N2以上",

    workingHours: "09:00 ~ 18:00",

    holiday: "轮休",

    benefits: [
      "交通费",
      "社会保险",
      "带薪休假",
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
    ],
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
|   category?: string,
|   employmentType?: string,
|   region?: string,
|   salary?: string,
|   q?: string,
|   sort?: "latest" | "salary-desc"
| }
|
|--------------------------------------------------------------------------
*/