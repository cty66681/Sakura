import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { ShieldAlert, TriangleAlert } from "lucide-react";

export interface ScamCardProps {
  title: string;
  summary: string;
  level: string;
  publishTime: string;
  tags: string[];
}

export default function ScamCard({
  title,
  summary,
  level,
  publishTime,
  tags,
}: ScamCardProps) {
  return (
    <Card className="p-6 transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <ShieldAlert
            size={22}
            className="text-red-600"
          />

          <h3 className="text-xl font-semibold">
            {title}
          </h3>

        </div>

        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
          {level}
        </span>

      </div>

      <p className="mt-5 text-slate-600">
        {summary}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag}>
            {tag}
          </Tag>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-slate-400">

        <TriangleAlert size={16} />

        {publishTime}

      </div>

      <Button
        className="mt-8 w-full"
      >
        查看详情
      </Button>

    </Card>
  );
}