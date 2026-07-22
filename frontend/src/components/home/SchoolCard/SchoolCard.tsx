import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { CalendarDays, GraduationCap, MapPin } from "lucide-react";

export interface SchoolCardProps {
  name: string;
  type: string;
  location: string;
  deadline: string;
  tags: string[];
}

export default function SchoolCard({
  name,
  type,
  location,
  deadline,
  tags,
}: SchoolCardProps) {
  return (
    <Card className="p-6 transition hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center gap-2">

        <GraduationCap
          size={22}
          className="text-blue-600"
        />

        <h3 className="text-xl font-semibold">
          {name}
        </h3>

      </div>

      <p className="mt-3 text-slate-500">
        {type}
      </p>

      <div className="mt-4 flex items-center gap-2 text-slate-500">

        <MapPin size={18} />

        {location}

      </div>

      <div className="mt-3 flex items-center gap-2 text-slate-500">

        <CalendarDays size={18} />

        截止：{deadline}

      </div>

      <div className="mt-6 flex flex-wrap gap-2">

        {tags.map((tag) => (
          <Tag key={tag}>
            {tag}
          </Tag>
        ))}

      </div>

      <Button
        className="mt-8 w-full"
      >
        查看详情
      </Button>

    </Card>
  );
}