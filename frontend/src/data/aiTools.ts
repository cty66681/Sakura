import type { IconName } from "@/components/home/AiToolCard/AiToolCard";

export interface AiTool {
  id: number;
  title: string;
  description: string;
  icon: IconName;
  href: string;
  status: "available" | "coming";
}

export const aiTools: AiTool[] = [
  {
    id: 1,
    title: "AI 简历优化",
    description:
      "检查简历内容、表达方式和结构，帮助整理更适合日本求职的履历书与职务经历书。",
    icon: "FileText",
    href: "/ai-tools/resume",
    status: "coming",
  },

  {
    id: 2,
    title: "AI 工作推荐",
    description:
      "根据你的技术栈、工作经验、日语水平和希望条件，筛选更适合的工作方向。",
    icon: "Briefcase",
    href: "/ai-tools/jobs",
    status: "coming",
  },

  {
    id: 3,
    title: "AI 学校推荐",
    description:
      "根据学历、日语水平、EJU 成绩、预算和希望地区，帮助筛选适合申请的学校。",
    icon: "GraduationCap",
    href: "/ai-tools/school",
    status: "coming",
  },

  {
    id: 4,
    title: "AI 资料检查",
    description:
      "整理申请材料和需要准备的资料，帮助检查常见遗漏项目和准备顺序。",
    icon: "FileSearch",
    href: "/ai-tools/documents",
    status: "coming",
  },

  {
    id: 5,
    title: "AI 避坑助手",
    description:
      "输入你遇到的情况，结合 Sakura 的避坑信息，帮助发现值得注意的风险点。",
    icon: "ShieldAlert",
    href: "/ai-tools/scam-check",
    status: "coming",
  },

  {
    id: 6,
    title: "AI 日语助手",
    description:
      "帮助处理工作邮件、电话表达、敬语和日常日语，让在日本沟通更简单。",
    icon: "Languages",
    href: "/ai-tools/japanese",
    status: "coming",
  },
];

/*
|--------------------------------------------------------------------------
| TODO [API - GET]
|--------------------------------------------------------------------------
|
| AI 工具列表
|
| GET /api/ai-tools
|
| Response:
| {
|   tools: [...]
| }
|
|--------------------------------------------------------------------------
*/