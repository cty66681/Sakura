import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";

export interface ExperienceCardProps {
  title: string;
  summary: string;
  author: string;
  publishTime: string;
  cover: string;
  tags: string[];
}

export default function ExperienceCard({
  title,
  summary,
  author,
  publishTime,
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

        <p className="mt-3 text-slate-500">
          {summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>
              {tag}
            </Tag>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-sm text-slate-400">
          <span>{author}</span>
          <span>{publishTime}</span>
        </div>

      </div>

    </Card>
  );
}