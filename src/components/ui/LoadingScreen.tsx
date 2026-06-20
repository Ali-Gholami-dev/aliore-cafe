"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 18;
      });
    }, 120);

    const timer = setTimeout(() => setVisible(false), 2200);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center"
        >
          {/* Animated logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <div className="font-display text-6xl font-light text-white tracking-[0.3em] mb-2">
              {"ALIORE".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-[10px] tracking-[0.6em] text-gold-500 uppercase font-sans font-medium"
            >
              CAFÉ
            </motion.div>
          </motion.div>

          {/* Gold particle ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 border border-gold-500/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-48 h-48 border border-gold-500/10 rounded-full"
          />

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-48 space-y-2"
          >
            <div className="h-px bg-neutral-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-700 via-gold-400 to-gold-700"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-sans text-neutral-600">
              <span>Loading experience</span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
