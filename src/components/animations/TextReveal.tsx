"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  once = true,
  as: Tag = "p",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const words = text.split(" ");

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <Tag className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={isInView ? { y: "0%", opacity: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: delay + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}&nbsp;
            </motion.span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
