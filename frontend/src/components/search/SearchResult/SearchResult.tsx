
import { ReactNode } from "react";

export interface SearchResultProps {
  header?: ReactNode;
  children: ReactNode;
}

export default function SearchResult({
  header,
  children,
}: SearchResultProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {header && (
        <div className="border-b border-slate-200 p-6">
          {header}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}