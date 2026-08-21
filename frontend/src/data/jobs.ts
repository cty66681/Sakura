export interface Job {
  id: number;

  company: string;

  companyLogo: string;

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

    companyLogo: "https://picsum.photos/120?random=101",

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

    description: `负责 Java 后端系统开发。

参与 Spring Boot 微服务架构设计。

负责 AWS 云平台部署及维护。

与前端团队协作完成业务开发。`,

    contactName: "张先生",

    phone: "090-8888-9999",

    email: "hr@mercari.com",

    tags: [
      "Java",
      "Spring Boot",
      "AWS",
      "React",
    ],
  },

  {
    id: 2,

    company: "PayPay",

    companyLogo: "https://picsum.photos/120?random=102",

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

    description: `负责 React / Next.js 项目开发。

参与产品设计与组件开发。

优化网站性能与用户体验。

与后端共同完成接口联调。`,

    contactName: "李小姐",

    phone: "080-9999-6666",

    email: "career@paypay.ne.jp",

    tags: [
      "React",
      "TypeScript",
      "Next.js",
    ],
  },
];