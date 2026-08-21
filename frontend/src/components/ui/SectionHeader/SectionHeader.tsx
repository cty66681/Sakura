import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface SectionHeaderProps {
  title: string;
  description?: string;

  href?: string;

  actionText?: string;

  badge?: string;
}

export default function SectionHeader({
  title,
  description,
  href,
  actionText,
  badge,
}: SectionHeaderProps) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

      {/* Left */}

      <div>

        {badge && (
          <div
            className="
              mb-4
              inline-flex
              items-center

              rounded-full

              bg-blue-50

              px-4
              py-2

              text-sm
              font-semibold

              text-blue-600
            "
          >
            {badge}
          </div>
        )}

        <h2
          className="
            text-4xl

            font-black

            tracking-tight

            text-slate-900
          "
        >
          {title}
        </h2>

        {description && (
          <p
            className="
              mt-3

              max-w-2xl

              text-lg

              leading-8

              text-slate-500
            "
          >
            {description}
          </p>
        )}

      </div>

      {/* Right */}

      {href && actionText && (
        <Link
          href={href}
          className="
            inline-flex

            items-center

            font-semibold

            text-blue-600

            transition

            hover:gap-3
          "
        >
          {actionText}

          <ArrowRight
            size={18}
            className="ml-2"
          />
        </Link>
      )}

    </div>
  );
}