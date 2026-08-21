"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SlideUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export default function SlideUp({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 40,
}: SlideUpProps) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        delay,
        duration,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}