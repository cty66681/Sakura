import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export interface FeedItem {
  id: number;

  type:
    | "job"
    | "house"
    | "experience"
    | "scam"
    | "news";

  title: string;

  summary: string;

  description: string;

  location?: string;

  publishTime: string;

  cover: string;
}

interface FeedCardProps {
  item: FeedItem;
}

const typeMap = {
  job: {
    text: "工作",
    variant: "blue" as const,
  },
  house: {
    text: "房源",
    variant: "green" as const,
  },
  experience: {
    text: "经验",
    variant: "yellow" as const,
  },
  scam: {
    text: "避坑",
    variant: "red" as const,
  },
  news: {
    text: "资讯",
    variant: "default" as const,
  },
};

export default function FeedCard({
  item,
}: FeedCardProps) {
  const current = typeMap[item.type];

  return (
    <Card className="p-6">

      <Badge variant={current.variant}>
        {current.text}
      </Badge>

      <h3 className="mt-4 text-xl font-semibold text-slate-900">
        {item.title}
      </h3>

      <p className="mt-2 text-slate-500">
        {item.summary}
      </p>

      {item.location && (
        <p className="mt-4 text-sm text-slate-400">
          📍 {item.location}
        </p>
      )}

      <div className="mt-6 flex justify-between text-sm text-slate-400">
        <span>{item.publishTime}</span>

        <span>阅读更多 →</span>
      </div>

    </Card>
  );
}