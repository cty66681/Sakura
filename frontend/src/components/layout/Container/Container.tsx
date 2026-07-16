import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1280px] px-5 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}