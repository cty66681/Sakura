"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FloatProps {
  children: ReactNode;
  className?: string;

  /** 漂浮距离(px) */
  y?: number;

  /** 动画时长(秒) */
  duration?: number;

  /** 开始延迟 */
  delay?: number;
}

export default function Float({
  children,
  className,
  y = 12,
  duration = 4,
  delay = 0,
}: FloatProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -y, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}