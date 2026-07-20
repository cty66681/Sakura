import {Heart, MapPin } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Tag from '@/components/ui/Tag';
import Card from "@/components/ui/Card/Card";

export interface JobCardProps {
  company: string;
  title: string;
  location: string;
  salary: string;
  tags: string[];
  publishTime: string;
  verified?: boolean;
}

export default function JobCard({
  company,
  title,
  location,
  salary,
  tags,
  publishTime,
  verified,
}: JobCardProps) {
  return (
    <Card className="p-6">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          {/* Company Avatar */}

          <Avatar
                name={company}
                size="lg"
            />

          <div>

            <div className="flex items-center gap-2">

              <h3 className="font-semibold text-slate-800">

                {company}

              </h3>

              {verified && (
                <Badge variant="blue">
                    企业认证
                </Badge>
              )}

            </div>

            <p className="mt-1 text-sm text-slate-500">

              {publishTime}

            </p>

          </div>

        </div>

        <Heart
          size={20}
          className="cursor-pointer text-slate-400 transition hover:fill-red-500 hover:text-red-500"
        />

      </div>

      {/* Title */}

      <h2 className="mt-6 text-2xl font-bold text-slate-900">

        {title}

      </h2>

      {/* Salary */}

      <p className="mt-4 text-3xl font-bold text-blue-600">

        {salary}

      </p>

      {/* Location */}

      <div className="mt-4 flex items-center gap-2 text-slate-500">

        <MapPin size={18} />

        {location}

      </div>

      {/* Tags */}

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
        ))}
        </div>

    </Card>
  );
}