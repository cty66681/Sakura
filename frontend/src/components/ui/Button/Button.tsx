import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

const variantClass = {
  primary: `
    bg-blue-600
    text-white
    hover:bg-blue-700
    hover:-translate-y-1
    hover:shadow-xl
  `,

  secondary: `
    bg-slate-900
    text-white
    hover:bg-black
    hover:-translate-y-1
    hover:shadow-xl
  `,

  outline: `
    border
    border-slate-300
    bg-white
    text-slate-800
    hover:bg-slate-100
    hover:-translate-y-1
  `,

  ghost: `
    bg-transparent
    text-slate-700
    hover:bg-slate-100
  `,
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          `
          inline-flex
          items-center
          justify-center

          h-12
          px-6

          rounded-2xl

          text-sm
          font-semibold

          transition-all
          duration-300

          active:scale-95
          disabled:pointer-events-none
          disabled:opacity-50
          `,
          variantClass[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;