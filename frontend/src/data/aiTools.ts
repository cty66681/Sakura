import type { IconName } from "@/components/home/AiToolCard/AiToolCard";

export const aiTools: {
  id: number;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    id: 1,
    title: "AI 简历优化",
    description: "上传简历，AI 帮你优化。",
    icon: "FileText",
  },
  {
    id: 2,
    title: "AI 工作推荐",
    description: "根据技能推荐工作。",
    icon: "Briefcase",
  },
];