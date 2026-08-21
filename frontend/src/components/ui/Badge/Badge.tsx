import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type Variant =
  | "default"
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "gray";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variants = {
  default:
    "bg-slate-100 text-slate-700",

  blue:
    "bg-blue-100 text-blue-700",

  green:
    "bg-emerald-100 text-emerald-700",

  red:
    "bg-red-100 text-red-700",

  yellow:
    "bg-amber-100 text-amber-700",

  gray:
    "bg-gray-100 text-gray-700",
};

export default function Badge({
  children,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}