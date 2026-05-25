"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionMilestoneProps {
  children: ReactNode;
  index: number;
}

export function MotionMilestone({ children, index }: MotionMilestoneProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.05,
      }}
    >
      {children}
    </motion.div>
  );
}
