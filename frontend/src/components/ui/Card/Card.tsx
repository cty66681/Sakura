import {
  forwardRef,
  type HTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export interface CardProps
  extends HTMLAttributes<HTMLDivElement> {

  hoverable?: boolean;

  glass?: boolean;

  padding?: "none" | "sm" | "md" | "lg";

}

const paddingMap = {

  none: "",

  sm: "p-4",

  md: "p-6",

  lg: "p-8",

};

const Card = forwardRef<
  HTMLDivElement,
  CardProps
>(
  (
    {
      className,

      hoverable = true,

      glass = false,

      padding = "md",

      ...props
    },
    ref
  ) => {

    return (

      <div
        ref={ref}
        className={cn(

          `
          group

          relative

          overflow-hidden

          rounded-[28px]

          border

          transition-all

          duration-300
          `,

          glass
            ? `
            border-white/20

            bg-white/70

            backdrop-blur-xl

            shadow-xl
            `
            : `
            border-slate-200

            bg-white

            shadow-sm
            `,

          hoverable &&
            `
            hover:-translate-y-2

            hover:border-blue-200

            hover:shadow-2xl
            `,

          paddingMap[padding],

          className
        )}

        {...props}
      />

    );

  }
);

Card.displayName = "Card";

export default Card;