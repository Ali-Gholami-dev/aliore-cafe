"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;         // 0–1, how fast the parallax moves (0.3 is subtle)
  className?: string;
  direction?: "up" | "down";
}

export default function ParallaxSection({
  children,
  speed = 0.3,
  className = "",
  direction = "up",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const factor = direction === "up" ? -speed * 120 : speed * 120;
  const y = useTransform(scrollYProgress, [0, 1], [factor, -factor]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
