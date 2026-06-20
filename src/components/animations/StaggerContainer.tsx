"use client";
import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// ─── StaggerContainer ─────────────────────────────────────────────────────────
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

const containerVariants: Variants = {
  hidden: {},
  show:   (custom: { stagger: number; delay: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren:   custom.delay,
    },
  }),
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y:       0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function StaggerContainer({
  children,
  className = "",
  staggerDelay  = 0.1,
  delayChildren = 0,
}: StaggerContainerProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      custom={{ stagger: staggerDelay, delay: delayChildren }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className = "",
  delay     = 0,
  direction = "up",
  duration  = 0.7,
  once      = true,
}: FadeInProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  const initial = {
    opacity: 0,
    x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    y: direction === "up"   ?  40 : direction === "down"  ? -40 : 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ScaleIn ──────────────────────────────────────────────────────────────────
interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScaleIn({ children, className = "", delay = 0 }: ScaleInProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
