import { ReactNode } from "react";

export interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

export default function FilterSection({
  title,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-slate-200 pb-6 last:border-none">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        {title}
      </h3>

      {children}
    </div>
  );
}