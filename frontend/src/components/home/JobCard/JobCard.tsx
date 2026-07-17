import Card from "../../../components/ui/Card/Card";

import { BadgeCheck, Heart, MapPin } from "lucide-react";

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

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">

            {company.charAt(0)}

          </div>

          <div>

            <div className="flex items-center gap-2">

              <h3 className="font-semibold text-slate-800">

                {company}

              </h3>

              {verified && (
                <BadgeCheck
                  size={18}
                  className="text-blue-600"
                />
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

          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
          >

            {tag}

          </span>

        ))}

      </div>

    </Card>
  );
}