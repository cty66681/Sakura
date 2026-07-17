import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  href?: string;
  actionText?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  href,
  actionText = "查看更多",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 flex items-end justify-between gap-6",
        className
      )}
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="group flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          {actionText}

          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}