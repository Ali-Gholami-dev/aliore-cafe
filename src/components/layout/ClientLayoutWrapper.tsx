"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <LoadingScreen />}
      <ScrollProgressBar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
