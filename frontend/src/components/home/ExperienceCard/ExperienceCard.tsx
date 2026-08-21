import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { Clock3, User } from "lucide-react";

export interface ExperienceCardProps {
  title: string;
  summary: string;
  author: string;
  publishTime: string;
  readTime: string;
  cover: string;
  tags: string[];
}

export default function ExperienceCard({
  title,
  summary,
  author,
  publishTime,
  readTime,
  cover,
  tags,
}: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">

      <img
        src={cover}
        alt={title}
        className="h-52 w-full object-cover"
      />

      <div className="p-6">

        <h3 className="text-xl font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-4 text-slate-500">
          {summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>
              {tag}
            </Tag>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">

          <div className="flex items-center gap-2">
            <User size={16} />
            {author}
          </div>

          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            {readTime}
          </div>

        </div>

        <p className="mt-3 text-xs text-slate-400">
          {publishTime}
        </p>

        <Button className="mt-6 w-full">
          阅读全文
        </Button>

      </div>

    </Card>
  );
}