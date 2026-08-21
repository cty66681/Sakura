import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Briefcase,
  FileSearch,
  FileText,
  GraduationCap,
  Languages,
  ShieldAlert,
} from "lucide-react";

export const icons = {
  FileText,
  Briefcase,
  GraduationCap,
  FileSearch,
  ShieldAlert,
  Languages,
};

export interface AiToolCardProps {
  title: string;
  description: string;
  icon: keyof typeof icons;
}

export type IconName = keyof typeof icons;

export default function AiToolCard({
  title,
  description,
  icon,
}: AiToolCardProps) {
  const Icon = icons[icon];

  return (
    <Card className="p-6 transition hover:-translate-y-1 hover:shadow-xl">

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

        <Icon
          size={30}
          className="text-blue-600"
        />

      </div>

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-4 text-slate-500">
        {description}
      </p>

      <Button className="mt-8 w-full">
        立即体验
      </Button>

    </Card>
  );
}