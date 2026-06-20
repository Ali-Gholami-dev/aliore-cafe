"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MouseFollower() {
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 25, mass: 0.5 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const dotX = useSpring(rawX, { stiffness: 800, damping: 30 });
  const dotY = useSpring(rawY, { stiffness: 800, damping: 30 });

  useEffect(() => {
    // Hide on mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown  = () => setIsClicking(true);
    const onUp    = () => setIsClicking(false);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    // Detect hovered interactive elements
    const onHoverIn = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button"
      ) {
        setIsHovering(true);
      }
    };
    const onHoverOut = () => setIsHovering(false);

    document.addEventListener("mouseover", onHoverIn, { passive: true });
    document.addEventListener("mouseout", onHoverOut, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onHoverIn);
      document.removeEventListener("mouseout", onHoverOut);
    };
  }, [rawX, rawY]);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: x, y: y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: isHovering ? 2 : isClicking ? 0.8 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="rounded-full border border-white"
          style={{ width: 32, height: 32 }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: isClicking ? 2 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        <div
          className="rounded-full bg-white"
          style={{ width: 4, height: 4 }}
        />
      </motion.div>
    </>
  );
}
