import { ReactNode } from "react";

export interface SearchLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function SearchLayout({
  sidebar,
  children,
}: SearchLayoutProps) {
  return (
    <div
      className="
        mt-10

        grid

        gap-8

        lg:grid-cols-[280px_1fr]
      "
    >
      <aside
        className="
          relative
          z-10
          h-fit
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        {sidebar}
      </aside>

      <section
        className="
          min-h-[600px]
        "
      >
        {children}
      </section>
    </div>
  );
}