import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import { MapPin } from "lucide-react";
import FavoriteButton from "@/components/ui/FavoriteButton";
import Link from "next/link";

export interface HouseCardProps {
  id: number;
  title: string;
  rent: string;
  layout: string;
  area: string;
  location: string;
  images: string[];
  tags: string[];
}

export default function HouseCard({
  id,
  title,
  rent,
  layout,
  area,
  location,
  images,
  tags,
}: HouseCardProps) {
  return (
    <Link
      href={`/houses/${id}`}
      className="block"
    >
      <Card className="overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">

        <img
          src={images[0]}
          alt={title}
          className="h-52 w-full object-cover"
        />

        <div className="p-6">

          <div className="flex items-start justify-between">

            <div>

              <h3 className="text-xl font-semibold text-slate-900">
                {title}
              </h3>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {rent}
              </p>

            </div>

            <FavoriteButton />

          </div>

          <p className="mt-4 text-slate-600">
            {layout} · {area}
          </p>

          <div className="mt-3 flex items-center gap-2 text-slate-500">

            <MapPin size={18} />

            {location}

          </div>

          <div className="mt-6 flex flex-wrap gap-2">

            {tags.map((tag) => (
              <Tag key={tag}>
                {tag}
              </Tag>
            ))}

          </div>

        </div>

      </Card>
    </Link>
  );
}