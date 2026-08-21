"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MotionItemProps {
  children: ReactNode;
  className?: string;
}

export default function MotionItem({
  children,
  className,
}: MotionItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: 40,
        },
        show: {
          opacity: 1,
          y: 0,
        },
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}